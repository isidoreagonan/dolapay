import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-SdCiCddD.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { et as KeyRound, mt as Copy, p as Trash2 } from "../_libs/lucide-react.mjs";
import { r as useProfile } from "./route-B3vdXi7y.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-keys-_1zfJPQ0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ApiKeysPage() {
	const qc = useQueryClient();
	const { data: profile } = useProfile();
	const [label, setLabel] = (0, import_react.useState)("");
	const [newKey, setNewKey] = (0, import_react.useState)(null);
	const { data: keys = [] } = useQuery({
		queryKey: ["my-api-keys"],
		queryFn: async () => {
			const { data, error } = await supabase.from("api_keys").select("id,label,prefix,created_at,revoked_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const create = useMutation({
		mutationFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) throw new Error("Non connecté");
			const raw = "dp_live_" + crypto.randomUUID().replace(/-/g, "");
			const prefix = raw.slice(0, 12);
			const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
			const hashed = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
			const { error } = await supabase.from("api_keys").insert({
				profile_id: u.user.id,
				label,
				prefix,
				hashed_key: hashed
			});
			if (error) throw error;
			return raw;
		},
		onSuccess: (raw) => {
			setNewKey(raw);
			setLabel("");
			qc.invalidateQueries({ queryKey: ["my-api-keys"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const revoke = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("api_keys").update({ revoked_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Clé révoquée");
			qc.invalidateQueries({ queryKey: ["my-api-keys"] });
		}
	});
	if (profile?.account_type !== "enterprise") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 text-lg font-semibold",
				children: "Réservé aux comptes Entreprise"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Passez au compte Entreprise dans les paramètres pour accéder à l'API."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Clés API"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Créez des clés pour intégrer DolaPay à vos applications."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						create.mutate();
					},
					className: "grid gap-3 sm:grid-cols-[1fr_auto]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Libellé (ex: production-server)",
						value: label,
						onChange: (e) => setLabel(e.target.value),
						required: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: create.isPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 mr-2" }), "Générer"]
					})]
				}), newKey && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold text-emerald-700 dark:text-emerald-300",
							children: "Copiez cette clé maintenant — elle ne sera plus jamais affichée."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "flex-1 truncate rounded-lg bg-background px-3 py-2 font-mono text-xs",
								children: newKey
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									navigator.clipboard.writeText(newKey);
									toast.success("Copié");
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "mt-2",
							onClick: () => setNewKey(null),
							children: "J'ai sauvegardé la clé"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [keys.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex items-center justify-between p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-semibold",
						children: k.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-mono text-xs text-muted-foreground",
						children: [k.prefix, "…••••••••"]
					})] }), k.revoked_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Révoquée"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => revoke.mutate(k.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3 mr-1" }), " Révoquer"]
					})]
				}, k.id)), keys.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Aucune clé encore."
				})]
			})
		]
	});
}
//#endregion
export { ApiKeysPage as component };
