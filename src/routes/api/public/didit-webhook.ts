import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Didit verification webhook.
 * Signature: HMAC-SHA256(body, DIDIT_WEBHOOK_SECRET) sent as `x-signature` header.
 * On a successful decision, updates `business_representatives.verified` for the
 * matching `didit_session_id`.
 */
export const Route = createFileRoute("/api/public/didit-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.DIDIT_WEBHOOK_SECRET;
        if (!secret) return new Response("Webhook not configured", { status: 503 });

        const sig = request.headers.get("x-signature") ?? "";
        const body = await request.text();

        const expected = createHmac("sha256", secret).update(body).digest("hex");
        const a = Buffer.from(sig);
        const b = Buffer.from(expected);
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: {
          session_id?: string;
          status?: string;
          decision?: { status?: string; face_match?: { score?: number }; liveness?: { score?: number } };
          vendor_data?: string;
        };
        try {
          payload = JSON.parse(body);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        const sessionId = payload.session_id;
        if (!sessionId) return new Response("Missing session_id", { status: 400 });

        const decision = payload.decision?.status ?? payload.status ?? "unknown";
        const approved = decision === "Approved" || decision === "approved";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const updates: Record<string, unknown> = {
          didit_status: decision,
          ai_verification_log: {
            provider: "didit",
            decision,
            face_match_score: payload.decision?.face_match?.score ?? null,
            liveness_score: payload.decision?.liveness?.score ?? null,
            received_at: new Date().toISOString(),
          },
        };
        if (approved) {
          updates.verified = true;
          updates.verified_at = new Date().toISOString();
        }

        const { error } = await supabaseAdmin
          .from("business_representatives")
          .update(updates as never)
          .eq("didit_session_id", sessionId);

        if (error) {
          console.error("Didit webhook update failed", error);
          return new Response("DB update failed", { status: 500 });
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
