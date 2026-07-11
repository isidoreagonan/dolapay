import { createFileRoute } from "@tanstack/react-router";
import { type LigdiCashWebhookPayload, calculateLigdiCashFee, type LigdiCashMethod } from "@/lib/ligdicash.server";

export const Route = createFileRoute("/api/public/ligdicash-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: LigdiCashWebhookPayload;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const statusLower = String(payload.status || "").toLowerCase();
        const isSuccess = statusLower === "completed" || statusLower === "success";
        const newStatus = isSuccess ? "success" : "failed";

        // Récupération de l'identifiant de transaction DolaPay
        let txId = payload.transaction_id || payload.order_id;
        let customDataObj: Record<string, any> = {};

        if (typeof payload.custom_data === "string") {
          try {
            customDataObj = JSON.parse(payload.custom_data);
          } catch (_) {}
        } else if (payload.custom_data && typeof payload.custom_data === "object") {
          customDataObj = payload.custom_data;
        }

        if (!txId && customDataObj.transaction_id) {
          txId = customDataObj.transaction_id;
        }

        // 1. Traitement des Encaissements (Payin / Transactions)
        if (txId) {
          const { data: tx } = await supabaseAdmin
            .from("transactions")
            .select("id, amount, profile_id, status, type, description")
            .eq("id", txId)
            .maybeSingle();

          if (tx && tx.status !== "success") {
            const amount = Number(tx.amount || payload.amount || 0);
            const method = (String(customDataObj.method || "ORANGE").toUpperCase() as LigdiCashMethod);
            
            // Calcul officiel des commissions LigdiCash (Article 6.3 du Contrat)
            const feeCalc = calculateLigdiCashFee("PAYIN", method, amount);

            await supabaseAdmin
              .from("transactions")
              .update({
                status: newStatus,
              })
              .eq("id", txId);

            return Response.json({ received: true, processed: "payin", status: newStatus });
          }
        }

        // 2. Traitement des Décaissements en masse (Payout Batch Items)
        if (customDataObj.payout_item_id || txId) {
          const itemId = customDataObj.payout_item_id || txId;
          const { data: item } = await supabaseAdmin
            .from("payout_batch_items")
            .select("id, batch_id, status, amount")
            .eq("id", itemId)
            .maybeSingle();

          if (item && item.status !== "success") {
            await supabaseAdmin
              .from("payout_batch_items")
              .update({
                status: newStatus,
                error: isSuccess ? null : `LigdiCash: ${payload.status}`,
              })
              .eq("id", itemId);

            // Vérification de la complétion du lot (batch)
            if (item.batch_id) {
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

            return Response.json({ received: true, processed: "payout", status: newStatus });
          }
        }

        return Response.json({ received: true, ignored: true, timestamp: new Date().toISOString() });
      },
    },
  },
});
