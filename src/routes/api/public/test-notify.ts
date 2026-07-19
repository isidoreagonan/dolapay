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
          
          const { data: tx, error } = await supabaseAdmin.from("transactions").select("*").eq("id", txId).maybeSingle();
          trace.push({ step: "1. fetch tx", tx_exists: !!tx, error, status: tx?.status });

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
