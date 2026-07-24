import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { authenticateMerchant } from "./auth.server";
import { pawapay, getCorrespondentCode } from "@/lib/pawapay.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { calculateMargin } from "@/lib/margins.server";

const ChargeBody = z.object({
  amount: z.number().int().min(100, "Le montant minimum est de 100 FCFA"),
  currency: z.enum(["XOF", "XAF", "USD"]).default("XOF"),
  customer_phone: z.string().min(8, "Numéro de téléphone invalide"),
  provider: z.string().default("Orange"),
  metadata: z.record(z.unknown()).optional(),
  description: z.string().optional(),
});

export const Route = createFileRoute("/api/v1/charges")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const auth = await authenticateMerchant(request);
        if (auth instanceof Response) return auth;

        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: { code: "invalid_json", message: "Corps JSON invalide." } }, { status: 400 });
        }

        const parsed = ChargeBody.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            { error: { code: "validation_error", message: parsed.error.issues[0].message } },
            { status: 400 }
          );
        }

        const { amount, currency, customer_phone, provider, description } = parsed.data;
        const correspondent = getCorrespondentCode(provider, customer_phone);

        // Route LigdiCash for Burkina Faso
        let gateway = "pawapay";
        if (customer_phone.replace(/\D/g, "").startsWith("226")) {
          gateway = "ligdicash";
        }

        // Si le merchant utilise la clé de test sandbox illustrative (sans compte)
        if (auth.is_test && auth.profile_id === "00000000-0000-0000-0000-000000000000") {
          return Response.json({
            id: `ch_${crypto.randomUUID().slice(0, 12)}`,
            status: "pending",
            amount,
            currency,
            operator: correspondent.toLowerCase(),
            customer_phone,
            created_at: new Date().toISOString(),
          });
        }

        // Calculate fees and margins
        const margins = await calculateMargin(supabaseAdmin, amount, "pay-in", correspondent, gateway as any);

        // Créer l'enregistrement dans la table transactions
        const { data: tx, error: txErr } = await supabaseAdmin
          .from("transactions")
          .insert({
            profile_id: auth.profile_id,
            amount,
            currency,
            type: "pay-in",
            status: auth.is_test ? "success" : "pending", // Mode Test = Success immédiat
            description: `[API_CHARGE${auth.is_test ? '_TEST' : ''}] ${correspondent} · ${customer_phone} · ${description || 'Encaissement API'}`,
            net_amount: margins.net_amount,
            operator_fee: margins.operator_fee,
            gateway_fee: margins.gateway_fee,
            dola_margin: margins.dola_margin,
            gateway: gateway,
            customer_phone,
            provider: gateway,
            payment_method: provider,
          } as any)
          .select("id, created_at")
          .single();

        if (txErr || !tx) {
          console.error("DB Insert Error details:", txErr);
          return Response.json({ error: { code: "db_error", message: "Impossible de créer la transaction." } }, { status: 500 });
        }

        // Appeler la passerelle SEULEMENT si c'est une clé Live
        if (!auth.is_test) {
          if (gateway === "ligdicash") {
            try {
              const { createLigdiCashPayin } = await import("@/lib/ligdicash.server");
              // Use merchant's base url if available, otherwise dola-pay.com
              const origin = new URL(request.url).origin;
              const ligdiRes = await createLigdiCashPayin({
                amount,
                description: description || `DolaPay API Charge`,
                customData: { transaction_id: tx.id },
                customer: {
                  firstname: "Client",
                  lastname: "API",
                  phone: customer_phone,
                },
                returnUrl: `${origin}/success`, // API developers should use webhooks, returnUrl is just fallback
                callbackUrl: `${origin}/api/public/ligdicash-webhook`,
              });

              if (ligdiRes.response_code !== "00") {
                await supabaseAdmin.from("transactions").update({ status: "failed" }).eq("id", tx.id);
                return Response.json(
                  { error: { code: "operator_rejected", message: ligdiRes.description || "Rejeté par LigdiCash." } },
                  { status: 400 }
                );
              }
              if (ligdiRes.token) {
                await supabaseAdmin.from("transactions").update({ ligdicash_token: ligdiRes.token } as any).eq("id", tx.id);
              }
              if (ligdiRes.response_text) {
                return Response.json({
                  id: tx.id,
                  status: "redirect",
                  redirect_url: ligdiRes.response_text,
                  amount,
                  currency,
                  operator: correspondent.toLowerCase(),
                  customer_phone,
                  created_at: tx.created_at,
                }, { status: 201 });
              }
            } catch (err) {
              console.error("LigdiCash charge error:", err);
            }
          } else {
            try {
              const res = await pawapay.initiateDeposit({
                depositId: tx.id,
                amount,
                currency,
                phone: customer_phone,
                provider,
                description: description || `DolaPay API Charge`,
              });

              if (res.status === "REJECTED") {
                await supabaseAdmin.from("transactions").update({ status: "failed" }).eq("id", tx.id);
                return Response.json(
                  { error: { code: "operator_rejected", message: res.rejectionReason?.rejectionMessage || "Rejeté par l'opérateur." } },
                  { status: 400 }
                );
              }
            } catch (err) {
              console.error("PawaPay charge error:", err);
            }
          }
        }

        return Response.json({
          id: tx.id,
          status: "pending",
          amount,
          currency,
          operator: correspondent.toLowerCase(),
          customer_phone,
          created_at: tx.created_at,
        }, { status: 201 });
      },
    },
  },
});
