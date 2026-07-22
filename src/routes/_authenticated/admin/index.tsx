import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Activity, ArrowDownLeft, ArrowUpRight, ShieldAlert, TrendingUp, Users as UsersIcon, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

type Tx = {
  id: string;
  amount: number;
  status: string;
  type: string;
  created_at: string;
  profile_id: string;
  dola_margin?: number;
  description?: string;
  mode?: string;
};

function AdminOverview() {
  const { data: txs = [], isLoading } = useQuery({
    queryKey: ["admin-overview-txs"],
    queryFn: async (): Promise<Tx[]> => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data, error } = await supabase
        .from("transactions")
        .select("id,amount,status,type,created_at,profile_id,dola_margin,description")
        .gte("created_at", since)
        .order("created_at", { ascending: false });
      if (error) throw error;
      const results: Tx[] = (data ?? []) as Tx[];
      const existingIds = new Set(results.map((t) => t.id));

      const { data: wrs } = await (supabase.from("withdrawal_requests") as any)
        .select("id,amount,status,created_at,profile_id")
        .gte("created_at", since);
      if (wrs && wrs.length > 0) {
        for (const w of wrs) {
          if (!existingIds.has(w.id)) {
            const amt = Number(w.amount || 0);
            const st = amt === 101 ? "failed" : ((w.status === "completed" || w.status === "success" || w.status === "validé") ? "success" : (w.status === "failed" || w.status === "rejected" ? "failed" : "pending"));
            if (amt > 0 && amt !== 101) {
              existingIds.add(w.id);
              results.push({
                id: w.id,
                amount: amt,
                status: st as any,
                type: "pay-out",
                created_at: w.created_at,
                profile_id: w.profile_id,
              } as any);
            }
          }
        }
      }

      const { data: oldWrs } = await supabase
        .from("withdrawals")
        .select("id,amount,status,created_at,merchant_id")
        .gte("created_at", since);
      if (oldWrs && oldWrs.length > 0) {
        for (const w of oldWrs) {
          if (!existingIds.has(w.id)) {
            const amt = Number(w.amount || 0);
            const st = amt === 101 ? "failed" : ((w.status === "completed" || w.status === "success" || w.status === "validé") ? "success" : (w.status === "failed" || w.status === "rejected" ? "failed" : "pending"));
            if (amt > 0 && amt !== 101) {
              existingIds.add(w.id);
              results.push({
                id: w.id,
                amount: amt,
                status: st as any,
                type: "pay-out",
                created_at: w.created_at,
                profile_id: w.merchant_id,
              } as any);
            }
          }
        }
      }

      const { data: batches } = await (supabase.from("payout_batches") as any)
        .select("*, payout_batch_items(*)")
        .gte("created_at", since);
      if (batches && batches.length > 0) {
        for (const b of batches) {
          if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
            for (const item of b.payout_batch_items) {
              if (!existingIds.has(item.id)) {
                const amt = Number(item.amount || b.total_amount || 0);
                const st = amt === 101 ? "failed" : ((item.status === "completed" || item.status === "success" || item.status === "validé") ? "success" : (item.status === "failed" || item.status === "rejected" ? "failed" : "pending"));
                if (amt > 0 && amt !== 101) {
                  existingIds.add(item.id);
                  results.push({
                    id: item.id,
                    amount: amt,
                    status: st as any,
                    type: "pay-out",
                    created_at: item.created_at || b.created_at,
                    profile_id: b.owner_id,
                  } as any);
                }
              }
            }
          }
        }
      }

      return results;
    },
  });

  const { data: profileStats } = useQuery({
    queryKey: ["admin-overview-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,kyc_status,account_type,created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const now = Date.now();
  const day = 24 * 3600 * 1000;
  const vol = (since: number, type?: "pay-in" | "pay-out") =>
    txs
      .filter((t) => {
        if (new Date(t.created_at).getTime() < since || t.status !== "success") return false;
        
        // Ignorer les transactions de test pour les métriques de l'admin
        const desc = String(t.description || "").toLowerCase();
        const mode = String(t.mode || "").toLowerCase();
        const isTestTx = desc.includes("_test") || desc.includes("sandbox") || mode === "test" || mode === "sandbox";
        if (isTestTx) return false;

        if (!type) return true;
        if (type === "pay-in") return t.type === "pay-in" || t.type === "payment_link";
        return t.type === "pay-out";
      })
      .reduce((s, t) => s + Number(t.amount), 0);

  const today = vol(now - day);
  const last7 = vol(now - 7 * day);
  const last30 = vol(now - 30 * day);
  const payIn30 = vol(now - 30 * day, "pay-in");
  const payOut30 = vol(now - 30 * day, "pay-out");
  const totalCount = txs.filter((t) => {
    const desc = String(t.description || "").toLowerCase();
    const mode = String(t.mode || "").toLowerCase();
    const isTestTx = desc.includes("_test") || desc.includes("sandbox") || mode === "test" || mode === "sandbox";
    return !isTestTx && new Date(t.created_at).getTime() >= now - 30 * day;
  }).length;
  
  const completedCount = txs.filter((t) => {
    const desc = String(t.description || "").toLowerCase();
    const mode = String(t.mode || "").toLowerCase();
    const isTestTx = desc.includes("_test") || desc.includes("sandbox") || mode === "test" || mode === "sandbox";
    return !isTestTx && new Date(t.created_at).getTime() >= now - 30 * day && t.status === "success";
  }).length;
  
  const successRate = totalCount ? (completedCount / totalCount) * 100 : 0;
  
  // Calcul exact des marges réelles générées (au lieu d'une estimation)
  // On applique un fallback sur l'ancienne estimation pour les transactions historiques
  const mrrActual = txs
    .filter((t) => {
      const desc = String(t.description || "").toLowerCase();
      const mode = String(t.mode || "").toLowerCase();
      const isTestTx = desc.includes("_test") || desc.includes("sandbox") || mode === "test" || mode === "sandbox";
      return !isTestTx && t.status === "success" && new Date(t.created_at).getTime() >= now - 30 * day;
    })
    .reduce((sum, t) => {
      if (t.dola_margin != null) return sum + Number(t.dola_margin);
      if (t.type === "pay-in" || t.type === "payment_link") return sum + (Number(t.amount) * 0.02);
      if (t.type === "pay-out") return sum + (Number(t.amount) * 0.01);
      return sum;
    }, 0);

  const pendingKyc = (profileStats ?? []).filter((p) => p.kyc_status === "pending").length;
  const merchants = (profileStats ?? []).length;
  const enterprises = (profileStats ?? []).filter((p) => p.account_type === "enterprise").length;

  const kpis = [
    { label: "Volume 24h", value: today, fmt: "xof", icon: Activity, accent: "text-emerald-400" },
    { label: "Volume 7j", value: last7, fmt: "xof", icon: TrendingUp, accent: "text-sky-400" },
    { label: "Volume 30j", value: last30, fmt: "xof", icon: Wallet, accent: "text-violet-400" },
    { label: "Revenu DolaPay (30j)", value: mrrActual, fmt: "xof", icon: TrendingUp, accent: "text-amber-400" },
    { label: "Encaissements (30j)", value: payIn30, fmt: "xof", icon: ArrowDownLeft, accent: "text-emerald-400" },
    { label: "Décaissements (30j)", value: payOut30, fmt: "xof", icon: ArrowUpRight, accent: "text-rose-400" },
    { label: "Taux de succès (30j)", value: successRate, fmt: "pct", icon: Activity, accent: "text-emerald-400" },
    { label: "Marchands", value: merchants, fmt: "int", icon: UsersIcon, accent: "text-sky-400" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Control Center</h1>
          <p className="mt-1 text-sm text-slate-400">Pilotage opérationnel DolaPay — temps réel & 30 derniers jours.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Production · uptime 99.98%
        </div>
      </header>

      {pendingKyc > 0 && (
        <Link
          to="/admin/compliance"
          className="flex items-center justify-between gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 transition-colors hover:bg-amber-100 dark:border-amber-400/30 dark:bg-amber-400/[0.07] dark:hover:bg-amber-400/[0.12]"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">{pendingKyc} dossier{pendingKyc > 1 ? "s" : ""} KYC en attente de revue</div>
              <div className="text-xs text-amber-700/90 dark:text-amber-300/80">Ouvrir la file de conformité →</div>
            </div>
          </div>
        </Link>
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{k.label}</div>
              <k.icon className={cn("h-3.5 w-3.5", k.accent)} />
            </div>
            <div className="mt-3 font-mono text-lg font-bold text-white sm:text-xl">
              {isLoading ? "…" : formatValue(k.value, k.fmt as "xof" | "int" | "pct")}
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Dernières transactions</h2>
            <Link to="/admin/live" className="text-xs text-sky-400 hover:text-sky-300">Voir le flux live →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-[10px] uppercase tracking-wider text-slate-500">
                <tr className="border-b border-white/5">
                  <th className="pb-2 pr-3 text-left font-medium">ID</th>
                  <th className="pb-2 pr-3 text-left font-medium">Type</th>
                  <th className="pb-2 pr-3 text-right font-medium">Montant</th>
                  <th className="pb-2 pr-3 text-left font-medium">Statut</th>
                  <th className="pb-2 text-right font-medium">Quand</th>
                </tr>
              </thead>
              <tbody>
                {txs.slice(0, 8).map((t) => (
                  <tr key={t.id} className="border-b border-white/[0.04]">
                    <td className="py-2 pr-3 font-mono text-slate-300">{t.id.slice(0, 10)}…</td>
                    <td className="py-2 pr-3 capitalize text-slate-400">{t.type}</td>
                    <td className="py-2 pr-3 text-right font-mono text-white">{Number(t.amount).toLocaleString("fr-FR")}</td>
                    <td className="py-2 pr-3"><StatusDot status={t.status} /></td>
                    <td className="py-2 text-right text-slate-500">{timeAgo(t.created_at)}</td>
                  </tr>
                ))}
                {txs.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-slate-500">Aucune transaction.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Comptes Enterprise</div>
            <div className="mt-2 font-mono text-2xl font-bold text-white">{enterprises}</div>
            <div className="text-xs text-slate-500">sur {merchants} marchands</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">KYC en attente</div>
            <div className="mt-2 font-mono text-2xl font-bold text-amber-300">{pendingKyc}</div>
            <Link to="/admin/compliance" className="text-xs text-sky-400 hover:text-sky-300">Traiter →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatValue(v: number, fmt: "xof" | "int" | "pct") {
  if (fmt === "xof") return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(v)) + " F";
  if (fmt === "pct") return v.toFixed(1) + "%";
  return new Intl.NumberFormat("fr-FR").format(v);
}

function StatusDot({ status }: { status: string }) {
  const map: Record<string, string> = {
    success: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
    pending: "bg-amber-400/15 text-amber-300 border-amber-400/30",
    failed: "bg-rose-400/15 text-rose-300 border-rose-400/30",
    refunded: "bg-slate-400/15 text-slate-300 border-slate-400/30",
  };
  return <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase", map[status] ?? map.pending)}>{status}</span>;
}

function timeAgo(iso: string) {
  const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}
