import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { pawapay } from "@/lib/pawapay.server";

async function handleTestTx() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  // Find the most recent PawaPay transaction
  const { data: txs, error } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .eq("provider", "pawapay")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error || !txs || txs.length === 0) {
    return Response.json({ error: "No pawapay transactions found", details: error });
  }

  const results = [];
  for (const tx of txs) {
    const live = await pawapay.getDepositStatus(tx.id);
    results.push({
      id: tx.id,
      db_status: tx.status,
      created_at: tx.created_at,
      description: tx.description,
      pawapay_live: live
    });
  }

  return Response.json({ results });
}

export const Route = createFileRoute("/api/public/test-tx")({
  server: {
    handlers: {
      GET: handleTestTx,
    },
  },
});
