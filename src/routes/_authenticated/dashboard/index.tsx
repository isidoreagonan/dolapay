import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import {
  Wallet, TrendingUp, TrendingDown, ArrowDownRight, ArrowUpRight,
  CheckCircle2, Target, Layers, Crown, Infinity as InfinityIcon, Headphones,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./route";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { getTier, fmtXof } from "@/lib/tier";
import { ApprovedBanner, ComplianceReviewScreen, RejectedScreen } from "@/components/dashboard/ComplianceStates";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: Overview,
});

type Tx = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  created_at: string;
  description?: string | null;
};

// Utilitaire d'extraction des métadonnées stockées dans la description
const parseTxDetails = (description: string | null | undefined, type: string) => {
  const desc = description || "";
  let providerName = type.replace("_", " ");
  let phone = "";
  
  if (desc.startsWith("[API_CHARGE]")) {
    const match = desc.match(/^\[API_CHARGE\] ([^\s·]+)(?: · ([^\s·]+))?/);
    if (match) {
      if (match[1]) providerName = match[1];
      if (match[2]) phone = match[2];
    }
  } else if (desc.startsWith("[API_CHARGE_TEST]")) {
    const match = desc.match(/^\[API_CHARGE_TEST\] ([^\s·]+)(?: · ([^\s·]+))?/);
    if (match) {
      if (match[1]) providerName = match[1];
      if (match[2]) phone = match[2];
    }
  } else if (desc.includes(" · ")) {
    const parts = desc.split(" · ");
    const lastPart = parts[parts.length - 1];
    if (lastPart) {
      const subparts = lastPart.trim().split(/\s+/);
      if (subparts[0]) providerName = subparts[0];
      if (subparts[1]) phone = subparts[1];
    }
  }
  return { providerName, phone };
};

const PERIOD_DAYS = 30;

