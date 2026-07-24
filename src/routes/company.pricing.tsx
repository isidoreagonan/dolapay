import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/company/pricing")({ component: PricingPage });
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, X, Smartphone, Zap, CreditCard, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import PricingMatrix from "@/components/site/pricing-matrix";

const tiers = [
  {
    label: "Encaissement Mobile Money", price: "2%", detail: "+ frais opérateur réels",
    icon: Smartphone, highlight: true,
    features: [
      "MTN, Orange, Free, Moov, M-Pesa, Airtel",
      "STK Push, USSD, QR",
      "Réconciliation automatique",
      "Dégressif à 1,5% au-delà de 50M FCFA/mois",
    ],
  },
  {
    label: "Décaissement (Pay-out)", price: "1%", detail: "+ frais réseau réels",
    icon: Zap, highlight: false,
    features: [
      "Bulk payout illimité (API ou CSV)",
      "Payouts instantanés 24/7",
      "Retry automatique sur échec",
      "Reçus PDF envoyés au bénéficiaire",
    ],
  },
  {
    label: "Cartes bancaires", price: "2,5%", detail: "+ 100 FCFA / transaction",
    icon: CreditCard, highlight: false,
    features: [
      "Visa, Mastercard, GIM-UEMOA",
      "3DS obligatoire, anti-fraude inclus",
      "Abonnements récurrents",
      "Tokenisation PCI-DSS",
    ],
  },
];

const included = [
  "Compte marchand créé en 5 minutes",
  "Dashboard temps réel + exports comptables",
  "API REST, SDK Node/Python/PHP/Go",
  "Webhooks signés avec retry exponentiel",
  "Sandbox illimité pour vos tests",
  "Support humain 7j/7 en français",
];

const excluded = [
  "Aucun frais d'installation",
  "Aucun abonnement mensuel",
  "Aucun frais de retrait vers votre banque",
  "Aucune marge cachée sur les frais opérateur",
];

function PricingPage() {
  return (
  <PageShell
    title="Tarifs DolaPay — Transparence totale, aucun frais caché"
    description="Mobile Money 2%, Pay-out 1%, Cartes 2,5% + 100 FCFA. Aucun frais d'installation, aucun abonnement. Les frais opérateur réels répercutés à l'identique."
    canonicalUrl="/pricing"
  >
    <PageHero
      eyebrow="Tarification cost-plus · Transparence totale"
      title={<>Un modèle. <span className="text-primary">Zéro surprise.</span></>}
      description="La commission DolaPay + les frais réels de l'opérateur local, répercutés à l'identique. Pas d'abonnement, pas d'installation, pas de marge cachée."
    />

    <section className="pb-8 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((t, i) => (
            <motion.div
              key={t.label}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className={`relative rounded-3xl p-8 border ${t.highlight ? "bg-navy text-white border-navy shadow-glow" : "bg-white text-navy border-border shadow-soft"}`}
            >
              {t.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-glow px-3 py-1 text-xs font-semibold text-navy uppercase tracking-wide">
                  Le plus populaire
                </span>
              )}
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${t.highlight ? "bg-white/10" : "bg-primary/10"}`}>
                <t.icon className={`h-6 w-6 ${t.highlight ? "text-electric-glow" : "text-primary"}`} />
              </div>
              <div className={`mt-5 text-sm ${t.highlight ? "text-white/60" : "text-navy/60"}`}>{t.label}</div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-semibold tracking-tight">{t.price}</span>
                <span className={`text-sm ${t.highlight ? "text-white/60" : "text-navy/50"}`}>{t.detail}</span>
              </div>
              <ul className={`mt-6 pt-6 border-t space-y-3 ${t.highlight ? "border-white/10" : "border-border"}`}>
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${t.highlight ? "text-electric-glow" : "text-primary"}`} />
                    <span className={t.highlight ? "text-white/85" : "text-navy/75"}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <PricingMatrix
      title="Grille détaillée par pays et opérateur"
      subtitle="Chaque taux ci-dessous est le coût total pour vous : frais réels de l'opérateur mobile + notre commission fixe de 2%. Zéro marge cachée."
    />



    <section className="py-16 md:py-24 bg-[#F5F8FF]">
      <div className="mx-auto max-w-6xl px-4 md:px-6 grid md:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-white border border-border p-8 shadow-soft">
          <Sparkles className="h-6 w-6 text-primary" />
          <h3 className="mt-4 text-2xl font-semibold text-navy">Toujours inclus</h3>
          <ul className="mt-5 space-y-3">
            {included.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-navy/75">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-navy text-white p-8 shadow-glow">
          <ShieldCheck className="h-6 w-6 text-electric-glow" />
          <h3 className="mt-4 text-2xl font-semibold">Ce que vous ne paierez jamais</h3>
          <ul className="mt-5 space-y-3">
            {excluded.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                <X className="h-4 w-4 text-electric-glow mt-0.5 flex-shrink-0" /> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-navy tracking-tight">
          Un volume élevé ? Parlons.
        </h2>
        <p className="mt-4 text-navy/60 text-lg">
          Au-delà de 100M FCFA/mois, nous négocions une grille dédiée avec commission dégressive et frais opérateur préférentiels via nos partenariats.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl bg-primary hover:bg-primary/90">
            <Link to="/contact" className="flex items-center gap-2">Parler à un expert <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl border-navy/15 text-navy hover:bg-navy/5">
            <Link to="/auth/sign-up">Créer un compte gratuit</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageShell>
  );
}



