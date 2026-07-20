import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/restore-admin")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        const { data: profiles } = await supabaseAdmin.from("profiles").select("id").eq("email", "isidoreagonan@gmail.com");
        if (!profiles || profiles.length === 0) return Response.json({ error: "no profile" });
        
        const userId = profiles[0].id;
        
        await supabaseAdmin.from("user_roles").upsert({ user_id: userId, role: "admin" }, { onConflict: 'user_id' });
        
        const { data: txs } = await supabaseAdmin.from("transactions").select("id, amount, net_amount").eq("profile_id", userId).eq("amount", 200);
        if (txs) {
           for (const tx of txs) {
               if (!tx.net_amount || tx.net_amount === tx.amount) {
                   await supabaseAdmin.from("transactions").update({ net_amount: 196, dola_margin: 4 }).eq("id", tx.id);
               }
           }
        }
        
        const { data: allTxs } = await supabaseAdmin.from("transactions").select("net_amount, amount, type").eq("profile_id", userId).eq("status", "success");
        let net = 0;
        allTxs?.forEach(t => { 
            const amt = Number(t.net_amount || t.amount);
            if (t.type === "pay-out") {
                net -= amt;
            } else {
                net += amt;
            }
        });
        await (supabaseAdmin.from("wallets") as any).update({ balance: net, updated_at: new Date().toISOString() }).eq("profile_id", userId);
        await (supabaseAdmin.from("profiles") as any).update({ balance: net, wallet_balance: net }).eq("id", userId);
        
        return Response.json({ success: true, net, restoredAdmin: true });
      }
    }
  }
});
