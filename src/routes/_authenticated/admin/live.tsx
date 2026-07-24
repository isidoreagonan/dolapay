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
      const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
      const { data } = await supabase
        .from("transactions")
        .select("id,amount,currency,status,type,created_at,profile_id,description,net_amount,dola_margin,payment_method,customer_phone,provider,profiles(id,full_name,email)")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(50);
      
      let results: Tx[] = (data ?? []) as Tx[];
      const existingIds = new Set(results.map((t) => t.id));

      const { data: wrs } = await (supabase.from("withdrawal_requests") as any)
        .select("id,amount,status,created_at,profile_id")
        .order("created_at", { ascending: false })
        .limit(20);
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
                currency: "XOF",
                created_at: w.created_at,
                profile_id: w.profile_id,
              } as any);
            }
          }
        }
      }

      const { data: batches } = await (supabase.from("payout_batches") as any)
        .select("*, payout_batch_items(*)")
        .order("created_at", { ascending: false })
        .limit(5);
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
                    currency: "XOF",
                    created_at: item.created_at || b.created_at,
                    profile_id: b.owner_id,
                  } as any);
                }
              }
            }
          }
        }
      }

      const { data: oldWrs } = await supabase
        .from("withdrawals")
        .select("id,amount,status,created_at,merchant_id")
        .order("created_at", { ascending: false })
        .limit(20);
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
                currency: "XOF",
                created_at: w.created_at,
                profile_id: w.merchant_id,
              } as any);
            }
          }
        }
      }

      results = results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 50);

      if (mounted) setTxs(results);
    })();

    const channel = supabase
      .channel("admin-live-tx")
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const row = payload.new as Tx;
          setTxs((prev) => [row, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 100));
          setPulse(row.id);
          setTimeout(() => setPulse(null), 1500);
        } else if (payload.eventType === "UPDATE") {
          const row = payload.new as Tx;
          setTxs((prev) => prev.map((t) => (t.id === row.id ? { ...t, ...row } : t)));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "withdrawal_requests" }, (payload) => {
        const amt = Number(payload.new.amount || 0);
        if (amt === 101) return;
        const st = (payload.new.status === "completed" || payload.new.status === "success" || payload.new.status === "validé") ? "success" : (payload.new.status === "failed" || payload.new.status === "rejected" ? "failed" : "pending");
        const row = {
          id: payload.new.id,
          amount: amt,
          status: st,
          type: "pay-out",
          currency: "XOF",
          created_at: payload.new.created_at,
          profile_id: payload.new.profile_id,
        } as Tx;

        if (payload.eventType === "INSERT") {
          setTxs((prev) => [row, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 100));
          setPulse(row.id);
          setTimeout(() => setPulse(null), 1500);
        } else if (payload.eventType === "UPDATE") {
          setTxs((prev) => prev.map((t) => (t.id === row.id ? { ...t, ...row } : t)));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "withdrawals" }, (payload) => {
        const amt = Number(payload.new.amount || 0);
        if (amt === 101) return;
        const st = (payload.new.status === "completed" || payload.new.status === "success" || payload.new.status === "validé") ? "success" : (payload.new.status === "failed" || payload.new.status === "rejected" ? "failed" : "pending");
        const row = {
          id: payload.new.id,
          amount: amt,
          status: st,
          type: "pay-out",
          currency: "XOF",
          created_at: payload.new.created_at,
          profile_id: payload.new.merchant_id,
        } as Tx;

        if (payload.eventType === "INSERT") {
          setTxs((prev) => [row, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 100));
          setPulse(row.id);
          setTimeout(() => setPulse(null), 1500);
        } else if (payload.eventType === "UPDATE") {
          setTxs((prev) => prev.map((t) => (t.id === row.id ? { ...t, ...row } : t)));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "payout_batch_items" }, (payload) => {
        const amt = Number(payload.new.amount || 0);
        if (amt === 101) return;
        const st = (payload.new.status === "completed" || payload.new.status === "success" || payload.new.status === "validé") ? "success" : (payload.new.status === "failed" || payload.new.status === "rejected" ? "failed" : "pending");
        const row = {
          id: payload.new.id,
          amount: amt,
          status: st,
          type: "pay-out",
          currency: "XOF",
          created_at: payload.new.created_at,
        } as Tx;

        if (payload.eventType === "INSERT") {
          setTxs((prev) => [row, ...prev].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 100));
          setPulse(row.id);
          setTimeout(() => setPulse(null), 1500);
        } else if (payload.eventType === "UPDATE") {
          setTxs((prev) => prev.map((t) => (t.id === row.id ? { ...t, ...row } : t)));
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
