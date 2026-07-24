import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY || "re_dummy_key";
const resend = new Resend(apiKey);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "DolaPay <notification@dola-pay.com>";

/**
 * Base HTML Template wrapper with DolaPay Brand Design
 */
function getBaseEmailHtml(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="UTF-8">
    <meta content="width=device-width, initial-scale=1" name="viewport">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="telephone=no" name="format-detection">
    <title>${title}</title>
    <!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]-->
    <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
    <!--[if gte mso 9]>
<noscript>
         <xml>
           <o:OfficeDocumentSettings>
           <o:AllowPNG></o:AllowPNG>
           <o:PixelsPerInch>96</o:PixelsPerInch>
           </o:OfficeDocumentSettings>
         </xml>
      </noscript>
<![endif]-->
    <!--[if mso]><xml>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
    <!--[if !mso]><!-- -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter&display=swap">
    <!--<![endif]-->
    <style type="text/css">
      body { font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #0f172a; }
      .es-wrapper-color { background-color: #f8fafc; }
      .es-header-body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); border-radius: 20px 20px 0 0; }
      .es-content-body { background-color: #ffffff; padding: 40px; border-radius: 0 0 20px 20px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
      .es-footer-body { background-color: transparent; padding-top: 20px; }
      .h1 { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; margin-top: 0; }
      .text { font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
      .card-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin: 25px 0; }
      .btn { display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); }
      .btn-container { text-align: center; margin: 35px 0 20px 0; }
      .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
      .row-label { color: #64748b; font-weight: 500; }
      .row-value { color: #0f172a; font-weight: 700; text-align: right; }
      .amount-box { text-align: center; padding: 20px 10px; background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border: 1px solid #dbeafe; border-radius: 16px; margin-bottom: 25px; }
      .amount-label { font-size: 12px; font-weight: 600; color: #3b82f6; text-transform: uppercase; }
      .amount-value { font-size: 32px; font-weight: 800; color: #1e3a8a; margin-top: 4px; }
      @media only screen and (max-width: 600px) {
        .es-content-body { padding: 20px !important; }
        .es-header-body { padding: 25px 20px !important; }
        .h1 { font-size: 20px !important; }
      }
    </style>
  </head>
  <body class="body">
    <div dir="ltr" class="es-wrapper-color">
      <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#f8fafc"></v:fill>
			</v:background>
		<![endif]-->
      <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" style="padding: 40px 20px;">
        <tbody>
          <tr>
            <td valign="top" class="esd-email-paddings">
              <table cellspacing="0" cellpadding="0" align="center" class="es-header">
                <tbody>
                  <tr>
                    <td align="center">
                      <table width="600" cellspacing="0" cellpadding="0" align="center" class="es-header-body">
                        <tbody>
                          <tr>
                            <td align="center" style="padding: 35px 40px;">
                               <h1 style="color: #ffffff; font-size: 26px; font-weight: 800; margin: 0; font-family: 'Inter', Arial, sans-serif;">DolaPay</h1>
                               <div style="display: inline-block; margin-top: 8px; background-color: rgba(255, 255, 255, 0.15); color: #e0e7ff; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase;">Infrastructure de Paiement</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table align="center" cellspacing="0" cellpadding="0" class="es-content">
                <tbody>
                  <tr>
                    <td align="center">
                      <table cellspacing="0" align="center" width="600" cellpadding="0" class="es-content-body">
                        <tbody>
                          <tr>
                            <td align="left" style="padding: 0;">
                              ${contentHtml}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table cellspacing="0" cellpadding="0" align="center" class="es-footer">
                <tbody>
                  <tr>
                    <td align="center">
                      <table cellspacing="0" cellpadding="0" align="center" width="600" class="es-footer-body">
                        <tbody>
                          <tr>
                            <td align="center" style="padding: 25px 40px;">
                               <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0; font-family: 'Inter', Arial, sans-serif;">
                                 <strong>DolaPay</strong> · L'infrastructure financière nouvelle génération en Afrique de l'Ouest.
                               </p>
                               <p style="font-size: 12px; color: #64748b; margin: 0; font-family: 'Inter', Arial, sans-serif;">
                                 Vous recevez cet email car vous avez un compte ou une transaction sur <a href="https://dola-pay.com" style="color: #2563eb; font-weight: 600; text-decoration: none;">dola-pay.com</a>.
                               </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
  `.trim();
}

/**
 * Send raw email helper via Resend
 */
async function sendRawEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
  if (!to || !to.includes("@")) {
    console.warn(`[email.server] Invalid recipient address: ${to}`);
    return false;
  }
  const currentApiKey = process.env.RESEND_API_KEY;
  if (!currentApiKey || currentApiKey === "re_dummy_key") {
    console.warn(`[email.server] RESEND_API_KEY non défini ou factice. Simulation d'envoi vers ${to} (${subject})`);
    console.log(`[email.server Preview]\nSubject: ${subject}\nTo: ${to}`);
    return true;
  }

  try {
    const liveResend = new Resend(currentApiKey);
    const liveFrom = process.env.RESEND_FROM_EMAIL || FROM_EMAIL || "DolaPay <notification@dola-pay.com>";
    const { data, error } = await liveResend.emails.send({
      from: liveFrom,
      to: [to],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error(`[email.server] Resend error sending to ${to}:`, error);
      return false;
    }

    console.log(`[email.server] Successfully sent email to ${to} (ID: ${data?.id})`);
    return true;
  } catch (err) {
    console.error(`[email.server] Exception sending email to ${to}:`, err);
    return false;
  }
}

/**
 * 1a. Email au Marchand après avoir reçu un paiement via Lien / Facture
 */
export async function sendPaymentReceivedMerchantEmail(params: {
  merchantEmail: string;
  merchantName: string;
  amount: number;
  currency: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod: string;
  transactionId: string;
  linkTitle?: string;
}): Promise<boolean> {
  const amountStr = `${new Intl.NumberFormat("fr-FR").format(params.amount)} ${params.currency}`;
  const subject = `💰 Nouveau paiement reçu : +${amountStr}`;

  const html = getBaseEmailHtml(subject, `
    <h1 class="h1">Félicitations ${params.merchantName || "Marchand"} ! 🎉</h1>
    <p class="text">
      Vous venez de recevoir un nouveau paiement d'un client via votre ${params.linkTitle ? `lien de paiement <strong>"${params.linkTitle}"</strong>` : "lien de paiement DolaPay"}.
    </p>

    <div class="amount-box">
      <div class="amount-label">Montant encaissé</div>
      <div class="amount-value">+${amountStr}</div>
    </div>

    <div class="card-box">
      <div class="row">
        <span class="row-label">Client</span>
        <span class="row-value">${params.customerName || "Inconnu"}</span>
      </div>
      ${params.customerPhone ? `
      <div class="row">
        <span class="row-label">Téléphone / Mobile Money</span>
        <span class="row-value">${params.customerPhone}</span>
      </div>` : ""}
      ${params.customerEmail ? `
      <div class="row">
        <span class="row-label">Email client</span>
        <span class="row-value">${params.customerEmail}</span>
      </div>` : ""}
      <div class="row">
        <span class="row-label">Opérateur / Moyen de paiement</span>
        <span class="row-value">${params.paymentMethod}</span>
      </div>
      <div class="row">
        <span class="row-label">Référence Transaction</span>
        <span class="row-value" style="font-family: monospace; font-size: 12px;">${params.transactionId}</span>
      </div>
      <div class="row">
        <span class="row-label">Date & Heure</span>
        <span class="row-value">${new Date().toLocaleString("fr-FR")}</span>
      </div>
    </div>

    <p class="text">
      Cet argent a été crédité sur votre solde DolaPay. Vous pouvez dès maintenant effectuer un retrait instantané vers votre compte Mobile Money.
    </p>

    <div class="btn-container">
      <a href="https://dashboard.dola-pay.com/transactions" class="btn">Voir la transaction dans mon espace</a>
    </div>
  `);

  return sendRawEmail(params.merchantEmail, subject, html);
}

/**
 * 1b. Email Reçu de Paiement au Client final
 */
export async function sendPaymentReceiptCustomerEmail(params: {
  customerEmail: string;
  customerName: string;
  merchantName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  linkTitle?: string;
}): Promise<boolean> {
  const amountStr = `${new Intl.NumberFormat("fr-FR").format(params.amount)} ${params.currency}`;
  const subject = `✅ Reçu de votre paiement : ${amountStr} (${params.merchantName})`;

  const html = getBaseEmailHtml(subject, `
    <h1 class="h1">Reçu de votre paiement</h1>
    <p class="text">
      Bonjour <strong>${params.customerName || "Cher client"}</strong>,<br/>
      Nous vous confirmons que votre paiement a été effectué et validé avec succès sur DolaPay pour le compte de <strong>${params.merchantName}</strong>.
    </p>

    <div class="amount-box" style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border-color: #a7f3d0;">
      <div class="amount-label" style="color: #059669;">Montant payé</div>
      <div class="amount-value" style="color: #065f46;">${amountStr}</div>
    </div>

    <div class="card-box">
      ${params.linkTitle ? `
      <div class="row">
        <span class="row-label">Motif / Produit</span>
        <span class="row-value">${params.linkTitle}</span>
      </div>` : ""}
      <div class="row">
        <span class="row-label">Bénéficiaire</span>
        <span class="row-value">${params.merchantName}</span>
      </div>
      <div class="row">
        <span class="row-label">Moyen de paiement</span>
        <span class="row-value">${params.paymentMethod}</span>
      </div>
      <div class="row">
        <span class="row-label">Numéro de reçu</span>
        <span class="row-value" style="font-family: monospace; font-size: 12px;">${params.transactionId}</span>
      </div>
      <div class="row">
        <span class="row-label">Date du paiement</span>
        <span class="row-value">${new Date().toLocaleString("fr-FR")}</span>
      </div>
    </div>

    <p class="text">
      Merci de votre confiance. Vous pouvez conserver cet email comme preuve officielle de règlement.
    </p>
  `);

  return sendRawEmail(params.customerEmail, subject, html);
}

/**
 * 2. Email Notification après demande / exécution de Retrait (Payout)
 */
export async function sendPayoutNotificationEmail(params: {
  merchantEmail: string;
  merchantName: string;
  amount: number;
  currency: string;
  recipientPhone: string;
  provider: string;
  status: "pending" | "success" | "failed";
  payoutId?: string;
  errorMessage?: string;
}): Promise<boolean> {
  const amountStr = `${new Intl.NumberFormat("fr-FR").format(params.amount)} ${params.currency}`;
  const isSuccess = params.status === "success";
  const isFailed = params.status === "failed";

  const statusTitle = isSuccess ? "Retrait effectué avec succès !" : isFailed ? "Échec du retrait Mobile Money" : "Demande de retrait en cours";
  const statusColor = isSuccess ? "#059669" : isFailed ? "#e11d48" : "#2563eb";
  const subject = isSuccess ? `💸 Retrait réussi : ${amountStr} vers ${params.provider}` : isFailed ? `❌ Échec de votre retrait DolaPay (${amountStr})` : `⏳ Retrait initié : ${amountStr}`;

  const html = getBaseEmailHtml(subject, `
    <h1 class="h1" style="color: ${statusColor};">${statusTitle}</h1>
    <p class="text">
      Bonjour <strong>${params.merchantName || "Marchand"}</strong>,<br/>
      Voici le statut de votre opération de décaissement depuis votre portefeuille DolaPay :
    </p>

    <div class="amount-box" style="${isSuccess ? 'background: #ecfdf5; border-color: #a7f3d0;' : isFailed ? 'background: #fff1f2; border-color: #fecdd3;' : ''}">
      <div class="amount-label" style="color: ${statusColor};">Montant du retrait</div>
      <div class="amount-value" style="color: ${statusColor};">${amountStr}</div>
    </div>

    <div class="card-box">
      <div class="row">
        <span class="row-label">Numéro bénéficiaire</span>
        <span class="row-value">${params.recipientPhone}</span>
      </div>
      <div class="row">
        <span class="row-label">Opérateur destination</span>
        <span class="row-value">${params.provider}</span>
      </div>
      <div class="row">
        <span class="row-label">Statut de l'opération</span>
        <span class="row-value" style="color: ${statusColor}; font-weight: 800;">
          ${isSuccess ? "✅ VALIDÉ ET PAYÉ" : isFailed ? "❌ ÉCHOUÉ / REFUSÉ" : "⏳ EN COURS DE TRAITEMENT"}
        </span>
      </div>
      ${params.errorMessage ? `
      <div class="row">
        <span class="row-label">Motif de retour</span>
        <span class="row-value" style="color: #e11d48; max-width: 250px;">${params.errorMessage}</span>
      </div>` : ""}
      <div class="row">
        <span class="row-label">Date & Heure</span>
        <span class="row-value">${new Date().toLocaleString("fr-FR")}</span>
      </div>
    </div>

    ${isFailed ? `
    <p class="text" style="color: #e11d48; font-weight: 600;">
      Remarque : Les fonds ont été automatiquement recrédités ou n'ont pas été déduits de votre solde disponible.
    </p>` : ""}

    <div class="btn-container">
      <a href="https://dashboard.dola-pay.com/wallet" class="btn">Consulter mon portefeuille DolaPay</a>
    </div>
  `);

  return sendRawEmail(params.merchantEmail, subject, html);
}

/**
 * 3. Email Bienvenue après création de compte (Welcome Email)
 */
export async function sendWelcomeEmail(params: {
  userEmail: string;
  userName: string;
}): Promise<boolean> {
  const subject = `🎉 Bienvenue sur DolaPay ! Démarrez vos encaissements`;

  const html = getBaseEmailHtml(subject, `
    <h1 class="h1">Bienvenue sur DolaPay, ${params.userName || "Bienvenue"} ! 🚀</h1>
    <p class="text">
      Nous sommes ravis de vous compter parmi les utilisateurs de la plateforme de paiement nouvelle génération pour l'Afrique de l'Ouest.
    </p>
    <p class="text">
      DolaPay vous permet d'accepter en toute simplicité les paiements par <strong>Mobile Money (MTN, Orange, Moov, Airtel, M-Pesa, etc.)</strong> et <strong>Cartes Bancaires (Visa / Mastercard)</strong> au Bénin, Burkina Faso, Côte d'Ivoire, Sénégal, RDC et dans 9 autres pays.
    </p>

    <div class="card-box" style="background-color: #eff6ff; border-color: #bfdbfe;">
      <h3 style="margin-top: 0; font-size: 16px; color: #1e3a8a;">Vos prochaines étapes recommandées :</h3>
      <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 14px; line-height: 1.8;">
        <li><strong>Complétez votre vérification KYC</strong> pour débloquer les retraits instantanés et plafonds illimités.</li>
        <li><strong>Créez votre premier Lien de Paiement</strong> en 30 secondes sans écrire une ligne de code.</li>
        <li><strong>Explorez l'API et les SDKs</strong> si vous intégrez DolaPay dans votre site e-commerce ou application mobile.</li>
      </ul>
    </div>

    <div class="btn-container">
      <a href="https://dashboard.dola-pay.com" class="btn">Accéder à mon tableau de bord</a>
    </div>

    <p class="text" style="margin-top: 25px; font-size: 13px;">
      Besoin d'aide ? Notre support client est à votre disposition 7j/7 pour vous accompagner à chaque étape.
    </p>
  `);

  return sendRawEmail(params.userEmail, subject, html);
}

/**
 * 4. Email Vérification KYC Acceptée
 */
export async function sendKycApprovedEmail(params: {
  userEmail: string;
  userName: string;
  tierName?: string;
}): Promise<boolean> {
  const subject = `✅ Bonne nouvelle : Votre compte DolaPay est officiellement vérifié !`;

  const html = getBaseEmailHtml(subject, `
    <h1 class="h1" style="color: #059669;">Félicitations ${params.userName || "Marchand"} ! ✅</h1>
    <p class="text">
      Vos documents d'identité et les informations de votre entreprise ont été examinés et validés avec succès par notre équipe de conformité.
    </p>

    <div class="amount-box" style="background: #ecfdf5; border-color: #a7f3d0;">
      <div class="amount-label" style="color: #059669;">Statut du compte</div>
      <div class="amount-value" style="color: #065f46; font-size: 24px;">Vérifié · Plafonds débloqués</div>
    </div>

    <div class="card-box">
      <div class="row">
        <span class="row-label">Niveau de conformité</span>
        <span class="row-value" style="color: #059669;">${params.tierName || "Niveau Vérifié / Pro"}</span>
      </div>
      <div class="row">
        <span class="row-label">Retraits instantanés Mobile Money</span>
        <span class="row-value">Actifs (24h/24 7j/7)</span>
      </div>
      <div class="row">
        <span class="row-label">Clés API Live</span>
        <span class="row-value">Disponibles</span>
      </div>
    </div>

    <p class="text">
      Vous pouvez désormais exploiter tout le potentiel de DolaPay pour développer votre activité dans toute la région de l'UEMOA.
    </p>

    <div class="btn-container">
      <a href="https://dashboard.dola-pay.com" class="btn" style="background: linear-gradient(135deg, #059669 0%, #047857 100%);">Accéder à mon espace vérifié</a>
    </div>
  `);

  return sendRawEmail(params.userEmail, subject, html);
}

/**
 * 5. Email Vérification KYC Refusée / À corriger
 */
export async function sendKycRejectedEmail(params: {
  userEmail: string;
  userName: string;
  reason?: string;
}): Promise<boolean> {
  const subject = `⚠️ Action requise : Vérification de votre compte DolaPay`;

  const html = getBaseEmailHtml(subject, `
    <h1 class="h1" style="color: #e11d48;">Mise à jour requise pour votre compte</h1>
    <p class="text">
      Bonjour <strong>${params.userName || "Marchand"}</strong>,<br/>
      Notre équipe de conformité a examiné votre dossier de vérification (KYC). Nous avons besoin de précisions ou d'un document complémentaire pour finaliser la validation de votre compte.
    </p>

    <div class="card-box" style="background-color: #fff1f2; border-color: #fecdd3;">
      <h3 style="margin-top: 0; font-size: 15px; color: #9f1239;">Motif du rejet / Précisions demandées :</h3>
      <p style="margin: 0; color: #be123c; font-weight: 600; font-size: 14px;">
        « ${params.reason || "Le document fourni est flou, incomplet ou ne correspond pas aux informations du titulaire du compte. Veuillez soumettre une pièce d'identité valide et lisible."} »
      </p>
    </div>

    <p class="text">
      Rassurez-vous : la mise à jour de vos documents ne prend que 2 minutes depuis votre espace de conformité.
    </p>

    <div class="btn-container">
      <a href="https://dashboard.dola-pay.com/resubmit" class="btn" style="background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);">Soumettre mes nouveaux documents</a>
    </div>
  `);

  return sendRawEmail(params.userEmail, subject, html);
}

/**
 * Helper atomique : Notifier un encaissement réussi (au Marchand et au Client si email renseigné)
 */
export async function notifyDepositSuccess(supabaseAdmin: any, transactionId: string): Promise<void> {
  try {
    const { data: tx, error } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .maybeSingle();

    if (error || !tx || tx.status !== "success") return;
    if (tx.description && tx.description.includes("[EMAIL_SENT]")) return;

    // Marquer comme envoyé immédiatement pour éviter le double envoi lors des accès concurrents
    const updatedDesc = (tx.description || "") + " [EMAIL_SENT]";
    await supabaseAdmin.from("transactions").update({ description: updatedDesc }).eq("id", transactionId);

    const profileId = tx.profile_id || tx.user_id || tx.merchant_id || tx.owner_id;
    if (!profileId) return;

    const { data: prof } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name, company_name")
      .eq("id", profileId)
      .maybeSingle();

    if (!prof || !prof.email) return;

    // Vérification des préférences utilisateur pour désactiver les emails marchands
    let merchantWantsEmails = true;
    try {
      const { data: userAuth } = await supabaseAdmin.auth.admin.getUserById(profileId);
      if (userAuth?.user?.user_metadata?.disable_receipt_emails === true) {
        merchantWantsEmails = false;
      }
    } catch (e) {
      console.error("[email.server] Error fetching user metadata", e);
    }

    const merchantName = prof.company_name || prof.full_name || "Marchand DolaPay";

    let customerName = tx.customer_name || "Client";
    let customerEmail: string | undefined = tx.customer_email || tx.client_email || undefined;
    let linkTitle = "Paiement DolaPay";

    if (tx.description) {
      const descClean = tx.description.replace(" [EMAIL_SENT]", "");
      const parts = descClean.split("·").map((p: string) => p.trim());
      if (parts[0]) linkTitle = parts[0].replace(/\[[^\]]+\]\s*/, "").trim();
      
      const emailMatch = descClean.match(/\(([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)\)/);
      if (emailMatch && emailMatch[1] && emailMatch[1] !== "noemail@client.com") {
        if (!customerEmail) customerEmail = emailMatch[1].trim();
      }

      if (parts[1]) {
        const namePart = parts[1].replace(/\([^)]+\)/g, "").trim();
        if (namePart && !tx.customer_name) customerName = namePart;
      }
    }

    // 1. Email Marchand (Seulement s'il n'a pas désactivé l'option)
    if (merchantWantsEmails) {
      await sendPaymentReceivedMerchantEmail({
        merchantEmail: prof.email,
        merchantName,
        amount: Number(tx.amount),
        currency: tx.currency || "XOF",
        customerName,
        customerPhone: tx.customer_phone,
        customerEmail,
        paymentMethod: tx.payment_method || "Mobile Money",
        transactionId: tx.id,
        linkTitle,
      });
    }

    // 2. Email Client
    if (customerEmail) {
      await sendPaymentReceiptCustomerEmail({
        customerEmail,
        customerName,
        merchantName,
        amount: Number(tx.amount),
        currency: tx.currency || "XOF",
        paymentMethod: tx.payment_method || "Mobile Money",
        transactionId: tx.id,
        linkTitle,
      });
    }
  } catch (err) {
    console.error("[email.server] Error in notifyDepositSuccess:", err);
  }
}

/**
 * Helper atomique : Notifier un statut de décaissement/retrait (au Marchand)
 */
export async function notifyPayoutStatus(supabaseAdmin: any, payoutIdOrItem: any, status: "pending" | "success" | "failed", errorMessage?: string): Promise<void> {
  try {
    const idStr = typeof payoutIdOrItem === "string" ? payoutIdOrItem : payoutIdOrItem?.id;
    let item = typeof payoutIdOrItem === "string" ? null : payoutIdOrItem;
    
    if (!item && idStr) {
      const { data: dItem } = await supabaseAdmin.from("payout_batch_items").select("*").eq("id", idStr).maybeSingle();
      item = dItem;
    }
    if (!item && idStr) {
      const { data: dReq } = await supabaseAdmin.from("withdrawal_requests").select("*").eq("id", idStr).maybeSingle();
      item = dReq;
    }
    if (!item && idStr) {
      const { data: dTx } = await supabaseAdmin.from("transactions").select("*").eq("id", idStr).maybeSingle();
      item = dTx;
    }
    if (!item) return;

    // Récupérer la transaction correspondante pour vérifier si c'est un retrait API ou Manuel
    let txDesc = item.description || "";
    if (!txDesc && idStr) {
      const { data: tx } = await supabaseAdmin.from("transactions").select("description").eq("id", idStr).maybeSingle();
      if (tx) txDesc = tx.description || "";
    }
    let isApiPayout = txDesc.includes("[API_PAYOUT]") || item.name?.includes("Payout API");

    let profileId = item.profile_id || item.user_id || item.merchant_id || item.owner_id;
    if (!profileId && item.batch_id) {
      const { data: batch } = await supabaseAdmin.from("payout_batches").select("*").eq("id", item.batch_id).maybeSingle();
      if (batch) {
        profileId = batch.profile_id || batch.owner_id || batch.user_id;
        if (batch.name?.includes("Payout API")) isApiPayout = true;
      }
    }
    if (!profileId) return;

    const { data: prof } = await supabaseAdmin.from("profiles").select("email, full_name, company_name").eq("id", profileId).maybeSingle();
    if (!prof || !prof.email) return;

    // Vérification des préférences utilisateur pour désactiver les emails (UNIQUEMENT pour les flux API)
    let merchantWantsEmails = true;
    try {
      const { data: userAuth } = await supabaseAdmin.auth.admin.getUserById(profileId);
      if (userAuth?.user?.user_metadata?.disable_receipt_emails === true) {
        merchantWantsEmails = false;
      }
    } catch (e) {
      console.error("[email.server] Error fetching user metadata", e);
    }

    // On bloque l'email SEULEMENT si c'est un flux API ET que le marchand a désactivé les notifications.
    // Un retrait manuel depuis le dashboard (isApiPayout = false) enverra toujours un email.
    if (isApiPayout && !merchantWantsEmails) return;

    const merchantName = prof.company_name || prof.full_name || "Marchand DolaPay";

    await sendPayoutNotificationEmail({
      merchantEmail: prof.email,
      merchantName,
      amount: Number(item.amount || 0),
      currency: item.currency || "XOF",
      recipientPhone: item.recipient_phone || item.phone || item.customer_phone || "N/A",
      provider: item.provider || item.method || "Mobile Money",
      status,
      payoutId: idStr || item.id,
      errorMessage,
    });
  } catch (err) {
    console.error("[email.server] Error in notifyPayoutStatus:", err);
  }
}

/**
 * Helper atomique : Notifier une demande de retrait en direct via dashboard/API
 */
export async function notifyWithdrawalRequestStatus(supabaseAdmin: any, withdrawalId: string, status: "pending" | "success" | "failed", errorMessage?: string): Promise<void> {
  return notifyPayoutStatus(supabaseAdmin, withdrawalId, status, errorMessage);
}

export async function sendTeamInvitationEmail(params: {
  inviteeEmail: string;
  inviterName: string;
  role: string;
}): Promise<boolean> {
  const roleLabel = params.role === 'admin' ? 'Administrateur' : params.role === 'operator' ? 'Opérateur' : 'Lecteur';
  const subject = `Vous avez été invité à rejoindre l'équipe de ${params.inviterName} sur DolaPay`;

  const html = getBaseEmailHtml(subject, `
    <h1 class="h1">Invitation d'équipe 🤝</h1>
    <p class="text">
      Bonjour,<br/><br/>
      <strong>${params.inviterName}</strong> vous a invité à collaborer sur son espace d'entreprise DolaPay.
    </p>

    <div class="card-box">
      <div class="row">
        <span class="row-label">Entreprise</span>
        <span class="row-value">${params.inviterName}</span>
      </div>
      <div class="row">
        <span class="row-label">Rôle assigné</span>
        <span class="row-value">${roleLabel}</span>
      </div>
    </div>

    <p class="text">
      Cliquez sur le bouton ci-dessous pour accepter l'invitation. Vous serez redirigé vers DolaPay pour vous connecter ou créer un compte avec cette adresse email.
    </p>

    <div class="btn-container">
      <a href="https://dashboard.dola-pay.com/accept-invite" class="btn">Accepter l'invitation</a>
    </div>
  `);

  return sendRawEmail(params.inviteeEmail, subject, html);
}
