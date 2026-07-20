import { createFileRoute, Link } from "@tanstack/react-router";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Briefcase, Rocket, CheckCircle2 } from "lucide-react";
import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";

const cases = [
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: "E-commerce & Retail",
    subtitle: "Boostez vos conversions à la caisse.",
    description: "Intégrez DolaPay sur votre boutique en ligne. Que vous utilisiez Shopify, WooCommerce, ou du sur-mesure, offrez à vos clients la possibilité de payer avec le moyen qu'ils préfèrent.",
    benefits: [
      "Plugins CMS prêts à l'emploi (Shopify, WooCommerce, PrestaShop)",
      "Réconciliation automatique des commandes",
      "Expérience de paiement fluide et sécurisée (PCI-DSS)",
      "Zéro redirection : paiement natif sur votre site"
    ],
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "freelance",
    icon: Briefcase,
    title: "Freelances & Agences",
    subtitle: "Faites-vous payer instantanément.",
    description: "Fini les relances et les virements qui prennent des jours. Créez des liens de paiement en un clic et envoyez-les directement avec vos factures via WhatsApp ou e-mail.",
    benefits: [
      "Création de liens de paiement sans code",
      "Partage direct sur WhatsApp et réseaux sociaux",
      "Paiements reçus en moins de 3 secondes",
      "Notifications instantanées lors du règlement"
    ],
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "saas",
    icon: Rocket,
    title: "Startups & SaaS",
    subtitle: "Une infrastructure conçue pour l'échelle.",
    description: "Bâtissez des modèles d'affaires complexes avec l'API la plus robuste d'Afrique. Gérez des abonnements, des marketplaces, et reversez des fonds automatiquement à vos vendeurs.",
    benefits: [
      "API RESTful avec webhooks en temps réel",
      "Paiements récurrents et abonnements",
      "Bulk Payouts : payez des centaines de vendeurs d'un coup",
      "Tableau de bord complet pour vos équipes financières"
    ],
    color: "text-primary",
    bg: "bg-primary/10",
  }
];

const UseCases = () => (
  <PageShell
    title="Cas d'usage — DolaPay"
    description="Découvrez comment l'infrastructure DolaPay propulse l'e-commerce, les startups, les freelances et les grandes entreprises en Afrique."
    canonicalUrl="/resources/use-cases"
  >
    <PageHero
      eyebrow="Ressources · Cas d'usage"
      title={<>Conçu pour <span className="text-primary">chaque industrie</span>.</>}
      description="De la petite boutique en ligne à la marketplace continentale, DolaPay fournit les outils exacts dont vous avez besoin pour accepter des paiements et reverser des fonds à l'échelle."
    />

    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-24">
        {cases.map((c, i) => (
          <div key={c.id} className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${i % 2 !== 0 ? "lg:flex-row-reverse" : ""}`}>
            <motion.div
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={i % 2 !== 0 ? "lg:order-2" : ""}
            >
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${c.bg} ${c.color} mb-6`}>
                <c.icon className="h-8 w-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy tracking-tight">{c.title}</h2>
              <p className="mt-3 text-xl font-medium text-navy/80">{c.subtitle}</p>
              <p className="mt-4 text-lg text-navy/60 leading-relaxed">{c.description}</p>
              
              <ul className="mt-8 space-y-4">
                {c.benefits.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-3">
                    <CheckCircle2 className={`h-6 w-6 shrink-0 ${c.color}`} />
                    <span className="text-navy/80 font-medium">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Button asChild size="lg" className="rounded-xl bg-primary shadow-glow hover:bg-primary/90 text-white">
                  <Link to="/auth/sign-up">Commencer avec ce modèle <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className={`relative rounded-[2rem] bg-slate-50 border border-border p-8 md:p-12 shadow-2xl shadow-navy/5 ${i % 2 !== 0 ? "lg:order-1" : ""}`}
            >
              {/* Abstract Visual Representation */}
              <div className="absolute inset-0 bg-grid opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
              <div className="relative aspect-square md:aspect-[4/3] rounded-2xl bg-white border border-border shadow-soft flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="text-center p-6 relative z-10">
                  <div className={`mx-auto h-20 w-20 rounded-full ${c.bg} flex items-center justify-center animate-pulse`}>
                    <c.icon className={`h-10 w-10 ${c.color}`} />
                  </div>
                  <div className="mt-6 font-mono text-sm text-navy/40 uppercase tracking-widest">Illustration</div>
                  <div className="mt-2 text-navy font-semibold">Solution {c.title}</div>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>

    <section className="py-20 md:py-28 bg-[#F5F8FF]">
      <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-navy tracking-tight">
          Votre cas d'usage n'est pas listé ?
        </h2>
        <p className="mt-4 text-navy/60 text-lg">
          L'API DolaPay est suffisamment flexible pour s'adapter à n'importe quel modèle d'affaires. Parlons de votre projet avec un expert en intégration.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" variant="outline" className="rounded-xl border-navy border-2 text-navy font-bold hover:bg-navy hover:text-white transition-colors px-8 h-14 text-base">
            <Link to="/resources/support">Contacter l'équipe technique</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageShell>
);

export default UseCases;

export const Route = createFileRoute("/resources/use-cases")({ component: UseCases });
