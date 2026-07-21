import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Send, ArrowLeft, Loader2, Landmark, Check, ChevronDown, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { WITHDRAW_COUNTRIES } from "@/lib/withdraw";
import { cn } from "@/lib/utils";
import { useProfile as useProfileHook } from "./route";
import { FlagIcon } from "@/components/ui/flag-icon";

export const Route = createFileRoute("/_authenticated/dashboard/wallet_/withdraw")({
  component: WithdrawPage,
});

function WithdrawPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: profile } = useProfileHook();

  const [withdrawCountry, setWithdrawCountry] = useState("BF");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPin, setWithdrawPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const { data: savedMethods = [] } = useQuery({
    queryKey: ["saved_payout_methods", profile?.id],
    enabled: !!profile?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_payout_methods").select("*").eq("profile_id", profile!.id).order("created_at", { ascending: false });
      if (error) console.error("Error fetching saved methods:", error);
      return data || [];
    }
  });

  const activeCountry = WITHDRAW_COUNTRIES.find((c) => c.code === withdrawCountry) || WITHDRAW_COUNTRIES[0];
  const activeMethod = activeCountry.methods.find((m) => m.name === withdrawMethod);

  const withdrawMutation = useMutation({
    mutationFn: async () => {
      setWithdrawError(null);
      if (!withdrawPin) throw new Error("Le code PIN est requis.");
      
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch("/api/public/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({
          action: "withdraw",
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          phone: activeCountry.prefix + withdrawPhone,
          pin: withdrawPin, // We pass the PIN to the API now
          testMode: false,
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Le retrait a échoué.");
      return body;
    },
    onSuccess: () => {
      toast.success("Demande de retrait traitée avec succès !");
      qc.invalidateQueries({ queryKey: ["my-wallet"] });
      qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
      navigate({ to: "/dashboard/wallet" });
    },
    onError: (err: any) => {
      setWithdrawError(err.message);
      qc.invalidateQueries({ queryKey: ["my-wallet"] });
      qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
    },
  });

  return (
    <div className="mx-auto max-w-4xl py-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/dashboard/wallet" })} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-6 h-6 text-primary" />
            Initier un retrait
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            L'argent sera transféré immédiatement vers votre compte Mobile Money.
          </p>
        </div>
      </div>

      <Card className="p-6 md:p-8 rounded-2xl border-slate-200/60 dark:border-slate-800/60 shadow-xl bg-white dark:bg-slate-950">
        <form onSubmit={(e) => { e.preventDefault(); withdrawMutation.mutate(); }} className="space-y-8">
          
          {withdrawError && (
            <div className="flex items-start gap-4 p-5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-red-800 dark:text-red-400">Échec du retrait</h3>
                <p className="text-sm text-red-600 dark:text-red-300 mt-1 leading-relaxed">
                  {withdrawError}
                </p>
              </div>
            </div>
          )}

          {savedMethods.length > 0 && (
            <div className="space-y-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Mes moyens enregistrés
              </Label>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {savedMethods.map((m: any) => {
                  const countryDef = WITHDRAW_COUNTRIES.find(c => c.code === m.country_code);
                  const providerDef = countryDef?.methods.find(p => p.name === m.provider || p.id === m.provider);
                  const isSelected = withdrawCountry === m.country_code && withdrawMethod === m.provider && withdrawPhone === m.phone_number;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setWithdrawCountry(m.country_code);
                        setWithdrawMethod(m.provider);
                        setWithdrawPhone(m.phone_number);
                      }}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl border text-left shrink-0 transition-all",
                        isSelected ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20" : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      {providerDef?.logoUrl ? (
                        <img src={providerDef.logoUrl} alt={m.provider} className="w-8 h-8 rounded-md object-contain bg-white dark:bg-slate-900 p-1 border shadow-sm shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">{String(m.provider || "").substring(0, 2).toUpperCase()}</div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{m.provider}</div>
                        <div className="text-xs font-mono text-slate-500">{m.phone_number}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Colonne de gauche : Configuration */}
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Pays de retrait</Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FlagIcon code={activeCountry.code} flag={activeCountry.flag} name={activeCountry.name} className="w-6 h-4 shadow-sm" />
                  <span>{activeCountry.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-bold text-xs opacity-75">+{activeCountry.prefix}</span>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </button>

              {showCountryDropdown && (
                <div className="absolute top-[calc(100%+4px)] left-0 w-full z-10 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 max-h-60 overflow-y-auto">
                  {WITHDRAW_COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setWithdrawCountry(c.code);
                        setWithdrawMethod("");
                        setShowCountryDropdown(false);
                      }}
                      className={cn("w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800", withdrawCountry === c.code ? "bg-primary/10 text-primary font-bold" : "text-slate-700 dark:text-slate-300")}
                    >
                      <div className="flex items-center gap-3">
                        <FlagIcon code={c.code} flag={c.flag} name={c.name} className="w-6 h-4 shadow-sm" />
                        <span>{c.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Moyen de paiement</Label>
              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {activeCountry.methods.length} options en {activeCountry.name}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {activeCountry.methods.map((m) => {
                const isSelected = withdrawMethod === m.name;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setWithdrawMethod(m.name)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
                    )}
                  >
                    {m.logoUrl ? (
                      <img src={m.logoUrl} alt={m.name} className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-slate-900 p-1 border shrink-0 shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
                        {m.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate text-slate-900 dark:text-white">{m.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">Retrait instantané</div>
                    </div>
                    <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center", isSelected ? "border-primary" : "border-slate-300 dark:border-slate-600")}>
                      {isSelected && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne de droite : Exécution */}
        <div className="space-y-6">
          <div className="space-y-4">
            <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Numéro de téléphone</Label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center gap-2 text-slate-500 font-bold border-r pr-3 border-slate-200 dark:border-slate-700">
                <span>{activeCountry.flag}</span>
                <span>+{activeCountry.prefix}</span>
              </div>
              <Input
                type="tel"
                value={withdrawPhone}
                onChange={(e) => setWithdrawPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="7X XX XX XX"
                className="pl-[100px] h-12 text-lg font-mono tracking-wider rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus-visible:ring-primary/20"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-bold uppercase tracking-wider text-slate-500">Montant à retirer (XOF)</Label>
            <div className="relative">
              <Input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0"
                min={200}
                className="pl-4 pr-16 h-14 text-2xl font-bold font-mono rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus-visible:ring-primary/20"
                required
              />
              <div className="absolute right-4 top-4 text-sm font-bold text-slate-400">FCFA</div>
            </div>
            <p className="text-xs text-muted-foreground">Minimum: 200 XOF</p>
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Code PIN secret
            </Label>
            <div className="relative">
              <Input
                type={showPin ? "text" : "password"}
                value={withdrawPin}
                onChange={(e) => setWithdrawPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="••••"
                className="pl-4 pr-12 h-12 text-2xl tracking-[0.5em] font-mono text-center rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus-visible:ring-primary/20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 max-w-md mx-auto">
            <Button
              type="submit"
              disabled={withdrawMutation.isPending || !withdrawMethod || !withdrawPhone || !withdrawAmount || !withdrawPin}
              className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {withdrawMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  Confirmer le retrait de {Number(withdrawAmount || 0).toLocaleString("fr-FR")} FCFA
                </>
              )}
            </Button>
            
            {activeMethod && (
              <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-wider font-bold">
                <span className="text-slate-400">Opérateur</span>
                <span className={cn("px-2 py-1 rounded-md border", activeMethod.color)}>
                  {activeMethod.name}
                </span>
              </div>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
