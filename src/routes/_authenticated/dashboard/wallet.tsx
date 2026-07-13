import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, ShieldCheck, Lock,
  Loader2, KeyRound, Eye, EyeOff, AlertCircle, Send, Landmark, Smartphone,
  CheckCircle2, XCircle, Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, type Profile } from "./route";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/wallet")({
  component: WalletPage,
});

type Wallet = {
  id: string;
  profile_id: string;
  balance: number;
  currency: string;
  hashed_pin: string | null;
  created_at: string;
};

type WithdrawalRequest = {
  id: string;
  amount: number;
  currency: string;
  method: string;
  recipient_phone: string;
  status: "pending" | "success" | "failed";
  created_at: string;
};

function WalletPage() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // Form State for Withdrawal
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("ORANGE");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawPin, setWithdrawPin] = useState("");
  const [showWithdrawPin, setShowWithdrawPin] = useState(false);

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["my-wallet", profile?.id],
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Wallet | null> => {
      const candidates = ["profile_id", "user_id", "merchant_id", "account_id", "owner_id", "id"];
      let data: any = null;
      let error: any = null;

      for (const col of candidates) {
        const res = await (supabase.from("wallets") as any)
          .select("*")
          .eq(col, profile!.id)
          .maybeSingle();

        if (!res.error || !res.error.message?.includes(col)) {
          data = res.data;
          error = res.error;
          break;
        }
        error = res.error;
      }

      if (error && !data) {
        // Tentative en ignorant l'erreur si elle concerne un schéma absent ou en renvoyant null
        return null;
      }
      return data as Wallet;
    },
  });

  const { data: withdrawals = [], isLoading: withdrawalsLoading } = useQuery({
    queryKey: ["my-withdrawals", profile?.id],
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<WithdrawalRequest[]> => {
      const candidates = ["profile_id", "user_id", "merchant_id", "account_id", "owner_id", "id"];
      let data: any = null;
      let error: any = null;

      for (const col of candidates) {
        const res = await (supabase.from("withdrawal_requests") as any)
          .select("*")
          .eq(col, profile!.id)
          .order("created_at", { ascending: false });

        if (!res.error || !res.error.message?.includes(col)) {
          data = res.data;
          error = res.error;
          break;
        }
        error = res.error;
      }

      if (error && !data) return [];
      return (data ?? []) as WithdrawalRequest[];
    },
  });

  const setupPinMutation = useMutation({
    mutationFn: async (newPin: string) => {
      if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
        throw new Error("Le code PIN doit comporter 4 chiffres.");
      }
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/public/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({ action: "setup-pin", pin: newPin }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Erreur de configuration du code PIN.");
    },
    onSuccess: () => {
      toast.success("Code PIN configuré avec succès !");
      qc.invalidateQueries({ queryKey: ["my-wallet"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/public/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({
          action: "withdraw",
          amount: Number(withdrawAmount),
          method: withdrawMethod,
          phone: withdrawPhone,
          pin: withdrawPin,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Le retrait a échoué.");
      return body;
    },
    onSuccess: () => {
      toast.success("Demande de retrait enregistrée et traitée avec succès !");
      setWithdrawOpen(false);
      setWithdrawAmount("");
      setWithdrawPhone("");
      setWithdrawPin("");
      qc.invalidateQueries({ queryKey: ["my-wallet"] });
      qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  if (walletLoading || withdrawalsLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si le portefeuille n'est pas encore configuré (pas de portefeuille ou pas de code PIN défini)
  if (!wallet || !wallet.hashed_pin) {
    return (
      <div className="mx-auto max-w-md space-y-6 py-8">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sécurisez votre Portefeuille</h1>
          <p className="text-sm text-muted-foreground">
            Configurez un code PIN secret à 4 chiffres pour autoriser vos futurs retraits d'argent de manière sécurisée.
          </p>
        </div>

        <Card className="p-6 space-y-4 border-slate-200/60 dark:border-slate-800/60">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Code PIN (4 chiffres)</Label>
              <div className="relative">
                <Input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="xxxx"
                  maxLength={4}
                  className="font-mono tracking-widest text-center text-lg h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Confirmez votre code PIN</Label>
              <Input
                type={showPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="xxxx"
                maxLength={4}
                className="font-mono tracking-widest text-center text-lg h-11"
              />
            </div>
          </div>

          <Button
            onClick={() => {
              if (pin !== confirmPin) {
                toast.error("Les codes PIN ne correspondent pas.");
                return;
              }
              setupPinMutation.mutate(pin);
            }}
            disabled={setupPinMutation.isPending}
            className="w-full h-11 font-bold rounded-xl"
          >
            {setupPinMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Configurer le Portefeuille
          </Button>
        </Card>
      </div>
    );
  }

  const accountId = profile?.id ? `acc_${profile.id.replace(/-/g, "").slice(0, 16)}` : "";

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mon Portefeuille</h1>
          <p className="text-sm text-muted-foreground">Gérez votre solde DolaPay, visualisez vos rapports et initiez des retraits.</p>
        </div>
        <Button
          onClick={() => setWithdrawOpen(true)}
          className="w-full sm:w-auto h-11 font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
        >
          <ArrowUpRight className="h-4 w-4" /> Faire un retrait
        </Button>
      </div>

      {/* Main Grid: Card + Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Virtual Credit Card with Glassmorphism */}
        <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-primary p-6 text-white shadow-2xl flex flex-col justify-between min-h-[220px]">
          {/* Glass Overlay effects */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          
          <div className="relative flex justify-between items-start z-10">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-purple-200/80 font-bold">Solde Disponible</div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight">
                {wallet ? fmt(wallet.balance) : "0"} <span className="text-lg font-bold text-purple-200">{wallet?.currency || "XOF"}</span>
              </div>
            </div>
            <WalletIcon className="h-8 w-8 text-white/30" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="font-mono text-lg tracking-widest text-purple-100">
              {accountId ? `${accountId.slice(0, 4)}  ${accountId.slice(4, 8)}  ${accountId.slice(8, 12)}  ${accountId.slice(12, 16)}` : "**** **** **** ****"}
            </div>
            <div className="flex justify-between items-end text-xs">
              <div>
                <div className="text-purple-300 font-bold uppercase tracking-wider text-[9px]">Titulaire du compte</div>
                <div className="font-semibold text-sm">{profile?.full_name || profile?.email}</div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-bold backdrop-blur">
                  {profile?.account_type.toUpperCase()} TIER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <Card className="p-6 border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Résumé des flux</h3>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                  <ArrowDownLeft className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Entrées (Payin)</span>
              </div>
              <span className="font-bold text-emerald-600">Actif</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Retraits (Payout)</span>
              </div>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {withdrawals.length} effectué{withdrawals.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-muted/50 p-2.5 rounded-xl border border-border">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Tous les retraits vers vos comptes Mobile Money sont sécurisés avec cryptage de niveau bancaire.</span>
          </div>
        </Card>
      </div>

      {/* Withdrawal History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold tracking-tight">Historique des retraits</h2>
        {withdrawals.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
            <WalletIcon className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <h3 className="text-sm font-bold">Aucun retrait effectué</h3>
            <p className="text-xs text-muted-foreground max-w-xs mt-1">Vous n'avez pas encore initié de demande de retrait d'argent sur ce portefeuille.</p>
          </Card>
        ) : (
          <Card className="overflow-hidden border-slate-200/60 dark:border-slate-800/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground text-xs uppercase font-bold border-b border-border">
                  <tr>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Méthode</th>
                    <th className="px-6 py-3.5">Numéro récepteur</th>
                    <th className="px-6 py-3.5 text-right">Montant</th>
                    <th className="px-6 py-3.5 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-500">
                        {new Date(w.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-4 font-bold text-xs">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full uppercase text-[10px]",
                          w.method === "ORANGE" && "bg-orange-500/10 text-orange-600",
                          w.method === "MOOV" && "bg-blue-500/10 text-blue-600",
                          w.method === "TELECEL" && "bg-red-500/10 text-red-600"
                        )}>
                          {w.method} MONEY
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">{w.recipient_phone}</td>
                      <td className="px-6 py-4 text-right font-bold">
                        -{fmt(w.amount)} <span className="text-xs text-muted-foreground">{w.currency}</span>
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center">
                        <StatusBadge status={w.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Withdrawal Modal */}
      {withdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 space-y-6 relative border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Initier un retrait</h2>
              <p className="text-xs text-muted-foreground mt-1">L'argent sera immédiatement transféré vers le compte Mobile Money configuré.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); withdrawMutation.mutate(); }} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-xs font-semibold">Montant à retirer (XOF)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Min: 100 XOF"
                  required
                  min={100}
                  className="h-11 rounded-xl"
                />
                {wallet && (
                  <p className="text-[10px] text-muted-foreground text-right">
                    Solde disponible : <span className="font-semibold">{fmt(wallet.balance)} XOF</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Moyen de retrait</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "ORANGE", name: "Orange", color: "border-orange-500 text-orange-600 bg-orange-500/5" },
                    { id: "MOOV", name: "Moov", color: "border-blue-500 text-blue-600 bg-blue-500/5" },
                    { id: "TELECEL", name: "Telecel", color: "border-red-500 text-red-600 bg-red-500/5" }
                  ].map((m) => {
                    const active = withdrawMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setWithdrawMethod(m.id)}
                        className={cn(
                          "py-2 border rounded-xl font-bold text-xs text-center transition-all",
                          active ? m.color + " border-2 shadow-sm" : "border-slate-200 dark:border-slate-800 text-muted-foreground hover:bg-slate-50"
                        )}
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="recipientPhone" className="text-xs font-semibold">Numéro de téléphone récepteur</Label>
                <div className="relative">
                  <Smartphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="recipientPhone"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="226xxxxxxxx"
                    required
                    className="pl-9 h-11 rounded-xl font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="withdrawPin" className="text-xs font-semibold">Code PIN secret (4 chiffres)</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="withdrawPin"
                    type={showWithdrawPin ? "text" : "password"}
                    value={withdrawPin}
                    onChange={(e) => setWithdrawPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="xxxx"
                    maxLength={4}
                    required
                    className="pl-9 font-mono tracking-widest text-center text-lg h-11 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWithdrawPin(!showWithdrawPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground"
                  >
                    {showWithdrawPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWithdrawOpen(false)}
                  className="w-1/2 h-11 rounded-xl"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={withdrawMutation.isPending}
                  className="w-1/2 h-11 rounded-xl font-bold shadow-lg shadow-primary/20"
                >
                  {withdrawMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-2" />}
                  Confirmer
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "success" | "failed" }) {
  const config = {
    pending: { label: "En cours", cls: "bg-amber-500/10 text-amber-600 dark:text-amber-300", Icon: Clock },
    success: { label: "Validé", cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300", Icon: CheckCircle2 },
    failed: { label: "Échoué", cls: "bg-rose-500/10 text-rose-600 dark:text-rose-300", Icon: XCircle }
  };
  const c = config[status] ?? config.pending;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", c.cls)}>
      <c.Icon className="h-3 w-3 shrink-0" />
      {c.label}
    </span>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}
