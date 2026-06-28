import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-nARMQEqv.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { r as useProfile } from "./route-CG8Dj4kH.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { Bt as CircleCheck, C as ShieldAlert, Ct as ArrowUpRight, It as Layers, M as RefreshCw, Nt as Sparkles, Ot as ArrowDownRight, d as TrendingUp, f as TrendingDown, ft as Crown, gt as Clock, i as Wallet, it as Headphones, m as Target, n as X, nt as Infinity$1 } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as getTier, t as fmtXof } from "./tier-NT1-wYki.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as BarChart, o as CartesianGrid, r as YAxis, s as Bar, t as AreaChart, u as Legend } from "../_libs/recharts+[...].mjs";
import { n as Root, t as Indicator } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CJ3dls6n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var alertVariants = cva("relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7", {
	variants: { variant: {
		default: "bg-background text-foreground",
		destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"
	} },
	defaultVariants: { variant: "default" }
});
var Alert = import_react.forwardRef(({ className, variant, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	role: "alert",
	className: cn(alertVariants({ variant }), className),
	...props
}));
Alert.displayName = "Alert";
var AlertTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
	ref,
	className: cn("mb-1 font-medium leading-none tracking-tight", className),
	...props
}));
AlertTitle.displayName = "AlertTitle";
var AlertDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm [&_p]:leading-relaxed", className),
	...props
}));
AlertDescription.displayName = "AlertDescription";
function ComplianceReviewScreen() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-[70vh] place-items-center px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "relative w-full max-w-xl overflow-hidden border-primary/30 bg-card/60 p-8 text-center shadow-2xl backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/15 ring-8 ring-primary/5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute h-20 w-20 animate-ping rounded-full bg-primary/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "relative h-9 w-9 text-primary" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "mb-3 bg-primary/15 text-primary hover:bg-primary/20",
						children: "Conformité · AML/CFT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: "Examen de conformité en cours"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: [
							"Votre dossier d'identité a été reçu de manière sécurisée. Notre moteur de risque automatisé et notre département juridique procèdent aux vérifications AML standard.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: "Délai estimé : 12 à 24 heures."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progression" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "75%" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-2.5 w-full overflow-hidden rounded-full bg-primary/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-3/4 rounded-full bg-gradient-to-r from-primary/70 to-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-xs text-muted-foreground",
						children: "Vous recevrez un email dès l'approbation. Aucune action n'est requise de votre part."
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}` })]
	});
}
function RejectedScreen({ reason }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[70vh] place-items-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-xl overflow-hidden border-rose-500/40 bg-card/60 p-8 shadow-2xl backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-rose-500/15 ring-8 ring-rose-500/5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-8 w-8 text-rose-500" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "destructive",
							className: "mb-3",
							children: "Action requise"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold tracking-tight",
							children: "Vérification non aboutie"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Votre vérification d'identité n'a pas pu être validée par notre équipe conformité."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
					variant: "destructive",
					className: "mt-6 border-rose-500/40 bg-rose-500/10 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "font-semibold",
						children: "Motif du refus"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: reason?.trim() || "Pièce d'identité expirée ou image floue. Veuillez soumettre des documents lisibles et en cours de validité." })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					size: "lg",
					className: "mt-6 w-full bg-rose-600 text-white hover:bg-rose-700",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/verify",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), " Soumettre à nouveau les documents"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-center text-xs text-muted-foreground",
					children: ["Besoin d'aide ? Écrivez-nous à ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "mailto:compliance@dolapay.com",
						className: "underline",
						children: "compliance@dolapay.com"
					})]
				})
			]
		})
	});
}
function ApprovedBanner({ storageKey = "dolapay.approved.banner" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		setOpen(window.localStorage.getItem(storageKey) !== "dismissed");
	}, [storageKey]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative mb-6 overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-primary/5 to-emerald-500/10 p-4 shadow-sm backdrop-blur"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3 pr-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "Bienvenue sur DolaPay Live !"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: "Vos plafonds de transaction ont été mis à jour. Vous pouvez encaisser et opérer en production."
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => {
				window.localStorage.setItem(storageKey, "dismissed");
				setOpen(false);
			},
			"aria-label": "Fermer",
			className: "absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-background/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
		})]
	});
}
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
var PERIOD_DAYS = 30;
function Overview() {
	const { data: profile } = useProfile();
	if (profile?.kyc_status === "in_compliance_review" || profile?.kyc_status === "pending" && profile?.onboarding_completed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplianceReviewScreen, {});
	if (profile?.kyc_status === "rejected") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RejectedScreen, { reason: profile.kyc_rejection_reason });
	const { data: txs = [] } = useQuery({
		queryKey: ["my-tx-30"],
		queryFn: async () => {
			const since = /* @__PURE__ */ new Date();
			since.setDate(since.getDate() - PERIOD_DAYS * 2);
			const { data, error } = await supabase.from("transactions").select("id,amount,currency,status,type,created_at").gte("created_at", since.toISOString()).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const now = /* @__PURE__ */ new Date();
	const startCurrent = new Date(now);
	startCurrent.setDate(now.getDate() - PERIOD_DAYS);
	const startPrev = new Date(now);
	startPrev.setDate(now.getDate() - PERIOD_DAYS * 2);
	const inWindow = (t, from, to) => {
		const d = new Date(t.created_at);
		return d >= from && d < to;
	};
	const current = txs.filter((t) => inWindow(t, startCurrent, now));
	const previous = txs.filter((t) => inWindow(t, startPrev, startCurrent));
	const successful = current.filter((t) => t.status === "success");
	const failed = current.filter((t) => t.status === "failed");
	const payin = successful.filter((t) => t.type === "pay-in" || t.type === "payment_link");
	const payout = successful.filter((t) => t.type === "pay-out");
	const sum = (arr) => arr.reduce((s, t) => s + Number(t.amount), 0);
	const totalVolume = sum(successful);
	const payinVol = sum(payin);
	const payoutVol = sum(payout);
	const balance = payinVol - payoutVol;
	const avgTicket = successful.length ? totalVolume / successful.length : 0;
	const successRate = current.length ? successful.length / current.length * 100 : 0;
	const prevVolume = sum(previous.filter((t) => t.status === "success"));
	const trend = prevVolume ? (totalVolume - prevVolume) / prevVolume * 100 : 0;
	const limit = profile?.volume_limit_xof ?? 0;
	const usagePct = limit ? Math.min(100, totalVolume / limit * 100) : 0;
	const days = Array.from({ length: PERIOD_DAYS }).map((_, i) => {
		const d = new Date(now);
		d.setDate(now.getDate() - (PERIOD_DAYS - 1 - i));
		const key = d.toISOString().slice(0, 10);
		const day = successful.filter((t) => t.created_at.slice(0, 10) === key);
		return {
			day: key.slice(5),
			payin: sum(day.filter((t) => t.type === "pay-in" || t.type === "payment_link")),
			payout: sum(day.filter((t) => t.type === "pay-out"))
		};
	});
	const typeMap = /* @__PURE__ */ new Map();
	successful.forEach((t) => {
		const p = t.type || "Autre";
		typeMap.set(p, (typeMap.get(p) || 0) + Number(t.amount));
	});
	const topProviders = Array.from(typeMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, volume]) => ({
		name,
		volume
	}));
	const tier = getTier(profile?.account_type);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovedBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: [
						"Bonjour ",
						profile?.full_name?.split(" ")[0] ?? "",
						" 👋"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Aperçu des 30 derniers jours."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: cn("gap-1.5 px-3 py-1 text-xs", tier.badgeClass),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm leading-none",
							children: tier.icon
						}),
						" ",
						tier.label
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TierLimitsCard, {
				tier,
				usedMonthly: totalVolume
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: TrendingUp,
						label: "Volume total",
						value: fmt(totalVolume),
						hint: "XOF · 30j",
						trend
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: ArrowDownRight,
						label: "Encaissements",
						value: fmt(payinVol),
						hint: `${payin.length} transactions`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: ArrowUpRight,
						label: "Décaissements",
						value: fmt(payoutVol),
						hint: `${payout.length} transactions`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Wallet,
						label: "Solde net",
						value: fmt(balance),
						hint: "Pay-in − Pay-out"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: CircleCheck,
						label: "Taux de succès",
						value: `${successRate.toFixed(1)}%`,
						hint: `${failed.length} échecs`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Target,
						label: "Panier moyen",
						value: fmt(avgTicket),
						hint: "XOF par transaction"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Layers,
						label: "Volume cumulé",
						value: `${usagePct.toFixed(0)}%`,
						hint: limit ? `de ${fmt(limit)} XOF` : "Limite non définie"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsageCard, { pct: usagePct })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-semibold",
						children: "Volume quotidien · 30 jours"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Encaissements vs Décaissements (XOF)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: days,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "in",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "hsl(var(--primary))",
										stopOpacity: .5
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "hsl(var(--primary))",
										stopOpacity: 0
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "out",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "hsl(24 95% 53%)",
										stopOpacity: .5
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "hsl(24 95% 53%)",
										stopOpacity: 0
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "hsl(var(--border))",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "day",
									stroke: "hsl(var(--muted-foreground))",
									tickLine: false,
									axisLine: false,
									fontSize: 11
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "hsl(var(--muted-foreground))",
									tickLine: false,
									axisLine: false,
									fontSize: 11,
									tickFormatter: (v) => fmt(v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "hsl(var(--card))",
										border: "1px solid hsl(var(--border))",
										borderRadius: 12
									},
									formatter: (v) => fmt(v)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 12 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									name: "Encaissements",
									type: "monotone",
									dataKey: "payin",
									stroke: "hsl(var(--primary))",
									strokeWidth: 2,
									fill: "url(#in)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									name: "Décaissements",
									type: "monotone",
									dataKey: "payout",
									stroke: "hsl(24 95% 53%)",
									strokeWidth: 2,
									fill: "url(#out)"
								})
							]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 text-sm font-semibold",
						children: "Top opérateurs · 30 jours"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 w-full",
						children: topProviders.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: topProviders,
								layout: "vertical",
								margin: { left: 20 },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										hide: true,
										tickFormatter: (v) => fmt(v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "name",
										stroke: "hsl(var(--muted-foreground))",
										tickLine: false,
										axisLine: false,
										fontSize: 12,
										width: 80
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										contentStyle: {
											background: "hsl(var(--card))",
											border: "1px solid hsl(var(--border))",
											borderRadius: 12
										},
										formatter: (v) => fmt(v)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "volume",
										fill: "hsl(var(--primary))",
										radius: [
											0,
											8,
											8,
											0
										]
									})
								]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-full place-items-center text-sm text-muted-foreground",
							children: "Pas encore de données opérateurs."
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "h-4 w-4 text-emerald-500" }), " Dernières transactions"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "space-y-2 text-sm",
						children: [current.slice(0, 6).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between rounded-lg border border-border px-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "capitalize",
								children: t.type
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono",
								children: [
									fmt(Number(t.amount)),
									" ",
									t.currency
								]
							})]
						}, t.id)), current.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-muted-foreground",
							children: [
								"Aucune transaction. ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/payment-links",
									className: "text-primary underline",
									children: "Créez votre premier lien"
								}),
								"."
							]
						})]
					})]
				})]
			})
		]
	});
}
function Stat({ icon: Icon, label, value, hint, trend }) {
	const up = (trend ?? 0) >= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-2xl font-bold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hint }), trend !== void 0 && Number.isFinite(trend) && trend !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("inline-flex items-center gap-0.5 font-semibold", up ? "text-emerald-500" : "text-rose-500"),
					children: [
						up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }),
						Math.abs(trend).toFixed(1),
						"%"
					]
				})]
			})
		]
	});
}
function UsageCard({ pct }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: "Utilisation limite"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-2 w-full overflow-hidden rounded-full bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("h-full transition-all", pct > 80 ? "bg-rose-500" : pct > 50 ? "bg-amber-500" : "bg-emerald-500"),
					style: { width: `${pct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [pct.toFixed(1), "% du plafond mensuel"]
			})
		]
	});
}
function fmt(n) {
	return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}
