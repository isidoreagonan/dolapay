import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Send, Zap, Globe2, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/products/pay-out")({
  head: () => ({
    meta: [
      { title: "Décaissements (Pay-out) — DolaPay" },
      { name: "description", content: "Décaissements bulk instantanés via REST API sur 12 économies. 1% + Réseau, wallet-to-wallet gratuit." },
      { property: "og:title", content: "Décaissements (Pay-out) — DolaPay" },
      { property: "og:description", content: "Décaissements bulk instantanés via REST API sur 12 économies. 1% + Réseau, wallet-to-wallet gratuit." },
    ],
  }),
  component: PayOutPage,
});

const CODE = `// Bulk payout vers 250 destinataires en une requête
await fetch("https://api.dola-pay.com/v1/payouts/batch", {
  method: "POST",
  headers: { "Authorization": "Bearer sk_live_***" },
  body: JSON.stringify({
    currency: "XOF",
    destinations: [
      { network: "mtn_bj", phone: "+22990000000", amount: 25000 },
      { network: "orange_ci", phone: "+22507000000", amount: 18000 },
      { network: "mpesa_ke", phone: "+254700000000", amount: 5000 },
      // ... jusqu'à 5 000 lignes par batch
    ],
    // 1% DolaPay + frais réseau réels — wallet→wallet = 0%
  }),
});`;

function PayOutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pt-28 pb-20 sm:pt-32">
        <section>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
            <Send className="h-3 w-3" /> Décaissements (Pay-out)
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-foreground">Décaissez en bulk à </span>
            <span className="text-gradient">1% + Réseau</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            REST API unique pour pousser des paiements instantanés vers Mobile Money et comptes bancaires sur 12 économies africaines. Wallet-to-wallet DolaPay : 0%, instantané.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/auth/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform">
              Démarrer <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/developers/api" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent">
              Documentation API
            </Link>
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          <Feature icon={Zap} title="Instantané" desc="Settlement sous 30 secondes vers MNO et comptes bancaires." />
          <Feature icon={Globe2} title="12 économies" desc="MTN, Orange, Moov, M-Pesa, Airtel, Vodacom — un seul endpoint." />
          <Feature icon={Send} title="Wallet 0%" desc="Transferts wallet-to-wallet DolaPay gratuits et instantanés." />
        </section>

        <section className="mt-14">
          <CodeBlock title="POST /v1/payouts/batch" code={CODE} />
        </section>

        <section className="mt-14 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Grille décaissements transparente</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Row label="Mobile Money & banque" value="1,0% + Réseau" />
            <Row label="Wallet-to-wallet DolaPay" value="0% Gratuit" highlight />
            <Row label="Enterprise (sur devis)" value="< 1% + Réseau" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: typeof Send; title: string; desc: string }) {
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

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-background"}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-2xl font-bold text-foreground">{value}</div>
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
