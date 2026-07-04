import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const DIDIT_BASE = "https://verification.didit.me/v1";

/**
 * Creates a Didit verification session for a single representative.
 * When DIDIT_API_KEY is not configured, returns a simulated session so
 * the UI keeps working in development / preview.
 */
export const createDiditSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { full_name: string; email: string; representative_local_id: string }) => {
    if (!input.full_name || !input.email) throw new Error("full_name and email required");
    return input;
  })
  .handler(async ({ data, context }) => {
    const apiKey = process.env.DIDIT_API_KEY;
    const workflowId = process.env.DIDIT_WORKFLOW_ID;

    // Simulation fallback — keeps preview working without secrets.
    if (!apiKey || !workflowId) {
      const fakeId = `sim_${crypto.randomUUID()}`;
      return {
        simulated: true,
        session_id: fakeId,
        verification_url: null as string | null,
        status: "pending",
      };
    }

    // Real Didit session creation
    const callbackUrl = `${process.env.PUBLIC_SITE_URL ?? process.env.VITE_SITE_URL ?? "https://dola-pay.com"}/api/webhooks/didit`;
    const res = await fetch(`${DIDIT_BASE}/session/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        callback: callbackUrl,
        vendor_data: JSON.stringify({
          profile_id: context.userId,
          rep_local_id: data.representative_local_id,
        }),
        contact_details: {
          email: data.email,
          email_lang: "fr",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Didit session creation failed: ${err.slice(0, 200)}`);
    }

    const json = (await res.json()) as { session_id: string; url: string; status: string };
    return {
      simulated: false,
      session_id: json.session_id,
      verification_url: json.url,
      status: json.status,
    };
  });

/**
 * Creates a Didit KYB verification session for the entire business / company.
 */
export const createDiditBusinessSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { company_name: string; country: string; registration_number?: string; email: string }) => {
    if (!input.company_name || !input.email) throw new Error("company_name and email required");
    return input;
  })
  .handler(async ({ data, context }) => {
    const apiKey = process.env.DIDIT_API_KEY;
    const workflowId = process.env.DIDIT_WORKFLOW_ID;

    if (!apiKey || !workflowId) {
      const fakeId = `sim_bus_${crypto.randomUUID()}`;
      return {
        simulated: true,
        session_id: fakeId,
        verification_url: null as string | null,
        status: "pending",
      };
    }

    const callbackUrl = `${process.env.PUBLIC_SITE_URL ?? process.env.VITE_SITE_URL ?? "https://dola-pay.com"}/api/webhooks/didit`;
    const res = await fetch(`${DIDIT_BASE}/session/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        workflow_id: workflowId,
        callback: callbackUrl,
        vendor_data: JSON.stringify({
          profile_id: context.userId,
          company_name: data.company_name,
          registration_number: data.registration_number,
        }),
        contact_details: {
          email: data.email,
          email_lang: "fr",
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Didit KYB session creation failed: ${err.slice(0, 200)}`);
    }

    const json = (await res.json()) as { session_id: string; url: string; status: string };
    return {
      simulated: false,
      session_id: json.session_id,
      verification_url: json.url,
      status: json.status,
    };
  });


/**
 * Marks a representative as verified locally. In simulation mode the client
 * calls this after the animated modal completes. In production the webhook
 * does the same write — this becomes a no-op for already-verified rows.
 */
export const markRepresentativeSimVerified = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { session_id: string }) => input)
  .handler(async ({ data, context }) => {
    if (!data.session_id.startsWith("sim_")) {
      throw new Error("Only simulation sessions may be auto-verified");
    }
    // Just confirm the user context — actual rep persistence happens at submit.
    return { ok: true, profile_id: context.userId };
  });
