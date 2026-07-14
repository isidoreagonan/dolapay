import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/finance")({
  component: FinancePage,
});

type Tx = {
  id: string;
  amount: number;
  status: string;
  type: string;
  created_at: string;
  currency: string | null;
};

const FEE_PAY_IN = 0.02;
const FEE_PAY_OUT = 0.01;

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function monthKey(d: string) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}

function FinancePage() {
  const { data: txs = [], isLoading } = useQuery({
    queryKey: ["admin-finance-txs"],
    queryFn: async (): Promise<Tx[]> => {
      const since = new Date(Date.now() - 180 * 24 * 3600 * 1000).toISOString();
      const { data, error } = await supabase
        .from("transactions")
        .select("id,amount,status,type,created_at,currency")
        .gte("created_at", since)
        .eq("status", "success")
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      const results: Tx[] = (data ?? []) as Tx[];
      const existingIds = new Set(results.map((t) => t.id));

      // Fetch all successful withdrawal_requests
      const { data: wrs } = await (supabase.from("withdrawal_requests") as any)
        .select("id,amount,status,created_at,currency")
        .gte("created_at", since);
      if (wrs && wrs.length > 0) {
        for (const w of wrs) {
          if (!existingIds.has(w.id)) {
            const amt = Number(w.amount || 0);
            const st = amt === 101 ? "failed" : ((w.status === "completed" || w.status === "success" || w.status === "validé") ? "success" : (w.status === "failed" || w.status === "rejected" ? "failed" : "pending"));
            if (st === "success" && amt > 0 && amt !== 101) {
              existingIds.add(w.id);
              results.push({
                id: w.id,
                amount: amt,
                status: "success",
                type: "pay-out",
                created_at: w.created_at,
                currency: "XOF",
              } as any);
            }
          }
        }
      }

      // Fetch all successful payout_batch_items
      const { data: batches } = await (supabase.from("payout_batches") as any)
        .select("created_at, total_amount, payout_batch_items(*)")
        .gte("created_at", since);
      if (batches && batches.length > 0) {
        for (const b of batches) {
          if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
            for (const item of b.payout_batch_items) {
              if (!existingIds.has(item.id)) {
                const amt = Number(item.amount || b.total_amount || 0);
                const st = amt === 101 ? "failed" : ((item.status === "completed" || item.status === "success" || item.status === "validé") ? "success" : (item.status === "failed" || item.status === "rejected" ? "failed" : "pending"));
                if (st === "success" && amt > 0 && amt !== 101) {
                  existingIds.add(item.id);
                  results.push({
                    id: item.id,
                    amount: amt,
                    status: "success",
                    type: "pay-out",
                    created_at: item.created_at || b.created_at,
                    currency: "XOF",
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

  const totalVolume = txs.reduce((s, t) => s + Number(t.amount), 0);
  const totalPayIn = txs.filter((t) => t.type === "pay-in" || t.type === "payment_link").reduce((s, t) => s + Number(t.amount), 0);
  const totalPayOut = txs.filter((t) => t.type === "pay-out").reduce((s, t) => s + Number(t.amount), 0);
  const revenue = totalPayIn * FEE_PAY_IN + totalPayOut * FEE_PAY_OUT;

  const byMonth = new Map<string, { volume: number; payIn: number; payOut: number; revenue: number; count: number }>();
  for (const t of txs) {
    const k = monthKey(t.created_at);
    const cur = byMonth.get(k) ?? { volume: 0, payIn: 0, payOut: 0, revenue: 0, count: 0 };
    cur.volume += Number(t.amount);
    cur.count += 1;
    if (t.type === "pay-in" || t.type === "payment_link") {
      cur.payIn += Number(t.amount);
      cur.revenue += Number(t.amount) * FEE_PAY_IN;
    } else if (t.type === "pay-out") {
      cur.payOut += Number(t.amount);
      cur.revenue += Number(t.amount) * FEE_PAY_OUT;
    }
    byMonth.set(k, cur);
  }
  const months = Array.from(byMonth.entries()).sort(([a], [b]) => b.localeCompare(a));
  const maxRev = Math.max(1, ...months.map(([, v]) => v.revenue));

  const byCurrency = new Map<string, { volume: number; revenue: number; count: number }>();
  for (const t of txs) {
    const k = (t.currency || "XOF").toUpperCase();
    const cur = byCurrency.get(k) ?? { volume: 0, revenue: 0, count: 0 };
    cur.volume += Number(t.amount);
    cur.count += 1;
    const isPayIn = t.type === "pay-in" || t.type === "payment_link";
    cur.revenue += Number(t.amount) * (isPayIn ? FEE_PAY_IN : t.type === "pay-out" ? FEE_PAY_OUT : 0);
    byCurrency.set(k, cur);
  }
  const currencies = Array.from(byCurrency.entries()).sort(([, a], [, b]) => b.revenue - a.revenue);

  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-wider text-slate-500">Finance</div>
        <h1 className="mt-1 text-2xl font-bold">Revenu DolaPay</h1>
        <p className="mt-1 text-sm text-slate-500">
          Calcul transparent · 2 % sur les encaissements, 1 % sur les décaissements. Données des 6 derniers mois (transactions réussies uniquement).
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Kpi label="Revenu (180j)" value={fmt(revenue)} suffix="XOF" icon={DollarSign} accent="text-amber-500" />
        <Kpi label="Volume total" value={fmt(totalVolume)} suffix="XOF" icon={TrendingUp} accent="text-sky-500" />
        <Kpi label="Encaissements" value={fmt(totalPayIn)} suffix="XOF" icon={ArrowDownLeft} accent="text-emerald-500" />
        <Kpi label="Décaissements" value={fmt(totalPayOut)} suffix="XOF" icon={ArrowUpRight} accent="text-rose-500" />
      </div>

      <section className="rounded-2xl border border-current/10 bg-white/[0.02] p-5 dark:border-white/10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Revenu mensuel</h2>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">XOF</span>
        </div>
        {isLoading ? (
          <div className="text-sm text-slate-500">Chargement…</div>
        ) : months.length === 0 ? (
          <div className="text-sm text-slate-500">Aucune donnée.</div>
        ) : (
          <div className="space-y-2">
            {months.map(([k, v]) => (
              <div key={k} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500">{k}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500">Vol. {fmt(v.volume)}</span>
                    <span className="font-mono font-semibold text-amber-500">+{fmt(v.revenue)}</span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-500/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                    style={{ width: `${(v.revenue / maxRev) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-current/10 bg-white/[0.02] p-5 dark:border-white/10">
        <h2 className="mb-4 text-sm font-semibold">Répartition par devise</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-2 pr-4">Devise</th>
                <th className="py-2 pr-4">Transactions</th>
                <th className="py-2 pr-4">Volume</th>
                <th className="py-2 pr-4 text-right">Revenu</th>
              </tr>
            </thead>
            <tbody>
              {currencies.length === 0 ? (
                <tr><td colSpan={4} className="py-4 text-slate-500">—</td></tr>
              ) : currencies.map(([c, v]) => (
                <tr key={c} className="border-t border-current/5 dark:border-white/5">
                  <td className="py-2 pr-4 font-mono">{c}</td>
                  <td className="py-2 pr-4">{v.count}</td>
                  <td className="py-2 pr-4">{fmt(v.volume)}</td>
                  <td className="py-2 pr-4 text-right font-mono font-semibold text-amber-500">+{fmt(v.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, suffix, icon: Icon, accent }: { label: string; value: string; suffix?: string; icon: typeof DollarSign; accent: string }) {
  return (
    <div className="rounded-2xl border border-current/10 bg-white/[0.02] p-4 dark:border-white/10">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <div className="mt-2 font-mono text-xl font-bold">{value}</div>
      {suffix && <div className="text-[10px] text-slate-500">{suffix}</div>}
    </div>
  );
}
