import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowRight, Sparkles, Layers, ShieldCheck, Zap, UserCheck, Radar, Wallet,
  Lock, Server, Check, Plus, CreditCard, TrendingDown, Send,
} from "lucide-react";
import { useState } from "react";
import CountriesConstellation from "@/components/CountriesConstellation";
import { SUPPORTED_COUNTRIES } from "@/lib/supported-countries";
import heroPortrait from "@/assets/hero-entrepreneur.png";
import { Reveal } from "@/components/Reveal";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DolaPay — L'infrastructure de paiement ultime pour l'Afrique" },
      { name: "description", content: "DolaPay unifie le Mobile Money et les cartes derrière une seule API. Construisez, scalez et encaissez partout en Afrique avec une sécurité de niveau bancaire." },
      { property: "og:title", content: "DolaPay — Infrastructure de paiement pour l'Afrique" },
      { property: "og:description", content: "Une seule API pour le Mobile Money et les cartes. Simplifiez votre finance, même la plus complexe." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      <Reveal><TrustRow /></Reveal>

      <Reveal><PaymentMethods /></Reveal>
      <Reveal><Features /></Reveal>
      <Reveal><Countries /></Reveal>
      <Reveal><DevExperience /></Reveal>
      <Reveal><Security /></Reveal>
      <Reveal><FAQ /></Reveal>
      <Reveal><CTA /></Reveal>
      <Footer />
    </div>
  );
}


