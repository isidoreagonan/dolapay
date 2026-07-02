import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-SdCiCddD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { E as Send, Ft as LoaderCircle, L as Plus, ct as FileSpreadsheet, ft as Crown, l as Upload } from "../_libs/lucide-react.mjs";
import { r as useProfile } from "./route-B3vdXi7y.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, t as Dialog } from "./dialog-DGl8EHd4.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as getTier } from "./tier-NT1-wYki.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payouts-BBjRJq6m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PayoutsRoute() {
	const { data: profile } = useProfile();
	if (!getTier(profile?.account_type).capabilities.payouts) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-[60vh] place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "w-full max-w-lg border-amber-400/40 bg-card/70 p-8 text-center backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-amber-400/15 text-amber-500",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-7 w-7" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "Fonctionnalité Enterprise"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						"Passez à l'",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Enterprise Tier" }),
						" pour débloquer les décaissements automatisés vers des tiers, les virements en masse et les webhooks signés."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/settings",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4" }), " Demander la mise à niveau"]
					})
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayoutsPage, {});
}
function PayoutsPage() {
	const qc = useQueryClient();
	const { data: batches = [] } = useQuery({
		queryKey: ["payout-batches"],
		queryFn: async () => {
			const { data, error } = await supabase.from("payout_batches").select("id,name,currency,status,total_amount,total_count,created_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)("XOF");
	const [rows, setRows] = (0, import_react.useState)([{
		recipient_name: "",
		recipient_phone: "",
		provider: "MTN",
		amount: 0
	}]);
	function addRow() {
		setRows((r) => [...r, {
			recipient_name: "",
			recipient_phone: "",
			provider: "MTN",
			amount: 0
		}]);
	}
	function updateRow(i, patch) {
		setRows((r) => r.map((x, idx) => idx === i ? {
			...x,
			...patch
		} : x));
	}
	function removeRow(i) {
		setRows((r) => r.filter((_, idx) => idx !== i));
	}
	async function handleCsv(file) {
		const lines = (await file.text()).split(/\r?\n/).filter(Boolean);
		const parsed = [];
		for (let i = 0; i < lines.length; i++) {
			const cols = lines[i].split(",").map((c) => c.trim());
			if (i === 0 && isNaN(Number(cols[3]))) continue;
			parsed.push({
				recipient_name: cols[0] ?? "",
				recipient_phone: cols[1] ?? "",
				provider: cols[2] ?? "MTN",
				amount: Number(cols[3] ?? 0)
			});
		}
		if (parsed.length) {
			setRows(parsed);
			toast.success(`${parsed.length} lignes importées`);
		} else toast.error("CSV vide ou invalide");
	}
	const createBatch = useMutation({
		mutationFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) throw new Error("Non connecté");
			const valid = rows.filter((r) => r.recipient_name && r.recipient_phone && r.amount > 0);
			if (!valid.length) throw new Error("Ajoutez au moins une ligne valide");
			const total = valid.reduce((s, r) => s + Number(r.amount), 0);
			const { data: batch, error: e1 } = await supabase.from("payout_batches").insert({
				owner_id: u.user.id,
				name: name || `Batch du ${(/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR")}`,
				currency,
				total_amount: total,
				total_count: valid.length,
				status: "draft"
			}).select().single();
			if (e1) throw e1;
			const { error: e2 } = await supabase.from("payout_batch_items").insert(valid.map((r) => ({
				...r,
				batch_id: batch.id,
				currency
			})));
			if (e2) throw e2;
		},
		onSuccess: () => {
			toast.success("Batch créé");
			setOpen(false);
			setName("");
			setRows([{
				recipient_name: "",
				recipient_phone: "",
				provider: "MTN",
				amount: 0
			}]);
			qc.invalidateQueries({ queryKey: ["payout-batches"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const sendBatch = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("payout_batches").update({ status: "processing" }).eq("id", id);
			if (error) throw error;
			await new Promise((r) => setTimeout(r, 800));
			await supabase.from("payout_batch_items").update({ status: "success" }).eq("batch_id", id);
			await supabase.from("payout_batches").update({ status: "completed" }).eq("id", id);
		},
		onSuccess: () => {
			toast.success("Batch envoyé");
			qc.invalidateQueries({ queryKey: ["payout-batches"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Décaissements en masse"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Importez un CSV ou ajoutez manuellement vos bénéficiaires."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Nouveau batch"] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Créer un batch de décaissement" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nom du batch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "Salaires Juin"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Devise" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: currency,
								onChange: (e) => setCurrency(e.target.value.toUpperCase())
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								className: "flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2 text-sm hover:bg-accent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }),
									" Importer CSV",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: ".csv",
										className: "hidden",
										onChange: (e) => e.target.files?.[0] && handleCsv(e.target.files[0])
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "Format: nom, téléphone, opérateur, montant"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-72 overflow-auto rounded-xl border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/40 text-xs uppercase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-left",
											children: "Nom"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-left",
											children: "Téléphone"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-left",
											children: "Opérateur"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-3 py-2 text-right",
											children: "Montant"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-t border-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: r.recipient_name,
												onChange: (e) => updateRow(i, { recipient_name: e.target.value })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: r.recipient_phone,
												onChange: (e) => updateRow(i, { recipient_phone: e.target.value })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: r.provider,
												onChange: (e) => updateRow(i, { provider: e.target.value })
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: r.amount,
												onChange: (e) => updateRow(i, { amount: Number(e.target.value) }),
												className: "text-right"
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => removeRow(i),
												className: "text-xs text-muted-foreground hover:text-rose-500",
												children: "×"
											})
										})
									]
								}, i)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: addRow,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Ajouter une ligne"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Total: "
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono font-bold",
										children: [
											fmt(total),
											" ",
											currency
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-3 text-muted-foreground",
										children: [
											"(",
											rows.length,
											" bénéficiaires)"
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full",
							disabled: createBatch.isPending,
							onClick: () => createBatch.mutate(),
							children: [createBatch.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-2 h-4 w-4" }), "Créer le batch"]
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/40 text-xs uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Nom"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Bénéficiaires"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Total"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Statut"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Créé"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Action"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [batches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-medium",
							children: b.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: b.total_count
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-right font-mono",
							children: [
								fmt(Number(b.total_amount)),
								" ",
								b.currency
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: b.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted-foreground",
							children: new Date(b.created_at).toLocaleDateString("fr-FR")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: b.status === "draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: sendBatch.isPending,
								onClick: () => sendBatch.mutate(b.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-2 h-3 w-3" }), " Envoyer"]
							})
						})
					]
				}, b.id)), batches.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "px-4 py-10 text-center text-muted-foreground",
					children: "Aucun batch encore. Créez-en un pour commencer."
				}) })] })]
			})
		})]
	});
}
function StatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", {
			draft: "bg-slate-500/15 text-slate-500",
			processing: "bg-amber-500/15 text-amber-600",
			completed: "bg-emerald-500/15 text-emerald-600",
			failed: "bg-rose-500/15 text-rose-600"
		}[status]),
		children: status
	});
}
function fmt(n) {
	return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}
//#endregion
export { PayoutsRoute as component };
