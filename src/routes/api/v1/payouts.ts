import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { authenticateMerchant } from "./auth.server";
import { pawapay, getCorrespondentCode } from "@/lib/pawapay.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PayoutBody = z.object({
  amount: z.number().int().positive("Le montant doit être supérieur à zéro"),
  currency: z.string().default("XOF"),
  recipient_phone: z.string().min(8, "Numéro de téléphone invalide"),
  provider: z.string().default("Orange"),
  reference: z.string().optional(),
});

export const Route = createFileRoute("/api/v1/payouts")({
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

        const parsed = PayoutBody.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            { error: { code: "validation_error", message: parsed.error.issues[0].message } },
            { status: 400 }
          );
        }

        const { amount, currency, recipient_phone, provider, reference } = parsed.data;
        const correspondent = getCorrespondentCode(provider);

        if (auth.is_test && auth.profile_id === "00000000-0000-0000-0000-000000000000") {
          return Response.json({
            id: `po_${crypto.randomUUID().slice(0, 12)}`,
            status: "processing",
            amount,
            currency,
            recipient_phone,
            created_at: new Date().toISOString(),
          }, { status: 201 });
        }

        // Créer un lot de décaissement ou une transaction de retrait
        const { data: batch, error: batchErr } = await supabaseAdmin
          .from("payout_batches")
          .insert({
            owner_id: auth.profile_id,
            name: `[${correspondent}] ${reference || 'Payout API'} (${auth.prefix})`,
            total_amount: amount,
            currency,
            total_count: 1,
            status: "processing",
          })
          .select("id, created_at")
          .single();

        if (batchErr || !batch) {
          return Response.json({ error: { code: "db_error", message: "Impossible d'initier le payout." } }, { status: 500 });
        }

        const { data: item } = await supabaseAdmin
          .from("payout_batch_items")
          .insert({
            batch_id: batch.id,
            recipient_phone,
            recipient_name: recipient_phone, // recipient_name is required in schema
            amount,
            currency,
            provider: correspondent,
            status: "processing",
          })
          .select("id")
          .single();

        const payoutId = item?.id || batch.id;

        try {
          const res = await pawapay.initiatePayout({
            payoutId,
            amount,
            currency,
            phone: recipient_phone,
            provider,
            description: reference || "DolaPay Payout",
          });

          if (res.status === "REJECTED") {
            await supabaseAdmin.from("payout_batches").update({ status: "failed" }).eq("id", batch.id);
            await supabaseAdmin.from("payout_batch_items").update({ status: "failed" }).eq("id", payoutId);
            try {
              const { notifyPayoutStatus } = await import("@/lib/email.server");
              await notifyPayoutStatus(supabaseAdmin, payoutId, "failed", res.rejectionReason?.rejectionMessage || "Retrait refusé.");
            } catch (e) {
              console.error("Email notification error:", e);
            }
            return Response.json(
              { error: { code: "operator_rejected", message: res.rejectionReason?.rejectionMessage || "Retrait refusé." } },
              { status: 400 }
            );
          } else {
            try {
              const { notifyPayoutStatus } = await import("@/lib/email.server");
              await notifyPayoutStatus(supabaseAdmin, payoutId, "pending");
            } catch (e) {
              console.error("Email notification error:", e);
            }
          }
        } catch (err) {
          console.error("PawaPay payout error:", err);
        }

        // Déclencher une synchronisation immédiate du solde en base de données (sync-wallet)
        try {
          fetch(new URL("/api/public/sync-wallet", request.url).toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: auth.profile_id })
          }).catch(() => {});
        } catch {}

        return Response.json({
          id: batch.id,
          status: "processing",
          amount,
          currency,
          recipient_phone,
          created_at: batch.created_at,
        }, { status: 201 });
      },
    },
  },
});
