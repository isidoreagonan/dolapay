import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Filter, Download, ArrowUpRight, ArrowDownRight, RefreshCw,
  CheckCircle2, Clock, XCircle, Smartphone, CreditCard, Receipt,
  Eye, Calendar, Hash, DollarSign, Activity, FileSpreadsheet,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useProfile } from "./route";

export const Route = createFileRoute("/_authenticated/dashboard/transactions")({
  component: TransactionsPage,
});

type Tx = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  description: string | null;
  created_at: string;
  payment_method?: string | null;
  customer_phone?: string | null;
  fee_amount?: number | null;
  net_amount?: number | null;
};

function TransactionsPage() {
  const { data: profile } = useProfile();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTx, setSelectedTx] = useState<Tx | null>(null);
  const [testMode, setTestMode] = useState(false);

  const { data: rawTxs = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["my-tx-all", profile?.id],
    queryFn: async (): Promise<Tx[]> => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const results: Tx[] = (data ?? []) as Tx[];
      const existingIds = new Set(results.map((t) => t.id));

      if (profile?.id) {
        for (const col of ["profile_id", "user_id", "merchant_id", "account_id", "owner_id"]) {
          const { data: wrs } = await (supabase.from("withdrawal_requests") as any)
            .select("*")
            .eq(col, profile.id);
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
                  description: `Retrait Mobile Money - ${w.method || "MOMO"} (${w.recipient_phone || "N/A"})`,
                } as any);
              }
            }
          }
        }

        const { data: batches } = await (supabase.from("payout_batches") as any)
          .select("*, payout_batch_items(*)")
          .eq("owner_id", profile.id);
        if (batches && batches.length > 0) {
          for (const b of batches) {
            if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
              for (const item of b.payout_batch_items) {
                if (!existingIds.has(item.id)) {
                  existingIds.add(item.id);
                  const amt = Number(item.amount || b.total_amount || 0);
                  const st = amt === 101 ? "failed" : ((item.status === "completed" || item.status === "success" || item.status === "validé") ? "success" : (item.status === "failed" || item.status === "rejected" ? "failed" : "pending"));
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
  });

  const txs = useMemo(() => {
    return rawTxs.filter((t) => 
      testMode ? t.description?.includes('_TEST') : !t.description?.includes('_TEST')
    );
  }, [rawTxs, testMode]);

  const getDerivedType = (t: Tx) => {
    if (t.type === "pay-in" && t.description?.includes("[API_CHARGE")) return "api_charge";
    return t.type;
  };

  const filtered = useMemo(() => {
    return txs.filter((t) => {
      const matchSearch =
        !search ||
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.customer_phone?.toLowerCase().includes(search.toLowerCase()) ||
        t.payment_method?.toLowerCase().includes(search.toLowerCase());

      const derivedType = getDerivedType(t);
      const matchType = typeFilter === "ALL" || derivedType === typeFilter;
      const matchStatus = statusFilter === "ALL" || t.status === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [txs, search, typeFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const payInsAll = txs.filter((t) => t.type === "pay-in" || t.type === "payment_link" || t.type === "api_charge");
    const payInsSuccess = payInsAll.filter((t) => t.status === "success" || t.status === "completed" || t.status === "validé" || t.status === "Réussi");
    
    const totalVolume = payInsSuccess.reduce((s, t) => s + Number(t.amount), 0);
    const totalNet = payInsSuccess.reduce((s, t) => s + Number(t.net_amount ?? Math.round(t.amount * 0.98)), 0);
    const totalFees = txs.filter((t) => t.status === "success" || t.status === "completed" || t.status === "validé" || t.status === "Réussi").reduce((s, t) => s + Number(t.fee_amount ?? Math.round(t.amount * 0.02)), 0);
    
    const successRate = payInsAll.length > 0 ? Math.round((payInsSuccess.length / payInsAll.length) * 100) : (txs.length > 0 ? Math.round((txs.filter((t) => t.status === "success" || t.status === "completed" || t.status === "validé" || t.status === "Réussi").length / txs.length) * 100) : 100);
    
    return { totalVolume, totalNet, totalFees, successRate };
  }, [txs]);

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ["ID", "Date", "Type", "Opérateur", "Téléphone", "Montant Brut", "Frais", "Net", "Devise", "Statut", "Description"];
    const rows = filtered.map((t) => [
      t.id,
      new Date(t.created_at).toISOString(),
      getDerivedType(t),
      t.payment_method ?? "",
      t.customer_phone ?? "",
      t.amount,
      t.fee_amount ?? Math.round(t.amount * 0.02),
      t.net_amount ?? Math.round(t.amount * 0.98),
      t.currency,
      t.status,
      `"${(t.description ?? "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dolapay_transactions_${testMode ? 'test_' : ''}${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
            <Activity className="h-3.5 w-3.5" /> Journal financier temps réel
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            Suivez l'intégralité de vos flux Mobile Money, API et Liens de paiement synchronisés avec PawaPay.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTestMode(!testMode)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 h-9 text-xs font-semibold transition-colors border",
              testMode
                ? "border-amber-500/30 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            <div className={cn("h-2 w-2 rounded-full", testMode ? "bg-amber-500" : "bg-muted-foreground/50")} />
            {testMode ? "Mode Test" : "Mode Live"}
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="gap-2"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isRefetching && "animate-spin")} />
            Actualiser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportCSV}
            disabled={filtered.length === 0}
            className="gap-2 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Volume brut encaissé"
          value={`${new Intl.NumberFormat("fr-FR").format(Math.round(stats.totalVolume))} F`}
          accent="primary"
        />
        <StatCard
          icon={Receipt}
          label="Revenu net marchand"
          value={`${new Intl.NumberFormat("fr-FR").format(Math.round(stats.totalNet))} F`}
          accent="emerald"
        />
        <StatCard
          icon={CreditCard}
          label="Frais DolaPay"
          value={`${new Intl.NumberFormat("fr-FR").format(Math.round(stats.totalFees))} F`}
        />
        <StatCard
          icon={CheckCircle2}
          label="Taux de succès"
          value={`${stats.successRate}%`}
          accent="emerald"
        />
      </div>

      {/* Filters Bar */}
      <Card className="p-4 border-white/10 bg-card/60 backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher (ID transaction, téléphone, opérateur, description)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 pl-9 border-border/80 bg-background/60"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-10 w-[160px] bg-background/60">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les types</SelectItem>
                <SelectItem value="payment_link">Lien de paiement</SelectItem>
                <SelectItem value="api_charge">API Charge</SelectItem>
                <SelectItem value="pay-in">Encaissement</SelectItem>
                <SelectItem value="pay-out">Décaissement</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 w-[140px] bg-background/60">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tous les statuts</SelectItem>
                <SelectItem value="success">Réussi</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden border-white/10 bg-card/60 backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Opérateur & Client</th>
                <th className="px-4 py-3 text-right">Montant Brut</th>
                <th className="px-4 py-3 text-right">Net Reçu</th>
                <th className="px-4 py-3 text-center">Statut</th>
                <th className="px-4 py-3 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      <span>Chargement de vos transactions…</span>
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    <Receipt className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" />
                    <p className="font-semibold">Aucune transaction trouvée</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {search || typeFilter !== "ALL" || statusFilter !== "ALL"
                        ? "Modifiez vos filtres de recherche pour voir plus de résultats."
                        : "Vos encaissements apparaîtront ici en temps réel."}
                    </p>
                  </td>
                </tr>
              )}
              {filtered.map((t) => {
                const isPayout = t.type === "pay-out";
                const isSuccess = t.status === "success";
                const net = t.net_amount ?? (t.fee_amount ? t.amount - t.fee_amount : t.amount * 0.98);

                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTx(t)}
                    className="cursor-pointer transition-colors hover:bg-muted/40 group"
                  >
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-medium text-foreground">
                        {new Date(t.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {new Date(t.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <TypeBadge type={getDerivedType(t)} />
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        {t.payment_method ? (
                          <Badge variant="outline" className="text-[10px] uppercase font-mono bg-primary/5 border-primary/20 text-primary shrink-0">
                            {t.payment_method}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                        {t.customer_phone && (
                          <span className="font-mono text-xs text-foreground flex items-center gap-1">
                            <Smartphone className="h-3 w-3 text-muted-foreground" />
                            {t.customer_phone}
                          </span>
                        )}
                      </div>
                      {t.description && (
                        <div className="text-[11px] text-muted-foreground truncate max-w-[240px] mt-0.5">
                          {t.description}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <span className={cn(
                        "font-mono font-bold text-sm",
                        isPayout ? "text-rose-500" : "text-foreground"
                      )}>
                        {isPayout ? "-" : "+"}{new Intl.NumberFormat("fr-FR").format(Number(t.amount))} {t.currency}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap font-mono text-sm">
                      {isSuccess ? (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {new Intl.NumberFormat("fr-FR").format(Math.round(Number(net)))} {t.currency}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <StatusBadge status={t.status} />
                    </td>

                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-60 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); setSelectedTx(t); }}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTx} onOpenChange={(v) => !v && setSelectedTx(null)}>
        {selectedTx && <TransactionDetailsDialog tx={selectedTx} onClose={() => setSelectedTx(null)} />}
      </Dialog>
    </div>
  );
}

function StatCard({
  icon: Icon, label, value, accent = "default",
}: { icon: React.ElementType; label: string; value: string; accent?: "default" | "primary" | "emerald" }) {
  const ring = accent === "emerald" ? "ring-emerald-500/20" : accent === "primary" ? "ring-primary/20" : "ring-border";
  const text = accent === "emerald" ? "text-emerald-500" : accent === "primary" ? "text-primary" : "text-muted-foreground";
  return (
    <div className={cn("rounded-2xl border bg-card/60 p-4 ring-1 backdrop-blur-xl", ring)}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={cn("h-4 w-4", text)} />
      </div>
      <div className="mt-2 text-2xl font-black tracking-tight">{value}</div>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  if (type === "payment_link") {
    return <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-1 text-[11px] font-semibold text-purple-600 dark:text-purple-300"><Receipt className="h-3 w-3" /> Lien</span>;
  }
  if (type === "api_charge") {
    return <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-300"><CreditCard className="h-3 w-3" /> API Charge</span>;
  }
  if (type === "pay-out") {
    return <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-[11px] font-semibold text-rose-600 dark:text-rose-300"><ArrowDownRight className="h-3 w-3" /> Décaissement</span>;
  }
  return <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300"><ArrowUpRight className="h-3 w-3" /> Encaissement</span>;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
        <CheckCircle2 className="h-3 w-3" /> Réussi
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-300">
        <Clock className="h-3 w-3 animate-pulse" /> En cours
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-300">
      <XCircle className="h-3 w-3" /> Échoué
    </span>
  );
}

function TransactionDetailsDialog({ tx, onClose }: { tx: Tx; onClose: () => void }) {
  const fee = tx.fee_amount ?? Math.round(tx.amount * 0.02);
  const net = tx.net_amount ?? (tx.amount - fee);
  const isSuccess = tx.status === "success";

  return (
    <DialogContent className="max-w-md border-white/10 bg-card/95 backdrop-blur-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <Activity className="h-5 w-5 text-primary" /> Détails de la transaction
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        {/* Status + Amount Header */}
        <div className="rounded-2xl border border-border/60 bg-background/50 p-4 text-center">
          <div className="mb-2 flex justify-center">
            <StatusBadge status={tx.status} />
          </div>
          <div className="text-3xl font-black tracking-tight">
            {new Intl.NumberFormat("fr-FR").format(Number(tx.amount))} <span className="text-base font-normal text-muted-foreground">{tx.currency}</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground font-mono">
            ID: {tx.id}
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2.5 rounded-2xl border border-border/60 bg-background/40 p-4 text-sm">
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Type de flux</span>
            <span className="font-semibold capitalize">{tx.type.replace("_", " ")}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Opérateur Mobile Money</span>
            <span className="font-mono font-semibold text-primary uppercase">{tx.payment_method ?? "Non spécifié"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Téléphone client</span>
            <span className="font-mono font-semibold">{tx.customer_phone ?? "—"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Date & Heure</span>
            <span className="font-mono text-xs">{new Date(tx.created_at).toLocaleString("fr-FR")}</span>
          </div>

          {isSuccess && (
            <>
              <div className="flex justify-between py-1 border-b border-border/40 text-muted-foreground">
                <span>Frais de plateforme (2%)</span>
                <span className="font-mono">-{new Intl.NumberFormat("fr-FR").format(fee)} {tx.currency}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-emerald-600 dark:text-emerald-400">
                <span>Net versé sur votre compte</span>
                <span className="font-mono text-base">{new Intl.NumberFormat("fr-FR").format(net)} {tx.currency}</span>
              </div>
            </>
          )}
        </div>

        {tx.description && (
          <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-xs">
            <div className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground mb-1">Description</div>
            <p className="text-foreground">{tx.description}</p>
          </div>
        )}

        <Button variant="outline" className="w-full mt-2" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </DialogContent>
  );
}
