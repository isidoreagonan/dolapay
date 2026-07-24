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
        
        const mappedProfiles = profiles.map(p => ({
          email: p.email,
          accId: `acc_${p.id.replace(/-/g, "").slice(0, 16)}`,
          fullId: p.id
        }));

        return Response.json({ success: true, profiles: mappedProfiles });


      }
    }
  }
});
