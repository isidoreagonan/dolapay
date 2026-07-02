import { createFileRoute } from "@tanstack/react-router";
import type { PawaPayWebhookPayload } from "@/lib/pawapay.server";

export const Route = createFileRoute("/api/public/pawapay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: PawaPayWebhookPayload;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // 1. Traitement des Encaissements (Deposits)
        if (payload.depositId) {
          const newStatus = payload.status === "COMPLETED" ? "success" : "failed";
          
          // Récupérer la transaction existante pour recalculer net/frais si nécessaire
          const { data: tx } = await supabaseAdmin
            .from("transactions")
            .select("id, amount, profile_id, status")
            .eq("id", payload.depositId)
            .maybeSingle();

          if (tx && tx.status !== "success") {
            const amount = Number(tx.amount || payload.amount || 0);
            // Calcul des frais DolaPay (2% standard)
            const feeAmount = Math.round(amount * 0.02);
            const netAmount = amount - feeAmount;

            await supabaseAdmin
              .from("transactions")
              .update({
                status: newStatus,
                fee_amount: feeAmount,
                net_amount: netAmount,
              })
              .eq("id", payload.depositId);
          }
        }

        // 2. Traitement des Décaissements (Payouts)
        if (payload.payoutId) {
          const newStatus = payload.status === "COMPLETED" ? "success" : "failed";

          await supabaseAdmin
            .from("payout_batch_items")
            .update({
              status: newStatus,
              error_message: payload.failureReason?.failureMessage || null,
            })
            .eq("id", payload.payoutId);

          // Optionnel : vérifier si tout le lot (batch) est terminé
          const { data: item } = await supabaseAdmin
            .from("payout_batch_items")
            .select("batch_id")
            .eq("id", payload.payoutId)
            .maybeSingle();

          if (item?.batch_id) {
            const { data: items } = await supabaseAdmin
              .from("payout_batch_items")
              .select("status")
              .eq("batch_id", item.batch_id);

            if (items && items.every((i) => i.status === "success" || i.status === "failed")) {
              const allSuccess = items.every((i) => i.status === "success");
              await supabaseAdmin
                .from("payout_batches")
                .update({ status: allSuccess ? "completed" : "completed_with_errors" })
                .eq("id", item.batch_id);
            }
          }
        }

        return Response.json({ received: true, timestamp: new Date().toISOString() });
      },
    },
  },
});
