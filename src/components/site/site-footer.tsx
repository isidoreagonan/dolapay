import { Link } from "@tanstack/react-router";
import Flag from "@/components/ui/flag";

const cols = [
  {
    title: "Produits",
    links: [
      { to: "/products/pay-in", label: "Encaissements" },
      { to: "/products/pay-out", label: "Décaissements" },
      { to: "/products/no-code", label: "Liens de paiement" },
      { to: "/pricing", label: "Tarifs" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { to: "/developers/api", label: "Documentation API" },
      { to: "/resources/support", label: "Support marchand" },
      { to: "/resources/use-cases", label: "Cas d'usage" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { to: "/about", label: "À propos" },
      { to: "/coverage", label: "Couverture" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { to: "/legal", label: "Mentions légales" },
      { to: "/privacy", label: "Confidentialité" },
      { to: "/terms", label: "CGV" },
      { to: "/legal/cookie-policy", label: "Cookies" },
    ],
  },
];

const SiteFooter = () => (
  <footer className="border-t border-border bg-white">
    <div className="mx-auto max-w-7xl px-4 md:px-6 py-16">
      <div className="grid md:grid-cols-6 gap-10">
        <div className="md:col-span-2 max-w-sm">
          <Link to="/" className="flex items-center">
            <img src="/images/common/logo.png" alt="DolaPay" className="h-14 w-auto" />
          </Link>

          <p className="mt-4 text-sm text-navy/60 leading-relaxed">
            L'infrastructure de paiement qui unifie Mobile Money et cartes bancaires pour les entreprises africaines.
          </p>
          <p className="mt-4 text-sm text-navy/50">dola-pay.com</p>
          <div className="mt-6 flex flex-wrap gap-1.5" aria-label="Pays couverts">
            {["ci","sn","ml","bf","bj","tg","cm","ga","ng","gh","ke","cd"].map((f) => (
              <Flag key={f} code={f} size={16} />
            ))}
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <div className="text-sm font-semibold text-navy">{col.title}</div>
            <ul className="mt-4 space-y-2.5 text-sm text-navy/60">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-navy/50">
        <span>© {new Date().getFullYear()} DolaPay — dola-pay.com. Tous droits réservés.</span>
        <span>Fait avec ❤️ pour l'Afrique.</span>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
