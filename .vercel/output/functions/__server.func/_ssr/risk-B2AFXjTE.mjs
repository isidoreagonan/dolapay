import { n as supabase } from "./client-SdCiCddD.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { At as Activity, _ as Snowflake, f as TrendingDown, jt as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/risk-B2AFXjTE.js
var import_jsx_runtime = require_jsx_runtime();
var LARGE_TX_THRESHOLD_XOF = 2e6;
function fmt(n) {
	return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(n));
}
function RiskPage() {
	const { data: txs = [] } = useQuery({
		queryKey: ["admin-risk-txs"],
		queryFn: async () => {
			const since = (/* @__PURE__ */ new Date(Date.now() - 720 * 3600 * 1e3)).toISOString();
			const { data, error } = await supabase.from("transactions").select("id,amount,status,type,created_at,profile_id,currency").gte("created_at", since).order("created_at", { ascending: false }).limit(2e3);
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: profiles = [] } = useQuery({
		queryKey: ["admin-risk-profiles"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("id,email,full_name,kyc_status,created_at");
			if (error) throw error;
			return data ?? [];
		}
	});
	const profileMap = new Map(profiles.map((p) => [p.id, p]));
	const large = txs.filter((t) => Number(t.amount) >= LARGE_TX_THRESHOLD_XOF).slice(0, 30);
	const failedByProfile = /* @__PURE__ */ new Map();
	for (const t of txs) if (t.status === "failed") failedByProfile.set(t.profile_id, (failedByProfile.get(t.profile_id) ?? 0) + 1);
	const failClusters = Array.from(failedByProfile.entries()).filter(([, n]) => n >= 3).sort(([, a], [, b]) => b - a).slice(0, 20);
	const frozen = profiles.filter((p) => p.kyc_status === "frozen");
	const day = 24 * 3600 * 1e3;
	const recent = txs.filter((t) => Date.now() - new Date(t.created_at).getTime() <= day && t.status === "success");
	const byProfile24h = /* @__PURE__ */ new Map();
	for (const t of recent) byProfile24h.set(t.profile_id, (byProfile24h.get(t.profile_id) ?? 0) + 1);
	const velocity = Array.from(byProfile24h.entries()).filter(([, n]) => n >= 10).sort(([, a], [, b]) => b - a).slice(0, 20);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-wider text-slate-500",
					children: "Surveillance"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-2xl font-bold",
					children: "Risques & alertes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-slate-500",
					children: "Signaux automatiques sur les 30 derniers jours · seuils calibrés sur le marché ouest-africain."
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: TriangleAlert,
						label: "Transactions élevées",
						value: large.length,
						accent: "text-amber-500"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: TrendingDown,
						label: "Clusters d'échecs",
						value: failClusters.length,
						accent: "text-rose-500"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Snowflake,
						label: "Comptes gelés",
						value: frozen.length,
						accent: "text-sky-500"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						icon: Activity,
						label: "Vélocité anormale",
						value: velocity.length,
						accent: "text-violet-500"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: `Transactions ≥ ${fmt(LARGE_TX_THRESHOLD_XOF)} XOF`,
				empty: "Aucune transaction au-dessus du seuil.",
				children: large.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-[10px] uppercase tracking-wider text-slate-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Marchand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Type"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4",
								children: "Statut"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-4 text-right",
								children: "Montant"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: large.map((t) => {
						const p = profileMap.get(t.profile_id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-current/5 dark:border-white/5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-4 font-mono text-xs text-slate-500",
									children: new Date(t.created_at).toLocaleString("fr-FR")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/merchants/$id",
										params: { id: t.profile_id },
										className: "hover:underline",
										children: p?.full_name || p?.email || t.profile_id.slice(0, 8)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-4 text-xs",
									children: t.type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 pr-4 text-xs",
									children: t.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 pr-4 text-right font-mono",
									children: [
										fmt(Number(t.amount)),
										" ",
										t.currency || "XOF"
									]
								})
							]
						}, t.id);
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Clusters d'échecs (≥ 3 échecs / 30j)",
				empty: "Aucun cluster détecté.",
				children: failClusters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-current/5 dark:divide-white/5",
					children: failClusters.map(([pid, n]) => {
						const p = profileMap.get(pid);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/merchants/$id",
								params: { id: pid },
								className: "hover:underline",
								children: p?.full_name || p?.email || pid.slice(0, 8)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-rose-500/10 px-2 py-0.5 font-mono text-xs text-rose-500",
								children: [n, " échecs"]
							})]
						}, pid);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Vélocité (≥ 10 tx réussies / 24h)",
				empty: "Aucune anomalie de vélocité.",
				children: velocity.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-current/5 dark:divide-white/5",
					children: velocity.map(([pid, n]) => {
						const p = profileMap.get(pid);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/admin/merchants/$id",
								params: { id: pid },
								className: "hover:underline",
								children: p?.full_name || p?.email || pid.slice(0, 8)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-violet-500/10 px-2 py-0.5 font-mono text-xs text-violet-500",
								children: [n, " tx / 24h"]
							})]
						}, pid);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Comptes gelés",
				empty: "Aucun compte gelé.",
				children: frozen.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-current/5 dark:divide-white/5",
					children: frozen.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/merchants/$id",
							params: { id: p.id },
							className: "hover:underline",
							children: p.full_name || p.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-sky-500/10 px-2 py-0.5 font-mono text-xs text-sky-500",
							children: "gelé"
						})]
					}, p.id))
				})
			})
		]
	});
}
function Stat({ icon: Icon, label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-current/10 bg-white/[0.02] p-4 dark:border-white/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider text-slate-500",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${accent}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-mono text-xl font-bold",
			children: value
		})]
	});
}
function Section({ title, empty, children }) {
	const hasChildren = !!children && (Array.isArray(children) ? children.length > 0 : true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-current/10 bg-white/[0.02] p-5 dark:border-white/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 text-sm font-semibold",
			children: title
		}), hasChildren ? children : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-slate-500",
			children: empty
		})]
	});
}
//#endregion
export { RiskPage as component };
