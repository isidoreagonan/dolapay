import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Conditions d'utilisation — DolaPay" },
      { name: "description", content: "Les conditions qui régissent votre utilisation des services DolaPay." },
    ],
  }),
  component: () => (
    <LegalLayout title="Conditions d'utilisation" updated="1er juin 2026">
      <p>Les présentes Conditions d'utilisation (les « Conditions ») régissent votre accès et votre utilisation de la plateforme DolaPay, exploitée par Dolapo ECOM LLC, et des services associés. En créant un compte DolaPay ou en utilisant les Services, vous acceptez d'être lié par ces Conditions.</p>
      <h2>1. Éligibilité</h2>
      <p>Vous devez être âgé d'au moins 18 ans et juridiquement capable de conclure un contrat pour utiliser les Services. Les entreprises doivent être dûment enregistrées dans une juridiction supportée.</p>
      <h2>2. Création de compte</h2>
      <p>Vous devez fournir des informations exactes lors de l'onboarding et conserver vos identifiants confidentiels. Vous êtes responsable de toute activité réalisée depuis votre compte.</p>
      <h2>3. Usage acceptable</h2>
      <ul>
        <li>Pas de blanchiment, de financement du terrorisme ni de contournement de sanctions.</li>
        <li>Pas d'activité frauduleuse, trompeuse ou illégale.</li>
        <li>Pas d'utilisation qui porte atteinte à la sécurité ou au fonctionnement des Services.</li>
      </ul>
      <h2>4. Frais et règlement</h2>
      <p>Les frais sont détaillés dans votre grille tarifaire. Les délais de règlement dépendent du moyen de paiement, de la juridiction et de nos contrôles de risque. Nous pouvons retenir un règlement lorsque la loi ou nos politiques de risque l'exigent.</p>
      <h2>5. Résiliation</h2>
      <p>Nous pouvons suspendre ou résilier votre accès en cas de non-respect des Conditions ou si la loi applicable ou nos partenaires bancaires l'exigent.</p>
      <h2>6. Responsabilité</h2>
      <p>Dans la mesure permise par la loi, les Services sont fournis « en l'état » et notre responsabilité cumulée est limitée aux frais payés par vous au cours des trois (3) mois précédant la réclamation.</p>
      <h2>7. Droit applicable</h2>
      <p>Les présentes Conditions sont régies par le droit de la République de Côte d'Ivoire, sans égard aux règles de conflit de lois.</p>
    </LegalLayout>
  ),
});
