import { createFileRoute, Link } from "@tanstack/react-router";

import { motion } from "framer-motion";
import { Mail, MessageSquare, Phone, Clock, FileText, ArrowRight, LifeBuoy } from "lucide-react";
import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";

const SupportPage = () => (
  <PageShell
    title="Support Marchand — DolaPay"
    description="Une équipe dédiée à la réussite de votre entreprise. Obtenez de l'aide technique, financière ou commerciale en quelques minutes."
    canonicalUrl="/resources/support"
  >
    <PageHero
      eyebrow="Ressources · Support"
      title={<>Nous sommes là pour <span className="text-primary">vous aider</span>.</>}
      description="Pas de robots interminables. Juste une équipe d'experts basée en Afrique, prête à résoudre vos problèmes techniques et financiers en temps record."
    />

    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Email Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-white border border-border p-8 shadow-soft flex flex-col"
          >
            <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold text-navy">Email Support</h3>
            <p className="mt-2 text-navy/60 flex-grow">Pour les requêtes complexes, l'intégration API ou les questions financières nécessitant une investigation.</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-navy/80 bg-slate-50 p-3 rounded-xl border border-border/50">
              <Clock className="h-4 w-4 text-primary" /> Réponse garantie en <span className="text-navy font-bold">&lt; 2 heures</span>
            </div>
            <Button asChild className="mt-6 w-full rounded-xl" variant="outline">
              <a href="mailto:support@dolapay.io">support@dolapay.io</a>
            </Button>
          </motion.div>

          {/* WhatsApp / Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-white border border-border p-8 shadow-soft flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">Recommandé</span>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
              <MessageSquare className="h-6 w-6 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-navy">Chat & WhatsApp</h3>
            <p className="mt-2 text-navy/60 flex-grow">L'idéal pour une question rapide, un test de paiement ou une assistance immédiate lors d'un déploiement.</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-navy/80 bg-slate-50 p-3 rounded-xl border border-border/50">
              <Clock className="h-4 w-4 text-primary" /> Réponse moyenne en <span className="text-navy font-bold">12 minutes</span>
            </div>
            <Button asChild className="mt-6 w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white border-0">
              <a href="#" onClick={(e) => e.preventDefault()}>Démarrer un chat</a>
            </Button>
          </motion.div>

          {/* Enterprise Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl bg-navy text-white p-8 shadow-glow flex flex-col"
          >
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold">Support Enterprise</h3>
            <p className="mt-2 text-white/70 flex-grow">Pour les marchands traitant plus de 50M XOF/mois. Ligne directe 24/7 avec un Account Manager dédié.</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/90 bg-white/5 p-3 rounded-xl border border-white/10">
              <LifeBuoy className="h-4 w-4 text-primary" /> <span className="font-bold">Priorité Absolue 24/7</span>
            </div>
            <Button asChild className="mt-6 w-full rounded-xl bg-primary hover:bg-primary/90 text-white border-0">
              <Link to="/contact">Contacter les ventes</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Self Service Section */}
    <section className="py-16 md:py-24 bg-[#F5F8FF]">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-semibold text-navy tracking-tight">Trouvez vos propres réponses</h2>
          <p className="mt-4 text-navy/60 text-lg">
            Notre documentation et notre centre d'aide couvrent 95% des questions courantes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link to="/docs" className="group rounded-2xl bg-white border border-border p-6 shadow-sm hover:shadow-soft transition-all flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-navy group-hover:text-primary transition-colors flex items-center gap-2">
                Documentation API <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="mt-1 text-sm text-navy/60 leading-relaxed">Guides d'intégration, référence d'API complète, webhooks et SDKs pour NodeJS et PHP.</p>
            </div>
          </Link>

          <a href="#" className="group rounded-2xl bg-white border border-border p-6 shadow-sm hover:shadow-soft transition-all flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <LifeBuoy className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-navy group-hover:text-orange-500 transition-colors flex items-center gap-2">
                Centre d'Aide (FAQ) <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="mt-1 text-sm text-navy/60 leading-relaxed">Questions sur les virements, les limites, les devises, la facturation et la gestion des litiges.</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  </PageShell>
);

export default SupportPage;

export const Route = createFileRoute("/resources/support")({ component: SupportPage });
