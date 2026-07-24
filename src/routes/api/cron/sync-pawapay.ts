import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/cron/sync-pawapay")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Vercel Cron Authentication: 
        // Vercel adds an Authorization header with a Bearer token matching CRON_SECRET.
        const authHeader = request.headers.get('authorization');
        
        // Un-comment to enforce Vercel Cron security in production:
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //   return Response.json({ error: 'Unauthorized' }, { status: 401 });
        // }

        try {
          const res = await fetch("https://api.pawapay.io/availability");
          if (!res.ok) {
            return Response.json({ error: "Failed to fetch from PawaPay" }, { status: res.status });
          }
          
          const data = await res.json();
          
          // Flatten the response into log rows
          const logsToInsert: {
            country: string;
            correspondent: string;
            operation_type: string;
            status: string;
          }[] = [];
          
          for (const countryNode of data) {
            for (const corrNode of countryNode.correspondents) {
              for (const opNode of corrNode.operationTypes) {
                logsToInsert.push({
                  country: countryNode.country,
                  correspondent: corrNode.correspondent,
                  operation_type: opNode.operationType,
                  status: opNode.status,
                });
              }
            }
          }
          
          if (logsToInsert.length > 0) {
            const { error } = await supabaseAdmin.from("pawapay_status_logs").insert(logsToInsert);
            if (error) {
              console.error("Failed to insert logs into Supabase:", error);
              return Response.json({ error: "Failed to save logs" }, { status: 500 });
            }
          }

          return Response.json({ success: true, inserted: logsToInsert.length });
        } catch (error) {
          console.error("Cron Error:", error);
          return Response.json({ error: "Internal Server Error" }, { status: 500 });
        }
      },
    },
  },
});
