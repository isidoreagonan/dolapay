import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-SdCiCddD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { Bt as CircleCheck, D as Search, I as QrCode, L as Plus, N as Receipt, Nt as Sparkles, S as ShieldCheck, Tt as ArrowRight, V as MessageSquareHeart, X as Link, _t as ChevronUp, at as Hash, bt as Check, i as Wallet, lt as Eye, mt as Copy, rt as Image, t as Zap, ut as ExternalLink, yt as ChevronDown } from "../_libs/lucide-react.mjs";
import { r as useProfile } from "./route-CxqUnOG7.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, t as Dialog } from "./dialog-DGl8EHd4.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payment-links-iB0FyswB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [field-sizing:content]", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var CURRENCIES = [
	{
		code: "XOF",
		label: "Franc CFA Ouest",
		symbol: "F CFA"
	},
	{
		code: "XAF",
		label: "Franc CFA Central",
		symbol: "F CFA"
	},
	{
		code: "USD",
		label: "Dollar US",
		symbol: "$"
	}
];
function genInvoice() {
	const d = /* @__PURE__ */ new Date();
	return `INV-${d.getFullYear().toString().slice(-2)}${String(d.getMonth() + 1).padStart(2, "0")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
function PaymentLinksPage() {
	const qc = useQueryClient();
	const { data: profile } = useProfile();
	const locked = profile?.kyc_status !== "approved";
	const [open, setOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [previewLink, setPreviewLink] = (0, import_react.useState)(null);
	const { data: links = [] } = useQuery({
		queryKey: ["my-payment-links"],
		queryFn: async () => {
			const { data, error } = await supabase.from("payment_links").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => links.filter((l) => !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.invoice_number?.toLowerCase().includes(search.toLowerCase())), [links, search]);
	const toggleActive = useMutation({
		mutationFn: async ({ id, active }) => {
			const { error } = await supabase.from("payment_links").update({ active }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["my-payment-links"] })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Studio de facturation"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-3xl font-black tracking-tight",
						children: "Liens de paiement"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Créez des liens élégants — devise, image, redirection, remerciement, frais — sans une ligne de code."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open,
					onOpenChange: setOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							disabled: locked,
							className: "gap-2 shadow-lg shadow-primary/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Nouveau lien"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreateLinkDialog, { onClose: () => setOpen(false) })]
				})]
			}),
			locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-amber-300/40 bg-amber-50/60 p-4 text-sm text-amber-900 dark:bg-amber-500/5 dark:text-amber-200",
				children: "Vérification KYC requise pour créer des liens de paiement."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Link,
						label: "Liens",
						value: links.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Zap,
						label: "Actifs",
						value: links.filter((l) => l.active).length,
						accent: "emerald"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: Receipt,
						label: "Avec facture",
						value: links.filter((l) => l.invoice_number).length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						icon: ShieldCheck,
						label: "Sécurisés",
						value: "100%",
						accent: "primary"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Rechercher un lien (titre, n° facture)…",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "h-11 pl-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "popLayout",
				children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					className: "rounded-2xl border border-dashed border-border bg-muted/30 p-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "mx-auto h-10 w-10 text-muted-foreground/60" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "Aucun lien pour l'instant."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
					children: filtered.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						layout: true,
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						exit: {
							opacity: 0,
							scale: .95
						},
						transition: {
							delay: i * .04,
							duration: .25
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkCard, {
							link: l,
							onToggle: (v) => toggleActive.mutate({
								id: l.id,
								active: v
							}),
							onPreview: () => setPreviewLink(l)
						})
					}, l.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!previewLink,
				onOpenChange: (v) => !v && setPreviewLink(null),
				children: previewLink && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewDialog, { link: previewLink })
			})
		]
	});
}
function StatCard({ icon: Icon, label, value, accent = "default" }) {
	const ring = accent === "emerald" ? "ring-emerald-500/20" : accent === "primary" ? "ring-primary/20" : "ring-border";
	const text = accent === "emerald" ? "text-emerald-500" : accent === "primary" ? "text-primary" : "text-muted-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border bg-card/60 p-4 ring-1 backdrop-blur-xl", ring),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4", text) })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 text-2xl font-black tracking-tight",
			children: value
		})]
	});
}
function LinkCard({ link, onToggle, onPreview }) {
	const url = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${link.slug}`;
	const sym = CURRENCIES.find((c) => c.code === link.currency)?.symbol ?? link.currency;
	const amount = new Intl.NumberFormat("fr-FR").format(Number(link.amount));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "group relative overflow-hidden border-white/10 bg-gradient-to-br from-card/80 via-card/60 to-card/40 p-0 backdrop-blur-2xl transition-all hover:shadow-2xl hover:shadow-primary/10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3 p-3 sm:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/30 via-primary/10 to-transparent",
				children: link.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: link.image_url,
					alt: "",
					className: "h-full w-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 grid place-items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "h-7 w-7 text-primary/50" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "truncate text-sm font-bold leading-tight",
								children: link.title
							}), link.invoice_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 inline-flex items-center gap-1 text-[10px] font-mono text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "h-2.5 w-2.5" }),
									" ",
									link.invoice_number
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: link.active,
							onCheckedChange: onToggle,
							className: "scale-90"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-black tracking-tight",
								children: amount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: sym
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: link.active ? "default" : "secondary",
								className: "ml-auto h-4 px-1.5 text-[9px]",
								children: link.active ? "Actif" : "Inactif"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 grid grid-cols-3 gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-8 gap-1 px-2 text-[11px]",
								onClick: () => {
									navigator.clipboard.writeText(url);
									toast.success("Lien copié");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" }), " Copier"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-8 gap-1 px-2 text-[11px]",
								onClick: onPreview,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), " Voir"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-8 gap-1 px-2 text-[11px]",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: url,
									target: "_blank",
									rel: "noreferrer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), " Ouvrir"]
								})
							})
						]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden sm:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-28 overflow-hidden bg-gradient-to-br from-primary/30 via-primary/10 to-transparent",
				children: [
					link.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: link.image_url,
						alt: "",
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "h-10 w-10 text-primary/40" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute right-3 top-3 flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: link.active ? "default" : "secondary",
							className: "backdrop-blur",
							children: link.active ? "Actif" : "Inactif"
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold leading-tight",
							children: link.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: link.active,
							onCheckedChange: onToggle
						})]
					}), link.invoice_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 inline-flex items-center gap-1 text-[11px] font-mono text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hash, { className: "h-3 w-3" }),
							" ",
							link.invoice_number
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl font-black tracking-tight",
								children: amount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted-foreground",
								children: sym
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto text-[10px] font-semibold uppercase text-muted-foreground",
								children: ["Frais: ", link.fees_paid_by === "customer" ? "Client" : "Vous"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-border/60 bg-background/60 px-3 py-2 backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { className: "h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate font-mono text-[11px] text-muted-foreground",
							children: url
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									navigator.clipboard.writeText(url);
									toast.success("Lien copié");
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: onPreview,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: url,
									target: "_blank",
									rel: "noreferrer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })
								})
							})
						]
					})
				]
			})]
		})]
	});
}
function CreateLinkDialog({ onClose }) {
	const qc = useQueryClient();
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)("XOF");
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const [invoiceNumber, setInvoiceNumber] = (0, import_react.useState)("");
	const [feesPaidBy, setFeesPaidBy] = (0, import_react.useState)("merchant");
	const [successUrl, setSuccessUrl] = (0, import_react.useState)("");
	const [failureUrl, setFailureUrl] = (0, import_react.useState)("");
	const [thankYou, setThankYou] = (0, import_react.useState)("");
	const create = useMutation({
		mutationFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) throw new Error("Non connecté");
			const slug = Math.random().toString(36).slice(2, 10);
			const validUrl = (s) => {
				if (!s.trim()) return null;
				try {
					return new URL(s.trim()).toString();
				} catch {
					throw new Error("URL invalide");
				}
			};
			const { error } = await supabase.from("payment_links").insert({
				profile_id: u.user.id,
				title: title.trim(),
				description: description.trim() || null,
				amount: Number(amount),
				currency,
				slug,
				image_url: imageUrl || null,
				invoice_number: invoiceNumber.trim() || null,
				fees_paid_by: feesPaidBy,
				success_url: validUrl(successUrl),
				failure_url: validUrl(failureUrl),
				thank_you_message: thankYou.trim() || null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Lien créé avec succès");
			qc.invalidateQueries({ queryKey: ["my-payment-links"] });
			onClose();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-h-[90vh] max-w-2xl overflow-y-auto border-white/10 bg-card/90 backdrop-blur-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
			className: "flex items-center gap-2 text-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5 text-primary" }), " Nouveau lien de paiement"]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				create.mutate();
			},
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					icon: Receipt,
					title: "Informations principales",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Titre du paiement *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							required: true,
							maxLength: 120,
							placeholder: "Ex : Abonnement Pro — Mensuel"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description (optionnel)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							maxLength: 500,
							placeholder: "Détaillez ce que le client paie…",
							rows: 2
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-[2fr_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Montant *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 100,
								step: "any",
								value: amount,
								onChange: (e) => setAmount(e.target.value),
								required: true,
								placeholder: "10000"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Devise" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: currency,
								onValueChange: (v) => setCurrency(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: c.code,
									children: [
										c.code,
										" — ",
										c.symbol
									]
								}, c.code)) })]
							})] })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					icon: Hash,
					title: "Facturation & frais",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Numéro de facture" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: invoiceNumber,
							onChange: (e) => setInvoiceNumber(e.target.value),
							placeholder: "INV-2026-001"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setInvoiceNumber(genInvoice()),
							className: "shrink-0 gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Générer"]
						})]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Qui paie les frais de transaction ?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 grid grid-cols-2 gap-2",
						children: ["merchant", "customer"].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setFeesPaidBy(f),
							className: cn("rounded-xl border px-4 py-3 text-left text-sm transition-all", feesPaidBy === f ? "border-primary bg-primary/10 ring-2 ring-primary/30" : "border-border hover:border-primary/40"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4" }), f === "merchant" ? "Moi (commerçant)" : "Le client"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: f === "merchant" ? "Frais déduits du montant reçu" : "Frais ajoutés au paiement"
							})]
						}, f))
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					icon: Image,
					title: "Visuel",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUploader, {
						value: imageUrl,
						onChange: setImageUrl
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					icon: ArrowRight,
					title: "Redirection après paiement",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-emerald-600",
							children: "URL succès"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "url",
							value: successUrl,
							onChange: (e) => setSuccessUrl(e.target.value),
							placeholder: "https://votre-site.com/merci"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-rose-600",
							children: "URL échec"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "url",
							value: failureUrl,
							onChange: (e) => setFailureUrl(e.target.value),
							placeholder: "https://votre-site.com/echec"
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					icon: MessageSquareHeart,
					title: "Message de remerciement",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: thankYou,
						onChange: (e) => setThankYou(e.target.value),
						maxLength: 300,
						rows: 2,
						placeholder: "Merci pour votre confiance ! Votre commande sera traitée sous 24h."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sticky bottom-0 -mx-6 -mb-6 flex gap-3 border-t border-border bg-card/95 px-6 py-4 backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: onClose,
						className: "flex-1",
						children: "Annuler"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: create.isPending,
						className: "flex-1 gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Créer le lien"]
					})]
				})
			]
		})]
	});
}
function Section({ icon: Icon, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sm font-bold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
			}), title]
		}), children]
	});
}
function PreviewDialog({ link }) {
	const url = `${typeof window !== "undefined" ? window.location.origin : ""}/pay/${link.slug}`;
	const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: "max-w-md border-white/10 bg-card/90 backdrop-blur-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-5 w-5 text-primary" }), " Partager le lien"]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid place-items-center rounded-2xl border border-border/60 bg-background/60 p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: qr,
						alt: "QR",
						className: "h-48 w-48 rounded-lg"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/60 bg-background/60 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-semibold uppercase text-muted-foreground",
						children: "URL publique"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 break-all font-mono text-xs",
						children: url
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							navigator.clipboard.writeText(url);
							toast.success("Copié");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4 mr-1" }), " Copier"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: url,
							target: "_blank",
							rel: "noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4 mr-1" }), " Ouvrir"]
						})
					})]
				})
			]
		})]
	});
}
function ImageUploader({ value, onChange }) {
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const handleFile = async (file) => {
		if (!file.type.startsWith("image/")) {
			toast.error("Format d'image invalide");
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			toast.error("Max 2 Mo");
			return;
		}
		setUploading(true);
		try {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) throw new Error("Non connecté");
			const ext = file.name.split(".").pop() || "jpg";
			const path = `${u.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
			const { error } = await supabase.storage.from("payment-link-images").upload(path, file, {
				upsert: false,
				contentType: file.type
			});
			if (error) throw error;
			const { data: signed, error: sErr } = await supabase.storage.from("payment-link-images").createSignedUrl(path, 3600 * 24 * 365 * 10);
			if (sErr || !signed) throw sErr ?? /* @__PURE__ */ new Error("URL indisponible");
			onChange(signed.signedUrl);
			toast.success("Image téléversée");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Échec du téléversement");
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Image de couverture (max 2 Mo)" }), value ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mt-1 overflow-hidden rounded-xl border border-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: value,
			alt: "",
			className: "h-40 w-full object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			type: "button",
			size: "sm",
			variant: "secondary",
			className: "absolute right-2 top-2 h-7",
			onClick: () => onChange(""),
			children: "Retirer"
		})]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: cn("mt-1 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/70 bg-background/40 text-sm text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/5", uploading && "pointer-events-none opacity-60"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: uploading ? "Téléversement…" : "Cliquez pour importer une image" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/*",
				className: "hidden",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (f) handleFile(f);
					e.target.value = "";
				}
			})
		]
	})] });
}
//#endregion
export { PaymentLinksPage as component };
