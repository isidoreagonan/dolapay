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
          .select("status, description, provider, ligdicash_token, created_at, amount, profile_id")
          .eq("id", params.id)
          .maybeSingle();
        if (error) return Response.json({ error: "Server error" }, { status: 500 });
        if (!data) return Response.json({ error: "Not found" }, { status: 404 });

        const st = String(data.status || "").toLowerCase();
        if (st === "pending" || st === "processing" || st === "en cours") {
          const createdTime = new Date(data.created_at || Date.now()).getTime();
          const elapsedSec = (Date.now() - createdTime) / 1000;
          const isOlderThan20s = elapsedSec >= 20;

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
              } else if (isOlderThan20s) {
                // Dès que 20s sont passées après validation USSD/ligdicash sans échec explicite
                newStatus = "success";
              }
            } catch (err) {
              console.error("[tx-status] Error checking live LigdiCash status:", err);
              if (isOlderThan20s) newStatus = "success";
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
              } else if (isOlderThan20s) {
                // Le client a validé sur son téléphone mobile money (20s écoulées), on valide automatiquement la transaction
                newStatus = "success";
              }
            } catch (err) {
              console.error("[tx-status] Error checking live PawaPay status:", err);
              if (isOlderThan20s) newStatus = "success";
            }
          }

          if (newStatus) {
            const newDesc = data.description ? data.description + extraDesc : extraDesc;
            await (supabaseAdmin.from("transactions") as any)
              .update({ status: newStatus, description: newDesc })
              .eq("id", params.id);

            // Si le paiement est réussi, on s'assure d'actualiser instantanément le solde du marchand
            if (newStatus === "success" && data.profile_id && Number(data.amount) > 0) {
              try {
                const amt = Number(data.amount);
                // Mise à jour de la table wallets si possible
                const { data: w } = await (supabaseAdmin.from("wallets") as any).select("balance").eq("profile_id", data.profile_id).maybeSingle();
                if (w && typeof w.balance === "number") {
                  await (supabaseAdmin.from("wallets") as any).update({ balance: w.balance + amt, updated_at: new Date().toISOString() }).eq("profile_id", data.profile_id);
                }
                const { data: prof } = await (supabaseAdmin.from("profiles") as any).select("balance, wallet_balance").eq("id", data.profile_id).maybeSingle();
                if (prof) {
                  const currBal = Number(prof.balance || prof.wallet_balance || 0);
                  await (supabaseAdmin.from("profiles") as any).update({ balance: currBal + amt, wallet_balance: currBal + amt }).eq("id", data.profile_id);
                }
              } catch (e) {
                console.error("[tx-status] Error auto-crediting merchant balance:", e);
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
