import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-nARMQEqv.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as useProfile } from "./route-CG8Dj4kH.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { Bt as CircleCheck, Ft as LoaderCircle, et as KeyRound, gt as Clock, l as Upload, zt as CircleX } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CCJRliUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-ZuSEzmVp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STANDARD_DOCS = [
	{
		type: "id",
		label: "Pièce d'identité / Passeport"
	},
	{
		type: "selfie",
		label: "Selfie de vérification"
	},
	{
		type: "proof_of_address",
		label: "Justificatif de domicile"
	}
];
var ENTERPRISE_DOCS = [
	{
		type: "rccm",
		label: "Registre du commerce (RCCM)"
	},
	{
		type: "director_id",
		label: "Pièce d'identité du dirigeant"
	},
	{
		type: "bank_details",
		label: "Coordonnées bancaires"
	}
];
function SettingsPage() {
	const qc = useQueryClient();
	const { data: profile } = useProfile();
	const { data: docs = [] } = useQuery({
		queryKey: ["my-kyc-docs"],
		queryFn: async () => {
			const { data, error } = await supabase.from("kyc_documents").select("id,document_type,file_path,status").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const updateAccountType = useMutation({
		mutationFn: async (account_type) => {
			const { error } = await supabase.from("profiles").update({ account_type }).eq("id", profile.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Type de compte mis à jour");
			qc.invalidateQueries({ queryKey: ["my-profile"] });
		}
	});
	if (!profile) return null;
	const docsList = profile.account_type === "enterprise" ? ENTERPRISE_DOCS : STANDARD_DOCS;
	const submittedTypes = new Set(docs.map((d) => d.document_type));
	const allSubmitted = docsList.every((d) => submittedTypes.has(d.type));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Compte & Conformité (KYC)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Téléchargez vos documents pour activer toutes les fonctionnalités."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wider text-muted-foreground",
						children: "Statut KYC"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KycStatusBig, { status: profile.kyc_status })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: profile.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Limite : ",
								new Intl.NumberFormat("fr-FR").format(profile.volume_limit_xof),
								" XOF"
							]
						})]
					})]
				}), profile.kyc_status === "pending" && allSubmitted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300",
					children: "Tous vos documents ont été envoyés. Un agent DolaPay les examinera sous 24-48h."
				})]
			}),
			profile.onboarding_completed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: "Documents de conformité"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"Vos documents ont été soumis lors de l'onboarding. Pour toute mise à jour, contactez",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "mailto:compliance@dola-pay.com",
							className: "text-primary underline",
							children: "compliance@dola-pay.com"
						}),
						"."
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: profile.account_type,
				onValueChange: (v) => updateAccountType.mutate(v),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "standard",
						children: "Compte Standard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "enterprise",
						children: "Compte Entreprise"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "standard",
						className: "mt-4",
						children: profile.account_type === "standard" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocList, {
							docs: STANDARD_DOCS,
							existing: docs,
							userId: profile.id
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "p-4 text-sm text-muted-foreground",
							children: "Basculer sur ce type recharge vos documents."
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "enterprise",
						className: "mt-4 space-y-4",
						children: profile.account_type === "enterprise" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnterpriseFields, { profileId: profile.id }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocList, {
							docs: ENTERPRISE_DOCS,
							existing: docs,
							userId: profile.id
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "p-4 text-sm text-muted-foreground",
							children: "Sélectionnez ce type pour saisir les informations entreprise."
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PasswordSection, {})
		]
	});
}
function PasswordSection() {
	const [hasPassword, setHasPassword] = (0, import_react.useState)(null);
	const [current, setCurrent] = (0, import_react.useState)("");
	const [next, setNext] = (0, import_react.useState)("");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => {
			const u = data.user;
			if (!u) return;
			setHasPassword((u.app_metadata?.providers ?? [u.app_metadata?.provider].filter(Boolean)).includes("email"));
		});
	}, []);
	async function handleSubmit(e) {
		e.preventDefault();
		if (next.length < 8) {
			toast.error("Le mot de passe doit comporter au moins 8 caractères");
			return;
		}
		if (next !== confirm) {
			toast.error("Les mots de passe ne correspondent pas");
			return;
		}
		setLoading(true);
		if (hasPassword) {
			const { data: u } = await supabase.auth.getUser();
			const { error: signInErr } = await supabase.auth.signInWithPassword({
				email: u.user.email,
				password: current
			});
			if (signInErr) {
				setLoading(false);
				toast.error("Mot de passe actuel incorrect");
				return;
			}
		}
		const { error } = await supabase.auth.updateUser({ password: next });
		setLoading(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(hasPassword ? "Mot de passe mis à jour" : "Mot de passe défini — vous pouvez désormais vous connecter par e-mail");
		setCurrent("");
		setNext("");
		setConfirm("");
		setHasPassword(true);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "space-y-4 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: hasPassword === false ? "Définir un mot de passe" : "Changer le mot de passe"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: hasPassword === false ? "Vous vous êtes inscrit via Google. Définissez un mot de passe pour pouvoir vous connecter aussi par e-mail." : "Choisissez un nouveau mot de passe sécurisé d'au moins 8 caractères."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "grid gap-3 sm:max-w-md",
			children: [
				hasPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					placeholder: "Mot de passe actuel",
					value: current,
					onChange: (e) => setCurrent(e.target.value),
					required: true,
					autoComplete: "current-password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					placeholder: "Nouveau mot de passe",
					value: next,
					onChange: (e) => setNext(e.target.value),
					required: true,
					autoComplete: "new-password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "password",
					placeholder: "Confirmer le mot de passe",
					value: confirm,
					onChange: (e) => setConfirm(e.target.value),
					required: true,
					autoComplete: "new-password"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: loading,
					className: "w-fit",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : hasPassword ? "Mettre à jour" : "Définir le mot de passe"
				})
			]
		})]
	});
}
function KycStatusBig({ status }) {
	const m = {
		pending: {
			label: "En attente de vérification",
			cls: "text-amber-600 dark:text-amber-300",
			Icon: Clock
		},
		approved: {
			label: "Compte approuvé",
			cls: "text-emerald-600 dark:text-emerald-300",
			Icon: CircleCheck
		},
		rejected: {
			label: "Dossier rejeté",
			cls: "text-rose-600 dark:text-rose-300",
			Icon: CircleX
		},
		frozen: {
			label: "Compte gelé",
			cls: "text-slate-500",
			Icon: CircleX
		}
	};
	const { label, cls, Icon } = m[status] ?? m.pending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mt-1 flex items-center gap-2 text-lg font-semibold", cls),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" }),
			" ",
			label
		]
	});
}
function DocList({ docs, existing, userId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3",
		children: docs.map((d) => {
			const ex = existing.find((e) => e.document_type === d.type);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocUpload, {
				type: d.type,
				label: d.label,
				existing: ex,
				userId
			}, d.type);
		})
	});
}
function DocUpload({ type, label, existing, userId }) {
	const qc = useQueryClient();
	const [uploading, setUploading] = (0, import_react.useState)(false);
	async function handleUpload(file) {
		setUploading(true);
		const ext = file.name.split(".").pop() ?? "bin";
		const path = `${userId}/${type}-${Date.now()}.${ext}`;
		const { error: upErr } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: true });
		if (upErr) {
			setUploading(false);
			toast.error(upErr.message);
			return;
		}
		const { error: dbErr } = await supabase.from("kyc_documents").insert({
			profile_id: userId,
			document_type: type,
			file_path: path,
			status: "pending"
		});
		setUploading(false);
		if (dbErr) {
			toast.error(dbErr.message);
			return;
		}
		toast.success("Document téléversé");
		qc.invalidateQueries({ queryKey: ["my-kyc-docs"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex items-center justify-between p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm font-semibold",
			children: label
		}), existing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-xs text-muted-foreground",
			children: ["Statut : ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold",
				children: existing.status
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs text-muted-foreground",
			children: "Aucun document encore"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: cn("inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent", uploading && "opacity-60"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3 w-3" }),
				" ",
				existing ? "Remplacer" : "Téléverser",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "image/*,application/pdf",
					className: "hidden",
					disabled: uploading,
					onChange: (e) => {
						const f = e.target.files?.[0];
						if (f) handleUpload(f);
					}
				})
			]
		})]
	});
}
function EnterpriseFields({ profileId }) {
	const qc = useQueryClient();
	const { data } = useQuery({
		queryKey: ["my-business"],
		queryFn: async () => {
			const { data, error } = await supabase.from("businesses").select("*").maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const [companyName, setCompanyName] = (0, import_react.useState)("");
	const [regNum, setRegNum] = (0, import_react.useState)("");
	const [taxId, setTaxId] = (0, import_react.useState)("");
	const save = useMutation({
		mutationFn: async () => {
			const { error } = await supabase.from("businesses").upsert({
				profile_id: profileId,
				company_name: companyName || data?.company_name || "",
				registration_number: regNum || data?.registration_number,
				tax_id: taxId || data?.tax_id
			}, { onConflict: "profile_id" });
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Entreprise enregistrée");
			qc.invalidateQueries({ queryKey: ["my-business"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "space-y-3 p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold",
				children: "Informations entreprise"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: data?.company_name || "Raison sociale",
				value: companyName,
				onChange: (e) => setCompanyName(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: data?.registration_number || "N° d'immatriculation (RCCM)",
				value: regNum,
				onChange: (e) => setRegNum(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: data?.tax_id || "Identifiant fiscal",
				value: taxId,
				onChange: (e) => setTaxId(e.target.value)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => save.mutate(),
				disabled: save.isPending,
				children: "Enregistrer"
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
