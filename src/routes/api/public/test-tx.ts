import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handleTestTx() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
  );

  const payoutId = "babec1cc-e185-459e-aa76-f81e95413d7f";

  const { data: pbi } = await supabaseAdmin.from("payout_batch_items").select("*").eq("id", payoutId).maybeSingle();
  
  if (!pbi) return Response.json({ error: "pbi not found" });

  const { data: prof } = await supabaseAdmin.from("payout_batches").select("owner_id").eq("id", pbi.batch_id).maybeSingle();

  const txAttempt = await supabaseAdmin.from("transactions").insert({
    id: payoutId,
    profile_id: prof?.owner_id || "46179a95-999b-469d-915d-718bae54a844",
    amount: pbi.amount,
    net_amount: pbi.amount + 4,
    operator_fee: 0,
    gateway_fee: 4, // 1% of 380 = ~4
    dola_margin: 0, 
    gateway: "pawapay",
    provider: "pawapay",
    currency: "XOF",
    type: "pay-out",
    status: pbi.status,
    description: `[RETRAIT_UI] BEN_MTN · ${pbi.recipient_phone}`,
    payment_method: pbi.provider,
    customer_phone: pbi.recipient_phone,
  } as any);

  return Response.json({ success: true, txAttemptError: txAttempt.error });
}

export const Route = createFileRoute("/api/public/test-tx")({
  server: {
    handlers: {
      GET: handleTestTx,
    },
  },
});
