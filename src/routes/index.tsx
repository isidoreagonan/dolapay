import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({ component: Home });
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import Flag from "@/components/ui/flag";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  CreditCard,
  Globe2,
  Link2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
  ShoppingBag,
  Briefcase,
  Rocket,
  
  Clock,
  X,
  Star,
  Server,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/site/page-shell";
import dashboardHero from "@/assets/dashboard-hero.jpg";
import mobileMoney from "@/assets/mobile-money.jpg";
import africaNetwork from "@/assets/africa-network.jpg";

/* ---------- helpers ---------- */
const fadeUp: any = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as any },
  }),
};

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary/80 mb-2">
    <span className="h-px w-6 bg-primary/40"></span>
    {children}
  </span>
);

/* ---------- Hero ---------- */
const Hero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <section ref={ref} className="relative pt-16 md:pt-24 pb-24 md:pb-32 overflow-hidden bg-gradient-to-b from-[#EEF3FF] via-white to-white">
      <div className="pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute top-20 -right-40 h-[420px] w-[420px] rounded-full bg-electric-glow/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(24,60,235,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(24,60,235,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center max-w-4xl mx-auto">

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="mt-6 text-navy font-semibold tracking-tight text-[2.75rem] leading-[1.05] md:text-[4.5rem] md:leading-[1.02]"
          >
            L'infrastructure de paiement
            <br />
            qui propulse{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary to-electric-glow bg-clip-text text-transparent">l'Afrique</span>
              <motion.svg
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                viewBox="0 0 300 12" className="absolute -bottom-2 left-0 w-full h-3"
              >
                <motion.path d="M2 8 Q 150 -2 298 8" fill="none" stroke="rgb(24 60 235)" strokeWidth="3" strokeLinecap="round" />
              </motion.svg>
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2} className="mt-6 text-lg md:text-xl text-navy/60 max-w-2xl mx-auto">
            Mobile Money, cartes bancaires, payouts instantanés et liens no-code — unifiés derrière une seule API élégante, pensée pour les startups et marchands africains.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-xl bg-primary hover:bg-primary/90 shadow-glow h-12 px-6 text-base">
              <Link to="/auth/sign-up" className="flex items-center gap-2">Commencer gratuitement <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl h-12 px-6 text-base border-navy/15 text-navy hover:bg-navy/5">
              <Link to="/developers/api">Voir la documentation</Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4} className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-navy/50">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Sans frais d'installation</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> Règlements instantanés</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-primary" /> API en 5 minutes</span>
          </motion.div>
        </div>

        <div className="relative mt-16 md:mt-24 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ y: y1 }}
            className="relative rounded-3xl overflow-hidden border border-border shadow-glow bg-white"
          >
            <img
              src={dashboardHero}
              alt="Dashboard DolaPay"
              className="w-full h-auto block select-none pointer-events-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
            />
            <div
              className="absolute inset-0 z-10"
              style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent z-20" />
          </motion.div>

          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.9, x: -30 }} animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="hidden md:flex absolute -left-8 top-8 items-center gap-3 rounded-2xl bg-white/90 backdrop-blur border border-border shadow-card p-4 min-w-[240px]"
          >
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-xs text-navy/50">Volume traité · 7j</div>
              <div className="text-base font-semibold text-navy">2 847 320 FCFA</div>
            </div>
            <span className="ml-auto text-xs font-semibold text-emerald-600">+18%</span>
          </motion.div>

          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.9, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="hidden md:flex absolute -right-6 bottom-10 items-center gap-3 rounded-2xl bg-white/90 backdrop-blur border border-border shadow-card p-4 min-w-[220px]"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Check className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-xs text-navy/50 flex items-center gap-1.5">Payout · Orange Money <Flag code="ci" size={11} /></div>
              <div className="text-base font-semibold text-navy">Réglé en 3,2s</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ---------- Operators ticker ---------- */
