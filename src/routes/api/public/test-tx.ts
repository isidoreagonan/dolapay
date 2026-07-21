import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handleTestTx() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
  );

  const { data: txData } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .eq("id", "babec1cc-e185-459e-aa76-f81e95413d7f")
    .maybeSingle();

  const { data: wrData } = await supabaseAdmin
    .from("withdrawal_requests")
    .select("*")
    .eq("id", "babec1cc-e185-459e-aa76-f81e95413d7f")
    .maybeSingle();

  const { data: pbiData } = await supabaseAdmin
    .from("payout_batch_items")
    .select("*")
    .eq("id", "babec1cc-e185-459e-aa76-f81e95413d7f")
    .maybeSingle();

  const testId = crypto.randomUUID();
  const txAttempt = await supabaseAdmin.from("transactions").insert({
    id: testId,
    profile_id: "46179a95-999b-469d-915d-718bae54a844",
    amount: 380,
    net_amount: 384,
    operator_fee: 0,
    gateway_fee: 4,
    dola_margin: 4,
    gateway: "pawapay",
    provider: "pawapay",
    currency: "XOF",
    type: "pay-out",
    status: "pending",
    description: `[RETRAIT_UI] BEN_MTN · 2290157385885`,
    payment_method: "MTN MoMo",
    customer_phone: "2290157385885",
  } as any);

  return Response.json({ txAttemptError: txAttempt.error });
}

export const Route = createFileRoute("/api/public/test-tx")({
  server: {
    handlers: {
      GET: handleTestTx,
    },
  },
});
