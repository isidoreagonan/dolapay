import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlagIcon } from "@/components/ui/flag-icon";
import {
  CheckCircle2, XCircle, Loader2, Shield, Smartphone, Globe, User, Mail, CreditCard, Lock, Check, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/dolapay-logo.png.asset.json";

// Using static payment icons from /methods/
import { z } from "zod";

const paySearchSchema = z.object({
  tx_id: z.string().uuid().optional(),
});

export const Route = createFileRoute("/pay/$slug")({
  validateSearch: (search) => paySearchSchema.parse(search),
  component: PayPage,
  head: ({ params }) => ({
    meta: [
      { title: `Paiement · DolaPay` },
      { name: "description", content: `Réglez en toute sécurité via DolaPay (${params.slug}).` },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Link = {
  id: string; title: string; amount: number; currency: string; active: boolean;
  description: string | null; image_url: string | null; invoice_number: string | null;
  thank_you_message: string | null; fees_paid_by: "merchant" | "customer";
  success_url: string | null; failure_url: string | null;
  theme_config?: { primaryColor?: string; buttonTextColor?: string; fontFamily?: string; themeMode?: string } | null;
};
type TxStatus = "pending" | "success" | "failed";

type Operator = {
  id: string;
  name: string;
  logoUrl: string | null;
  color: string;
};

type CountryConfig = {
  code: string;
  name: string;
  flag: string;
  prefix: string;
  operators: Operator[];
};

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
      { id: "ORANGE", name: "Orange Money", logoUrl: "/methods/orange.png", color: "bg-[#FF6600]" },
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

function PayPage() {
  const { slug } = Route.useParams();

  const { data: link, isLoading, error } = useQuery({
    queryKey: ["public-link", slug],
    queryFn: async (): Promise<Link> => {
      const { data, error } = await supabase
        .from("payment_links")
        .select("id,title,amount,currency,active,description,image_url,invoice_number,thank_you_message,fees_paid_by,success_url,failure_url,theme_config")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data as Link;
    },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("BFA");
  const [provider, setProvider] = useState("Orange");
  const [userSelectedProvider, setUserSelectedProvider] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [status, setStatus] = useState<TxStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [idemKey] = useState(() => crypto.randomUUID());
  const [redirectUrls, setRedirectUrls] = useState<{ success_url?: string | null; failure_url?: string | null }>({});
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);
  const [failureReason, setFailureReason] = useState<{ code: string; message: string } | null>(null);

  const { data: quote, isLoading: isQuoteLoading } = useQuery({
    queryKey: ["fee_quote", link?.amount, provider],
    queryFn: async () => {
      if (!link || !provider) return null;
      const res = await fetch("/api/public/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: link.amount, provider, fees_paid_by: link.fees_paid_by }),
      });
      if (!res.ok) return null;
      return await res.json() as { totalFees: number; net_amount: number; final_amount: number };
    },
    enabled: !!link && !!provider && link.fees_paid_by === "customer",
  });

  const finalAmount = quote ? quote.final_amount : (link ? link.amount : 0);

  const activeCountry = useMemo(() => {
    return COUNTRIES.find((c) => c.code === selectedCountryCode) || COUNTRIES[0];
  }, [selectedCountryCode]);

  // Adjust phone input and default provider when country changes
  const handleCountryChange = (countryCode: string) => {
    setSelectedCountryCode(countryCode);
    const country = COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[0];
    setPhone(`+${country.prefix} `);
    if (country.operators.length > 0) {
      setProvider(country.operators[0].id);
    }
    setUserSelectedProvider(false);
    setShowCountryDropdown(false);
  };

  // Prefill phone prefix on load once link is loaded
  useEffect(() => {
    if (link && !phone) {
      setPhone(`+${activeCountry.prefix} `);
    }
  }, [link]);

  // Prefill redirectUrls when link loads
  useEffect(() => {
    if (link) {
      setRedirectUrls({
        success_url: link.success_url,
        failure_url: link.failure_url,
      });
    }
  }, [link]);

  // Automatically trigger polling if tx_id query param is present on page load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const queryTxId = searchParams.get("tx_id");
      if (queryTxId && !txId) {
        setTxId(queryTxId);
        setStatus("pending");
        setSubmitting(true);
      }
    }
  }, [txId]);

  // Auto-detect country & operator from typed phone number (if user hasn't explicitly clicked a provider)
  useEffect(() => {
    if (userSelectedProvider || !phone) return;
    const clean = phone.replace(/\D/g, "");

    // Find if typed prefix matches any country
    const matchedCountry = COUNTRIES.find(c => clean.startsWith(c.prefix));
    if (matchedCountry && matchedCountry.code !== selectedCountryCode) {
      setSelectedCountryCode(matchedCountry.code);
      if (matchedCountry.operators.length > 0) {
        setProvider(matchedCountry.operators[0].id);
      }
      return;
    }

    // Operator specific auto-detection patterns inside the selected country
    if (selectedCountryCode === "BFA") {
      if (/^2267[0145678]/.test(clean) || /^7[0145678]/.test(clean)) setProvider("Orange");
      else if (/^2266[0123]/.test(clean) || /^6[0123]/.test(clean)) setProvider("MOOV");
      else if (/^2265[89]/.test(clean) || /^5[89]/.test(clean)) setProvider("Telecel");
    } else if (selectedCountryCode === "CIV") {
      if (/^22507/.test(clean) || /^07/.test(clean)) setProvider("Orange");
      else if (/^22505/.test(clean) || /^05/.test(clean)) setProvider("MTN");
      else if (/^22501/.test(clean) || /^01/.test(clean)) setProvider("MOOV");
      else if (/^22506/.test(clean) || /^06/.test(clean)) setProvider("Wave");
    } else if (selectedCountryCode === "SEN") {
      if (/^2217[78]/.test(clean) || /^7[78]/.test(clean)) setProvider("Orange");
      else if (/^22176/.test(clean) || /^76/.test(clean)) setProvider("Wave");
      else if (/^22170/.test(clean) || /^70/.test(clean)) setProvider("Free");
    } else if (selectedCountryCode === "BEN") {
      if (/^229(61|62|66|67|69|90|91|96|97)/.test(clean)) setProvider("MTN");
      else if (/^229(60|63|94|95)/.test(clean)) setProvider("MOOV");
      else if (/^22950/.test(clean)) setProvider("Celtiis");
    }
  }, [phone, selectedCountryCode, userSelectedProvider]);

  // Status polling via public status endpoint with 120-second timeout
  useEffect(() => {
    if (!txId) return;
    let cancelled = false;
    let elapsedSeconds = 0;
    const TIMEOUT_LIMIT = 120; // 2 minutes

    const poll = setInterval(async () => {
      if (cancelled) return;

      elapsedSeconds += 2;
      if (elapsedSeconds >= TIMEOUT_LIMIT) {
        clearInterval(poll);
        setStatus("failed");
        toast.error("Délai d'attente dépassé. La transaction a expiré.");
        
        // Notify backend about timeout
        try {
          fetch(`/api/public/tx-timeout/${txId}`, { method: "POST", keepalive: true });
        } catch (e) {
          console.error("Failed to notify timeout:", e);
        }
        return;
      }

      try {
        const res = await fetch(`/api/public/tx-status/${txId}`, { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as { status?: TxStatus; failure_reason?: { code: string; message: string } | null };
          if (json?.status) {
            if (json.failure_reason) {
              setFailureReason(json.failure_reason);
            }
            if (json.status === "success" || json.status === "failed") {
              setStatus(json.status);
              clearInterval(poll);
              if (json.status === "success") {
                toast.success("Paiement validé avec succès !");
              }
              return;
            } else {
              setStatus(json.status);
            }
          }
        }
      } catch {
        // En cas d'erreur réseau temporaire, on continue le polling sans valider à tort
      }
    }, 2000);

    return () => {
      cancelled = true;
      clearInterval(poll);
    };
  }, [txId]);

  // Handle page abandonment/closing while payment is pending
  useEffect(() => {
    if (!txId || status !== "pending") return;

    const handleUnload = () => {
      // Send a beacon to mark it failed if they close or leave the page
      navigator.sendBeacon(`/api/public/tx-timeout/${txId}`);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [txId, status]);

  useEffect(() => {
    if (status === "success" || status === "failed") setSubmitting(false);
  }, [status]);

  // Auto-redirect after success/failed if URL configured
  useEffect(() => {
    if (status !== "success" && status !== "failed") return;
    const url = status === "success" ? redirectUrls.success_url : redirectUrls.failure_url;
    if (!url) return;
    setRedirectCountdown(5);
    const t = setInterval(() => {
      setRedirectCountdown((c) => {
        if (c === null) return null;
        if (c <= 1) { clearInterval(t); window.location.href = url; return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [status, redirectUrls]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) {
      toast.error("Renseignez votre nom et téléphone");
      return;
    }
    setSubmitting(true);
    setStatus("pending");
    try {
      const res = await fetch(`/api/public/pay/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": idemKey },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone.replace(/\D/g, ""),
          provider,
          customer_email: email
        }),
      });
      
      let body: any = {};
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        body = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response from server:", text);
        throw new Error(`Server returned ${res.status}: ${text.slice(0, 150)}`);
      }

      if (res.status === 429) { toast.error("Trop de tentatives. Patientez un instant."); setStatus(null); setSubmitting(false); return; }
      if (!res.ok || !body.transaction_id) {
        toast.error(body.error ?? "Échec de l'initialisation du paiement.");
        setStatus(null);
        setSubmitting(false);
        return;
      }
      setRedirectUrls({ success_url: body.success_url, failure_url: body.failure_url });
      setTxId(body.transaction_id);
      if (body.status === "redirect" && body.redirect_url) {
        window.location.href = body.redirect_url;
        return;
      }
      if (body.status) setStatus(body.status);
      if (body.failure_reason) setFailureReason(body.failure_reason);
    } catch (err: any) {
      console.error("Payment submission failed:", err);
      toast.error(err.message || "Erreur réseau");
      setStatus(null);
      setSubmitting(false);
    }
  }

  if (isLoading) {
    return <CenteredCard><Loader2 className="h-8 w-8 animate-spin text-primary" /></CenteredCard>;
  }
  if (error || !link) {
    return (
      <CenteredCard>
        <XCircle className="h-14 w-14 text-rose-500" />
        <h1 className="mt-4 text-xl font-bold">Lien introuvable</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ce lien de paiement n'existe pas ou n'est plus actif.</p>
      </CenteredCard>
    );
  }

  const theme = link.theme_config || {};
  const isDark = theme.themeMode === "dark";
  const primaryColor = theme.primaryColor || "#183ceb";
  const primaryForeground = theme.buttonTextColor || "#ffffff";
  const fontFam = theme.fontFamily || "Inter";

  return (
    <div className={cn("custom-theme-wrapper font-sans antialiased", isDark ? "dark" : "")}>
      <style>{`
        .custom-theme-wrapper {
          --primary: ${primaryColor};
          --primary-foreground: ${primaryForeground};
          ${fontFam === 'Inter' ? `font-family: 'Inter', sans-serif;` : ''}
          ${fontFam === 'serif' ? `font-family: ui-serif, Georgia, serif;` : ''}
          ${fontFam === 'system-ui' ? `font-family: system-ui, sans-serif;` : ''}
        }
      `}</style>
      
      <div className="flex flex-col md:flex-row bg-white dark:bg-slate-950 transition-colors duration-300 min-h-screen">
        
        {/* LEFT COLUMN: Product & Details Panel */}
        <div className="w-full md:w-[45%] lg:w-[40%] bg-[#f9fafb] dark:bg-slate-900/50 border-r border-slate-200/50 dark:border-slate-800/50 p-6 md:p-12 lg:p-16 flex flex-col relative">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-16 shrink-0">
            <img src={logoFull.url} alt="DolaPay" className="h-7 object-contain" />
          </div>

          <div className="flex items-baseline justify-between mb-8 shrink-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {link.title}
            </h1>
            <span className="text-xl font-medium text-slate-600 dark:text-slate-400 shrink-0 ml-4">
              {fmt(link.amount)} {link.currency}
            </span>
          </div>

          {link.image_url && (
            <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950 mb-8 shrink-0">
              <img src={link.image_url} alt={link.title} className="w-full h-auto object-contain" />
            </div>
          )}

          {link.description && (
            <p className="text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed mb-8 shrink-0">
              {link.description}
            </p>
          )}
          
          {link.invoice_number && (
             <div className="mt-4 mb-8 shrink-0">
               <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Référence Facture</span>
               <p className="mt-1 font-mono text-sm text-slate-800 dark:text-slate-300">#{link.invoice_number}</p>
             </div>
          )}
          
          <div className="mt-auto pt-12 flex items-center gap-2 text-xs font-medium text-slate-400 shrink-0">
             <Shield className="h-4 w-4 shrink-0" />
             Paiements sécurisés et cryptés par DolaPay.
          </div>
        </div>

        {/* RIGHT COLUMN: Form Panel */}
        <div className="w-full md:w-[55%] lg:w-[60%] bg-white dark:bg-slate-950 p-6 md:p-12 lg:p-16 flex flex-col md:sticky md:top-0 md:max-h-screen md:overflow-y-auto">
          <div className="max-w-[500px] mx-auto w-full">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Payment Details
              </h2>
              <p className="mt-2 text-[15px] text-slate-500 dark:text-slate-400">
                Complete your purchase by providing your payment details.
              </p>
            </div>

            {!txId && !submitting ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Address */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="luke@skywalker.com"
                    className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary rounded-lg transition-all shadow-sm text-[15px] px-4"
                  />
                </div>
                
                {/* Customer Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Cardholder name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={100}
                    placeholder="Prénom et Nom"
                    className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary rounded-lg transition-all shadow-sm text-[15px] px-4"
                  />
                </div>

                {/* Country Selection (Billing address equivalent) */}
                <div className="space-y-2 relative">
                  <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Billing address
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full flex items-center justify-between px-4 h-12 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-lg text-[15px] transition-all focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <FlagIcon code={activeCountry.code} flag={activeCountry.flag} name={activeCountry.name} className="w-5 h-3.5 shadow-sm rounded-sm" />
                      <span className="text-slate-900 dark:text-white">{activeCountry.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {showCountryDropdown && (
                    <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-2">
                      {COUNTRIES.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleCountryChange(c.code)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-2.5 text-[15px] text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                            selectedCountryCode === c.code ? "bg-primary/5 text-primary font-medium" : "text-slate-700 dark:text-slate-300"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <FlagIcon code={c.code} flag={c.flag} name={c.name} className="w-5 h-3.5 shadow-sm rounded-sm" />
                            <span>{c.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-400">+{c.prefix}</span>
                            {selectedCountryCode === c.code && <Check className="h-4 w-4 text-primary shrink-0" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Phone Input (Placed right below country mimicking ZIP/State fields) */}
                  <div className="relative mt-2">
                     <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        maxLength={20}
                        placeholder={`Phone: +${activeCountry.prefix} ...`}
                        className="h-12 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary rounded-lg text-[15px] transition-all shadow-sm px-4"
                     />
                  </div>
                </div>

                {/* Operator Selection (Payment Method) */}
                <div className="space-y-2 pt-2">
                  <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    Payment Method
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {activeCountry.operators.map((op) => {
                      const active = provider === op.id;
                      return (
                        <button
                          key={op.id}
                          type="button"
                          onClick={() => { setProvider(op.id); setUserSelectedProvider(true); }}
                          className={cn(
                            "relative px-4 py-3 border rounded-lg flex items-center gap-3 min-h-[56px] transition-all bg-white dark:bg-slate-950",
                            active
                              ? "border-primary ring-1 ring-primary shadow-sm bg-primary/5 dark:bg-primary/10"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          )}
                        >
                          {op.logoUrl ? (
                            <img src={op.logoUrl} alt={op.name} className="h-6 w-auto object-contain" />
                          ) : (
                            <div className={cn("px-2 py-1 rounded-sm font-bold text-[10px] tracking-wider text-white", op.color)}>
                              {op.name.toUpperCase()}
                            </div>
                          )}
                          <span className={cn("text-sm font-semibold", active ? "text-primary" : "text-slate-700 dark:text-slate-300")}>
                            {op.name}
                          </span>
                          {active && (
                            <div className="absolute right-3">
                              <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                <Check className="h-3 w-3" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary (Subtotal, VAT, Total) */}
                <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/50 space-y-3">
                  <div className="flex justify-between items-center text-[14px] text-slate-600 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{fmt(link.amount)} {link.currency}</span>
                  </div>
                  <div className="flex justify-between items-center text-[14px] text-slate-600 dark:text-slate-400">
                    <span>VAT (Fees)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {link.fees_paid_by === "customer" ? (
                        (quote?.totalFees || 0) > 0 ? `${fmt(quote!.totalFees)} ${link.currency}` : (isQuoteLoading ? <Loader2 className="h-3 w-3 animate-spin inline-block" /> : "Calcul...")
                      ) : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-4 text-[16px]">
                    <span className="font-bold text-slate-900 dark:text-white">Total</span>
                    <span className="text-[18px] font-black tracking-tight text-slate-900 dark:text-white">
                      {fmt(finalAmount)} {link.currency}
                    </span>
                  </div>
                </div>

                {/* Pay Button */}
                <Button
                  type="submit"
                  className="w-full h-14 rounded-lg font-semibold text-[16px] shadow-sm hover:opacity-90 active:scale-[0.99] transition-all mt-6"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  disabled={submitting || (link.fees_paid_by === "customer" && !quote)}
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                  Pay {fmt(finalAmount)}
                </Button>

              </form>
            ) : (
              <div className="mt-8">
                <StatusView
                  status={status ?? "pending"}
                  amount={finalAmount}
                  currency={link.currency}
                  countdown={redirectCountdown}
                  thankYou={link.thank_you_message}
                  failureReason={failureReason}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusView({ status, amount, currency, countdown, thankYou, failureReason }: { status: TxStatus; amount: number; currency: string; countdown: number | null; thankYou: string | null; failureReason: { code: string; message: string } | null }) {
  if (status === "pending") {
    return (
      <div className="py-8 text-center space-y-4">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Paiement en cours…</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Confirmez la demande USSD sur votre téléphone avec votre code secret Mobile Money.
          </p>
        </div>
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className="py-8 text-center space-y-4">
        <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Paiement réussi !</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Votre paiement de <span className="font-semibold text-slate-900 dark:text-white">{fmt(amount)} {currency}</span> a été validé.
          </p>
        </div>
        {thankYou && (
          <div className="mx-auto max-w-xs rounded-2xl border border-emerald-100 dark:border-emerald-950/40 bg-emerald-50/50 dark:bg-emerald-950/10 p-4 text-xs text-emerald-800 dark:text-emerald-300">
            {thankYou}
          </div>
        )}
        {countdown !== null && <p className="mt-3 text-xs text-slate-400 italic">Redirection dans {countdown}s…</p>}
      </div>
    );
  }
  return (
    <div className="py-8 text-center space-y-4">
      <XCircle className="mx-auto h-14 w-14 text-rose-500" />
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Paiement échoué</h2>
        <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-3.5 py-2 rounded-xl border border-rose-100 dark:border-rose-900/30 max-w-xs mx-auto">
          {translateFailureCode(failureReason?.code, failureReason?.message)}
        </p>
        <p className="text-[11px] text-slate-400">
          Veuillez réessayer avec un autre numéro ou vérifier vos fonds.
        </p>
      </div>
      {countdown !== null && <p className="mt-3 text-xs text-slate-400 italic">Redirection dans {countdown}s…</p>}
      <Button className="mt-4 rounded-xl px-5" variant="outline" onClick={() => window.location.reload()}>Réessayer</Button>
    </div>
  );
}

function translateFailureCode(code?: string, message?: string): string {
  const combined = `${code || ""} ${message || ""}`.toUpperCase();
  if (!combined.trim()) return "La transaction a été rejetée ou a expiré.";
  
  if (combined.includes("FUNDS") || combined.includes("BALANCE") || combined.includes("INSUFFICIENT") || combined.includes("SOLDE")) {
    return "Solde insuffisant sur votre compte Mobile Money.";
  }
  if (combined.includes("CANCEL") || combined.includes("REJECT") || combined.includes("DECLINE") || combined.includes("ABORT") || combined.includes("ANNUL") || combined.includes("INVALID_PIN")) {
    return "Paiement annulé ou rejeté sur votre téléphone.";
  }
  if (combined.includes("TIMEOUT") || combined.includes("EXPIRE") || combined.includes("DELAI")) {
    return "Délai de validation USSD dépassé.";
  }
  
  const suffix = message ? `: ${message}` : (code ? ` (${code})` : "");
  return `Transaction refusée ${suffix}`;
}

function CenteredCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-slate-950 px-4">
      <Card className="flex w-full max-w-md flex-col items-center p-10 text-center rounded-2xl shadow-xl border-slate-200/60 dark:border-slate-800/60">{children}</Card>
    </div>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}
