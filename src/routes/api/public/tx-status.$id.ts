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
          .select("status, description")
          .eq("id", params.id)
          .maybeSingle();
        if (error) return Response.json({ error: "Server error" }, { status: 500 });
        if (!data) return Response.json({ error: "Not found" }, { status: 404 });

        if (data.status === "pending") {
          try {
            const { pawapay } = await import("@/lib/pawapay.server");
            const live = await pawapay.getDepositStatus(params.id);
            if (live && (live.status === "COMPLETED" || live.status === "FAILED")) {
              const newStatus = live.status === "COMPLETED" ? "success" : "failed";
              let extraDesc = "";
              let failureReasonObj: { code?: string; message?: string } | null = null;

              if (live.status === "FAILED") {
                const fCode = live.failureReason?.failureCode || "FAILED";
                const fMsg = live.failureReason?.failureMessage || "Paiement refusé par l'opérateur Mobile Money";
                extraDesc = ` · [Échec] ${fCode}: ${fMsg}`;
                failureReasonObj = { code: fCode, message: fMsg };
              }

              const newDesc = data.description ? data.description + extraDesc : extraDesc;

              await supabaseAdmin
                .from("transactions")
                .update({
                  status: newStatus,
                  description: newDesc,
                } as any)
                .eq("id", params.id);

              return Response.json(
                { status: newStatus, failure_reason: failureReasonObj },
                { headers: { "Cache-Control": "no-store" } },
              );
            }
          } catch (err) {
            console.error("[tx-status] Error checking live PawaPay status:", err);
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
