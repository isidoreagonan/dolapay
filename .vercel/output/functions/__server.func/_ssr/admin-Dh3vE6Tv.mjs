import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-SdCiCddD.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Bt as CircleCheck, C as ShieldAlert, K as Mail, Nt as Sparkles, W as Maximize2, n as X, st as FileText, x as ShieldOff, xt as Building2 } from "../_libs/lucide-react.mjs";
import { n as useIsAdmin } from "./route-CxqUnOG7.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as DialogContent$1, t as Dialog$1 } from "./dialog-DGl8EHd4.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Dh3vE6Tv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function AdminPage() {
	const { data: isAdmin, isLoading } = useIsAdmin();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Vérification des permissions…"
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mx-auto h-8 w-8 text-rose-500" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 text-lg font-semibold",
				children: "Accès refusé"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Cette zone est réservée aux administrateurs DolaPay."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCenter, {});
}
function AdminCenter() {
	const [selected, setSelected] = (0, import_react.useState)(null);
	const { data: profiles = [] } = useQuery({
		queryKey: ["admin-profiles-v2"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("id,email,full_name,account_type,kyc_status,verification_mode,ai_verification_score,ai_verification_log,ai_verified_at,country,created_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: businesses = [] } = useQuery({
		queryKey: ["admin-businesses"],
		queryFn: async () => {
			const { data, error } = await supabase.from("businesses").select("profile_id,company_name,hq_country");
			if (error) throw error;
			return data ?? [];
		}
	});
	const bizMap = new Map(businesses.map((b) => [b.profile_id, b]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Centre de revue KYC"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Examinez les dossiers marchands, AI Didit ou revue manuelle."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left",
									children: "Entreprise"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left",
									children: "Pays"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left",
									children: "Mode"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-left",
									children: "Statut"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-border",
							children: [profiles.map((p) => {
								const biz = bizMap.get(p.id);
								const country = biz?.hq_country || p.country || "—";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									onClick: () => setSelected(p),
									className: "cursor-pointer transition-colors hover:bg-muted/30",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold",
												children: biz?.company_name || p.full_name || "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: p.email
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: country
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", p.account_type === "enterprise" ? "bg-violet-500/10 text-violet-600 dark:text-violet-300" : "bg-slate-500/10 text-slate-600 dark:text-slate-300"),
												children: p.account_type
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBadge, { mode: p.verification_mode })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: p.kyc_status })
										})
									]
								}, p.id);
							}), profiles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "px-4 py-10 text-center text-muted-foreground",
								children: "Aucun marchand."
							}) })]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MerchantDrawer, {
				profile: selected,
				business: selected ? bizMap.get(selected.id) ?? null : null,
				onClose: () => setSelected(null)
			})
		]
	});
}
function ModeBadge({ mode }) {
	if (mode === "didit_ai") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		className: "inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600 shadow-[0_0_12px_rgba(52,211,153,0.35)] dark:text-emerald-300",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), " Auto-approuvé (Didit AI)"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-300",
		children: "Revue manuelle"
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", {
			pending: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
			approved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
			rejected: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
			frozen: "bg-slate-500/15 text-slate-500"
		}[status]),
		children: status
	});
}
function MerchantDrawer({ profile, business, onClose }) {
	const qc = useQueryClient();
	const { data: docs = [] } = useQuery({
		queryKey: ["admin-docs-v2", profile?.id],
		enabled: !!profile?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("kyc_documents").select("id,document_type,file_path,status").eq("profile_id", profile.id);
			if (error) throw error;
			return data ?? [];
		}
	});
	const { data: urlMap = {} } = useQuery({
		queryKey: [
			"admin-docs-urls",
			profile?.id,
			docs.map((d) => d.id).join(",")
		],
		enabled: docs.length > 0,
		queryFn: async () => {
			const out = {};
			for (const d of docs) {
				const KNOWN = ["enterprise-kyc-docs", "kyc-documents"];
				const first = d.file_path.split("/")[0];
				const bucket = KNOWN.includes(first) ? first : "kyc-documents";
				const key = KNOWN.includes(first) ? d.file_path.slice(first.length + 1) : d.file_path;
				const { data } = await supabase.storage.from(bucket).createSignedUrl(key, 600);
				if (data?.signedUrl) out[d.id] = data.signedUrl;
			}
			return out;
		}
	});
	const setStatus = useMutation({
		mutationFn: async (args) => {
			const patch = { kyc_status: args.status };
			if (args.status === "rejected") patch.kyc_rejection_reason = args.reason ?? null;
			const { error } = await supabase.from("profiles").update(patch).eq("id", profile.id);
			if (error) throw error;
		},
		onSuccess: (_d, args) => {
			toast.success({
				approved: "Compte approuvé manuellement",
				frozen: "Compte suspendu",
				rejected: "Dossier rejeté"
			}[args.status] ?? "Statut mis à jour");
			qc.invalidateQueries({ queryKey: ["admin-profiles-v2"] });
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	const [zoom, setZoom] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: !!profile,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			className: "flex w-full flex-col gap-0 p-0 sm:max-w-xl",
			children: profile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
					className: "border-b border-border bg-muted/30 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-primary" }), business?.company_name || profile.full_name || "Marchand"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
							className: "flex items-center gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
								" ",
								profile.email
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeBadge, { mode: profile.verification_mode }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: profile.kyc_status })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-5 overflow-y-auto p-6",
					children: [profile.verification_mode === "didit_ai" && profile.ai_verification_log && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }), " Journal d'audit AI"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-emerald-900/80 dark:text-emerald-100/80",
							children: [
								"Contrôle MRZ ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: profile.ai_verification_log.mrz_check === "passed" ? "validé" : "échoué" }),
								", screening sanctions ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: profile.ai_verification_log.sanctions_screening === "clean" ? "RAS" : "hit" }),
								", score de face match ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [(profile.ai_verification_log.face_match_score ?? 0).toFixed(1), "%"] }),
								"."
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Documents stockés"
					}), docs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Aucun document soumis."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3",
						children: docs.map((d) => {
							const url = urlMap[d.id];
							const isPdf = d.file_path.toLowerCase().endsWith(".pdf");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "group relative overflow-hidden rounded-xl border border-border bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "aspect-[4/3] w-full bg-background",
										children: url && !isPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: url,
											alt: d.document_type,
											className: "h-full w-full object-cover"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex h-full flex-col items-center justify-center gap-1 text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px]",
												children: "PDF"
											})]
										})
									}),
									url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => isPdf ? window.open(url, "_blank") : setZoom(url),
										className: "absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-[10px] font-medium opacity-0 shadow backdrop-blur transition-opacity group-hover:opacity-100",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3 w-3" }), " Zoom"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-border p-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-xs font-semibold capitalize",
											children: d.document_type.replace(/_/g, " ")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground",
											children: d.status
										})]
									})
								]
							}, d.id);
						})
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-0 flex flex-wrap gap-2 border-t border-border bg-background/95 p-4 backdrop-blur",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "flex-1 border-rose-500/40 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600",
							onClick: () => {
								const reason = window.prompt("Motif du rejet (visible par le marchand) :");
								if (reason && reason.trim()) setStatus.mutate({
									status: "rejected",
									reason: reason.trim()
								});
							},
							disabled: setStatus.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "h-4 w-4" }), " Rejeter"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "flex-1 border-slate-500/40 text-slate-600 hover:bg-slate-500/10",
							onClick: () => setStatus.mutate({ status: "frozen" }),
							disabled: setStatus.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "h-4 w-4" }), " Suspendre"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "flex-1 bg-emerald-600 text-white hover:bg-emerald-600/90",
							onClick: () => setStatus.mutate({ status: "approved" }),
							disabled: setStatus.isPending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Approuver"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog$1, {
					open: !!zoom,
					onOpenChange: (o) => !o && setZoom(null),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent$1, {
						className: "max-w-4xl border-0 bg-black/95 p-2",
						children: zoom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: zoom,
							alt: "",
							className: "max-h-[85vh] w-full object-contain"
						})
					})
				})
			] })
		})
	});
}
//#endregion
export { AdminPage as component };
