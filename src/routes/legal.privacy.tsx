import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Politique de confidentialité — DolaPay" },
      { name: "description", content: "Comment DolaPay collecte, utilise et protège vos données." },
    ],
  }),
  component: () => (
    <LegalLayout title="Politique de confidentialité" updated="1er juin 2026">
      <p>Cette politique de confidentialité décrit comment Dolapo ECOM LLC, éditeur de la marque DolaPay (« nous », « notre »), collecte, utilise et partage les informations vous concernant lorsque vous utilisez nos services, y compris notre site, nos API, nos tableaux de bord et nos applications mobiles (collectivement, les « Services »).</p>
      <h2>1. Informations collectées</h2>
      <p>Nous recueillons les informations que vous fournissez directement, les informations collectées automatiquement, et les informations transmises par des tiers tels que les prestataires KYC, les banques et les opérateurs mobiles.</p>
      <ul>
        <li>Informations d'identité : nom, date de naissance, pièce d'identité officielle.</li>
        <li>Coordonnées : adresse e-mail, numéro de téléphone, adresse postale.</li>
        <li>Données de transaction : montant, devise, contreparties, horodatages.</li>
        <li>Données techniques : adresse IP, navigateur, système d'exploitation, identifiants d'appareil.</li>
      </ul>
      <h2>2. Utilisation des informations</h2>
      <p>Nous utilisons ces informations pour exploiter, maintenir et améliorer les Services, traiter les transactions, nous conformer aux lois applicables, prévenir la fraude et communiquer avec vous.</p>
      <h2>3. Partage des informations</h2>
      <p>Nous partageons des informations avec nos partenaires bancaires, les opérateurs de Mobile Money, les régulateurs et nos prestataires, strictement dans la mesure nécessaire à la fourniture des Services.</p>
      <h2>4. Conservation des données</h2>
      <p>Nous conservons les données personnelles aussi longtemps que nécessaire à la fourniture des Services et au respect de nos obligations légales, notamment en matière de LCB-FT.</p>
      <h2>5. Vos droits</h2>
      <p>Sous réserve du droit applicable, vous pouvez demander l'accès, la rectification, la suppression ou la portabilité de vos données personnelles en écrivant à privacy@dolapay.com.</p>
      <h2>6. Contact</h2>
      <p>Pour toute question relative à cette politique, contactez notre Délégué à la protection des données à dpo@dolapay.com.</p>
    </LegalLayout>
  ),
});
