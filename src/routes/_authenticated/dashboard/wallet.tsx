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
  CheckCircle2, XCircle, Clock, Check, ChevronDown, RefreshCw,
  DollarSign, Search, FileSpreadsheet, Filter, PiggyBank, CreditCard
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, type Profile } from "./route";
import { cn } from "@/lib/utils";
import { FlagIcon } from "@/components/ui/flag-icon";
import pmOrange from "@/assets/pm-orange.png.asset.json";
import pmMoov from "@/assets/pm-moov.png.asset.json";
import pmMtn from "@/assets/pm-mtn.png.asset.json";
import pmCeltiis from "@/assets/pm-celtiis.png.asset.json";
import pmFreeMoney from "@/assets/pm-freemoney.png.asset.json";
import pmAirtel from "@/assets/pm-airtel.webp.asset.json";
import pmZamtel from "@/assets/pm-zamtel.png.asset.json";
import pmMpesa from "@/assets/pm-mpesa.png.asset.json";
import pmVodacom from "@/assets/pm-vodacom.png.asset.json";

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

const WITHDRAW_COUNTRIES = [
  {
    code: "BF",
    name: "Burkina Faso",
    flag: "🇧🇫",
    prefix: "226",
    methods: [
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
      { id: "Moov Money", name: "Moov Money", logoUrl: pmMoov.url, color: "border-blue-500/80 text-blue-600 bg-blue-500/10 dark:bg-blue-500/20" },
      { id: "Telecel", name: "Telecel", logoUrl: pmZamtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "Coris Money", name: "Coris Money", logoUrl: null, color: "border-amber-500/80 text-amber-600 bg-amber-500/10 dark:bg-amber-500/20" },
    ]
  },
  {
    code: "BJ",
    name: "Bénin",
    flag: "🇧🇯",
    prefix: "229",
    methods: [
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
      { id: "Moov Money", name: "Moov Money", logoUrl: pmMoov.url, color: "border-blue-500/80 text-blue-600 bg-blue-500/10 dark:bg-blue-500/20" },
      { id: "Celtiis Cash", name: "Celtiis Cash", logoUrl: pmCeltiis.url, color: "border-pink-500/80 text-pink-600 bg-pink-500/10 dark:bg-pink-500/20" },
    ]
  },
  {
    code: "CI",
    name: "Côte d'Ivoire",
    flag: "🇨🇮",
    prefix: "225",
    methods: [
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
      { id: "Moov Money", name: "Moov Money", logoUrl: pmMoov.url, color: "border-blue-500/80 text-blue-600 bg-blue-500/10 dark:bg-blue-500/20" },
      { id: "Wave Money", name: "Wave Money", logoUrl: null, color: "border-sky-500/80 text-sky-600 bg-sky-500/10 dark:bg-sky-500/20" },
    ]
  },
  {
    code: "SN",
    name: "Sénégal",
    flag: "🇸🇳",
    prefix: "221",
    methods: [
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
      { id: "Free Money", name: "Free Money", logoUrl: pmFreeMoney.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "Wave Money", name: "Wave Money", logoUrl: null, color: "border-sky-500/80 text-sky-600 bg-sky-500/10 dark:bg-sky-500/20" },
    ]
  },
  {
    code: "CM",
    name: "Cameroun",
    flag: "🇨🇲",
    prefix: "237",
    methods: [
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
    ]
  },
  {
    code: "CD",
    name: "RDC",
    flag: "🇨🇩",
    prefix: "243",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
      { id: "Vodacom M-Pesa", name: "Vodacom M-Pesa", logoUrl: pmVodacom.url, color: "border-red-600/80 text-red-600 bg-red-600/10 dark:bg-red-600/20" },
    ]
  },
  {
    code: "GA",
    name: "Gabon",
    flag: "🇬🇦",
    prefix: "241",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
    ]
  },
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    prefix: "254",
    methods: [
      { id: "M-Pesa", name: "M-Pesa", logoUrl: pmMpesa.url, color: "border-emerald-500/80 text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/20" },
    ]
  },
  {
    code: "CG",
    name: "Congo",
    flag: "🇨🇬",
    prefix: "242",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
    ]
  },
  {
    code: "RW",
    name: "Rwanda",
    flag: "🇷🇼",
    prefix: "250",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
    ]
  },
  {
    code: "SL",
    name: "Sierra Leone",
    flag: "🇸🇱",
    prefix: "232",
    methods: [
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
    ]
  },
  {
    code: "UG",
    name: "Ouganda",
    flag: "🇺🇬",
    prefix: "256",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
    ]
  },
  {
    code: "ZM",
    name: "Zambie",
    flag: "🇿🇲",
    prefix: "260",
    methods: [
      { id: "Airtel Money", name: "Airtel Money", logoUrl: pmAirtel.url, color: "border-red-500/80 text-red-600 bg-red-500/10 dark:bg-red-500/20" },
      { id: "MTN MoMo", name: "MTN MoMo", logoUrl: pmMtn.url, color: "border-yellow-500/80 text-yellow-600 bg-yellow-500/10 dark:bg-yellow-500/20" },
      { id: "Zamtel", name: "Zamtel", logoUrl: pmZamtel.url, color: "border-emerald-500/80 text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/20" },
    ]
  },
  {
    code: "TG",
    name: "Togo",
    flag: "🇹🇬",
    prefix: "228",
    methods: [
      { id: "T-Money", name: "T-Money", logoUrl: null, color: "border-amber-500/80 text-amber-600 bg-amber-500/10 dark:bg-amber-500/20" },
      { id: "Moov Money", name: "Moov Money", logoUrl: pmMoov.url, color: "border-blue-500/80 text-blue-600 bg-blue-500/10 dark:bg-blue-500/20" },
    ]
  },
  {
    code: "ML",
    name: "Mali",
    flag: "🇲🇱",
    prefix: "223",
    methods: [
      { id: "Orange Money", name: "Orange Money", logoUrl: pmOrange.url, color: "border-orange-500/80 text-orange-600 bg-orange-500/10 dark:bg-orange-500/20" },
      { id: "Moov Money", name: "Moov Money", logoUrl: pmMoov.url, color: "border-blue-500/80 text-blue-600 bg-blue-500/10 dark:bg-blue-500/20" },
      { id: "Sama Money", name: "Sama Money", logoUrl: null, color: "border-purple-500/80 text-purple-600 bg-purple-500/10 dark:bg-purple-500/20" },
    ]
  }
];

