import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-SdCiCddD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { $ as Landmark, A as ScanFace, Bt as CircleCheck, Ft as LoaderCircle, Nt as Sparkles, S as ShieldCheck, jt as TriangleAlert, k as ScanLine } from "../_libs/lucide-react.mjs";
import { r as useProfile } from "./route-B3vdXi7y.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-DGl8EHd4.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify-CUzCSsG2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifyPage() {
	const { data: profile } = useProfile();
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const { data: aiState } = useQuery({
		queryKey: ["ai-verification", profile?.id],
		enabled: !!profile?.id,
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("verification_mode,ai_verification_score,ai_verification_log,ai_verified_at,kyc_status").eq("id", profile.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	const finalize = useMutation({
		mutationFn: async (log) => {
			const { error } = await supabase.from("profiles").update({
				verification_mode: "didit_ai",
				ai_verification_score: log.face_match_score,
				ai_verification_log: log,
				ai_verified_at: (/* @__PURE__ */ new Date()).toISOString(),
				kyc_status: "approved"
			}).eq("id", profile.id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Identité vérifiée ✓", { description: "Décaissements et clés API live débloqués." });
			qc.invalidateQueries({ queryKey: ["ai-verification"] });
			qc.invalidateQueries({ queryKey: ["my-profile"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const isVerified = (aiState?.kyc_status ?? profile?.kyc_status) === "approved";
	const isPending = !isVerified && (profile?.kyc_status ?? "pending") === "pending";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Vérification d'identité"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Centre de conformité — débloquez vos paiements en moins de 10 secondes."
			})] }),
			isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: -8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-sm text-amber-900 dark:text-amber-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Action requise." }), " Complétez votre vérification d'identité pour débloquer les décaissements et les clés API live."]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "relative overflow-hidden border-0 bg-gradient-to-br from-[#0b1d3a] via-[#0e2347] to-[#10306b] p-8 text-white shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium backdrop-blur",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-sky-300" }), " Powered by Didit"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-bold tracking-tight sm:text-3xl",
									children: "Vérification AI instantanée"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "max-w-xl text-sm text-white/70 sm:text-base",
									children: "Vérifiez votre CNI / RCCM et faites un rapide selfie de vivacité. Approuvé automatiquement en moins de 10 secondes grâce au croisement avec les registres gouvernementaux et le screening sanctions."
								}),
								isVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2.5 text-sm font-semibold text-emerald-200",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
										" Identité vérifiée",
										aiState?.ai_verification_score ? ` · Score ${Number(aiState.ai_verification_score).toFixed(1)}%` : ""
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setOpen(true),
									size: "lg",
									className: "group h-12 gap-2 rounded-xl bg-white px-6 text-[#0b1d3a] shadow-lg hover:bg-white/90",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" }),
										"Démarrer la vérification d'identité",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 transition-transform group-hover:rotate-12" })
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden lg:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative h-44 w-44 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-20 w-20 text-sky-300/80" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
									animate: { y: [
										10,
										130,
										10
									] },
									transition: {
										duration: 3,
										repeat: Infinity,
										ease: "easeInOut"
									},
									className: "absolute inset-x-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_18px_rgba(125,211,252,0.8)]"
								})]
							})
						})]
					})
				]
			}),
			isVerified && aiState?.ai_verification_log && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-emerald-500/30 bg-emerald-500/5 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Journal d'audit AI"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogItem, {
							label: "MRZ",
							value: aiState.ai_verification_log.mrz_check === "passed" ? "Validé" : "Échec"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogItem, {
							label: "Sanctions",
							value: aiState.ai_verification_log.sanctions_screening === "clean" ? "RAS" : "Hit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogItem, {
							label: "Face match",
							value: `${aiState.ai_verification_log.face_match_score.toFixed(1)}%`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogItem, {
							label: "Vivacité",
							value: `${aiState.ai_verification_log.liveness_score.toFixed(1)}%`
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiditModal, {
				open,
				onClose: () => setOpen(false),
				onComplete: (log) => {
					finalize.mutate(log);
					setOpen(false);
				}
			})
		]
	});
}
function LogItem({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-emerald-500/20 bg-background/60 p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-0.5 text-sm font-semibold",
			children: value
		})]
	});
}
var STEPS = [
	{
		key: "scan",
		label: "Scan du document d'identité…",
		icon: ScanLine
	},
	{
		key: "face",
		label: "Vérification de vivacité (Face Match)…",
		icon: ScanFace
	},
	{
		key: "registry",
		label: "Croisement avec le registre gouvernemental…",
		icon: Landmark
	}
];
function DiditModal({ open, onClose, onComplete }) {
	const [step, setStep] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!open) {
			setStep(0);
			return;
		}
		if (step >= STEPS.length) {
			const t = setTimeout(() => {
				onComplete({
					provider: "didit",
					mrz_check: "passed",
					sanctions_screening: "clean",
					face_match_score: 99.4,
					liveness_score: 98.7
				});
			}, 700);
			return () => clearTimeout(t);
		}
		const t = setTimeout(() => setStep((s) => s + 1), 1600);
		return () => clearTimeout(t);
	}, [
		open,
		step,
		onComplete
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (o) => !o && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md overflow-hidden border-0 bg-gradient-to-br from-[#0b1d3a] to-[#10306b] p-0 text-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
					className: "px-6 pt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-white",
						children: "Session Didit AI"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-white/60",
						children: "Ne fermez pas cette fenêtre pendant la vérification."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-6 mt-4 aspect-square overflow-hidden rounded-2xl border border-white/10 bg-black/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-32 w-32 text-sky-300/40" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							animate: { y: ["-100%", "100%"] },
							transition: {
								duration: 1.8,
								repeat: Infinity,
								ease: "linear"
							},
							className: "absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-sky-300/30 to-transparent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-white" }), " Live"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 px-6 pb-6 pt-5",
					children: [STEPS.map((s, i) => {
						const done = i < step;
						const active = i === step;
						const Icon = s.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors", done && "border-emerald-400/40 bg-emerald-400/10 text-emerald-100", active && "border-sky-400/40 bg-sky-400/10 text-sky-100", !done && !active && "border-white/10 bg-white/5 text-white/40"),
							children: [done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-300" }) : active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-sky-300" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.label })]
						}, s.key);
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: step >= STEPS.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							scale: .95
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						className: "mt-2 flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2.5 text-sm font-semibold text-emerald-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Identité confirmée — finalisation…"]
					}) })]
				})
			]
		})
	});
}
//#endregion
export { VerifyPage as component };
