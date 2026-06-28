import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X, Zap, Send, LinkIcon, Code2, Boxes, Building2, Mail, Tag, Shield, FileText, Scale, ShoppingBag } from "lucide-react";
import logoFull from "@/assets/dolapay-logo.png.asset.json";

type Item = { label: string; to: string; hash?: string; icon: React.ComponentType<{ className?: string }>; desc: string };

const menu: { label: string; items: Item[] }[] = [
  {
    label: "Produits",
    items: [
      { label: "Encaissements (Pay-in)", to: "/company/pricing", hash: "payin", icon: Zap, desc: "Acceptez Mobile Money et cartes" },
      { label: "Décaissements (Pay-out)", to: "/company/pricing", hash: "payout", icon: Send, desc: "Envoyez des fonds partout en Afrique" },
      { label: "Liens de paiement", to: "/products/payment-links", icon: LinkIcon, desc: "Encaissez sans une ligne de code" },
      { label: "E-commerce", to: "/products/ecommerce", icon: ShoppingBag, desc: "Un checkout qui convertit" },
    ],
  },
  {
    label: "Développeurs",
    items: [
      { label: "Documentation API", to: "/developers/api", icon: Code2, desc: "API REST simple et prévisible" },
      { label: "SDKs", to: "/developers/sdks", icon: Boxes, desc: "Node, Python, PHP et plus" },
    ],
  },
  {
    label: "Entreprise",
    items: [
      { label: "À propos", to: "/company/about", icon: Building2, desc: "Notre mission pour l'Afrique" },
      { label: "Contact", to: "/company/contact", icon: Mail, desc: "Parlez à notre équipe" },
      { label: "Tarifs", to: "/company/pricing", icon: Tag, desc: "Une grille simple et transparente" },
    ],
  },
  {
    label: "Mentions légales",
    items: [
      { label: "Confidentialité", to: "/legal/privacy", icon: Shield, desc: "Comment nous protégeons vos données" },
      { label: "Conditions d'utilisation", to: "/legal/terms", icon: FileText, desc: "Règles d'utilisation" },
      { label: "Politique LCB-FT", to: "/legal/aml", icon: Scale, desc: "Lutte contre le blanchiment" },
    ],
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="mx-auto max-w-7xl px-4">
        <div className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${scrolled ? "glass-light shadow-elegant" : "bg-transparent"}`}>
          <Link to="/" className="flex items-center" aria-label="DolaPay">
            <img src={logoFull.url} alt="DolaPay" className="h-9 w-auto object-contain drop-shadow-[0_4px_12px_rgba(99,102,241,0.25)] sm:h-10" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpen(null)}>
            {menu.map((g) => (
              <div key={g.label} className="relative" onMouseEnter={() => setOpen(g.label)}>
                <button className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
                  {g.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open === g.label ? "rotate-180" : ""}`} />
                </button>
                {open === g.label && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                    <div className="w-80 rounded-2xl border border-border bg-popover p-2 shadow-elegant">
                      {g.items.map((i) => (
                        <Link key={i.to + (i.hash ?? "")} to={i.to} hash={i.hash} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent">
                          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                            <i.icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground">{i.label}</div>
                            <div className="text-xs text-muted-foreground">{i.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/auth/sign-in" className="rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground">Se connecter</Link>
            <Link to="/auth/sign-up" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:bg-primary-glow">Créer un compte</Link>
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/70 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent lg:hidden"
            onClick={() => setMobile(!mobile)}
            aria-label="Menu"
            aria-expanded={mobile}
          >
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          className={`lg:hidden ${mobile ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!mobile}
        >
          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${mobile ? "opacity-100" : "opacity-0"}`}
            onClick={() => setMobile(false)}
          />
          {/* Panel */}
          <div
            className={`fixed inset-x-3 top-[68px] z-50 max-h-[calc(100vh-84px)] overflow-y-auto rounded-2xl border border-border bg-card/95 p-4 shadow-elegant backdrop-blur-xl transition-all duration-300 ${
              mobile ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
            }`}
          >
            <nav className="flex flex-col gap-1">
              {menu.map((g) => (
                <div key={g.label} className="rounded-xl">
                  <button
                    onClick={() => setOpen(open === g.label ? null : g.label)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                    aria-expanded={open === g.label}
                  >
                    <span>{g.label}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open === g.label ? "rotate-180" : ""}`} />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${open === g.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-2 mt-1 flex flex-col gap-1 border-l border-border pl-2">
                        {g.items.map((i) => (
                          <Link
                            key={i.to + (i.hash ?? "")}
                            to={i.to}
                            hash={i.hash}
                            onClick={() => {
                              setMobile(false);
                              setOpen(null);
                            }}
                            className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent"
                          >
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                              <i.icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-foreground">{i.label}</span>
                              <span className="block truncate text-xs text-muted-foreground">{i.desc}</span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
              <Link
                to="/auth/sign-in"
                onClick={() => setMobile(false)}
                className="rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Se connecter
              </Link>
              <Link
                to="/auth/sign-up"
                onClick={() => setMobile(false)}
                className="rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
