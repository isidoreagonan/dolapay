import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";

export const Route = createFileRoute("/api/public/test-email")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const checkTx = url.searchParams.get("check_tx");
        if (checkTx) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { pawapay } = await import("@/lib/pawapay.server");
          const { data: txs } = await supabaseAdmin
            .from("transactions")
            .select("id, amount, status, provider, description, created_at, type, payment_method, customer_phone")
            .order("created_at", { ascending: false })
            .limit(10);
          
          const liveStatuses: any = {};
          if (txs && txs.length > 0) {
            for (const t of txs.slice(0, 3)) {
              if (t.type === "payment_link" || t.provider === "pawapay" || t.payment_method === "pawapay" || t.status === "pending" || t.status === "processing") {
                try {
                  const liveDep = await pawapay.getDepositStatus(t.id);
                  liveStatuses[t.id] = { type: "deposit", result: liveDep };
                } catch (e: any) {
                  liveStatuses[t.id] = { type: "deposit", error: e.message || String(e) };
                }
              }
            }
          }
          return Response.json({ transactions: txs, liveStatuses });
        }

        const checkPayout = url.searchParams.get("check_payout");
        if (checkPayout) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: batch } = await supabaseAdmin.from("payout_batches").select("*").eq("id", checkPayout).maybeSingle();
          const { data: items } = await supabaseAdmin.from("payout_batch_items").select("*").eq("batch_id", checkPayout);
          let item = items && items[0];
          if (!item) {
            const { data: itemSingle } = await supabaseAdmin.from("payout_batch_items").select("*").eq("id", checkPayout).maybeSingle();
            item = itemSingle;
          }
          let prof: any = null;
          let batchIdToUse = batch?.id || item?.batch_id;
          let ownerIdToUse = batch?.owner_id || batch?.profile_id;
          if (batchIdToUse && !ownerIdToUse) {
            const { data: b2 } = await supabaseAdmin.from("payout_batches").select("*").eq("id", batchIdToUse).maybeSingle();
            ownerIdToUse = b2?.owner_id || b2?.profile_id;
          }
          if (ownerIdToUse) {
            const { data: p } = await supabaseAdmin.from("profiles").select("*").eq("id", ownerIdToUse).maybeSingle();
            prof = p;
          }
          let emailSent = false;
          let emailErr = null;
          try {
            const { notifyPayoutStatus } = await import("@/lib/email.server");
            await notifyPayoutStatus(supabaseAdmin, item?.id || checkPayout, "pending");
            emailSent = true;
          } catch (errEmail: any) {
            emailErr = errEmail?.message || String(errEmail);
          }
          return Response.json({
            checkPayoutId: checkPayout,
            batchFound: batch,
            itemFound: item,
            profileFound: prof ? { id: prof.id, email: prof.email, company: prof.company_name } : null,
            emailSent,
            emailErr,
          });
        }

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

        const type = url.searchParams.get("type") || "general";
        try {
          if (type === "payout") {
            const { sendPayoutNotificationEmail } = await import("@/lib/email.server");
            const sent = await sendPayoutNotificationEmail({
              merchantEmail: toEmail,
              merchantName: "Marchand Test",
              amount: 15000,
              currency: "XOF",
              recipientPhone: "+2290157385885",
              provider: "MTN Bénin",
              status: "success",
              payoutId: "TEST-PAYOUT-001",
            });
            return Response.json({ success: sent, type: "payout", email: toEmail });
          }

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
