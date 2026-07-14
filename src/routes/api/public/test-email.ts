import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";

export const Route = createFileRoute("/api/public/test-email")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const toEmail = url.searchParams.get("email");

        if (!toEmail || !toEmail.includes("@")) {
          return Response.json(
            {
              error: "Paramètre ?email= introuvable ou invalide. Usage : /api/public/test-email?email=votre@email.com",
            },
            { status: 400 }
          );
        }

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey || apiKey === "re_dummy_key") {
          return Response.json(
            {
              success: false,
              reason: "RESEND_API_KEY non configurée sur Vercel. Veuillez ajouter RESEND_API_KEY dans les variables d'environnement Vercel et REDÉPLOYER l'application.",
              envChecked: {
                hasApiKey: !!apiKey,
                keyPrefix: apiKey ? apiKey.slice(0, 5) + "..." : "null",
              },
            },
            { status: 500 }
          );
        }

        const resend = new Resend(apiKey);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "DolaPay <notification@dola-pay.com>";

        try {
          const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [toEmail],
            subject: "🚀 Test de notification DolaPay (Resend)",
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px;">
                <h2 style="color: #0f172a;">🎉 Félicitations !</h2>
                <p style="color: #334155;">Votre configuration Resend sur le domaine <strong>dola-pay.com</strong> fonctionne parfaitement en direct.</p>
                <div style="background: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 13px; color: #475569;">
                  <strong>Expéditeur :</strong> ${fromEmail}<br/>
                  <strong>Destinataire :</strong> ${toEmail}<br/>
                  <strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}
                </div>
              </div>
            `,
          });

          if (error) {
            return Response.json(
              {
                success: false,
                resendError: error,
                fromEmailUsed: fromEmail,
              },
              { status: 400 }
            );
          }

          return Response.json({
            success: true,
            message: `Email de test envoyé avec succès à ${toEmail} !`,
            resendId: data?.id,
            fromEmailUsed: fromEmail,
          });
        } catch (err: any) {
          return Response.json(
            {
              success: false,
              exception: err?.message || String(err),
              fromEmailUsed: fromEmail,
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
