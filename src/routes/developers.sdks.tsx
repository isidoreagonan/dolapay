import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  Code2,
  Copy,
  Github,
  PackageCheck,
  PlugZap,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";

export const Route = createFileRoute("/developers/sdks")({
  head: () => ({
    meta: [
      { title: "SDKs DolaPay" },
      {
        name: "description",
        content: "SDKs officiels DolaPay pour Node.js, Python, PHP/Laravel et Go avec commandes d'installation.",
      },
    ],
  }),
  component: SdksPage,
});

type Sdk = {
  id: string;
  name: string;
  language: string;
  command: string;
  importLine: string;
  description: string;
  features: string[];
  initials: string;
  tone: "emerald" | "sky" | "violet" | "cyan";
  repository: string;
};

const sdks: Sdk[] = [
  {
    id: "node",
    name: "Node.js",
    language: "JavaScript / TypeScript",
    command: "npm install @dolapay/node",
    importLine: "import DolaPay from '@dolapay/node'",
    description: "SDK typé pour applications Node 18+, backends serverless et plateformes e-commerce.",
    features: ["Types natifs", "ESM + CJS", "Retries", "Webhooks"],
    initials: "JS",
    tone: "emerald",
    repository: "github.com/dolapay/node",
  },
  {
    id: "python",
    name: "Python",
    language: "Python 3.8+",
    command: "pip install dolapay",
    importLine: "import dolapay",
    description: "Client simple pour backends Django, FastAPI, scripts de finance et pipelines opérationnels.",
    features: ["Sync / async", "Type hints", "Pagination", "Sandbox"],
    initials: "PY",
    tone: "sky",
    repository: "github.com/dolapay/python",
  },
  {
    id: "php",
    name: "PHP & Laravel",
    language: "PHP 8.1+",
    command: "composer require dolapay/php",
    importLine: "use DolaPay\\Client;",
    description: "Intégration rapide pour Laravel, Symfony, WordPress commerce et plateformes marchandes.",
    features: ["Laravel", "PSR-18", "Façade", "Signatures"],
    initials: "PHP",
    tone: "violet",
    repository: "github.com/dolapay/php",
  },
  {
    id: "go",
    name: "Go",
    language: "Go 1.21+",
    command: "go get github.com/dolapay/go",
    importLine: 'import "github.com/dolapay/go"',
    description: "SDK robuste pour services haute performance, jobs de paiement et architectures distribuées.",
    features: ["Context", "Idempotence", "Retries", "Structs"],
    initials: "GO",
    tone: "cyan",
    repository: "github.com/dolapay/go",
  },
];

const toneClasses: Record<Sdk["tone"], string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
};

function CopyCommand({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copié" : "Copier"}
    </button>
  );
}

function SdksPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />

      <main>
        <section className="border-b border-border bg-[linear-gradient(180deg,var(--background)_0%,var(--surface)_100%)] pt-24 sm:pt-28">
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <div className="grid min-w-0 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-10">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                  <PackageCheck className="h-3.5 w-3.5 text-primary" /> SDKs officiels · prêts pour production
                </div>
                <h1 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Intégrez DolaPay avec votre stack préférée.
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-5 sm:text-base lg:text-lg">
                  Des librairies maintenues pour lancer vos encaissements et payouts sans écrire la couche HTTP, les retries ou la vérification webhook vous-même.
                </p>
                <div className="mt-6 grid gap-3 sm:mt-7 sm:flex sm:flex-wrap">
                  <Link to="/developers/api" className="inline-flex min-w-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5">
                    Lire la documentation API <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="https://github.com/dolapay" target="_blank" rel="noreferrer" className="inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted">
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: "Installation", value: "< 2 min", icon: PlugZap },
                  { label: "Langages", value: "4 SDKs", icon: Code2 },
                  { label: "Sécurité", value: "Signé", icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="min-w-0 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4">
                      <Icon className="h-4 w-4 text-primary" />
                      <p className="mt-3 text-lg font-semibold tracking-tight sm:mt-4 sm:text-2xl">{item.value}</p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto min-w-0 max-w-7xl overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            {sdks.map((sdk) => (
              <article key={sdk.id} className="group min-w-0 max-w-full rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant sm:p-6">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ring-1", toneClasses[sdk.tone])}>
                      {sdk.initials}
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate text-xl font-semibold tracking-normal text-foreground">{sdk.name}</h2>
                      <p className="mt-0.5 truncate text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{sdk.language}</p>
                    </div>
                  </div>
                  <a href={`https://${sdk.repository}`} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    stable <ArrowRight className="h-3 w-3" />
                  </a>
                </div>

                <p className="mt-5 min-h-12 text-sm leading-6 text-muted-foreground">{sdk.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {sdk.features.map((feature) => (
                    <span key={feature} className="rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-5 min-w-0 max-w-full overflow-hidden rounded-lg border border-white/10 bg-[#0b1024]">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2 font-mono text-xs text-white/80">
                      <TerminalSquare className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
                      <span className="truncate">{sdk.command}</span>
                    </div>
                    <CopyCommand value={sdk.command} />
                  </div>
                  <div className="px-3 py-3 font-mono text-xs text-white/60">
                    <span className="break-all">{sdk.importLine}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h3 className="text-xl font-semibold tracking-normal">Besoin d'un langage non listé ?</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                L'API REST fonctionne avec n'importe quel client HTTP. Utilisez la référence API pour construire votre intégration Ruby, Java, .NET, Rust ou mobile.
              </p>
            </div>
            <Link to="/developers/api" className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:mt-0">
              Ouvrir la référence <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}