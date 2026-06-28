import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, TrendingDown, Snowflake, Activity } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/risk")({
  component: RiskPage,
});

type Tx = { id: string; amount: number; status: string; type: string; created_at: string; profile_id: string; currency: string | null };
type Profile = { id: string; email: string; full_name: string | null; kyc_status: string; created_at: string };

const LARGE_TX_THRESHOLD_XOF = 2_000_000;

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n));
}

function RiskPage() {
  const { data: txs = [] } = useQuery({
    queryKey: ["admin-risk-txs"],
    queryFn: async (): Promise<Tx[]> => {
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data, error } = await supabase
        .from("transactions")
        .select("id,amount,status,type,created_at,profile_id,currency")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(2000);
      if (error) throw error;
      return (data ?? []) as Tx[];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin-risk-profiles"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id,email,full_name,kyc_status,created_at");
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
  });

  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  // Signal 1: large transactions (>= threshold)
  const large = txs.filter((t) => Number(t.amount) >= LARGE_TX_THRESHOLD_XOF).slice(0, 30);

  // Signal 2: profiles with >= 3 failed tx in last 30j
  const failedByProfile = new Map<string, number>();
  for (const t of txs) {
    if (t.status === "failed") failedByProfile.set(t.profile_id, (failedByProfile.get(t.profile_id) ?? 0) + 1);
  }
  const failClusters = Array.from(failedByProfile.entries())
    .filter(([, n]) => n >= 3)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);

  // Signal 3: frozen accounts
  const frozen = profiles.filter((p) => p.kyc_status === "frozen");

  // Signal 4: velocity — same profile > 10 successful tx / 24h
  const day = 24 * 3600 * 1000;
  const recent = txs.filter((t) => Date.now() - new Date(t.created_at).getTime() <= day && t.status === "success");
  const byProfile24h = new Map<string, number>();
  for (const t of recent) byProfile24h.set(t.profile_id, (byProfile24h.get(t.profile_id) ?? 0) + 1);
  const velocity = Array.from(byProfile24h.entries())
    .filter(([, n]) => n >= 10)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20);

  return (
    <div className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-wider text-slate-500">Surveillance</div>
        <h1 className="mt-1 text-2xl font-bold">Risques & alertes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Signaux automatiques sur les 30 derniers jours · seuils calibrés sur le marché ouest-africain.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={AlertTriangle} label="Transactions élevées" value={large.length} accent="text-amber-500" />
        <Stat icon={TrendingDown} label="Clusters d'échecs" value={failClusters.length} accent="text-rose-500" />
        <Stat icon={Snowflake} label="Comptes gelés" value={frozen.length} accent="text-sky-500" />
        <Stat icon={Activity} label="Vélocité anormale" value={velocity.length} accent="text-violet-500" />
      </div>

      <Section
        title={`Transactions ≥ ${fmt(LARGE_TX_THRESHOLD_XOF)} XOF`}
        empty="Aucune transaction au-dessus du seuil."
      >
        {large.length > 0 && (
          <table className="w-full text-sm">
            <thead className="text-left text-[10px] uppercase tracking-wider text-slate-500">
              <tr><th className="py-2 pr-4">Date</th><th className="py-2 pr-4">Marchand</th><th className="py-2 pr-4">Type</th><th className="py-2 pr-4">Statut</th><th className="py-2 pr-4 text-right">Montant</th></tr>
            </thead>
            <tbody>
              {large.map((t) => {
                const p = profileMap.get(t.profile_id);
                return (
                  <tr key={t.id} className="border-t border-current/5 dark:border-white/5">
                    <td className="py-2 pr-4 font-mono text-xs text-slate-500">{new Date(t.created_at).toLocaleString("fr-FR")}</td>
                    <td className="py-2 pr-4">
                      <Link to="/admin/merchants/$id" params={{ id: t.profile_id }} className="hover:underline">
                        {p?.full_name || p?.email || t.profile_id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 text-xs">{t.type}</td>
                    <td className="py-2 pr-4 text-xs">{t.status}</td>
                    <td className="py-2 pr-4 text-right font-mono">{fmt(Number(t.amount))} {t.currency || "XOF"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Section>

      <Section title="Clusters d'échecs (≥ 3 échecs / 30j)" empty="Aucun cluster détecté.">
        {failClusters.length > 0 && (
          <ul className="divide-y divide-current/5 dark:divide-white/5">
            {failClusters.map(([pid, n]) => {
              const p = profileMap.get(pid);
              return (
                <li key={pid} className="flex items-center justify-between py-2 text-sm">
                  <Link to="/admin/merchants/$id" params={{ id: pid }} className="hover:underline">
                    {p?.full_name || p?.email || pid.slice(0, 8)}
                  </Link>
                  <span className="rounded-full bg-rose-500/10 px-2 py-0.5 font-mono text-xs text-rose-500">{n} échecs</span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Vélocité (≥ 10 tx réussies / 24h)" empty="Aucune anomalie de vélocité.">
        {velocity.length > 0 && (
          <ul className="divide-y divide-current/5 dark:divide-white/5">
            {velocity.map(([pid, n]) => {
              const p = profileMap.get(pid);
              return (
                <li key={pid} className="flex items-center justify-between py-2 text-sm">
                  <Link to="/admin/merchants/$id" params={{ id: pid }} className="hover:underline">
                    {p?.full_name || p?.email || pid.slice(0, 8)}
                  </Link>
                  <span className="rounded-full bg-violet-500/10 px-2 py-0.5 font-mono text-xs text-violet-500">{n} tx / 24h</span>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Comptes gelés" empty="Aucun compte gelé.">
        {frozen.length > 0 && (
          <ul className="divide-y divide-current/5 dark:divide-white/5">
            {frozen.map((p) => (
              <li key={p.id} className="flex items-center justify-between py-2 text-sm">
                <Link to="/admin/merchants/$id" params={{ id: p.id }} className="hover:underline">
                  {p.full_name || p.email}
                </Link>
                <span className="rounded-full bg-sky-500/10 px-2 py-0.5 font-mono text-xs text-sky-500">gelé</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: typeof AlertTriangle; label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl border border-current/10 bg-white/[0.02] p-4 dark:border-white/10">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
        <Icon className={`h-4 w-4 ${accent}`} />
      </div>
      <div className="mt-2 font-mono text-xl font-bold">{value}</div>
    </div>
  );
}

function Section({ title, empty, children }: { title: string; empty: string; children?: React.ReactNode }) {
  const hasChildren = !!children && (Array.isArray(children) ? children.length > 0 : true);
  return (
    <section className="rounded-2xl border border-current/10 bg-white/[0.02] p-5 dark:border-white/10">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      {hasChildren ? children : <div className="text-sm text-slate-500">{empty}</div>}
    </section>
  );
}
