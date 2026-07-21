import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

async function handleTestTx() {
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  const userId = "46179a95-999b-469d-915d-718bae54a844";

  // Wipe the ghost balance from user_metadata
  const uRes = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: { wallet_balance: 0 }
  });
  
  // Wipe from profiles just in case
  await supabaseAdmin.from("profiles").update({ wallet_balance: 0 } as any).eq("id", userId);

  const { data: txs } = await supabaseAdmin.from("transactions").select("*").or(`profile_id.eq.${userId},merchant_id.eq.${userId}`);
  const { data: wrs } = await supabaseAdmin.from("withdrawal_requests").select("*").or(`profile_id.eq.${userId},merchant_id.eq.${userId}`);
  const { data: batches } = await supabaseAdmin.from("payout_batches").select("*, payout_batch_items(*)").eq("owner_id", userId);

  let livePayin = 0, livePayout = 0;
  const seenIds = new Set<string>();

  if (txs) {
    txs.forEach((t: any) => {
      const st = String(t.status || "").toLowerCase();
      if (st === "completed" || st === "successful" || st === "success" || st === "paid" || st === "validé" || st === "validated" || st === "settled" || st === "ok" || st === "confirmed") {
        const amt = Number(t.net_amount || t.amount || 0);
        const desc = String(t.description || "").toLowerCase();
        const mode = String((t as any).mode || "").toLowerCase();
        const isTestTx = desc.includes("_test") || desc.includes("sandbox") || mode === "test" || mode === "sandbox";
        if (!isTestTx) {
          if (t.id) seenIds.add(String(t.id));
          const isPayout = String(t.type || "").toLowerCase().includes("payout") || String(t.type || "").toLowerCase().includes("withdraw");
          if (isPayout) livePayout += amt;
          else livePayin += amt;
        }
      }
    });
  }

  if (wrs) {
    wrs.forEach((w: any) => {
      const st = String(w.status || "").toLowerCase();
      if (st === "success" || st === "completed" || st === "processing" || st === "validé" || st === "validated" || st === "pending") {
        if (!seenIds.has(String(w.id))) {
          seenIds.add(String(w.id));
          const amt = Number(w.amount || 0);
          if (amt > 0) livePayout += amt;
        }
      }
    });
  }

  if (batches) {
    batches.forEach((b: any) => {
      if (b.payout_batch_items) {
        b.payout_batch_items.forEach((item: any) => {
          const st = String(item.status || "").toLowerCase();
          if (st === "success" || st === "completed" || st === "validé" || st === "validated" || st === "processing" || st === "pending") {
            if (!seenIds.has(String(item.id))) {
              seenIds.add(String(item.id));
              const amt = Number(item.amount || b.total_amount || 0);
              if (amt > 0) livePayout += amt;
            }
          }
        });
      }
    });
  }

  return Response.json({ livePayin, livePayout, bestBalance: Math.max(0, livePayin - livePayout) });
}

export const Route = createFileRoute("/api/public/test-tx")({
  server: {
    handlers: {
      GET: handleTestTx,
    },
  },
});
