import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/fix-isidore")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: profile } = await supabaseAdmin.from("profiles").select("id").ilike("id", "427b848e%").maybeSingle();
        if (profile) {
           const { data: txs } = await supabaseAdmin.from("transactions").select("net_amount, amount").eq("profile_id", profile.id).eq("status", "success");
           let net = 0;
           txs?.forEach(t => { net += Number(t.net_amount || t.amount); });
           await (supabaseAdmin.from("wallets") as any).update({ balance: net, updated_at: new Date().toISOString() }).eq("profile_id", profile.id);
           await (supabaseAdmin.from("profiles") as any).update({ balance: net, wallet_balance: net }).eq("id", profile.id);
           return Response.json({ success: true, net, profileId: profile.id });
        }
        return Response.json({ success: false, error: "not found" });
      }
    }
  }
});
