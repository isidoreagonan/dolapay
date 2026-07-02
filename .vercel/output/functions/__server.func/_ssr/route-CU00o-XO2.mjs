import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-SdCiCddD.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { E as Send, J as Lock, Q as LayoutDashboard, S as ShieldCheck, U as Menu, X as Link$1, Y as ListOrdered, a as Users, et as KeyRound, ft as Crown, q as LogOut, w as Settings } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-DGl8EHd4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as dolapay_logo_png_asset_default } from "./dolapay-logo.png.asset--aVJCmSq.mjs";
import { n as getTier } from "./tier-NT1-wYki.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-CU00o-XO2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
function useProfile() {
	return useQuery({
		queryKey: ["my-profile"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return null;
			const { data, error } = await supabase.from("profiles").select("id,email,full_name,account_type,kyc_status,kyc_rejection_reason,volume_limit_xof,onboarding_completed").eq("id", u.user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
}
function useIsAdmin() {
	return useQuery({
		queryKey: ["is-admin"],
		queryFn: async () => {
			const { data: sessionData } = await supabase.auth.getSession();
			const user = sessionData?.session?.user;
			if (!user) return false;
			const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
			if (error) return false;
			return !!data;
		}
	});
}
function DashboardLayout() {
	const { data: profile } = useProfile();
	const { data: isAdmin } = useIsAdmin();
	const [open, setOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		if (profile && !profile.onboarding_completed) {
			navigate({
				to: "/onboarding",
				replace: true
			});
			return;
		}
		if (isAdmin && typeof window !== "undefined" && sessionStorage.getItem("merchant_view") !== "1") navigate({
			to: "/admin",
			replace: true
		});
	}, [
		profile,
		isAdmin,
		navigate
	]);
	async function handleSignOut() {
		await supabase.auth.signOut();
		toast.success("Déconnecté");
		navigate({
			to: "/auth/sign-in",
			replace: true
		});
	}
	const tier = getTier(profile?.account_type);
	const payoutsLocked = !tier.capabilities.payouts;
	const [showPayoutsModal, setShowPayoutsModal] = (0, import_react.useState)(false);
	const navItems = [
		{
			to: "/dashboard",
			icon: LayoutDashboard,
			label: "Vue d'ensemble",
			exact: true
		},
		{
			to: "/dashboard/transactions",
			icon: ListOrdered,
			label: "Transactions"
		},
		{
			to: "/dashboard/payment-links",
			icon: Link$1,
			label: "Liens de paiement"
		},
		{
			to: "/dashboard/payouts",
			icon: Send,
			label: "Décaissements en masse",
			locked: payoutsLocked,
			lockedTip: "Passez à l'Enterprise Tier pour débloquer les décaissements automatisés vers des tiers."
		},
		{
			to: "/dashboard/team",
			icon: Users,
			label: "Équipe"
		},
		...profile?.account_type === "enterprise" ? [{
			to: "/dashboard/api-keys",
			icon: KeyRound,
			label: "Clés API"
		}] : [],
		{
			to: "/dashboard/verify",
			icon: ShieldCheck,
			label: profile?.kyc_status === "approved" ? "Vérifié" : "Vérification"
		},
		{
			to: "/dashboard/settings",
			icon: Settings,
			label: "Compte & KYC"
		},
		...isAdmin ? [{
			to: "/dashboard/admin",
			icon: ShieldCheck,
			label: "Admin"
		}] : []
	];
	const locked = profile && profile.kyc_status !== "approved";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 150,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: dolapay_logo_png_asset_default.url,
							alt: "DolaPay",
							className: "h-7"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(!open),
						className: "rounded-lg border border-border p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: cn("fixed inset-y-0 left-0 z-50 flex h-screen w-72 transform flex-col border-r border-border bg-card/95 px-4 py-6 backdrop-blur-xl transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard",
									className: "mb-6 flex shrink-0 items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: dolapay_logo_png_asset_default.url,
										alt: "DolaPay",
										className: "h-8"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-6 shrink-0 rounded-xl border border-border bg-background/50 p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: "Connecté en tant que"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate text-sm font-semibold",
											children: profile?.full_name || profile?.email
										}),
										profile?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												const accId = `acc_${profile.id.replace(/-/g, "").slice(0, 16)}`;
												navigator.clipboard?.writeText(accId);
												toast.success("Identifiant copié");
											},
											className: "mt-1 block truncate font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground",
											title: "Cliquer pour copier",
											children: ["acc_", profile.id.replace(/-/g, "").slice(0, 16)]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-wrap items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold", tier.badgeClass),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tier.icon }),
													" ",
													tier.short,
													" Tier"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KycBadge, { status: profile?.kyc_status ?? "pending" })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
									className: "flex-1 space-y-1 overflow-y-auto",
									children: navItems.map((it) => {
										const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
										const linkClass = cn("flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-primary text-primary-foreground shadow" : "text-foreground/80 hover:bg-accent", it.locked && !active && "opacity-70");
										const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: "h-4 w-4" }),
												" ",
												it.label
											]
										}), it.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5 opacity-80" })] });
										if (it.locked) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setOpen(false);
													setShowPayoutsModal(true);
												},
												className: cn(linkClass, "w-full text-left"),
												children: inner
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
											side: "right",
											children: it.lockedTip
										})] }, it.to);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: it.to,
											onClick: () => setOpen(false),
											className: linkClass,
											children: inner
										}, it.to);
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: handleSignOut,
									className: "mt-4 flex shrink-0 items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Déconnexion"]
								})
							]
						}),
						open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpen(false),
							className: "fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
							className: "min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10 lg:ml-72",
							children: [locked && profile?.kyc_status === "pending" && pathname !== "/dashboard/settings" && pathname !== "/dashboard/admin" && pathname !== "/dashboard/verify" && pathname !== "/dashboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Vérification en cours." }),
									" Complétez votre dossier KYC dans",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/dashboard/settings",
										className: "underline",
										children: "Compte & KYC"
									}),
									". Certaines fonctionnalités sont verrouillées tant que votre compte n'est pas approuvé."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
					open: showPayoutsModal,
					onOpenChange: setShowPayoutsModal,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-5 w-5 text-amber-500" }), " Fonctionnalité Enterprise"]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Passez à l'",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Enterprise Tier" }),
									" pour débloquer les décaissements automatisés vers des tiers, les virements en masse et les webhooks signés."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => setShowPayoutsModal(false),
									children: "Plus tard"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/dashboard/settings",
										children: "Demander la mise à niveau"
									})
								})]
							})
						]
					})
				})
			]
		})
	});
}
function KycBadge({ status }) {
	const m = {
		pending: {
			label: "En attente",
			cls: "bg-amber-500/15 text-amber-600 dark:text-amber-300"
		},
		in_compliance_review: {
			label: "En examen",
			cls: "bg-primary/15 text-primary"
		},
		approved: {
			label: "Approuvé",
			cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
		},
		rejected: {
			label: "Rejeté",
			cls: "bg-rose-500/15 text-rose-600 dark:text-rose-300"
		},
		frozen: {
			label: "Gelé",
			cls: "bg-slate-500/15 text-slate-500"
		}
	}[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", m.cls),
		children: m.label
	});
}
//#endregion
export { DashboardLayout as component, useIsAdmin, useProfile };
