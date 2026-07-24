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
          .select("id");

        if (!profiles || profileError) {
          return Response.json({ success: false, error: "Profiles not found", details: profileError });
        }
        
        const targetHex = "48175d999f8465d";
        const profile = profiles.find(p => p.id.replace(/-/g, "").startsWith(targetHex));

        if (!profile) {
          return Response.json({ success: false, error: "Profile not found matching target hex" });
        }

        const correctProfileId = profile.id; // This is a UUID

        // Update transactions from the misattributed UUID to the correct UUID
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
          correctProfileId,
          updated_uuid1: updated1?.length, 
          updated_uuid2: updated2?.length,
          error1,
          error2
        });
      }
    }
  }
});
