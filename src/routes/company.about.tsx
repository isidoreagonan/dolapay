import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/company/about")({ component: About });
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Compass, HandCoins, ShieldCheck, Users, Globe2 } from "lucide-react";
import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";

const values = [
  { icon: HandCoins, title: "Transparence radicale", desc: "Prix affichés en clair, frais opérateur répercutés à l'identique, aucune marge cachée. Toujours." },
  { icon: Compass, title: "Bâti pour l'Afrique", desc: "Nous vivons ici. Chaque décision produit tient compte de la réalité du terrain — connexion, opérateurs, devises." },
  { icon: ShieldCheck, title: "Sécurité de niveau bancaire", desc: "PCI-DSS niveau 1, chiffrement AES-256 au repos, TLS 1.3 en transit. Vos flux méritent le meilleur." },
  { icon: Users, title: "Support humain", desc: "Une équipe qui parle votre langue, comprend votre business, et répond en 12 minutes en moyenne." },
];

const stats = [
  { kpi: "12", label: "Économies couvertes" },
  { kpi: "50+", label: "Opérateurs branchés" },
  { kpi: "99,99%", label: "Uptime API" },
  { kpi: "< 3 s", label: "Payout moyen" },
];

const About = () => (
  <PageShell
    title="À propos de DolaPay — L'infrastructure de paiement de l'Afrique"
    description="DolaPay bâtit l'infrastructure de paiement moderne pour l'Afrique : Mobile Money, cartes, payouts et API dans 12 pays. Notre mission, notre équipe."
    canonicalUrl="/company/about"
  >
    <PageHero
      eyebrow="Notre mission"
      title={<>Bâtir l'<span className="text-primary">infrastructure de paiement</span> que l'Afrique mérite.</>}
      description="DolaPay unifie Mobile Money, cartes bancaires et payouts derrière une seule API élégante — pour que chaque marchand africain puisse encaisser aussi facilement qu'un géant du web."
    />

    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <div className="text-xs uppercase tracking-wider text-primary mb-3">Notre histoire</div>
          <h2 className="text-3xl md:text-4xl font-semibold text-navy tracking-tight">
            Née de la frustration d'un checkout raté à Abidjan.
          </h2>
          <div className="mt-5 space-y-4 text-navy/70 leading-relaxed">
            <p>
              En 2023, notre fondateur perdait une vente sur trois parce que son opérateur Mobile Money n'était pas branché. Il a passé six mois à tenter d'intégrer trois PSP différents — factures opaques, APIs vieillottes, support absent.
            </p>
            <p>
              DolaPay est née de cette expérience. Une conviction simple : les entrepreneurs africains méritent une infrastructure aussi propre que Stripe, aussi complète qu'un aggregator, aussi transparente qu'une facture d'électricité.
            </p>
            <p>
              Aujourd'hui, nous propulsons des marchands dans 12 pays 🇨🇮 🇸🇳 🇲🇱 🇧🇫 🇧🇯 🇹🇬 🇨🇲 🇬🇦 🇳🇬 🇬🇭 🇰🇪 🇨🇩 — et ce n'est que le début.
            </p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-white p-6 shadow-soft">
              <div className="text-4xl font-semibold text-navy tracking-tight">{s.kpi}</div>
              <div className="mt-2 text-sm text-navy/60">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    <section className="py-16 md:py-24 bg-[#F5F8FF]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-wider text-primary mb-3">Nos valeurs</div>
          <h2 className="text-3xl md:text-4xl font-semibold text-navy tracking-tight">Ce en quoi nous croyons.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl bg-white border border-border p-6 shadow-soft"
            >
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mt-4 text-lg font-semibold text-navy">{v.title}</div>
              <div className="mt-1.5 text-sm text-navy/60 leading-relaxed">{v.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
        <Globe2 className="h-8 w-8 text-primary mx-auto" />
        <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-navy tracking-tight">
          Rejoignez la révolution du paiement africain.
        </h2>
        <p className="mt-4 text-navy/60 text-lg">
          Que vous soyez marchand, développeur ou investisseur — parlons de comment DolaPay peut vous accompagner.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl bg-primary hover:bg-primary/90">
            <Link to="/auth/sign-up" className="flex items-center gap-2">Créer un compte <ArrowRight className="h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl border-navy/15 text-navy hover:bg-navy/5">
            <Link to="/coverage">Voir la couverture</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageShell>
);



