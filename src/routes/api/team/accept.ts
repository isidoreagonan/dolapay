import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/team/accept")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authHeader = request.headers.get("authorization");
          if (!authHeader) return Response.json({ error: "Unauthorized" }, { status: 401 });

          const token = authHeader.replace("Bearer ", "");
          const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
          
          if (authError || !user || !user.email) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
          }

          const body = await request.json();
          const { invitationId } = body;

          if (!invitationId) return Response.json({ error: "ID d'invitation requis" }, { status: 400 });

          // Verify the invitation belongs to this user
          const { data: invite, error: fetchError } = await supabaseAdmin
            .from("team_members")
            .select("*")
            .eq("id", invitationId)
            .single();

          if (fetchError || !invite) {
            return Response.json({ error: "Invitation introuvable" }, { status: 404 });
          }

          if (invite.email !== user.email) {
            return Response.json({ error: "Cette invitation ne vous est pas destinée." }, { status: 403 });
          }

          if (invite.status !== "pending") {
            return Response.json({ error: "Cette invitation n'est plus valide ou a déjà été acceptée." }, { status: 400 });
          }

          // Update status to active
          const { error: updateError } = await supabaseAdmin
            .from("team_members")
            .update({ status: "active" })
            .eq("id", invitationId);

          if (updateError) {
            console.error("Failed to accept invite:", updateError);
            return Response.json({ error: "Erreur lors de l'acceptation." }, { status: 500 });
          }

          return Response.json({ success: true });
        } catch (error) {
          console.error("Accept API Error:", error);
          return Response.json({ error: "Internal Server Error" }, { status: 500 });
        }
      },
    },
  },
});
