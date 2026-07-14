import { createFileRoute } from "@tanstack/react-router";
import type { PawaPayWebhookPayload } from "@/lib/pawapay.server";
import crypto from "node:crypto";

export const Route = createFileRoute("/api/public/pawapay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          let rawBody: string;
          let payload: PawaPayWebhookPayload;
          try {
            rawBody = await request.text();
            payload = JSON.parse(rawBody);
          } catch {
            return Response.json({ error: "Invalid JSON" }, { status: 400 });
          }

          console.log("[PawaPay Webhook] Received payload:", JSON.stringify(payload, null, 2));

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

          // Normalize payload to an array of events
          const events = Array.isArray(payload) ? payload : [payload];

          for (const event of events) {
            console.log("[PawaPay Webhook] Processing event:", JSON.stringify(event, null, 2));

            // 1. Traitement des Encaissements (Deposits)
            if (event.depositId) {
              const stRaw = String(event.status || "").toUpperCase();
              let newStatus: "success" | "failed" | "processing" | null = null;
              if (stRaw === "COMPLETED" || stRaw === "SUCCESS" || stRaw === "PAID") {
                newStatus = "success";
              } else if (stRaw === "FAILED" || stRaw === "REJECTED" || stRaw === "CANCELLED") {
                newStatus = "failed";
              } else if (stRaw === "ACCEPTED" || stRaw === "SUBMITTED" || stRaw === "PENDING") {
                newStatus = "processing";
              }

              if (!newStatus) continue;
              
              // Récupérer la transaction existante pour recalculer net/frais si nécessaire
              const { data: tx, error: getErr } = await supabaseAdmin
                .from("transactions")
                .select("*")
                .eq("id", event.depositId)
                .maybeSingle();

              if (getErr) {
                console.error("[PawaPay Webhook] DB error fetching transaction:", getErr);
                continue;
              }

              if (tx && tx.status !== "success") {
                const failureCode = event.failureReason?.failureCode || "";
                const failureMessage = event.failureReason?.failureMessage || "";
                const extraDesc = failureCode 
                  ? ` · [Échec] ${failureCode}: ${failureMessage}`
                  : "";

                const { error: updErr } = await supabaseAdmin
                  .from("transactions")
                  .update({
                    status: newStatus,
                    description: (newStatus === "failed" && failureCode)
                      ? (tx.description ? tx.description + extraDesc : extraDesc)
                      : tx.description,
                  } as any)
                  .eq("id", event.depositId);

                if (updErr) {
                  console.error("[PawaPay Webhook] DB error updating transaction:", updErr);
                  continue;
                }

                if (newStatus === "success" && tx.profile_id && Number(tx.amount) > 0) {
                  try {
                    const amt = Number(tx.amount);
                    const { data: w } = await (supabaseAdmin.from("wallets") as any).select("balance").eq("profile_id", tx.profile_id).maybeSingle();
                    if (w && typeof w.balance === "number") {
                      await (supabaseAdmin.from("wallets") as any).update({ balance: w.balance + amt, updated_at: new Date().toISOString() }).eq("profile_id", tx.profile_id);
                    }
                    const { data: prof } = await (supabaseAdmin.from("profiles") as any).select("balance, wallet_balance").eq("id", tx.profile_id).maybeSingle();
                    if (prof) {
                      const currBal = Number(prof.balance || prof.wallet_balance || 0);
                      await (supabaseAdmin.from("profiles") as any).update({ balance: currBal + amt, wallet_balance: currBal + amt }).eq("id", tx.profile_id);
                    }
                  } catch (e) {
                    console.error("[PawaPay Webhook] Error crediting merchant balance:", e);
                  }
                }

                if (newStatus === "success") {
                  try {
                    const { notifyDepositSuccess } = await import("@/lib/email.server");
                    await notifyDepositSuccess(supabaseAdmin, event.depositId);
                  } catch (e) {
                    console.error("[PawaPay Webhook] Error notifying deposit email:", e);
                  }
                }

                console.log(`[PawaPay Webhook] Transaction ${event.depositId} updated to ${newStatus}`);
              }
            }

            // 2. Traitement des Décaissements (Payouts)
            if (event.payoutId || (event as any).id) {
              const pid = event.payoutId || (event as any).id;
              const stRaw = String(event.status || "").toUpperCase();
              let newStatus: "success" | "failed" | "processing" | null = null;
              if (stRaw === "COMPLETED" || stRaw === "SUCCESS" || stRaw === "PAID") {
                newStatus = "success";
              } else if (stRaw === "FAILED" || stRaw === "REJECTED" || stRaw === "CANCELLED") {
                newStatus = "failed";
              } else if (stRaw === "ACCEPTED" || stRaw === "SUBMITTED" || stRaw === "PENDING") {
                newStatus = "processing";
              }

              if (!newStatus) continue;

              await (supabaseAdmin.from("payout_batch_items") as any)
                .update({ status: newStatus, error: (newStatus === "failed" ? event.failureReason?.failureMessage : null) })
                .eq("id", pid)
                .catch((e: any) => console.error("Error upd payout_batch_items:", e));

              await (supabaseAdmin.from("withdrawal_requests") as any)
                .update({ status: newStatus })
                .eq("id", pid)
                .catch(() => {});

              await (supabaseAdmin.from("transactions") as any)
                .update({ status: newStatus })
                .eq("id", pid)
                .catch(() => {});

              try {
                const { notifyPayoutStatus, notifyWithdrawalRequestStatus } = await import("@/lib/email.server");
                await notifyPayoutStatus(supabaseAdmin, pid, newStatus, event.failureReason?.failureMessage);
                await notifyWithdrawalRequestStatus(supabaseAdmin, pid, newStatus, event.failureReason?.failureMessage);
              } catch (e) {
                console.error("[PawaPay Webhook] Error notifying payout email:", e);
              }

              // Optionnel : vérifier si tout le lot (batch) est terminé
              const { data: item } = await supabaseAdmin
                .from("payout_batch_items")
                .select("batch_id")
                .eq("id", event.payoutId)
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

                // Récupérer le propriétaire et déclencher un sync de solde
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
            }
          }

          return Response.json({ received: true, timestamp: new Date().toISOString() });
        } catch (err: any) {
          console.error("[PawaPay Webhook] CRITICAL ERROR:", err);
          return Response.json({ error: err.message || String(err) }, { status: 500 });
        }
      },
    },
  },
});
