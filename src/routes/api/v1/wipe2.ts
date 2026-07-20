import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/wipe2")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          if (body.secret !== "CLEAN_DOLAPAY_NOW") return Response.json({ error: "Unauthorized" }, { status: 401 });

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const results: string[] = [];

          const deleteTable = async (table: string) => {
            try {
              const { data, error: selectErr } = await (supabaseAdmin.from(table) as any).select("id").limit(10000);
              if (selectErr) {
                results.push(`Skipped ${table}: ` + selectErr.message);
                return;
              }
              
              let deleted = 0;
              if (data && data.length > 0) {
                const ids = data.map((d: any) => d.id);
                for (let i = 0; i < ids.length; i += 1000) {
                  const chunk = ids.slice(i, i + 1000);
                  const { error: delErr } = await (supabaseAdmin.from(table) as any).delete().in("id", chunk);
                  if (delErr) throw new Error(`Delete err on ${table}: ${delErr.message}`);
                  deleted += chunk.length;
                }
              }
              results.push(`Deleted ${deleted} rows from ${table}`);
            } catch (e: any) {
              results.push(`Error on ${table}: ` + e.message);
            }
          };

          await deleteTable("transactions");
          await deleteTable("payout_batch_items");
          await deleteTable("payout_batches");
          await deleteTable("withdrawal_requests");
          
          try {
            const { error: e5 } = await (supabaseAdmin.from("wallets") as any).update({ balance: 0 }).not("id", "is", null);
            results.push(e5 ? "Wallets Update Error: " + e5.message : "Wallets reset to 0");
          } catch(e: any) { results.push("Wallets Exception: " + e.message); }

          try {
            const { error: e6 } = await (supabaseAdmin.from("profiles") as any).update({ balance: 0, wallet_balance: 0 }).not("id", "is", null);
            results.push(e6 ? "Profiles Update Error: " + e6.message : "Profiles reset to 0");
          } catch(e: any) { results.push("Profiles Exception: " + e.message); }

          return Response.json({ success: true, results });
        } catch (e: any) {
          return Response.json({ error: e.message }, { status: 500 });
        }
      },
    },
  },
});
