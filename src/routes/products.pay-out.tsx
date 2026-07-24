import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/products/pay-out")({ component: PayOut });
import { Zap, FileSpreadsheet, Clock, ShieldCheck, RefreshCcw, Users } from "lucide-react";
import ProductPage from "@/components/site/product-page";
import PricingMatrix from "@/components/site/pricing-matrix";

const PayOut = () => (
  <ProductPage
    seoTitle="Décaissements (Pay-out) — DolaPay"
    seoDescription="Envoyez de l'argent instantanément vers des milliers de portefeuilles Mobile Money et comptes bancaires en Afrique. Bulk API ou CSV."
    canonicalUrl="/products/pay-out"
    eyebrow="Produit · Pay-out"
    title={<>Décaissez en masse, <span className="text-primary">instantanément.</span></>}
    description="Paie livreurs, remboursements clients, rémunération de freelances : envoyez des milliers de payouts en un seul appel API ou upload CSV."
    bullets={[
      "Payouts instantanés vers MTN, Orange, Wave, Moov, M-Pesa",
      "Bulk illimité — jusqu'à 10 000 payouts par requête",
      "API ou upload CSV depuis le dashboard",
      "Commission 1% + frais réseau réels",
    ]}
    features={[
      { icon: Zap, title: "Instantané 24/7", desc: "Payout moyen en 3,2 secondes. Fonctionne week-ends et jours fériés." },
      { icon: FileSpreadsheet, title: "Bulk CSV", desc: "Importez un CSV, on s'occupe du reste. Idéal pour la paie récurrente." },
      { icon: RefreshCcw, title: "Retry intelligent", desc: "Retry automatique sur échec transitoire, avec back-off exponentiel." },
      { icon: Users, title: "Reçus automatiques", desc: "Le bénéficiaire reçoit un SMS de confirmation avec référence traçable." },
      { icon: Clock, title: "Programmation", desc: "Planifiez vos décaissements — paie du 25, remboursements en batch, etc." },
      { icon: ShieldCheck, title: "Validation à 2 facteurs", desc: "Approbation multi-utilisateurs pour les payouts au-dessus d'un seuil." },
    ]}
  >
    <PricingMatrix
      mode="payout"
      title="Frais de décaissement par pays et opérateur"
      subtitle="Tarifs tout inclus : frais réseau + commission DolaPay. Bulk et instantané au même prix."
    />
  </ProductPage>
);



