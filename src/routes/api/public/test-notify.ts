import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/test-notify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const txId = url.searchParams.get("txId");
        if (!txId) return Response.json({ error: "txId manquant" });

        try {
          const trace: any[] = [];
          
          let tx: any = null;
          let error: any = null;

          if (txId === "latest5") {
            const res = await supabaseAdmin.from("transactions").select("id, status, profile_id, created_at, amount, type").order("created_at", { ascending: false }).limit(5);
            return Response.json({ success: true, latest: res.data });
          } else if (txId === "latest") {
            const res = await supabaseAdmin.from("transactions").select("*").order("created_at", { ascending: false }).limit(1).single();
            tx = res.data;
            error = res.error;
          } else {
            const res = await supabaseAdmin.from("transactions").select("*").eq("id", txId).maybeSingle();
            tx = res.data;
            error = res.error;
          }
          trace.push({ step: "1. fetch tx", tx_exists: !!tx, error, status: tx?.status, txId: tx?.id });

          if (error || !tx || tx.status !== "success") {
             return Response.json({ trace, reason: "Tx introuvable ou pas success" });
          }

          const profileId = tx.profile_id || tx.user_id || tx.merchant_id || tx.owner_id;
          trace.push({ step: "2. profileId", profileId });

          if (!profileId) return Response.json({ trace, reason: "No profileId" });

          const { data: prof } = await supabaseAdmin.from("profiles").select("email, full_name, company_name").eq("id", profileId).maybeSingle();
          trace.push({ step: "3. prof", prof });

          if (!prof || !prof.email) return Response.json({ trace, reason: "No prof or no prof.email" });

          return Response.json({ trace, message: "Would have continued to email!", prof });
        } catch (e: any) {
          return Response.json({ error: e.message || "Erreur" });
        }
      }
    }
  }
});
