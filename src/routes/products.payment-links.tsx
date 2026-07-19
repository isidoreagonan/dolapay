import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/products/payment-links")({ component: NoCode });
import { Link2, Share2, Palette, QrCode, Globe2, BarChart3 } from "lucide-react";
import ProductPage from "@/components/site/product-page";

const NoCode = () => (
  <ProductPage
    seoTitle="Liens de paiement no-code — DolaPay"
    seoDescription="Créez un lien de paiement en 30 secondes, sans coder. Partagez sur WhatsApp, Instagram, TikTok — encaissez en Mobile Money ou par carte."
    canonicalUrl="/products/no-code"
    eyebrow="Produit · No-code"
    title={<>Vendez sur WhatsApp. <span className="text-primary">Sans une ligne de code.</span></>}
    description="Créez un lien de paiement en 30 secondes, personnalisez-le à vos couleurs, partagez-le partout, et encaissez en Mobile Money ou par carte."
    bullets={[
      "Aucune intégration technique requise",
      "Partage WhatsApp, Instagram, TikTok, SMS, email",
      "QR code généré automatiquement",
      "Personnalisation logo, couleurs, message",
    ]}
    features={[
      { icon: Link2, title: "Création en 30 secondes", desc: "Montant, description, canal — c'est prêt. Réutilisable ou usage unique." },
      { icon: Share2, title: "Partage universel", desc: "WhatsApp Business, Instagram DM, TikTok bio, email, SMS — un seul lien." },
      { icon: QrCode, title: "QR code intégré", desc: "Affichez le QR sur vos flyers, boutique physique, ou factures papier." },
      { icon: Palette, title: "Aux couleurs de votre marque", desc: "Logo, palette, message de remerciement — 100% personnalisable." },
      { icon: Globe2, title: "Multi-devises", desc: "XOF, XAF, NGN, GHS, KES, CDF — le client paie dans sa devise locale." },
      { icon: BarChart3, title: "Suivi en temps réel", desc: "Voyez qui a payé, qui a cliqué sans finaliser, et les canaux les plus efficaces." },
    ]}
  />
);



