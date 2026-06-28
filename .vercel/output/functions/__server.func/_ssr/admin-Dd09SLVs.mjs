import { n as supabase } from "./client-nARMQEqv.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { At as Activity, C as ShieldAlert, Ct as ArrowUpRight, a as Users, d as TrendingUp, i as Wallet, kt as ArrowDownLeft } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Dd09SLVs.js
var import_jsx_runtime = require_jsx_runtime();
function AdminOverview() {
	const { data: txs = [], isLoading } = useQuery({
		queryKey: ["admin-overview-txs"],
		queryFn: async () => {
			const since = (/* @__PURE__ */ new Date(Date.now() - 720 * 3600 * 1e3)).toISOString();
			const { data, error } = await supabase.from("transactions").select("id,amount,status,type,created_at,profile_id").gte("created_at", since).order("created_at", { ascending: false }).limit(1e3);
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: profileStats } = useQuery({
		queryKey: ["admin-overview-profiles"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("id,kyc_status,account_type,created_at");
			if (error) throw error;
			return data ?? [];
		}
	});
	const now = Date.now();
	const day = 24 * 3600 * 1e3;
	const vol = (since, type) => txs.filter((t) => new Date(t.created_at).getTime() >= since && (!type || t.type === type) && t.status === "success").reduce((s, t) => s + Number(t.amount), 0);
	const today = vol(now - day);
	const last7 = vol(now - 7 * day);
	const last30 = vol(now - 30 * day);
	const payIn30 = vol(now - 30 * day, "pay_in");
	const payOut30 = vol(now - 30 * day, "pay_out");
	const totalCount = txs.filter((t) => new Date(t.created_at).getTime() >= now - 30 * day).length;
	const completedCount = txs.filter((t) => new Date(t.created_at).getTime() >= now - 30 * day && t.status === "success").length;
	const successRate = totalCount ? completedCount / totalCount * 100 : 0;
	const mrrEstimate = payIn30 * .02 + payOut30 * .01;
	const pendingKyc = (profileStats ?? []).filter((p) => p.kyc_status === "pending").length;
	const merchants = (profileStats ?? []).length;
	const enterprises = (profileStats ?? []).filter((p) => p.account_type === "enterprise").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-white",
					children: "Control Center"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-slate-400",
					children: "Pilotage opérationnel DolaPay — temps réel & 30 derniers jours."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative flex h-2 w-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-emerald-400" })]
					}), "Production · uptime 99.98%"]
				})]
			}),
			pendingKyc > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/compliance",
				className: "flex items-center justify-between gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 transition-colors hover:bg-amber-100 dark:border-amber-400/30 dark:bg-amber-400/[0.07] dark:hover:bg-amber-400/[0.12]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-5 w-5 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-sm font-semibold text-amber-900 dark:text-amber-100",
						children: [
							pendingKyc,
							" dossier",
							pendingKyc > 1 ? "s" : "",
							" KYC en attente de revue"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-amber-700/90 dark:text-amber-300/80",
						children: "Ouvrir la file de conformité →"
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
				children: [
					{
						label: "Volume 24h",
						value: today,
						fmt: "xof",
						icon: Activity,
						accent: "text-emerald-400"
					},
					{
						label: "Volume 7j",
						value: last7,
						fmt: "xof",
						icon: TrendingUp,
						accent: "text-sky-400"
					},
					{
						label: "Volume 30j",
						value: last30,
						fmt: "xof",
						icon: Wallet,
						accent: "text-violet-400"
					},
					{
						label: "Revenu DolaPay (30j)",
						value: mrrEstimate,
						fmt: "xof",
						icon: TrendingUp,
						accent: "text-amber-400"
					},
					{
						label: "Encaissements (30j)",
						value: payIn30,
						fmt: "xof",
						icon: ArrowDownLeft,
						accent: "text-emerald-400"
					},
					{
						label: "Décaissements (30j)",
						value: payOut30,
						fmt: "xof",
						icon: ArrowUpRight,
						accent: "text-rose-400"
					},
					{
						label: "Taux de succès (30j)",
						value: successRate,
						fmt: "pct",
						icon: Activity,
						accent: "text-emerald-400"
					},
					{
						label: "Marchands",
						value: merchants,
						fmt: "int",
						icon: Users,
						accent: "text-sky-400"
					}
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:bg-white/[0.05]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-slate-500",
							children: k.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, { className: cn("h-3.5 w-3.5", k.accent) })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 font-mono text-lg font-bold text-white sm:text-xl",
						children: isLoading ? "…" : formatValue(k.value, k.fmt)
					})]
				}, k.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-white/10 bg-white/[0.03] p-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-semibold text-white",
							children: "Dernières transactions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/live",
							className: "text-xs text-sky-400 hover:text-sky-300",
							children: "Voir le flux live →"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "text-[10px] uppercase tracking-wider text-slate-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-white/5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-3 text-left font-medium",
											children: "ID"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-3 text-left font-medium",
											children: "Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-3 text-right font-medium",
											children: "Montant"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 pr-3 text-left font-medium",
											children: "Statut"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-2 text-right font-medium",
											children: "Quand"
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [txs.slice(0, 8).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-white/[0.04]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-2 pr-3 font-mono text-slate-300",
										children: [t.id.slice(0, 10), "…"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 capitalize text-slate-400",
										children: t.type
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3 text-right font-mono text-white",
										children: Number(t.amount).toLocaleString("fr-FR")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 pr-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, { status: t.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2 text-right text-slate-500",
										children: timeAgo(t.created_at)
									})
								]
							}, t.id)), txs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "py-8 text-center text-slate-500",
								children: "Aucune transaction."
							}) })] })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/[0.03] p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-slate-500",
								children: "Comptes Enterprise"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-mono text-2xl font-bold text-white",
								children: enterprises
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-slate-500",
								children: [
									"sur ",
									merchants,
									" marchands"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-white/10 bg-white/[0.03] p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] font-semibold uppercase tracking-wider text-slate-500",
								children: "KYC en attente"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-mono text-2xl font-bold text-amber-300",
								children: pendingKyc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/compliance",
								className: "text-xs text-sky-400 hover:text-sky-300",
								children: "Traiter →"
							})
						]
					})]
				})]
			})
		]
	});
}
function formatValue(v, fmt) {
	if (fmt === "xof") return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(v)) + " F";
	if (fmt === "pct") return v.toFixed(1) + "%";
	return new Intl.NumberFormat("fr-FR").format(v);
}
function StatusDot({ status }) {
	const map = {
		success: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
		pending: "bg-amber-400/15 text-amber-300 border-amber-400/30",
		failed: "bg-rose-400/15 text-rose-300 border-rose-400/30",
		refunded: "bg-slate-400/15 text-slate-300 border-slate-400/30"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase", map[status] ?? map.pending),
		children: status
	});
}
function timeAgo(iso) {
	const s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1e3));
	if (s < 60) return `${s}s`;
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h`;
	return `${Math.floor(h / 24)}j`;
}
//#endregion
export { AdminOverview as component };
