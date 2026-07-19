import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/legal/terms")({ component: Legal });
import LegalPage from "@/components/site/legal-page";

const Legal = () => (
  <LegalPage
    title="Mentions légales — DolaPay"
    description="Mentions légales de DolaPay : éditeur du site, hébergement, propriété intellectuelle et coordonnées."
    canonicalUrl="/legal"
    eyebrow="Légal"
    heading={<>Mentions <span className="text-primary">légales</span></>}
    intro="Informations légales relatives à l'éditeur du site dola-pay.com et aux services DolaPay."
    sections={[
      {
        title: "Éditeur du site",
        body: (
          <>
            <p>Le site dola-pay.com est édité par <strong>DolaPay SAS</strong>, société par actions simplifiée au capital social de 10 000 000 FCFA.</p>
            <p>Siège social : Abidjan, Côte d'Ivoire 🇨🇮 · Email : legal@dola-pay.com</p>
          </>
        ),
      },
      {
        title: "Directeur de la publication",
        body: <p>Le directeur de la publication est le représentant légal de DolaPay SAS.</p>,
      },
      {
        title: "Hébergement",
        body: <p>Le site est hébergé sur une infrastructure cloud multi-région, avec CDN mondial et sauvegardes chiffrées.</p>,
      },
      {
        title: "Propriété intellectuelle",
        body: (
          <>
            <p>L'ensemble des contenus (textes, logos, visuels, code) présents sur dola-pay.com est la propriété exclusive de DolaPay SAS et protégé par le droit d'auteur.</p>
            <p>Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</p>
          </>
        ),
      },
      {
        title: "Conformité",
        body: (
          <p>
            DolaPay opère dans les zones UEMOA 🇨🇮 🇸🇳 🇲🇱 🇧🇫 🇧🇯 🇹🇬 et CEMAC 🇨🇲 🇬🇦, ainsi qu'au Nigeria 🇳🇬, Ghana 🇬🇭, Kenya 🇰🇪 et RDC 🇨🇩, en partenariat avec des établissements de paiement agréés localement. Certification PCI-DSS niveau 1.
          </p>
        ),
      },
      {
        title: "Contact",
        body: <p>Pour toute question : <a className="text-primary hover:underline" href="mailto:contact@dola-pay.com">contact@dola-pay.com</a></p>,
      },
    ]}
  />
);



