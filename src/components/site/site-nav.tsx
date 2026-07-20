import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X, Wallet, Zap, Link2, BookOpen, LifeBuoy, Layers, Building2, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Item = { to: string; label: string; desc: string; icon: any };

const products: Item[] = [
  { to: "/products/pay-in", label: "Encaissements (Pay-in)", desc: "Mobile Money + cartes en un checkout", icon: Wallet },
  { to: "/products/pay-out", label: "Décaissements (Pay-out)", desc: "Bulk payouts instantanés vers tout portefeuille", icon: Zap },
  { to: "/products/payment-links", label: "Liens de paiement", desc: "Encaissez sans une seule ligne de code", icon: Link2 },
];
const resources: Item[] = [
  { to: "/docs", label: "Documentation API", desc: "Guides, SDK, référence complète", icon: BookOpen },
  { to: "/resources/support", label: "Support marchand", desc: "Une équipe humaine, 7j/7", icon: LifeBuoy },
  { to: "/resources/use-cases", label: "Cas d'usage", desc: "E-commerce, freelances, startups tech", icon: Layers },
];
const company: Item[] = [
  { to: "/company/about", label: "À propos de DolaPay", desc: "Notre mission pour l'Afrique", icon: Building2 },
  { to: "/company/coverage", label: "Couverture & Pays", desc: "12 économies, tous les opérateurs", icon: Globe2 },
];

const Dropdown = ({ label, items }: { label: string; items: Item[] }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1 text-sm text-navy/70 hover:text-primary transition-colors py-2">
        {label} <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-[360px]"
          >
            <div className="rounded-2xl bg-white border border-border shadow-card p-2">
              {items.map((it) => (
                <Link
                  key={it.to}
                  to={it.to}
                  className="flex items-start gap-3 rounded-xl p-3 hover:bg-primary/5 transition-colors group"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15">
                    <it.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy">{it.label}</div>
                    <div className="text-xs text-navy/55 mt-0.5">{it.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileAccordion = ({
  label,
  items,
  isOpen,
  onToggle,
  close,
}: {
  label: string;
  items: Item[];
  isOpen: boolean;
  onToggle: () => void;
  close: () => void;
}) => (
  <div className="border-b border-border/70 last:border-b-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 text-left"
    >
      <span className="text-[15px] font-semibold text-navy">{label}</span>
      <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
        <ChevronDown className="h-4 w-4 text-navy/50" />
      </motion.span>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="pb-3 space-y-1">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                onClick={close}
                className="flex items-center gap-3 rounded-xl px-2 py-2.5 active:bg-primary/5"
              >
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <it.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-[14px] font-medium text-navy/80">{it.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const MobileLink = ({ label, to, close }: { label: string; to: string; close: () => void }) => (
  <Link
    to={to}
    onClick={close}
    className="w-full flex items-center justify-between py-4 border-b border-border/70 last:border-b-0"
  >
    <span className="text-[15px] font-semibold text-navy">{label}</span>
    <ArrowUpRight className="h-4 w-4 text-navy/40" />
  </Link>
);

const SiteNav = () => {
  const [mobile, setMobile] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("products");
  const toggle = (k: string) => setOpenSection((cur) => (cur === k ? null : k));
  const close = () => setMobile(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        if (mounted) setIsLoggedIn(!!data.session);
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) setIsLoggedIn(!!session);
      });
      return () => {
        sub.subscription.unsubscribe();
      };
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 md:px-6 pt-4">
        <div className="flex items-center justify-between rounded-2xl bg-white/80 backdrop-blur-xl border border-border shadow-soft pl-2 pr-4 md:pr-6 h-14 md:h-16 overflow-visible">
          <Link to="/" className="flex items-center shrink-0 -my-4">
            <img src="/images/common/logo.png" alt="DolaPay" className="h-20 md:h-24 w-auto object-contain" />
          </Link>




          <nav className="hidden lg:flex items-center gap-7">
            <Dropdown label="Produits" items={products} />
            <Dropdown label="Ressources" items={resources} />
            <Dropdown label="Entreprise" items={company} />
            <Link
              to="/company/pricing"
              className="text-sm py-2 transition-colors"
              activeProps={{ className: "text-primary font-medium" }}
              inactiveProps={{ className: "text-navy/70 hover:text-primary" }}
            >
              Tarifs
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl hidden sm:inline-flex">
                <Link to="/dashboard" className="flex items-center gap-1">
                  Tableau de Bord <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Link to="/auth/sign-in" className="hidden sm:inline-flex text-sm text-navy/70 hover:text-primary px-3 py-2">
                  Se connecter
                </Link>
                <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl hidden sm:inline-flex">
                  <Link to="/auth/sign-up" className="flex items-center gap-1">
                    Créer un compte <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
            <button
              aria-label={mobile ? "Fermer" : "Menu"}
              onClick={() => setMobile((v) => !v)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-lg text-navy"
            >
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="lg:hidden fixed inset-0 top-[76px] z-40 bg-navy/10 backdrop-blur-sm pointer-events-auto"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="lg:hidden fixed top-[76px] left-4 right-4 z-50 origin-top pointer-events-auto"
            >
              <div className="rounded-3xl bg-white border border-border shadow-2xl shadow-navy/10 overflow-hidden">
                <div className="px-5 pt-2 pb-1 max-h-[calc(100vh-140px)] overflow-y-auto">
                  <MobileAccordion label="Produits" items={products} isOpen={openSection === "products"} onToggle={() => toggle("products")} close={close} />
                  <MobileAccordion label="Ressources" items={resources} isOpen={openSection === "resources"} onToggle={() => toggle("resources")} close={close} />
                  <MobileAccordion label="Entreprise" items={company} isOpen={openSection === "company"} onToggle={() => toggle("company")} close={close} />
                  <MobileLink label="Tarifs" to="/pricing" close={close} />
                </div>
                <div className="border-t border-border px-5 py-4 grid grid-cols-2 gap-3 bg-white">
                  {isLoggedIn ? (
                    <Link
                      to="/dashboard"
                      onClick={close}
                      className="col-span-2 flex items-center justify-center h-11 rounded-xl bg-primary text-white text-[14px] font-semibold active:bg-primary/90"
                    >
                      Tableau de Bord
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/auth/sign-in"
                        onClick={close}
                        className="flex items-center justify-center h-11 rounded-xl border border-border text-[14px] font-semibold text-navy active:bg-navy/5"
                      >
                        Se connecter
                      </Link>
                      <Link
                        to="/auth/sign-up"
                        onClick={close}
                        className="flex items-center justify-center h-11 rounded-xl bg-primary text-white text-[14px] font-semibold active:bg-primary/90"
                      >
                        Créer un compte
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SiteNav;
