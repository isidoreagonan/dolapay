import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { H as MessageCircle, S as ShieldCheck, Tt as ArrowRight, X as Link$1, bt as Check, st as FileText, t as Zap } from "../_libs/lucide-react.mjs";
import { i as Navbar, t as Footer } from "./Footer-CskEc_yW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products.payment-links-DzNNyxY8.js
var import_jsx_runtime = require_jsx_runtime();
var phone_hero_png_asset_default = {
	version: 1,
	asset_id: "10839915-bfe5-40e8-8fe3-9c7fe5c28e85",
	project_id: "9199219f-5519-4806-b061-ab4db3378b15",
	url: "/__l5e/assets-v1/10839915-bfe5-40e8-8fe3-9c7fe5c28e85/phone-hero.png",
	r2_key: "a/v1/9199219f-5519-4806-b061-ab4db3378b15/10839915-bfe5-40e8-8fe3-9c7fe5c28e85/phone-hero.png",
	original_filename: "phone-hero.png",
	size: 195996,
	content_type: "image/png",
	created_at: "2026-06-28T00:58:50Z"
};
var BENEFITS = [
	{
		icon: Zap,
		title: "Encaissez sans site web",
		desc: "Créez une page de paiement brandée en 60 secondes. Pas de développeur, pas d'hébergement, pas de prise de tête."
	},
	{
		icon: FileText,
		title: "Facturation automatisée",
		desc: "Liens récurrents, liens expirants et reçus PDF générés automatiquement et envoyés à vos clients."
	},
	{
		icon: ShieldCheck,
		title: "Sécurité bancaire",
		desc: "Chaque lien est protégé PCI-DSS avec scoring de fraude intégré sur chaque transaction."
	},
	{
		icon: MessageCircle,
		title: "Partagez partout",
		desc: "WhatsApp, SMS, DM Instagram, e-mail — vos clients paient sur le canal qu'ils utilisent déjà."
	}
];
function PaymentLinksPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-44",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-grid opacity-60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-float" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto grid max-w-7xl gap-10 px-4 sm:gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, { className: "h-3.5 w-3.5 text-primary" }), " Liens de paiement sans code"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: "Partagez un lien."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient",
										children: "Encaissez instantanément."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 max-w-xl text-lg text-muted-foreground",
								children: "Pas de site, pas de code, pas d'attente. Générez un lien de paiement en quelques secondes et commencez à recevoir Mobile Money et cartes partout en Afrique."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/auth/sign-up",
									className: "group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02]",
									children: ["Créer votre premier lien ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/company/contact",
									className: "rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-accent",
									children: "Réserver une démo"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-10 space-y-2 text-sm text-muted-foreground",
								children: [
									"Aucun frais d'installation",
									"Aucun minimum mensuel",
									"Encaissement instantané sur votre wallet"
								].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary" }), t]
								}, t))
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneMock, {})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary",
							children: "Avantages"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-4xl font-bold tracking-tight sm:text-5xl",
							children: "Pensé pour les entreprises sans équipe tech."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-14 grid gap-5 sm:grid-cols-2",
						children: BENEFITS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "group rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elegant",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.icon, { className: "h-5 w-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-5 text-xl font-bold text-foreground",
									children: b.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: b.desc
								})
							]
						}, b.title))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function PhoneMock() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-10 sm:-inset-16 -z-10 rounded-full bg-primary/30 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-16 sm:-inset-24 -z-10 rounded-full bg-cyan-500/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute -left-2 top-10 z-20 hidden rounded-2xl border border-border bg-card/90 px-3 py-2 shadow-elegant backdrop-blur-md sm:flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-7 w-7 place-items-center rounded-full bg-emerald-500/15 text-emerald-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold text-foreground",
						children: "Paiement reçu"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: "+ 25 000 XOF"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute -right-2 bottom-16 z-20 hidden rounded-2xl border border-border bg-card/90 px-3 py-2 shadow-elegant backdrop-blur-md sm:flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link$1, { className: "h-3.5 w-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] leading-tight",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-bold text-foreground",
						children: "dolapay.link/abc"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: "Lien partagé"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: phone_hero_png_asset_default.url,
					alt: "Application DolaPay sur mobile",
					draggable: false,
					onContextMenu: (e) => e.preventDefault(),
					className: "relative z-10 w-full select-none pointer-events-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 z-20",
					onContextMenu: (e) => e.preventDefault(),
					onDragStart: (e) => e.preventDefault()
				})]
			})
		]
	});
}
//#endregion
export { PaymentLinksPage as component };
