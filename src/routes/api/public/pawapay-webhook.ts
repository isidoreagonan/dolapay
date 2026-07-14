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
              const newStatus = event.status === "COMPLETED" ? "success" : "failed";
              
              // Récupérer la transaction existante pour recalculer net/frais si nécessaire
              const { data: tx, error: getErr } = await supabaseAdmin
                .from("transactions")
                .select("id, amount, profile_id, status, description")
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
                    description: tx.description ? tx.description + extraDesc : extraDesc,
                  } as any)
                  .eq("id", event.depositId);

                if (updErr) {
                  console.error("[PawaPay Webhook] DB error updating transaction:", updErr);
                  continue;
                }
                console.log(`[PawaPay Webhook] Transaction ${event.depositId} updated to ${newStatus}`);
              }
            }

            // 2. Traitement des Décaissements (Payouts)
            if (event.payoutId || (event as any).id) {
              const pid = event.payoutId || (event as any).id;
              const newStatus = event.status === "COMPLETED" || event.status === "SUCCESS" || event.status === "ACCEPTED" ? "success" : "failed";

              await (supabaseAdmin.from("payout_batch_items") as any)
                .update({ status: newStatus, error: event.failureReason?.failureMessage || null })
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
