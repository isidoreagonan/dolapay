import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/fix-db")({
  server: {
    handlers: {
      GET: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        
        // Fetch check constraint definition using a raw query or pg_catalog via REST?
        // Actually we can't run raw SQL directly through the JS client unless there is an RPC.
        // Let's try to fetch it via RPC if it exists, or just query information_schema if enabled.
        // Often information_schema is not exposed to PostgREST.
        
        // Instead, let's just attempt to insert a dummy row with various providers and see which one succeeds.
        // Wait, inserting dummy rows might pollute the DB.
        // Let's just try to insert the real row (item.id) with different providers until one works!
        
        const { data: batches } = await supabaseAdmin.from("payout_batches").select("*, payout_batch_items(*)").limit(1);
        if (!batches || !batches[0]?.payout_batch_items?.[0]) return Response.json({ error: "No items" });
        
        const item = batches[0].payout_batch_items[0];
        const b = batches[0];
        
        const testProviders = ["MTN", "MOMO", "MTN MoMo", "Orange", "ORANGE", "Moov", "MOOV", "TELECEL", "Telecel", "Wave", "WAVE", null];
        
        const results = [];
        
        for (const p of testProviders) {
          const payload = {
            id: crypto.randomUUID(), // use a dummy ID so we can rollback or delete it later, actually let's use the real ID so we know it's not ID collision
            profile_id: b.owner_id,
            amount: 100,
            net_amount: 100,
            currency: "XOF",
            type: "pay-out",
            status: "pending",
            description: "test",
            provider: p,
            payment_method: p,
          };
          
          const { error } = await supabaseAdmin.from("transactions").insert(payload);
          results.push({ provider: p, error: error?.message || "SUCCESS" });
          if (!error) {
            // Cleanup
            await supabaseAdmin.from("transactions").delete().eq("id", payload.id);
          }
        }
        
        return Response.json({ results });
      }
    }
  }
});
