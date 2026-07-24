import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug2")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        // The correct profile ID is dolapoecom1@gmail.com
        const correctProfileId = "46179a95-999b-469d-915d-718bae54a844";

        const { data: updated, error } = await supabaseAdmin
          .from("transactions")
          .update({ profile_id: correctProfileId })
          .eq("profile_id", "1e1934d4-4216-4140-98cc-0510d80e8860")
          .select("id");
        
        return Response.json({ success: true, updated_count: updated?.length, error });
      }
    }
  }
});
