import { createFileRoute } from "@tanstack/react-router";
import { notifyDepositSuccess } from "@/lib/email.server";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/test-notify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const txId = url.searchParams.get("txId");
        if (!txId) return Response.json({ error: "txId manquant" }, { status: 400 });

        try {
          // Retire temporairement le tag [EMAIL_SENT] pour forcer le renvoi
          const { data: tx } = await supabaseAdmin.from("transactions").select("description").eq("id", txId).single();
          if (tx && tx.description) {
            await supabaseAdmin.from("transactions").update({
              description: tx.description.replace("[EMAIL_SENT]", "").trim()
            }).eq("id", txId);
          }

          // Capture les logs console
          const originalError = console.error;
          const originalLog = console.log;
          const logs: any[] = [];
          console.error = (...args) => {
            logs.push(["ERROR", ...args]);
            originalError(...args);
          };
          console.log = (...args) => {
            logs.push(["LOG", ...args]);
            originalLog(...args);
          };

          await notifyDepositSuccess(supabaseAdmin, txId);
          
          console.error = originalError;
          console.log = originalLog;

          return Response.json({ success: true, message: "notifyDepositSuccess executed", logs, tx });
        } catch (e: any) {
          return Response.json({ error: e.message || "Erreur" });
        }
      }
    }
  }
});
