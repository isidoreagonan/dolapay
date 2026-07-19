import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/legal/privacy")({ component: Privacy });
import LegalPage from "@/components/site/legal-page";

const Privacy = () => (
  <LegalPage
    title="Politique de confidentialité — DolaPay"
    description="Comment DolaPay collecte, utilise et protège vos données personnelles conformément aux règlementations en vigueur en Afrique et à l'international."
    canonicalUrl="/privacy"
    eyebrow="Confidentialité"
    heading={<>Politique de <span className="text-primary">confidentialité</span></>}
    intro="Chez DolaPay, la protection de vos données personnelles est une priorité absolue. Cette politique explique comment nous les collectons, les utilisons et les protégeons."
    sections={[
      {
        title: "1. Données collectées",
        body: (
          <>
            <p>Nous collectons uniquement les données strictement nécessaires à la fourniture du service :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Identité (nom, prénom, date de naissance) — obligation KYC</li>
              <li>Coordonnées (email, téléphone, adresse)</li>
              <li>Informations d'entreprise (raison sociale, immatriculation)</li>
              <li>Données de transaction (montant, canal, référence)</li>
              <li>Données techniques (IP, appareil, journaux d'accès)</li>
            </ul>
          </>
        ),
      },
      {
        title: "2. Finalités",
        body: (
          <p>
            Vos données sont utilisées pour : exécuter les paiements, respecter nos obligations légales (KYC, AML, lutte contre la fraude), améliorer le service, et vous fournir un support client.
          </p>
        ),
      },
      {
        title: "3. Sécurité",
        body: (
          <p>
            DolaPay est certifié <strong>PCI-DSS niveau 1</strong>. Les données sensibles sont chiffrées au repos (AES-256) et en transit (TLS 1.3). L'accès aux systèmes de production est strictement contrôlé et audité.
          </p>
        ),
      },
      {
        title: "4. Partage des données",
        body: (
          <p>
            Nous ne vendons jamais vos données. Nous les partageons uniquement avec nos partenaires bancaires et opérateurs Mobile Money (MTN, Orange, Wave, Moov, M-Pesa…) dans la stricte mesure nécessaire à l'exécution des paiements, et avec les autorités lorsque la loi l'exige.
          </p>
        ),
      },
      {
        title: "5. Vos droits",
        body: (
          <p>
            Vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition. Contactez <a className="text-primary hover:underline" href="mailto:privacy@dola-pay.com">privacy@dola-pay.com</a>.
          </p>
        ),
      },
      {
        title: "6. Conservation",
        body: <p>Les données sont conservées le temps de la relation contractuelle, puis archivées 10 ans conformément aux obligations comptables et anti-blanchiment applicables dans l'UEMOA/CEMAC.</p>,
      },
    ]}
  />
);



