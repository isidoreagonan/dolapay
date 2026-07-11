import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/tx-timeout/$id")({
  server: {
    handlers: {
      POST: async ({ params }) => {
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          
          // Update status to failed only if it's still pending
          const { error } = await supabaseAdmin
            .from("transactions")
            .update({ status: "failed" })
            .eq("id", params.id)
            .eq("status", "pending");

          if (error) {
            console.error("Failed to set transaction timeout status:", error);
            return Response.json({ error: error.message }, { status: 500 });
          }
          return Response.json({ success: true });
        } catch (e: any) {
          console.error("Timeout handler error:", e);
          return Response.json({ error: e.message || String(e) }, { status: 500 });
        }
      }
    }
  }
});
