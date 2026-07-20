import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/wipe2")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          if (body.secret !== "CLEAN_DOLAPAY_NOW") return Response.json({ error: "Unauthorized" }, { status: 401 });

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          const deleteTable = async (table: string) => {
            const { data, error: selectErr } = await (supabaseAdmin.from(table) as any).select("id").limit(10000);
            if (selectErr) throw new Error(`Select err on ${table}: ${selectErr.message}`);
            
            if (data && data.length > 0) {
              const ids = data.map((d: any) => d.id);
              // Delete in chunks of 1000 to avoid request URL length limits
              for (let i = 0; i < ids.length; i += 1000) {
                const chunk = ids.slice(i, i + 1000);
                const { error: delErr } = await (supabaseAdmin.from(table) as any).delete().in("id", chunk);
                if (delErr) throw new Error(`Delete err on ${table}: ${delErr.message}`);
              }
            }
          };

          await deleteTable("transactions");
          await deleteTable("payout_batch_items");
          await deleteTable("payout_batches");
          await deleteTable("withdrawal_requests");
          
          const { error: e5 } = await (supabaseAdmin.from("wallets") as any).update({ balance: 0 }).not("id", "is", null);
          if (e5) throw new Error("Wallets: " + e5.message);

          const { error: e6 } = await (supabaseAdmin.from("profiles") as any).update({ balance: 0, wallet_balance: 0 }).not("id", "is", null);
          if (e6) throw new Error("Profiles: " + e6.message);

          return Response.json({ success: true, message: "Database completely cleaned." });
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 500 });
        }
      },
    },
  },
});
