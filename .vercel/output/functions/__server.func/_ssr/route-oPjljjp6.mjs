import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DWb0N0jk.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as Search, Et as ArrowLeft, O as ScrollText, P as Radio, Q as LayoutDashboard, S as ShieldCheck, U as Menu, a as Users, dt as DollarSign, g as Sun, ht as Command, jt as TriangleAlert, q as LogOut, xt as Building2, z as Moon } from "../_libs/lucide-react.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-DGl8EHd4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as dolapay_logo_png_asset_default } from "./dolapay-logo.png.asset--aVJCmSq.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-oPjljjp6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Command$2 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$2.displayName = _e.displayName;
var CommandDialog = ({ children, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command$2, {
				className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
				children
			})
		})
	});
};
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
function AdminCommandPalette({ open, onOpenChange, onMerchantView }) {
	const navigate = useNavigate();
	const [search, setSearch] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) setSearch("");
	}, [open]);
	const { data: merchants = [] } = useQuery({
		queryKey: ["palette-merchants", search],
		enabled: open,
		queryFn: async () => {
			let q = supabase.from("profiles").select("id,email,full_name").limit(8);
			if (search.trim().length >= 2) {
				const s = `%${search.trim()}%`;
				q = q.or(`email.ilike.${s},full_name.ilike.${s}`);
			} else q = q.order("created_at", { ascending: false });
			const { data } = await q;
			return data ?? [];
		}
	});
	const go = (path) => {
		onOpenChange(false);
		navigate({ to: path });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandDialog, {
		open,
		onOpenChange,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, {
			placeholder: "Rechercher un marchand, naviguer, exécuter une action…",
			value: search,
			onValueChange: setSearch
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "Aucun résultat." }),
			merchants.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
				heading: "Marchands",
				children: merchants.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
					value: `${m.email} ${m.full_name ?? ""}`,
					onSelect: () => go(`/admin/merchants/${m.id}`),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm",
							children: m.full_name || m.email
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: m.email
						})]
					})]
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandGroup, {
				heading: "Navigation",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => go("/admin"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "mr-2 h-4 w-4" }), " Vue d'ensemble"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => go("/admin/live"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "mr-2 h-4 w-4" }), " Flux temps réel"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => go("/admin/merchants"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-2 h-4 w-4" }), " Marchands"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => go("/admin/compliance"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-2 h-4 w-4" }), " Conformité KYC"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => go("/admin/finance"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "mr-2 h-4 w-4" }), " Finance"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => go("/admin/risk"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mr-2 h-4 w-4" }), " Risques & alertes"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
						onSelect: () => go("/admin/audit"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "mr-2 h-4 w-4" }), " Journal d'audit"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandGroup, {
				heading: "Actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
					onSelect: () => {
						onOpenChange(false);
						onMerchantView();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Basculer en vue marchand"]
				})
			})
		] })]
	});
}
var KEY = "admin-theme";
function useAdminTheme() {
	const [theme, setTheme] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return "dark";
		return localStorage.getItem(KEY) || "dark";
	});
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") localStorage.setItem(KEY, theme);
	}, [theme]);
	return {
		theme,
		toggle: (0, import_react.useCallback)(() => setTheme((t) => t === "dark" ? "light" : "dark"), []),
		isDark: theme === "dark"
	};
}
function useAdminEmail() {
	return useQuery({
		queryKey: ["admin-email"],
		queryFn: async () => {
			const { data } = await supabase.auth.getUser();
			return data.user?.email ?? "";
		}
	});
}
function AdminLayout() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [paletteOpen, setPaletteOpen] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const { data: email } = useAdminEmail();
	const { theme, toggle, isDark } = useAdminTheme();
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") sessionStorage.removeItem("merchant_view");
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setPaletteOpen((v) => !v);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	async function handleSignOut() {
		await supabase.auth.signOut();
		toast.success("Déconnecté");
		navigate({
			to: "/auth/sign-in",
			replace: true
		});
	}
	function openMerchantView() {
		if (typeof window !== "undefined") sessionStorage.setItem("merchant_view", "1");
		navigate({ to: "/dashboard" });
	}
	const nav = [
		{
			to: "/admin",
			icon: LayoutDashboard,
			label: "Vue d'ensemble",
			exact: true
		},
		{
			to: "/admin/live",
			icon: Radio,
			label: "Flux temps réel"
		},
		{
			to: "/admin/merchants",
			icon: Users,
			label: "Marchands"
		},
		{
			to: "/admin/compliance",
			icon: ShieldCheck,
			label: "Conformité KYC"
		},
		{
			to: "/admin/finance",
			icon: DollarSign,
			label: "Finance"
		},
		{
			to: "/admin/risk",
			icon: TriangleAlert,
			label: "Risques & alertes"
		},
		{
			to: "/admin/audit",
			icon: ScrollText,
			label: "Journal d'audit"
		}
	];
	const shell = isDark ? "bg-[#0a0a0f] text-slate-100" : "bg-slate-50 text-slate-950";
	const topBar = isDark ? "border-white/10 bg-[#0a0a0f]/90" : "border-slate-200 bg-white/95 shadow-sm";
	const sidebar = isDark ? "border-white/10 bg-[#0d0d14]" : "border-slate-200 bg-white shadow-[12px_0_40px_-32px_rgba(15,23,42,0.45)]";
	const sideMutedCard = isDark ? "border-white/10 bg-white/[0.03] text-slate-200" : "border-slate-200 bg-slate-50 text-slate-700";
	const muted = isDark ? "text-slate-500" : "text-slate-500";
	const navIdle = isDark ? "text-slate-400 hover:bg-white/5 hover:text-slate-100" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";
	const navActive = isDark ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-100";
	const divider = isDark ? "border-white/10" : "border-slate-200";
	const ghost = isDark ? "border-white/15 text-slate-200 hover:bg-white/5" : "border-slate-200 text-slate-700 hover:bg-slate-100";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("admin-shell min-h-screen", shell),
		"data-theme": theme,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cn("lg:hidden sticky top-0 z-40 flex items-center justify-between border-b px-4 py-3 backdrop-blur", topBar),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: dolapay_logo_png_asset_default.url,
						alt: "DolaPay",
						className: cn("h-7", isDark && "invert")
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setPaletteOpen(true),
							className: cn("rounded-lg border p-2", ghost),
							"aria-label": "Recherche",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: toggle,
							className: cn("rounded-lg border p-2", ghost),
							"aria-label": "Thème",
							children: isDark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setOpen(!open),
							className: cn("rounded-lg border p-2", ghost),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: cn("fixed inset-y-0 left-0 z-50 flex h-screen w-64 transform flex-col border-r px-3 py-5 transition-transform lg:translate-x-0", sidebar, open ? "translate-x-0" : "-translate-x-full"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin",
								className: "mb-4 flex shrink-0 items-center gap-2 px-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: dolapay_logo_png_asset_default.url,
									alt: "DolaPay",
									className: cn("h-7", isDark && "invert")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md border border-amber-400/40 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300",
									children: "Admin"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("mb-3 shrink-0 rounded-lg border px-3 py-2", sideMutedCard),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: cn("text-[10px] uppercase tracking-wider", muted),
										children: "Opérateur"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-mono text-xs",
										children: email
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex items-center gap-1.5 text-[10px] text-emerald-500 dark:text-emerald-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "relative flex h-1.5 w-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" })]
										}), "session active · production"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setPaletteOpen(true),
								className: cn("mb-3 flex shrink-0 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs", ghost),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "h-3.5 w-3.5" }), " Rechercher"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
									className: cn("rounded border px-1.5 py-0.5 font-mono text-[10px]", isDark ? "border-white/15 bg-white/5" : "border-slate-200 bg-slate-50"),
									children: "⌘K"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "flex-1 space-y-0.5 overflow-y-auto",
								children: nav.map((it) => {
									const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: it.to,
										onClick: () => setOpen(false),
										className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? navActive : navIdle),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: "h-4 w-4" }),
											" ",
											it.label
										]
									}, it.to);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: cn("space-y-1 border-t pt-3", divider),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: toggle,
										className: cn("flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs", navIdle),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-3",
											children: [isDark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3.5 w-3.5" }), isDark ? "Thème clair" : "Thème sombre"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: openMerchantView,
										className: cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs", navIdle),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), " Vue marchand"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleSignOut,
										className: cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs", navIdle),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Déconnexion"]
									})
								]
							})
						]
					}),
					open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setOpen(false),
						className: "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:ml-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminCommandPalette, {
				open: paletteOpen,
				onOpenChange: setPaletteOpen,
				onMerchantView: openMerchantView
			})
		]
	});
}
//#endregion
export { AdminLayout as component, useAdminEmail };
