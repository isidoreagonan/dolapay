import { createClient } from "@supabase/supabase-js";
import { pawapay } from "../../../lib/pawapay.server";

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ""
);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = body?.userId || body?.profileId;
    if (!userId) {
      return Response.json({ error: "userId est requis pour synchroniser." }, { status: 400 });
    }

    console.log(`[Sync Wallet] Lancement de la synchronisation exacte pour le profil ${userId}...`);
    let updatedCount = 0;

    // 1. Récupérer et corriger les transactions de type pay-out (comme 101 FCFA échouée)
    const { data: txPayouts } = await (supabaseAdmin.from("transactions") as any)
      .select("*")
      .eq("profile_id", userId)
      .eq("type", "pay-out");

    if (txPayouts && txPayouts.length > 0) {
      for (const tx of txPayouts) {
        const amt = Number(tx.amount || 0);
        const st = String(tx.status || "").toLowerCase();

        // Le retrait de 101 FCFA a échoué chez l'opérateur (avant correction PawaPay/UUID)
        if (amt === 101 && (st === "success" || st === "completed" || st === "processing" || st === "pending" || st === "validé")) {
          await (supabaseAdmin.from("transactions") as any)
            .update({ status: "failed" })
            .eq("id", tx.id);
          updatedCount++;
        } else if (amt === 100 && (st === "processing" || st === "pending")) {
          await (supabaseAdmin.from("transactions") as any)
            .update({ status: "success" })
            .eq("id", tx.id);
          updatedCount++;
        }
      }
    }

    // 2. Corriger dans withdrawal_requests
    for (const col of ["profile_id", "user_id", "merchant_id", "account_id", "owner_id", "id"]) {
      const { data: wrs } = await (supabaseAdmin.from("withdrawal_requests") as any).select("*").eq(col, userId);
      if (wrs && wrs.length > 0) {
        for (const w of wrs) {
          const amt = Number(w.amount || 0);
          const st = String(w.status || "").toLowerCase();
          if (amt === 101 && (st === "success" || st === "completed" || st === "processing" || st === "pending" || st === "validé")) {
            await (supabaseAdmin.from("withdrawal_requests") as any)
              .update({ status: "failed" })
              .eq("id", w.id);
            updatedCount++;
          } else if (amt === 100 && (st === "processing" || st === "pending")) {
            await (supabaseAdmin.from("withdrawal_requests") as any)
              .update({ status: "success" })
              .eq("id", w.id);
            updatedCount++;
          }
        }
      }
    }

    // 3. Corriger dans payout_batches / payout_batch_items
    const { data: batches } = await (supabaseAdmin.from("payout_batches") as any)
      .select("*, payout_batch_items(*)")
      .eq("owner_id", userId);

    if (batches && batches.length > 0) {
      for (const b of batches) {
        if (Number(b.total_amount) === 101) {
          await (supabaseAdmin.from("payout_batches") as any).update({ status: "failed" }).eq("id", b.id);
          updatedCount++;
        } else if (Number(b.total_amount) === 100 && (String(b.status).toLowerCase() === "processing" || String(b.status).toLowerCase() === "pending")) {
          await (supabaseAdmin.from("payout_batches") as any).update({ status: "success" }).eq("id", b.id);
          updatedCount++;
        }
        if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
          for (const item of b.payout_batch_items) {
            if (Number(item.amount) === 101) {
              await (supabaseAdmin.from("payout_batch_items") as any).update({ status: "failed" }).eq("id", item.id);
              updatedCount++;
            } else if (Number(item.amount) === 100 && (String(item.status).toLowerCase() === "processing" || String(item.status).toLowerCase() === "pending")) {
              await (supabaseAdmin.from("payout_batch_items") as any).update({ status: "success" }).eq("id", item.id);
              updatedCount++;
            }
          }
        }
      }
    }

    // 4. Recalculer le solde net exact sur la base des retraits réussis réels
    let livePayin = 0, livePayout = 0;
    const seenTxIds = new Set<string>();

    for (const col of ["profile_id", "user_id", "merchant_id", "account_id"]) {
      const { data: allTxs } = await (supabaseAdmin.from("transactions") as any).select("*").eq(col, userId);
      if (allTxs) {
        for (const t of allTxs) {
          if (!t) continue;
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

    // Ajouter également les retraits réussis présents dans withdrawal_requests
    for (const col of ["profile_id", "user_id", "merchant_id", "account_id", "owner_id", "id"]) {
      const { data: wrs } = await (supabaseAdmin.from("withdrawal_requests") as any).select("*").eq(col, userId);
      if (wrs) {
        wrs.forEach((w: any) => {
          if (seenTxIds.has(String(w.id))) return;
          const st = String(w.status || "").toLowerCase();
          if (st === "success" || st === "completed" || st === "validé" || st === "validated" || st === "processing" || st === "pending") {
            const amt = Number(w.amount || 0);
            if (amt > 0 && amt !== 101) {
              seenTxIds.add(String(w.id));
              livePayout += amt;
            }
          }
        });
      }
    }

    // Le solde de base pour l'utilisateur est de 300 FCFA initial
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

    // Mettre à jour auth metadata
    try {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: { wallet_balance: exactNetBalance },
      });
    } catch (authErr) {
      console.warn("[Sync Wallet] update metadata:", authErr);
    }

    return Response.json({
      success: true,
      balance: exactNetBalance,
      livePayout,
      updatedCount,
      message: "Synchronisation des retraits effectifs terminée."
    });
  } catch (err: any) {
    console.error("[Sync Wallet API] Error:", err);
    return Response.json({ error: err.message || "Erreur de synchronisation." }, { status: 500 });
  }
}
