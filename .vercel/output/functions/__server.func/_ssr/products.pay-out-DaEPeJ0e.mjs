import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { E as Send, Lt as Earth, Tt as ArrowRight, bt as Check, t as Zap } from "../_libs/lucide-react.mjs";
import { i as Navbar, t as Footer } from "./Footer-CskEc_yW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products.pay-out-DaEPeJ0e.js
var import_jsx_runtime = require_jsx_runtime();
var CODE = `// Bulk payout vers 250 destinataires en une requête
await fetch("https://api.dola-pay.com/v1/payouts/batch", {
  method: "POST",
  headers: { "Authorization": "Bearer sk_live_***" },
  body: JSON.stringify({
    currency: "XOF",
    destinations: [
      { network: "mtn_bj", phone: "+22990000000", amount: 25000 },
      { network: "orange_ci", phone: "+22507000000", amount: 18000 },
      { network: "mpesa_ke", phone: "+254700000000", amount: 5000 },
      // ... jusqu'à 5 000 lignes par batch
    ],
    // 1% DolaPay + frais réseau réels — wallet→wallet = 0%
  }),
});`;
function PayOutPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pt-28 pb-20 sm:pt-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3 w-3" }), " Décaissements (Pay-out)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: "Décaissez en bulk à "
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "1% + Réseau"
								}),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-2xl text-muted-foreground",
							children: "REST API unique pour pousser des paiements instantanés vers Mobile Money et comptes bancaires sur 12 économies africaines. Wallet-to-wallet DolaPay : 0%, instantané."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auth/sign-up",
								className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform",
								children: ["Démarrer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/developers",
								className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent",
								children: "Documentation API"
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-14 grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: Zap,
								title: "Instantané",
								desc: "Settlement sous 30 secondes vers MNO et comptes bancaires."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: Earth,
								title: "12 économies",
								desc: "MTN, Orange, Moov, M-Pesa, Airtel, Vodacom — un seul endpoint."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: Send,
								title: "Wallet 0%",
								desc: "Transferts wallet-to-wallet DolaPay gratuits et instantanés."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mt-14",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
							title: "POST /v1/payouts/batch",
							code: CODE
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-14 rounded-3xl border border-border bg-card p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-bold sm:text-2xl",
							children: "Grille décaissements transparente"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-3 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Mobile Money & banque",
									value: "1,0% + Réseau"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Wallet-to-wallet DolaPay",
									value: "0% Gratuit",
									highlight: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Enterprise (sur devis)",
									value: "< 1% + Réseau"
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Feature({ icon: Icon, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 font-semibold text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-sm text-muted-foreground",
				children: desc
			})
		]
	});
}
function Row({ label, value, highlight }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border p-4 ${highlight ? "border-primary/40 bg-primary/5" : "border-border bg-background"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-display text-2xl font-bold text-foreground",
			children: value
		})]
	});
}
function CodeBlock({ title, code }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-2xl border border-border bg-zinc-950 text-zinc-100 shadow-elegant",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-white/10 px-4 py-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-red-500/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-amber-400/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2.5 w-2.5 rounded-full bg-emerald-500/80" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[11px] font-medium uppercase tracking-wider text-zinc-400",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " 200 OK"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "overflow-x-auto px-4 py-4 text-[12px] leading-relaxed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: code })
		})]
	});
}
//#endregion
export { PayOutPage as component };
