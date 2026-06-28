import { Link } from "@tanstack/react-router";
import { Twitter, Github, Linkedin, ArrowRight } from "lucide-react";
import logoFull from "@/assets/dolapay-logo.png.asset.json";
import { LEGAL_ENTITY, LEGAL_ENTITY_ADDRESS_LINE } from "@/lib/legal-entity";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-deep text-navy-foreground">
      <div className="absolute inset-0 bg-grid opacity-[0.06]" />
      <div className="absolute -top-32 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <img src={logoFull.url} alt="DolaPay — Solutions Fintech Premium" className="h-20 w-auto object-contain" />
            <p className="mt-4 max-w-xs text-sm text-navy-foreground/70">
              L'infrastructure de paiement unifiée qui propulse la nouvelle génération d'entreprises digitales en Afrique.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Produits" links={[
            ["Encaissements", "/products/pay-in"],
            ["Décaissements", "/products/pay-out"],
            ["Liens de paiement", "/products/payment-links"],
            ["Tarifs", "/company/pricing"],
          ]} />
          <FooterCol title="Support" links={[
            ["Documentation API", "/developers/api"],
            ["SDKs", "/developers/sdks"],
            ["Contact", "/company/contact"],
            ["À propos", "/company/about"],
          ]} />

          <div>
            <div className="text-sm font-semibold">Restez informé</div>
            <p className="mt-2 text-sm text-navy-foreground/70">Nos actualités produit et les tendances fintech africaines.</p>
            <form className="mt-4 flex items-center gap-2 rounded-xl glass p-1.5">
              <input type="email" placeholder="vous@entreprise.com" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-navy-foreground placeholder:text-navy-foreground/40 focus:outline-none" />
              <button className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105">
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-6">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-navy-foreground/50">Mentions légales</div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-foreground/70">
                <Link to="/legal/privacy" className="hover:text-navy-foreground">Confidentialité</Link>
                <Link to="/legal/terms" className="hover:text-navy-foreground">Conditions</Link>
                <Link to="/legal/aml" className="hover:text-navy-foreground">LCB-FT</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div>© {new Date().getFullYear()} {LEGAL_ENTITY.name} — {LEGAL_ENTITY.brand}. Tous droits réservés.</div>
            <div>Siège : {LEGAL_ENTITY_ADDRESS_LINE}.</div>
          </div>
          <div>Simplifiez votre finance, même la plus complexe.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/70">
        {links.map(([label, to]) => (
          <li key={to}><Link to={to} className="transition-colors hover:text-navy-foreground">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
