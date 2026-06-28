import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-nARMQEqv.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { K as Mail, p as Trash2, s as UserPlus } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/team-BYv5mAxw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamPage() {
	const qc = useQueryClient();
	const [email, setEmail] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("viewer");
	const { data: members = [] } = useQuery({
		queryKey: ["team-members"],
		queryFn: async () => {
			const { data, error } = await supabase.from("team_members").select("id,email,role,status,created_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const invite = useMutation({
		mutationFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) throw new Error("Non connecté");
			if (!email) throw new Error("Email requis");
			const { error } = await supabase.from("team_members").insert({
				owner_id: u.user.id,
				email: email.trim().toLowerCase(),
				role,
				status: "pending"
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Invitation envoyée");
			setEmail("");
			qc.invalidateQueries({ queryKey: ["team-members"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const revoke = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("team_members").update({ status: "revoked" }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Accès révoqué");
			qc.invalidateQueries({ queryKey: ["team-members"] });
		}
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("team_members").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Membre supprimé");
			qc.invalidateQueries({ queryKey: ["team-members"] });
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Équipe"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Invitez vos collègues à collaborer sur votre compte."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-sm font-semibold",
					children: "Inviter un membre"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-[1fr_180px_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "collegue@entreprise.com"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rôle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: role,
							onChange: (e) => setRole(e.target.value),
							className: "flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "viewer",
									children: "Lecteur"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "operator",
									children: "Opérateur"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "admin",
									children: "Administrateur"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => invite.mutate(),
								disabled: invite.isPending,
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-2 h-4 w-4" }), " Inviter"]
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-xs uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Membre"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Rôle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Statut"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-left",
								children: "Invité le"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-muted-foreground" }), m.email]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 capitalize",
								children: roleLabel(m.role)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: m.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted-foreground",
								children: new Date(m.created_at).toLocaleDateString("fr-FR")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3 text-right",
								children: [m.status !== "revoked" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => revoke.mutate(m.id),
									className: "mr-2",
									children: "Révoquer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => remove.mutate(m.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
								})]
							})
						]
					}, m.id)), members.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "px-4 py-10 text-center text-muted-foreground",
						children: "Aucun membre. Invitez votre première personne."
					}) })] })]
				})
			})
		]
	});
}
function roleLabel(r) {
	return r === "admin" ? "Administrateur" : r === "operator" ? "Opérateur" : "Lecteur";
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", {
			pending: "bg-amber-500/15 text-amber-600",
			active: "bg-emerald-500/15 text-emerald-600",
			revoked: "bg-rose-500/15 text-rose-600"
		}[status]),
		children: status
	});
}
//#endregion
export { TeamPage as component };
