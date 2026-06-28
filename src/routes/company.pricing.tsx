import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { Check } from "lucide-react";

import pmMtn from "@/assets/pm-mtn.png.asset.json";
import pmOrange from "@/assets/pm-orange.png.asset.json";
import pmMoov from "@/assets/pm-moov.png.asset.json";
import pmAirtel from "@/assets/pm-airtel.webp.asset.json";
import pmFree from "@/assets/pm-freemoney.png.asset.json";
import pmVodacom from "@/assets/pm-vodacom.png.asset.json";
import pmMpesa from "@/assets/pm-mpesa.png.asset.json";
import pmZamtel from "@/assets/pm-zamtel.png.asset.json";

export const Route = createFileRoute("/company/pricing")({
  head: () => ({
    meta: [
      { title: "Tarifs — DolaPay" },
      {
        name: "description",
        content:
          "Tarification transparente DolaPay : frais Pay-in et Pay-out par pays et opérateur Mobile Money.",
      },
      { property: "og:title", content: "Tarifs — DolaPay" },
      {
        property: "og:description",
        content:
          "Tarification transparente DolaPay : frais Pay-in et Pay-out par pays et opérateur Mobile Money.",
      },
    ],
  }),
  component: PricingPage,
});

type Provider = {
  name: string;
  collectionFee: string;
  collectionSplit: string;
  disbursementFee: string;
  disbursementSplit: string;
};

type CountryFees = {
  country: string;
  currency: string;
  providers: Provider[];
};

const NETWORK_FEES: CountryFees[] = [
  {
    country: "Bénin",
    currency: "XOF",
    providers: [
      { name: "MTN", collectionFee: "3.2%", collectionSplit: "1.2% MMO + 2% DolaPay fee", disbursementFee: "2.5%", disbursementSplit: "0.5% MMO + 2% DolaPay fee" },
      { name: "MOOV", collectionFee: "3.2%", collectionSplit: "1.2% MMO + 2% DolaPay fee", disbursementFee: "2%", disbursementSplit: "2% DolaPay fee" },
    ],
  },
  {
    country: "Cameroun",
    currency: "XAF",
    providers: [
      { name: "MTN", collectionFee: "2.75%", collectionSplit: "0.75% MMO + 2% DolaPay fee", disbursementFee: "2.3%", disbursementSplit: "0.3% MMO + 2% DolaPay fee" },
      { name: "ORANGE", collectionFee: "2.77%", collectionSplit: "0.77% MMO + 2% DolaPay fee", disbursementFee: "2%", disbursementSplit: "2% DolaPay fee" },
    ],
  },
  {
    country: "Congo",
    currency: "XAF",
    providers: [
      { name: "AIRTEL", collectionFee: "5%", collectionSplit: "3% MMO + 2% DolaPay fee", disbursementFee: "2%", disbursementSplit: "2% DolaPay fee" },
      { name: "MTN", collectionFee: "5%", collectionSplit: "3% MMO + 2% DolaPay fee", disbursementFee: "2%", disbursementSplit: "2% DolaPay fee" },
    ],
  },
  {
    country: "RDC",
    currency: "CDF",
    providers: [
      { name: "AIRTEL", collectionFee: "4%", collectionSplit: "2% MMO + 2% DolaPay fee", disbursementFee: "3%", disbursementSplit: "1% MMO + 2% DolaPay fee" },
      { name: "ORANGE", collectionFee: "4%", collectionSplit: "2% MMO + 2% DolaPay fee", disbursementFee: "2%", disbursementSplit: "2% DolaPay fee" },
      { name: "VODACOM", collectionFee: "3.5%", collectionSplit: "1.5% MMO + 2% DolaPay fee", disbursementFee: "3%", disbursementSplit: "1% MMO + 2% DolaPay fee" },
    ],
  },
  {
    country: "Gabon",
    currency: "XAF",
    providers: [
      { name: "AIRTEL", collectionFee: "3%", collectionSplit: "1% MMO + 2% DolaPay fee", disbursementFee: "2%", disbursementSplit: "2% DolaPay fee" },
    ],
  },
  {
    country: "Côte d'Ivoire",
    currency: "XOF",
    providers: [
      { name: "MTN", collectionFee: "2.8%", collectionSplit: "0.8% MMO + 2% DolaPay fee", disbursementFee: "2.3%", disbursementSplit: "0.3% MMO + 2% DolaPay fee" },
      { name: "ORANGE", collectionFee: "3.5%", collectionSplit: "1.5% MMO + 2% DolaPay fee", disbursementFee: "3%", disbursementSplit: "1% MMO + 2% DolaPay fee" },
    ],
  },
  {
    country: "Kenya",
    currency: "KES",
    providers: [
      { name: "M-PESA", collectionFee: "N/A", collectionSplit: "N/A", disbursementFee: "N/A", disbursementSplit: "N/A" },
    ],
  },
  {
    country: "Rwanda",
    currency: "RWF",
    providers: [
      { name: "MTN", collectionFee: "4.1%", collectionSplit: "2.1% MMO + 2% DolaPay fee", disbursementFee: "2% + 60 RWF", disbursementSplit: "60 RWF MMO + 2% DolaPay fee" },
      { name: "AIRTEL", collectionFee: "3.5%", collectionSplit: "1.5% MMO + 2% DolaPay fee", disbursementFee: "2%", disbursementSplit: "2% DolaPay fee" },
    ],
  },
  {
    country: "Sénégal",
    currency: "XOF",
    providers: [
      { name: "ORANGE", collectionFee: "3%", collectionSplit: "1% MMO + 2% DolaPay fee", disbursementFee: "2.8%", disbursementSplit: "0.8% MMO + 2% DolaPay fee" },
      { name: "Free", collectionFee: "3%", collectionSplit: "1% MMO + 2% DolaPay fee", disbursementFee: "2.5%", disbursementSplit: "0.5% MMO + 2% DolaPay fee" },
    ],
  },
  {
    country: "Sierra Leone",
    currency: "SLE",
    providers: [
      { name: "ORANGE", collectionFee: "4.3%", collectionSplit: "2.3% MMO + 2% DolaPay fee", disbursementFee: "3.15%", disbursementSplit: "1.15% MMO + 2% DolaPay fee" },
    ],
  },
  {
    country: "Ouganda",
    currency: "UGX",
    providers: [
      { name: "MTN", collectionFee: "4%", collectionSplit: "2% MMO + 2% DolaPay fee", disbursementFee: "N/A", disbursementSplit: "N/A" },
      { name: "AIRTEL", collectionFee: "3.5%", collectionSplit: "1.5% MMO + 2% DolaPay fee", disbursementFee: "N/A", disbursementSplit: "N/A" },
    ],
  },
  {
    country: "Zambie",
    currency: "ZMW",
    providers: [
      { name: "MTN", collectionFee: "N/A", collectionSplit: "N/A", disbursementFee: "3% + e-Levy", disbursementSplit: "1% MMO + 2% DolaPay fee + e-Levy" },
      { name: "ZAMTEL", collectionFee: "N/A", collectionSplit: "N/A", disbursementFee: "3%", disbursementSplit: "1% MMO + 2% DolaPay fee" },
    ],
  },
  {
    country: "Burkina Faso",
    currency: "XOF",
    providers: [
      { name: "ORANGE", collectionFee: "3.5%", collectionSplit: "1.5% MMO + 2% DolaPay fee", disbursementFee: "2.8%", disbursementSplit: "0.8% MMO + 2% DolaPay fee" },
      { name: "MOOV", collectionFee: "3.5%", collectionSplit: "1.5% MMO + 2% DolaPay fee", disbursementFee: "2.5%", disbursementSplit: "0.5% MMO + 2% DolaPay fee" },
    ],
  },
  {
    country: "Cartes Bancaires (Panafricain)",
    currency: "Multi-devises",
    providers: [
      { name: "VISA", collectionFee: "3.8% + 100 FCFA", collectionSplit: "1.8% interchange + 2% DolaPay fee + 100 FCFA", disbursementFee: "N/A", disbursementSplit: "N/A" },
      { name: "MASTERCARD", collectionFee: "3.8% + 100 FCFA", collectionSplit: "1.8% interchange + 2% DolaPay fee + 100 FCFA", disbursementFee: "N/A", disbursementSplit: "N/A" },
    ],
  },
];

