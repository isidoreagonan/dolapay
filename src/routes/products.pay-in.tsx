import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Wallet, ShieldCheck, Zap } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import HonestFeeSimulator from "@/components/pricing/HonestFeeSimulator";

export const Route = createFileRoute("/products/pay-in")({
  head: () => ({
    meta: [
      { title: "Encaissements (Pay-in) — DolaPay" },
      { name: "description", content: "Acceptez le Mobile Money et les cartes Visa/Mastercard sur 12 économies africaines. 2% + Opérateur, transparent." },
      { property: "og:title", content: "Encaissements (Pay-in) — DolaPay" },
      { property: "og:description", content: "Acceptez le Mobile Money et les cartes Visa/Mastercard sur 12 économies africaines. 2% + Opérateur, transparent." },
    ],
  }),
  component: PayInPage,
});

const CODE_MM = `// Initier un paiement Orange Money Burkina Faso 🇧🇫
await fetch("https://api.dola-pay.com/v1/charges", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_***",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    amount: 25000,
    currency: "XOF",
    method: "mobile_money",
    network: "orange_bf",
    customer: { phone: "+22670000000" },
    // 2% DolaPay + 1.5% Orange = 3.5% tout compris
  }),
});`;

const CODE_CARD = `// Encaisser une carte Visa via 3D-Secure
await fetch("https://api.dola-pay.com/v1/charges", {
  method: "POST",
  headers: { "Authorization": "Bearer sk_live_***" },
  body: JSON.stringify({
    amount: 50000,
    currency: "XOF",
    method: "card",
    card: { token: "tok_visa_***" },
    secure: "3ds",
    // 2.5% + 100 FCFA + interchange bancaire
  }),
});`;

function PayInPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:pt-32">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Wallet className="h-3 w-3" /> Encaissements (Pay-in)
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-foreground">Encaissez en </span>
            <span className="text-gradient">2% + Opérateur</span>.
            <span className="text-foreground"> Rien d'autre.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Mobile Money & cartes Visa/Mastercard sur 12 économies. Commission DolaPay fixe + frais réels MTN, Orange, Moov, M-Pesa, Airtel, Vodacom. Aucun markup.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/auth/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform">
              Démarrer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/company/pricing" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent">
              Grille tarifaire
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          <Feature icon={Wallet} title="2% + Opérateur" desc="Tarif unique pan-africain. 1,5% au-delà de 50M FCFA/mois." />
          <Feature icon={ShieldCheck} title="3D-Secure inclus" desc="Anti-fraude carte et challenge bancaire activés par défaut." />
          <Feature icon={Zap} title="Webhooks < 200ms" desc="Confirmation temps réel pour chaque transaction settled." />
        </section>

        <section className="mt-14 grid gap-4 lg:grid-cols-2">
          <CodeBlock title="Mobile Money · Orange Burkina 🇧🇫" code={CODE_MM} />
          <CodeBlock title="Carte Visa · 3D-Secure" code={CODE_CARD} />
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Simulez vos frais en direct</h2>
          <p className="mt-2 text-sm text-muted-foreground">Comparez instantanément face à la concurrence traditionnelle.</p>
          <div className="mt-6">
            <HonestFeeSimulator />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: typeof Wallet; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 font-semibold text-foreground">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
    </div>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-zinc-950 text-zinc-100 shadow-elegant">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">{title}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
          <Check className="h-3 w-3" /> 200 OK
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[12px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