const operators = [
  { name: "MTN Mobile Money", logo: "/methods/mtn.png" },
  { name: "Orange Money", logo: "/methods/orange.png" },
  { name: "Moov Money", logo: "/methods/moov.png" },
  { name: "Airtel Money", logo: "/methods/airtel.webp" },
  { name: "M-Pesa", logo: "/methods/m-pesa.png" },
  { name: "Vodacom M-Pesa", logo: "/methods/vodacom.png" },
  { name: "Free Money", logo: "/methods/free.png" },
  { name: "Zamtel", logo: "/methods/zamtel.png" },
];

const Ticker = () => (
  <section className="py-14 md:py-20 border-y border-border bg-white">
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <p className="text-center text-sm font-medium text-navy/50 uppercase tracking-wider mb-8">
        Une API. Tous les opérateurs africains majeurs.
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-8 md:gap-14 animate-infinite-scroll whitespace-nowrap items-center">
          {[...operators, ...operators].map((op, i) => (
            <div key={i} className="flex items-center gap-3 md:gap-4 text-navy/70 text-base md:text-xl font-medium">
              {op.logo ? (
                <img src={op.logo} alt={op.name} className="h-8 md:h-10 w-auto object-contain drop-shadow-sm" />
              ) : (
                <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary/60" />
              )}
              {op.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Features ---------- */
const Features = () => {
  const items = [
    { icon: Wallet, title: "Encaissements (Pay-in)", desc: "Mobile Money + cartes Visa/Mastercard. Un checkout, tous les moyens de paiement locaux.", href: "/products/pay-in" },
    { icon: Zap, title: "Bulk Pay-out", desc: "Envoyez de l'argent vers des milliers de portefeuilles en un clic. API ou CSV.", href: "/products/pay-out" },
    { icon: Link2, title: "Liens no-code", desc: "Vendez sur WhatsApp, Instagram, TikTok. Créez un lien, partagez, encaissez.", href: "/products/no-code" },
    { icon: Code2, title: "API développeur", desc: "RESTful, webhooks temps réel, SDK Node/Python/PHP. Intégration en 5 minutes.", href: "/developers/api" },
  ];

  return (
    <section id="produit" className="py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="max-w-3xl">
          <motion.div variants={fadeUp}><Eyebrow>Un système. Tout intégré.</Eyebrow></motion.div>
          <motion.h2 variants={fadeUp} custom={1} className="mt-4 text-4xl md:text-5xl font-semibold text-navy tracking-tight">
            Tout ce qu'il faut pour encaisser et décaisser en Afrique.
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mt-5 text-lg text-navy/60">
            Une plateforme unique remplaçant 6 intégrations différentes. Construite en interne, testée à l'échelle.
          </motion.p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-4 md:row-span-2 relative overflow-hidden rounded-3xl bg-navy p-8 md:p-10 text-white min-h-[380px] group"
          >
            <div className="absolute inset-0 opacity-40">
              <img src={africaNetwork} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-navy via-navy/80 to-transparent" />
            <div className="relative">
              <Globe2 className="h-8 w-8 text-electric-glow" />
              <h3 className="mt-5 text-3xl md:text-4xl font-semibold tracking-tight">
                12 économies. <br />
                <span className="text-electric-glow">Une seule intégration.</span>
              </h3>
              <p className="mt-4 text-white/70 max-w-md">
                Zone UEMOA{" "}
                <span className="inline-flex items-center gap-1 align-middle">
                  {["ci","sn","bf","bj"].map((c) => <Flag key={c} code={c} size={12} />)}
                </span>
                , CEMAC{" "}
                <span className="inline-flex items-center gap-1 align-middle">
                  {["cm","ga","cg"].map((c) => <Flag key={c} code={c} size={12} />)}
                </span>
                , Afrique de l'Est et Australe (RDC, Kenya, Rwanda, Ouganda, Zambie...). MTN, Orange, Moov, Airtel, M-Pesa — tous branchés.
              </p>
              <Link to="/coverage" className="mt-6 inline-flex items-center gap-2 text-sm text-electric-glow group-hover:gap-3 transition-all">
                Voir la couverture <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl min-h-[240px]"
          >
            <img src={mobileMoney} alt="Mobile Money" className="w-full h-full object-cover absolute inset-0" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <Smartphone className="h-6 w-6 mb-3" />
              <div className="text-xl font-semibold">Mobile Money natif</div>
              <div className="text-sm text-white/70 mt-1">STK Push, USSD, QR. Sans friction.</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-electric-glow p-8 min-h-[240px] text-white"
          >
            <CreditCard className="h-7 w-7" />
            <div className="mt-4 text-xl font-semibold">Visa & Mastercard</div>
            <div className="text-sm text-white/80 mt-1">3DS, tokenisation, abonnements récurrents.</div>
            <div className="absolute -right-6 -bottom-6 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          </motion.div>

          {items.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="md:col-span-3 rounded-3xl border border-border bg-white p-6 hover:shadow-card transition-shadow"
            >
              <Link to={f.href} className="block">
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="mt-4 text-lg font-semibold text-navy flex items-center gap-1.5">
                  {f.title} <ArrowUpRight className="h-4 w-4 text-navy/40" />
                </div>
                <div className="mt-1.5 text-sm text-navy/60 leading-relaxed">{f.desc}</div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------- Use Cases ---------- */
const useCases = [
  {
    icon: ShoppingBag, title: "E-commerçants",
    desc: "Boutiques Shopify, WooCommerce ou custom : encaissez Mobile Money + cartes en un checkout unique, sans redirection.",
    stat: "+38% de conversion checkout", tag: "Retail",
  },
  {
    icon: Briefcase, title: "Freelances & créateurs",
    desc: "Facturez vos clients en 30s avec un lien de paiement no-code. Partagez sur WhatsApp, encaissez en Mobile Money.",
    stat: "Payé en 3 min en moyenne", tag: "Solo",
  },
  {
    icon: Rocket, title: "Startups tech",
    desc: "SaaS, marketplaces, super-apps : API robuste, webhooks signés, sandbox illimité, réconciliation automatique.",
    stat: "Intégration en 1 sprint", tag: "Scale-up",
  },
];
const UseCases = () => (
  <section className="py-24 md:py-32 bg-gradient-to-b from-white to-[#F5F8FF]">
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="max-w-3xl">
        <Eyebrow>Cas d'usage</Eyebrow>
        <h2 className="mt-4 text-4xl md:text-5xl font-semibold text-navy tracking-tight">
          Une infrastructure. <span className="text-primary">Mille usages.</span>
        </h2>
        <p className="mt-5 text-lg text-navy/60">
          Que vous vendiez 10 ou 10 millions de FCFA par mois, DolaPay s'adapte à votre modèle.
        </p>
      </div>
      <div className="mt-16 grid md:grid-cols-3 gap-5">
        {useCases.map((u, i) => (
          <motion.div
            key={u.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-white border border-border p-8 shadow-soft hover:shadow-card transition-all"
          >
            <span className="inline-flex text-xs font-medium text-navy/60 bg-primary/5 rounded-full px-3 py-1">{u.tag}</span>
            <div className="mt-5 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <u.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-5 text-xl font-semibold text-navy">{u.title}</h3>
            <p className="mt-2 text-sm text-navy/60 leading-relaxed">{u.desc}</p>
            <div className="mt-6 pt-5 border-t border-border flex items-center gap-2 text-sm font-medium text-primary">
              <TrendingUp className="h-4 w-4" /> {u.stat}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link to="/resources/use-cases" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all">
          Voir tous les cas d'usage <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </section>
);

/* ---------- Comparison ---------- */
const compareRows = [
  { label: "Ouverture de compte", dola: "En ligne, 5 minutes", bank: "3 à 6 semaines en agence" },
  { label: "Règlement des fonds", dola: "Instantané, 24/7", bank: "T+2 à T+5 jours ouvrés" },
  { label: "Mobile Money natif", dola: "MTN, Orange, Wave, Moov, M-Pesa", bank: "Souvent absent" },
  { label: "Tarification", dola: "2% + frais opérateur (transparent)", bank: "Frais fixes + variables opaques" },
  { label: "API & webhooks", dola: "Modernes, documentés, sandbox", bank: "SOAP legacy ou inexistants" },
  { label: "Support technique", dola: "Humain 7j/7, WhatsApp & Slack", bank: "Numéro vert, 9h-17h" },
];
const Compare = () => (
  <section className="py-24 md:py-32 bg-white">
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="text-center max-w-2xl mx-auto">
        <Eyebrow>Comparatif</Eyebrow>
        <h2 className="mt-4 text-4xl md:text-5xl font-semibold text-navy tracking-tight">
          DolaPay vs. banques classiques
        </h2>
        <p className="mt-5 text-lg text-navy/60">
          Pourquoi les marchands africains modernes choisissent une infrastructure taillée pour le mobile.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-14"
      >
        {/* Desktop table */}
        <div className="hidden md:block rounded-3xl overflow-hidden border border-border shadow-soft bg-white">
          <div className="grid grid-cols-3 bg-[#F5F8FF] border-b border-border">
            <div className="p-5 text-sm font-medium text-navy/50">Critère</div>
            <div className="p-5 text-sm font-semibold text-primary flex items-center gap-2">
              <img src="/images/common/logo.png" alt="" className="h-5 w-auto" /> DolaPay
            </div>
            <div className="p-5 text-sm font-semibold text-navy/70">Banque classique</div>
          </div>
          {compareRows.map((r, i) => (
            <div key={r.label} className={`grid grid-cols-3 items-center ${i % 2 === 1 ? "bg-[#FAFBFF]" : "bg-white"} border-b border-border last:border-0`}>
              <div className="p-5 text-sm font-medium text-navy">{r.label}</div>
              <div className="p-5 text-sm text-navy flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span>{r.dola}</span>
              </div>
              <div className="p-5 text-sm text-navy/60 flex items-start gap-2">
                <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span>{r.bank}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-4">
          {compareRows.map((r) => (
            <div key={r.label} className="rounded-2xl border border-border bg-white shadow-soft overflow-hidden">
              <div className="px-5 py-3 bg-[#F5F8FF] text-xs font-semibold uppercase tracking-wide text-navy/60">
                {r.label}
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-primary uppercase tracking-wide">DolaPay</div>
                    <div className="mt-0.5 text-sm text-navy leading-snug">{r.dola}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 pt-3 border-t border-border">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <X className="h-3.5 w-3.5 text-red-500" />
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-navy/50 uppercase tracking-wide">Banque classique</div>
                    <div className="mt-0.5 text-sm text-navy/70 leading-snug">{r.bank}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ---------- Reliability / stats ---------- */
const stats = [
  { icon: Server, kpi: "99,99%", label: "Uptime garanti", desc: "Infrastructure multi-région, monitoring 24/7." },
  { icon: ShieldCheck, kpi: "PCI-DSS", label: "Niveau bancaire", desc: "Certifiés PCI-DSS, conformité UEMOA/CEMAC." },
  { icon: Clock, kpi: "< 3 s", label: "Payout moyen", desc: "Décaissements instantanés, jour et nuit." },
  { icon: Headphones, kpi: "7 j / 7", label: "Support humain", desc: "WhatsApp, Slack et téléphone en français." },
];
const Reliability = () => (
  <section className="py-24 md:py-32 bg-navy text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/40 blur-3xl" />
    <div className="relative mx-auto max-w-7xl px-4 md:px-6">
      <div className="max-w-2xl">
        <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-electric-glow/80 mb-2">
          <span className="h-px w-6 bg-electric-glow/40"></span>
          Chiffres & fiabilité
        </span>
        <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
          Une infrastructure conçue pour <span className="text-electric-glow">ne jamais tomber.</span>
        </h2>
        <p className="mt-5 text-lg text-white/60">
          Vos ventes ne s'arrêtent pas la nuit. Notre infrastructure non plus.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 backdrop-blur"
          >
            <s.icon className="h-6 w-6 text-electric-glow" />
            <div className="mt-4 text-4xl font-semibold tracking-tight">{s.kpi}</div>
            <div className="mt-1 text-sm font-medium text-white">{s.label}</div>
            <div className="mt-2 text-xs text-white/50 leading-relaxed">{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- Testimonials ---------- */
const testimonials = [
  {
    quote: "Depuis qu'on est passés sur DolaPay, nos conversions Mobile Money ont bondi. Un seul checkout, tous les opérateurs — c'était exactement ce qu'il nous manquait.",
    name: "Aïssatou Koné", role: "Fondatrice, Kora Shop", flag: "ci", city: "Abidjan",
  },
  {
    quote: "Le bulk pay-out nous fait gagner 2 jours par semaine sur la paie de nos livreurs. Et l'API est propre, moderne, bien documentée.",
    name: "Yannick Adjovi", role: "CTO, ZemGo", flag: "bj", city: "Cotonou",
  },
  {
    quote: "En tant que freelance, je crée un lien de paiement, je l'envoie sur WhatsApp, et je suis payée en 3 minutes. Rien de plus simple.",
    name: "Fatou Ndiaye", role: "Designer indépendante", flag: "sn", city: "Dakar",
  },
];
const Testimonials = () => (
  <section className="py-24 md:py-32 bg-white">
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="text-center max-w-2xl mx-auto">
        <Eyebrow>Ils nous font confiance</Eyebrow>
        <h2 className="mt-4 text-4xl md:text-5xl font-semibold text-navy tracking-tight">
          Des marchands africains, <span className="text-primary">nos meilleurs ambassadeurs.</span>
        </h2>
      </div>
      <div className="mt-14 grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-3xl border border-border bg-gradient-to-b from-white to-[#F8FAFF] p-8 shadow-soft"
          >
            <div className="flex gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
            </div>
            <blockquote className="mt-5 text-navy text-[15px] leading-relaxed">« {t.quote} »</blockquote>
            <figcaption className="mt-6 pt-5 border-t border-border">
              <div className="text-sm font-semibold text-navy">{t.name}</div>
              <div className="text-xs text-navy/55 mt-0.5 flex items-center gap-1.5">{t.role} · <Flag code={t.flag} size={11} /> {t.city}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

/* ---------- API / Code section ---------- */
const codeSnippet = `# Encaisser via Mobile Money — un simple POST
curl -X POST https://api.dola-pay.com/v1/charges \\
  -H "Authorization: Bearer $DOLA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "XOF",
    "channel": "orange_money",
    "customer": { "phone": "+2250700000000" },
    "webhook": "https://mon-shop.com/hooks/dola"
  }'`;

const Developers = () => (
  <section className="relative py-16 sm:py-24 md:py-32 bg-navy text-white overflow-hidden">
    <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/40 blur-3xl" />
    <div className="relative mx-auto max-w-7xl px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-electric-glow/80 mb-2">
            <span className="h-px w-6 bg-electric-glow/40"></span>
            <Code2 className="h-3.5 w-3.5" /> Pour les développeurs
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            Une API que <br />
            <span className="bg-gradient-to-r from-white to-electric-glow bg-clip-text text-transparent">vos devs vont aimer.</span>
          </h2>
          <p className="mt-5 text-lg text-white/60 max-w-lg">
            RESTful, JSON propre, webhooks signés, SDK dans 4 langages, sandbox illimité. Du "hello world" à votre première transaction en moins de 10 minutes.
          </p>
          <div className="mt-8 space-y-3">
            {[
              "Webhooks temps réel avec retry exponentiel",
              "SDK Node.js, Python, PHP, Go",
              "Sandbox complet + faux opérateurs pour tests",
              "Documentation OpenAPI 3 générée automatiquement",
            ].map((line) => (
              <div key={line} className="flex items-start gap-3 text-white/80">
                <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-electric-glow" />
                </div>
                {line}
              </div>
            ))}
          </div>
          <Button asChild size="lg" className="mt-8 rounded-xl bg-white text-navy hover:bg-white/90">
            <Link to="/developers/api" className="flex items-center gap-2">Explorer la doc <ArrowUpRight className="h-4 w-4" /></Link>
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative mt-4 lg:mt-0 pb-16 sm:pb-20">
          <div className="rounded-2xl bg-[#050B24] border border-white/10 overflow-hidden shadow-2xl max-w-full">
            <div className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-white/[0.02]">
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400/60" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-400/60" />
              <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-400/60" />
              <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs text-white/40 font-mono">charge.sh</span>
            </div>
            <pre className="p-3 sm:p-6 text-[11px] sm:text-[13px] leading-relaxed font-mono text-white/80 overflow-x-auto max-w-full">
              <code className="block min-w-0">
                {codeSnippet.split("\n").map((line, i) => {
                  const escape = (s: string) =>
                    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                  const highlight = (l: string) => {
                    const safe = escape(l);
                    return safe
                      .replace(/(#.*)$/g, "<span style='color:#ffffff4d'>$1</span>")
                      .replace(/\b(curl|POST|GET|Bearer)\b/g, "<span style='color:#7BA7FF'>$1</span>")
                      .replace(/(-X|-H|-d)\b/g, "<span style='color:#C792EA'>$1</span>")
                      .replace(/(&quot;[^&]*?&quot;)/g, "<span style='color:#7DFFB3'>$1</span>")
                      .replace(/\b(\d+)\b/g, "<span style='color:#FFB86C'>$1</span>");
                  };
                  return (
                    <div key={i} className="flex whitespace-pre">
                      <span className="text-white/20 w-5 sm:w-6 shrink-0 select-none">{i + 1}</span>
                      <span dangerouslySetInnerHTML={{ __html: highlight(line) || "&nbsp;" }} />
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
          <div className="absolute bottom-0 right-2 sm:-bottom-6 sm:-right-6 rounded-2xl bg-white text-navy p-3 sm:p-4 shadow-2xl border border-border flex items-center gap-2.5 sm:gap-3 max-w-[calc(100%-1rem)]">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] sm:text-xs text-navy/50">Webhook reçu</div>
              <div className="text-xs sm:text-sm font-semibold truncate">charge.succeeded · 1,4 s</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ---------- Coverage ---------- */
const countries = [
  { name: "Côte d'Ivoire", flag: "ci" }, { name: "Sénégal", flag: "sn" },
  { name: "Mali", flag: "ml" }, { name: "Burkina Faso", flag: "bf" },
  { name: "Bénin", flag: "bj" }, { name: "Togo", flag: "tg" },
  { name: "Cameroun", flag: "cm" }, { name: "Gabon", flag: "ga" },
  { name: "Nigeria", flag: "ng" }, { name: "Ghana", flag: "gh" },
  { name: "Kenya", flag: "ke" }, { name: "RDC", flag: "cd" },
];
const Coverage = () => (
  <section className="py-24 md:py-32 bg-white">
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }}>
          <div className="relative rounded-3xl overflow-hidden bg-navy shadow-glow">
            <img src={africaNetwork} alt="Couverture Afrique" className="w-full h-auto" loading="lazy" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <Eyebrow>Couverture</Eyebrow>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold text-navy tracking-tight">
            Déployé sur <span className="text-primary">12 économies</span> africaines.
          </h2>
          <p className="mt-5 text-lg text-navy/60">
            De Dakar à Nairobi, de Lagos à Kinshasa — un seul contrat, une seule intégration, un seul dashboard.
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {countries.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 hover:border-primary/40 hover:bg-primary/5 transition-colors"
              >
                <Flag code={c.flag} size={16} />
                <span className="text-sm font-medium text-navy">{c.name}</span>
              </motion.div>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/coverage" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2 transition-all">
              Voir tous les opérateurs par pays <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ---------- Pricing preview ---------- */
const pricing = [
  { label: "Encaissement Mobile Money", price: "2%", detail: "+ frais opérateur réels", note: "Dégressif à 1,5% au-delà de 50M FCFA/mois", icon: Smartphone, highlight: true },
  { label: "Décaissement (Pay-out)", price: "1%", detail: "+ frais réseau réels", note: "Bulk illimité, API ou CSV", icon: Zap, highlight: false },
  { label: "Cartes bancaires", price: "2,5%", detail: "+ 100 FCFA / transaction", note: "Visa, Mastercard, 3DS inclus", icon: CreditCard, highlight: false },
];
const Pricing = () => (
  <section className="py-24 md:py-32 bg-gradient-to-b from-[#F5F8FF] to-white">
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto">
        <Eyebrow>Tarification transparente · Cost-plus</Eyebrow>
        <h2 className="mt-4 text-4xl md:text-5xl font-semibold text-navy tracking-tight">Un modèle. Zéro surprise.</h2>
        <p className="mt-5 text-lg text-navy/60">
          Aucun frais d'installation. Aucun abonnement. Aucune marge cachée sur les frais opérateurs — nous les répercutons à l'identique.
        </p>
      </div>
      <div className="mt-16 grid md:grid-cols-3 gap-5">
        {pricing.map((p, i) => (
          <motion.div
            key={p.label}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className={`relative rounded-3xl p-8 border transition-all ${p.highlight ? "bg-navy text-white border-navy shadow-glow" : "bg-white text-navy border-border shadow-soft hover:shadow-card"}`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-electric-glow px-3 py-1 text-xs font-semibold text-navy uppercase tracking-wide">
                Le plus populaire
              </span>
            )}
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${p.highlight ? "bg-white/10" : "bg-primary/10"}`}>
              <p.icon className={`h-6 w-6 ${p.highlight ? "text-electric-glow" : "text-primary"}`} />
            </div>
            <div className={`mt-5 text-sm ${p.highlight ? "text-white/60" : "text-navy/60"}`}>{p.label}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-semibold tracking-tight">{p.price}</span>
              <span className={`text-sm ${p.highlight ? "text-white/60" : "text-navy/50"}`}>{p.detail}</span>
            </div>
            <div className={`mt-4 pt-4 border-t text-sm ${p.highlight ? "border-white/10 text-white/70" : "border-border text-navy/60"}`}>
              {p.note}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-xl bg-primary hover:bg-primary/90">
          <Link to="/pricing">Voir la grille complète <ArrowRight className="h-4 w-4 ml-1" /></Link>
        </Button>
        <Button asChild variant="outline" className="rounded-xl border-navy/15 text-navy hover:bg-navy/5">
          <Link to="/contact">Parler à un expert</Link>
        </Button>
      </div>
    </div>
  </section>
);

/* ---------- CTA ---------- */
const CTA = () => (
  <section className="py-24 md:py-32 bg-white">
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-navy px-8 py-16 md:px-16 md:py-24 text-center">
        <div className="absolute inset-0 opacity-40">
          <img src={africaNetwork} alt="" className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/70 to-navy" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-primary/40 blur-3xl" />
        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-semibold text-white tracking-tight max-w-3xl mx-auto"
          >
            Prêt à encaisser <br />
            <span className="bg-gradient-to-r from-white to-electric-glow bg-clip-text text-transparent">partout en Afrique ?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-lg text-white/70 max-w-xl mx-auto"
          >
            Créez un compte gratuitement en 2 minutes. Aucune carte requise. Passez en production quand vous êtes prêt.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center"
          >
            <Button asChild size="lg" className="h-12 px-8 rounded-xl bg-white text-navy hover:bg-white/90 text-base">
              <Link to="/auth/sign-up" className="flex items-center gap-2">Créer un compte gratuit <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-xl bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white text-base">
              <Link to="/contact">Parler à un expert</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------- Page ---------- */
const Home = () => (
  <PageShell
    title="DolaPay — L'infrastructure de paiement qui propulse l'Afrique"
    description="Mobile Money, cartes bancaires, payouts instantanés et liens no-code unifiés derrière une seule API. Déployé sur 12 économies africaines."
    canonicalUrl="/"
  >
    <div>

      <Hero />
      <Ticker />
      <Features />
      <UseCases />
      <Compare />
      <Reliability />
      <Testimonials />
      <Developers />
      <Coverage />
      <Pricing />
      <CTA />
    </div>
  </PageShell>
);



