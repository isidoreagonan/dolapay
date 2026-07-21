import { createFileRoute } from "@tanstack/react-router";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute("/api/public/tx-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!UUID_RE.test(params.id)) {
          return Response.json({ error: "Invalid id" }, { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("transactions")
          .select("*")
          .eq("id", params.id)
          .maybeSingle();
        if (error) {
          console.error("[tx-status] DB Error fetching tx:", error);
          return Response.json({ error: error.message || "Server error", code: error.code }, { status: 500 });
        }
        if (!data) return Response.json({ error: "Not found" }, { status: 404 });

        const st = String(data.status || "").toLowerCase();
        if (st === "pending" || st === "processing" || st === "en cours") {
          const createdTime = new Date(data.created_at || Date.now()).getTime();
          const elapsedSec = (Date.now() - createdTime) / 1000;

          let newStatus: "success" | "failed" | null = null;
          let extraDesc = "";
          let failureReasonObj: { code?: string; message?: string } | null = null;

          if (data.provider === "ligdicash" && data.ligdicash_token) {
            try {
              const { confirmLigdiCashPayin } = await import("@/lib/ligdicash.server");
              const live = await confirmLigdiCashPayin(data.ligdicash_token);
              const liveStatus = String(live.status || "").toLowerCase();
              if (liveStatus === "completed" || liveStatus === "success" || liveStatus === "ok" || liveStatus === "paid") {
                newStatus = "success";
              } else if (liveStatus === "notcompleted" || liveStatus === "failed" || liveStatus === "error" || liveStatus === "rejected") {
                newStatus = "failed";
                const fCode = live.response_code || "FAILED";
                const fMsg = live.response_text || "Paiement refusé par l'opérateur";
                extraDesc = ` · [Échec] ${fCode}: ${fMsg}`;
                failureReasonObj = { code: fCode, message: fMsg };
              } else if (elapsedSec >= 300) {
                newStatus = "failed";
                extraDesc = " · [Échec] TIMEOUT: Délai d'expiration du paiement dépassé";
                failureReasonObj = { code: "TIMEOUT", message: "Le paiement a expiré sans confirmation de l'opérateur." };
              }
            } catch (err) {
              console.error("[tx-status] Error checking live LigdiCash status:", err);
              if (elapsedSec >= 300) {
                newStatus = "failed";
                extraDesc = " · [Échec] TIMEOUT: Délai d'expiration du paiement dépassé";
              }
            }
          } else {
            // PawaPay (USSD Mobile Money : MTN, Orange, Moov, Wave...)
            try {
              const { pawapay } = await import("@/lib/pawapay.server");
              const live = await pawapay.getDepositStatus(params.id);
              if (live && (live.status === "COMPLETED" || (live as any).status === "SUCCESS" || (live as any).status === "PAID")) {
                newStatus = "success";
              } else if (live && (live.status === "FAILED" || (live as any).status === "REJECTED")) {
                newStatus = "failed";
                const fCode = live.failureReason?.failureCode || "FAILED";
                const fMsg = live.failureReason?.failureMessage || "Paiement refusé par l'opérateur Mobile Money";
                extraDesc = ` · [Échec] ${fCode}: ${fMsg}`;
                failureReasonObj = { code: fCode, message: fMsg };
              } else if (elapsedSec >= 300) {
                newStatus = "failed";
                extraDesc = " · [Échec] TIMEOUT: Délai d'expiration du paiement dépassé";
                failureReasonObj = { code: "TIMEOUT", message: "Le paiement a expiré sans confirmation de l'opérateur." };
              }
            } catch (err) {
              console.error("[tx-status] Error checking live PawaPay status:", err);
              if (elapsedSec >= 300) {
                newStatus = "failed";
                extraDesc = " · [Échec] TIMEOUT: Délai d'expiration du paiement dépassé";
              }
            }
          }

          if (newStatus) {
            const newDesc = data.description ? data.description + extraDesc : extraDesc;
            await (supabaseAdmin.from("transactions") as any)
              .update({ status: newStatus, description: newDesc })
              .eq("id", params.id);

            // Si le paiement est réussi, on s'assure d'actualiser instantanément le solde du marchand
            if (newStatus === "success") {
              if (data.profile_id && Number(data.amount) > 0) {
                try {
                  const amt = Number(data.amount);
                  // Mise à jour de la table wallets si possible
                  const { data: w } = await (supabaseAdmin.from("wallets") as any).select("balance").eq("profile_id", data.profile_id).maybeSingle();
                  if (w) {
                    const currBal = Number(w.balance || 0);
                    await (supabaseAdmin.from("wallets") as any).update({ balance: currBal + amt, updated_at: new Date().toISOString() }).eq("profile_id", data.profile_id);
                  }
                } catch (e) {
                  console.error("[tx-status] Error auto-crediting merchant balance:", e);
                }
              }

              try {
                const { notifyDepositSuccess } = await import("@/lib/email.server");
                await notifyDepositSuccess(supabaseAdmin, params.id);
              } catch (e) {
                console.error("[tx-status] Error notifying deposit success:", e);
              }
            }

            return Response.json(
              { status: newStatus, failure_reason: failureReasonObj },
              { headers: { "Cache-Control": "no-store" } },
            );
          }
        }

        let failureReason = null;
        if (data.description && data.description.includes("[Échec]")) {
          const match = data.description.match(/\[Échec\]\s*([^:]+):?\s*(.*)/);
          if (match) {
            failureReason = {
              code: match[1]?.trim(),
              message: match[2]?.trim(),
            };
          }
        }

        return Response.json(
          { status: data.status, failure_reason: failureReason },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
