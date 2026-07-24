import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug-db")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        const { data: txs } = await supabaseAdmin.from("transactions").select("*").order("created_at", { ascending: false }).limit(200);
        const { data: wrs } = await supabaseAdmin.from("withdrawal_requests").select("*").order("created_at", { ascending: false }).limit(200);
        const { data: oldWrs } = await supabaseAdmin.from("withdrawals").select("*").order("created_at", { ascending: false }).limit(200);
        
        return Response.json({
          transactions: txs?.filter(t => t.amount == 200 || t.amount == 2000).map(t => ({ id: t.id, amount: t.amount, type: t.type, status: t.status, date: t.created_at, desc: t.description })),
          withdrawal_requests: wrs?.filter(t => t.amount == 200 || t.amount == 2000).map(t => ({ id: t.id, amount: t.amount, status: t.status, date: t.created_at })),
          withdrawals: oldWrs?.filter(t => t.amount == 200 || t.amount == 2000).map(t => ({ id: t.id, amount: t.amount, status: t.status, date: t.created_at }))
        });
      }
    }
  }
});
