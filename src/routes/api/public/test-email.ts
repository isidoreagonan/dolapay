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

        if (url.searchParams.get("fix_payout")) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { notifyPayoutStatus } = await import("@/lib/email.server");
          
          // Chercher les retraits en attente/en cours ou d'un montant de 400
          const { data: pbi } = await supabaseAdmin.from("payout_batch_items").select("*").or("status.ilike.%pending%,status.ilike.%processing%,status.ilike.%cours%,amount.eq.400");
          const { data: wr } = await supabaseAdmin.from("withdrawal_requests").select("*").or("status.ilike.%pending%,status.ilike.%processing%,status.ilike.%cours%,amount.eq.400");
          const { data: txOut } = await supabaseAdmin.from("transactions").select("*").eq("type", "pay-out").or("status.ilike.%pending%,status.ilike.%processing%,status.ilike.%cours%,amount.eq.400");
          const { data: batches } = await supabaseAdmin.from("payout_batches").select("*").or("status.ilike.%pending%,status.ilike.%processing%,status.ilike.%cours%,total_amount.eq.400");

          let updated = 0;
          const emailsTriggered: any[] = [];

          if (pbi && pbi.length > 0) {
            for (const item of pbi) {
              await supabaseAdmin.from("payout_batch_items").update({ status: "success" }).eq("id", item.id);
              updated++;
              await notifyPayoutStatus(supabaseAdmin, item.id, "success");
              emailsTriggered.push({ table: "payout_batch_items", id: item.id });
            }
          }
          if (wr && wr.length > 0) {
            for (const item of wr) {
              await (supabaseAdmin.from("withdrawal_requests") as any).update({ status: "success" }).eq("id", item.id);
              updated++;
              await notifyPayoutStatus(supabaseAdmin, item.id, "success");
              emailsTriggered.push({ table: "withdrawal_requests", id: item.id });
            }
          }
          if (txOut && txOut.length > 0) {
            for (const item of txOut) {
              await (supabaseAdmin.from("transactions") as any).update({ status: "success" }).eq("id", item.id);
              updated++;
              await notifyPayoutStatus(supabaseAdmin, item.id, "success");
              emailsTriggered.push({ table: "transactions", id: item.id });
            }
          }
          if (batches && batches.length > 0) {
            for (const b of batches) {
              await (supabaseAdmin.from("payout_batches") as any).update({ status: "completed" }).eq("id", b.id);
              updated++;
            }
          }

          return Response.json({ success: true, updatedCount: updated, pbi, wr, txOut, batches, emailsTriggered });
        }

        const testDep = url.searchParams.get("test_deposit_email");
        if (testDep) {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: tx } = await supabaseAdmin.from("transactions").select("*").eq("id", testDep).maybeSingle();
          if (!tx) return Response.json({ error: "Tx introuvable", id: testDep });
          
          const profileId = tx.profile_id || tx.user_id || tx.merchant_id || tx.owner_id;
          const { data: prof } = await supabaseAdmin.from("profiles").select("*").eq("id", profileId).maybeSingle();
          
          let customerName = tx.customer_name || "Client";
          let customerEmail: string | undefined = tx.customer_email || tx.client_email || undefined;
          let linkTitle = "Paiement DolaPay";
          if (tx.description) {
            const parts = tx.description.split("·").map((p: string) => p.trim());
            if (parts[0]) linkTitle = parts[0].replace(/\[[^\]]+\]\s*/, "").replace(" [EMAIL_SENT]", "");
            if (parts[1]) {
              const nameMatch = parts[1].match(/^([^(]+)(?:\(([^)]+)\))?/);
              if (nameMatch) {
                if (!tx.customer_name) customerName = nameMatch[1].trim();
                if (!customerEmail && nameMatch[2] && nameMatch[2].includes("@")) customerEmail = nameMatch[2].trim();
              }
            }
          }

          const apiKey = process.env.RESEND_API_KEY || "re_dummy_key";
          const resend = new Resend(apiKey);
          const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "DolaPay <notification@dola-pay.com>";

          const resMerchant = prof?.email ? await resend.emails.send({
            from: FROM_EMAIL,
            to: [prof.email],
            subject: `💰 [Test] Nouveau paiement : ${tx.amount} ${tx.currency}`,
            html: `<p>Test Email Marchand pour ${prof.email} - Paiement ${tx.amount} ${tx.currency} de ${customerName}</p>`,
          }) : null;

          const resCustomer = customerEmail ? await resend.emails.send({
            from: FROM_EMAIL,
            to: [customerEmail],
            subject: `✅ [Test] Reçu de paiement : ${linkTitle}`,
            html: `<p>Test Email Client pour ${customerEmail} - Vous avez payé ${tx.amount} ${tx.currency} chez ${prof?.company_name || prof?.full_name}</p>`,
          }) : null;

          return Response.json({
            transaction: { id: tx.id, amount: tx.amount, description: tx.description },
            extracted: { merchantEmail: prof?.email, customerName, customerEmail, linkTitle, FROM_EMAIL, apiKeyPrefix: apiKey.slice(0, 7) },
            resMerchant,
            resCustomer,
          });
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
