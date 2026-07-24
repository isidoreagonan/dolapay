import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/debug2")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        // Find the correct profile by matching the beginning of the UUID based on acc_48175d999f8465d
        // Note: 48175d999f8465d corresponds to 48175d99-9f84-65d... in UUID format.
        // We will fetch all profiles and find the one that matches.
        const { data: profiles, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("id, email");

        if (!profiles || profileError) {
          return Response.json({ success: false, error: "Profiles not found", details: profileError });
        }
        
        const correctProfileId = "1e1934d4-4216-4140-98cc-0510d80e8860"; // isidoreagonan@gmail.com

        // Update transactions to the correct UUID
        const { data: updated, error } = await supabaseAdmin
          .from("transactions")
          .update({ profile_id: correctProfileId })
          .eq("profile_id", "46179a95-999b-469d-915d-718bae54a844")
          .select("id");
          
        return Response.json({ 
          success: true, 
          restored_count: updated?.length,
          error
        });


      }
    }
  }
});
