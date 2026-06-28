import { n as supabase } from "./client-DWb0N0jk.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { g as Link, v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { Bt as CircleCheck, Et as ArrowLeft, K as Mail, _ as Snowflake, ft as Crown, xt as Building2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/merchants._id-Cp6Wr46_.js
var import_jsx_runtime = require_jsx_runtime();
function Merchant360() {
	const { id } = useParams({ from: "/_authenticated/admin/merchants/$id" });
	const qc = useQueryClient();
	const { data: profile } = useQuery({
		queryKey: ["admin-merchant", id],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const { data: business } = useQuery({
		queryKey: ["admin-merchant-biz", id],
		queryFn: async () => {
			const { data } = await supabase.from("businesses").select("*").eq("profile_id", id).maybeSingle();
			return data;
		}
	});
	const { data: txs = [] } = useQuery({
		queryKey: ["admin-merchant-txs", id],
		queryFn: async () => {
			const { data } = await supabase.from("transactions").select("id,amount,currency,status,type,created_at,description").eq("profile_id", id).order("created_at", { ascending: false }).limit(50);
			return data ?? [];
		}
	});
	const { data: payouts = [] } = useQuery({
		queryKey: ["admin-merchant-payouts", id],
		queryFn: async () => {
			const { data } = await supabase.from("payout_batches").select("id,name,currency,status,total_amount,total_count,created_at").eq("owner_id", id).order("created_at", { ascending: false }).limit(20);
			return data ?? [];
		}
	});
	const action = useMutation({
		mutationFn: async (patch) => {
			const { error } = await supabase.from("profiles").update(patch).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["admin-merchant", id] });
			toast.success("Mis à jour");
		},
		onError: (e) => toast.error(e.message)
	});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm text-slate-400",
		children: "Chargement…"
	});
	const volume = txs.filter((t) => t.status === "success").reduce((s, t) => s + Number(t.amount), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/merchants",
				className: "inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3" }), " Marchands"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "rounded-xl border border-white/10 bg-white/[0.03] p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl font-bold",
								children: business?.company_name || profile.full_name || "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-3 text-xs text-slate-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
										" ",
										profile.email
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono",
									children: ["acc_", profile.id.replace(/-/g, "").slice(0, 16)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: profile.country ?? "—" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2 text-[10px]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("rounded-full border px-2 py-0.5 font-semibold uppercase", profile.account_type === "enterprise" ? "border-violet-400/30 bg-violet-400/15 text-violet-300" : "border-slate-400/30 bg-slate-400/15 text-slate-300"),
									children: [profile.account_type, " tier"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kyc, { s: profile.kyc_status }),
								profile.ai_verification_score !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 font-mono font-semibold text-emerald-300",
									children: ["AI score ", Number(profile.ai_verification_score).toFixed(0)]
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-slate-500",
							children: "Volume traité"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-mono text-xl font-bold text-white",
							children: [volume.toLocaleString("fr-FR"), " F"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20",
							disabled: profile.kyc_status === "approved" || action.isPending,
							onClick: () => action.mutate({
								kyc_status: "approved",
								kyc_rejection_reason: null
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Approuver"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "border-slate-400/40 bg-white/5 text-slate-200 hover:bg-white/10",
							disabled: profile.kyc_status === "frozen" || action.isPending,
							onClick: () => action.mutate({ kyc_status: "frozen" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Snowflake, { className: "h-3.5 w-3.5" }), " Geler"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "border-violet-400/40 bg-violet-400/10 text-violet-300 hover:bg-violet-400/20",
							disabled: profile.account_type === "enterprise" || action.isPending,
							onClick: () => action.mutate({ account_type: "enterprise" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3.5 w-3.5" }), " Passer Enterprise"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: `Transactions (${txs.length})`,
					children: txs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Aucune transaction" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
						className: "w-full text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: txs.slice(0, 12).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-white/[0.04]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 font-mono text-slate-500",
									children: [t.id.slice(0, 10), "…"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 capitalize text-slate-400",
									children: t.type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 text-right font-mono text-white",
									children: [
										Number(t.amount).toLocaleString("fr-FR"),
										" ",
										t.currency
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, { s: t.status })
								})
							]
						}, t.id)) })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: `Lots de décaissement (${payouts.length})`,
					children: payouts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { children: "Aucun lot" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
						className: "w-full text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: payouts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-white/[0.04]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-slate-300",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 text-slate-500",
									children: [p.total_count, " bénéficiaires"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-2 text-right font-mono text-white",
									children: [
										Number(p.total_amount).toLocaleString("fr-FR"),
										" ",
										p.currency
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusDot, { s: p.status })
								})
							]
						}, p.id)) })
					})
				})]
			})
		]
	});
}
function Panel({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-white/10 bg-white/[0.03] p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 text-sm font-semibold text-white",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children
		})]
	});
}
function Empty({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-6 text-center text-xs text-slate-500",
		children
	});
}
function Kyc({ s }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase", {
			pending: "border-amber-400/30 bg-amber-400/15 text-amber-300",
			approved: "border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
			rejected: "border-rose-400/30 bg-rose-400/15 text-rose-300",
			frozen: "border-slate-400/30 bg-slate-400/15 text-slate-300"
		}[s]),
		children: ["KYC ", s]
	});
}
function StatusDot({ s }) {
	const map = {
		success: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
		pending: "bg-amber-400/15 text-amber-300 border-amber-400/30",
		failed: "bg-rose-400/15 text-rose-300 border-rose-400/30",
		processing: "bg-sky-400/15 text-sky-300 border-sky-400/30",
		completed_with_errors: "bg-amber-400/15 text-amber-300 border-amber-400/30"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase", map[s] ?? map.pending),
		children: s
	});
}
//#endregion
export { Merchant360 as component };
