import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug-db")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        const { data: txs } = await supabaseAdmin.from("transactions").select("*").in("amount", [2000, 3000, 300]);
        const { data: wrs } = await supabaseAdmin.from("withdrawals").select("*").in("amount", [2000, 3000, 300]);
        const { data: pb } = await supabaseAdmin.from("payout_batches").select("*").in("total_amount", [2000, 3000, 300]);
        const { data: pbi } = await supabaseAdmin.from("payout_batch_items").select("*").in("amount", [2000, 3000, 300]);
        
        return Response.json({ 
          txs: txs?.map(t => ({ id: t.id, amount: t.amount, table: "transactions" })),
          wrs: wrs?.map(t => ({ id: t.id, amount: t.amount, table: "withdrawals" })),
          pb: pb?.map(t => ({ id: t.id, amount: t.total_amount, table: "payout_batches" })),
          pbi: pbi?.map(t => ({ id: t.id, amount: t.amount, table: "payout_batch_items" }))
        });
      }
    }
  }
});
