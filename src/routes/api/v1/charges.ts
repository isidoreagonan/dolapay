import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { authenticateMerchant } from "./auth.server";
import { pawapay, getCorrespondentCode } from "@/lib/pawapay.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ChargeBody = z.object({
  amount: z.number().int().positive("Le montant doit être un entier positif"),
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
        const correspondent = getCorrespondentCode(provider);

        // Si le merchant utilise la clé de test sandbox illustrative
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

        // Créer l'enregistrement dans la table transactions
        const { data: tx, error: txErr } = await supabaseAdmin
          .from("transactions")
          .insert({
            profile_id: auth.profile_id,
            amount,
            currency,
            type: "pay-in",
            status: "pending",
            description: `[API_CHARGE] ${correspondent} · ${customer_phone} · ${description || 'Encaissement API'}`,
            // Add required live DB columns
            net_amount: amount,
            merchant_id: auth.profile_id,
            customer_phone,
            provider,
          } as any)
          .select("id, created_at")
          .single();

        if (txErr || !tx) {
          return Response.json({ error: { code: "db_error", message: "Impossible de créer la transaction." } }, { status: 500 });
        }

        // Appeler PawaPay
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
