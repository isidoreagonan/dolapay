import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DWb0N0jk.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-BXsN2XM_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditPage() {
	const [live, setLive] = (0, import_react.useState)([]);
	const { data: rows = [] } = useQuery({
		queryKey: ["admin-audit"],
		queryFn: async () => {
			const { data, error } = await supabase.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(200);
			if (error) throw error;
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		const ch = supabase.channel("admin-audit-live").on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "admin_audit_log"
		}, (p) => {
			setLive((prev) => [p.new, ...prev].slice(0, 100));
		}).subscribe();
		return () => {
			supabase.removeChannel(ch);
		};
	}, []);
	const all = [...live, ...rows.filter((r) => !live.find((l) => l.id === r.id))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight text-white",
			children: "Journal d'audit"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-slate-400",
			children: "Toutes les actions admin sont immuables et tracées (lecture seule, même pour vous)."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-white/10 bg-white/[0.03] text-[10px] uppercase tracking-wider text-slate-500",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-medium",
								children: "Quand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-medium",
								children: "Action"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-medium",
								children: "Cible"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-medium",
								children: "Admin"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-left font-medium",
								children: "IP"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [all.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-white/[0.04]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-slate-500",
								children: new Date(r.created_at).toLocaleString("fr-FR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-emerald-300",
								children: r.action
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-slate-400",
								children: r.target_type ? `${r.target_type}/${(r.target_id ?? "").slice(0, 10)}` : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-2 font-mono text-slate-500",
								children: [r.admin_id.slice(0, 8), "…"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 font-mono text-slate-500",
								children: r.ip ?? "—"
							})
						]
					}, r.id)), all.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "px-3 py-12 text-center text-slate-500",
						children: "Aucun événement journalisé."
					}) })] })]
				})
			})
		})]
	});
}
//#endregion
export { AuditPage as component };