function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36 lg:pb-28">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/25 blur-[120px] animate-float" />
      <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[420px] w-[420px] rounded-full bg-primary-glow/20 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 lg:grid-cols-2 lg:gap-20">
        <div className="z-10 flex flex-col space-y-7">

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            L'infrastructure de <span className="text-gradient">paiement</span> pour l'Afrique.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Encaissez par Mobile Money et cartes bancaires via une seule API.
            Tarification transparente à <span className="font-semibold text-foreground">2% + frais opérateur</span> et règlement instantané.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/auth/sign-up"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:bg-primary-glow active:scale-[0.98]"
            >
              Créer un compte
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/company/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white/5 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/10"
            >
              Voir la tarification
            </Link>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-slate-700 text-[10px] font-semibold text-white">JD</div>
              <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary/70 text-[10px] font-semibold text-white">MT</div>
              <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-sky-700 text-[10px] font-semibold text-white">+500</div>
            </div>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Choisi par les leaders de la tech en Afrique.
            </p>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function CoverageMarquee() {
  const countries = SUPPORTED_COUNTRIES;
  const items = [...countries, ...countries];
  return (
    <section className="border-y border-border bg-surface py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            Couverture pan-africaine · 12 économies
          </div>
          <div className="flex items-center gap-2">
            <NetworkBadge label="Visa" />
            <NetworkBadge label="Mastercard" />
          </div>
        </div>
        <div className="mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-3">
            {items.map((c, i) => (
              <div
                key={`${c.code}-${i}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur"
              >
                <img
                  src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                  alt=""
                  className="h-3.5 w-5 rounded-[2px] object-cover ring-1 ring-border"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NetworkBadge({ label }: { label: string }) {
  return (
    <span className="relative inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-gradient-to-r from-primary/15 to-primary-glow/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-[0_0_24px_-6px_hsl(var(--primary)/0.6)] sm:text-xs">
      <CreditCard className="h-3 w-3" />
      {label}
    </span>
  );
}

function PricingTeaser() {
  const cards = [
    {
      icon: Wallet,
      kicker: "Encaissements Mobile Money",
      rate: "2%",
      suffix: "+ Opérateur",
      desc: "Commission DolaPay fixe + frais réels MTN, Orange, Moov, M-Pesa, Airtel ou Vodacom. 1,5% au-delà de 50M FCFA/mois.",
      accent: "from-primary/30 to-primary-glow/20",
    },
    {
      icon: Send,
      kicker: "Décaissements API",
      rate: "1%",
      suffix: "+ Réseau",
      desc: "Bulk payouts instantanés vers wallets et comptes bancaires sur 12 économies. Frais réseau facturés au coût.",
      accent: "from-emerald-500/30 to-teal-500/15",
    },
    {
      icon: CreditCard,
      kicker: "Cartes Visa & Mastercard",
      rate: "2,5%",
      suffix: "+ 100 FCFA",
      desc: "Tarif transparent + interchange bancaire. 3D-Secure et anti-fraude inclus par défaut.",
      accent: "from-indigo-500/30 to-violet-500/15",
    },
  ];
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
            <TrendingDown className="h-3 w-3" /> Cost-Plus transparent
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Vous ne payez que le <span className="text-gradient">juste prix</span>.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Commission DolaPay fixe + frais réels prélevés par l'opérateur. Aucun markup caché.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.kicker}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${c.accent} opacity-60 blur-3xl transition-opacity group-hover:opacity-90`} />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <c.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {c.kicker}
                </div>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold text-foreground">{c.rate}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{c.suffix}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            to="/company/pricing"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
          >
            Simuler vos frais
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto flex w-full justify-center lg:justify-end">
      {/* Soft ambient glow */}
      <div className="pointer-events-none absolute -inset-10 rounded-full bg-primary/25 opacity-60 blur-[100px]" />

      <div className="relative w-full max-w-[460px] sm:max-w-[520px]">
        {/* Decorative dotted square */}
        <div
          className="absolute -left-2 -top-2 h-20 w-20 opacity-50 sm:-left-4 sm:-top-4"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
            backgroundSize: "10px 10px",
            color: "var(--color-primary)",
          }}
          aria-hidden
        />

        {/* Decorative blobs behind the photo */}
        <div className="pointer-events-none absolute -right-6 top-6 h-40 w-40 rounded-full bg-primary/15 blur-2xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-amber-300/30 blur-2xl" aria-hidden />

        {/* Portrait container with soft tinted backdrop */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-white to-primary/5 shadow-elegant ring-1 ring-black/5 sm:aspect-[5/6] sm:rounded-[2.5rem]">
          <img
            src={heroPortrait}
            alt="Entrepreneur africain utilisant DolaPay"
            className="absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply select-none pointer-events-none"
            width={1024}
            height={1024}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
          />
          {/* Overlay invisible pour bloquer le drag/téléchargement */}
          <div
            className="absolute inset-0 z-10"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            aria-hidden
          />
          {/* Top gradient to fade edges */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/60 to-transparent" />
        </div>

        {/* Floating card — profile / merchant */}
        <div className="absolute -left-3 top-10 z-20 w-[14rem] rounded-2xl border border-black/5 bg-white p-3 shadow-2xl sm:-left-8 sm:top-14">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-display text-base font-bold text-white">
              KA
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">Kossi Adjovi</div>
              <div className="text-[11px] text-muted-foreground">Marchand · Lomé</div>
            </div>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2">
            <span className="text-[11px] text-muted-foreground">Solde</span>
            <span className="font-display text-sm font-bold text-foreground">2 845 200 <span className="text-[10px] text-muted-foreground">FCFA</span></span>
          </div>
        </div>

        {/* Floating card — country flags pill */}
        <div className="absolute -right-2 top-1/3 z-20 flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-2 shadow-xl sm:-right-6">
          <div className="flex -space-x-2">
            {["ci", "sn", "bj", "cm", "ke"].map((c, i) => (
              <img
                key={c}
                src={`https://flagcdn.com/w40/${c}.png`}
                alt=""
                className="h-7 w-7 rounded-full border-2 border-white object-cover"
                style={{ zIndex: 10 - i }}
                loading="lazy"
              />
            ))}
          </div>
          <span className="pr-1 text-[11px] font-semibold text-foreground">+12 pays</span>
        </div>

        {/* Floating card — transaction success */}
        <div className="absolute -bottom-8 left-1 z-20 w-[13rem] rounded-2xl border border-black/5 bg-white p-3 shadow-2xl sm:-bottom-6 sm:left-6 sm:w-[15rem] sm:p-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-muted-foreground">Paiement reçu</div>
              <div className="font-display text-base font-bold text-foreground">+ 25 000 FCFA</div>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2 text-[10px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Orange Money
            </span>
            <span>il y a 2 s</span>
          </div>
        </div>

        {/* TLS / secure chip */}
        <div className="absolute -top-3 right-6 z-20 inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-lg">
          <Lock className="h-3 w-3 text-emerald-500" />
          PCI-DSS · TLS 1.3
        </div>
      </div>
    </div>
  );
}


import ligdicashLogo from "@/assets/partner-ligdicash.png.asset.json";
import pawapayLogo from "@/assets/partner-pawapay.png.asset.json";
import technovaLogo from "@/assets/partner-technova.png.asset.json";

const PARTNERS = [
  { name: "LigdiCash", src: ligdicashLogo.url },
  { name: "PawaPay", src: pawapayLogo.url },
  { name: "TechNova", src: technovaLogo.url },
];

function TrustRow() {
  return (
    <section className="border-y border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Choisi par des entreprises innovantes partout en Afrique
        </div>
        {/* Mobile: marquee défilant */}
        <div className="mt-8 overflow-hidden sm:hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-x-12">
            {[...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS].map((p, i) => (
              <img
                key={`${p.name}-${i}`}
                src={p.src}
                alt={p.name}
                className="h-9 w-auto shrink-0 object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                loading="lazy"
              />
            ))}
          </div>
        </div>
        {/* Desktop: grille fixe */}
        <div className="mt-8 hidden flex-wrap items-center justify-center gap-x-20 gap-y-6 sm:flex">
          {PARTNERS.map((p) => (
            <img
              key={p.name}
              src={p.src}
              alt={p.name}
              className="h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </section>
  );
}


const FEATURES = [
  { icon: Layers, title: "API unifiée", desc: "Une seule intégration pour accepter Mobile Money, cartes, virements bancaires et USSD sur tout le continent.", size: "lg" },
  { icon: UserCheck, title: "KYC/KYB automatisé", desc: "Onboardez marchands et clients en quelques minutes grâce à notre moteur de conformité." },
  { icon: Radar, title: "Détection de fraude avancée", desc: "Scoring de risque ML en temps réel sur chaque transaction." },
  { icon: Wallet, title: "Encaissement instantané", desc: "Réception le jour même sur votre compte ou wallet. Fini l'attente de plusieurs jours." },
];

function Features() {
  return (
    <section className="pb-4 pt-20 sm:pb-6">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHead eyebrow="Plateforme" title="Tout ce qu'il faut pour faire circuler l'argent." sub="Une stack financière composable, pensée pour la réalité du commerce africain." />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(220px,_auto)]">
          {FEATURES.map((f, i) => (
            <article
              key={i}
              className={`group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elegant ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/0 blur-3xl transition-all duration-500 group-hover:bg-primary/20" />
              <div className="relative">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className={`mt-5 font-bold text-foreground ${i === 0 ? "text-3xl" : "text-xl"}`}>{f.title}</h3>
                <p className={`mt-2 text-muted-foreground ${i === 0 ? "max-w-md text-base" : "text-sm"}`}>{f.desc}</p>
                {i === 0 && (
                  <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                    {["Mobile Money", "Cartes", "Virement bancaire", "USSD"].map((m) => (
                      <div key={m} className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="font-medium text-foreground">{m}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>
      <h2 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h2>
      <p className="mt-4 text-lg text-muted-foreground">{sub}</p>
    </div>
  );
}

function DevExperience() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-16 text-navy-foreground sm:py-24 lg:py-28">
      <div className="absolute inset-0 bg-grid opacity-[0.07]" />
      <div className="absolute left-1/2 top-0 h-80 w-[60%] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div className="min-w-0">
          <div className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Développeurs</div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Acceptez des paiements en <span className="text-primary-glow">3 lignes</span> de code.</h2>
          <p className="mt-4 max-w-md text-sm text-navy-foreground/70 sm:text-base">
            Propre, prévisible, REST. Typage fort, requêtes idempotentes et SDKs dans tous les langages majeurs. Conçue par des développeurs, pour des développeurs.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-navy-foreground/80 sm:mt-8">
            {["SDKs typés pour Node, Python, PHP, Go", "Webhooks avec retries automatiques et signature HMAC", "Sandbox avec des scénarios de test réalistes"].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-glow" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <Link to="/developers/api" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] sm:mt-8">
            Lire la documentation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="min-w-0">
          <CodeBlock />
        </div>
      </div>
    </section>
  );
}

function CodeBlock() {
  return (
    <div className="relative rounded-2xl bg-gradient-to-br from-primary/40 via-white/10 to-transparent p-px shadow-glow">
      <div className="overflow-hidden rounded-2xl bg-[oklch(0.14_0.04_265)]">
        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
            <span className="h-3 w-3 rounded-full bg-green-400/70" />
          </div>
          <div className="font-mono text-xs text-navy-foreground/50">charge.ts</div>
        </div>
        <pre className="whitespace-pre-wrap break-words p-4 font-mono text-[11px] leading-relaxed text-navy-foreground/90 sm:overflow-x-auto sm:whitespace-pre sm:break-normal sm:p-6 sm:text-sm">
{`import { DolaPay } from "@dolapay/node";

const dolapay = new DolaPay(
  process.env.DOLAPAY_KEY
);

const charge = await dolapay.charges.create({
  amount: 5000,
  currency: "GHS",
  method: "mobile_money",
  customer: {
    phone: "+233501234567"
  },
});

console.log(charge.status);
// "succeeded"`}
        </pre>
      </div>
    </div>
  );
}

const SECURITY = [
  { icon: ShieldCheck, title: "PCI-DSS Niveau 1", desc: "La certification la plus exigeante pour traiter les données de cartes." },
  { icon: Scale, title: "Conforme LCB-FT", desc: "Surveillance continue alignée sur les standards internationaux." },
  { icon: Lock, title: "Chiffrement de bout en bout", desc: "AES-256 au repos, TLS 1.3 en transit, sur chaque requête." },
  { icon: Server, title: "Infrastructure bancaire", desc: "Bascule multi-régions, SLA de disponibilité à 99,99%." },
];

function Security() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHead eyebrow="Sécurité" title="La confiance, c'est notre produit." sub="Conformité et sécurité tissées dans chaque couche de la plateforme." />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SECURITY.map((s, i) => (
            <div key={i} className="group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-bold text-foreground">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Scale(props: { className?: string }) {
  return <Zap {...props} />;
}

function CTA() {
  return (
    <section className="px-4 pb-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-deep via-navy to-primary p-12 text-navy-foreground shadow-glow sm:p-16">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl animate-float" />
        <div className="relative grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Prêt à simplifier votre stack financière ?</h2>
            <p className="mt-4 max-w-xl text-navy-foreground/75">Rejoignez les centaines d'entreprises qui bâtissent l'avenir du commerce africain sur DolaPay.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/auth/sign-up" className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy-deep transition-transform hover:scale-[1.02]">Commencer</Link>
            <Link to="/company/contact" className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10">Parler aux ventes</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import pmMtn from "@/assets/pm-mtn.png.asset.json";
import pmOrange from "@/assets/pm-orange.png.asset.json";
import pmMoov from "@/assets/pm-moov.png.asset.json";
import pmAirtel from "@/assets/pm-airtel.webp.asset.json";
import pmMpesa from "@/assets/pm-mpesa.png.asset.json";
import pmFree from "@/assets/pm-freemoney.png.asset.json";
import pmVodacom from "@/assets/pm-vodacom.png.asset.json";
import pmZamtel from "@/assets/pm-zamtel.png.asset.json";
import pmCeltiis from "@/assets/pm-celtiis.png.asset.json";

const METHODS = [
  { name: "MTN Mobile Money", logo: pmMtn.url },
  { name: "Orange Money", logo: pmOrange.url },
  { name: "Moov Money", logo: pmMoov.url },
  { name: "Airtel Money", logo: pmAirtel.url },
  { name: "M-Pesa", logo: pmMpesa.url },
  { name: "Free Money", logo: pmFree.url },
  { name: "Vodacom", logo: pmVodacom.url },
  { name: "Zamtel", logo: pmZamtel.url },
  { name: "Celtiis Money", logo: pmCeltiis.url },
];

function PaymentMethods() {
  return (
    <section className="border-y border-border bg-background py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHead eyebrow="Couverture" title="Tous les moyens de paiement qui comptent." sub="Une seule intégration, tous les wallets utilisés par vos clients." />
        <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-4">
            {[...METHODS, ...METHODS].map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm">
                <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-white">
                  <img src={m.logo} alt={m.name} className="h-full w-full object-contain p-1" />
                </div>
                <span className="whitespace-nowrap font-display text-sm font-bold text-foreground">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type Country = { name: string; flag: string; code: string; currency: string; lat: number; lng: number };

const COUNTRY_GROUPS: { label: string; tag: string; items: Country[] }[] = [
  {
    label: "Afrique francophone",
    tag: "XOF · XAF",
    items: [
      { name: "Bénin", flag: "🇧🇯", code: "BJ", currency: "XOF", lat: 9.3, lng: 2.3 },
      { name: "Cameroun", flag: "🇨🇲", code: "CM", currency: "XAF", lat: 7.3, lng: 12.3 },
      { name: "Côte d'Ivoire", flag: "🇨🇮", code: "CI", currency: "XOF", lat: 7.5, lng: -5.5 },
      { name: "Gabon", flag: "🇬🇦", code: "GA", currency: "XAF", lat: -0.8, lng: 11.6 },
      { name: "Rép. du Congo", flag: "🇨🇬", code: "CG", currency: "XAF", lat: -0.7, lng: 14.8 },
      { name: "Sénégal", flag: "🇸🇳", code: "SN", currency: "XOF", lat: 14.5, lng: -14.5 },
    ],
  },
  {
    label: "Afrique de l'Est et australe",
    tag: "KES · RWF · UGX · ZMW",
    items: [
      { name: "Kenya", flag: "🇰🇪", code: "KE", currency: "KES", lat: -0.02, lng: 37.9 },
      { name: "Rwanda", flag: "🇷🇼", code: "RW", currency: "RWF", lat: -1.94, lng: 29.87 },
      { name: "Ouganda", flag: "🇺🇬", code: "UG", currency: "UGX", lat: 1.37, lng: 32.29 },
      { name: "Zambie", flag: "🇿🇲", code: "ZM", currency: "ZMW", lat: -13.13, lng: 27.85 },
    ],
  },
  {
    label: "Afrique centrale et de l'Ouest",
    tag: "CDF · USD · SLE",
    items: [
      { name: "R.D. Congo", flag: "🇨🇩", code: "CD", currency: "CDF / USD", lat: -4.0, lng: 21.8 },
      { name: "Sierra Leone", flag: "🇸🇱", code: "SL", currency: "SLE", lat: 8.46, lng: -11.78 },
    ],
  },
];

function Countries() {
  const all = COUNTRY_GROUPS.flatMap((g) => g.items);
  const total = all.length;
  const currencies = Array.from(new Set(all.map((c) => c.currency.split(" / ")[0]))).length;




  return (
    <section id="countries" className="relative overflow-hidden bg-background pb-14 pt-2 sm:pb-20 sm:pt-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-primary-glow/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Centered header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/80 backdrop-blur sm:text-xs sm:tracking-wider">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Couverture panafricaine · {total} pays
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Une seule API pour <span className="text-gradient">encaisser partout en Afrique.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base">
            De Dakar à Dar es Salaam — Mobile Money, cartes et virements bancaires. {total} pays, {currencies}+ devises, une intégration.
          </p>
        </div>

        {/* Globe / constellation */}
        <div className="relative mt-6 sm:mt-8">
          <CountriesConstellation countries={all} />
        </div>

        {/* Regional breakdown */}
        <CountriesRegionsBoard />
      </div>
    </section>
  );
}

type RegionCountry = { name: string; code: string; operators: number };
type Region = { label: string; short: string; accent: "primary" | "emerald"; countries: RegionCountry[] };

const REGIONS: Region[] = [
  {
    label: "Afrique de l'Ouest",
    short: "Ouest",
    accent: "primary",
    countries: [
      { name: "Bénin", code: "BJ", operators: 3 },
      { name: "Côte d'Ivoire", code: "CI", operators: 4 },
      { name: "Sénégal", code: "SN", operators: 3 },
      { name: "Sierra Leone", code: "SL", operators: 2 },
    ],
  },
  {
    label: "Afrique Centrale",
    short: "Centre",
    accent: "emerald",
    countries: [
      { name: "Cameroun", code: "CM", operators: 2 },
      { name: "Congo Brazza", code: "CG", operators: 2 },
      { name: "Gabon", code: "GA", operators: 2 },
      { name: "R.D.C", code: "CD", operators: 3 },
    ],
  },
  {
    label: "Afrique de l'Est",
    short: "Est",
    accent: "primary",
    countries: [
      { name: "Kenya", code: "KE", operators: 2 },
      { name: "Rwanda", code: "RW", operators: 2 },
      { name: "Uganda", code: "UG", operators: 2 },
      { name: "Zambie", code: "ZM", operators: 3 },
    ],
  },
];

function CountriesRegionsBoard() {
  const totalCountries = REGIONS.reduce((n, r) => n + r.countries.length, 0);
  const totalOperators = REGIONS.reduce(
    (n, r) => n + r.countries.reduce((m, c) => m + c.operators, 0),
    0,
  );

  return (
    <div className="relative mx-auto mt-8 sm:mt-12">
      {/* Compact stats strip */}
      <div className="mx-auto mb-6 flex max-w-md items-center justify-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur sm:max-w-none sm:w-fit sm:gap-6 sm:px-6 sm:py-2.5 sm:text-sm">
        <span className="inline-flex items-center gap-2">
          <MapPinIcon className="h-3.5 w-3.5 text-primary" />
          <span className="font-display text-sm font-bold text-foreground sm:text-base">{totalCountries}</span>
          <span className="hidden sm:inline">pays</span>
        </span>
        <span className="h-4 w-px bg-border" />
        <span className="inline-flex items-center gap-2">
          <TrendUpIcon className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-display text-sm font-bold text-foreground sm:text-base">{totalOperators}+</span>
          <span className="hidden sm:inline">opérateurs</span>
        </span>
        <span className="h-4 w-px bg-border" />
        <span className="inline-flex items-center gap-2">
          <span className="font-display text-sm font-bold text-foreground sm:text-base">{REGIONS.length}</span>
          <span className="hidden sm:inline">régions</span>
        </span>
      </div>

      {/* Region cards grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
        {REGIONS.map((region) => {
          const ops = region.countries.reduce((n, c) => n + c.operators, 0);
          const isEmerald = region.accent === "emerald";
          const accentText = isEmerald ? "text-emerald-600 dark:text-emerald-400" : "text-primary";
          const accentBg = isEmerald ? "bg-emerald-500" : "bg-primary";
          const accentBorder = isEmerald ? "border-emerald-500/20" : "border-primary/20";
          return (
            <div
              key={region.label}
              className={`group relative overflow-hidden rounded-2xl border ${accentBorder} bg-card/70 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-elegant sm:p-5`}
            >
              <span className={`absolute inset-x-0 top-0 h-px ${accentBg} opacity-60`} />

              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${accentBg}`} />
                  <h3 className="font-display text-sm font-bold tracking-tight text-foreground sm:text-base">{region.label}</h3>
                </div>
                <span className={`font-display text-lg font-bold ${accentText}`}>{ops}+</span>
              </div>

              {/* Country list */}
              <ul className="space-y-1.5">
                {region.countries.map((c) => (
                  <li
                    key={c.code}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-background/60"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <img
                        src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                        alt=""
                        className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover ring-1 ring-border"
                        loading="lazy"
                      />
                      <span className="truncate text-xs font-semibold text-foreground sm:text-sm">{c.name}</span>
                    </span>
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {c.operators} ops
                    </span>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                <span>{region.countries.length} pays</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  Live
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                    <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mx-auto mt-5 max-w-md text-center text-[11px] leading-relaxed text-muted-foreground sm:max-w-none sm:text-xs">
        Une seule intégration. Tous les opérateurs Mobile Money, Cartes et virements.
      </p>
    </div>
  );
}

function MapPinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function TrendUpIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  );
}

const FAQS = [
  { q: "À quelle vitesse arrivent les encaissements ?", a: "Les encaissements sont instantanés par défaut (T+0) sur votre compte bancaire ou wallet. Plus besoin d'attendre plusieurs jours." },
  { q: "Faut-il un site web pour utiliser DolaPay ?", a: "Pas du tout. Avec les liens de paiement, vous pouvez commencer à encaisser via WhatsApp, SMS ou e-mail en moins de 60 secondes — sans code et sans site." },
  { q: "Quels pays sont supportés ?", a: "Nous sommes actifs en Côte d'Ivoire, au Sénégal, au Bénin, au Mali, au Togo et au Burkina Faso, avec des déploiements en cours dans le reste de l'Afrique de l'Ouest et centrale." },
  { q: "DolaPay est-il conforme PCI-DSS ?", a: "Oui. Nous sommes certifiés PCI-DSS Niveau 1, le plus haut standard pour le traitement des cartes, avec chiffrement AES-256 au repos et TLS 1.3 en transit." },
  { q: "Quels sont vos frais ?", a: "Tarification à l'usage, sans frais d'installation. Mobile Money à partir de 1,4%, cartes à 2,9% + frais locaux. Remises possibles selon le volume." },
  { q: "Combien de temps prend l'intégration ?", a: "La plupart des équipes mettent en production une intégration fonctionnelle en moins d'une journée grâce à nos SDKs typés et notre sandbox aux scénarios réalistes." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-28">
      <div className="mx-auto max-w-3xl px-4">
        <SectionHead eyebrow="FAQ" title="Vos questions, nos réponses." sub="Tout ce qu'il faut savoir avant de construire avec DolaPay." />
        <div className="mt-14 space-y-3">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`overflow-hidden rounded-2xl border bg-card transition-all ${isOpen ? "border-primary/40 shadow-elegant" : "border-border"}`}>
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="font-display text-base font-bold text-foreground sm:text-lg">{item.q}</span>
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all ${isOpen ? "rotate-45 bg-primary text-primary-foreground" : "bg-accent text-foreground"}`}>
                    <Plus className="h-4 w-4" />
                  </div>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
