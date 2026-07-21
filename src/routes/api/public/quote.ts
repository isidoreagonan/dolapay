import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const QuoteSchema = z.object({
  amount: z.number().positive(),
  provider: z.string().trim().min(1),
});

export const Route = createFileRoute("/api/public/quote")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = QuoteSchema.safeParse(body);
          if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { calculateMargin } = await import("@/lib/margins.server");

          // Default gateway to ligdicash (mobile money). 
          const gatewayUsed = "ligdicash";

          const margins = await calculateMargin(
            supabaseAdmin,
            parsed.data.amount,
            "pay-in",
            parsed.data.provider,
            gatewayUsed
          );

          return Response.json({
            totalFees: margins.totalFees,
            net_amount: margins.net_amount,
          });
        } catch (e) {
          console.error("Error in quote API:", e);
          return Response.json({ error: "Server error" }, { status: 500 });
        }
      },
    },
  },
});
