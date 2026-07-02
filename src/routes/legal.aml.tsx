import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/aml")({
  head: () => ({
    meta: [
      { title: "Politique LCB-FT — DolaPay" },
      { name: "description", content: "Notre politique de lutte contre le blanchiment de capitaux et le financement du terrorisme." },
    ],
  }),
  component: () => (
    <LegalLayout title="Politique LCB-FT" updated="1er juin 2026">
      <p>Dolapo ECOM LLC, éditeur de la marque DolaPay, s'engage à respecter les plus hauts standards de lutte contre le blanchiment de capitaux (« LCB ») et le financement du terrorisme (« FT »), conformément aux recommandations du GAFI et à la législation de chaque juridiction dans laquelle nous opérons.</p>
      <h2>1. Approche fondée sur les risques</h2>
      <p>Nous appliquons une approche fondée sur les risques à l'onboarding, au suivi et au reporting, avec une vigilance renforcée pour les relations à risque élevé.</p>
      <h2>2. Diligence client (KYC/KYB)</h2>
      <ul>
        <li>Vérification de l'identité de l'ensemble des marchands, bénéficiaires effectifs et dirigeants.</li>
        <li>Contrôles sur l'origine des fonds pour les relations de valeur élevée.</li>
        <li>Filtrage continu contre les listes de sanctions, PPE et médias négatifs.</li>
      </ul>
      <h2>3. Surveillance des transactions</h2>
      <p>Chaque transaction est notée en temps réel via des règles et des modèles d'apprentissage automatique. Les alertes sont examinées par notre équipe Financial Crime et transmises à la cellule de renseignement financier compétente lorsque nécessaire.</p>
      <h2>4. Déclarations de soupçon</h2>
      <p>Nous déposons des déclarations de soupçon (SAR) sans informer le client, conformément à la loi locale.</p>
      <h2>5. Formation et gouvernance</h2>
      <p>Nos collaborateurs suivent une formation annuelle obligatoire en LCB-FT. Le responsable conformité rend compte directement au conseil d'administration de l'efficacité du dispositif.</p>
      <h2>6. Contact</h2>
      <p>Demandes des autorités et régulateurs : compliance@dola-pay.com.</p>
    </LegalLayout>
  ),
});
