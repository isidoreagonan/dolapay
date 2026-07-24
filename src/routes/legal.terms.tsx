import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/site/legal-page";

function Terms() {
  return (
  <LegalPage
    title="Conditions Générales de Vente et d'Utilisation (CGV/CGU) — DolaPay"
    description="Lisez nos conditions générales pour comprendre vos droits et obligations lors de l'utilisation de nos services de paiement."
    canonicalUrl="/legal/terms"
    eyebrow="Légal"
    heading={<>Conditions Générales de <span className="text-primary">Vente et d'Utilisation</span></>}
    intro="Les présentes Conditions Générales définissent les règles d'utilisation des services de paiement et logiciels fournis par DolaPay."
    sections={[
      {
        title: "1. Objet et acceptation",
        body: (
          <>
            <p>Les présentes Conditions Générales de Vente et d'Utilisation (ci-après « CGV/CGU ») régissent la relation contractuelle entre <strong>DOLAPO ECOM LLC</strong> (ci-après « DolaPay » ou « Nous ») et tout professionnel (ci-après « le Marchand » ou « Vous ») utilisant la plateforme DolaPay pour accepter ou émettre des paiements.</p>
            <p>L'ouverture d'un compte DolaPay implique l'acceptation sans réserve des présentes CGV/CGU.</p>
          </>
        )
      },
      {
        title: "2. Description des services",
        body: (
          <>
            <p>DolaPay fournit une infrastructure technique permettant au Marchand de :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Recevoir des paiements (Pay-in) de ses clients finaux via des opérateurs de Mobile Money ou des cartes bancaires.</li>
              <li>Effectuer des décaissements (Pay-out) de masse vers des portefeuilles mobiles.</li>
              <li>Créer des liens de paiement No-Code pour faciliter la vente sur les réseaux sociaux.</li>
            </ul>
            <p>DolaPay agit en tant que prestataire technique (Passerelle de Paiement) et n'est pas une banque. Les fonds encaissés sont gérés en partenariat avec des institutions financières agréées dans les juridictions concernées.</p>
          </>
        )
      },
      {
        title: "3. Création de compte et KYC",
        body: (
          <>
            <p>L'accès aux services nécessite la création d'un compte. Le Marchand s'engage à fournir des informations exactes et à les maintenir à jour.</p>
            <p>Conformément aux réglementations contre le blanchiment d'argent et le financement du terrorisme (LCB-FT), DolaPay procédera à une vérification de l'identité du Marchand (procédure KYC/KYB). Nous nous réservons le droit de suspendre ou clôturer tout compte dont les informations s'avèrent fausses ou incomplètes.</p>
          </>
        )
      },
      {
        title: "4. Tarification et Reversements",
        body: (
          <>
            <p><strong>Frais :</strong> L'utilisation de DolaPay est soumise à des frais de transaction dont les taux sont publics et affichés sur notre page "Tarifs". DolaPay prélève automatiquement ces frais lors du règlement des transactions.</p>
            <p><strong>Reversements (Payouts) :</strong> Les fonds accumulés sur le compte DolaPay peuvent être reversés vers le compte bancaire ou le portefeuille mobile du Marchand selon les délais de règlement (Settlement) indiqués dans le tableau de bord.</p>
          </>
        )
      },
      {
        title: "5. Activités interdites",
        body: (
          <>
            <p>Il est strictement interdit d'utiliser DolaPay pour traiter des paiements liés à :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>La vente de drogues, de stupéfiants ou de substances illicites.</li>
              <li>La vente d'armes, munitions ou matériels explosifs.</li>
              <li>Les jeux d'argent, paris sportifs, casinos ou loteries non régulés.</li>
              <li>La pornographie ou tout contenu sexuellement explicite.</li>
              <li>Toute activité frauduleuse, trompeuse ou illégale.</li>
            </ul>
          </>
        )
      },
      {
        title: "6. Droit applicable et juridiction",
        body: (
          <>
            <p>Les présentes CGV/CGU sont régies par les lois de l'État du Nouveau-Mexique (États-Unis). Tout litige relatif à leur interprétation et/ou à leur exécution relève des tribunaux compétents d'Albuquerque, NM.</p>
          </>
        )
      }
    ]}
  />
);

export default Terms;

export const Route = createFileRoute("/legal/terms")({ component: Terms }  );
}
