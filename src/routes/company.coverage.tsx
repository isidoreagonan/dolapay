import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/company/coverage")({ component: CoveragePage });
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Globe2, Zap } from "lucide-react";
import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import Flag from "@/components/ui/flag";

const countries = [
  { name: "Bénin", flag: "🇧🇯", zone: "UEMOA", ops: ["MTN", "Moov"] },
  { name: "Burkina Faso", flag: "🇧🇫", zone: "UEMOA", ops: ["Orange", "Moov"] },
  { name: "Côte d'Ivoire", flag: "🇨🇮", zone: "UEMOA", ops: ["MTN", "Orange"] },
  { name: "Sénégal", flag: "🇸🇳", zone: "UEMOA", ops: ["Orange", "Free"] },
  { name: "Cameroun", flag: "🇨🇲", zone: "CEMAC", ops: ["MTN"] },
  { name: "Congo", flag: "🇨🇬", zone: "CEMAC", ops: ["MTN", "Airtel"] },
  { name: "Gabon", flag: "🇬🇦", zone: "CEMAC", ops: ["Airtel"] },
  { name: "RDC", flag: "🇨🇩", zone: "Afrique Centrale", ops: ["Orange", "Airtel", "Vodacom M-Pesa"] },
  { name: "Kenya", flag: "🇰🇪", zone: "Afrique de l'Est", ops: ["M-Pesa"] },
  { name: "Rwanda", flag: "🇷🇼", zone: "Afrique de l'Est", ops: ["MTN", "Airtel"] },
  { name: "Ouganda", flag: "🇺🇬", zone: "Afrique de l'Est", ops: ["MTN", "Airtel"] },
  { name: "Zambie", flag: "🇿🇲", zone: "Afrique Australe", ops: ["MTN", "Zamtel"] },
  { name: "Sierra Leone", flag: "🇸🇱", zone: "Afrique de l'Ouest", ops: ["Orange"] },
];

const CoveragePage = () => (
  <PageShell
    title="Couverture DolaPay — 12 économies africaines, tous les opérateurs"
    description="UEMOA, CEMAC, Afrique de l'Est et Centrale. MTN, Orange, Wave, Moov, Airtel, M-Pesa — une seule intégration, tous les opérateurs Mobile Money majeurs."
    canonicalUrl="/coverage"
  >
    <PageHero
      eyebrow="Couverture · 12 marchés live"
      title={<>Une intégration. <span className="text-primary">Tout un continent.</span></>}
      description="DolaPay est déployé dans les zones UEMOA, CEMAC, Afrique de l'Est et Centrale — avec tous les opérateurs Mobile Money majeurs pré-branchés."
    />

    <section className="pb-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {countries.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-border bg-white p-6 hover:shadow-card hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <Flag code={c.flag} size={32} />
                <div>
                  <div className="text-lg font-semibold text-navy">{c.name}</div>
                  <div className="text-xs text-navy/50">{c.zone}</div>
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-border">
                <div className="text-xs uppercase tracking-wider text-navy/40 mb-2">Opérateurs</div>
                <div className="flex flex-wrap gap-1.5">
                  {c.ops.map((o) => (
                    <span key={o} className="text-xs bg-primary/5 text-primary rounded-full px-2.5 py-1">
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 bg-[#F5F8FF]">
      <div className="mx-auto max-w-6xl px-4 md:px-6 grid md:grid-cols-3 gap-5">
        {[
          { icon: Globe2, title: "Un contrat, tout un continent", desc: "Signez une fois, vendez dans 12 pays. Nous nous occupons des conformités locales." },
          { icon: Zap, title: "Règlements multi-devises", desc: "XOF, XAF, NGN, GHS, KES, CDF, USD. Consolidation dans la devise de votre choix." },
          { icon: ShieldCheck, title: "Conformité UEMOA/CEMAC", desc: "PCI-DSS niveau 1, KYC/AML intégré, licences bancaires partenaires." },
        ].map((f) => (
          <div key={f.title} className="rounded-3xl bg-white border border-border p-6 shadow-soft">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <f.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-4 text-lg font-semibold text-navy">{f.title}</div>
            <div className="mt-1.5 text-sm text-navy/60 leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="py-20 text-center">
      <div className="mx-auto max-w-2xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-navy tracking-tight">
          Votre marché n'est pas listé ?
        </h2>
        <p className="mt-4 text-navy/60">
          Nous ajoutons 1 à 2 pays par trimestre. Dites-nous où vous voulez vendre — nous pouvons souvent activer un pays sur demande en 4 à 8 semaines.
        </p>
        <Button asChild size="lg" className="mt-8 rounded-xl bg-primary hover:bg-primary/90">
          <Link to="/contact" className="flex items-center gap-2">Demander un pays <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    </section>
  </PageShell>
);