function WalletPage() {
  const qc = useQueryClient();
  const { data: profile } = useProfile();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [tableSearch, setTableSearch] = useState("");

  // Form State for Withdrawal
  const [withdrawCountry, setWithdrawCountry] = useState("BF");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("Orange Money");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawPin, setWithdrawPin] = useState("");
  const [showWithdrawPin, setShowWithdrawPin] = useState(false);
  const activeCountry = WITHDRAW_COUNTRIES.find((c) => c.code === withdrawCountry) || WITHDRAW_COUNTRIES[0];

  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ["my-wallet", profile?.id, testMode],
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Wallet | null> => {
      let data: any = null;
      const { data: rows, error: wErr } = await supabase.from("wallets").select("*").eq("profile_id", profile!.id);
      if (!wErr && rows && rows.length > 0) {
        const sorted = rows.sort((a: any, b: any) => Number(b.balance ?? 0) - Number(a.balance ?? 0));
        data = sorted[0];
        data.balance = Number(data.balance ?? 0);
      }

      // 1. Collecter toutes les transactions de l'utilisateur
      const { data: allTxs = [] } = await supabase.from("transactions").select("*").eq("profile_id", profile!.id);

      // 2. Calculer le solde des paiements Live et des paiements Test
      let livePayin = 0, livePayout = 0;
      let testPayin = 0, testPayout = 0;
      const rawPayouts: any[] = [];

      for (const t of allTxs) {
        const st = String(t.status || "").toLowerCase();
        const amt = Number(t.amount || 0);
        const desc = String(t.description || "").toLowerCase();
        const mode = String((t as any).mode || "").toLowerCase();
        const isTestTx = desc.includes("_test") || desc.includes("sandbox") || mode === "test" || mode === "sandbox";
        const isPayout = String(t.type || "").toLowerCase().includes("payout") || String(t.type || "").toLowerCase().includes("pay-out") || String(t.type || "").toLowerCase().includes("withdraw");
        const isCompletedSuccess = st === "completed" || st === "successful" || st === "success" || st === "paid" || st === "validé" || st === "validated" || st === "settled" || st === "ok" || st === "confirmed";

        if (isPayout) {
          rawPayouts.push({ id: t.id, amt, st, type: t.type, mode });
          if (!isTestTx && amt > 0 && amt !== 101 && st !== "failed" && st !== "rejected") {
            livePayout += amt;
          } else if (isTestTx && amt > 0 && st !== "failed") {
            testPayout += amt;
          }
        } else {
          if (!isTestTx && isCompletedSuccess && amt > 0) {
            livePayin += amt;
          } else if (isTestTx && isCompletedSuccess && amt > 0) {
            testPayin += amt;
          }
        }
      }

      // Ajouter également tous les retraits enregistrés dans withdrawal_requests pour le compte total exact des sorties
      const seenIds = new Set<string>();
      allTxs.forEach((t: any) => { if (t && t.id) seenIds.add(String(t.id)); });
      const rawWrs: any[] = [];
      const { data: wrs } = await supabase.from("withdrawal_requests").select("*").eq("profile_id", profile!.id);
      if (wrs) {
        wrs.forEach((w: any) => {
          const st = String(w.status || "").toLowerCase();
          const amt = Number(w.amount || 0);
          rawWrs.push({ id: w.id, amt, st });
          if (st === "success" || st === "completed" || st === "validé" || st === "validated" || st === "processing" || st === "pending") {
            if (!seenIds.has(String(w.id))) {
              seenIds.add(String(w.id));
              if (amt > 0 && amt !== 101) livePayout += amt;
            }
          }
        });
      }

      // Ajouter également tous les retraits effectués via payout_batches / payout_batch_items (décaissements réels)
      const { data: payoutBatchesForWallet } = await (supabase.from("payout_batches") as any)
        .select("*, payout_batch_items(*)")
        .eq("owner_id", profile!.id);
      if (payoutBatchesForWallet && payoutBatchesForWallet.length > 0) {
        for (const b of payoutBatchesForWallet) {
          if (b.payout_batch_items && Array.isArray(b.payout_batch_items)) {
            for (const item of b.payout_batch_items) {
              const st = String(item.status || "").toLowerCase();
              const amt = Number(item.amount || b.total_amount || 0);
              rawWrs.push({ id: item.id, amt, st, source: "payout_batch_items" });
              if (st === "success" || st === "completed" || st === "validé" || st === "validated" || st === "processing" || st === "pending") {
                if (!seenIds.has(String(item.id))) {
                  seenIds.add(String(item.id));
                  if (amt > 0 && amt !== 101) livePayout += amt;
                }
              }
            }
          }
        }
      }

      const computedLiveBalance = Math.max(0, livePayin - livePayout);
      const computedTestBalance = Math.max(0, testPayin - testPayout);

      const storedBalance = Number(data?.balance ?? data?.amount ?? data?.solde ?? 0);
      const { data: profData } = await supabase.from("profiles").select("*").eq("id", profile!.id).maybeSingle();
      const profBalance = Number((profData as any)?.balance ?? (profData as any)?.wallet_balance ?? (profData as any)?.solde ?? (profData as any)?.amount ?? 0);
      const { data: authData } = await supabase.auth.getUser();
      const metaBalance = Number(authData?.user?.user_metadata?.wallet_balance || 0);
      const metaPin = authData?.user?.user_metadata?.wallet_pin;

      let bestBalance = 0;
      
      if (testMode) {
        bestBalance = Math.max(0, testPayin - testPayout);
      } else {
        bestBalance = Math.max(0, livePayin - livePayout);
      }

      if (!data) {
        if (bestBalance > 0 || authData?.user?.user_metadata?.wallet_created || metaPin) {
          return {
            id: authData?.user?.id || profile!.id,
            profile_id: authData?.user?.id || profile!.id,
            balance: bestBalance,
            currency: "XOF",
            hashed_pin: metaPin,
            _livePayin: livePayin,
            _livePayout: livePayout,
            _baseDeposit: 0,
            _rawPayouts: rawPayouts,
            _rawWrs: rawWrs,
            _testPayin: testPayin,
            _testPayout: testPayout,
          } as any as Wallet;
        }
        return null;
      }

      data.balance = bestBalance;
      (data as any)._livePayin = livePayin;
      (data as any)._livePayout = livePayout;
      (data as any)._baseDeposit = 0;
      (data as any)._rawPayouts = rawPayouts;
      (data as any)._rawWrs = rawWrs;
      (data as any)._testPayin = testPayin;
      (data as any)._testPayout = testPayout;

      if (!data.hashed_pin && data.pin) {
        data.hashed_pin = data.pin;
      }
      if (!data.hashed_pin && metaPin) {
        data.hashed_pin = metaPin;
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
      // Synchronisation automatique en tâche de fond pour corriger les statuts et soldes
      fetch("/api/public/sync-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: profile!.id })
      }).catch(() => {});

      let results: WithdrawalRequest[] = [];
      const existingIds = new Set<string>();

      // 1. withdrawal_requests
      const { data: wrData } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("profile_id", profile!.id)
        .order("created_at", { ascending: false });

      if (wrData) {
        for (const r of wrData) {
          existingIds.add(r.id);
          const st = (r.status === "completed" || r.status === "success" || r.status === "validé") ? "success" : (r.status === "failed" || r.status === "rejected" ? "failed" : "pending");
          results.push({ ...(r as any), status: st } as WithdrawalRequest);
        }
      }

      // 2. transactions (type: "pay-out")
      const { data: txPayouts } = await supabase
        .from("transactions")
        .select("*")
        .eq("profile_id", profile!.id)
        .eq("type", "pay-out")
        .order("created_at", { ascending: false });

      if (txPayouts) {
        for (const t of txPayouts) {
          if (!existingIds.has(t.id)) {
            existingIds.add(t.id);
            const st = (t.status === "completed" || t.status === "success" || t.status === "validé") ? "success" : (t.status === "failed" || t.status === "rejected" ? "failed" : "pending");
            results.push({
              id: t.id,
              amount: Number(t.amount || 0),
              currency: t.currency || "XOF",
              method: t.description || "Bank/Mobile Transfer",
              recipient_phone: "---",
              status: st as any,
              created_at: t.created_at,
            });
          }
        }
      }

      // 3. payout_batch_items (via payout_batches)
      const { data: batches } = await (supabase.from("payout_batches") as any)
        .select("*, payout_batch_items(*)")
        .eq("owner_id", profile!.id)
        .order("created_at", { ascending: false });

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
                  currency: (item.currency || b.currency || "XOF") as any,
                  method: item.provider || b.name?.replace("[Retrait Wallet] ", "")?.split(" (")[0] || "Mobile Money",
                  recipient_phone: item.recipient_phone || b.name?.split(" (")[1]?.replace(")", "") || "N/A",
                  status: st as any,
                  created_at: item.created_at || b.created_at,
                });
              }
            }
          }
        }
      }

      return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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
      setPinModalOpen(false);
      setPin("");
      setConfirmPin("");
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
          method: `${withdrawMethod} (${activeCountry.name})`,
          phone: `+${activeCountry.prefix}${withdrawPhone}`,
          pin: withdrawPin,
          testMode: Boolean(testMode),
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

  const pendingWithdrawals = withdrawals.filter(w => {
    const st = String(w.status || "").toLowerCase();
    return st === "processing" || st === "pending" || st === "en cours";
  });
  const pendingWithdrawalsTotal = pendingWithdrawals.reduce((acc, w) => acc + Number(w.amount || 0), 0);

  const completedWithdrawals = withdrawals.filter(w => {
    const st = String(w.status || "").toLowerCase();
    return st === "success" || st === "completed" || st === "validé" || st === "réussi";
  });
  const completedWithdrawalsTotal = completedWithdrawals.reduce((acc, w) => acc + Number(w.amount || 0), 0);

  const filteredWithdrawals = withdrawals.filter(w => {
    if (!tableSearch) return true;
    const q = tableSearch.toLowerCase();
    return (
      String(w.id || "").toLowerCase().includes(q) ||
      String(w.recipient_phone || "").toLowerCase().includes(q) ||
      String(w.method || "").toLowerCase().includes(q) ||
      String(w.status || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Gestion du Portefeuille</h1>
          <p className="text-sm text-muted-foreground">Suivez vos soldes et gérez vos moyens de retrait.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setTestMode(!testMode)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors border shadow-sm justify-center h-10",
              testMode
                ? "bg-amber-500/15 text-amber-600 border-amber-500/30 hover:bg-amber-500/25 dark:text-amber-400"
                : "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/25 dark:text-emerald-400"
            )}
          >
            <div className={cn("h-2 w-2 rounded-full", testMode ? "bg-amber-500" : "bg-emerald-500")} />
            {testMode ? "Mode Test (Sandbox)" : "Mode Live (Réel)"}
          </button>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              toast.loading("Synchronisation en cours...");
              try {
                await fetch("/api/public/sync-wallet", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId: profile!.id })
                });
                await qc.invalidateQueries({ queryKey: ["my-wallet"] });
                await qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
                toast.dismiss();
                toast.success("Synchronisation exacte terminée !");
              } catch (e) {
                toast.dismiss();
                toast.error("Erreur de synchronisation");
              }
            }}
            className="h-10 px-3.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 border-border hover:bg-muted"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Synchroniser
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPinModalOpen(true)}
            className="h-10 px-3.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 border-border hover:bg-muted"
          >
            <Filter className="h-3.5 w-3.5" /> Code PIN
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (filteredWithdrawals.length === 0) return;
              const headers = ["ID", "Date", "Méthode", "Numéro", "Montant", "Devise", "Statut"];
              const rows = filteredWithdrawals.map(w => [
                w.id,
                new Date(w.created_at).toISOString(),
                w.method,
                w.recipient_phone,
                w.amount,
                w.currency,
                w.status
              ]);
              const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
              const link = document.createElement("a");
              link.setAttribute("href", encodeURI(csvContent));
              link.setAttribute("download", `retraits_dolapay_${new Date().toISOString().slice(0, 10)}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            disabled={filteredWithdrawals.length === 0}
            className="h-10 px-3.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 border-border hover:bg-muted text-slate-700 dark:text-slate-200"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> Exporter en Excel
          </Button>
        </div>
      </div>

      {/* Top 4 Minimalist Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Solde Total */}
        <Card className="p-5 rounded-2xl border bg-card/80 backdrop-blur flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Solde Total</span>
            <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground/70">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-foreground">
              {wallet ? fmt(wallet.balance) : "0.00"} <span className="text-sm font-bold text-muted-foreground">{wallet?.currency || "XOF"}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Transactions approuvées
            </div>
          </div>
        </Card>

        {/* Card 2: Solde Disponible */}
        <Card className="p-5 rounded-2xl border bg-card/80 backdrop-blur flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Solde Disponible</span>
            <div className="h-8 w-8 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <WalletIcon className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-purple-600 dark:text-purple-400">
              {wallet ? fmt(wallet.balance) : "0.00"} <span className="text-sm font-bold opacity-80">{wallet?.currency || "XOF"}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-purple-600/80 dark:text-purple-400/80 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              Disponible pour retrait immédiat
            </div>
          </div>
        </Card>

        {/* Card 3: Retrait en Attente */}
        <Card className="p-5 rounded-2xl border bg-card/80 backdrop-blur flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Retrait en Attente</span>
            <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-amber-500">
              {fmt(pendingWithdrawalsTotal)} <span className="text-sm font-bold opacity-80">{wallet?.currency || "XOF"}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-amber-500/90 font-medium">
              <span>{pendingWithdrawals.length} demande{pendingWithdrawals.length > 1 ? "s" : ""} en cours</span>
            </div>
          </div>
        </Card>

        {/* Card 4: Solde Retiré */}
        <Card className="p-5 rounded-2xl border bg-card/80 backdrop-blur flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Solde Retiré</span>
            <div className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black tracking-tight text-emerald-500">
              {fmt(completedWithdrawalsTotal)} <span className="text-sm font-bold opacity-80">{wallet?.currency || "XOF"}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="h-3 w-3" />
              <span>{completedWithdrawals.length} demande{completedWithdrawals.length > 1 ? "s" : ""} validée{completedWithdrawals.length > 1 ? "s" : ""}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Historique des Retraits */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 rounded-3xl border bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-border">
              <div className="flex items-center gap-2 font-bold text-base text-foreground">
                <Clock className="h-4.5 w-4.5 text-primary" />
                <span>Historique des Retraits</span>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Rechercher..."
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl border-border bg-muted/30 focus:bg-background"
                />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              {filteredWithdrawals.length === 0 ? (
                <div className="py-20 text-center text-sm font-medium text-muted-foreground italic">
                  Aucun retrait trouvé
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px] tracking-wider border-b border-border">
                    <tr>
                      <th className="px-4 py-3">ID / Date</th>
                      <th className="px-4 py-3">Montant</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Date de création</th>
                      <th className="px-4 py-3">Vers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredWithdrawals.map((w) => (
                      <tr key={w.id} className="hover:bg-muted/30 transition-colors font-medium">
                        <td className="px-4 py-3.5 font-mono text-[11px] text-muted-foreground">
                          {String(w.id || "").slice(0, 8)}...
                          <div className="text-[10px] text-muted-foreground/60">
                            {new Date(w.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-sm text-foreground">
                          -{fmt(w.amount)} <span className="text-xs font-normal text-muted-foreground">{w.currency || "XOF"}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={w.status} />
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {new Date(w.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-foreground">
                          {w.recipient_phone || "N/A"}
                          <div className="text-[10px] font-bold text-primary uppercase">
                            {w.method || "MOBILE"} MONEY
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Retraits Instantanés & Moyens de Paiement */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card 1: Retraits Instantanés (Brand Primary CTA Card) */}
          <Card className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 shadow-xl relative overflow-hidden">
            <ArrowUpRight className="absolute -right-6 -top-6 h-36 w-36 text-white/5 pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <h3 className="text-xl font-black tracking-tight">Retraits Instantanés</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Le délai de retrait est automatique ou max 24h. Passé ce délai, contactez le support.
              </p>
              <Button
                onClick={() => setWithdrawOpen(true)}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/25 transition-transform active:scale-[0.98]"
              >
                Demander un retrait
              </Button>
            </div>
          </Card>

          {/* Card 2: Moyens de Paiement */}
          <Card className="rounded-3xl p-6 border bg-card space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2 text-foreground">
                <CreditCard className="h-4 w-4 text-primary" /> Moyens de Paiement
              </h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Sécurisé
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Suivez vos soldes et gérez vos moyens de retrait Mobile Money.
            </p>
            <Button
              onClick={() => setPinModalOpen(true)}
              variant="outline"
              className="w-full h-10 border-primary/30 text-primary hover:bg-primary/10 font-bold rounded-xl flex items-center justify-center gap-2 text-xs"
            >
              + Ajouter un moyen (ou PIN)
            </Button>
            <div className="p-6 text-center rounded-2xl bg-muted/40 border border-dashed text-xs text-muted-foreground space-y-2">
              <Landmark className="h-8 w-8 mx-auto text-muted-foreground/30" />
              <p>Aucun moyen de retrait permanent enregistré.</p>
              <p className="text-[10px] opacity-75">Vous pouvez saisir votre numéro lors de chaque demande de retrait instantané.</p>
            </div>
          </Card>
        </div>
      </div>

      {/* PIN Setup/Reset Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6 space-y-6 relative border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Configurer / Modifier le code PIN</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Choisissez un nouveau code PIN secret à 4 chiffres pour sécuriser vos retraits.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Nouveau Code PIN (4 chiffres)</Label>
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
                <Label className="text-xs font-semibold">Confirmez le nouveau code PIN</Label>
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

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setPinModalOpen(false);
                  setPin("");
                  setConfirmPin("");
                }}
                className="flex-1 h-11 font-semibold rounded-xl"
              >
                Annuler
              </Button>
              <Button
                onClick={() => {
                  if (pin !== confirmPin) {
                    toast.error("Les codes PIN ne correspondent pas.");
                    return;
                  }
                  setupPinMutation.mutate(pin);
                }}
                disabled={setupPinMutation.isPending}
                className="flex-1 h-11 font-bold rounded-xl"
              >
                {setupPinMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enregistrer
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Withdrawal Modal */}
      {withdrawOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-lg p-6 space-y-5 relative border-slate-200/80 dark:border-slate-800/80 shadow-2xl bg-white dark:bg-slate-950 max-h-[92vh] overflow-y-auto rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Initier un retrait
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  L'argent sera transféré immédiatement et en toute sécurité vers votre compte Mobile Money.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWithdrawOpen(false)}
                className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors shrink-0"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); withdrawMutation.mutate(); }} className="space-y-5">
              {/* 1. Sélection du Pays de Retrait */}
              <div className="space-y-1.5 relative">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Pays de retrait
                </Label>
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="w-full flex items-center justify-between px-3.5 h-12 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100/70 dark:hover:bg-slate-900 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                >
                  <div className="flex items-center gap-3">
                    <FlagIcon code={activeCountry.code} flag={activeCountry.flag} name={activeCountry.name} className="w-6 h-4 shadow-xs" />
                    <span className="font-bold text-slate-900 dark:text-white text-base">{activeCountry.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                    <span>+{activeCountry.prefix}</span>
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  </div>
                </button>

                {showCountryDropdown && (
                  <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-1.5 space-y-1 animate-in zoom-in-95 duration-150">
                    {WITHDRAW_COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          setWithdrawCountry(c.code);
                          setWithdrawMethod(c.methods[0].id);
                          setShowCountryDropdown(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                          withdrawCountry === c.code ? "bg-primary/10 text-primary font-bold" : "text-slate-700 dark:text-slate-300 font-medium"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <FlagIcon code={c.code} flag={c.flag} name={c.name} className="w-6 h-4 shadow-xs" />
                          <span>{c.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-mono">+{c.prefix}</span>
                          {withdrawCountry === c.code && <Check className="h-4 w-4 text-primary shrink-0" />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Choix du Moyen de Retrait (avec Logo) */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-between">
                  <span>Moyen de paiement disponible</span>
                  <span className="text-[11px] text-primary font-normal lowercase">({activeCountry.methods.length} options en {activeCountry.name})</span>
                </Label>
                <div className="grid grid-cols-2 gap-2.5">
                  {activeCountry.methods.map((m) => {
                    const active = withdrawMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setWithdrawMethod(m.id)}
                        className={cn(
                          "relative flex items-center gap-3 p-3 rounded-xl border transition-all text-left group",
                          active
                            ? m.color + " border-2 border-current shadow-md scale-[1.01]"
                            : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                        )}
                      >
                        {m.logoUrl ? (
                          <img
                            src={m.logoUrl}
                            alt={m.name}
                            className="w-8 h-8 rounded-lg object-contain bg-white dark:bg-slate-900 p-0.5 shadow-xs border border-slate-200/60 dark:border-slate-800 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs border border-primary/20">
                            {m.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs truncate">{m.name}</div>
                          <div className="text-[10px] opacity-75 font-medium truncate">Retrait instantané</div>
                        </div>
                        {active && (
                          <div className="w-4 h-4 rounded-full bg-current text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3] text-white dark:text-slate-950" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Numéro récepteur */}
              <div className="space-y-1.5">
                <Label htmlFor="recipientPhone" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Numéro Mobile Money récepteur
                </Label>
                <div className="flex items-stretch rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden transition-all h-12">
                  <div className="flex shrink-0 items-center gap-2 border-r border-slate-200 dark:border-slate-800 px-3.5 bg-slate-100/80 dark:bg-slate-800/50 text-sm font-bold text-slate-700 dark:text-slate-200">
                    <FlagIcon code={activeCountry.code} flag={activeCountry.flag} name={activeCountry.name} className="w-5 h-3.5 shadow-xs" />
                    <span className="font-mono">+{activeCountry.prefix}</span>
                  </div>
                  <Input
                    id="recipientPhone"
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder={activeCountry.prefix === "226" ? "70xxxxxxxx ou 07xxxxxxxx" : activeCountry.prefix === "225" ? "07xxxxxxxx" : "Numéro mobile"}
                    required
                    className="flex-1 h-full border-0 bg-transparent pl-3.5 font-mono text-sm font-medium focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* 4. Montant à retirer & Solde dispo */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Montant à retirer (XOF)
                  </Label>
                  {wallet && (
                    <span className="text-xs font-bold text-primary flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                      Dispo : {fmt(wallet.balance)} XOF
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Min: 100 XOF"
                    required
                    min={100}
                    className="h-12 rounded-xl font-bold text-base bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 pl-4 pr-16"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400">
                    FCFA
                  </span>
                </div>
              </div>

              {/* 5. Code PIN secret */}
              <div className="space-y-1.5">
                <Label htmlFor="withdrawPin" className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Code PIN secret de validation (4 chiffres)
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="withdrawPin"
                    type={showWithdrawPin ? "text" : "password"}
                    value={withdrawPin}
                    onChange={(e) => setWithdrawPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    required
                    className="pl-10 pr-11 h-12 rounded-xl font-mono text-lg font-black tracking-widest bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowWithdrawPin(!showWithdrawPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    {showWithdrawPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Résumé clair des frais */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Opérateur sélectionné</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {activeCountry.methods.find(m => m.id === withdrawMethod)?.name || withdrawMethod}
                    <span className="text-[10px] text-primary">({activeCountry.name})</span>
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Frais de transfert DolaPay</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">0 XOF (Gratuit)</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 pt-1.5 flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Total à transférer</span>
                  <span className="text-sm text-primary">{withdrawAmount ? `${fmt(Number(withdrawAmount))} XOF` : "0 XOF"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setWithdrawOpen(false)}
                  className="flex-1 h-12 rounded-xl font-semibold border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={withdrawMutation.isPending || !withdrawAmount || !withdrawPhone || withdrawPin.length !== 4}
                  className="flex-[2] h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
                >
                  {withdrawMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Confirmer et recevoir l'argent
                    </>
                  )}
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
