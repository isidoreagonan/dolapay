import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Body = z.object({
  customer_name: z.string().trim().min(1).max(100),
  customer_phone: z.string().trim().min(6).max(20),
  provider: z.string().trim().min(1).max(40),
  customer_email: z.string().trim().email().optional().or(z.literal("")),
});

const RATE_WINDOW_SEC = 60;
const RATE_MAX = 8; // per IP per slug per window

export const Route = createFileRoute("/api/public/pay/$slug")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
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
          const { pawapay } = await import("@/lib/pawapay.server");
          const { calculateMargin } = await import("@/lib/margins.server");

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

          const isLigdiCash =
            parsed.data.customer_phone.replace(/\D/g, "").startsWith("226") ||
            parsed.data.provider.toUpperCase() === "CARD";

          const emailStr = parsed.data.customer_email ? parsed.data.customer_email.trim() : "noemail@client.com";
          const gatewayUsed = isLigdiCash ? "ligdicash" : "pawapay";
          const margins = await calculateMargin(supabaseAdmin, link.amount, "pay-in", parsed.data.provider, gatewayUsed);
          
          const { data: tx, error: txErr } = await supabaseAdmin
            .from("transactions")
            .insert({
              profile_id: link.profile_id,
              amount: link.amount,
              currency: link.currency,
              type: "payment_link",
              status: "pending",
              idempotency_key: idemKey,
              description: `[${params.slug}] ${link.title} · ${parsed.data.customer_name} (${emailStr}) · ${parsed.data.provider} ${parsed.data.customer_phone}`,
              // Add required live DB columns
              net_amount: margins.net_amount,
              operator_fee: margins.operator_fee,
              gateway_fee: margins.gateway_fee,
              dola_margin: margins.dola_margin,
              gateway: gatewayUsed,
              customer_phone: parsed.data.customer_phone,
              provider: gatewayUsed,
              payment_method: parsed.data.provider,
            } as any)
            .select("id")
            .single();

          // Handle duplicate-key race (unique partial index on (profile_id, idempotency_key))
          if (txErr) {
            console.error("Postgres transactions insert failed:", txErr);
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
            return Response.json({ error: `Échec de création (${txErr.code || 'unknown'}): ${txErr.message}` }, { status: 500 });
          }

          if (isLigdiCash) {
            const nameParts = parsed.data.customer_name.trim().split(/\s+/);
            const firstname = nameParts[0] || "Client";
            const lastname = nameParts.slice(1).join(" ") || "DolaPay";
            const origin = new URL(request.url).origin;
            const returnUrl = `${origin}/pay/${params.slug}?tx_id=${tx!.id}`;
            const callbackUrl = `${origin}/api/public/ligdicash-webhook`;

            try {
              const { createLigdiCashPayin } = await import("@/lib/ligdicash.server");
              const cleanPhone = parsed.data.customer_phone.replace(/\D/g, "");
              const payinRes = await createLigdiCashPayin({
                amount: Number(link.amount),
                currency: (link.currency || "XOF").toLowerCase(),
                description: `${link.title} · ${parsed.data.customer_name}`,
                customer: {
                  firstname,
                  lastname,
                  email: parsed.data.customer_email || undefined,
                  phone: cleanPhone,
                },
                customData: {
                  transaction_id: tx!.id,
                  method: parsed.data.provider.toUpperCase(),
                },
                returnUrl,
                callbackUrl,
              });

              if (payinRes.response_code === "00" && payinRes.response_text) {
                const token = payinRes.token || null;
                await supabaseAdmin
                  .from("transactions")
                  .update({
                    ligdicash_token: token,
                  } as any)
                  .eq("id", tx!.id);

                return Response.json({
                  transaction_id: tx!.id,
                  status: "redirect",
                  redirect_url: payinRes.response_text,
                  success_url: link.success_url,
                  failure_url: link.failure_url,
                });
              } else {
                throw new Error("LigdiCash initiation failed (No redirect URL or error)");
              }
            } catch (err: any) {
              console.error("Erreur LigdiCash Payin initiation:", err);
              const errMsg = err.message || String(err);
              const extraDesc = ` · [Échec] API_ERROR: ${errMsg}`;
              await supabaseAdmin
                .from("transactions")
                .update({
                  status: "failed",
                  description: `[${params.slug}] ${link.title} · ${parsed.data.customer_name}${emailInfo} · ${parsed.data.provider} ${parsed.data.customer_phone}${extraDesc}`
                } as any)
                .eq("id", tx!.id);

              return Response.json({
                transaction_id: tx!.id,
                status: "failed",
                failure_reason: { code: "API_ERROR", message: `Échec d'initiation LigdiCash: ${errMsg}` },
                success_url: link.success_url,
                failure_url: link.failure_url,
              });
            }
          }

          // Déclenchement de la collecte PawaPay (USSD Mobile Money)
          try {
            const depositRes = await pawapay.initiateDeposit({
              depositId: tx!.id,
              amount: Number(link.amount),
              currency: link.currency || "XOF",
              phone: parsed.data.customer_phone,
              provider: parsed.data.provider,
              description: `${link.title} · ${parsed.data.customer_name}`,
            });

            if (depositRes.status === "REJECTED") {
              const rCode = depositRes.rejectionReason?.rejectionCode || "REJECTED";
              const rMsg = depositRes.rejectionReason?.rejectionMessage || "Paiement refusé par l'opérateur Mobile Money";
              const extraDesc = ` · [Échec] ${rCode}: ${rMsg}`;
              await supabaseAdmin
                .from("transactions")
                .update({ 
                  status: "failed",
                  description: `[${params.slug}] ${link.title} · ${parsed.data.customer_name}${emailInfo} · ${parsed.data.provider} ${parsed.data.customer_phone}${extraDesc}`
                } as any)
                .eq("id", tx!.id);
              
              return Response.json({
                transaction_id: tx!.id,
                status: "failed",
                failure_reason: { code: rCode, message: rMsg },
                success_url: link.success_url,
                failure_url: link.failure_url,
              });
            }
          } catch (err: any) {
            console.error("Erreur PawaPay initDeposit:", err);
            const errMsg = err.message || String(err);
            const extraDesc = ` · [Échec] API_ERROR: ${errMsg}`;
            await supabaseAdmin
              .from("transactions")
              .update({ 
                status: "failed",
                description: `[${params.slug}] ${link.title} · ${parsed.data.customer_name}${emailInfo} · ${parsed.data.provider} ${parsed.data.customer_phone}${extraDesc}`
              } as any)
              .eq("id", tx!.id);
            
            return Response.json({
              transaction_id: tx!.id,
              status: "failed",
              failure_reason: { code: "API_ERROR", message: `Échec d'initiation PawaPay: ${errMsg}` },
              success_url: link.success_url,
              failure_url: link.failure_url,
            });
          }

          return Response.json({
            transaction_id: tx!.id,
            status: "pending",
            success_url: link.success_url,
            failure_url: link.failure_url,
          });
        } catch (e: any) {
          console.error("CRITICAL BACKEND ERROR in pay.$slug POST:", e);
          return Response.json(
            { error: `Err500: ${e.message || String(e)}` },
            { status: 500 }
          );
        }
      },
    },
  },
});
