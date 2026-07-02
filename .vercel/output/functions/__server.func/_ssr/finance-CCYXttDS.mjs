import { n as supabase } from "./client-SdCiCddD.mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { Ct as ArrowUpRight, d as TrendingUp, dt as DollarSign, kt as ArrowDownLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-CCYXttDS.js
var import_jsx_runtime = require_jsx_runtime();
var FEE_PAY_IN = .02;
var FEE_PAY_OUT = .01;
function fmt(n) {
	return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n));
}
function monthKey(d) {
	const dt = new Date(d);
	return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}
function FinancePage() {
	const { data: txs = [], isLoading } = useQuery({
		queryKey: ["admin-finance-txs"],
		queryFn: async () => {
			const since = (/* @__PURE__ */ new Date(Date.now() - 4320 * 3600 * 1e3)).toISOString();
			const { data, error } = await supabase.from("transactions").select("id,amount,status,type,created_at,currency").gte("created_at", since).eq("status", "success").order("created_at", { ascending: false }).limit(5e3);
			if (error) throw error;
			return data ?? [];
		}
	});
	const totalVolume = txs.reduce((s, t) => s + Number(t.amount), 0);
	const totalPayIn = txs.filter((t) => t.type === "pay_in").reduce((s, t) => s + Number(t.amount), 0);
	const totalPayOut = txs.filter((t) => t.type === "pay_out").reduce((s, t) => s + Number(t.amount), 0);
	const revenue = totalPayIn * FEE_PAY_IN + totalPayOut * FEE_PAY_OUT;
	const byMonth = /* @__PURE__ */ new Map();
	for (const t of txs) {
		const k = monthKey(t.created_at);
		const cur = byMonth.get(k) ?? {
			volume: 0,
			payIn: 0,
			payOut: 0,
			revenue: 0,
			count: 0
		};
		cur.volume += Number(t.amount);
		cur.count += 1;
		if (t.type === "pay_in") {
			cur.payIn += Number(t.amount);
			cur.revenue += Number(t.amount) * FEE_PAY_IN;
		} else if (t.type === "pay_out") {
			cur.payOut += Number(t.amount);
			cur.revenue += Number(t.amount) * FEE_PAY_OUT;
		}
		byMonth.set(k, cur);
	}
	const months = Array.from(byMonth.entries()).sort(([a], [b]) => b.localeCompare(a));
	const maxRev = Math.max(1, ...months.map(([, v]) => v.revenue));
	const byCurrency = /* @__PURE__ */ new Map();
	for (const t of txs) {
		const k = (t.currency || "XOF").toUpperCase();
		const cur = byCurrency.get(k) ?? {
			volume: 0,
			revenue: 0,
			count: 0
		};
		cur.volume += Number(t.amount);
		cur.count += 1;
		cur.revenue += Number(t.amount) * (t.type === "pay_in" ? FEE_PAY_IN : t.type === "pay_out" ? FEE_PAY_OUT : 0);
		byCurrency.set(k, cur);
	}
	const currencies = Array.from(byCurrency.entries()).sort(([, a], [, b]) => b.revenue - a.revenue);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-wider text-slate-500",
					children: "Finance"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-bold",
					children: "Revenu DolaPay"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-slate-500",
					children: "Calcul transparent · 2 % sur les encaissements, 1 % sur les décaissements. Données des 6 derniers mois (transactions réussies uniquement)."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Revenu (180j)",
						value: fmt(revenue),
						suffix: "XOF",
						icon: DollarSign,
						accent: "text-amber-500"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Volume total",
						value: fmt(totalVolume),
						suffix: "XOF",
						icon: TrendingUp,
						accent: "text-sky-500"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Encaissements",
						value: fmt(totalPayIn),
						suffix: "XOF",
						icon: ArrowDownLeft,
						accent: "text-emerald-500"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "Décaissements",
						value: fmt(totalPayOut),
						suffix: "XOF",
						icon: ArrowUpRight,
						accent: "text-rose-500"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-current/10 bg-white/[0.02] p-5 dark:border-white/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Revenu mensuel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-wider text-slate-500",
						children: "XOF"
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-slate-500",
					children: "Chargement…"
				}) : months.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-slate-500",
					children: "Aucune donnée."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: months.map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-slate-500",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-500",
									children: ["Vol. ", fmt(v.volume)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-semibold text-amber-500",
									children: ["+", fmt(v.revenue)]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 overflow-hidden rounded-full bg-slate-500/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600",
								style: { width: `${v.revenue / maxRev * 100}%` }
							})
						})]
					}, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-current/10 bg-white/[0.02] p-5 dark:border-white/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-sm font-semibold",
					children: "Répartition par devise"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-[10px] uppercase tracking-wider text-slate-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Devise"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Transactions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4",
									children: "Volume"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-4 text-right",
									children: "Revenu"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: currencies.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 4,
							className: "py-4 text-slate-500",
							children: "—"
						}) }) : currencies.map(([c, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-current/5 dark:border-white/5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-4 font-mono",
									children: c
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-4",
									children: v.count
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-4",
									children: fmt(v.volume)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 pr-4 text-right font-mono font-semibold text-amber-500",
									children: ["+", fmt(v.revenue)]
								})
							]
						}, c)) })]
					})
				})]
			})
		]
	});
}
function Kpi({ label, value, suffix, icon: Icon, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-current/10 bg-white/[0.02] p-4 dark:border-white/10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-wider text-slate-500",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${accent}` })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-mono text-xl font-bold",
				children: value
			}),
			suffix && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] text-slate-500",
				children: suffix
			})
		]
	});
}
//#endregion
export { FinancePage as component };
