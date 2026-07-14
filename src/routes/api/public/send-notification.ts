import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  sendWelcomeEmail,
  sendKycApprovedEmail,
  sendKycRejectedEmail,
} from "@/lib/email.server";

export const Route = createFileRoute("/api/public/send-notification")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const { type, profileId, reason, tierName } = body;
          let email = body.email;
          let name = body.name;

          if (profileId && (!email || !name)) {
            const { data: prof } = await supabaseAdmin
              .from("profiles")
              .select("email, full_name, company_name")
              .eq("id", profileId)
              .maybeSingle();

            if (prof) {
              email = email || prof.email;
              name = name || prof.company_name || prof.full_name || "Marchand DolaPay";
            }
          }

          if (!email || !email.includes("@")) {
            return Response.json({ error: "Adresse email invalide ou introuvable." }, { status: 400 });
          }

          let sent = false;
          if (type === "welcome") {
            sent = await sendWelcomeEmail({ userEmail: email, userName: name || "Bienvenue" });
          } else if (type === "kyc_approved") {
            sent = await sendKycApprovedEmail({ userEmail: email, userName: name || "Marchand", tierName });
          } else if (type === "kyc_rejected") {
            sent = await sendKycRejectedEmail({ userEmail: email, userName: name || "Marchand", reason });
          } else {
            return Response.json({ error: `Type de notification "${type}" non supporté.` }, { status: 400 });
          }

          return Response.json({ success: true, sent });
        } catch (err: any) {
          console.error("[send-notification API] Error:", err);
          return Response.json({ error: err?.message || "Erreur interne" }, { status: 500 });
        }
      },
    },
  },
});
