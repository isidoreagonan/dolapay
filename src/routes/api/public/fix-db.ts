import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/fix-db")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        const { data: batches, error: bErr } = await supabaseAdmin.from("payout_batches").select("*, payout_batch_items(*)");
        if (bErr) return Response.json({ error: bErr.message });
        
        let count = 0;
        let errors = [];

        if (batches) {
          for (const b of batches) {
            if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
              for (const item of b.payout_batch_items) {
                const { data: tx } = await supabaseAdmin.from("transactions").select("id").eq("id", item.id).maybeSingle();
                if (!tx) {
                  const amt = Number(item.amount || b.total_amount || 0);
                  const st = amt === 101 ? "failed" : ((item.status === "completed" || item.status === "success" || item.status === "validé") ? "success" : (item.status === "failed" || item.status === "rejected" ? "failed" : "pending"));
                  
                  let prov = (item.provider || "MTN").toUpperCase();
                  if (prov.includes("MTN")) prov = "MTN";
                  else if (prov.includes("ORANGE")) prov = "ORANGE";
                  else if (prov.includes("MOOV")) prov = "MOOV";
                  else prov = "MTN";

                  const payload = {
                    id: item.id,
                    profile_id: b.owner_id,
                    amount: amt,
                    net_amount: amt,
                    currency: "XOF",
                    type: "pay-out",
                    status: st,
                    description: `Retrait Mobile Money - ${item.provider || "MOMO"} (${item.recipient_phone || "N/A"})`,
                    gateway: "pawapay",
                    provider: null, // This is the secret!
                    payment_method: prov,
                    customer_phone: item.recipient_phone || "N/A",
                    created_at: item.created_at || b.created_at,
                  };
                  
                  const { error: insertErr } = await supabaseAdmin.from("transactions").insert(payload);
                  if (insertErr) {
                    errors.push({ id: item.id, error: insertErr.message });
                  } else {
                    count++;
                  }
                }
              }
            }
          }
        }
        
        return Response.json({ success: true, inserted: count, errors });
      }
    }
  }
});
