import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { F as Radar, It as Layers, J as Lock, L as Plus, S as ShieldCheck, T as Server, Tt as ArrowRight, bt as Check, c as UserCheck, i as Wallet, t as Zap } from "../_libs/lucide-react.mjs";
import "./supported-countries-CoIgmV1m.mjs";
import { i as Navbar, t as Footer } from "./Footer-CskEc_yW.mjs";
import { t as Reveal } from "./Reveal-BBiBtf47.mjs";
import { a as pm_mtn_png_asset_default, c as pm_zamtel_png_asset_default, i as pm_mpesa_png_asset_default, n as pm_freemoney_png_asset_default, o as pm_orange_png_asset_default, r as pm_moov_png_asset_default, s as pm_vodacom_png_asset_default, t as pm_airtel_webp_asset_default } from "./pm-zamtel.png.asset-BhRuUVcD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DarkM0Ah.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var POSITIONS = {
	SN: {
		x: 6,
		y: 22,
		size: 64
	},
	CI: {
		x: 18,
		y: 48,
		size: 72
	},
	BJ: {
		x: 32,
		y: 26,
		size: 56
	},
	SL: {
		x: 4,
		y: 62,
		size: 52
	},
	CM: {
		x: 48,
		y: 56,
		size: 68
	},
	GA: {
		x: 34,
		y: 74,
		size: 58
	},
	CG: {
		x: 50,
		y: 86,
		size: 54
	},
	CD: {
		x: 64,
		y: 64,
		size: 80
	},
	UG: {
		x: 76,
		y: 38,
		size: 64
	},
	RW: {
		x: 82,
		y: 60,
		size: 56
	},
	KE: {
		x: 94,
		y: 24,
		size: 72
	},
	ZM: {
		x: 70,
		y: 92,
		size: 56
	}
};
var BUBBLES = [];
var LINES = [
	["SN", "CI"],
	["CI", "BJ"],
	["CI", "SL"],
	["BJ", "CM"],
	["CM", "GA"],
	["GA", "CG"],
	["CG", "CD"],
	["CD", "UG"],
	["UG", "KE"],
	["UG", "RW"],
	["CD", "ZM"],
	["CM", "UG"]
];
function CountriesConstellation({ countries }) {
	Object.fromEntries(countries.map((c) => [c.code, c]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto w-full max-w-[1100px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden rounded-3xl border border-border bg-card/70 p-3 shadow-elegant backdrop-blur sm:hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-grid opacity-20" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative grid grid-cols-2 gap-2",
					children: countries.map((c) => {
						const flagCode = c.code.toLowerCase();
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-2xl border border-border bg-background/80 px-2.5 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-card bg-card text-xl shadow-sm ring-1 ring-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: `https://flagcdn.com/w80/${flagCode}.png`,
									srcSet: `https://flagcdn.com/w160/${flagCode}.png 2x`,
									alt: c.name,
									className: "absolute inset-0 h-full w-full object-cover",
									loading: "lazy",
									onError: (e) => {
										e.currentTarget.style.display = "none";
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									children: c.flag
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-[13px] font-bold leading-tight text-foreground",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-[11px] font-semibold leading-tight text-primary",
									children: c.currency
								})]
							})]
						}, c.code);
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto hidden aspect-[2/1] w-full sm:block",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -inset-10 rounded-[50%] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_65%)] blur-2xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "absolute inset-0 h-full w-full",
					viewBox: "0 0 100 100",
					preserveAspectRatio: "none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "lineGrad",
						x1: "0",
						y1: "0",
						x2: "1",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "hsl(var(--primary))",
							stopOpacity: "0.6"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "hsl(var(--primary))",
							stopOpacity: "0.15"
						})]
					}) }), LINES.map(([a, b], i) => {
						const pa = POSITIONS[a];
						const pb = POSITIONS[b];
						if (!pa || !pb) return null;
						const mx = (pa.x + pb.x) / 2;
						const my = (pa.y + pb.y) / 2 - 6;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							d: `M ${pa.x} ${pa.y} Q ${mx} ${my} ${pb.x} ${pb.y}`,
							fill: "none",
							stroke: "url(#lineGrad)",
							strokeWidth: "0.25",
							strokeDasharray: "0.8 0.8",
							vectorEffect: "non-scaling-stroke"
						}, i);
					})]
				}),
				BUBBLES.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `absolute -translate-x-1/2 -translate-y-1/2 animate-fade-in ${b.hideOnMobile ? "hidden sm:block" : ""}`,
					style: {
						left: `${b.x}%`,
						top: `${b.y}%`,
						animationDelay: `${i * 200}ms`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-1 shadow-elegant sm:gap-2 sm:px-3 sm:py-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm leading-none sm:text-base",
							children: b.emoji
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-[10px] font-semibold text-foreground sm:text-xs whitespace-nowrap",
							children: b.text
						})]
					})
				}, i)),
				countries.map((c) => {
					const p = POSITIONS[c.code];
					if (!p) return null;
					const size = p.size ?? 56;
					const flagCode = c.code.toLowerCase();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group absolute -translate-x-1/2 -translate-y-1/2",
						style: {
							left: `${p.x}%`,
							top: `${p.y}%`,
							animation: `float-soft 6s ease-in-out ${(p.x + p.y) % 4}s infinite`
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative grid cursor-pointer place-items-center overflow-hidden rounded-full border-[3px] border-card bg-card shadow-elegant ring-1 ring-border transition-all duration-300 hover:scale-110 hover:ring-primary hover:shadow-glow",
								style: {
									width: `clamp(36px, ${size / 9}vw, ${size}px)`,
									height: `clamp(36px, ${size / 9}vw, ${size}px)`,
									fontSize: `clamp(20px, ${size / 18}vw, ${size / 2}px)`
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: `https://flagcdn.com/w160/${flagCode}.png`,
									srcSet: `https://flagcdn.com/w320/${flagCode}.png 2x`,
									alt: c.name,
									className: "absolute inset-0 h-full w-full object-cover",
									loading: "lazy",
									onError: (e) => {
										e.currentTarget.style.display = "none";
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": true,
									className: "leading-none",
									children: c.flag
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100",
								children: [
									c.name,
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: c.currency
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 animate-ping rounded-full bg-emerald-500/60" })
							})
						]
					}, c.code);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes float-soft {
          0%, 100% { transform: translate(-50%, -50%); }
          50% { transform: translate(-50%, calc(-50% - 8px)); }
        }
      ` })
			]
		})]
	});
}
var hero_entrepreneur_default = "/assets/hero-entrepreneur-D-27r4RK.png";
var partner_ligdicash_png_asset_default = {
	version: 1,
	asset_id: "fdac0adb-3dcc-49d2-9873-ff8832003738",
	project_id: "9199219f-5519-4806-b061-ab4db3378b15",
	url: "/__l5e/assets-v1/fdac0adb-3dcc-49d2-9873-ff8832003738/LIGDICASH.png",
	r2_key: "a/v1/9199219f-5519-4806-b061-ab4db3378b15/fdac0adb-3dcc-49d2-9873-ff8832003738/LIGDICASH.png",
	original_filename: "LIGDICASH.png",
	size: 63385,
	content_type: "image/png",
	created_at: "2026-06-26T19:53:00Z"
};
var partner_pawapay_png_asset_default = {
	version: 1,
	asset_id: "128ddd61-e5a4-48ca-a67a-ede383064f7d",
	project_id: "9199219f-5519-4806-b061-ab4db3378b15",
	url: "/__l5e/assets-v1/128ddd61-e5a4-48ca-a67a-ede383064f7d/PAWAPAY.png",
	r2_key: "a/v1/9199219f-5519-4806-b061-ab4db3378b15/128ddd61-e5a4-48ca-a67a-ede383064f7d/PAWAPAY.png",
	original_filename: "PAWAPAY.png",
	size: 8059,
	content_type: "image/png",
	created_at: "2026-06-26T19:53:03Z"
};
var partner_technova_png_asset_default = {
	version: 1,
	asset_id: "629f61be-d416-472c-a9a1-a4a32094de2b",
	project_id: "9199219f-5519-4806-b061-ab4db3378b15",
	url: "/__l5e/assets-v1/629f61be-d416-472c-a9a1-a4a32094de2b/technova.jpg",
	r2_key: "a/v1/9199219f-5519-4806-b061-ab4db3378b15/629f61be-d416-472c-a9a1-a4a32094de2b/technova.jpg",
	original_filename: "technova.jpg",
	size: 69605,
	content_type: "image/jpeg",
	created_at: "2026-06-26T20:01:56Z"
};
var pm_celtiis_png_asset_default = {
	version: 1,
	asset_id: "587ae74d-00cb-487d-8f1d-6c92ddcfa2cb",
	project_id: "9199219f-5519-4806-b061-ab4db3378b15",
	url: "/__l5e/assets-v1/587ae74d-00cb-487d-8f1d-6c92ddcfa2cb/pm-celtiis.png",
	r2_key: "a/v1/9199219f-5519-4806-b061-ab4db3378b15/587ae74d-00cb-487d-8f1d-6c92ddcfa2cb/pm-celtiis.png",
	original_filename: "pm-celtiis.png",
	size: 1440284,
	content_type: "image/png",
	created_at: "2026-06-24T20:19:06Z"
};
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustRow, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentMethods, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Features, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Countries, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevExperience, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Security, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden pb-20 pt-28 sm:pt-36 lg:pb-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-grid opacity-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/25 blur-[120px] animate-float" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-40 left-[-10%] h-[420px] w-[420px] rounded-full bg-primary-glow/20 blur-[120px]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid max-w-7xl items-center gap-14 px-4 lg:grid-cols-2 lg:gap-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "z-10 flex flex-col space-y-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl",
							children: [
								"L'infrastructure de ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "paiement"
								}),
								" pour l'Afrique."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg",
							children: [
								"Encaissez par Mobile Money et cartes bancaires via une seule API. Tarification transparente à ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "2% + frais opérateur"
								}),
								" et règlement instantané."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auth/sign-up",
								className: "group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:bg-primary-glow active:scale-[0.98]",
								children: ["Créer un compte", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/company/pricing",
								className: "inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white/5 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-white/10",
								children: "Voir la tarification"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex -space-x-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-slate-700 text-[10px] font-semibold text-white",
										children: "JD"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-primary/70 text-[10px] font-semibold text-white",
										children: "MT"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-sky-700 text-[10px] font-semibold text-white",
										children: "+500"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground sm:text-sm",
								children: "Choisi par les leaders de la tech en Afrique."
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroVisual, {})]
			})
		]
	});
}
function HeroVisual() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto flex w-full justify-center lg:justify-end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -inset-10 rounded-full bg-primary/25 opacity-60 blur-[100px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-[460px] sm:max-w-[520px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute -left-2 -top-2 h-20 w-20 opacity-50 sm:-left-4 sm:-top-4",
					style: {
						backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
						backgroundSize: "10px 10px",
						color: "var(--color-primary)"
					},
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute -right-6 top-6 h-40 w-40 rounded-full bg-primary/15 blur-2xl",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute -bottom-4 -left-4 h-28 w-28 rounded-full bg-amber-300/30 blur-2xl",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-white to-primary/5 shadow-elegant ring-1 ring-black/5 sm:aspect-[5/6] sm:rounded-[2.5rem]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: hero_entrepreneur_default,
							alt: "Entrepreneur africain utilisant DolaPay",
							className: "absolute inset-0 h-full w-full object-cover object-top mix-blend-multiply select-none pointer-events-none",
							width: 1024,
							height: 1024,
							draggable: false,
							onContextMenu: (e) => e.preventDefault()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 z-10",
							onContextMenu: (e) => e.preventDefault(),
							onDragStart: (e) => e.preventDefault(),
							"aria-hidden": true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/60 to-transparent" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute -left-3 top-10 z-20 w-[14rem] rounded-2xl border border-black/5 bg-white p-3 shadow-2xl sm:-left-8 sm:top-14",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-display text-base font-bold text-white",
								children: "KA"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-semibold text-foreground",
									children: "Kossi Adjovi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: "Marchand · Lomé"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative flex h-2.5 w-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" })]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: "Solde"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-sm font-bold text-foreground",
							children: ["2 845 200 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "FCFA"
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute -right-2 top-1/3 z-20 flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-2 shadow-xl sm:-right-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex -space-x-2",
						children: [
							"ci",
							"sn",
							"bj",
							"cm",
							"ke"
						].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: `https://flagcdn.com/w40/${c}.png`,
							alt: "",
							className: "h-7 w-7 rounded-full border-2 border-white object-cover",
							style: { zIndex: 10 - i },
							loading: "lazy"
						}, c))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pr-1 text-[11px] font-semibold text-foreground",
						children: "+12 pays"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute -bottom-8 left-1 z-20 w-[13rem] rounded-2xl border border-black/5 bg-white p-3 shadow-2xl sm:-bottom-6 sm:left-6 sm:w-[15rem] sm:p-3.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-5 w-5 text-emerald-600" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] text-muted-foreground",
								children: "Paiement reçu"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-base font-bold text-foreground",
								children: "+ 25 000 FCFA"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2.5 flex items-center justify-between border-t border-border pt-2 text-[10px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-orange-500" }), " Orange Money"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "il y a 2 s" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute -top-3 right-6 z-20 inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-white px-2.5 py-1 text-[10px] font-semibold text-foreground shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 text-emerald-500" }), "PCI-DSS · TLS 1.3"]
				})
			]
		})]
	});
}
var PARTNERS = [
	{
		name: "LigdiCash",
		src: partner_ligdicash_png_asset_default.url
	},
	{
		name: "PawaPay",
		src: partner_pawapay_png_asset_default.url
	},
	{
		name: "TechNova",
		src: partner_technova_png_asset_default.url
	}
];
function TrustRow() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-surface py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground",
					children: "Choisi par des entreprises innovantes partout en Afrique"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 overflow-hidden sm:hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-max animate-marquee items-center gap-x-12",
						children: [
							...PARTNERS,
							...PARTNERS,
							...PARTNERS,
							...PARTNERS
						].map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.src,
							alt: p.name,
							className: "h-9 w-auto shrink-0 object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0",
							loading: "lazy"
						}, `${p.name}-${i}`))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 hidden flex-wrap items-center justify-center gap-x-20 gap-y-6 sm:flex",
					children: PARTNERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.src,
						alt: p.name,
						className: "h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0",
						loading: "lazy"
					}, p.name))
				})
			]
		})
	});
}
var FEATURES = [
	{
		icon: Layers,
		title: "API unifiée",
		desc: "Une seule intégration pour accepter Mobile Money, cartes, virements bancaires et USSD sur tout le continent.",
		size: "lg"
	},
	{
		icon: UserCheck,
		title: "KYC/KYB automatisé",
		desc: "Onboardez marchands et clients en quelques minutes grâce à notre moteur de conformité."
	},
	{
		icon: Radar,
		title: "Détection de fraude avancée",
		desc: "Scoring de risque ML en temps réel sur chaque transaction."
	},
	{
		icon: Wallet,
		title: "Encaissement instantané",
		desc: "Réception le jour même sur votre compte ou wallet. Fini l'attente de plusieurs jours."
	}
];
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "pb-4 pt-20 sm:pb-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "Plateforme",
				title: "Tout ce qu'il faut pour faire circuler l'argent.",
				sub: "Une stack financière composable, pensée pour la réalité du commerce africain."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(220px,_auto)]",
				children: FEATURES.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elegant ${i === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/0 blur-3xl transition-all duration-500 group-hover:bg-primary/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: `mt-5 font-bold text-foreground ${i === 0 ? "text-3xl" : "text-xl"}`,
								children: f.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-2 text-muted-foreground ${i === 0 ? "max-w-md text-base" : "text-sm"}`,
								children: f.desc
							}),
							i === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-8 grid grid-cols-2 gap-3 text-sm",
								children: [
									"Mobile Money",
									"Cartes",
									"Virement bancaire",
									"USSD"
								].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: m
									})]
								}, m))
							})
						]
					})]
				}, i))
			})]
		})
	});
}
function SectionHead({ eyebrow, title, sub }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg text-muted-foreground",
				children: sub
			})
		]
	});
}
function DevExperience() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden bg-navy-deep py-16 text-navy-foreground sm:py-24 lg:py-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-grid opacity-[0.07]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 top-0 h-80 w-[60%] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider",
							children: "Développeurs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
							children: [
								"Acceptez des paiements en ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary-glow",
									children: "3 lignes"
								}),
								" de code."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-md text-sm text-navy-foreground/70 sm:text-base",
							children: "Propre, prévisible, REST. Typage fort, requêtes idempotentes et SDKs dans tous les langages majeurs. Conçue par des développeurs, pour des développeurs."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 space-y-3 text-sm text-navy-foreground/80 sm:mt-8",
							children: [
								"SDKs typés pour Node, Python, PHP, Go",
								"Webhooks avec retries automatiques et signature HMAC",
								"Sandbox avec des scénarios de test réalistes"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t })]
							}, t))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/developers/api",
							className: "mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02] sm:mt-8",
							children: ["Lire la documentation ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {})
				})]
			})
		]
	});
}
function CodeBlock() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative rounded-2xl bg-gradient-to-br from-primary/40 via-white/10 to-transparent p-px shadow-glow",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-2xl bg-[oklch(0.14_0.04_265)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-white/5 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-red-400/70" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-yellow-400/70" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-green-400/70" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-xs text-navy-foreground/50",
					children: "charge.ts"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "whitespace-pre-wrap break-words p-4 font-mono text-[11px] leading-relaxed text-navy-foreground/90 sm:overflow-x-auto sm:whitespace-pre sm:break-normal sm:p-6 sm:text-sm",
				children: `import { DolaPay } from "@dolapay/node";

const dolapay = new DolaPay(
  process.env.DOLAPAY_KEY
);

const charge = await dolapay.charges.create({
  amount: 5000,
  currency: "GHS",
  method: "mobile_money",
  customer: {
    phone: "+233501234567"
  },
});

console.log(charge.status);
// "succeeded"`
			})]
		})
	});
}
var SECURITY = [
	{
		icon: ShieldCheck,
		title: "PCI-DSS Niveau 1",
		desc: "La certification la plus exigeante pour traiter les données de cartes."
	},
	{
		icon: Scale$1,
		title: "Conforme LCB-FT",
		desc: "Surveillance continue alignée sur les standards internationaux."
	},
	{
		icon: Lock,
		title: "Chiffrement de bout en bout",
		desc: "AES-256 au repos, TLS 1.3 en transit, sur chaque requête."
	},
	{
		icon: Server,
		title: "Infrastructure bancaire",
		desc: "Bascule multi-régions, SLA de disponibilité à 99,99%."
	}
];
function Security() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "Sécurité",
				title: "La confiance, c'est notre produit.",
				sub: "Conformité et sécurité tissées dans chaque couche de la plateforme."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4",
				children: SECURITY.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elegant",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-glow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-5 text-base font-bold text-foreground",
							children: s.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground",
							children: s.desc
						})
					]
				}, i))
			})]
		})
	});
}
function Scale$1(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { ...props });
}
function CTA() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "px-4 pb-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-deep via-navy to-primary p-12 text-navy-foreground shadow-glow sm:p-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-grid opacity-[0.08]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl animate-float" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl font-bold tracking-tight sm:text-5xl",
						children: "Prêt à simplifier votre stack financière ?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xl text-navy-foreground/75",
						children: "Rejoignez les centaines d'entreprises qui bâtissent l'avenir du commerce africain sur DolaPay."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 lg:justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth/sign-up",
							className: "rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy-deep transition-transform hover:scale-[1.02]",
							children: "Commencer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/company/contact",
							className: "rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10",
							children: "Parler aux ventes"
						})]
					})]
				})
			]
		})
	});
}
var METHODS = [
	{
		name: "MTN Mobile Money",
		logo: pm_mtn_png_asset_default.url
	},
	{
		name: "Orange Money",
		logo: pm_orange_png_asset_default.url
	},
	{
		name: "Moov Money",
		logo: pm_moov_png_asset_default.url
	},
	{
		name: "Airtel Money",
		logo: pm_airtel_webp_asset_default.url
	},
	{
		name: "M-Pesa",
		logo: pm_mpesa_png_asset_default.url
	},
	{
		name: "Free Money",
		logo: pm_freemoney_png_asset_default.url
	},
	{
		name: "Vodacom",
		logo: pm_vodacom_png_asset_default.url
	},
	{
		name: "Zamtel",
		logo: pm_zamtel_png_asset_default.url
	},
	{
		name: "Celtiis Money",
		logo: pm_celtiis_png_asset_default.url
	}
];
function PaymentMethods() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-y border-border bg-background py-16",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "Couverture",
				title: "Tous les moyens de paiement qui comptent.",
				sub: "Une seule intégration, tous les wallets utilisés par vos clients."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex w-max animate-marquee gap-4",
					children: [...METHODS, ...METHODS].map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center overflow-hidden rounded-lg bg-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: m.logo,
								alt: m.name,
								className: "h-full w-full object-contain p-1"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "whitespace-nowrap font-display text-sm font-bold text-foreground",
							children: m.name
						})]
					}, i))
				})
			})]
		})
	});
}
var COUNTRY_GROUPS = [
	{
		label: "Afrique francophone",
		tag: "XOF · XAF",
		items: [
			{
				name: "Bénin",
				flag: "🇧🇯",
				code: "BJ",
				currency: "XOF",
				lat: 9.3,
				lng: 2.3
			},
			{
				name: "Cameroun",
				flag: "🇨🇲",
				code: "CM",
				currency: "XAF",
				lat: 7.3,
				lng: 12.3
			},
			{
				name: "Côte d'Ivoire",
				flag: "🇨🇮",
				code: "CI",
				currency: "XOF",
				lat: 7.5,
				lng: -5.5
			},
			{
				name: "Gabon",
				flag: "🇬🇦",
				code: "GA",
				currency: "XAF",
				lat: -.8,
				lng: 11.6
			},
			{
				name: "Rép. du Congo",
				flag: "🇨🇬",
				code: "CG",
				currency: "XAF",
				lat: -.7,
				lng: 14.8
			},
			{
				name: "Sénégal",
				flag: "🇸🇳",
				code: "SN",
				currency: "XOF",
				lat: 14.5,
				lng: -14.5
			}
		]
	},
	{
		label: "Afrique de l'Est et australe",
		tag: "KES · RWF · UGX · ZMW",
		items: [
			{
				name: "Kenya",
				flag: "🇰🇪",
				code: "KE",
				currency: "KES",
				lat: -.02,
				lng: 37.9
			},
			{
				name: "Rwanda",
				flag: "🇷🇼",
				code: "RW",
				currency: "RWF",
				lat: -1.94,
				lng: 29.87
			},
			{
				name: "Ouganda",
				flag: "🇺🇬",
				code: "UG",
				currency: "UGX",
				lat: 1.37,
				lng: 32.29
			},
			{
				name: "Zambie",
				flag: "🇿🇲",
				code: "ZM",
				currency: "ZMW",
				lat: -13.13,
				lng: 27.85
			}
		]
	},
	{
		label: "Afrique centrale et de l'Ouest",
		tag: "CDF · USD · SLE",
		items: [{
			name: "R.D. Congo",
			flag: "🇨🇩",
			code: "CD",
			currency: "CDF / USD",
			lat: -4,
			lng: 21.8
		}, {
			name: "Sierra Leone",
			flag: "🇸🇱",
			code: "SL",
			currency: "SLE",
			lat: 8.46,
			lng: -11.78
		}]
	}
];
function Countries() {
	const all = COUNTRY_GROUPS.flatMap((g) => g.items);
	const total = all.length;
	const currencies = Array.from(new Set(all.map((c) => c.currency.split(" / ")[0]))).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "countries",
		className: "relative overflow-hidden bg-background pb-14 pt-2 sm:pb-20 sm:pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-grid opacity-30" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-primary-glow/10 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-7xl px-4 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-3xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/80 backdrop-blur sm:text-xs sm:tracking-wider",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-primary" }),
									"Couverture panafricaine · ",
									total,
									" pays"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "mt-4 font-display text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-5xl",
								children: ["Une seule API pour ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gradient",
									children: "encaisser partout en Afrique."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-base",
								children: [
									"De Dakar à Dar es Salaam — Mobile Money, cartes et virements bancaires. ",
									total,
									" pays, ",
									currencies,
									"+ devises, une intégration."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative mt-6 sm:mt-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountriesConstellation, { countries: all })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountriesRegionsBoard, {})
				]
			})
		]
	});
}
var REGIONS = [
	{
		label: "Afrique de l'Ouest",
		short: "Ouest",
		accent: "primary",
		countries: [
			{
				name: "Bénin",
				code: "BJ",
				operators: 3
			},
			{
				name: "Côte d'Ivoire",
				code: "CI",
				operators: 4
			},
			{
				name: "Sénégal",
				code: "SN",
				operators: 3
			},
			{
				name: "Sierra Leone",
				code: "SL",
				operators: 2
			}
		]
	},
	{
		label: "Afrique Centrale",
		short: "Centre",
		accent: "emerald",
		countries: [
			{
				name: "Cameroun",
				code: "CM",
				operators: 2
			},
			{
				name: "Congo Brazza",
				code: "CG",
				operators: 2
			},
			{
				name: "Gabon",
				code: "GA",
				operators: 2
			},
			{
				name: "R.D.C",
				code: "CD",
				operators: 3
			}
		]
	},
	{
		label: "Afrique de l'Est",
		short: "Est",
		accent: "primary",
		countries: [
			{
				name: "Kenya",
				code: "KE",
				operators: 2
			},
			{
				name: "Rwanda",
				code: "RW",
				operators: 2
			},
			{
				name: "Uganda",
				code: "UG",
				operators: 2
			},
			{
				name: "Zambie",
				code: "ZM",
				operators: 3
			}
		]
	}
];
function CountriesRegionsBoard() {
	const totalCountries = REGIONS.reduce((n, r) => n + r.countries.length, 0);
	const totalOperators = REGIONS.reduce((n, r) => n + r.countries.reduce((m, c) => m + c.operators, 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto mt-8 sm:mt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mb-6 flex max-w-md items-center justify-center gap-3 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-medium text-muted-foreground backdrop-blur sm:max-w-none sm:w-fit sm:gap-6 sm:px-6 sm:py-2.5 sm:text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPinIcon, { className: "h-3.5 w-3.5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm font-bold text-foreground sm:text-base",
								children: totalCountries
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "pays"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendUpIcon, { className: "h-3.5 w-3.5 text-emerald-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-sm font-bold text-foreground sm:text-base",
								children: [totalOperators, "+"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "opérateurs"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-4 w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm font-bold text-foreground sm:text-base",
							children: REGIONS.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "régions"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4",
				children: REGIONS.map((region) => {
					const ops = region.countries.reduce((n, c) => n + c.operators, 0);
					const isEmerald = region.accent === "emerald";
					const accentText = isEmerald ? "text-emerald-600 dark:text-emerald-400" : "text-primary";
					const accentBg = isEmerald ? "bg-emerald-500" : "bg-primary";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `group relative overflow-hidden rounded-2xl border ${isEmerald ? "border-emerald-500/20" : "border-primary/20"} bg-card/70 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-elegant sm:p-5`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute inset-x-0 top-0 h-px ${accentBg} opacity-60` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${accentBg}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-sm font-bold tracking-tight text-foreground sm:text-base",
										children: region.label
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `font-display text-lg font-bold ${accentText}`,
									children: [ops, "+"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5",
								children: region.countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-background/60",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex min-w-0 items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: `https://flagcdn.com/w40/${c.code.toLowerCase()}.png`,
											alt: "",
											className: "h-3.5 w-5 shrink-0 rounded-[2px] object-cover ring-1 ring-border",
											loading: "lazy"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-xs font-semibold text-foreground sm:text-sm",
											children: c.name
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "shrink-0 text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: [c.operators, " ops"]
									})]
								}, c.code))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [region.countries.length, " pays"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 font-semibold",
									children: ["Live", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "relative flex h-1.5 w-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 animate-ping rounded-full bg-emerald-500/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative h-1.5 w-1.5 rounded-full bg-emerald-500" })]
									})]
								})]
							})
						]
					}, region.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-5 max-w-md text-center text-[11px] leading-relaxed text-muted-foreground sm:max-w-none sm:text-xs",
				children: "Une seule intégration. Tous les opérateurs Mobile Money, Cartes et virements."
			})
		]
	});
}
function MapPinIcon({ className = "h-4 w-4" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "10",
			r: "3"
		})]
	});
}
function TrendUpIcon({ className = "h-4 w-4" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "2",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "3 17 9 11 13 15 21 7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", { points: "14 7 21 7 21 14" })]
	});
}
var FAQS = [
	{
		q: "À quelle vitesse arrivent les encaissements ?",
		a: "Les encaissements sont instantanés par défaut (T+0) sur votre compte bancaire ou wallet. Plus besoin d'attendre plusieurs jours."
	},
	{
		q: "Faut-il un site web pour utiliser DolaPay ?",
		a: "Pas du tout. Avec les liens de paiement, vous pouvez commencer à encaisser via WhatsApp, SMS ou e-mail en moins de 60 secondes — sans code et sans site."
	},
	{
		q: "Quels pays sont supportés ?",
		a: "Nous sommes actifs en Côte d'Ivoire, au Sénégal, au Bénin, au Mali, au Togo et au Burkina Faso, avec des déploiements en cours dans le reste de l'Afrique de l'Ouest et centrale."
	},
	{
		q: "DolaPay est-il conforme PCI-DSS ?",
		a: "Oui. Nous sommes certifiés PCI-DSS Niveau 1, le plus haut standard pour le traitement des cartes, avec chiffrement AES-256 au repos et TLS 1.3 en transit."
	},
	{
		q: "Quels sont vos frais ?",
		a: "Tarification à l'usage, sans frais d'installation. Mobile Money à partir de 1,4%, cartes à 2,9% + frais locaux. Remises possibles selon le volume."
	},
	{
		q: "Combien de temps prend l'intégration ?",
		a: "La plupart des équipes mettent en production une intégration fonctionnelle en moins d'une journée grâce à nos SDKs typés et notre sandbox aux scénarios réalistes."
	}
];
function FAQ() {
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHead, {
				eyebrow: "FAQ",
				title: "Vos questions, nos réponses.",
				sub: "Tout ce qu'il faut savoir avant de construire avec DolaPay."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 space-y-3",
				children: FAQS.map((item, i) => {
					const isOpen = open === i;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `overflow-hidden rounded-2xl border bg-card transition-all ${isOpen ? "border-primary/40 shadow-elegant" : "border-border"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setOpen(isOpen ? null : i),
							className: "flex w-full items-center justify-between gap-4 px-6 py-5 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base font-bold text-foreground sm:text-lg",
								children: item.q
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all ${isOpen ? "rotate-45 bg-primary text-primary-foreground" : "bg-accent text-foreground"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-6 pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base",
									children: item.a
								})
							})
						})]
					}, i);
				})
			})]
		})
	});
}
//#endregion
export { Home as component };
