import { createFileRoute } from "@tanstack/react-router";
import LegalPage from "@/components/site/legal-page";

const CookiePolicy = () => (
  <LegalPage
    title="Politique de gestion des Cookies — DolaPay"
    description="Comprendre comment DolaPay utilise les cookies pour améliorer votre expérience de navigation."
    canonicalUrl="/legal/cookie-policy"
    eyebrow="Confidentialité"
    heading={<>Politique des <span className="text-primary">Cookies</span></>}
    intro="DolaPay utilise des cookies et technologies similaires pour garantir le bon fonctionnement de sa plateforme et analyser l'utilisation de nos services."
    sections={[
      {
        title: "Qu'est-ce qu'un cookie ?",
        body: (
          <>
            <p>Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet au site de mémoriser vos actions et préférences (telles que la connexion, la langue) pendant une période donnée.</p>
          </>
        )
      },
      {
        title: "Comment utilisons-nous les cookies ?",
        body: (
          <>
            <p>Nous utilisons différents types de cookies :</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
              <li><strong>Cookies strictement nécessaires :</strong> Ils sont indispensables pour vous permettre de naviguer sur le site et d'utiliser ses fonctionnalités sécurisées (ex: maintien de la session sur votre tableau de bord).</li>
              <li><strong>Cookies de performance et d'analyse :</strong> Ils nous aident à comprendre comment les visiteurs interagissent avec notre site, en recueillant des informations de manière anonyme (ex: Google Analytics).</li>
              <li><strong>Cookies de fonctionnalité :</strong> Ils permettent au site de mémoriser les choix que vous avez faits (ex: langue préférée).</li>
            </ul>
          </>
        )
      },
      {
        title: "Gestion de vos préférences",
        body: (
          <>
            <p>La plupart des navigateurs web acceptent automatiquement les cookies, mais vous pouvez modifier les paramètres de votre navigateur pour les refuser si vous le préférez. Notez que la désactivation des cookies nécessaires peut empêcher le bon fonctionnement de l'application DolaPay.</p>
            <p>Pour en savoir plus sur la gestion des cookies sur votre appareil, veuillez consulter la documentation de votre navigateur internet.</p>
          </>
        )
      }
    ]}
  />
);

export default CookiePolicy;

export const Route = createFileRoute("/legal/cookie-policy")({ component: CookiePolicy });
