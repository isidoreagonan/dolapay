import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/site/legal-page";

const Mentions = () => (
  <LegalPage
    title="Mentions légales — DolaPay"
    description="Mentions légales de DolaPay : éditeur du site, hébergement, propriété intellectuelle et coordonnées."
    canonicalUrl="/legal/mentions"
    eyebrow="Légal"
    heading={<>Mentions <span className="text-primary">légales</span></>}
    intro="Informations légales relatives à l'éditeur du site dola-pay.com et aux services DolaPay."
    sections={[
      {
        title: "Éditeur du site",
        body: (
          <>
            <p>Le site internet DolaPay (ci-après le « Site ») est édité par la société <strong>DOLAPO ECOM LLC</strong>, société à responsabilité limitée (LLC) de droit américain.</p>
            <p>
              <strong>Siège social :</strong> 1209 MOUNTAIN RD PL NE STE R, ALBUQUERQUE NM 87110, États-Unis.<br />
              <strong>Numéro d'identification fiscale (EIN) :</strong> 37-2198580<br />
              <strong>Représentant Légal (Sole Member) :</strong> M. AGONAN ISIDORE ABRAHAM<br />
              <strong>Email de contact :</strong> legal@dolapay.io
            </p>
          </>
        )
      },
      {
        title: "Hébergement du site",
        body: (
          <>
            <p>L'hébergement du site est assuré par la société Vercel Inc.</p>
            <p>
              Vercel Inc.<br />
              440 N Barranca Ave #4133<br />
              Covina, CA 91723<br />
              États-Unis
            </p>
          </>
        )
      },
      {
        title: "Propriété Intellectuelle",
        body: (
          <>
            <p>L'ensemble du contenu du Site (textes, images, vidéos, logos, icônes, code source) est la propriété exclusive de DOLAPO ECOM LLC, sauf mention contraire. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de DOLAPO ECOM LLC.</p>
          </>
        )
      },
      {
        title: "Limitation de responsabilité",
        body: (
          <>
            <p>DOLAPO ECOM LLC s'efforce de fournir sur le site DolaPay des informations aussi précises que possible. Toutefois, la société ne pourra être tenue responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.</p>
            <p>L'utilisation des services DolaPay est soumise à nos Conditions Générales de Vente et d'Utilisation (CGV/CGU).</p>
          </>
        )
      }
    ]}
  />
);

export default Mentions;

export const Route = createFileRoute("/legal/mentions")({ component: Mentions });
