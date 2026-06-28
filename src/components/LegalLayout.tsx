import { Link, useRouterState } from "@tanstack/react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FileText, Shield, Scale, Building2 } from "lucide-react";
import type { ReactNode } from "react";
import { LEGAL_ENTITY, LEGAL_ENTITY_ADDRESS_LINE } from "@/lib/legal-entity";

const DOCS = [
  { label: "Politique de confidentialité", to: "/legal/privacy", icon: Shield },
  { label: "Conditions d'utilisation", to: "/legal/terms", icon: FileText },
  { label: "Politique LCB-FT", to: "/legal/aml", icon: Scale },
] as const;

export function LegalLayout({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-36 sm:pt-40">
        <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mentions légales</div>
              <nav className="mt-2 space-y-1">
                {DOCS.map((d) => {
                  const active = pathname === d.to;
                  return (
                    <Link
                      key={d.to}
                      to={d.to}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                        active ? "bg-primary text-primary-foreground shadow-glow" : "text-foreground/80 hover:bg-accent"
                      }`}
                    >
                      <d.icon className="h-4 w-4 shrink-0" />
                      <span className="font-medium">{d.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="border-b border-border pb-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Mentions légales DolaPay</div>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h1>
              <p className="mt-3 text-sm text-muted-foreground">Dernière mise à jour : {updated}</p>
            </div>
            <div className="prose prose-neutral mt-8 max-w-3xl text-[15px] leading-[1.75] text-foreground/85 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
              {children}
            </div>

            <aside className="mt-12 rounded-2xl border border-border bg-card/60 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                <Building2 className="h-4 w-4" /> Éditeur du site
              </div>
              <div className="mt-3 space-y-1 text-sm text-foreground/85">
                <div><span className="font-semibold">{LEGAL_ENTITY.name}</span> — éditeur de la marque {LEGAL_ENTITY.brand}.</div>
                <div className="text-muted-foreground">Siège social : {LEGAL_ENTITY_ADDRESS_LINE}.</div>
              </div>
            </aside>
          </article>
        </div>
      </div>
      <Footer />
    </div>
  );
}
