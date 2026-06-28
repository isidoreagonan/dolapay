import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { Mt as SquareTerminal, Pt as PlugZap, R as PackageCheck, Rt as CodeXml, S as ShieldCheck, Tt as ArrowRight, bt as Check, mt as Copy, ot as Github } from "../_libs/lucide-react.mjs";
import { i as Navbar, t as Footer } from "./Footer-CskEc_yW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developers.sdks-C_4BDTWl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var sdks = [
	{
		id: "node",
		name: "Node.js",
		language: "JavaScript / TypeScript",
		command: "npm install @dolapay/node",
		importLine: "import DolaPay from '@dolapay/node'",
		description: "SDK typé pour applications Node 18+, backends serverless et plateformes e-commerce.",
		features: [
			"Types natifs",
			"ESM + CJS",
			"Retries",
			"Webhooks"
		],
		initials: "JS",
		tone: "emerald",
		repository: "github.com/dolapay/node"
	},
	{
		id: "python",
		name: "Python",
		language: "Python 3.8+",
		command: "pip install dolapay",
		importLine: "import dolapay",
		description: "Client simple pour backends Django, FastAPI, scripts de finance et pipelines opérationnels.",
		features: [
			"Sync / async",
			"Type hints",
			"Pagination",
			"Sandbox"
		],
		initials: "PY",
		tone: "sky",
		repository: "github.com/dolapay/python"
	},
	{
		id: "php",
		name: "PHP & Laravel",
		language: "PHP 8.1+",
		command: "composer require dolapay/php",
		importLine: "use DolaPay\\Client;",
		description: "Intégration rapide pour Laravel, Symfony, WordPress commerce et plateformes marchandes.",
		features: [
			"Laravel",
			"PSR-18",
			"Façade",
			"Signatures"
		],
		initials: "PHP",
		tone: "violet",
		repository: "github.com/dolapay/php"
	},
	{
		id: "go",
		name: "Go",
		language: "Go 1.21+",
		command: "go get github.com/dolapay/go",
		importLine: "import \"github.com/dolapay/go\"",
		description: "SDK robuste pour services haute performance, jobs de paiement et architectures distribuées.",
		features: [
			"Context",
			"Idempotence",
			"Retries",
			"Structs"
		],
		initials: "GO",
		tone: "cyan",
		repository: "github.com/dolapay/go"
	}
];
var toneClasses = {
	emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
	sky: "bg-sky-50 text-sky-700 ring-sky-200",
	violet: "bg-violet-50 text-violet-700 ring-violet-200",
	cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200"
};
function CopyCommand({ value }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => {
			navigator.clipboard.writeText(value);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1400);
		},
		className: "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white",
		children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied ? "Copié" : "Copier"]
	});
}
function SdksPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen overflow-x-hidden bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border bg-[linear-gradient(180deg,var(--background)_0%,var(--surface)_100%)] pt-24 sm:pt-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid min-w-0 gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:gap-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCheck, { className: "h-3.5 w-3.5 text-primary" }), " SDKs officiels · prêts pour production"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl",
									children: "Intégrez DolaPay avec votre stack préférée."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-5 sm:text-base lg:text-lg",
									children: "Des librairies maintenues pour lancer vos encaissements et payouts sans écrire la couche HTTP, les retries ou la vérification webhook vous-même."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 grid gap-3 sm:mt-7 sm:flex sm:flex-wrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/developers/api",
										className: "inline-flex min-w-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5",
										children: ["Lire la documentation API ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: "https://github.com/dolapay",
										target: "_blank",
										rel: "noreferrer",
										className: "inline-flex min-w-0 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Github, { className: "h-4 w-4" }), " GitHub"]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid min-w-0 grid-cols-3 gap-2 sm:gap-3",
							children: [
								{
									label: "Installation",
									value: "< 2 min",
									icon: PlugZap
								},
								{
									label: "Langages",
									value: "4 SDKs",
									icon: CodeXml
								},
								{
									label: "Sécurité",
									value: "Signé",
									icon: ShieldCheck
								}
							].map((item) => {
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 rounded-xl border border-border bg-card p-3 shadow-sm sm:p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-lg font-semibold tracking-tight sm:mt-4 sm:text-2xl",
											children: item.value
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground sm:text-xs",
											children: item.label
										})
									]
								}, item.label);
							})
						})]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto min-w-0 max-w-7xl overflow-hidden px-4 py-10 sm:px-6 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid min-w-0 gap-5 md:grid-cols-2",
					children: sdks.map((sdk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "group min-w-0 max-w-full rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-elegant sm:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex min-w-0 items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold ring-1", toneClasses[sdk.tone]),
										children: sdk.initials
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "truncate text-xl font-semibold tracking-normal text-foreground",
											children: sdk.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 truncate text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground",
											children: sdk.language
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: `https://${sdk.repository}`,
									target: "_blank",
									rel: "noreferrer",
									className: "inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
									children: ["stable ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-5 min-h-12 text-sm leading-6 text-muted-foreground",
								children: sdk.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								children: sdk.features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground",
									children: feature
								}, feature))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 min-w-0 max-w-full overflow-hidden rounded-lg border border-white/10 bg-[#0b1024]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-white/10 px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex min-w-0 items-center gap-2 font-mono text-xs text-white/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareTerminal, { className: "h-3.5 w-3.5 shrink-0 text-emerald-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: sdk.command
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyCommand, { value: sdk.command })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-3 py-3 font-mono text-xs text-white/60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "break-all",
										children: sdk.importLine
									})
								})]
							})
						]
					}, sdk.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-semibold tracking-normal",
						children: "Besoin d'un langage non listé ?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-6 text-muted-foreground",
						children: "L'API REST fonctionne avec n'importe quel client HTTP. Utilisez la référence API pour construire votre intégration Ruby, Java, .NET, Rust ou mobile."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/developers/api",
						className: "mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:mt-0",
						children: ["Ouvrir la référence ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { SdksPage as component };
