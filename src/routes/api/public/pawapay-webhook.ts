import { createFileRoute } from "@tanstack/react-router";
import type { PawaPayWebhookPayload } from "@/lib/pawapay.server";
import crypto from "node:crypto";

export const Route = createFileRoute("/api/public/pawapay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let rawBody: string;
        let payload: PawaPayWebhookPayload;
        try {
          rawBody = await request.text();
          payload = JSON.parse(rawBody);
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        // Vérification de signature HMAC PawaPay (si configurée en variable d'environnement)
        const secret = process.env.PAWAPAY_WEBHOOK_SECRET;
        if (secret) {
          const sigHeader = request.headers.get("x-pawapay-signature") || request.headers.get("x-signature");
          if (!sigHeader) {
            console.warn("[PawaPay Webhook] Rejeté: En-tête de signature manquant.");
            return Response.json({ error: "Signature manquante" }, { status: 401 });
          }
          const expectedSig = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
          if (sigHeader.toLowerCase() !== expectedSig.toLowerCase()) {
            console.warn("[PawaPay Webhook] Rejeté: Signature invalide.");
            return Response.json({ error: "Signature invalide" }, { status: 403 });
          }
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // 1. Traitement des Encaissements (Deposits)
        if (payload.depositId) {
          const newStatus = payload.status === "COMPLETED" ? "success" : "failed";
          
          // Récupérer la transaction existante pour recalculer net/frais si nécessaire
          const { data: tx } = await supabaseAdmin
            .from("transactions")
            .select("id, amount, profile_id, status, description")
            .eq("id", payload.depositId)
            .maybeSingle();

          if (tx && tx.status !== "success") {
            const failureCode = payload.failureReason?.failureCode || "";
            const failureMessage = payload.failureReason?.failureMessage || "";
            const extraDesc = failureCode 
              ? ` · [Échec] ${failureCode}: ${failureMessage}`
              : "";

            await supabaseAdmin
              .from("transactions")
              .update({
                status: newStatus,
                description: tx.description ? tx.description + extraDesc : extraDesc,
              } as any)
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
              error: payload.failureReason?.failureMessage || null,
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
                .update({ status: allSuccess ? "completed" : "failed" })
                .eq("id", item.batch_id);
            }
          }
        }

        return Response.json({ received: true, timestamp: new Date().toISOString() });
      },
    },
  },
});
