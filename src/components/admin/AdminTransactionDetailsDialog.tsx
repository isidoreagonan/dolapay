import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Activity, CheckCircle2, Clock, XCircle, ArrowUpRight, ArrowDownRight, CreditCard, Receipt, Smartphone, Building, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTxDetails = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  created_at: string;
  description: string | null;
  fee_amount?: number | null;
  net_amount?: number | null;
  dola_margin?: number | null;
  payment_method?: string | null;
  customer_phone?: string | null;
  provider?: string | null;
  profiles?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
};

function StatusBadge({ status }: { status: string }) {
  if (status === "success" || status === "completed" || status === "validé") {
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

export function AdminTransactionDetailsDialog({ tx, onClose }: { tx: AdminTxDetails; onClose: () => void }) {
  const isPayout = tx.type === "pay-out";
  const isSuccess = tx.status === "success" || tx.status === "completed" || tx.status === "validé";

  // Calculs précis basés sur amount et net_amount (puisque transactions stocke net_amount et dola_margin, mais pas fee_amount)
  const fallbackFee = Math.round(tx.amount * (isPayout ? 0.01 : 0.02));
  
  let computedFee = fallbackFee;
  if (tx.net_amount) {
    computedFee = isPayout ? (tx.net_amount - tx.amount) : (tx.amount - tx.net_amount);
  }
  
  const fee = tx.fee_amount ?? computedFee;
  const net = tx.net_amount ?? (isPayout ? tx.amount + fee : tx.amount - fee);
  
  // Dola Margin (commission réelle conservée par DolaPay)
  const dolaMargin = tx.dola_margin ?? fee;

  return (
    <DialogContent className="max-w-md border-white/10 bg-[#0a0a0f] text-slate-200 shadow-2xl backdrop-blur-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl font-display text-white">
          <Activity className="h-5 w-5 text-sky-400" /> Détails de la transaction
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4 pt-2">
        {/* Status + Amount Header */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <div className="mb-2 flex justify-center">
            <StatusBadge status={tx.status} />
          </div>
          <div className="font-mono text-3xl font-bold tracking-tight text-white">
            {new Intl.NumberFormat("fr-FR").format(Number(tx.amount))} <span className="text-base font-normal text-slate-500">{tx.currency || 'XOF'}</span>
          </div>
          <div className="mt-1 font-mono text-[10px] text-slate-500">
            ID: {tx.id}
          </div>
        </div>

        {/* Détails Marchand */}
        {tx.profiles && (
          <div className="rounded-2xl border border-white/10 bg-blue-950/20 p-4 text-sm">
            <div className="mb-2 flex items-center gap-2 font-semibold text-blue-200">
              <Building className="h-4 w-4" /> Marchand associé
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Nom commercial</span>
              <span className="font-semibold text-white">{tx.profiles.full_name || "—"}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400 flex items-center gap-1"><Mail className="h-3 w-3"/> Email</span>
              <span className="text-white">{tx.profiles.email}</span>
            </div>
            <div className="flex justify-between py-1 text-xs">
              <span className="text-slate-500">ID Marchand</span>
              <span className="font-mono text-slate-400">{tx.profiles.id.slice(0,18)}…</span>
            </div>
          </div>
        )}

        {/* Breakdown Opération */}
        <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Type de flux</span>
            <span className="font-semibold capitalize text-white">{tx.type.replace("_", " ")}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Opérateur</span>
            <span className="font-mono font-semibold text-emerald-400 uppercase">{tx.payment_method || tx.provider || "—"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400 flex items-center gap-1"><Smartphone className="h-3 w-3"/> Tél. Client</span>
            <span className="font-mono font-semibold text-white">{tx.customer_phone || "—"}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Date & Heure</span>
            <span className="font-mono text-xs text-white">{new Date(tx.created_at).toLocaleString("fr-FR")}</span>
          </div>

          {isSuccess && (
            <>
              <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
                <span>{isPayout ? "Montant demandé (Brut)" : "Montant Brut"}</span>
                <span className="font-mono">{new Intl.NumberFormat("fr-FR").format(tx.amount)} {tx.currency || 'XOF'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5 text-slate-400">
                <span>Frais prélevés au marchand</span>
                <span className="font-mono">-{new Intl.NumberFormat("fr-FR").format(fee)} {tx.currency || 'XOF'}</span>
              </div>
              <div className={cn("flex justify-between py-1 border-b border-white/5 font-bold", isPayout ? "text-rose-400" : "text-emerald-400")}>
                <span>{isPayout ? "Débit total du solde (Net)" : "Net versé au marchand"}</span>
                <span className="font-mono text-base">{new Intl.NumberFormat("fr-FR").format(net)} {tx.currency || 'XOF'}</span>
              </div>
              
              {/* ADMIN ONLY: Margin */}
              <div className="mt-2 flex justify-between rounded-lg bg-sky-950/40 p-2 font-bold text-sky-400 border border-sky-900/50">
                <span>Marge DolaPay (Commission)</span>
                <span className="font-mono text-base">+{new Intl.NumberFormat("fr-FR").format(dolaMargin)} {tx.currency || 'XOF'}</span>
              </div>
            </>
          )}
        </div>

        {tx.description && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
            <div className="mb-1 font-semibold uppercase tracking-wider text-[10px] text-slate-500">Description</div>
            <p className="text-slate-300">{tx.description}</p>
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full mt-2 border-white/20 bg-white/5 text-white hover:bg-white/10" 
          onClick={onClose}
        >
          Fermer
        </Button>
      </div>
    </DialogContent>
  );
}
