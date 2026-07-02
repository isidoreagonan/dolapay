import { supabaseAdmin } from "@/integrations/supabase/client.server";

export async function authenticateMerchant(
  request: Request
): Promise<{ profile_id: string; prefix: string; is_test: boolean } | Response> {
  const authHeader = request.headers.get("Authorization") || request.headers.get("x-api-key") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return Response.json(
      { error: { code: "unauthorized", message: "Clé API manquante. En-tête Authorization: Bearer <API_KEY> requis." } },
      { status: 401 }
    );
  }

  const isTest = token.startsWith("test_") || token.includes("test");

  // Hash SHA-256 du token pour vérification dans la base api_keys
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  const hashed = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const { data: keyData, error } = await supabaseAdmin
    .from("api_keys")
    .select("profile_id, revoked_at, prefix")
    .eq("hashed_key", hashed)
    .maybeSingle();

  if (error || !keyData || keyData.revoked_at) {
    // Si le développeur teste avec la clé d'exemple de la documentation (test_sk_dola_xxxxxx)
    if (token.startsWith("test_sk_")) {
      return {
        profile_id: "00000000-0000-0000-0000-000000000000",
        prefix: "test_sk_dola",
        is_test: true,
      };
    }
    return Response.json(
      { error: { code: "invalid_api_key", message: "Clé API invalide ou révoquée." } },
      { status: 401 }
    );
  }

  return { profile_id: keyData.profile_id, prefix: keyData.prefix, is_test: isTest };
}
