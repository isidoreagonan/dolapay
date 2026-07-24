import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/products/pay-in")({ component: PayIn });
import { Smartphone, CreditCard, ShieldCheck, Zap, BarChart3, Repeat } from "lucide-react";
import ProductPage from "@/components/site/product-page";
import PricingMatrix from "@/components/site/pricing-matrix";

const PayIn = () => (
  <ProductPage
    seoTitle="Encaissements (Pay-in) — DolaPay"
    seoDescription="Encaissez en Mobile Money (MTN, Orange, Wave, Moov, M-Pesa) et par carte bancaire dans 12 pays africains avec un seul checkout."
    canonicalUrl="/products/pay-in"
    eyebrow="Produit · Pay-in"
    title={<>Un checkout. <span className="text-primary">Tous les moyens de paiement africains.</span></>}
    description="Encaissez en Mobile Money et par carte bancaire dans 12 économies africaines, sans redirection et avec une conversion optimisée."
    bullets={[
      "MTN, Orange, Wave, Moov, Airtel, M-Pesa 🇨🇮 🇸🇳 🇨🇲 🇰🇪",
      "Visa & Mastercard avec 3DS obligatoire",
      "STK Push, USSD, QR code, redirect ou hosted page",
      "Commission 2% + frais opérateur réels",
    ]}
    features={[
      { icon: Smartphone, title: "Mobile Money natif", desc: "Un seul appel API pour tous les opérateurs. STK Push et USSD supportés." },
      { icon: CreditCard, title: "Cartes internationales", desc: "Visa, Mastercard, GIM-UEMOA avec 3D-Secure obligatoire et tokenisation." },
      { icon: Repeat, title: "Abonnements récurrents", desc: "Débitez automatiquement chaque mois. Gestion des retries et des impayés." },
      { icon: ShieldCheck, title: "Anti-fraude ML", desc: "Scoring temps réel, blocage automatique des tentatives frauduleuses." },
      { icon: Zap, title: "Checkout hébergé", desc: "Une URL prête à l'emploi si vous ne voulez pas coder — mobile-first et responsive." },
      { icon: BarChart3, title: "Analytics en temps réel", desc: "Conversion par canal, taux d'échec, MRR — le tout dans un dashboard clair." },
    ]}
  >
    <PricingMatrix
      mode="payin"
      title="Frais d'encaissement par pays et opérateur"
      subtitle="Le taux affiché est tout compris : frais réels de l'opérateur + commission DolaPay 2%."
    />
  </ProductPage>
);



