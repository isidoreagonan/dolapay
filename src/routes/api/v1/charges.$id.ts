import { createFileRoute } from "@tanstack/react-router";
import { authenticateMerchant } from "./auth.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/v1/charges/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const auth = await authenticateMerchant(request);
        if (auth instanceof Response) return auth;

        if (auth.is_test && auth.profile_id === "00000000-0000-0000-0000-000000000000") {
          return Response.json({
            id: params.id,
            status: "succeeded",
            amount: 5000,
            currency: "XOF",
            settled_at: new Date().toISOString(),
          });
        }

        const { data: tx, error } = await supabaseAdmin
          .from("transactions")
          .select("id, status, amount, currency, created_at, payment_method")
          .eq("id", params.id)
          .eq("profile_id", auth.profile_id)
          .maybeSingle();

        if (error || !tx) {
          return Response.json({ error: { code: "not_found", message: "Charge introuvable." } }, { status: 404 });
        }

        const mappedStatus = tx.status === "success" ? "succeeded" : tx.status;

        return Response.json({
          id: tx.id,
          status: mappedStatus,
          amount: Number(tx.amount),
          currency: tx.currency,
          operator: tx.payment_method?.toLowerCase() || "orange_bfa",
          settled_at: tx.status === "success" ? tx.created_at : null,
        });
      },
    },
  },
});
