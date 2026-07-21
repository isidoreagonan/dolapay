import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { pawapay, getCorrespondentCode } from "@/lib/pawapay.server";
import { createLigdiCashPayin, type LigdiCashMethod } from "@/lib/ligdicash.server";
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

          const correspondent = getCorrespondentCode(provider, customer_phone);
          
          // Default to PawaPay, but route LigdiCash if Burkina
          let gateway = "pawapay";
          if (customer_phone.startsWith("226") && (provider.toUpperCase() === "ORANGE" || provider.toUpperCase() === "MOOV")) {
            gateway = "ligdicash";
          }

          // In test mode, bypass real gateways
          if (isTest) {
            const { data: tx, error: txErr } = await supabaseAdmin
              .from("transactions")
              .insert({
                profile_id: session.profile_id,
                amount: session.amount,
                currency: session.currency,
                type: "pay-in",
                status: "success",
                description: `[TEST] Checkout ${session.client_reference_id || sessionId}`,
                net_amount: session.amount,
                customer_phone,
                provider: gateway,
                payment_method: provider,
              } as any)
              .select("id")
              .single();

            if (!txErr && tx) {
              await supabaseAdmin.from("checkout_sessions").update({ transaction_id: tx.id }).eq("id", sessionId);
            }

            return Response.json({ id: tx?.id, status: "success" });
          }

          // Calculate fees for real transaction
          const margins = await calculateMargin(supabaseAdmin, session.amount, "pay-in", correspondent, gateway as any);

          // Create transaction
          const { data: tx, error: txErr } = await supabaseAdmin
            .from("transactions")
            .insert({
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
              customer_phone,
              provider: gateway,
              payment_method: provider,
            } as any)
            .select("id")
            .single();

          if (txErr || !tx) {
            console.error("DB Insert error:", txErr);
            return Response.json({ error: { message: "Erreur base de données." } }, { status: 500 });
          }
          const txId = tx.id;

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
            } else {
              await supabaseAdmin.from("transactions").update({ provider_tx_id: txId }).eq("id", txId);
            }
          } else if (gateway === "ligdicash") {
            const ligdiRes = await createLigdiCashPayin({
              amount: session.amount,
              description: `Checkout ${sessionId}`,
              customData: { transaction_id: txId, session_id: sessionId },
              customer: {
                firstname: session.customer_name?.split(" ")[0] || "Client",
                lastname: session.customer_name?.split(" ").slice(1).join(" ") || "DolaPay",
                phone: customer_phone,
              },
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
