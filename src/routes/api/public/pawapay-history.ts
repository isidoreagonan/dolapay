import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/pawapay-history")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          // To avoid fetching massive amounts of data, we only fetch logs that represent issues
          // If there's no log for a given day, we assume 100% operational.
          const { data: issues, error } = await supabaseAdmin
            .from("pawapay_status_logs")
            .select("created_at, correspondent, operation_type, status")
            .neq("status", "OPERATIONAL")
            .gte("created_at", thirtyDaysAgo.toISOString())
            .order("created_at", { ascending: true });

          if (error) {
            console.error("Failed to fetch history:", error);
            return Response.json({ error: "Failed to fetch history" }, { status: 500 });
          }

          return Response.json({ issues: issues || [] });
        } catch (error) {
          console.error("History Error:", error);
          return Response.json({ error: "Internal Server Error" }, { status: 500 });
        }
      },
    },
  },
});
