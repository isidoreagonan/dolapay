import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/fix-all-wallets")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: profiles } = await supabaseAdmin.from("profiles").select("id");
        if (profiles) {
           for (const profile of profiles) {
               const { data: txs } = await supabaseAdmin.from("transactions").select("net_amount, amount, type").eq("profile_id", profile.id).eq("status", "success");
               let net = 0;
               txs?.forEach(t => { 
                   const amt = Number(t.net_amount || t.amount);
                   if (t.type === "pay-out") {
                       net -= amt;
                   } else {
                       net += amt;
                   }
               });
               await (supabaseAdmin.from("wallets") as any).update({ balance: net, updated_at: new Date().toISOString() }).eq("profile_id", profile.id);
               await (supabaseAdmin.from("profiles") as any).update({ balance: net, wallet_balance: net }).eq("id", profile.id);
           }
           return Response.json({ success: true, count: profiles.length });
        }
        return Response.json({ success: false });
      }
    }
  }
});
