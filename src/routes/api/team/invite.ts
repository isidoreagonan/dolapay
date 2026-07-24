import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendTeamInvitationEmail } from "@/lib/email.server";

export const Route = createFileRoute("/api/team/invite")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Authenticate via Supabase JWT
          const authHeader = request.headers.get("authorization");
          if (!authHeader) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }

          const token = authHeader.replace("Bearer ", "");
          const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
          
          if (authError || !user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }

          const body = await request.json();
          const { email, role } = body;

          if (!email) {
            return Response.json({ error: "Email required" }, { status: 400 });
          }

          // Fetch inviter's profile to get their business name BEFORE inserting
          // to make sure it doesn't fail
          const { data: profile } = await supabaseAdmin.from("profiles").select("business_name").eq("id", user.id).single();
          const inviterName = profile?.business_name || user.email || "Une entreprise";

          // Insert into team_members using admin (bypass RLS because it's simpler on the server, 
          // but we already authenticated the owner)
          const { error: insertError } = await supabaseAdmin.from("team_members").insert({
            owner_id: user.id,
            email: email.trim().toLowerCase(),
            role: role || 'viewer',
            status: "pending",
          });

          if (insertError) {
             // If unique constraint violation
            if (insertError.code === '23505') {
               return Response.json({ error: "Ce membre a déjà été invité." }, { status: 400 });
            }
            console.error("DB Insert Error:", insertError);
            return Response.json({ error: "Erreur lors de la création de l'invitation." }, { status: 500 });
          }

          // Send Email
          const emailSent = await sendTeamInvitationEmail({
            inviteeEmail: email.trim().toLowerCase(),
            inviterName,
            role: role || 'viewer'
          });

          return Response.json({ success: true, emailSent });
        } catch (error) {
          console.error("Invite API Error:", error);
          return Response.json({ error: "Internal Server Error" }, { status: 500 });
        }
      },
    },
  },
});
