import { createFileRoute } from "@tanstack/react-router";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute("/api/public/tx-status/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        if (!UUID_RE.test(params.id)) {
          return Response.json({ error: "Invalid id" }, { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("transactions")
          .select("status")
          .eq("id", params.id)
          .maybeSingle();
        if (error) return Response.json({ error: "Server error" }, { status: 500 });
        if (!data) return Response.json({ error: "Not found" }, { status: 404 });
        return Response.json(
          { status: data.status },
          { headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
