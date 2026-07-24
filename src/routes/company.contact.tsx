import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, MapPin, Building2, Briefcase, MessagesSquare } from "lucide-react";
import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";

const ContactPage = () => (
  <PageShell
    title="Contactez DolaPay — Ventes et Partenariats"
    description="Prenez contact avec nos équipes commerciales, nos experts en intégration, ou venez nous rencontrer à notre siège."
    canonicalUrl="/company/contact"
  >
    <PageHero
      eyebrow="Entreprise · Contact"
      title={<>Parlez à notre <span className="text-primary">équipe</span>.</>}
      description="Que vous soyez une grande entreprise cherchant des tarifs sur-mesure ou un partenaire potentiel, nous sommes à votre écoute."
    />

    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-6">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Contact info side */}
        <div className="space-y-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-navy">Équipes & Départements</h2>
            <div className="mt-8 space-y-8">
              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">Équipe Commerciale (Sales)</h3>
                  <p className="mt-1 text-navy/60 text-sm leading-relaxed">Pour les marchands traitant de gros volumes nécessitant une tarification sur-mesure.</p>
                  <a href="mailto:sales@dolapay.io" className="mt-2 inline-block text-primary font-medium hover:underline text-sm">sales@dolapay.io</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <MessagesSquare className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">Partenariats & Presse</h3>
                  <p className="mt-1 text-navy/60 text-sm leading-relaxed">Pour les banques, opérateurs télécoms, et demandes journalistiques.</p>
                  <a href="mailto:partners@dolapay.io" className="mt-2 inline-block text-primary font-medium hover:underline text-sm">partners@dolapay.io</a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">Support Marchand</h3>
                  <p className="mt-1 text-navy/60 text-sm leading-relaxed">Besoin d'aide technique ou financière sur votre compte existant ?</p>
                  <a href="mailto:support@dolapay.io" className="mt-2 inline-block text-primary font-medium hover:underline text-sm">support@dolapay.io</a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="pt-10 border-t border-border"
          >
            <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
              <Building2 className="h-6 w-6 text-navy/40" /> Siège Social
            </h2>
            <div className="mt-6 bg-[#F5F8FF] rounded-3xl p-8 border border-blue-500/10">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-navy text-lg">DOLAPO ECOM LLC</p>
                  <p className="mt-2 text-navy/70 leading-relaxed">
                    1209 MOUNTAIN RD PL NE STE R<br />
                    ALBUQUERQUE, NM 87110<br />
                    États-Unis
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Form side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl border border-border shadow-soft p-8"
        >
          <h3 className="text-2xl font-semibold text-navy mb-6">Envoyez-nous un message</h3>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-navy">Prénom</label>
                <input type="text" className="w-full h-11 rounded-xl border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-navy">Nom</label>
                <input type="text" className="w-full h-11 rounded-xl border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Doe" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Email professionnel</label>
              <input type="email" className="w-full h-11 rounded-xl border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="john@entreprise.com" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Sujet</label>
              <select className="w-full h-11 rounded-xl border border-border px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white">
                <option>Demande de tarification</option>
                <option>Devenir partenaire</option>
                <option>Assistance technique</option>
                <option>Autre</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-navy">Message</label>
              <textarea rows={5} className="w-full rounded-xl border border-border p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
            </div>

            <Button type="submit" size="lg" className="w-full rounded-xl bg-primary hover:bg-primary/90 text-white">
              Envoyer le message
            </Button>
            <p className="text-xs text-navy/40 text-center mt-4">
              En soumettant ce formulaire, vous acceptez notre politique de confidentialité.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  </PageShell>
);

export default ContactPage;

export const Route = createFileRoute("/company/contact")({ component: ContactPage });
