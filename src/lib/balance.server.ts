import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Calcule le solde net exact d'un utilisateur en analysant toutes ses transactions.
 * Remplace les calculs manuels et les requêtes HTTP internes (qui peuvent timeout sur Vercel).
 */
export async function calculateExactBalance(supabaseAdmin: SupabaseClient, userId: string): Promise<number> {
  let livePayin = 0;
  let livePayout = 0;
  const seenTxIds = new Set<string>();

  for (const col of ["profile_id", "user_id", "merchant_id", "account_id"]) {
    const { data: allTxs } = await (supabaseAdmin.from("transactions") as any).select("*").eq(col, userId);
    if (allTxs) {
      for (const t of allTxs) {
        if (!t || !t.id) continue;
        seenTxIds.add(String(t.id));
        const st = String(t.status || "").toLowerCase();
        const amt = Number(t.net_amount || t.amount || 0);
        const desc = String(t.description || "").toLowerCase();
        const mode = String((t as any).mode || "").toLowerCase();
        const isTestTx = desc.includes("_test") || desc.includes("sandbox") || mode === "test" || mode === "sandbox";
        const isPayout = String(t.type || "").toLowerCase().includes("payout") || String(t.type || "").toLowerCase().includes("pay-out") || String(t.type || "").toLowerCase().includes("withdraw");
        const isCompletedSuccess = st === "completed" || st === "successful" || st === "success" || st === "paid" || st === "validé" || st === "validated" || st === "settled" || st === "ok" || st === "confirmed";

        if (isPayout) {
          if (!isTestTx && amt > 0 && amt !== 101 && st !== "failed" && st !== "rejected") {
            livePayout += amt;
          }
        } else {
          if (!isTestTx && isCompletedSuccess && amt > 0) {
            livePayin += amt;
          }
        }
      }
    }
  }

  const { data: wrs } = await (supabaseAdmin.from("withdrawal_requests") as any)
    .select("*")
    .eq("profile_id", userId);
    
  if (wrs) {
    for (const w of wrs) {
      if (!w || !w.id || seenTxIds.has(String(w.id))) continue;
      const st = String(w.status || "").toLowerCase();
      const amt = Number(w.amount || 0);
      if (st === "success" || st === "completed" || st === "processing" || st === "validé" || st === "validated" || st === "pending") {
        if (amt > 0 && amt !== 101) {
          seenTxIds.add(String(w.id));
          livePayout += amt;
        }
      }
    }
  }

  const { data: updatedBatches } = await (supabaseAdmin.from("payout_batches") as any)
    .select("*, payout_batch_items(*)")
    .eq("owner_id", userId);
    
  if (updatedBatches && updatedBatches.length > 0) {
    for (const b of updatedBatches) {
      if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
        for (const item of b.payout_batch_items) {
          if (seenTxIds.has(String(item.id))) continue;
          const st = String(item.status || "").toLowerCase();
          const amt = Number(item.amount || b.total_amount || 0) + Number(b.fee_amount || 0);
          if (st !== "failed" && st !== "rejected" && amt > 0 && amt !== 101) {
            seenTxIds.add(String(item.id));
            livePayout += amt;
          }
        }
      }
    }
  }

  const exactNetBalance = Math.max(0, livePayin - livePayout);
  return exactNetBalance;
}
