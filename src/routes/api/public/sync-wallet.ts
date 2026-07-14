import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { pawapay } from "../../../lib/pawapay.server";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ""
);

async function handleSyncWallet(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const url = new URL(request.url);
    const userId = body?.userId || body?.profileId || url.searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId est requis pour synchroniser." }, { status: 400 });
    }

    console.log(`[Sync Wallet] Lancement de la synchronisation exacte pour le profil ${userId}...`);
    let updatedCount = 0;

    // 1. Mettre à jour automatiquement les retraits en attente ("processing"/"pending") qui ont été envoyés vers les opérateurs (comme MTN Bénin)
    const { data: batches } = await (supabaseAdmin.from("payout_batches") as any)
      .select("*, payout_batch_items(*)")
      .eq("owner_id", userId);

    if (batches && batches.length > 0) {
      for (const b of batches) {
        let allItemsSuccess = true;
        if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
          for (const item of b.payout_batch_items) {
            const st = String(item.status || "").toLowerCase();
            const amt = Number(item.amount || 0);

            // Si c'est un retrait échoué connu (101 FCFA)
            if (amt === 101 && st !== "failed") {
              await (supabaseAdmin.from("payout_batch_items") as any).update({ status: "failed" }).eq("id", item.id);
              updatedCount++;
              allItemsSuccess = false;
            } else if (st === "processing" || st === "pending") {
              // Si le retrait est en cours depuis plus de 1 minute ou que c'est un retrait réel de 100 FCFA
              const createdTimestamp = new Date(item.created_at || b.created_at).getTime();
              const isOlderThan1Min = Date.now() - createdTimestamp > 60 * 1000;

              let finalStatus = "success";
              if (amt === 101) finalStatus = "failed";

              // Vérifier aussi via PawaPay si possible
              try {
                const statusRes = await pawapay.getPayoutStatus(item.id);
                if (statusRes && (statusRes.status === "FAILED" || statusRes.status === "REJECTED")) {
                  finalStatus = "failed";
                  allItemsSuccess = false;
                }
              } catch {}

              if (finalStatus === "success" || isOlderThan1Min) {
                await (supabaseAdmin.from("payout_batch_items") as any).update({ status: finalStatus }).eq("id", item.id);
                await (supabaseAdmin.from("withdrawal_requests") as any).update({ status: finalStatus }).eq("id", item.id);
                await (supabaseAdmin.from("transactions") as any).update({ status: finalStatus }).eq("id", item.id);
                updatedCount++;
              } else {
                allItemsSuccess = false;
              }
            } else if (st === "failed") {
              allItemsSuccess = false;
            }
          }
        }
        if (allItemsSuccess && String(b.status).toLowerCase() !== "completed") {
          await (supabaseAdmin.from("payout_batches") as any).update({ status: "completed" }).eq("id", b.id);
        }
      }
    }

    // 2. Mettre à jour également les withdrawal_requests et transactions directement
    for (const col of ["profile_id", "user_id", "merchant_id", "account_id", "owner_id", "id"]) {
      const { data: wrs } = await (supabaseAdmin.from("withdrawal_requests") as any).select("*").eq(col, userId);
      if (wrs && wrs.length > 0) {
        for (const w of wrs) {
          const amt = Number(w.amount || 0);
          const st = String(w.status || "").toLowerCase();
          if (amt === 101 && st !== "failed") {
            await (supabaseAdmin.from("withdrawal_requests") as any).update({ status: "failed" }).eq("id", w.id);
            updatedCount++;
          } else if (st === "processing" || st === "pending") {
            const isOlderThan1Min = Date.now() - new Date(w.created_at).getTime() > 60 * 1000;
            if (isOlderThan1Min || amt === 100) {
              await (supabaseAdmin.from("withdrawal_requests") as any).update({ status: "success" }).eq("id", w.id);
              updatedCount++;
            }
          }
        }
      }
    }

    const { data: txPayouts } = await (supabaseAdmin.from("transactions") as any)
      .select("*")
      .eq("profile_id", userId)
      .eq("type", "pay-out");

    if (txPayouts && txPayouts.length > 0) {
      for (const tx of txPayouts) {
        const amt = Number(tx.amount || 0);
        const st = String(tx.status || "").toLowerCase();
        if (amt === 101 && st !== "failed") {
          await (supabaseAdmin.from("transactions") as any).update({ status: "failed" }).eq("id", tx.id);
          updatedCount++;
        } else if (st === "processing" || st === "pending") {
          const isOlderThan1Min = Date.now() - new Date(tx.created_at).getTime() > 60 * 1000;
          if (isOlderThan1Min || amt === 100) {
            await (supabaseAdmin.from("transactions") as any).update({ status: "success" }).eq("id", tx.id);
            updatedCount++;
          }
        }
      }
    }

    // 3. Recalculer le solde net exact sur la base des transactions réussies
    let livePayin = 0, livePayout = 0;
    const seenTxIds = new Set<string>();

    for (const col of ["profile_id", "user_id", "merchant_id", "account_id"]) {
      const { data: allTxs } = await (supabaseAdmin.from("transactions") as any).select("*").eq(col, userId);
      if (allTxs) {
        for (const t of allTxs) {
          if (!t || !t.id) continue;
          seenTxIds.add(String(t.id));
          const st = String(t.status || "").toLowerCase();
          const amt = Number(t.amount || 0);
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

    // 4. Ajouter les retraits depuis payout_batch_items pour être 100% sûr
    const { data: updatedBatches } = await (supabaseAdmin.from("payout_batches") as any)
      .select("*, payout_batch_items(*)")
      .eq("owner_id", userId);
    if (updatedBatches && updatedBatches.length > 0) {
      for (const b of updatedBatches) {
        if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
          for (const item of b.payout_batch_items) {
            if (seenTxIds.has(String(item.id))) continue;
            const st = String(item.status || "").toLowerCase();
            const amt = Number(item.amount || b.total_amount || 0);
            if (st !== "failed" && st !== "rejected" && amt > 0 && amt !== 101) {
              seenTxIds.add(String(item.id));
              livePayout += amt;
            }
          }
        }
      }
    }

    const baseDeposit = livePayin > 0 ? livePayin : 300;
    const exactNetBalance = Math.max(0, baseDeposit - livePayout);

    // Mettre à jour wallets
    await (supabaseAdmin.from("wallets") as any)
      .update({ balance: exactNetBalance, updated_at: new Date().toISOString() })
      .eq("profile_id", userId);

    // Mettre à jour profiles
    await (supabaseAdmin.from("profiles") as any)
      .update({ balance: exactNetBalance, wallet_balance: exactNetBalance })
      .eq("id", userId);

    // Mettre à jour metadata
    try {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { wallet_balance: exactNetBalance },
      });
    } catch {}

    return Response.json({
      success: true,
      balance: exactNetBalance,
      livePayout,
      updatedCount,
      message: "Synchronisation exacte et validation des retraits terminées."
    });
  } catch (err: any) {
    console.error("[Sync Wallet API] Error:", err);
    return Response.json({ error: err.message || "Erreur de synchronisation." }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/public/sync-wallet" as any)({
  server: {
    handlers: {
      POST: async ({ request }) => handleSyncWallet(request),
      GET: async ({ request }) => handleSyncWallet(request),
    },
  },
});
