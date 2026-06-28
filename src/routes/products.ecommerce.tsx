import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Check, ShoppingBag, TrendingUp, ShieldCheck, Globe2, CreditCard, Sparkles } from "lucide-react";

export const Route = createFileRoute("/products/ecommerce")({
  head: () => ({
    meta: [
      { title: "Checkout e-commerce — DolaPay" },
      { name: "description", content: "Un checkout sécurisé et à forte conversion pour les marchands africains, qu'ils vendent des produits physiques ou numériques. En intégration ou hébergé." },
      { property: "og:title", content: "E-commerce — DolaPay" },
      { property: "og:description", content: "Convertissez plus d'acheteurs avec un checkout conçu pour l'Afrique." },
    ],
  }),
  component: EcommercePage,
});

const PERKS = [
  { icon: TrendingUp, title: "+38% de conversion", desc: "Les moyens de paiement locaux et les parcours Mobile Money en un clic font monter le taux de complétion." },
  { icon: ShieldCheck, title: "Sécurisé par défaut", desc: "3-D Secure 2, tokenisation et scoring de fraude en temps réel sur chaque commande." },
  { icon: Globe2, title: "Multi-devises", desc: "Affichez, encaissez et reversez en XOF, NGN, GHS, USD — où que soit votre acheteur." },
  { icon: CreditCard, title: "Intégré ou hébergé", desc: "Embarquez notre widget React ou redirigez vers notre checkout hébergé. Extensions Shopify & WooCommerce." },
];

function EcommercePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
        <div className="absolute inset-0 bg-grid opacity-60" />
        <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[420px] w-[420px] rounded-full bg-primary-glow/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium backdrop-blur">
              <ShoppingBag className="h-3.5 w-3.5 text-primary" /> Gateway e-commerce
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              <span className="text-foreground">Un checkout que vos</span><br />
              <span className="text-gradient">acheteurs ne lâcheront pas.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Que vous vendiez des sneakers, du logiciel ou des services, le checkout DolaPay est conçu pour convertir les acheteurs africains avec les moyens de paiement qu'ils utilisent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth/sign-up" className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02]">
                Commencer à vendre <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/developers/api" className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold hover:bg-accent">Voir l'intégration</Link>
            </div>
          </div>
          <CheckoutMock />
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Pourquoi les marchands choisissent DolaPay</div>
            <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Conçu pour convertir. Pensé pour scaler.</h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((p) => (
              <div key={p.title} className="rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-foreground">{p.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function CheckoutMock() {
  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div className="absolute -inset-8 rounded-[2rem] bg-primary/20 blur-3xl" />
      <div className="relative rounded-2xl border border-border bg-card p-6 shadow-elegant">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"><ShoppingBag className="h-4 w-4" /></div>
            <span className="font-display font-bold">Paiement sécurisé</span>
          </div>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Sneakers AF1</span>
            <span className="font-bold">45 000 XOF</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Livraison</span>
            <span className="font-bold">Offerte</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3 text-base">
            <span className="font-display font-bold">Total</span>
            <span className="font-display text-xl font-black text-primary">45 000 XOF</span>
          </div>
        </div>
        <div className="mt-5 space-y-2">
          {["Mobile Money", "Visa / Mastercard", "Virement bancaire"].map((m, i) => (
            <div key={m} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${i === 0 ? "border-primary bg-primary/5" : "border-border"}`}>
              <div className={`grid h-8 w-8 place-items-center rounded-md ${i === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-foreground"}`}><CreditCard className="h-4 w-4" /></div>
              <span className="font-medium">{m}</span>
              {i === 0 && <Check className="ml-auto h-4 w-4 text-primary" />}
            </div>
          ))}
        </div>
        <button className="mt-5 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow">Payer 45 000 XOF</button>
      </div>
    </div>
  );
}
