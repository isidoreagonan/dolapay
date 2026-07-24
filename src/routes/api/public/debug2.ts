import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug2")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        const { data: profiles } = await supabaseAdmin.from("profiles").select("id, email");
        const { data: txs } = await supabaseAdmin.from("transactions").select("id, profile_id, merchant_id").limit(100);
        
        return Response.json({ profiles, txs });
      }
    }
  }
});
