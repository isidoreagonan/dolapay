import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/sync-tx")({
  server: {
    handlers: {
      GET: async () => {
        try {
          // Fetch all payout batch items
          const { data: wrs, error: wrErr } = await (supabaseAdmin.from("payout_batch_items") as any)
            .select("*, payout_batches(owner_id)")
            .order("created_at", { ascending: false });

          if (wrErr) throw wrErr;

          // Fetch all transactions
          const { data: txs, error: txErr } = await supabaseAdmin
            .from("transactions")
            .select("id");

          if (txErr) throw txErr;

          const txIds = new Set(txs.map((t: any) => t.id));
          const missing = wrs.filter((w: any) => !txIds.has(w.id));
          
          let inserted = 0;
          const errors = [];

          for (const w of missing) {
            const txStatus = w.status === "processing" ? "pending" : (w.status === "completed" || w.status === "validé" ? "success" : w.status);
            
            const ownerId = w.payout_batches?.owner_id || w.profile_id || w.user_id;

            const { error: insErr } = await supabaseAdmin.from("transactions").insert({
              id: w.id,
              profile_id: ownerId,
              amount: w.amount,
              currency: w.currency || "XOF",
              type: "pay-out",
              status: txStatus,
              description: `[RETRAIT_UI] Synced from payout_batch_items`,
              payment_method: w.method,
              customer_phone: w.recipient_phone,
              created_at: w.created_at,
            } as any);

            if (insErr) {
              errors.push({ id: w.id, error: insErr.message });
            } else {
              inserted++;
            }
          }

          return Response.json({
            success: true,
            message: "Sync complete",
            total_items: wrs.length,
            missing_in_transactions: missing.length,
            successfully_inserted: inserted,
            errors
          });
        } catch (error: any) {
          return Response.json({ success: false, error: error.message }, { status: 500 });
        }
      }
    }
  }
});
