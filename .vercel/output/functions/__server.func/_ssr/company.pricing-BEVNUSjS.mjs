import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { D as Search, Dt as ArrowDownToLine, wt as ArrowUpFromLine, yt as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as Navbar, t as Footer } from "./Footer-CskEc_yW.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
import { a as pm_mtn_png_asset_default, c as pm_zamtel_png_asset_default, i as pm_mpesa_png_asset_default, n as pm_freemoney_png_asset_default, o as pm_orange_png_asset_default, r as pm_moov_png_asset_default, s as pm_vodacom_png_asset_default, t as pm_airtel_webp_asset_default } from "./pm-zamtel.png.asset-BhRuUVcD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.pricing-BEVNUSjS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NETWORK_FEES = [
	{
		country: "Bénin",
		currency: "XOF",
		providers: [{
			name: "MTN",
			collectionFee: "3.2%",
			collectionSplit: "1.2% MMO + 2% DolaPay fee",
			disbursementFee: "2.5%",
			disbursementSplit: "0.5% MMO + 2% DolaPay fee"
		}, {
			name: "MOOV",
			collectionFee: "3.2%",
			collectionSplit: "1.2% MMO + 2% DolaPay fee",
			disbursementFee: "2%",
			disbursementSplit: "2% DolaPay fee"
		}]
	},
	{
		country: "Cameroun",
		currency: "XAF",
		providers: [{
			name: "MTN",
			collectionFee: "2.75%",
			collectionSplit: "0.75% MMO + 2% DolaPay fee",
			disbursementFee: "2.3%",
			disbursementSplit: "0.3% MMO + 2% DolaPay fee"
		}, {
			name: "ORANGE",
			collectionFee: "2.77%",
			collectionSplit: "0.77% MMO + 2% DolaPay fee",
			disbursementFee: "2%",
			disbursementSplit: "2% DolaPay fee"
		}]
	},
	{
		country: "Congo",
		currency: "XAF",
		providers: [{
			name: "AIRTEL",
			collectionFee: "5%",
			collectionSplit: "3% MMO + 2% DolaPay fee",
			disbursementFee: "2%",
			disbursementSplit: "2% DolaPay fee"
		}, {
			name: "MTN",
			collectionFee: "5%",
			collectionSplit: "3% MMO + 2% DolaPay fee",
			disbursementFee: "2%",
			disbursementSplit: "2% DolaPay fee"
		}]
	},
	{
		country: "RDC",
		currency: "CDF",
		providers: [
			{
				name: "AIRTEL",
				collectionFee: "4%",
				collectionSplit: "2% MMO + 2% DolaPay fee",
				disbursementFee: "3%",
				disbursementSplit: "1% MMO + 2% DolaPay fee"
			},
			{
				name: "ORANGE",
				collectionFee: "4%",
				collectionSplit: "2% MMO + 2% DolaPay fee",
				disbursementFee: "2%",
				disbursementSplit: "2% DolaPay fee"
			},
			{
				name: "VODACOM",
				collectionFee: "3.5%",
				collectionSplit: "1.5% MMO + 2% DolaPay fee",
				disbursementFee: "3%",
				disbursementSplit: "1% MMO + 2% DolaPay fee"
			}
		]
	},
	{
		country: "Gabon",
		currency: "XAF",
		providers: [{
			name: "AIRTEL",
			collectionFee: "3%",
			collectionSplit: "1% MMO + 2% DolaPay fee",
			disbursementFee: "2%",
			disbursementSplit: "2% DolaPay fee"
		}]
	},
	{
		country: "Côte d'Ivoire",
		currency: "XOF",
		providers: [{
			name: "MTN",
			collectionFee: "2.8%",
			collectionSplit: "0.8% MMO + 2% DolaPay fee",
			disbursementFee: "2.3%",
			disbursementSplit: "0.3% MMO + 2% DolaPay fee"
		}, {
			name: "ORANGE",
			collectionFee: "3.5%",
			collectionSplit: "1.5% MMO + 2% DolaPay fee",
			disbursementFee: "3%",
			disbursementSplit: "1% MMO + 2% DolaPay fee"
		}]
	},
	{
		country: "Kenya",
		currency: "KES",
		providers: [{
			name: "M-PESA",
			collectionFee: "N/A",
			collectionSplit: "N/A",
			disbursementFee: "N/A",
			disbursementSplit: "N/A"
		}]
	},
	{
		country: "Rwanda",
		currency: "RWF",
		providers: [{
			name: "MTN",
			collectionFee: "4.1%",
			collectionSplit: "2.1% MMO + 2% DolaPay fee",
			disbursementFee: "2% + 60 RWF",
			disbursementSplit: "60 RWF MMO + 2% DolaPay fee"
		}, {
			name: "AIRTEL",
			collectionFee: "3.5%",
			collectionSplit: "1.5% MMO + 2% DolaPay fee",
			disbursementFee: "2%",
			disbursementSplit: "2% DolaPay fee"
		}]
	},
	{
		country: "Sénégal",
		currency: "XOF",
		providers: [{
			name: "ORANGE",
			collectionFee: "3%",
			collectionSplit: "1% MMO + 2% DolaPay fee",
			disbursementFee: "2.8%",
			disbursementSplit: "0.8% MMO + 2% DolaPay fee"
		}, {
			name: "Free",
			collectionFee: "3%",
			collectionSplit: "1% MMO + 2% DolaPay fee",
			disbursementFee: "2.5%",
			disbursementSplit: "0.5% MMO + 2% DolaPay fee"
		}]
	},
	{
		country: "Sierra Leone",
		currency: "SLE",
		providers: [{
			name: "ORANGE",
			collectionFee: "4.3%",
			collectionSplit: "2.3% MMO + 2% DolaPay fee",
			disbursementFee: "3.15%",
			disbursementSplit: "1.15% MMO + 2% DolaPay fee"
		}]
	},
	{
		country: "Ouganda",
		currency: "UGX",
		providers: [{
			name: "MTN",
			collectionFee: "4%",
			collectionSplit: "2% MMO + 2% DolaPay fee",
			disbursementFee: "N/A",
			disbursementSplit: "N/A"
		}, {
			name: "AIRTEL",
			collectionFee: "3.5%",
			collectionSplit: "1.5% MMO + 2% DolaPay fee",
			disbursementFee: "N/A",
			disbursementSplit: "N/A"
		}]
	},
	{
		country: "Zambie",
		currency: "ZMW",
		providers: [{
			name: "MTN",
			collectionFee: "N/A",
			collectionSplit: "N/A",
			disbursementFee: "3% + e-Levy",
			disbursementSplit: "1% MMO + 2% DolaPay fee + e-Levy"
		}, {
			name: "ZAMTEL",
			collectionFee: "N/A",
			collectionSplit: "N/A",
			disbursementFee: "3%",
			disbursementSplit: "1% MMO + 2% DolaPay fee"
		}]
	},
	{
		country: "Burkina Faso",
		currency: "XOF",
		providers: [{
			name: "ORANGE",
			collectionFee: "3.5%",
			collectionSplit: "1.5% MMO + 2% DolaPay fee",
			disbursementFee: "2.8%",
			disbursementSplit: "0.8% MMO + 2% DolaPay fee"
		}, {
			name: "MOOV",
			collectionFee: "3.5%",
			collectionSplit: "1.5% MMO + 2% DolaPay fee",
			disbursementFee: "2.5%",
			disbursementSplit: "0.5% MMO + 2% DolaPay fee"
		}]
	},
	{
		country: "Cartes Bancaires (Panafricain)",
		currency: "Multi-devises",
		providers: [{
			name: "VISA",
			collectionFee: "3.8% + 100 FCFA",
			collectionSplit: "1.8% interchange + 2% DolaPay fee + 100 FCFA",
			disbursementFee: "N/A",
			disbursementSplit: "N/A"
		}, {
			name: "MASTERCARD",
			collectionFee: "3.8% + 100 FCFA",
			collectionSplit: "1.8% interchange + 2% DolaPay fee + 100 FCFA",
			disbursementFee: "N/A",
			disbursementSplit: "N/A"
		}]
	}
];
var PROVIDER_META = {
	MTN: {
		logo: pm_mtn_png_asset_default.url,
		color: "from-yellow-400/30 to-yellow-500/10"
	},
	ORANGE: {
		logo: pm_orange_png_asset_default.url,
		color: "from-orange-500/30 to-orange-600/10"
	},
	MOOV: {
		logo: pm_moov_png_asset_default.url,
		color: "from-sky-500/30 to-blue-600/10"
	},
	AIRTEL: {
		logo: pm_airtel_webp_asset_default.url,
		color: "from-red-500/30 to-rose-600/10"
	},
	VODACOM: {
		logo: pm_vodacom_png_asset_default.url,
		color: "from-red-600/30 to-rose-700/10"
	},
	FREE: {
		logo: pm_freemoney_png_asset_default.url,
		color: "from-emerald-500/30 to-teal-600/10"
	},
	"M-PESA": {
		logo: pm_mpesa_png_asset_default.url,
		color: "from-green-500/30 to-emerald-600/10"
	},
	ZAMTEL: {
		logo: pm_zamtel_png_asset_default.url,
		color: "from-green-600/30 to-lime-600/10"
	},
	VISA: { color: "from-blue-600/30 to-indigo-700/10" },
	MASTERCARD: { color: "from-orange-500/30 to-red-600/10" }
};
function PricingPage() {
	const [mode, setMode] = (0, import_react.useState)("collection");
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const apply = () => {
			const h = window.location.hash.replace("#", "").toLowerCase();
			if (h === "payin" || h === "collection") setMode("collection");
			else if (h === "payout" || h === "disbursement") setMode("disbursement");
		};
		apply();
		window.addEventListener("hashchange", apply);
		return () => window.removeEventListener("hashchange", apply);
	}, []);
	const [query, setQuery] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return NETWORK_FEES;
		return NETWORK_FEES.filter((c) => c.country.toLowerCase().includes(q) || c.currency.toLowerCase().includes(q) || c.providers.some((p) => p.name.toLowerCase().includes(q)));
	}, [query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pt-28 pb-20 sm:pt-32",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-3xl mx-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs",
								children: "Modèle Cost-Plus · 2% + Opérateur"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-4 font-display text-4xl sm:text-5xl font-bold tracking-tight",
								children: [
									"La tarification la plus ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gradient",
										children: "transparente d'Afrique"
									}),
									"."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-muted-foreground",
								children: "Vous ne payez que le juste prix : commission DolaPay fixe + frais réels prélevés par MTN, Orange, Moov, M-Pesa, Airtel ou Vodacom. Aucune marge cachée."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-16 text-center max-w-3xl mx-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl sm:text-3xl font-bold tracking-tight",
							children: "Grille détaillée par opérateur"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Frais MNO réels + commission DolaPay, par pays et par méthode."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: mode,
						onValueChange: (v) => setMode(v),
						className: "mt-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "bg-muted/60 backdrop-blur border border-border p-1 h-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "collection",
										className: "gap-2 px-5 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownToLine, { className: "size-4" }), " Pay-in (Collections)"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "disbursement",
										className: "gap-2 px-5 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpFromLine, { className: "size-4" }), " Pay-out (Disbursements)"]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "collection",
								className: "mt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCard, {
									title: "Encaissez via Mobile Money",
									desc: "Recevez des paiements de vos clients en quelques secondes, partout en Afrique francophone.",
									chip: "À partir de 3.75%"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
								value: "disbursement",
								className: "mt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroCard, {
									title: "Payez vos partenaires",
									desc: "Envoyez des paiements de masse vers tous les portefeuilles Mobile Money supportés.",
									chip: "À partir de 2%"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl sm:text-3xl font-semibold tracking-tight",
								children: "Détail des frais par réseau"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground mt-1 text-sm",
								children: mode === "collection" ? "Frais de collection (Pay-in) par pays et opérateur. Tous les taux affichés incluent notre commission DolaPay fixe de 2%." : "Frais de décaissement (Pay-out) par pays et opérateur. Tous les taux affichés incluent notre commission DolaPay fixe de 2%."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-full sm:w-80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Rechercher un pays (ex : Bénin, Sénégal)",
									className: "pl-9 bg-background/60 backdrop-blur border-border"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							layout: true,
							className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								mode: "popLayout",
								children: filtered.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountryCard, {
									country: c,
									mode
								}, c.country))
							}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-full text-center text-muted-foreground py-10",
								children: [
									"Aucun résultat pour « ",
									query,
									" »."
								]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function HeroCard({ title, desc, chip }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .3 },
		className: "relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background/80 to-muted/40 backdrop-blur p-8 sm:p-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs",
				children: chip
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-2xl sm:text-3xl font-semibold tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground max-w-xl",
				children: desc
			})
		]
	});
}
function CountryCard({ country, mode }) {
	const [open, setOpen] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		layout: true,
		initial: {
			opacity: 0,
			y: 12
		},
		animate: {
			opacity: 1,
			y: 0
		},
		exit: {
			opacity: 0,
			y: -8
		},
		transition: { duration: .25 },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "overflow-hidden border-border bg-background/60 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pt-5 pb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold",
					children: country.country
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [country.currency === "Multi-devises" ? "Multi-devises" : `Devise : ${country.currency}`, " · Commission DolaPay fixe 2%"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium",
					children: [
						country.providers.length,
						" ",
						country.currency === "Multi-devises" ? "réseaux" : "opérateurs"
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "divide-y divide-border/60",
				children: country.providers.map((p) => {
					const key = country.country + p.name;
					const isOpen = open === key;
					const fee = mode === "collection" ? p.collectionFee : p.disbursementFee;
					const split = mode === "collection" ? p.collectionSplit : p.disbursementSplit;
					const meta = PROVIDER_META[p.name.toUpperCase()];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOpen(isOpen ? null : key),
						className: cn("w-full flex items-center gap-3 px-5 py-3 text-left cursor-pointer transition-colors", "hover:bg-muted/40"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("relative size-9 rounded-lg overflow-hidden bg-gradient-to-br border border-border flex items-center justify-center shrink-0", meta?.color ?? "from-muted to-muted/40"),
								children: meta?.logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: meta.logo,
									alt: p.name,
									className: "size-7 object-contain"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold",
									children: p.name
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [mode === "collection" ? "Pay-in" : "Pay-out", (p.name === "VISA" || p.name === "MASTERCARD") && " 3D-Secure"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-base font-semibold tabular-nums",
									children: fee
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180") })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
						initial: false,
						children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								height: 0,
								opacity: 0
							},
							animate: {
								height: "auto",
								opacity: 1
							},
							exit: {
								height: 0,
								opacity: 0
							},
							transition: { duration: .2 },
							className: "overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 pb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground mb-1",
										children: "Décomposition du tarif"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[12px]",
										children: split
									})]
								})
							})
						}, "content")
					})] }, key);
				})
			})]
		})
	});
}
//#endregion
export { PricingPage as component };
