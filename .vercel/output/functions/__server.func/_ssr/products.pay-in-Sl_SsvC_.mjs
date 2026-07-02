import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { Nt as Sparkles, S as ShieldCheck, Tt as ArrowRight, bt as Check, f as TrendingDown, i as Wallet, t as Zap } from "../_libs/lucide-react.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { i as Navbar, t as Footer } from "./Footer-CskEc_yW.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/radix-ui__react-slider.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products.pay-in-Sl_SsvC_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var PAYIN_OPERATORS = [
	{
		id: "mtn_bj",
		network: "MTN",
		country: "Bénin",
		countryCode: "BJ",
		currency: "XOF",
		operatorFee: .012,
		payoutFee: .005
	},
	{
		id: "moov_bj",
		network: "Moov",
		country: "Bénin",
		countryCode: "BJ",
		currency: "XOF",
		operatorFee: .012,
		payoutFee: 0
	},
	{
		id: "mtn_ci",
		network: "MTN",
		country: "Côte d'Ivoire",
		countryCode: "CI",
		currency: "XOF",
		operatorFee: .008,
		payoutFee: .003
	},
	{
		id: "orange_ci",
		network: "Orange",
		country: "Côte d'Ivoire",
		countryCode: "CI",
		currency: "XOF",
		operatorFee: .015,
		payoutFee: .01
	},
	{
		id: "moov_ci",
		network: "Moov",
		country: "Côte d'Ivoire",
		countryCode: "CI",
		currency: "XOF",
		operatorFee: .012,
		payoutFee: .005
	},
	{
		id: "orange_sn",
		network: "Orange",
		country: "Sénégal",
		countryCode: "SN",
		currency: "XOF",
		operatorFee: .01,
		payoutFee: .008
	},
	{
		id: "free_sn",
		network: "Free",
		country: "Sénégal",
		countryCode: "SN",
		currency: "XOF",
		operatorFee: .01,
		payoutFee: .005
	},
	{
		id: "orange_bf",
		network: "Orange",
		country: "Burkina Faso",
		countryCode: "BF",
		currency: "XOF",
		operatorFee: .015,
		payoutFee: .008
	},
	{
		id: "moov_bf",
		network: "Moov",
		country: "Burkina Faso",
		countryCode: "BF",
		currency: "XOF",
		operatorFee: .012,
		payoutFee: .005
	},
	{
		id: "mtn_gh",
		network: "MTN",
		country: "Ghana",
		countryCode: "GH",
		currency: "GHS",
		operatorFee: .01,
		payoutFee: .005
	},
	{
		id: "mtn_cm",
		network: "MTN",
		country: "Cameroun",
		countryCode: "CM",
		currency: "XAF",
		operatorFee: .0075,
		payoutFee: .003
	},
	{
		id: "orange_cm",
		network: "Orange",
		country: "Cameroun",
		countryCode: "CM",
		currency: "XAF",
		operatorFee: .0077,
		payoutFee: 0
	},
	{
		id: "vodacom_cd",
		network: "Vodacom",
		country: "RDC",
		countryCode: "CD",
		currency: "CDF",
		operatorFee: .015,
		payoutFee: .01
	},
	{
		id: "mpesa_ke",
		network: "M-Pesa",
		country: "Kenya",
		countryCode: "KE",
		currency: "KES",
		operatorFee: .015,
		payoutFee: .01
	},
	{
		id: "mtn_rw",
		network: "MTN",
		country: "Rwanda",
		countryCode: "RW",
		currency: "RWF",
		operatorFee: .021,
		payoutFee: .012
	},
	{
		id: "airtel_rw",
		network: "Airtel",
		country: "Rwanda",
		countryCode: "RW",
		currency: "RWF",
		operatorFee: .015,
		payoutFee: 0
	},
	{
		id: "mtn_ug",
		network: "MTN",
		country: "Ouganda",
		countryCode: "UG",
		currency: "UGX",
		operatorFee: .02,
		payoutFee: .01
	},
	{
		id: "airtel_ug",
		network: "Airtel",
		country: "Ouganda",
		countryCode: "UG",
		currency: "UGX",
		operatorFee: .015,
		payoutFee: .01
	},
	{
		id: "mpesa_tz",
		network: "M-Pesa",
		country: "Tanzanie",
		countryCode: "TZ",
		currency: "TZS",
		operatorFee: .018,
		payoutFee: .012
	},
	{
		id: "airtel_zm",
		network: "Airtel",
		country: "Zambie",
		countryCode: "ZM",
		currency: "ZMW",
		operatorFee: .012,
		payoutFee: .008
	}
];
var PLATFORM_FEES = {
	payinStandard: .02,
	payinEnterprise: .015,
	payout: .01,
	walletToWallet: 0,
	card: {
		rate: .025,
		flatXof: 100
	},
	enterpriseThresholdXof: 5e7
};
var COMPETITOR_FLAT_RATE = .035;
function computePayinFees(volume, operator) {
	const tier = volume >= PLATFORM_FEES.enterpriseThresholdXof ? "enterprise" : "standard";
	const platformRate = tier === "enterprise" ? PLATFORM_FEES.payinEnterprise : PLATFORM_FEES.payinStandard;
	const operatorRate = operator.operatorFee;
	const operatorFee = volume * operatorRate;
	const platformFee = volume * platformRate;
	const total = operatorFee + platformFee;
	const competitor = volume * COMPETITOR_FLAT_RATE;
	return {
		volume,
		operatorFee,
		platformFee,
		total,
		net: volume - total,
		tier,
		platformRate,
		operatorRate,
		competitor,
		savings: competitor - total
	};
}
function fmtMoney(n, currency = "FCFA") {
	return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n))} ${currency}`;
}
function fmtPct(rate) {
	return `${(rate * 100).toLocaleString("fr-FR", { maximumFractionDigits: 2 })}%`;
}
var MIN = 1e5;
var MAX = 1e8;
var STEP = 1e5;
function HonestFeeSimulator() {
	const [volume, setVolume] = (0, import_react.useState)(1e7);
	const [operatorId, setOperatorId] = (0, import_react.useState)(PAYIN_OPERATORS[0].id);
	const operator = (0, import_react.useMemo)(() => PAYIN_OPERATORS.find((o) => o.id === operatorId) ?? PAYIN_OPERATORS[0], [operatorId]);
	const fees = (0, import_react.useMemo)(() => computePayinFees(volume, operator), [volume, operator]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-3xl border border-border bg-card/70 p-5 backdrop-blur-xl shadow-elegant sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/15 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " Simulateur honnête"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
								children: "Calculez le juste prix, en direct."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Commission DolaPay fixe + frais réels de l'opérateur. Aucun coût caché."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Volume mensuel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xl font-bold tabular-nums text-foreground",
									children: fmtMoney(volume)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
								value: [volume],
								min: MIN,
								max: MAX,
								step: STEP,
								onValueChange: (v) => setVolume(v[0]),
								className: "mt-4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex justify-between text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtMoney(MIN) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmtMoney(MAX) })]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Réseau Mobile Money"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: operatorId,
							onChange: (e) => setOperatorId(e.target.value),
							className: "mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40",
							children: PAYIN_OPERATORS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: o.id,
								children: [
									o.network,
									" · ",
									o.country,
									" — opérateur ",
									fmtPct(o.operatorFee)
								]
							}, o.id))
						})] }),
						fees.tier === "enterprise" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base",
								children: "👑"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-amber-700 dark:text-amber-300",
								children: "Palier Enterprise activé"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-amber-700/80 dark:text-amber-200/80",
								children: [
									"Volume > ",
									fmtMoney(PLATFORM_FEES.enterpriseThresholdXof),
									" : commission DolaPay réduite à ",
									fmtPct(PLATFORM_FEES.payinEnterprise),
									"."
								]
							})] })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { duration: .25 },
					className: "rounded-2xl border border-border bg-background/80 p-5 shadow-sm sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Volume encaissé",
							value: fmtMoney(volume),
							bold: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: `Frais opérateur réels (${fmtPct(operator.operatorFee)})`,
							value: `- ${fmtMoney(fees.operatorFee)}`,
							sub: `${operator.network} ${operator.country}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: `Commission DolaPay (${fmtPct(fees.platformRate)})`,
							value: `- ${fmtMoney(fees.platformFee)}`,
							sub: fees.tier === "enterprise" ? "Tarif Enterprise" : "Tarif Standard"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Divider, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Total frais DolaPay"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Soit ",
									fmtPct(fees.total / volume || 0),
									" tout compris"
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-2xl font-bold text-foreground tabular-nums",
								children: fmtMoney(fees.total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300",
										children: "Économie vs concurrence (~3,5% flat)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-display text-xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400",
									children: ["+ ", fmtMoney(Math.max(0, fees.savings))]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 text-[11px] text-emerald-700/80 dark:text-emerald-300/80",
								children: [
									"Concurrent traditionnel : ",
									fmtMoney(fees.competitor),
									" · DolaPay : ",
									fmtMoney(fees.total)
								]
							})]
						})
					]
				}, `${volume}-${operatorId}`)]
			})
		]
	});
}
function Row({ label, value, sub, bold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `text-sm ${bold ? "font-semibold text-foreground" : "text-muted-foreground"}`,
				children: label
			}), sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] text-muted-foreground",
				children: sub
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `tabular-nums ${bold ? "font-display text-lg font-bold text-foreground" : "text-sm font-semibold text-foreground"}`,
			children: value
		})]
	});
}
function Divider() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-1 h-px bg-border" });
}
var CODE_MM = `// Initier un paiement Orange Money Burkina Faso 🇧🇫
await fetch("https://api.dola-pay.com/v1/charges", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_***",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    amount: 25000,
    currency: "XOF",
    method: "mobile_money",
    network: "orange_bf",
    customer: { phone: "+22670000000" },
    // 2% DolaPay + 1.5% Orange = 3.5% tout compris
  }),
});`;
var CODE_CARD = `// Encaisser une carte Visa via 3D-Secure
await fetch("https://api.dola-pay.com/v1/charges", {
  method: "POST",
  headers: { "Authorization": "Bearer sk_live_***" },
  body: JSON.stringify({
    amount: 50000,
    currency: "XOF",
    method: "card",
    card: { token: "tok_visa_***" },
    secure: "3ds",
    // 2.5% + 100 FCFA + interchange bancaire
  }),
});`;
function PayInPage() {
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-3 w-3" }), " Encaissements (Pay-in)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: "Encaissez en "
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "2% + Opérateur"
								}),
								".",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground",
									children: " Rien d'autre."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-2xl text-muted-foreground",
							children: "Mobile Money & cartes Visa/Mastercard sur 12 économies. Commission DolaPay fixe + frais réels MTN, Orange, Moov, M-Pesa, Airtel, Vodacom. Aucun markup."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auth/sign-up",
								className: "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform",
								children: ["Démarrer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/company/pricing",
								className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent",
								children: "Grille tarifaire"
							})]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-14 grid gap-4 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: Wallet,
								title: "2% + Opérateur",
								desc: "Tarif unique pan-africain. 1,5% au-delà de 50M FCFA/mois."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: ShieldCheck,
								title: "3D-Secure inclus",
								desc: "Anti-fraude carte et challenge bancaire activés par défaut."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
								icon: Zap,
								title: "Webhooks < 200ms",
								desc: "Confirmation temps réel pour chaque transaction settled."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-14 grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
							title: "Mobile Money · Orange Burkina 🇧🇫",
							code: CODE_MM
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
							title: "Carte Visa · 3D-Secure",
							code: CODE_CARD
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-16",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-2xl font-bold sm:text-3xl",
								children: "Simulez vos frais en direct"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Comparez instantanément face à la concurrence traditionnelle."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HonestFeeSimulator, {})
							})
						]
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
export { PayInPage as component };
