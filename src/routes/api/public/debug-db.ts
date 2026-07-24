import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug-db")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        const { data: txs } = await supabaseAdmin.from("transactions").select("*").order("created_at", { ascending: false }).limit(50);
        const { data: wrs } = await supabaseAdmin.from("withdrawals").select("*").order("created_at", { ascending: false }).limit(50);
        const { data: pb } = await supabaseAdmin.from("payout_batches").select("*").order("created_at", { ascending: false }).limit(50);
        const { data: pbi } = await supabaseAdmin.from("payout_batch_items").select("*").order("created_at", { ascending: false }).limit(50);
        
        return Response.json({ 
          txs: txs?.map(t => ({ id: t.id, amount: t.amount, description: t.description, status: t.status, created_at: t.created_at, table: "transactions" })),
          wrs: wrs?.map(t => ({ id: t.id, amount: t.amount, status: t.status, created_at: t.created_at, table: "withdrawals" })),
          pb: pb?.map(t => ({ id: t.id, amount: t.total_amount, status: t.status, created_at: t.created_at, table: "payout_batches" })),
          pbi: pbi?.map(t => ({ id: t.id, amount: t.amount, status: t.status, created_at: t.created_at, table: "payout_batch_items" }))
        });
      }
    }
  }
});
