import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import { AdminTransactionDetailsDialog, type AdminTxDetails } from "@/components/admin/AdminTransactionDetailsDialog";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/live")({
  component: LivePage,
});

type Tx = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  created_at: string;
  profile_id: string;
  description: string | null;
  fee_amount?: number | null;
  net_amount?: number | null;
  dola_margin?: number | null;
  payment_method?: string | null;
  customer_phone?: string | null;
  provider?: string | null;
  profiles?: any;
};

function LivePage() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [pulse, setPulse] = useState<string | null>(null);
  const [selectedTx, setSelectedTx] = useState<AdminTxDetails | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("transactions")
        .select("id,amount,currency,status,type,created_at,profile_id,description,fee_amount,net_amount,dola_margin,payment_method,customer_phone,provider,profiles(id,full_name,email)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (mounted && data) setTxs(data as Tx[]);
    })();

    const channel = supabase
      .channel("admin-live-tx")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const row = payload.new as Tx;
          setTxs((prev) => [row, ...prev].slice(0, 100));
          setPulse(row.id);
          setTimeout(() => setPulse(null), 1500);
        } else if (payload.eventType === "UPDATE") {
          const row = payload.new as Tx;
          setTxs((prev) => prev.map((t) => (t.id === row.id ? row : t)));
        }
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Flux temps réel</h1>
          <p className="mt-1 text-sm text-slate-400">Toutes les transactions DolaPay au moment où elles arrivent.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Realtime · {txs.length} événements
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Reçu</th>
                <th className="px-3 py-2 text-left font-medium">ID</th>
                <th className="px-3 py-2 text-left font-medium">Type</th>
                <th className="px-3 py-2 text-right font-medium">Montant</th>
                <th className="px-3 py-2 text-left font-medium">Devise</th>
                <th className="px-3 py-2 text-left font-medium">Statut</th>
                <th className="px-3 py-2 text-left font-medium">Marchand</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTx(t as any)}
                  className={cn(
                    "cursor-pointer border-b border-white/[0.04] transition-colors group",
                    pulse === t.id ? "bg-emerald-400/10" : "hover:bg-white/[0.03]",
                  )}
                >
                  <td className="px-3 py-2 font-mono text-slate-500">{new Date(t.created_at).toLocaleTimeString("fr-FR")}</td>
                  <td className="px-3 py-2 font-mono text-slate-300">{t.id.slice(0, 12)}…</td>
                  <td className="px-3 py-2 capitalize text-slate-400">{t.type}</td>
                  <td className="px-3 py-2 text-right font-mono text-white">{Number(t.amount).toLocaleString("fr-FR")}</td>
                  <td className="px-3 py-2 text-slate-400">{t.currency}</td>
                  <td className="px-3 py-2"><StatusDot status={t.status} /></td>
                  <td className="px-3 py-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-500">acc_{t.profile_id.replace(/-/g, "").slice(0, 12)}</span>
                    <Eye className="h-4 w-4 text-sky-400/50 opacity-0 transition-opacity group-hover:opacity-100" />
                  </td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-12 text-center text-slate-500">En attente d'événements…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Dialog open={!!selectedTx} onOpenChange={(v) => !v && setSelectedTx(null)}>
        {selectedTx && <AdminTransactionDetailsDialog tx={selectedTx} onClose={() => setSelectedTx(null)} />}
      </Dialog>
    </div>
  );
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
