import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { authenticateMerchant } from "../auth.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CreateSessionSchema = z.object({
  amount: z.number().int().min(100, "Le montant minimum est de 100 FCFA"),
  currency: z.enum(["XOF", "XAF", "USD"]).default("XOF"),
  success_url: z.string().url("URL de succès invalide").max(1000),
  cancel_url: z.string().url("URL d'annulation invalide").max(1000).optional(),
  client_reference_id: z.string().max(255).optional(),
  customer_email: z.string().email("Email invalide").optional(),
  customer_name: z.string().max(255).optional(),
});

export const Route = createFileRoute("/api/v1/checkout/sessions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Authenticate the merchant using their API Key
        const auth = await authenticateMerchant(request);
        if (auth instanceof Response) return auth;

        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: { code: "invalid_json", message: "Corps JSON invalide." } }, { status: 400 });
        }

        const parsed = CreateSessionSchema.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            { error: { code: "validation_error", message: parsed.error.issues[0].message } },
            { status: 400 }
          );
        }

        const data = parsed.data;

        // Generate Session ID
        const prefix = auth.is_test ? "cs_test_" : "cs_live_";
        const sessionId = `${prefix}${crypto.randomUUID().replace(/-/g, "")}`;

        // Insert into database
        const { error: insertError } = await supabaseAdmin
          .from("checkout_sessions")
          .insert({
            id: sessionId,
            profile_id: auth.profile_id,
            amount: data.amount,
            currency: data.currency,
            success_url: data.success_url,
            cancel_url: data.cancel_url || null,
            client_reference_id: data.client_reference_id || null,
            customer_email: data.customer_email || null,
            customer_name: data.customer_name || null,
            status: "open",
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          });

        if (insertError) {
          console.error("DB Error creating checkout session:", insertError);
          return Response.json({ error: { code: "db_error", message: "Impossible de créer la session de paiement." } }, { status: 500 });
        }

        const origin = new URL(request.url).origin;
        // Build the hosted checkout URL
        const checkoutUrl = `${origin}/checkout/${sessionId}`;

        return Response.json({
          id: sessionId,
          url: checkoutUrl,
          status: "open",
          amount: data.amount,
          currency: data.currency,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });
      },
    },
  },
});
