import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handleTestTx() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
  );

  // Delete the accidental test transactions I generated during debugging
  const { data, error } = await supabaseAdmin
    .from("transactions")
    .delete()
    .eq("status", "pending")
    .eq("amount", 380)
    .eq("description", "[RETRAIT_UI] BEN_MTN · 2290157385885")
    .select("id");

  return Response.json({ success: true, deleted: data, error });
}

export const Route = createFileRoute("/api/public/test-tx")({
  server: {
    handlers: {
      GET: handleTestTx,
    },
  },
});
