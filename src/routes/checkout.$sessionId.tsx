import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlagIcon } from "@/components/ui/flag-icon";
import {
  CheckCircle2, XCircle, Loader2, Shield, Smartphone, User, Mail, CreditCard, Lock, ChevronDown, Check
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/dolapay-logo.png.asset.json";

export const Route = createFileRoute("/checkout/$sessionId")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: `Paiement · DolaPay Checkout` },
      { name: "description", content: `Paiement sécurisé via DolaPay.` },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type CheckoutSession = {
  id: string;
  amount: number;
  currency: string;
  status: "open" | "completed" | "expired";
  customer_email: string | null;
  customer_name: string | null;
  success_url: string;
  cancel_url: string | null;
  profile: { company_name: string | null; full_name: string | null } | null;
};

type TxStatus = "pending" | "success" | "failed";

type Operator = { id: string; name: string; logoUrl: string | null; color: string; };
type CountryConfig = { code: string; name: string; flag: string; prefix: string; operators: Operator[]; };

const COUNTRIES: CountryConfig[] = [
  {
    code: "BFA", name: "Burkina Faso", flag: "🇧🇫", prefix: "226",
    operators: [
      { id: "Orange", name: "Orange Money", logoUrl: "/methods/orange.png", color: "bg-[#FF6600]" },
      { id: "MOOV", name: "Moov Africa", logoUrl: "/methods/moov.png", color: "bg-[#005B94]" },
    ]
  },
  {
    code: "BEN", name: "Bénin", flag: "🇧🇯", prefix: "229",
    operators: [
      { id: "MTN", name: "MTN MoMo", logoUrl: "/methods/mtn.png", color: "bg-[#FFCC00]" },
      { id: "MOOV", name: "Moov Africa", logoUrl: "/methods/moov.png", color: "bg-[#005B94]" },
    ]
  },
  {
    code: "CIV", name: "Côte d'Ivoire", flag: "🇨🇮", prefix: "225",
    operators: [
      { id: "Orange", name: "Orange Money", logoUrl: "/methods/orange.png", color: "bg-[#FF6600]" },
      { id: "MTN", name: "MTN MoMo", logoUrl: "/methods/mtn.png", color: "bg-[#FFCC00]" },
    ]
  },
  {
    code: "CMR", name: "Cameroun", flag: "🇨🇲", prefix: "237",
    operators: [
      { id: "MTN", name: "MTN MoMo", logoUrl: "/methods/mtn.png", color: "bg-[#FFCC00]" },
    ]
  },
  {
    code: "COD", name: "RD Congo", flag: "🇨🇩", prefix: "243",
    operators: [
      { id: "Orange", name: "Orange Money", logoUrl: "/methods/orange.png", color: "bg-[#FF6600]" },
      { id: "Airtel", name: "Airtel Money", logoUrl: null, color: "bg-[#FF0000]" },
      { id: "Vodacom", name: "M-Pesa", logoUrl: null, color: "bg-[#E3000F]" },
    ]
  },
  {
    code: "COG", name: "Congo", flag: "🇨🇬", prefix: "242",
    operators: [
      { id: "MTN", name: "MTN MoMo", logoUrl: "/methods/mtn.png", color: "bg-[#FFCC00]" },
      { id: "Airtel", name: "Airtel Money", logoUrl: null, color: "bg-[#FF0000]" },
    ]
  },
  {
    code: "GAB", name: "Gabon", flag: "🇬🇦", prefix: "241",
    operators: [
      { id: "Airtel", name: "Airtel Money", logoUrl: null, color: "bg-[#FF0000]" },
    ]
  },
  {
    code: "KEN", name: "Kenya", flag: "🇰🇪", prefix: "254",
    operators: [
      { id: "Safaricom", name: "M-Pesa", logoUrl: null, color: "bg-[#009900]" },
    ]
  },
  {
    code: "RWA", name: "Rwanda", flag: "🇷🇼", prefix: "250",
    operators: [
      { id: "MTN", name: "MTN MoMo", logoUrl: "/methods/mtn.png", color: "bg-[#FFCC00]" },
      { id: "Airtel", name: "Airtel Money", logoUrl: null, color: "bg-[#FF0000]" },
    ]
  },
  {
    code: "SEN", name: "Sénégal", flag: "🇸🇳", prefix: "221",
    operators: [
      { id: "Orange", name: "Orange Money", logoUrl: "/methods/orange.png", color: "bg-[#FF6600]" },
      { id: "Free", name: "Free Money", logoUrl: "/methods/free.png", color: "bg-[#E30613]" },
    ]
  },
  {
    code: "SLE", name: "Sierra Leone", flag: "🇸🇱", prefix: "232",
    operators: [
      { id: "Orange", name: "Orange Money", logoUrl: "/methods/orange.png", color: "bg-[#FF6600]" },
    ]
  },
  {
    code: "UGA", name: "Ouganda", flag: "🇺🇬", prefix: "256",
    operators: [
      { id: "MTN", name: "MTN MoMo", logoUrl: "/methods/mtn.png", color: "bg-[#FFCC00]" },
      { id: "Airtel", name: "Airtel Money", logoUrl: null, color: "bg-[#FF0000]" },
    ]
  },
  {
    code: "ZMB", name: "Zambie", flag: "🇿🇲", prefix: "260",
    operators: [
      { id: "MTN", name: "MTN MoMo", logoUrl: "/methods/mtn.png", color: "bg-[#FFCC00]" },
      { id: "Zamtel", name: "Zamtel", logoUrl: null, color: "bg-[#008000]" },
    ]
  }
];

