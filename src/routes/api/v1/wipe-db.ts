import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/wipe-db")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          if (body.secret !== "CLEAN_DOLAPAY_NOW") {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          // Wipe transactions
          await (supabaseAdmin.from("transactions") as any).delete().neq("id", "dummy");
          
          // Wipe payout batches & items
          await (supabaseAdmin.from("payout_batch_items") as any).delete().neq("id", "dummy");
          await (supabaseAdmin.from("payout_batches") as any).delete().neq("id", "dummy");
          
          // Wipe withdrawal requests
          await (supabaseAdmin.from("withdrawal_requests") as any).delete().neq("id", "dummy");

          // Reset all wallets balances to 0
          await (supabaseAdmin.from("wallets") as any).update({ balance: 0 }).neq("id", "dummy");
          
          // Reset all profiles balances to 0
          await (supabaseAdmin.from("profiles") as any).update({ balance: 0, wallet_balance: 0 }).neq("id", "dummy");

          return Response.json({ success: true, message: "Database completely cleaned." });
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 500 });
        }
      },
    },
  },
});
