import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug-db")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        const { data: txs } = await supabaseAdmin
          .from("transactions")
          .select("id, amount, status, type, created_at, description")
          .order("created_at", { ascending: false })
          .limit(50);
          
        return Response.json({ transactions: txs });
      }
    }
  }
});
