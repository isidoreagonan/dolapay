import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data, error } = await supabaseAdmin.rpc('get_schema_info', { query: "SELECT pg_get_constraintdef(c.oid) AS def FROM pg_constraint c JOIN pg_class t ON c.conrelid = t.oid WHERE t.relname = 'kyc_documents' AND c.conname = 'kyc_documents_document_type_check'" });

    if (error) {
      // If RPC doesn't exist, we can't run raw SQL easily via the JS client.
      // But maybe we can read the enum values
      return new Response(JSON.stringify({ error: error.message }), { headers: { "Content-Type": "application/json" }});
    }

    return new Response(JSON.stringify({ data }), { headers: { "Content-Type": "application/json" }});
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { "Content-Type": "application/json" }});
  }
});
