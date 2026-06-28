import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Check, LinkIcon, FileText, Zap, ShieldCheck, MessageCircle } from "lucide-react";
import phoneHero from "@/assets/phone-hero.png.asset.json";

export const Route = createFileRoute("/products/payment-links")({
  head: () => ({
    meta: [
      { title: "Liens de paiement — Encaisser sans code | DolaPay" },
      { name: "description", content: "Encaissez sans site web. Partagez un lien DolaPay sur WhatsApp, SMS ou e-mail et recevez Mobile Money ou cartes instantanément." },
      { property: "og:title", content: "Liens de paiement — DolaPay" },
      { property: "og:description", content: "Partagez un lien. Encaissez. Sans une ligne de code." },
    ],
  }),
  component: PaymentLinksPage,
});

const BENEFITS = [
  { icon: Zap, title: "Encaissez sans site web", desc: "Créez une page de paiement brandée en 60 secondes. Pas de développeur, pas d'hébergement, pas de prise de tête." },
  { icon: FileText, title: "Facturation automatisée", desc: "Liens récurrents, liens expirants et reçus PDF générés automatiquement et envoyés à vos clients." },
  { icon: ShieldCheck, title: "Sécurité bancaire", desc: "Chaque lien est protégé PCI-DSS avec scoring de fraude intégré sur chaque transaction." },
  { icon: MessageCircle, title: "Partagez partout", desc: "WhatsApp, SMS, DM Instagram, e-mail — vos clients paient sur le canal qu'ils utilisent déjà." },
];

function PaymentLinksPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-44">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium backdrop-blur">
              <LinkIcon className="h-3.5 w-3.5 text-primary" /> Liens de paiement sans code
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              <span className="text-foreground">Partagez un lien.</span><br />
              <span className="text-gradient">Encaissez instantanément.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Pas de site, pas de code, pas d'attente. Générez un lien de paiement en quelques secondes et commencez à recevoir Mobile Money et cartes partout en Afrique.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth/sign-up" className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02]">
                Créer votre premier lien <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/company/contact" className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent">Réserver une démo</Link>
            </div>
            <ul className="mt-10 space-y-2 text-sm text-muted-foreground">
              {["Aucun frais d'installation", "Aucun minimum mensuel", "Encaissement instantané sur votre wallet"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" />{t}</li>
              ))}
            </ul>
          </div>

          <PhoneMock />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Avantages</div>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Pensé pour les entreprises sans équipe tech.</h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <div key={b.title} className="group rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px]">
      {/* Ambient glow */}
      <div className="absolute -inset-10 sm:-inset-16 -z-10 rounded-full bg-primary/30 blur-3xl" />
      <div className="absolute -inset-16 sm:-inset-24 -z-10 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Floating badges */}
      <div className="absolute -left-2 top-10 z-20 hidden rounded-2xl border border-border bg-card/90 px-3 py-2 shadow-elegant backdrop-blur-md sm:flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/15 text-emerald-500">
          <Check className="h-4 w-4" />
        </div>
        <div className="text-[11px] leading-tight">
          <div className="font-bold text-foreground">Paiement reçu</div>
          <div className="text-muted-foreground">+ 25 000 XOF</div>
        </div>
      </div>
      <div className="absolute -right-2 bottom-16 z-20 hidden rounded-2xl border border-border bg-card/90 px-3 py-2 shadow-elegant backdrop-blur-md sm:flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary">
          <LinkIcon className="h-3.5 w-3.5" />
        </div>
        <div className="text-[11px] leading-tight">
          <div className="font-bold text-foreground">dolapay.link/abc</div>
          <div className="text-muted-foreground">Lien partagé</div>
        </div>
      </div>

      <div className="relative">
        <img
          src={phoneHero.url}
          alt="Application DolaPay sur mobile"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="relative z-10 w-full select-none pointer-events-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
        />
        <div
          className="absolute inset-0 z-20"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}

