import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/remove-test")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // The user specifically requested deleting the fake 2000 and 3000 F transactions
        const amountsToDelete = [2000, 3000];

        // 1. Delete from transactions
        const { data: txs } = await supabaseAdmin.from("transactions").delete().in("amount", amountsToDelete).select();
        
        // 2. Delete from withdrawals
        const { data: wrs } = await supabaseAdmin.from("withdrawals").delete().in("amount", amountsToDelete).select();

        // 3. Delete from payout_batch_items
        const { data: pbi } = await supabaseAdmin.from("payout_batch_items").delete().in("amount", amountsToDelete).select();

        // 4. Delete from payout_batches
        const { data: pb } = await supabaseAdmin.from("payout_batches").delete().in("total_amount", amountsToDelete).select();

        return Response.json({
          success: true,
          deleted_transactions: txs?.length || 0,
          deleted_withdrawals: wrs?.length || 0,
          deleted_payout_batch_items: pbi?.length || 0,
          deleted_payout_batches: pb?.length || 0
        });
      }
    }
  }
});
