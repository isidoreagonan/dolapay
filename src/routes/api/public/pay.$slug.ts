import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Body = z.object({
  customer_name: z.string().trim().min(1).max(100),
  customer_phone: z.string().trim().min(6).max(20),
  provider: z.string().trim().min(1).max(40),
});

const RATE_WINDOW_SEC = 60;
const RATE_MAX = 8; // per IP per slug per window

export const Route = createFileRoute("/api/public/pay/$slug")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        let json: unknown;
        try { json = await request.json(); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
        const parsed = Body.safeParse(json);
        if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

        const idemKey = (request.headers.get("idempotency-key") ?? "").trim().slice(0, 100);
        if (!idemKey) return Response.json({ error: "Missing Idempotency-Key header" }, { status: 400 });

        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Rate limit: count attempts in last RATE_WINDOW_SEC for (ip, slug)
        const since = new Date(Date.now() - RATE_WINDOW_SEC * 1000).toISOString();
        const { count } = await supabaseAdmin
          .from("pay_attempts")
          .select("id", { count: "exact", head: true })
          .eq("ip", ip)
          .eq("slug", params.slug)
          .gte("created_at", since);
        if ((count ?? 0) >= RATE_MAX) {
          return Response.json(
            { error: "Too many requests. Please retry later." },
            { status: 429, headers: { "Retry-After": String(RATE_WINDOW_SEC) } },
          );
        }
        await supabaseAdmin.from("pay_attempts").insert({ ip, slug: params.slug });

        const { data: link, error: linkErr } = await supabaseAdmin
          .from("payment_links")
          .select("id,profile_id,amount,currency,title,active,success_url,failure_url")
          .eq("slug", params.slug)
          .maybeSingle();
        if (linkErr || !link || !link.active) {
          return Response.json({ error: "Lien introuvable ou inactif" }, { status: 404 });
        }

        // Idempotency: if a tx already exists for (profile, idem-key), return it
        const { data: existing } = await supabaseAdmin
          .from("transactions")
          .select("id,status")
          .eq("profile_id", link.profile_id)
          .eq("idempotency_key", idemKey)
          .maybeSingle();
        if (existing) {
          return Response.json({
            transaction_id: existing.id,
            status: existing.status,
            success_url: link.success_url,
            failure_url: link.failure_url,
            idempotent: true,
          });
        }

        const { data: tx, error: txErr } = await supabaseAdmin
          .from("transactions")
          .insert({
            profile_id: link.profile_id,
            amount: link.amount,
            currency: link.currency,
            type: "payment_link",
            status: "pending",
            idempotency_key: idemKey,
            description: `${link.title} · ${parsed.data.customer_name} · ${parsed.data.provider} ${parsed.data.customer_phone}`,
          })
          .select("id")
          .single();

        // Handle duplicate-key race (unique partial index on (profile_id, idempotency_key))
        if (txErr) {
          const isDup = (txErr as { code?: string }).code === "23505";
          if (isDup) {
            const { data: again } = await supabaseAdmin
              .from("transactions")
              .select("id,status")
              .eq("profile_id", link.profile_id)
              .eq("idempotency_key", idemKey)
              .maybeSingle();
            if (again) {
              return Response.json({
                transaction_id: again.id,
                status: again.status,
                success_url: link.success_url,
                failure_url: link.failure_url,
                idempotent: true,
              });
            }
          }
          return Response.json({ error: "Échec de création" }, { status: 500 });
        }

        // Simulate provider processing async
        const finalize = async () => {
          await new Promise((r) => setTimeout(r, 2500));
          const success = Math.random() > 0.15;
          await supabaseAdmin
            .from("transactions")
            .update({ status: success ? "success" : "failed" })
            .eq("id", tx!.id);
        };
        finalize().catch(() => {});

        return Response.json({
          transaction_id: tx!.id,
          status: "pending",
          success_url: link.success_url,
          failure_url: link.failure_url,
        });
      },
    },
  },
});
