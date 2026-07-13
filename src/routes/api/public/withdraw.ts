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
          const authHeader = request.headers.get("Authorization") || "";
          const token = authHeader.split(" ")[1];
          if (!token) {
            return Response.json({ error: "Session expirée ou non autorisée." }, { status: 401 });
          }

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);

          if (authErr || !user) {
            return Response.json({ error: "Session non valide." }, { status: 401 });
          }

          let json: any;
          try {
            json = await request.json();
          } catch {
            return Response.json({ error: "JSON invalide." }, { status: 400 });
          }

          const { action } = json;

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
              const { error } = await supabaseAdmin
                .from("wallets")
                .update({
                  hashed_pin: hashedPin,
                  updated_at: new Date().toISOString(),
                } as any)
                .eq("id", existingWallet.id);
              opError = error;
            } else {
              let insErr: any = null;
              for (const col of candidates) {
                const payload: any = {
                  [col]: user.id,
                  hashed_pin: hashedPin,
                  balance: 0.00,
                  currency: "XOF",
                  updated_at: new Date().toISOString(),
                };
                const ins = await (supabaseAdmin.from("wallets") as any).insert(payload);
                if (!ins.error || !ins.error.message?.includes(col)) {
                  insErr = ins.error;
                  break;
                }
                insErr = ins.error;
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

            if (!amount || amount < 100) {
              return Response.json({ error: "Le montant minimum est de 100 XOF." }, { status: 400 });
            }
            if (!method || !["ORANGE", "MOOV", "TELECEL"].includes(method)) {
              return Response.json({ error: "Méthode de retrait non prise en charge." }, { status: 400 });
            }
            if (!phone || phone.length < 8) {
              return Response.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
            }
            if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
              return Response.json({ error: "Code PIN invalide." }, { status: 400 });
            }

            // Récupérer le portefeuille de l'utilisateur
            const candidates = ["profile_id", "user_id", "merchant_id", "account_id", "owner_id", "id"];
            let wallet: any = null;
            let walletErr: any = null;

            for (const col of candidates) {
              const res = await (supabaseAdmin.from("wallets") as any)
                .select("*")
                .eq(col, user.id)
                .maybeSingle();

              if (!res.error || !res.error.message?.includes(col)) {
                wallet = res.data;
                walletErr = res.error;
                break;
              }
              walletErr = res.error;
            }

            if (walletErr || !wallet) {
              return Response.json({ error: walletErr ? `Erreur SQL: ${walletErr.message}` : "Portefeuille introuvable." }, { status: 404 });
            }

            // Vérifier le code PIN haché
            const hashedInputPin = hashPin(pin);
            if (wallet.hashed_pin !== hashedInputPin) {
              return Response.json({ error: "Code PIN secret incorrect." }, { status: 403 });
            }

            // Vérifier le solde
            const currentBalance = Number(wallet.balance || 0);
            if (currentBalance < amount) {
              return Response.json({ error: "Solde insuffisant pour effectuer ce retrait." }, { status: 400 });
            }

            // Mettre à jour le solde (DÉDUCTION)
            const newBalance = currentBalance - amount;
            const { error: deductErr } = await supabaseAdmin
              .from("wallets")
              .update({
                balance: newBalance,
                updated_at: new Date().toISOString(),
              } as any)
              .eq("id", wallet.id);

            if (deductErr) {
              console.error("Deduction failed:", deductErr);
              return Response.json({ error: "Erreur lors de la déduction du solde." }, { status: 500 });
            }

            // Créer la demande de retrait (withdrawal_request)
            let reqErr = (await supabaseAdmin
              .from("withdrawal_requests")
              .insert({
                profile_id: user.id,
                wallet_id: wallet.id,
                amount: amount,
                currency: "XOF",
                method: method,
                recipient_phone: phone,
                status: "pending",
              } as any)).error;

            if (reqErr && reqErr.message?.includes("profile_id")) {
              reqErr = (await (supabaseAdmin.from("withdrawal_requests") as any)
                .insert({
                  user_id: user.id,
                  wallet_id: wallet.id,
                  amount: amount,
                  currency: "XOF",
                  method: method,
                  recipient_phone: phone,
                  status: "pending",
                } as any)).error;
            }

            if (reqErr) {
              console.error("Withdrawal request creation failed:", reqErr);
              // Rollback: rembourser l'utilisateur
              await supabaseAdmin
                .from("wallets")
                .update({
                  balance: currentBalance,
                  updated_at: new Date().toISOString(),
                } as any)
                .eq("id", wallet.id);

              return Response.json({ error: "Échec de création de la demande de retrait." }, { status: 500 });
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
