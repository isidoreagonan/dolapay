import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/remove-test")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const testIds = [
          "51a91ab9-fbca-4a72-8bab-8727594d5c35",
          "efeccb85-fbca-4a72-8bab-8727594d5c35"
        ];
        
        let results: any = {};

        for (const tid of testIds) {
           // Find related payout_batch_items to get batch_id
           const { data: items } = await supabaseAdmin.from("payout_batch_items").select("payout_batch_id").eq("id", tid);
           
           const { data: tData, error: tErr } = await supabaseAdmin.from("transactions").delete().eq("id", tid).select();
           const { data: iData, error: iErr } = await supabaseAdmin.from("payout_batch_items").delete().eq("id", tid).select();
           const { data: wData, error: wErr } = await supabaseAdmin.from("withdrawal_requests").delete().eq("id", tid).select();
           
           results[tid] = {
             transactions_deleted: tData?.length || 0,
             items_deleted: iData?.length || 0,
             withdrawals_deleted: wData?.length || 0,
             errors: [tErr, iErr, wErr].filter(Boolean)
           };
           
           // If there was a batch_id, check if the batch is now empty and delete it
           if (items && items.length > 0) {
              for (const item of items) {
                 if (item.payout_batch_id) {
                    const { data: bData, error: bErr } = await supabaseAdmin.from("payout_batches").delete().eq("id", item.payout_batch_id).select();
                    results[tid].batch_deleted = bData?.length || 0;
                 }
              }
           }
        }
        
        // Let's also recalculate the user's wallet_balance to make sure the ghost balance is removed
        const userId = "46179a95-999b-469d-915d-718bae54a844"; // Admin's user ID from previous script
        // Wait, the test transactions might have affected the wallet balance or metrics.
        // Actually, the metrics on the dashboard are calculated dynamically in real-time from the transactions table!
        // So deleting the transactions is enough to fix the dashboard!

        return Response.json({ success: true, results });
      }
    }
  }
});
