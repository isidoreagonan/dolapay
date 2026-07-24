import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/wipe-db")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        try {
          // 1. Delete all transactions
          const res1 = await supabaseAdmin.from("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
          
          // 2. Delete all payment links
          const res2 = await supabaseAdmin.from("payment_links").delete().neq("id", "00000000-0000-0000-0000-000000000000");
          
          // 3. Delete all withdrawal requests
          const res3 = await supabaseAdmin.from("withdrawal_requests").delete().neq("id", "00000000-0000-0000-0000-000000000000");

          // 4. Delete payout batch items
          const res4 = await supabaseAdmin.from("payout_batch_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");

          // 5. Delete payout batches
          const res5 = await supabaseAdmin.from("payout_batches").delete().neq("id", "00000000-0000-0000-0000-000000000000");

          // 6. Reset all wallets to 0
          const res6 = await supabaseAdmin.from("wallets").update({ balance: 0 }).neq("id", "00000000-0000-0000-0000-000000000000");

          return Response.json({
            success: true,
            message: "Database wiped successfully",
            transactions: res1.error || "OK",
            payment_links: res2.error || "OK",
            withdrawal_requests: res3.error || "OK",
            payout_batch_items: res4.error || "OK",
            payout_batches: res5.error || "OK",
            wallets: res6.error || "OK"
          });
        } catch (e: any) {
          return Response.json({ success: false, error: e.message });
        }
      }
    }
  }
});
