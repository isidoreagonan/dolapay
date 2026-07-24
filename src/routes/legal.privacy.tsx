import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/site/legal-page";

function Privacy() {
  return (
  <LegalPage
    title="Politique de confidentialité — DolaPay"
    description="Comment DolaPay collecte, utilise et protège vos données personnelles."
    canonicalUrl="/legal/privacy"
    eyebrow="Confidentialité"
    heading={<>Politique de <span className="text-primary">confidentialité</span></>}
    intro="Chez DolaPay (opéré par DOLAPO ECOM LLC), la protection de vos données personnelles est une priorité absolue. Cette politique explique comment nous les collectons, les utilisons et les protégeons."
    sections={[
      {
        title: "1. Identité du responsable de traitement",
        body: (
          <>
            <p>Le traitement de vos données personnelles est sous la responsabilité de :</p>
            <p><strong>DOLAPO ECOM LLC</strong><br/>
            1209 MOUNTAIN RD PL NE STE R, ALBUQUERQUE NM 87110, États-Unis<br/>
            Email pour les requêtes de confidentialité : legal@dolapay.io</p>
          </>
        )
      },
      {
        title: "2. Données collectées",
        body: (
          <>
            <p>Nous collectons uniquement les données strictement nécessaires à la fourniture de nos services de paiement :</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Informations d'identité :</strong> nom, prénom, date de naissance, copie de pièce d'identité (obligation KYC).</li>
              <li><strong>Informations professionnelles :</strong> nom de l'entreprise, numéro d'immatriculation, adresse, EIN/NIF.</li>
              <li><strong>Informations de paiement :</strong> numéros de téléphone (Mobile Money), données bancaires partielles, historiques de transactions.</li>
              <li><strong>Informations techniques :</strong> adresses IP, logs de connexion, appareils utilisés.</li>
            </ul>
          </>
        )
      },
      {
        title: "3. Utilisation de vos données",
        body: (
          <>
            <p>Vos données sont traitées pour les finalités suivantes :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>L'exécution des transactions de paiement et reversements.</li>
              <li>La vérification de votre identité (KYC/KYB) pour lutter contre la fraude et le blanchiment d'argent.</li>
              <li>Le support client et la résolution des litiges.</li>
              <li>L'amélioration technique de nos services et de nos API.</li>
            </ul>
          </>
        )
      },
      {
        title: "4. Partage des données",
        body: (
          <>
            <p>Nous ne vendons <strong>jamais</strong> vos données à des tiers. Elles peuvent être partagées uniquement avec :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Nos partenaires financiers et banques (pour le règlement des fonds).</li>
              <li>Les opérateurs télécoms (pour valider un paiement Mobile Money).</li>
              <li>Les autorités de régulation (en cas d'obligation légale).</li>
            </ul>
          </>
        )
      },
      {
        title: "5. Sécurité de vos données",
        body: (
          <>
            <p>DolaPay applique des standards de sécurité stricts de l'industrie (chiffrement TLS 256 bits, hachage des données sensibles) pour empêcher tout accès non autorisé à vos données. Nos bases de données sont sécurisées et répliquées dans des environnements cloud certifiés ISO 27001.</p>
          </>
        )
      },
      {
        title: "6. Vos droits",
        body: (
          <>
            <p>Conformément aux réglementations internationales sur la protection des données, vous disposez des droits suivants concernant vos données personnelles :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Droit d'accès et de rectification.</li>
              <li>Droit à l'effacement (droit à l'oubli), sous réserve de nos obligations légales de conservation financière.</li>
              <li>Droit à la portabilité de vos données.</li>
            </ul>
            <p>Pour exercer vos droits, contactez-nous à : <strong>legal@dolapay.io</strong>.</p>
          </>
        )
      }
    ]}
  />
);

export default Privacy;

export const Route = createFileRoute("/legal/privacy")({ component: Privacy }  );
}
