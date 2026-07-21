import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { Book, Zap, Webhook, ShieldCheck, Code2, Terminal, Globe, CheckCircle, AlertCircle, TerminalSquare } from "lucide-react";
import PageShell from "@/components/site/page-shell";

export const Route = createFileRoute("/developers/api")({
  component: ApiDocsLayout,
});

const navItems = [
  { path: "/developers/api", label: "Introduction", icon: Book },
  { path: "/developers/api/auth", label: "Authentification", icon: ShieldCheck },
  { path: "/developers/api/checkout-sessions", label: "Checkout Sessions", icon: Globe },
  { path: "/developers/api/checkout-pay", label: "Direct API Payment", icon: Zap },
  { path: "/developers/api/webhooks", label: "Webhooks", icon: Webhook },
  { path: "/developers/api/errors", label: "Codes & Erreurs", icon: AlertCircle },
];

function ApiDocsLayout() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <PageShell
      title="Documentation API DolaPay — Reference"
      description="Intégrez facilement les paiements Mobile Money sur votre plateforme grâce aux Checkout Sessions, API de Paiement Direct et Webhooks."
      canonicalUrl="/developers/api"
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 pt-28 md:pt-36 pb-12 md:pb-16 flex flex-col lg:flex-row gap-12">
        {/* Navigation latérale */}
        <aside className="w-full lg:w-[280px] shrink-0 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto no-scrollbar">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
            <div className="text-xs uppercase font-bold tracking-widest text-navy/50 px-3 mb-4">API Reference</div>
            <nav className="space-y-1.5">
              {navItems.map((n) => {
                const isActive = currentPath === n.path;
                return (
                  <Link
                    key={n.path}
                    to={n.path as any}
                    className={\`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 \${
                      isActive 
                        ? "bg-primary/10 text-primary shadow-sm" 
                        : "text-navy/70 hover:bg-muted hover:text-navy"
                    }\`}
                  >
                    <n.icon className={\`h-4 w-4 \${isActive ? "opacity-100" : "opacity-70"}\`} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-navy to-[#0A1135] border border-white/10 text-white p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Code2 className="h-4 w-4 text-electric-glow" />
              </div>
              <div className="font-semibold text-sm">Environnement Sandbox</div>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Testez vos intégrations gratuitement et sans risque en utilisant vos clés API de test. Aucun paiement réel ne sera débité.
            </p>
          </div>
        </aside>

        {/* Contenu principal de la page */}
        <main className="min-w-0 flex-1 max-w-4xl">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-[11px] font-bold text-primary uppercase tracking-wider">
              <TerminalSquare className="h-3.5 w-3.5" /> DolaPay Developers
            </span>
          </div>
          
          {/* L'Outlet rendra les sous-pages (index, auth, etc.) */}
          <Outlet />
        </main>
      </div>
    </PageShell>
  );
}