const PROVIDER_META: Record<string, { logo?: string; color: string }> = {
  MTN: { logo: pmMtn.url, color: "from-yellow-400/30 to-yellow-500/10" },
  ORANGE: { logo: pmOrange.url, color: "from-orange-500/30 to-orange-600/10" },
  MOOV: { logo: pmMoov.url, color: "from-sky-500/30 to-blue-600/10" },
  AIRTEL: { logo: pmAirtel.url, color: "from-red-500/30 to-rose-600/10" },
  VODACOM: { logo: pmVodacom.url, color: "from-red-600/30 to-rose-700/10" },
  FREE: { logo: pmFree.url, color: "from-emerald-500/30 to-teal-600/10" },
  "M-PESA": { logo: pmMpesa.url, color: "from-green-500/30 to-emerald-600/10" },
  ZAMTEL: { logo: pmZamtel.url, color: "from-green-600/30 to-lime-600/10" },
  VISA: { color: "from-blue-600/30 to-indigo-700/10" },
  MASTERCARD: { color: "from-orange-500/30 to-red-600/10" },
};


function PricingPage() {
  const [mode, setMode] = useState<"collection" | "disbursement">("collection");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const h = window.location.hash.replace("#", "").toLowerCase();
      if (h === "payin" || h === "collection") setMode("collection");
      else if (h === "payout" || h === "disbursement") setMode("disbursement");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NETWORK_FEES;
    return NETWORK_FEES.filter(
      (c) =>
        c.country.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.providers.some((p) => p.name.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:pt-32">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
            Modèle Cost-Plus · 2% + Opérateur
          </span>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight">
            La tarification la plus <span className="text-gradient">transparente d'Afrique</span>.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Vous ne payez que le juste prix : commission DolaPay fixe + frais réels prélevés par MTN, Orange, Moov, M-Pesa, Airtel ou Vodacom. Aucune marge cachée.
          </p>
        </div>



        {/* Detailed table heading */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Grille détaillée par opérateur</h2>
          <p className="mt-2 text-sm text-muted-foreground">Frais MNO réels + commission DolaPay, par pays et par méthode.</p>
        </div>


        {/* Main pricing tabs */}
        <Tabs
          value={mode}
          onValueChange={(v) => setMode(v as "collection" | "disbursement")}
          className="mt-10"
        >
          <div className="flex justify-center">
            <TabsList className="bg-muted/60 backdrop-blur border border-border p-1 h-auto">
              <TabsTrigger value="collection" className="gap-2 px-5 py-2">
                <ArrowDownToLine className="size-4" /> Pay-in (Collections)
              </TabsTrigger>
              <TabsTrigger value="disbursement" className="gap-2 px-5 py-2">
                <ArrowUpFromLine className="size-4" /> Pay-out (Disbursements)
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="collection" className="mt-8">
            <HeroCard
              title="Encaissez via Mobile Money"
              desc="Recevez des paiements de vos clients en quelques secondes, partout en Afrique francophone."
              chip="À partir de 3.75%"
            />
          </TabsContent>
          <TabsContent value="disbursement" className="mt-8">
            <HeroCard
              title="Payez vos partenaires"
              desc="Envoyez des paiements de masse vers tous les portefeuilles Mobile Money supportés."
              chip="À partir de 2%"
            />
          </TabsContent>
        </Tabs>

        {/* Network Fees Breakdown */}
        <section className="mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Détail des frais par réseau
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {mode === "collection"
                  ? "Frais de collection (Pay-in) par pays et opérateur. Tous les taux affichés incluent notre commission DolaPay fixe de 2%."
                  : "Frais de décaissement (Pay-out) par pays et opérateur. Tous les taux affichés incluent notre commission DolaPay fixe de 2%."}
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un pays (ex : Bénin, Sénégal)"
                className="pl-9 bg-background/60 backdrop-blur border-border"
              />
            </div>
          </div>

          <motion.div
            layout
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((c) => (
                <CountryCard key={c.country} country={c} mode={mode} />
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-10">
                Aucun résultat pour « {query} ».
              </div>
            )}
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function HeroCard({ title, desc, chip }: { title: string; desc: string; chip: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background/80 to-muted/40 backdrop-blur p-8 sm:p-10"
    >
      <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" />
      <span className="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs">
        {chip}
      </span>
      <h3 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-muted-foreground max-w-xl">{desc}</p>
    </motion.div>
  );
}

function CountryCard({
  country,
  mode,
}: {
  country: CountryFees;
  mode: "collection" | "disbursement";
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="overflow-hidden border-border bg-background/60 backdrop-blur-xl">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{country.country}</h3>
            <p className="text-xs text-muted-foreground">
              {country.currency === "Multi-devises" ? "Multi-devises" : `Devise : ${country.currency}`} · Commission DolaPay fixe 2%
            </p>
          </div>
          <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium">
            {country.providers.length} {country.currency === "Multi-devises" ? "réseaux" : "opérateurs"}
          </span>
        </div>
        <div className="divide-y divide-border/60">
          {country.providers.map((p) => {
            const key = country.country + p.name;
            const isOpen = open === key;
            const fee = mode === "collection" ? p.collectionFee : p.disbursementFee;
            const split =
              mode === "collection" ? p.collectionSplit : p.disbursementSplit;
            const meta = PROVIDER_META[p.name.toUpperCase()];

            return (
              <div key={key}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : key)}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-3 text-left cursor-pointer transition-colors",
                    "hover:bg-muted/40",
                  )}
                >
                  <div
                    className={cn(
                      "relative size-9 rounded-lg overflow-hidden bg-gradient-to-br border border-border flex items-center justify-center shrink-0",
                      meta?.color ?? "from-muted to-muted/40",
                    )}
                  >
                    {meta?.logo ? (
                      <img
                        src={meta.logo}
                        alt={p.name}
                        className="size-7 object-contain"
                      />
                    ) : (
                      <span className="text-[10px] font-semibold">{p.name}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {mode === "collection" ? "Pay-in" : "Pay-out"}{(p.name === "VISA" || p.name === "MASTERCARD") && " 3D-Secure"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-semibold tabular-nums">{fee}</div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-4 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4">
                        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs">
                          <div className="text-muted-foreground mb-1">
                            Décomposition du tarif
                          </div>
                          <div className="font-mono text-[12px]">{split}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

function CostPlusCard({
  kicker,
  rate,
  suffix,
  note,
  highlight,
}: {
  kicker: string;
  rate: string;
  suffix: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 transition-all hover:-translate-y-0.5 hover:shadow-elegant",
        highlight ? "border-primary/40 bg-primary/5" : "border-border bg-card",
      )}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-primary/25 to-primary-glow/10 opacity-70 blur-3xl" />
      <div className="relative">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {kicker}
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-display text-4xl font-bold text-foreground">{rate}</span>
          <span className="text-sm font-semibold text-muted-foreground">{suffix}</span>
        </div>
        <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>{note}</span>
        </div>
      </div>
    </div>
  );
}

