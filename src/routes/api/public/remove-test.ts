import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/remove-test")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const testIds = [
          "efeccb85-ff45-4750-a899-17c75c2f6938"
        ];
        
        let results: any = {};

        for (const tid of testIds) {
           await supabaseAdmin.from("transactions").delete().eq("id", tid);
           await supabaseAdmin.from("payout_batch_items").delete().eq("id", tid);
           await supabaseAdmin.from("withdrawals").delete().eq("id", tid); // Changed from withdrawal_requests to avoid cache errors if it was renamed
           
           results[tid] = "deleted";
        }

        return Response.json({ success: true, results });
      }
    }
  }
});
