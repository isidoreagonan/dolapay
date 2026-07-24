import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug-db")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const targetId = "51a91ab9-fbca-4a72-8bab-8727594d5c35";
        
        const txs = await supabaseAdmin.from("transactions").select("*").eq("id", targetId);
        const wrs = await supabaseAdmin.from("withdrawal_requests").select("*").eq("id", targetId);
        const oldWrs = await supabaseAdmin.from("withdrawals").select("*").eq("id", targetId);
        const pb = await supabaseAdmin.from("payout_batches").select("*").eq("id", targetId);
        const pbi = await supabaseAdmin.from("payout_batch_items").select("*").eq("id", targetId);
        
        return Response.json({
          transactions: txs.data,
          withdrawal_requests: wrs.data,
          withdrawals: oldWrs.data,
          payout_batches: pb.data,
          payout_batch_items: pbi.data
        });
      }
    }
  }
});
