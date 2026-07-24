import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, MessageSquare, ArrowRight } from "lucide-react";
import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Intégration & Technique",
    questions: [
      {
        q: "Combien de temps prend l'intégration de l'API DolaPay ?",
        a: "En moyenne, un développeur expérimenté peut intégrer notre API de paiement en moins de 2 heures. Nous fournissons des SDKs pour NodeJS et PHP, ainsi que des plugins CMS (Shopify, WooCommerce) prêts à l'emploi qui ne nécessitent aucune ligne de code."
      },
      {
        q: "L'API DolaPay propose-t-elle un environnement de test (Sandbox) ?",
        a: "Absolument. Dès la création de votre compte, vous avez accès à un environnement Sandbox gratuit pour tester vos intégrations de paiements et de reversements avec de faux numéros de téléphone fournis dans notre documentation."
      },
      {
        q: "Puis-je personnaliser la page de paiement générée par DolaPay ?",
        a: "Oui. Vous pouvez modifier les couleurs, ajouter votre logo, et rediriger automatiquement l'utilisateur vers votre site après un paiement réussi ou échoué."
      }
    ]
  },
  {
    category: "Paiements & Décaissements (Payouts)",
    questions: [
      {
        q: "Quels sont les délais pour les reversements (Payouts) ?",
        a: "Les reversements via notre API Bulk Payout sont quasi-instantanés. Ils prennent généralement moins de 3 secondes pour atteindre le compte Mobile Money du bénéficiaire, peu importe l'opérateur (MTN, Orange, Moov, Airtel...)."
      },
      {
        q: "Comment gérez-vous les taux de change lors des transactions transfrontalières ?",
        a: "Si vous acceptez des paiements dans une devise (ex: KES) et que vous encaissez dans une autre (ex: XOF), nous appliquons le taux de change du marché avec une marge de conversion transparente affichée sur votre tableau de bord."
      },
      {
        q: "Y a-t-il une limite sur le montant des paiements ?",
        a: "Les limites dépendent de l'opérateur Mobile Money du client (généralement entre 1.000.000 et 2.000.000 FCFA par transaction). Côté DolaPay, nous n'imposons aucune limite technique."
      }
    ]
  },
  {
    category: "Tarification & Facturation",
    questions: [
      {
        q: "Y a-t-il des frais d'installation ou des abonnements mensuels ?",
        a: "Non, l'inscription est 100% gratuite et il n'y a pas d'abonnement. Vous ne payez que des frais par transaction réussie. Les paiements échoués ne vous sont pas facturés."
      },
      {
        q: "Est-ce que je paie les frais opérateur en plus des frais DolaPay ?",
        a: "Notre tarification inclut déjà notre marge. Sur notre page Tarifs, les montants que vous voyez sont la somme des frais de l'opérateur et de la marge DolaPay. Aucune surprise."
      }
    ]
  }
];

function FAQPage() {
  return (
  <PageShell
    title="Foire aux questions (FAQ) — DolaPay"
    description="Trouvez des réponses rapides sur l'intégration, la tarification, et le fonctionnement des paiements et reversements DolaPay."
    canonicalUrl="/resources/faq"
  >
    <PageHero
      eyebrow="Ressources · FAQ"
      title={<>Questions <span className="text-primary">Fréquentes</span>.</>}
      description="Tout ce que vous devez savoir sur DolaPay, de l'intégration technique à la facturation."
    />

    <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 md:px-6">
      <div className="space-y-16">
        {faqs.map((category, idx) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-navy tracking-tight mb-6">
              {category.category}
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {category.questions.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${idx}-${i}`}
                  className="bg-white border border-border rounded-2xl px-6 data-[state=open]:shadow-soft transition-all"
                >
                  <AccordionTrigger className="text-left font-medium text-navy hover:text-primary py-5 hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-navy/60 leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="py-20 md:py-28 bg-[#F5F8FF]">
      <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
          <MessageSquare className="h-8 w-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-navy tracking-tight">
          Vous ne trouvez pas votre réponse ?
        </h2>
        <p className="mt-4 text-navy/60 text-lg">
          Notre équipe d'experts est là pour vous aider à résoudre le moindre problème.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-xl bg-primary hover:bg-primary/90">
            <Link to="/resources/support">Contacter le support</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-xl border-navy/15 text-navy hover:bg-navy/5">
            <Link to="/developers/api">Consulter la doc API</Link>
          </Button>
        </div>
      </div>
    </section>
  </PageShell>
);

export default FAQPage;

export const Route = createFileRoute("/resources/faq")({ component: FAQPage }  );
}
