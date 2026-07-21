import { createFileRoute } from "@tanstack/react-router";
import {
  type LigdiCashWebhookPayload,
  calculateLigdiCashFee,
  type LigdiCashMethod,
  confirmLigdiCashPayin,
  confirmLigdiCashPayout,
} from "@/lib/ligdicash.server";

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
            .select("*")
            .eq("id", txId)
            .maybeSingle();

          if (tx && tx.status !== "success") {
            const tokenToVerify = tx.ligdicash_token || payload.token;
            let verifiedStatus = newStatus;

            if (tokenToVerify) {
              try {
                const confirmRes = await confirmLigdiCashPayin(tokenToVerify);
                const liveStatus = String(confirmRes.status || "").toLowerCase();
                const isVerifiedSuccess = liveStatus === "completed" || liveStatus === "success";
                verifiedStatus = isVerifiedSuccess ? "success" : "failed";
              } catch (e) {
                console.error("Webhook secure Payin verify failed, falling back to payload status:", e);
              }
            }

            const amount = Number(tx.amount || payload.amount || 0);
            const method = (String(customDataObj.method || "ORANGE").toUpperCase() as LigdiCashMethod);
            
            // Calcul officiel des commissions LigdiCash (Article 6.3 du Contrat)
            const feeCalc = calculateLigdiCashFee("PAYIN", method, amount);

            await supabaseAdmin
              .from("transactions")
              .update({
                status: verifiedStatus as "success" | "failed" | "pending",
              })
              .eq("id", txId);

            if (verifiedStatus === "success") {
              // Update merchant wallet balance
              if (tx.profile_id && Number(tx.amount) > 0) {
                try {
                  const amt = Number(tx.net_amount || tx.amount);
                  const { data: w } = await (supabaseAdmin.from("wallets") as any).select("balance").eq("profile_id", tx.profile_id).maybeSingle();
                  if (w) {
                    const currBal = Number(w.balance || 0);
                    await (supabaseAdmin.from("wallets") as any).update({ balance: currBal + amt, updated_at: new Date().toISOString() }).eq("profile_id", tx.profile_id);
                  }
                } catch (eWallet) {
                  console.error("[ligdicash-webhook] Error crediting merchant balance:", eWallet);
                }
              }

              try {
                const { notifyDepositSuccess } = await import("@/lib/email.server");
                await notifyDepositSuccess(supabaseAdmin, txId);
              } catch (eEmail) {
                console.warn("[ligdicash-webhook] Error sending payin email:", eEmail);
              }
            }

            if (verifiedStatus === "success" || verifiedStatus === "failed") {
              try {
                const { dispatchWebhook } = await import("@/lib/webhooks.server");
                await dispatchWebhook(supabaseAdmin, tx.profile_id, `transaction.${verifiedStatus}`, tx);
              } catch (eWebhook) {
                console.warn("[ligdicash-webhook] Error dispatching webhook:", eWebhook);
              }
            }

            return Response.json({ received: true, processed: "payin", status: verifiedStatus });
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
            let verifiedStatus: "success" | "failed" | "pending" | "processing" = newStatus;
            let verifiedError = isSuccess ? null : `LigdiCash: ${payload.status}`;

            if (item.id && payload.token) {
              try {
                const confirmRes = await confirmLigdiCashPayout(payload.token);
                const liveStatus = String(confirmRes.status || "").toLowerCase();
                const isVerifiedSuccess = liveStatus === "completed" || liveStatus === "success";
                verifiedStatus = isVerifiedSuccess ? "success" : "failed";
                verifiedError = isVerifiedSuccess ? null : `LigdiCash: ${confirmRes.status}`;
              } catch (e) {
                console.error("Webhook secure Payout verify failed, falling back to payload status:", e);
              }
            }

            await supabaseAdmin
              .from("payout_batch_items")
              .update({
                status: verifiedStatus,
                error: verifiedError,
              })
              .eq("id", itemId);

            try {
              const { notifyPayoutStatus } = await import("@/lib/email.server");
              await notifyPayoutStatus(supabaseAdmin, itemId, verifiedStatus as any, verifiedError || undefined);
            } catch (eEmail) {
              console.warn("[ligdicash-webhook] Error sending payout status email:", eEmail);
            }

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

                // Récupérer le propriétaire du lot et déclencher le recalcul du solde par sync-wallet
                const { data: batchData } = await supabaseAdmin
                  .from("payout_batches")
                  .select("owner_id")
                  .eq("id", item.batch_id)
                  .maybeSingle();
                if (batchData?.owner_id) {
                  fetch(new URL("/api/public/sync-wallet", request.url).toString(), {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: batchData.owner_id })
                  }).catch(() => {});
                }
              }

              // Mettre à jour également withdrawal_requests et transactions si l'ID correspond
              await (supabaseAdmin.from("withdrawal_requests") as any)
                .update({ status: verifiedStatus })
                .eq("id", itemId);
                
              await supabaseAdmin.from("transactions")
                .update({ status: verifiedStatus })
                .eq("id", itemId)
                .eq("type", "pay-out");

              if (verifiedStatus === "success" || verifiedStatus === "failed") {
                try {
                  const { data: txItem } = await supabaseAdmin.from("transactions").select("*").eq("id", itemId).maybeSingle();
                  if (txItem && txItem.profile_id) {
                    const { dispatchWebhook } = await import("@/lib/webhooks.server");
                    await dispatchWebhook(supabaseAdmin, txItem.profile_id, `payout.${verifiedStatus}`, txItem);
                  }
                } catch (eWebhook) {}
              }

              return Response.json({ received: true, processed: "payout", status: verifiedStatus });
          }
        }

        return Response.json({ received: true, ignored: true, timestamp: new Date().toISOString() });
      },
    },
  },
});
