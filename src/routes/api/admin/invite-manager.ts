import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendManagerInviteEmail } from "@/lib/email.server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: "L'e-mail est requis" }, { status: 400 });
    }

    // 1. Generate an invite link using Supabase Admin
    // Using `generateLink` creates the user account in auth.users behind the scenes if it doesn't exist
    // and returns the invite link (ActionLink) instead of sending the default Supabase email.
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: email,
    });

    if (linkError) {
      console.error("[Invite] generateLink error:", linkError);
      return Response.json({ error: linkError.message }, { status: 500 });
    }

    const inviteLink = linkData.properties.action_link;
    const userId = linkData.user.id;

    // 2. The trigger `handle_new_user()` will eventually create the profile.
    // We update the profile to set the role to 'manager'.
    // If the trigger hasn't finished yet, we can do an upsert.
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email: email,
      role: "manager",
    }, { onConflict: "id" });

    if (profileError) {
      console.error("[Invite] profile update error:", profileError);
      // We don't block the email if profile update fails immediately, it might be the trigger race condition,
      // but ideally this upsert handles it.
    }

    // 3. Send our beautiful custom email via Resend
    const emailRes = await sendManagerInviteEmail(email, inviteLink);
    if (!emailRes.success) {
      console.error("[Invite] email send error:", emailRes.error);
      return Response.json({ error: "L'invitation a été générée, mais l'envoi de l'e-mail a échoué." }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error: any) {
    console.error("[Invite] Fatal:", error);
    return Response.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}
