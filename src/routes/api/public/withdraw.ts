import { createFileRoute } from "@tanstack/react-router";
import crypto from "crypto";

function hashPin(pin: string): string {
  return crypto.createHash("sha256").update(pin).digest("hex");
}

export const Route = createFileRoute("/api/public/withdraw")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { calculateMargin } = await import("@/lib/margins.server");

          const authHeader = request.headers.get("Authorization") || "";
          const token = authHeader.split(" ")[1];
          if (!token) {
            return Response.json({ error: "Session expirée ou non autorisée." }, { status: 401 });
          }
          const { data: { user: authUser }, error: authErr } = await supabaseAdmin.auth.getUser(token);
          if (authErr || !authUser) {
            return Response.json({ error: "Session non valide." }, { status: 401 });
          }
          const user = authUser;

          let json: any;
          try {
            json = await request.json();
          } catch {
            return Response.json({ error: "JSON invalide." }, { status: 400 });
          }

          const { action } = json;

          const logFail = async (reason: string, method: string = "API", phone: string = "---", amount: number = 0) => {
            let dbErr = null;
            if (user?.id) {
              const { error } = await supabaseAdmin.from("transactions").insert({
                id: crypto.randomUUID(),
                profile_id: user.id,
                amount: amount,
                net_amount: amount,
                currency: "XOF",
                type: "pay-out",
                status: "failed",
                description: `Retrait vers ${phone} via ${method} (${reason})`,
              } as any);
              dbErr = error;
            }
            return dbErr;
          };

          // =================== ACTION: SETUP PIN ===================
          if (action === "setup-pin") {
            const { pin } = json;
            if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
              return Response.json({ error: "Le code PIN doit comporter 4 chiffres." }, { status: 400 });
            }

            const hashedPin = hashPin(pin);

            // Mettre à jour ou créer le portefeuille avec le PIN haché
            // Mettre à jour ou créer le portefeuille avec le PIN haché
            const candidates = ["profile_id", "user_id", "merchant_id", "account_id", "owner_id", "id"];
            let idCol = "profile_id";
            let existingWallet: any = null;
            let selectErr: any = null;

            for (const col of candidates) {
              const res = await (supabaseAdmin.from("wallets") as any)
                .select("id")
                .eq(col, user.id)
                .maybeSingle();

              if (!res.error || !res.error.message?.includes(col)) {
                idCol = col;
                existingWallet = res.data;
                selectErr = res.error;
                break;
              }
              selectErr = res.error;
            }

            if (selectErr && !existingWallet) {
              // Tentative ultime avec 'id' en tant que clé ou inspection
              console.error("Select wallet failed across all candidates:", selectErr);
              return Response.json({ error: `Erreur SQL SELECT sur table wallets (${idCol}): ${selectErr.message}` }, { status: 500 });
            }

            let opError: any = null;
            if (existingWallet) {
              let error: any = (await supabaseAdmin
                .from("wallets")
                .update({
                  hashed_pin: hashedPin,
                  updated_at: new Date().toISOString(),
                } as any)
                .eq("id", existingWallet.id)).error;

              if (error && (error.message?.includes("hashed_pin") || error.code === "PGRST204")) {
                const resPin = await supabaseAdmin
                  .from("wallets")
                  .update({
                    pin: hashedPin,
                    updated_at: new Date().toISOString(),
                  } as any)
                  .eq("id", existingWallet.id);
                error = resPin.error;
              }

              if (error && (error.message?.includes("pin") || error.code === "PGRST204")) {
                const { error: metaErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
                  user_metadata: { ...(user.user_metadata || {}), wallet_pin: hashedPin },
                });
                error = metaErr as any;
              }
              opError = error;
            } else {
              let insErr: any = null;
              let successCol = false;

              for (const col of candidates) {
                let payload: any = {
                  [col]: user.id,
                  hashed_pin: hashedPin,
                  balance: 0.00,
                  currency: "XOF",
                  provider: "DOLAPAY",
                  status: "ACTIVE",
                  name: "Portefeuille Principal",
                  is_active: true,
                  account_type: "INTERNAL",
                  updated_at: new Date().toISOString(),
                };

                for (let attempt = 0; attempt < 8; attempt++) {
                  let ins = await (supabaseAdmin.from("wallets") as any).insert(payload);

                  if (ins.error && (ins.error.message?.includes("hashed_pin") || ins.error.code === "PGRST204")) {
                    delete payload.hashed_pin;
                    ins = await (supabaseAdmin.from("wallets") as any).insert(payload);
                    if (!ins.error || !ins.error.message?.includes(col)) {
                      await supabaseAdmin.auth.admin.updateUserById(user.id, {
                        user_metadata: { ...(user.user_metadata || {}), wallet_pin: hashedPin },
                      });
                      insErr = ins.error;
                      if (!ins.error) successCol = true;
                      break;
                    }
                  }

                  if (!ins.error) {
                    insErr = null;
                    successCol = true;
                    break;
                  }

                  if (ins.error.code === "23502" || ins.error.message?.includes("violates not-null constraint")) {
                    const match = ins.error.message?.match(/column "([^"]+)"/);
                    if (match && match[1]) {
                      const cName = match[1];
                      if (cName.includes("phone") || cName.includes("number")) payload[cName] = "00000000";
                      else if (cName.includes("email")) payload[cName] = user.email || "wallet@dola-pay.com";
                      else if (cName.includes("type")) payload[cName] = "INTERNAL";
                      else if (cName.includes("status")) payload[cName] = "ACTIVE";
                      else if (cName.includes("provider")) payload[cName] = "DOLAPAY";
                      else if (cName.includes("balance") || cName.includes("amount") || cName.includes("score")) payload[cName] = 0;
                      else if (cName.includes("is_") || cName.includes("has_") || cName.includes("active")) payload[cName] = true;
                      else payload[cName] = "DEFAULT";
                      continue;
                    }
                  }

                  insErr = ins.error;
                  if (!ins.error.message?.includes(col)) break;
                  break;
                }

                if (successCol) break;
              }

              if (!successCol && insErr) {
                console.warn("Table wallets schema incompatible, falling back to user_metadata absolute storage:", insErr);
                await supabaseAdmin.auth.admin.updateUserById(user.id, {
                  user_metadata: {
                    ...(user.user_metadata || {}),
                    wallet_pin: hashedPin,
                    wallet_balance: 0.00,
                    wallet_currency: "XOF",
                    wallet_created: true,
                  },
                });
                insErr = null;
              }

              opError = insErr;
            }

            if (opError) {
              console.error("Setup PIN failed:", opError);
              return Response.json({ error: `Erreur Supabase (${opError.code || 'SQL'}): ${opError.message || opError.details || JSON.stringify(opError)}` }, { status: 500 });
            }

            return Response.json({ success: true });
          }

          // =================== ACTION: WITHDRAW ===================
          if (action === "withdraw") {
            const { amount, method, phone, pin } = json;

            if (!amount || amount < 200) {
              const err = await logFail("Le montant minimum est de 200 XOF", method, phone, amount);
              return Response.json({ error: "Le montant minimum est de 200 XOF." + (err ? ` (DB Error: ${err.message})` : "") }, { status: 400 });
            }
            if (!method || typeof method !== "string" || method.trim().length === 0) {
              await logFail("Méthode de retrait non spécifiée", method, phone, amount);
              return Response.json({ error: "Méthode de retrait non spécifiée." }, { status: 400 });
            }
            if (!phone || phone.length < 8) {
              await logFail("Numéro de téléphone invalide", method, phone, amount);
              return Response.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
            }
            if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
              await logFail("Code PIN invalide", method, phone, amount);
              return Response.json({ error: "Code PIN invalide." }, { status: 400 });
            }

            // Récupérer le portefeuille de l'utilisateur
            const candidates = ["profile_id", "user_id", "merchant_id", "account_id", "owner_id", "id"];
            let walletData: any = null;
            let walletErr: any = null;

            for (const col of candidates) {
              const res = await (supabaseAdmin.from("wallets") as any)
                .select("*")
                .eq(col, user.id)
                .maybeSingle();

              if (!res.error || !res.error.message?.includes(col)) {
                walletData = res.data;
                walletErr = res.error;
                break;
              }
              walletErr = res.error;
            }

            let wallet = walletData;

            if (!wallet) {
              const { data: userData } = await supabaseAdmin.auth.admin.getUserById(user.id);
              if (userData?.user?.user_metadata?.wallet_created || userData?.user?.user_metadata?.wallet_pin) {
                wallet = {
                  id: user.id,
                  balance: Number(userData.user.user_metadata.wallet_balance || 0),
                  hashed_pin: userData.user.user_metadata.wallet_pin,
                  is_virtual: true,
                };
              }
            }

            if (walletErr || !wallet) {
              await logFail("Portefeuille introuvable", method, phone, amount);
              return Response.json({ error: walletErr ? `Erreur SQL: ${walletErr.message}` : "Portefeuille introuvable." }, { status: 404 });
            }

            // Vérifier le code PIN haché
            let storedPin = wallet.hashed_pin || wallet.pin;
            if (!storedPin) {
              const { data: userData } = await supabaseAdmin.auth.admin.getUserById(user.id);
              storedPin = userData?.user?.user_metadata?.wallet_pin;
            }

            const hashedInputPin = hashPin(pin);
            if (storedPin !== hashedInputPin) {
              await logFail("Code PIN secret incorrect", method, phone, amount);
              return Response.json({ error: "Code PIN secret incorrect." }, { status: 403 });
            }

            // Vérifier le solde de manière exhaustive et centralisée
            const { calculateExactBalance } = await import("@/lib/balance.server");
            let currentBalance = await calculateExactBalance(supabaseAdmin, user.id);

            const { getCorrespondentCode, detectCountryFromPhone } = await import("@/lib/pawapay.server");
            const correspondentCode = getCorrespondentCode(method, phone);
            const country = detectCountryFromPhone(phone);
            const gatewayTarget = country === "BFA" ? "ligdicash" : "pawapay";
            
            // Calculer les marges et frais pour le retrait
            const margins = await calculateMargin(supabaseAdmin, amount, "pay-out", correspondentCode, gatewayTarget);

            if (currentBalance < margins.net_amount) {
              const dbErr = await logFail("Solde insuffisant", method, phone, amount);
              let msg = `Solde insuffisant (${Math.round(currentBalance)} XOF disponibles) pour un retrait de ${amount} (avec frais : ${margins.net_amount} XOF).`;
              if (dbErr) msg += ` [ERR SQL: ${dbErr.message}]`;
              return Response.json({ error: msg }, { status: 400 });
            }

            // Mettre à jour le solde (DÉDUCTION) sur l'ensemble des emplacements connus pour garder la synchro parfaite
            const newBalance = currentBalance - margins.net_amount;
            
            await supabaseAdmin.auth.admin.updateUserById(user.id, {
              user_metadata: { ...(user.user_metadata || {}), wallet_balance: newBalance },
            });

            if (!Boolean(json.testMode) && wallet.id) {
              await supabaseAdmin
                .from("wallets")
                .update({
                  balance: newBalance,
                  updated_at: new Date().toISOString(),
                } as any)
                .eq("id", wallet.id);
            }

            // Connexion API pour effectuer le décaissement automatique
            const isVirtualWithdraw = Boolean(json.testMode);
            let finalStatus = isVirtualWithdraw ? "success" : "processing";
            let payoutError: string | null = null;
            const payoutId = crypto.randomUUID();

            if (!isVirtualWithdraw) {
              if (gatewayTarget === "ligdicash") {
                // Routage via LigdiCash pour le Burkina Faso
                try {
                  console.log(`[LigdiCash API] Initiation du décaissement Live (${amount} XOF -> ${phone} via ${method})...`);
                  const { createLigdiCashPayout, LigdiCashMethod } = await import("@/lib/ligdicash.server");
                  
                  let ligdiMethod = "WALLET";
                  const methUpper = method.toUpperCase();
                  if (methUpper.includes("ORANGE")) ligdiMethod = "ORANGE";
                  else if (methUpper.includes("MOOV")) ligdiMethod = "MOOV";
                  else if (methUpper.includes("TELECEL")) ligdiMethod = "TELECEL";
                  
                  const ligdiRes = await createLigdiCashPayout({
                    amount: amount,
                    currency: "XOF",
                    description: `Retrait DolaPay (${method})`,
                    recipient: { phone },
                    method: ligdiMethod as any,
                    customData: { payoutId }
                  });
                  
                  if (ligdiRes && ligdiRes.response_code === "00") {
                    finalStatus = "processing";
                  } else {
                    payoutError = `Retrait refusé par LigdiCash : ${ligdiRes.response_text || "Erreur inconnue."}`;
                    finalStatus = "failed";
                  }
                } catch (lgErr: any) {
                  console.error("[LigdiCash API] Erreur lors de l'appel createLigdiCashPayout :", lgErr);
                  payoutError = `Échec d'envoi API LigdiCash : ${lgErr.message || "Erreur réseau."}`;
                  finalStatus = "failed";
                }
              } else {
                // Routage classique via PawaPay
                try {
                  console.log(`[PawaPay API] Initiation du décaissement Live (${amount} XOF -> ${phone} via ${correspondentCode})...`);
                  const { pawapay } = await import("@/lib/pawapay.server");
                  const payoutRes = await pawapay.initiatePayout({
                    payoutId,
                    amount: amount,
                    currency: "XOF",
                    phone: phone,
                    provider: correspondentCode,
                    description: `Retrait DolaPay (${method})`,
                  });
                  if (payoutRes && payoutRes.status) {
                    if (payoutRes.status === "REJECTED") {
                      payoutError = `Retrait refusé par l'opérateur Mobile Money (${correspondentCode}) : ${payoutRes.rejectionReason?.rejectionMessage || "Refus PawaPay."}`;
                      finalStatus = "failed";
                    } else {
                      finalStatus = payoutRes.status === "ACCEPTED" ? "processing" : "pending";
                    }
                  }
                } catch (pwErr: any) {
                  console.error("[PawaPay API] Erreur lors de l'appel initiatePayout :", pwErr);
                  payoutError = `Échec d'envoi API PawaPay (${correspondentCode}) : ${pwErr.message || "Erreur réseau ou solde opérateur insuffisant."}`;
                  finalStatus = "failed";
                }
              }

              if (finalStatus === "failed") {
                // Rollback du solde si refusé immédiatement en cas d'erreur
                await supabaseAdmin
                  .from("wallets")
                  .update({ balance: currentBalance, updated_at: new Date().toISOString() } as any)
                  .eq("id", wallet.id);
                await (supabaseAdmin.from("profiles") as any)
                  .update({ balance: currentBalance, wallet_balance: currentBalance } as any)
                  .eq("id", user.id);
                
                await supabaseAdmin.from("transactions").insert({
                  id: payoutId,
                  profile_id: user.id,
                  amount: amount,
                  net_amount: amount,
                  dola_margin: margins.dola_margin,
                  currency: "XOF",
                  type: "pay-out",
                  status: finalStatus,
                  description: `Retrait vers ${phone} via ${method}`,
                  gateway: gatewayTarget
                } as any);
              }
            }

            // Créer la demande de retrait (withdrawal_request) - Tentatives multiples multi-schéma avec id: payoutId
            const insertAttempts = [
              { id: payoutId, profile_id: user.id, wallet_id: wallet.id || user.id, amount, currency: "XOF", method, recipient_phone: phone, status: finalStatus },
              { id: payoutId, user_id: user.id, wallet_id: wallet.id || user.id, amount, currency: "XOF", method, recipient_phone: phone, status: finalStatus },
              { id: payoutId, merchant_id: user.id, wallet_id: wallet.id || user.id, amount, currency: "XOF", method, recipient_phone: phone, status: finalStatus },
              { id: payoutId, profile_id: user.id, wallet_id: wallet.id || user.id, amount, currency: "XOF", method, recipient_phone: phone, status: "pending" },
              { id: payoutId, user_id: user.id, wallet_id: wallet.id || user.id, amount, currency: "XOF", method, recipient_phone: phone, status: "pending" },
              { id: payoutId, profile_id: user.id, amount, method, recipient_phone: phone, status: "pending" },
              { id: payoutId, user_id: user.id, amount, method, recipient_phone: phone, status: "pending" }
            ];

            let reqErr: any = null;
            let insertedOk = false;

            let reqId: string | null = payoutId;
            for (const payload of insertAttempts) {
              const res = await (supabaseAdmin.from("withdrawal_requests") as any).insert(payload).select("id").maybeSingle();
              if (!res.error) {
                insertedOk = true;
                reqErr = null;
                if (res.data?.id) reqId = res.data.id;
                break;
              }
              reqErr = res.error;
            }

            // Toujours enregistrer dans transactions (pay-out) et payout_batches en parallèle pour garantir une visibilité totale dans le ledger des flux !
            // On ne le fait que si finalStatus n'est pas failed, car si failed, on l'a déjà inséré plus haut (ligne 418)
            if (finalStatus !== "failed") {
              console.log("[Withdraw] Enregistrement dans transactions (pay-out) et payout_batches...");
              
              const txStatus = (finalStatus === "success" || finalStatus === "completed" || finalStatus === "processing" || finalStatus === "failed") ? finalStatus : "pending";
              // Transaction type "pay-out" ensures sync-wallet will calculate the updated balance properly
              const txAttempt = await supabaseAdmin.from("transactions").insert({
                id: payoutId,
                profile_id: user.id,
                amount: amount, // Requested amount
                net_amount: margins.net_amount, // Cost applied against the wallet balance
                dola_margin: margins.dola_margin,
                gateway: gatewayTarget,
                provider: method,
                currency: "XOF",
                type: "pay-out",
                status: txStatus,
                description: `[RETRAIT_UI] ${correspondentCode} · ${phone}`,
                payment_method: method,
                customer_phone: phone,
              } as any);
              if (txAttempt.error) {
                console.error("Erreur insertion transactions lors du retrait:", txAttempt.error);
              }

              // Enregistrer également dans payout_batches / payout_batch_items
              try {
                const { data: batch } = await supabaseAdmin
                  .from("payout_batches")
                  .insert({
                    owner_id: user.id,
                    name: `[Retrait Wallet] ${method} (${phone})`,
                    total_amount: amount,
                    fee_amount: margins.totalFees,
                    currency: "XOF",
                    total_count: 1,
                    status: txStatus,
                  } as any)
                  .select("id")
                  .maybeSingle();

                if (batch?.id) {
                  const { data: batchItemRes } = await supabaseAdmin
                    .from("payout_batch_items")
                    .insert({
                      id: payoutId,
                      batch_id: batch.id,
                      recipient_phone: phone,
                      recipient_name: phone,
                      amount: amount,
                      currency: "XOF",
                      provider: method,
                      status: txStatus,
                    } as any)
                    .select("id")
                    .maybeSingle();
                  insertedOk = true;
                  reqErr = null;

                  try {
                    const { notifyPayoutStatus, notifyWithdrawalRequestStatus } = await import("@/lib/email.server");
                    if (batchItemRes?.id) {
                      await notifyPayoutStatus(supabaseAdmin, batchItemRes.id, txStatus as any);
                    } else if (reqId) {
                      await notifyWithdrawalRequestStatus(supabaseAdmin, reqId, txStatus as any);
                    }
                  } catch (eEmail) {
                    console.warn("[Withdraw] Error sending payout email:", eEmail);
                  }
                }
              } catch (pbErr) {
                console.warn("[Withdraw] payout_batch insert warning:", pbErr);
              }
            }

            if (!insertedOk && reqErr) {
              console.error("Withdrawal request creation failed:", reqErr);
              // Rollback du solde
              await supabaseAdmin
                .from("wallets")
                .update({
                  balance: currentBalance,
                  updated_at: new Date().toISOString(),
                } as any)
                .eq("id", wallet.id);
              await (supabaseAdmin.from("profiles") as any)
                .update({ balance: currentBalance, wallet_balance: currentBalance } as any)
                .eq("id", user.id);

              const errDetail = reqErr.message || reqErr.details || reqErr.code || JSON.stringify(reqErr);
              return Response.json({ error: `Échec SQL lors de la création de la demande de retrait : ${errDetail}` }, { status: 500 });
            }

            if (payoutError) {
              return Response.json({ error: payoutError }, { status: 400 });
            }

            return Response.json({ success: true, new_balance: newBalance });
          }

          return Response.json({ error: "Action non prise en charge." }, { status: 400 });
        } catch (e: any) {
          console.error("CRITICAL ERROR in withdraw API handler:", e);
          return Response.json({ error: `Err500: ${e.message || String(e)}` }, { status: 500 });
        }
      },
    },
  },
});