function CheckoutPage() {
  const { sessionId } = Route.useParams();

  const { data: session, isLoading, error } = useQuery({
    queryKey: ["checkout-session", sessionId],
    queryFn: async (): Promise<CheckoutSession> => {
      const { data, error } = await supabase
        .from("checkout_sessions")
        .select(`*, profile:profiles(company_name, full_name)`)
        .eq("id", sessionId)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      // Workaround because Supabase relations come as array or object
      const profileData = Array.isArray(data.profile) ? data.profile[0] : data.profile;
      return { ...data, profile: profileData } as CheckoutSession;
    },
  });

  const { data: quote, isLoading: isQuoteLoading } = useQuery({
    queryKey: ["fee_quote", session?.amount, "Orange"], // We don't dynamically pass provider for checkout yet, usually customer pays base amount
    // In Stripe Checkout, merchants decide. For simplicity, assume merchant absorbs fees unless specified in session.
    queryFn: async () => null,
  });

  const finalAmount = session?.amount || 0;
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("BFA");
  const [provider, setProvider] = useState("Orange");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [status, setStatus] = useState<TxStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Read tx_id from URL if returning from an external gateway like LigdiCash
    const params = new URLSearchParams(window.location.search);
    const returnTxId = params.get("tx_id");
    if (returnTxId && !txId) {
      setTxId(returnTxId);
      setStatus("pending");
      setSubmitting(true);
    }
  }, []);

  useEffect(() => {
    if (session) {
      if (session.customer_name && !name) setName(session.customer_name);
      if (session.customer_email && !email) setEmail(session.customer_email);
      if (session.status === "completed") {
        setStatus("success");
      }
    }
  }, [session]);

  const selectedCountry = COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];
  const operators = selectedCountry.operators;

  useEffect(() => {
    if (!operators.find((o) => o.id === provider)) {
      setProvider(operators[0].id);
    }
  }, [selectedCountryCode]);

  useEffect(() => {
    if (!txId) return;
    const chan = supabase
      .channel(`tx-${txId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "transactions", filter: `id=eq.${txId}` }, (p) => {
        const s = p.new.status as TxStatus;
        if (s === "success" || s === "failed") {
          setStatus(s);
          setSubmitting(false);
          // Update checkout session status
          if (s === "success") {
            supabase.from("checkout_sessions").update({ status: "completed" }).eq("id", sessionId).then(() => {
              if (session?.success_url) {
                setTimeout(() => window.location.href = session.success_url, 3000);
              }
            });
          }
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(chan); };
  }, [txId, session?.success_url, sessionId]);

  // Fallback polling (in case real-time is disabled on the table)
  useEffect(() => {
    if (!txId || status === "success" || status === "failed") return;

    const interval = setInterval(async () => {
      const { data } = await supabase.from("transactions").select("status").eq("id", txId).maybeSingle();
      if (data && (data.status === "success" || data.status === "failed")) {
        setStatus(data.status);
        setSubmitting(false);
        if (data.status === "success") {
          supabase.from("checkout_sessions").update({ status: "completed" }).eq("id", sessionId).then(() => {
            if (session?.success_url) {
              setTimeout(() => window.location.href = session.success_url, 3000);
            }
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [txId, status, session?.success_url, sessionId]);

  if (isLoading) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!session || error) return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="text-center text-red-500 text-lg font-medium">Session de paiement introuvable ou expirée.</div></div>;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) return toast.error("Numéro de téléphone invalide.");
    setSubmitting(true);
    setStatus(null);
    setTxId(null);

    const fullPhone = `${selectedCountry.prefix}${phone.replace(/\D/g, "")}`;
    try {
      const res = await fetch("/api/public/checkout-pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          customer_phone: fullPhone,
          provider,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Erreur de paiement.");
      if (data.status === "success") {
        setStatus("success");
        setSubmitting(false);
        if (session.success_url) setTimeout(() => window.location.href = session.success_url, 3000);
      } else if (data.status === "redirect" && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        setTxId(data.id);
        setStatus("pending");
      }
    } catch (err: any) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  const isDark = false; 

  const handleCancel = () => {
    if (session.cancel_url) window.location.href = session.cancel_url;
  };

  if (status === "success" || session.status === "completed") {
    return (
      <div className="flex min-h-screen flex-col bg-[#F9FAFB] font-sans selection:bg-emerald-500/20">
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-0 bg-white shadow-2xl p-8 text-center rounded-[24px]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement Réussi !</h2>
            <p className="text-gray-500 mb-8">Votre paiement de {finalAmount.toLocaleString("fr-FR")} {session.currency} a été confirmé.</p>
            {session.success_url && (
              <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Redirection vers la boutique...
              </p>
            )}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
              <Shield className="h-4 w-4" /> Sécurisé par DolaPay
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col md:flex-row bg-[#F9FAFB] font-sans selection:bg-primary/20">
      {/* LEFT COLUMN: Payment details */}
      <div className="w-full md:w-[45%] lg:w-[40%] bg-white border-b md:border-b-0 md:border-r border-gray-100 p-6 md:p-10 lg:p-16 flex flex-col relative z-10 overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex-1 max-w-md mx-auto w-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
               <User className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Payer à</div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight truncate max-w-[200px]">
                {session.profile?.company_name || session.profile?.full_name || "Marchand DolaPay"}
              </h1>
            </div>
          </div>

          <div className="mb-10">
            <div className="text-sm font-medium text-gray-500 mb-1">Montant à payer</div>
            <div className="text-[40px] leading-none font-bold text-gray-900 tracking-tight flex items-baseline gap-2">
              {finalAmount.toLocaleString("fr-FR")}
              <span className="text-xl text-gray-400 font-semibold">{session.currency}</span>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Sous-total</span>
              <span className="font-medium text-gray-900">{session.amount.toLocaleString("fr-FR")} {session.currency}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Frais de traitement</span>
              <span className="font-medium text-emerald-600">Inclus</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 flex items-center gap-2 text-xs font-medium text-gray-400 max-w-md mx-auto w-full">
          Powered by <img src={logoFull.url} alt="DolaPay" className="h-3.5 grayscale opacity-60 mix-blend-multiply" />
        </div>
      </div>

      {/* RIGHT COLUMN: Payment form */}
      <div className="flex-1 p-6 md:p-10 lg:p-16 flex items-center justify-center bg-[#F9FAFB]">
        <div className="w-full max-w-md">
          {status === "pending" ? (
            <Card className="border-0 shadow-xl bg-white p-8 text-center rounded-[24px] ring-1 ring-black/5 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-light" />
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-primary mb-6 ring-8 ring-blue-50/50">
                <Smartphone className="h-8 w-8 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Validez sur votre téléphone</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Veuillez consulter votre téléphone (<span className="font-medium text-gray-900">+{selectedCountry.prefix} {phone}</span>).<br/>
                Saisissez votre code PIN secret pour confirmer le paiement de {finalAmount.toLocaleString("fr-FR")} {session.currency}.
              </p>
              <div className="flex justify-center mb-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
              </div>
              <p className="text-xs text-gray-400">En attente de la confirmation de l'opérateur...</p>
            </Card>
          ) : status === "failed" ? (
             <Card className="border-0 shadow-xl bg-white p-8 text-center rounded-[24px] ring-1 ring-red-500/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500 mb-6 ring-8 ring-red-50/50">
                  <XCircle className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Paiement échoué</h3>
                <p className="text-gray-500 text-sm mb-8">La transaction a été refusée, annulée ou votre solde est insuffisant.</p>
                <Button onClick={() => setStatus(null)} className="w-full h-12 text-base font-semibold rounded-xl bg-gray-900 hover:bg-gray-800 text-white">
                  Réessayer
                </Button>
            </Card>
          ) : (
            <Card className="border-0 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white p-6 sm:p-8 rounded-[24px] ring-1 ring-black/[0.03]">
              <form onSubmit={handlePay} className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Détails de facturation</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email (Optionnel)</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input type="email" placeholder="client@exemple.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 bg-gray-50/50 border-gray-200 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Moyen de paiement</h2>
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pays & Numéro Mobile Money</Label>
                    <div className="flex relative">
                      <div className="relative w-[120px] shrink-0">
                        <button type="button" onClick={() => setShowCountryDropdown(!showCountryDropdown)} className="h-12 w-full flex items-center justify-between px-3 bg-gray-50 border border-gray-200 border-r-0 rounded-l-xl hover:bg-gray-100 transition-colors">
                          <span className="flex items-center gap-2 text-base">
                            <FlagIcon countryCode={selectedCountryCode} className="w-5 h-5 rounded-sm" />
                            <span className="text-sm font-medium text-gray-700">+{selectedCountry.prefix}</span>
                          </span>
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </button>

                        {showCountryDropdown && (
                          <div className="absolute top-[calc(100%+4px)] left-0 w-[240px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden ring-1 ring-black/5">
                            <div className="max-h-[300px] overflow-y-auto p-1">
                              {COUNTRIES.map(c => (
                                <button key={c.code} type="button" onClick={() => { setSelectedCountryCode(c.code); setShowCountryDropdown(false); }} className={cn("w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 transition-colors", selectedCountryCode === c.code && "bg-primary/5 text-primary font-medium")}>
                                  <span className="flex items-center gap-3">
                                    <FlagIcon countryCode={c.code} className="w-5 h-5 rounded-sm" />
                                    <span>{c.name}</span>
                                  </span>
                                  <span className="text-gray-400 text-xs">+{c.prefix}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ex: 01020304" className="h-12 rounded-l-none border-gray-200 bg-white shadow-sm font-medium text-lg tracking-wide rounded-r-xl focus-visible:ring-primary/20 focus-visible:border-primary focus-visible:z-10" />
                    </div>
                  </div>

                  {operators.length > 0 && (
                    <div className="pt-2">
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Choisissez l'opérateur</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {operators.map((op) => (
                          <button key={op.id} type="button" onClick={() => setProvider(op.id)} className={cn("relative flex flex-col items-center justify-center p-3 h-[72px] rounded-xl border-2 transition-all duration-200 overflow-hidden", provider === op.id ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50")}>
                            {provider === op.id && <div className="absolute top-1.5 right-1.5 bg-primary rounded-full p-0.5"><Check className="h-3 w-3 text-white" /></div>}
                            {op.logoUrl ? (
                              <img src={op.logoUrl} alt={op.name} className={cn("h-8 object-contain transition-transform duration-300", provider === op.id ? "scale-110" : "scale-100 grayscale-[0.2]")} />
                            ) : (
                              <span className={cn("font-bold text-sm", provider === op.id ? "text-primary" : "text-gray-700")}>{op.name}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={submitting || !phone} className="w-full h-14 text-base font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-4 w-4 opacity-70" />
                      Payer {finalAmount.toLocaleString("fr-FR")} {session.currency}
                    </span>
                  )}
                </Button>

                {session.cancel_url && (
                  <Button type="button" variant="ghost" onClick={handleCancel} className="w-full text-gray-500 hover:text-gray-900">
                    Annuler et retourner à la boutique
                  </Button>
                )}
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
