import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/sync-tx")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Fetch all payout batch items
          const { data: wrs, error: wrErr } = await (supabaseAdmin.from("payout_batch_items") as any)
            .select("*, payout_batches(owner_id, created_at, fee_amount)");

          if (wrErr) throw wrErr;

          // Fetch all transactions
          const { data: txs, error: txErr } = await supabaseAdmin
            .from("transactions")
            .select("id, description, dola_margin");

          if (txErr) throw txErr;

          const txIds = new Set(txs.map((t: any) => t.id));
          const missing = wrs.filter((w: any) => !txIds.has(w.id));
          const toUpdate = txs.filter((t: any) => t.description === "[RETRAIT_UI] Synced from payout_batch_items" && t.dola_margin === 0);
          
          let inserted = 0;
          let updated = 0;
          const errors = [];

          // Fix previously synced transactions
          for (const tx of toUpdate) {
            const w = wrs.find((wr: any) => wr.id === tx.id);
            if (w) {
              const fee = w.payout_batches?.fee_amount || Math.round(w.amount * 0.02);
              const dola = Math.round(w.amount * 0.01);
              const { error: updErr } = await supabaseAdmin.from("transactions").update({
                net_amount: w.amount + fee,
                dola_margin: dola,
              }).eq("id", tx.id);
              
              if (updErr) {
                errors.push({ id: tx.id, error: updErr.message });
              } else {
                updated++;
              }
            }
          }

          for (const w of missing) {
            const txStatus = w.status === "processing" ? "pending" : (w.status === "completed" || w.status === "validé" ? "success" : w.status);
            
            const ownerId = w.payout_batches?.owner_id || w.profile_id || w.user_id;
            const fee = w.payout_batches?.fee_amount || Math.round(w.amount * 0.02);
            const dola = Math.round(w.amount * 0.01);

            const { error: insErr } = await supabaseAdmin.from("transactions").insert({
              id: w.id,
              profile_id: ownerId,
              amount: w.amount,
              net_amount: w.amount + fee,
              dola_margin: dola,
              currency: w.currency || "XOF",
              type: "pay-out",
              status: txStatus,
              description: `[RETRAIT_UI] Synced from payout_batch_items`,
              payment_method: w.method,
              customer_phone: w.recipient_phone,
              created_at: w.payout_batches?.created_at || new Date().toISOString(),
            } as any);

            if (insErr) {
              errors.push({ id: w.id, error: insErr.message });
            } else {
              inserted++;
            }
          }

          return Response.json({
            success: true,
            message: "Sync & Fix complete",
            total_items: wrs.length,
            missing_in_transactions: missing.length,
            successfully_inserted: inserted,
            successfully_updated: updated,
            errors
          });
        } catch (error: any) {
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      }
    }
  }
});
