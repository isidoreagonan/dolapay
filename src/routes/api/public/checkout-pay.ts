import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { pawapay, getCorrespondentCode } from "@/lib/pawapay.server";
import { initiateLigdiCashPayin, type LigdiCashMethod } from "@/lib/ligdicash.server";
import { calculateMargin } from "@/lib/margins.server";

const bodySchema = z.object({
  sessionId: z.string(),
  customer_phone: z.string(),
  provider: z.string(),
});

export const Route = createFileRoute("/api/public/checkout-pay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { sessionId, customer_phone, provider } = bodySchema.parse(body);

          const isTest = sessionId.startsWith("cs_test_");

          // Fetch the checkout session
          const { data: session, error: sessErr } = await supabaseAdmin
            .from("checkout_sessions")
            .select("*")
            .eq("id", sessionId)
            .maybeSingle();

          if (sessErr || !session) {
            return Response.json({ error: { message: "Session introuvable." } }, { status: 404 });
          }

          if (session.status !== "open") {
            return Response.json({ error: { message: "Session déjà traitée ou expirée." } }, { status: 400 });
          }

          const correspondent = getCorrespondentCode(provider);
          
          // Default to PawaPay, but route LigdiCash if Burkina
          let gateway = "pawapay";
          if (customer_phone.startsWith("226") && (provider.toUpperCase() === "ORANGE" || provider.toUpperCase() === "MOOV")) {
            gateway = "ligdicash";
          }

          // In test mode, bypass real gateways
          if (isTest) {
            const txId = `ch_${crypto.randomUUID().slice(0, 12)}`;
            const { error: txErr } = await supabaseAdmin
              .from("transactions")
              .insert({
                id: txId,
                profile_id: session.profile_id,
                amount: session.amount,
                currency: session.currency,
                type: "pay-in",
                status: "success",
                description: `[TEST] Checkout ${session.client_reference_id || sessionId}`,
                net_amount: session.amount,
                operator_fee: 0,
                gateway_fee: 0,
                dola_margin: 0,
                gateway,
                customer_phone,
                provider: gateway,
                payment_method: provider,
              } as any);

            if (!txErr) {
              await supabaseAdmin.from("checkout_sessions").update({ transaction_id: txId }).eq("id", sessionId);
            }

            return Response.json({ id: txId, status: "success" });
          }

          // Calculate fees for real transaction
          const margins = await calculateMargin(supabaseAdmin, session.amount, "pay-in", correspondent, gateway as any);

          // Create transaction
          const txId = `ch_${crypto.randomUUID().slice(0, 12)}`;
          const { error: txErr } = await supabaseAdmin
            .from("transactions")
            .insert({
              id: txId,
              profile_id: session.profile_id,
              amount: session.amount,
              currency: session.currency,
              type: "pay-in",
              status: "pending",
              description: `Checkout ${session.client_reference_id || sessionId}`,
              net_amount: margins.net_amount,
              operator_fee: margins.operator_fee,
              gateway_fee: margins.gateway_fee,
              dola_margin: margins.dola_margin,
              gateway,
              customer_phone,
              provider: gateway,
              payment_method: provider,
            } as any);

          if (txErr) {
            console.error("DB Insert error:", txErr);
            return Response.json({ error: { message: "Erreur base de données." } }, { status: 500 });
          }

          // Link transaction to session
          await supabaseAdmin.from("checkout_sessions").update({ transaction_id: txId }).eq("id", sessionId);

          // Dispatch to actual gateway
          if (gateway === "pawapay") {
            const res = await pawapay.initiateDeposit({
              depositId: txId,
              amount: session.amount,
              currency: session.currency,
              phone: customer_phone,
              provider,
              description: `Checkout ${sessionId}`,
            });

            if (res.status === "REJECTED") {
              await supabaseAdmin.from("transactions").update({ status: "failed" }).eq("id", txId);
              return Response.json({ error: { message: res.rejectionReason?.rejectionMessage || "Rejeté par PawaPay." } }, { status: 400 });
            }
          } else if (gateway === "ligdicash") {
            const ligdiRes = await initiateLigdiCashPayin({
              amount: session.amount,
              custom_data: { transaction_id: txId, session_id: sessionId },
              customer: customer_phone,
              method: provider.toUpperCase() as LigdiCashMethod,
            });
            if (ligdiRes.response_text !== "success") {
              await supabaseAdmin.from("transactions").update({ status: "failed" }).eq("id", txId);
              return Response.json({ error: { message: ligdiRes.description || "Rejeté par LigdiCash." } }, { status: 400 });
            }
            if (ligdiRes.token) {
              await supabaseAdmin.from("transactions").update({ ligdicash_token: ligdiRes.token } as any).eq("id", txId);
            }
          }

          return Response.json({ id: txId, status: "pending" });
        } catch (err: any) {
          console.error("Checkout Pay Error:", err);
          return Response.json({ error: { message: err.message || "Erreur interne." } }, { status: 500 });
        }
      },
    },
  },
});
