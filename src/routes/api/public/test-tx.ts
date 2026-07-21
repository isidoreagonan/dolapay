import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handleTestTx() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
  );

  const { data } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .eq("id", "babec1cc-e185-459e-aa76-f81e95413d7f")
    .maybeSingle();

  const { data: wrData } = await supabaseAdmin
    .from("withdrawal_requests")
    .select("*")
    .eq("id", "babec1cc-e185-459e-aa76-f81e95413d7f")
    .maybeSingle();

  return Response.json({ tx: data, wr: wrData });
}

export const Route = createFileRoute("/api/public/test-tx")({
  server: {
    handlers: {
      GET: handleTestTx,
    },
  },
});
