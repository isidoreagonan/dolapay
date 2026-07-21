import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handleTestFees() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
  );

  const { data } = await supabaseAdmin
    .from("fee_structures")
    .select("*")
    .eq("transaction_type", "pay-out");

  return Response.json({ fees: data });
}

export const Route = createFileRoute("/api/public/test-fees")({
  server: {
    handlers: {
      GET: handleTestFees,
    },
  },
});
