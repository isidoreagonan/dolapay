import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Dispatches a webhook event to all active endpoints for a given profile.
 * Signs the payload with HMAC SHA256 using the endpoint's secret.
 */
export async function dispatchWebhook(
  supabaseAdmin: SupabaseClient,
  profileId: string,
  eventType: string,
  payload: any
) {
  try {
    // 1. Fetch active webhooks for this profile
    const { data: endpoints, error } = await supabaseAdmin
      .from("webhook_endpoints")
      .select("id, url, secret")
      .eq("profile_id", profileId)
      .eq("active", true);

    if (error) {
      console.error("[Webhooks] Failed to fetch endpoints:", error.message);
      return;
    }

    if (!endpoints || endpoints.length === 0) {
      return; // No active webhooks
    }

    const eventPayload = {
      id: `evt_${crypto.randomUUID().replace(/-/g, "")}`,
      type: eventType,
      created_at: new Date().toISOString(),
      data: payload,
    };

    const payloadString = JSON.stringify(eventPayload);
    const encoder = new TextEncoder();

    // 2. Dispatch to each endpoint
    for (const endpoint of endpoints) {
      try {
        // Create HMAC SHA256 signature using Web Crypto API (Edge compatible)
        const key = await crypto.subtle.importKey(
          "raw",
          encoder.encode(endpoint.secret),
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );
        const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payloadString));
        const signatureArray = Array.from(new Uint8Array(signatureBuffer));
        const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        const timestamp = Date.now();
        const signatureHeader = `t=${timestamp},v1=${signatureHex}`;

        // Send async, do not await the fetch to not block the main process
        fetch(endpoint.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Dola-Signature": signatureHeader,
            "User-Agent": "DolaPay-Webhook-Dispatcher/1.0",
          },
          body: payloadString,
          // A short timeout can be implemented with AbortController, but global fetch is usually fine
        }).then(res => {
          if (!res.ok) {
            console.warn(`[Webhooks] Failed delivery to ${endpoint.url} with status ${res.status}`);
          } else {
            console.log(`[Webhooks] Successful delivery to ${endpoint.url} for event ${eventType}`);
          }
        }).catch(err => {
          console.warn(`[Webhooks] Network error delivering to ${endpoint.url}:`, err.message);
        });
      } catch (e: any) {
        console.error(`[Webhooks] Cryptography error for ${endpoint.url}:`, e.message);
      }
    }
  } catch (err: any) {
    console.error("[Webhooks] Global dispatcher error:", err.message);
  }
}