function TierLimitsCard({ tier, usedMonthly }) {
	const unlimited = tier.monthlyLimitXof === null;
	const pct = unlimited ? 0 : Math.min(100, usedMonthly / (tier.monthlyLimitXof || 1) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "overflow-hidden border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [
								unlimited ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3.5 w-3.5 text-amber-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }),
								"Plafond ",
								tier.short
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xl font-bold",
							children: unlimited ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Infinity$1, { className: "h-5 w-5" }),
									" Illimité ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-normal text-muted-foreground",
										children: "· SLA monitoré"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Mensuel : ", fmtXof(tier.monthlyLimitXof)] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: ["Cap par transaction : ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: fmtXof(tier.singleTxCapXof)
							})]
						})
					]
				}), tier.capabilities.vipSupport && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-400/20 dark:text-amber-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "h-3.5 w-3.5" }), " Account Manager prioritaire"]
				})]
			}),
			!unlimited && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center justify-between text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Utilisé ce mois" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: fmtXof(usedMonthly)
						}),
						" / ",
						fmtXof(tier.monthlyLimitXof)
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2 text-[11px]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Capability, {
						ok: tier.capabilities.payin,
						label: "Pay-in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Capability, {
						ok: tier.capabilities.paymentLinks,
						label: "Liens & QR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Capability, {
						ok: tier.capabilities.payouts,
						label: "Payouts"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Capability, {
						ok: tier.capabilities.bulkTransfers,
						label: "Bulk Transfers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Capability, {
						ok: tier.capabilities.signedWebhooks,
						label: "Webhooks signés"
					})
				]
			}),
			!tier.capabilities.payouts && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/dashboard/settings",
				className: "mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3.5 w-3.5" }), " Passer à Enterprise"]
			})
		]
	});
}
function Capability({ ok, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-medium", ok ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-border bg-muted/40 text-muted-foreground"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-1.5 w-1.5 rounded-full", ok ? "bg-emerald-500" : "bg-muted-foreground/50") }), label]
	});
}
//#endregion
export { Overview as component };