function Overview() {
  const { data: profile } = useProfile();

  // Compliance state gating
  if (profile?.kyc_status === "in_compliance_review" || (profile?.kyc_status === "pending" && profile?.onboarding_completed)) {
    return <ComplianceReviewScreen />;
  }
  if (profile?.kyc_status === "rejected") {
    return <RejectedScreen reason={profile.kyc_rejection_reason} />;
  }

  const { data: txs = [] } = useQuery({
    queryKey: ["my-tx-30", profile?.id],
    queryFn: async (): Promise<Tx[]> => {
      const since = new Date();
      since.setDate(since.getDate() - PERIOD_DAYS * 2);
      const { data, error } = await supabase
        .from("transactions")
        .select("id,amount,currency,status,type,created_at,description")
        .eq("profile_id", profile!.id)
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false });
      if (error) throw error;
      const results: Tx[] = (data ?? []) as Tx[];
      const existingIds = new Set(results.map((t) => t.id));

      if (profile?.id) {
        // Optimisation : requête directe et propre sur `withdrawals` et `merchant_id`
        const { data: wrs } = await supabase
          .from("withdrawals")
          .select("*")
          .eq("merchant_id", profile.id)
          .gte("created_at", since.toISOString());
          
        if (wrs && wrs.length > 0) {
          for (const w of wrs) {
            if (!existingIds.has(w.id)) {
              existingIds.add(w.id);
              const amt = Number(w.amount || 0);
              const st = amt === 101 ? "failed" : ((w.status === "completed" || w.status === "success" || w.status === "validé") ? "success" : (w.status === "failed" || w.status === "rejected" ? "failed" : "pending"));
              results.push({
                id: w.id,
                amount: amt,
                currency: "XOF",
                status: st as any,
                type: "pay-out",
                created_at: w.created_at,
                description: `Retrait vers banque ou Momo`,
              } as any);
            }
          }
        }

        const { data: batches } = await (supabase.from("payout_batches") as any)
          .select("*, payout_batch_items(*)")
          .eq("owner_id", profile.id)
          .gte("created_at", since.toISOString());
        if (batches && batches.length > 0) {
          for (const b of batches) {
            if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
              for (const item of b.payout_batch_items) {
                if (!existingIds.has(item.id)) {
                  existingIds.add(item.id);
                  const amt = Number(item.amount || b.total_amount || 0);
                  const st = (item.status === "completed" || item.status === "success" || item.status === "validé") ? "success" : (item.status === "failed" || item.status === "rejected" ? "failed" : "pending");
                  results.push({
                    id: item.id,
                    amount: amt,
                    currency: "XOF",
                    status: st as any,
                    type: "pay-out",
                    created_at: item.created_at || b.created_at,
                    description: `Retrait Mobile Money - ${item.provider || "MOMO"} (${item.recipient_phone || "N/A"})`,
                  } as any);
                }
              }
            }
          }
        }
      }

      return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
    refetchInterval: 5000,
  });

  const now = new Date();
  const startCurrent = new Date(now); startCurrent.setDate(now.getDate() - PERIOD_DAYS);
  const startPrev = new Date(now); startPrev.setDate(now.getDate() - PERIOD_DAYS * 2);

  const inWindow = (t: Tx, from: Date, to: Date) => {
    const d = new Date(t.created_at);
    return d >= from && d < to;
  };

  const current = txs.filter((t) => inWindow(t, startCurrent, now));
  const previous = txs.filter((t) => inWindow(t, startPrev, startCurrent));

  const successful = current.filter((t) => t.status === "success");
  const failed = current.filter((t) => t.status === "failed");
  const payin = successful.filter((t) => t.type === "pay-in" || t.type === "payment_link");
  const payout = successful.filter((t) => t.type === "pay-out");

  const sum = (arr: Tx[]) => arr.reduce((s, t) => s + Number(t.amount), 0);
  const payinVol = sum(payin);
  const payoutVol = sum(payout);
  const balance = payinVol - payoutVol;

  // Le Volume Total (Chiffre d'affaires traité), le Panier Moyen, le Taux de succès et le Plafond mensuel
  // se calculent STRICTEMENT sur les encaissements clients (Pay-in / Liens de paiement).
  // Les décaissements (Retraits / Pay-out) ne sont pas une vente, ce sont des mouvements de trésorerie !
  const totalVolume = payinVol;
  const avgTicket = payin.length ? payinVol / payin.length : 0;
  
  const currentPayins = current.filter((t) => t.type === "pay-in" || t.type === "payment_link");
  const payinFailedCount = currentPayins.filter((t) => t.status === "failed").length;
  const successRate = currentPayins.length ? (payin.length / currentPayins.length) * 100 : (current.length ? (successful.length / current.length) * 100 : 0);

  const prevPayins = previous.filter((t) => t.status === "success" && (t.type === "pay-in" || t.type === "payment_link"));
  const prevVolume = sum(prevPayins);
  const trend = prevVolume ? ((totalVolume - prevVolume) / prevVolume) * 100 : 0;

  const limit = profile?.volume_limit_xof ?? 0;
  const usagePct = limit ? Math.min(100, (totalVolume / limit) * 100) : 0;

  // 30-day stacked chart
  const days = Array.from({ length: PERIOD_DAYS }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (PERIOD_DAYS - 1 - i));
    const key = d.toISOString().slice(0, 10);
    const day = successful.filter((t) => t.created_at.slice(0, 10) === key);
    return {
      day: key.slice(5),
      payin: sum(day.filter((t) => t.type === "pay-in" || t.type === "payment_link")),
      payout: sum(day.filter((t) => t.type === "pay-out")),
    };
  });

  // Top opérateurs (Mobile Money ou canal)
  const typeMap = new Map<string, number>();
  successful.forEach((t) => {
    const { providerName } = parseTxDetails(t.description, t.type);
    const p = providerName || "Autre";
    typeMap.set(p, (typeMap.get(p) || 0) + Number(t.amount));
  });
  const topProviders = Array.from(typeMap.entries())
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([name, volume]) => ({ name, volume }));

  const tier = getTier(profile?.account_type);

  return (
    <div className="space-y-6">
      <ApprovedBanner />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bonjour {profile?.full_name?.split(" ")[0] ?? ""} 👋</h1>
          <p className="text-sm text-muted-foreground">Aperçu des 30 derniers jours.</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={cn("gap-1.5 px-3 py-1 text-xs hidden sm:inline-flex", tier.badgeClass)}>
            <span className="text-sm leading-none">{tier.icon}</span> {tier.label}
          </Badge>
        </div>
      </div>

      <TierLimitsCard
        tier={tier}
        usedMonthly={totalVolume}
      />


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={TrendingUp} label="Volume total" value={fmt(totalVolume)} hint="XOF · 30j" trend={trend} />
        <Stat icon={ArrowDownRight} label="Encaissements" value={fmt(payinVol)} hint={`${payin.length} transactions`} />
        <Stat icon={ArrowUpRight} label="Décaissements" value={fmt(payoutVol)} hint={`${payout.length} transactions`} />
        <Stat icon={Wallet} label="Solde net" value={fmt(balance)} hint="Pay-in − Pay-out" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={CheckCircle2} label="Taux de succès" value={`${successRate.toFixed(1)}%`} hint={`${payinFailedCount} échecs`} />
        <Stat icon={Target} label="Panier moyen" value={fmt(avgTicket)} hint="XOF par transaction" />
        <Stat icon={Layers} label="Volume cumulé" value={`${usagePct.toFixed(0)}%`} hint={limit ? `de ${fmt(limit)} XOF` : "Limite non définie"} />
        <UsageCard pct={usagePct} />
      </div>

      <Card className="p-6">
        <div className="mb-4">
          <div className="text-sm font-semibold">Volume quotidien · 30 jours</div>
          <div className="text-xs text-muted-foreground">Encaissements vs Décaissements (XOF)</div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={days}>
              <defs>
                <linearGradient id="in" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="out" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(24 95% 53%)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="hsl(24 95% 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} fontSize={11} tickFormatter={(v) => fmt(v as number)} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} formatter={(v: number) => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area name="Encaissements" type="monotone" dataKey="payin" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#in)" />
              <Area name="Décaissements" type="monotone" dataKey="payout" stroke="hsl(24 95% 53%)" strokeWidth={2} fill="url(#out)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-3 text-sm font-semibold">Top opérateurs · 30 jours</div>
          <div className="h-56 w-full">
            {topProviders.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProviders} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide tickFormatter={(v) => fmt(v as number)} />
                  <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} fontSize={12} width={80} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">Pas encore de données opérateurs.</div>
            )}
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ArrowDownRight className="h-4 w-4 text-emerald-500" /> Dernières transactions
              </div>
              <Link to="/dashboard/transactions" className="text-xs font-semibold text-primary hover:underline">
                Tout voir →
              </Link>
            </div>
            <ul className="space-y-2.5 text-sm">
              {current.slice(0, 5).map((t) => {
                const isSuccess = t.status === "success";
                const isPayout = t.type === "pay-out";
                const { providerName, phone } = parseTxDetails(t.description, t.type);
                return (
                  <li key={t.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/50 px-3 py-2.5 transition-colors hover:bg-muted/40">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-bold",
                        isSuccess ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600"
                      )}>
                        {isPayout ? "-" : "+"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs uppercase truncate text-foreground">
                            {providerName}
                          </span>
                          {phone && <span className="text-[11px] font-mono text-muted-foreground">({phone})</span>}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                          {t.description || new Date(t.created_at).toLocaleString("fr-FR")}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={cn("font-mono font-bold text-xs", isPayout ? "text-rose-500" : "text-foreground")}>
                        {isPayout ? "-" : "+"}{fmt(Number(t.amount))} {t.currency}
                      </div>
                      <div className="text-[9px] uppercase font-semibold text-muted-foreground">
                        {t.status === "success" ? "Réussi" : t.status === "pending" ? "En attente" : "Échoué"}
                      </div>
                    </div>
                  </li>
                );
              })}
              {current.length === 0 && (
                <li className="text-center py-8 text-muted-foreground">
                  Aucune transaction. <Link to="/dashboard/payment-links" className="text-primary underline">Créez votre premier lien</Link>.
                </li>
              )}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, hint, trend }: { icon: typeof Wallet; label: string; value: string; hint: string; trend?: number }) {
  const up = (trend ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
      </div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        <span>{hint}</span>
        {trend !== undefined && Number.isFinite(trend) && trend !== 0 && (
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", up ? "text-emerald-500" : "text-rose-500")}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </Card>
  );
}

function UsageCard({ pct }: { pct: number }) {
  return (
    <Card className="p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Utilisation limite</div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all", pct > 80 ? "bg-rose-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">{pct.toFixed(1)}% du plafond mensuel</div>
    </Card>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}

function TierLimitsCard({ tier, usedMonthly }: { tier: ReturnType<typeof getTier>; usedMonthly: number }) {
  const unlimited = tier.monthlyLimitXof === null;
  const pct = unlimited ? 0 : Math.min(100, (usedMonthly / (tier.monthlyLimitXof || 1)) * 100);
  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {unlimited ? <Crown className="h-3.5 w-3.5 text-amber-500" /> : <Layers className="h-3.5 w-3.5" />}
            Plafond {tier.short}
          </div>
          <div className="mt-1 text-xl font-bold">
            {unlimited ? (
              <span className="inline-flex items-center gap-1.5"><InfinityIcon className="h-5 w-5" /> Illimité <span className="text-xs font-normal text-muted-foreground">· SLA monitoré</span></span>
            ) : (
              <>Mensuel : {fmtXof(tier.monthlyLimitXof!)}</>
            )}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            Cap par transaction : <strong className="text-foreground">{fmtXof(tier.singleTxCapXof)}</strong>
          </div>
        </div>
        {tier.capabilities.vipSupport && (
          <button className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-400/20 dark:text-amber-300">
            <Headphones className="h-3.5 w-3.5" /> Account Manager prioritaire
          </button>
        )}
      </div>

      {!unlimited && (
        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>Utilisé ce mois</span>
            <span><strong className="text-foreground">{fmtXof(usedMonthly)}</strong> / {fmtXof(tier.monthlyLimitXof!)}</span>
          </div>
          <Progress value={pct} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
        <Capability ok={tier.capabilities.payin} label="Pay-in" />
        <Capability ok={tier.capabilities.paymentLinks} label="Liens & QR" />
        <Capability ok={tier.capabilities.payouts} label="Payouts" />
        <Capability ok={tier.capabilities.bulkTransfers} label="Bulk Transfers" />
        <Capability ok={tier.capabilities.signedWebhooks} label="Webhooks signés" />
      </div>

      {!tier.capabilities.payouts && (
        <Link
          to="/dashboard/settings"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Crown className="h-3.5 w-3.5" /> Passer à Enterprise
        </Link>
      )}
    </Card>
  );
}

function Capability({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium",
      ok
        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "border-border bg-muted/40 text-muted-foreground",
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-emerald-500" : "bg-muted-foreground/50")} />
      {label}
    </span>
  );
}
