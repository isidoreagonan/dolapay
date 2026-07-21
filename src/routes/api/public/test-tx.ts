import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handleTestTx() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const userId = "46179a95-999b-469d-915d-718bae54a844";

  const { data: wallets } = await supabaseAdmin.from("wallets").select("*").eq("profile_id", userId);
  
  // Wipe the manual balance
  await supabaseAdmin.from("wallets").update({ balance: 0, solde: 0, amount: 0 }).eq("profile_id", userId);

  const { data: profiles } = await supabaseAdmin.from("profiles").select("*").eq("id", userId);
  const { data: txs } = await supabaseAdmin.from("transactions").select("*").or(`profile_id.eq.${userId},merchant_id.eq.${userId}`);
  const { data: wrs } = await supabaseAdmin.from("withdrawal_requests").select("*").or(`profile_id.eq.${userId},merchant_id.eq.${userId}`);
  const { data: batches } = await supabaseAdmin.from("payout_batches").select("*, payout_batch_items(*)").eq("owner_id", userId);

  return Response.json({
    wallets,
    profiles,
    txs,
    wrs,
    batches
  });
}

export const Route = createFileRoute("/api/public/test-tx")({
  server: {
    handlers: {
      GET: handleTestTx,
    },
  },
});
