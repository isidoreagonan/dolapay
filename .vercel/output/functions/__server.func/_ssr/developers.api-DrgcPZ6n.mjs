import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { $ as Landmark, D as Search, E as Send, It as Layers, Mt as SquareTerminal, S as ShieldCheck, Tt as ArrowRight, bt as Check, et as KeyRound, jt as TriangleAlert, mt as Copy, r as Webhook, t as Zap, vt as ChevronRight } from "../_libs/lucide-react.mjs";
import { i as Navbar, t as Footer } from "./Footer-CskEc_yW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/developers.api-DrgcPZ6n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var endpoints = [
	{
		id: "charge",
		label: "Créer une charge",
		group: "Encaissements",
		icon: Zap,
		method: "POST",
		path: "/charges",
		title: "Créer une charge Mobile Money",
		summary: "Initiez un paiement depuis un wallet client. DolaPay route la transaction vers l'opérateur disponible selon le pays, la devise et le préfixe téléphonique.",
		params: [
			{
				name: "amount",
				type: "integer",
				required: true,
				description: "Montant à encaisser dans l'unité principale de la devise."
			},
			{
				name: "currency",
				type: "string",
				required: true,
				description: "Devise ISO : XOF, XAF, KES, CDF, RWF, ZMW."
			},
			{
				name: "customer_phone",
				type: "string",
				required: true,
				description: "Numéro client au format international E.164."
			},
			{
				name: "metadata",
				type: "object",
				required: false,
				description: "Références internes, identifiant commande ou contexte métier."
			}
		],
		snippets: {
			curl: `curl -X POST https://api.dola-pay.com/v1/charges \\
  -H "Authorization: Bearer test_sk_dola_xxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "currency": "XOF",
    "customer_phone": "+22961000000",
    "metadata": { "order_id": "ord_9K2" }
  }'`,
			node: `import DolaPay from '@dolapay/node';

const dola = new DolaPay(process.env.DOLAPAY_SECRET_KEY);

const charge = await dola.charges.create({
  amount: 5000,
  currency: 'XOF',
  customer_phone: '+22961000000',
  metadata: { order_id: 'ord_9K2' },
});`,
			python: `import os
import dolapay

dola = dolapay.Client(api_key=os.environ["DOLAPAY_SECRET_KEY"])

charge = dola.charges.create(
    amount=5000,
    currency="XOF",
    customer_phone="+22961000000",
    metadata={"order_id": "ord_9K2"},
)`
		},
		response: `{
  "id": "ch_01J2K8M2P9",
  "status": "pending",
  "amount": 5000,
  "currency": "XOF",
  "operator": "mtn_benin",
  "customer_phone": "+22961000000"
}`
	},
	{
		id: "retrieve",
		label: "Récupérer une charge",
		group: "Encaissements",
		icon: Search,
		method: "GET",
		path: "/charges/:id",
		title: "Consulter le statut d'une charge",
		summary: "Récupérez l'état réel d'un paiement : pending, processing, succeeded, failed ou expired.",
		params: [{
			name: "id",
			type: "string",
			required: true,
			description: "Identifiant unique retourné à la création de la charge."
		}],
		snippets: {
			curl: `curl https://api.dola-pay.com/v1/charges/ch_01J2K8M2P9 \\
  -H "Authorization: Bearer test_sk_dola_xxxxxx"`,
			node: `const charge = await dola.charges.retrieve('ch_01J2K8M2P9');`,
			python: `charge = dola.charges.retrieve("ch_01J2K8M2P9")`
		},
		response: `{
  "id": "ch_01J2K8M2P9",
  "status": "succeeded",
  "amount": 5000,
  "currency": "XOF",
  "settled_at": "2026-06-25T10:33:02Z"
}`
	},
	{
		id: "payout",
		label: "Créer un payout",
		group: "Décaissements",
		icon: Send,
		method: "POST",
		path: "/payouts",
		title: "Envoyer un paiement sortant",
		summary: "Décaissez vers un wallet Mobile Money en conservant une traçabilité complète, l'idempotence et les webhooks de statut.",
		params: [
			{
				name: "amount",
				type: "integer",
				required: true,
				description: "Montant à envoyer au bénéficiaire."
			},
			{
				name: "currency",
				type: "string",
				required: true,
				description: "Devise de l'opération."
			},
			{
				name: "recipient_phone",
				type: "string",
				required: true,
				description: "Numéro du bénéficiaire au format E.164."
			},
			{
				name: "reference",
				type: "string",
				required: false,
				description: "Référence métier affichée dans votre dashboard."
			}
		],
		snippets: {
			curl: `curl -X POST https://api.dola-pay.com/v1/payouts \\
  -H "Authorization: Bearer test_sk_dola_xxxxxx" \\
  -H "Idempotency-Key: payout_2026_001" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "XOF",
    "recipient_phone": "+22961555000"
  }'`,
			node: `const payout = await dola.payouts.create({
  amount: 25000,
  currency: 'XOF',
  recipient_phone: '+22961555000',
});`,
			python: `payout = dola.payouts.create(
    amount=25000,
    currency="XOF",
    recipient_phone="+22961555000",
)`
		},
		response: `{
  "id": "po_01J2K8N3Q1",
  "status": "processing",
  "amount": 25000,
  "currency": "XOF",
  "fee": 75
}`
	},
	{
		id: "webhook",
		label: "Recevoir un webhook",
		group: "Événements",
		icon: Webhook,
		method: "POST",
		path: "/webhooks",
		title: "Traiter les événements en temps réel",
		summary: "Recevez les changements de statut de vos charges et payouts avec signature, timestamp et payload JSON vérifiable.",
		params: [{
			name: "x-dolapay-signature",
			type: "header",
			required: true,
			description: "Signature HMAC envoyée avec chaque événement."
		}, {
			name: "event",
			type: "string",
			required: true,
			description: "Nom de l'événement : charge.succeeded, payout.failed…"
		}],
		snippets: {
			curl: `curl -X POST https://votre-site.com/webhooks/dolapay \\
  -H "x-dolapay-signature: t=...,v1=..." \\
  -d '{ "event": "charge.succeeded" }'`,
			node: `app.post('/webhooks/dolapay', express.raw(), (req, res) => {
  const event = dola.webhooks.verify(req.body, req.headers);
  console.log(event.type);
  res.sendStatus(200);
});`,
			python: `event = dola.webhooks.verify(request.body, request.headers)
print(event.type)
return "ok", 200`
		},
		response: `{
  "event": "charge.succeeded",
  "data": { "id": "ch_01J2K8M2P9" }
}`
	}
];
var groupedEndpoints = endpoints.reduce((acc, endpoint) => {
	acc[endpoint.group] = [...acc[endpoint.group] ?? [], endpoint];
	return acc;
}, {});
var languages = [
	{
		id: "curl",
		label: "cURL"
	},
	{
		id: "node",
		label: "Node.js"
	},
	{
		id: "python",
		label: "Python"
	}
];
function CopyButton({ value, variant = "light" }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => {
			navigator.clipboard.writeText(value);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1400);
		},
		className: cn("inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors", variant === "dark" ? "border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"),
		children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5" }), copied ? "Copié" : "Copier"]
	});
}
function MethodBadge({ method }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex h-5 items-center rounded px-1.5 font-mono text-[10px] font-bold", method === "POST" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"),
		children: method
	});
}
function ApiDocsPage() {
	const [activeId, setActiveId] = (0, import_react.useState)("charge");
	const [language, setLanguage] = (0, import_react.useState)("curl");
	const [query, setQuery] = (0, import_react.useState)("");
	const active = endpoints.find((endpoint) => endpoint.id === activeId) ?? endpoints[0];
	const filteredGroups = (0, import_react.useMemo)(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return groupedEndpoints;
		return Object.entries(groupedEndpoints).reduce((acc, [group, items]) => {
			const matches = items.filter((item) => [
				item.label,
				item.title,
				item.path,
				item.summary
			].some((value) => value.toLowerCase().includes(normalized)));
			if (matches.length) acc[group] = matches;
			return acc;
		}, {});
	}, [query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen overflow-x-hidden bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border bg-[linear-gradient(180deg,var(--background)_0%,var(--surface)_100%)] pt-24 sm:pt-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl gap-8 px-4 pb-10 sm:px-6 sm:pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 max-w-3xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), " API v1 stable · Sandbox disponible"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-5 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl",
								children: "La référence API pour connecter le Mobile Money africain."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-5 sm:text-base lg:text-lg",
								children: "Encaissements, décaissements, statuts et webhooks dans une interface claire, pensée pour les équipes produit et les développeurs."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap gap-3 sm:mt-7",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#reference",
									className: "inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition-transform hover:-translate-y-0.5",
									children: ["Explorer l'API ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/developers/sdks",
									className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted",
									children: "Voir les SDKs"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 rounded-xl border border-border bg-card p-3 shadow-elegant sm:p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 border-b border-border pb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-rose-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-amber-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 truncate font-mono text-xs text-muted-foreground",
									children: "quickstart.sh"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[#0b1024] p-3 font-mono text-[11px] leading-6 text-white/85 sm:mt-4 sm:p-4 sm:text-[13px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: endpoints[0].snippets.curl })
						})]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "reference",
				className: "mx-auto grid min-w-0 max-w-7xl gap-6 overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[260px_minmax(0,1fr)_380px] lg:gap-8 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 lg:hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "Rechercher un endpoint",
								className: "h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/10"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 pb-1",
							children: Object.entries(filteredGroups).flatMap(([, items]) => items).map((item) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setActiveId(item.id),
									className: cn("inline-flex min-w-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors", active.id === item.id ? "border-primary/30 bg-primary/10 text-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethodBadge, { method: item.method }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "min-w-0 truncate",
										children: item.label
									})]
								}, item.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "hidden lg:block lg:sticky lg:top-24 lg:self-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "Rechercher un endpoint",
								className: "h-11 w-full rounded-lg border border-border bg-card pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-4 focus:ring-ring/10"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "mt-5 space-y-6",
							children: Object.entries(filteredGroups).map(([group, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground",
								children: group
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 space-y-1",
								children: items.map((item) => {
									const Icon = item.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setActiveId(item.id),
										className: cn("flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors", active.id === item.id ? "bg-primary/10 text-foreground ring-1 ring-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "min-w-0 flex-1 truncate",
												children: item.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethodBadge, { method: item.method })
										]
									}, item.id);
								})
							})] }, group))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "min-w-0 space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "API" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: active.group }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: active.label
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-4 text-2xl font-semibold tracking-normal text-foreground sm:text-3xl",
										children: active.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 leading-7 text-muted-foreground",
										children: active.summary
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-lg border border-border bg-muted/50 p-3 sm:flex sm:flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MethodBadge, { method: active.method }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", {
												className: "min-w-0 flex-1 break-all font-mono text-sm text-foreground",
												children: ["https://api.dola-pay.com/v1", active.path]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { value: `https://api.dola-pay.com/v1${active.path}` })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "flex items-center gap-2 font-semibold tracking-normal",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-primary" }), " Authentification"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-6 text-muted-foreground",
										children: "Ajoutez votre clé secrète dans l'en-tête Authorization. Utilisez les clés test pour vos intégrations sandbox et les clés live uniquement côté serveur."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 rounded-lg bg-[#0b1024] p-4 font-mono text-xs text-white/85 sm:text-[13px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-white/45",
												children: "Authorization:"
											}),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-300",
												children: "Bearer"
											}),
											" test_sk_dola_xxxxxx"
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold tracking-normal",
									children: "Paramètres"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 overflow-hidden rounded-lg border border-border",
									children: active.params.map((param) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid gap-2 border-b border-border p-4 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex min-w-0 items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "break-all font-mono text-sm text-primary",
												children: param.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded px-1.5 py-0.5 text-[10px] font-semibold", param.required ? "bg-rose-100 text-rose-700" : "bg-muted text-muted-foreground"),
												children: param.required ? "requis" : "optionnel"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground",
											children: param.type
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm leading-6 text-foreground/80",
											children: param.description
										})] })]
									}, param.name))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card p-5 shadow-sm sm:p-7",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold tracking-normal",
										children: "Réponse exemple"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { value: active.response })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-4 overflow-hidden whitespace-pre-wrap break-words rounded-lg bg-[#0b1024] p-4 font-mono text-xs leading-6 text-white/85 sm:text-[13px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: active.response })
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "min-w-0 lg:sticky lg:top-24 lg:self-start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "overflow-hidden rounded-xl border border-border bg-card shadow-elegant",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-3 py-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex min-w-0 items-center gap-2 text-xs text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareTerminal, { className: "h-4 w-4" }),
												" request.",
												language === "python" ? "py" : language === "node" ? "js" : "sh"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyButton, { value: active.snippets[language] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex border-b border-border bg-muted/30 px-2",
										children: languages.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setLanguage(item.id),
											className: cn("border-b-2 px-3 py-2 text-xs font-semibold transition-colors", language === item.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"),
											children: item.label
										}, item.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
										className: "max-h-[540px] overflow-auto whitespace-pre-wrap break-all bg-[#0b1024] p-4 font-mono text-xs leading-6 text-white/85 sm:text-[13px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: active.snippets[language] })
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card p-4 shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "h-4 w-4 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground",
											children: "Base URL"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 break-all font-mono text-xs",
											children: "api.dola-pay.com/v1"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card p-4 shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground",
											children: "Format"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 font-mono text-xs",
											children: "JSON REST"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm leading-6",
										children: "Ne placez jamais une clé live dans le navigateur. Les appels sensibles doivent partir de votre serveur."
									})]
								})
							})
						]
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { ApiDocsPage as component };
