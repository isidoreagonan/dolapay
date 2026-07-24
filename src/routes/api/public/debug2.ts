import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug2")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        // The correct workspace/profile ID expected by the frontend
        const correctProfileId = "acc_48175d999f8465d";

        // Update transactions from the misattributed UUID to the correct workspace ID
        const { data: updated1, error: error1 } = await supabaseAdmin
          .from("transactions")
          .update({ profile_id: correctProfileId })
          .eq("profile_id", "46179a95-999b-469d-915d-718bae54a844")
          .select("id");
          
        const { data: updated2, error: error2 } = await supabaseAdmin
          .from("transactions")
          .update({ profile_id: correctProfileId })
          .eq("profile_id", "1e1934d4-4216-4140-98cc-0510d80e8860")
          .select("id");

        return Response.json({ 
          success: true, 
          updated_uuid1: updated1?.length, 
          updated_uuid2: updated2?.length,
          error1,
          error2
        });
      }
    }
  }
});
