import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { E as Send, K as Mail, Rt as CodeXml, St as Boxes, Tt as ArrowRight, U as Menu, X as Link$1, Z as Linkedin, b as Shield, h as Tag, j as Scale, n as X, ot as Github, st as FileText, t as Zap, u as Twitter, xt as Building2, y as ShoppingBag, yt as ChevronDown } from "../_libs/lucide-react.mjs";
import { t as dolapay_logo_png_asset_default } from "./dolapay-logo.png.asset--aVJCmSq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Footer-CskEc_yW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var menu = [
	{
		label: "Produits",
		items: [
			{
				label: "Encaissements (Pay-in)",
				to: "/company/pricing",
				hash: "payin",
				icon: Zap,
				desc: "Acceptez Mobile Money et cartes"
			},
			{
				label: "Décaissements (Pay-out)",
				to: "/company/pricing",
				hash: "payout",
				icon: Send,
				desc: "Envoyez des fonds partout en Afrique"
			},
			{
				label: "Liens de paiement",
				to: "/products/payment-links",
				icon: Link$1,
				desc: "Encaissez sans une ligne de code"
			},
			{
				label: "E-commerce",
				to: "/products/ecommerce",
				icon: ShoppingBag,
				desc: "Un checkout qui convertit"
			}
		]
	},
	{
		label: "Développeurs",
		items: [{
			label: "Documentation API",
			to: "/developers/api",
			icon: CodeXml,
			desc: "API REST simple et prévisible"
		}, {
			label: "SDKs",
			to: "/developers/sdks",
			icon: Boxes,
			desc: "Node, Python, PHP et plus"
		}]
	},
	{
		label: "Entreprise",
		items: [
			{
				label: "À propos",
				to: "/company/about",
				icon: Building2,
				desc: "Notre mission pour l'Afrique"
			},
			{
				label: "Contact",
				to: "/company/contact",
				icon: Mail,
				desc: "Parlez à notre équipe"
			},
			{
				label: "Tarifs",
				to: "/company/pricing",
				icon: Tag,
				desc: "Une grille simple et transparente"
			}
		]
	},
	{
		label: "Mentions légales",
		items: [
			{
				label: "Confidentialité",
				to: "/legal/privacy",
				icon: Shield,
				desc: "Comment nous protégeons vos données"
			},
			{
				label: "Conditions d'utilisation",
				to: "/legal/terms",
				icon: FileText,
				desc: "Règles d'utilisation"
			},
			{
				label: "Politique LCB-FT",
				to: "/legal/aml",
				icon: Scale,
				desc: "Lutte contre le blanchiment"
			}
		]
	}
];
function Navbar() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(null);
	const [mobile, setMobile] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const fn = () => setScrolled(window.scrollY > 8);
		fn();
		window.addEventListener("scroll", fn, { passive: true });
		return () => window.removeEventListener("scroll", fn);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: `fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ${scrolled ? "glass-light shadow-elegant" : "bg-transparent"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "flex items-center",
						"aria-label": "DolaPay",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: dolapay_logo_png_asset_default.url,
							alt: "DolaPay",
							className: "h-9 w-auto object-contain drop-shadow-[0_4px_12px_rgba(99,102,241,0.25)] sm:h-10"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden items-center gap-1 lg:flex",
						onMouseLeave: () => setOpen(null),
						children: menu.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							onMouseEnter: () => setOpen(g.label),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground",
								children: [g.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform ${open === g.label ? "rotate-180" : ""}` })]
							}), open === g.label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-1/2 top-full -translate-x-1/2 pt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-80 rounded-2xl border border-border bg-popover p-2 shadow-elegant",
									children: g.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: i.to,
										hash: i.hash,
										className: "flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(i.icon, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-semibold text-foreground",
												children: i.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: i.desc
											})]
										})]
									}, i.to + (i.hash ?? "")))
								})
							})]
						}, g.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-2 lg:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth/sign-in",
							className: "rounded-lg px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground",
							children: "Se connecter"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth/sign-up",
							className: "rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:bg-primary-glow",
							children: "Créer un compte"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "grid h-10 w-10 place-items-center rounded-xl border border-border bg-card/70 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent lg:hidden",
						onClick: () => setMobile(!mobile),
						"aria-label": "Menu",
						"aria-expanded": mobile,
						children: mobile ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `lg:hidden ${mobile ? "pointer-events-auto" : "pointer-events-none"}`,
				"aria-hidden": !mobile,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${mobile ? "opacity-100" : "opacity-0"}`,
					onClick: () => setMobile(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `fixed inset-x-3 top-[68px] z-50 max-h-[calc(100vh-84px)] overflow-y-auto rounded-2xl border border-border bg-card/95 p-4 shadow-elegant backdrop-blur-xl transition-all duration-300 ${mobile ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-col gap-1",
						children: menu.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setOpen(open === g.label ? null : g.label),
								className: "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-accent",
								"aria-expanded": open === g.label,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: g.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 text-muted-foreground transition-transform ${open === g.label ? "rotate-180" : ""}` })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid transition-all duration-300 ${open === g.label ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "ml-2 mt-1 flex flex-col gap-1 border-l border-border pl-2",
										children: g.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: i.to,
											hash: i.hash,
											onClick: () => {
												setMobile(false);
												setOpen(null);
											},
											className: "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(i.icon, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-sm font-semibold text-foreground",
													children: i.label
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block truncate text-xs text-muted-foreground",
													children: i.desc
												})]
											})]
										}, i.to + (i.hash ?? "")))
									})
								})
							})]
						}, g.label))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth/sign-in",
							onClick: () => setMobile(false),
							className: "rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold text-foreground transition-colors hover:bg-accent",
							children: "Se connecter"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth/sign-up",
							onClick: () => setMobile(false),
							className: "rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]",
							children: "Créer un compte"
						})]
					})]
				})]
			})]
		})
	});
}
var LEGAL_ENTITY = {
	name: "Dolapo ECOM LLC",
	brand: "DolaPay",
	address: {
		street: "1209 Mountain Road Pl NE",
		city: "Albuquerque",
		state: "New Mexico",
		country: "USA"
	}
};
var LEGAL_ENTITY_ADDRESS_LINE = `${LEGAL_ENTITY.address.street}, ${LEGAL_ENTITY.address.city}, ${LEGAL_ENTITY.address.state}, ${LEGAL_ENTITY.address.country}`;
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative mt-24 overflow-hidden bg-navy-deep text-navy-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-grid opacity-[0.06]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-32 left-1/2 h-64 w-[60%] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto max-w-7xl px-4 py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: dolapay_logo_png_asset_default.url,
								alt: "DolaPay — Solutions Fintech Premium",
								className: "h-20 w-auto object-contain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-xs text-sm text-navy-foreground/70",
								children: "L'infrastructure de paiement unifiée qui propulse la nouvelle génération d'entreprises digitales en Afrique."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 flex gap-3",
								children: [
									Twitter,
									Github,
									Linkedin
								].map((Icon, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									className: "grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 transition-colors hover:bg-white/10",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}, i))
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
							title: "Produits",
							links: [
								["Encaissements", "/products/pay-in"],
								["Décaissements", "/products/pay-out"],
								["Liens de paiement", "/products/payment-links"],
								["Tarifs", "/company/pricing"]
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
							title: "Support",
							links: [
								["Documentation API", "/developers/api"],
								["SDKs", "/developers/sdks"],
								["Contact", "/company/contact"],
								["À propos", "/company/about"]
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold",
								children: "Restez informé"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-navy-foreground/70",
								children: "Nos actualités produit et les tendances fintech africaines."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-4 flex items-center gap-2 rounded-xl glass p-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									placeholder: "vous@entreprise.com",
									className: "min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-navy-foreground placeholder:text-navy-foreground/40 focus:outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-2 text-xs font-semibold uppercase tracking-wider text-navy-foreground/50",
									children: "Mentions légales"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-x-4 gap-y-1 text-sm text-navy-foreground/70",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/legal/privacy",
											className: "hover:text-navy-foreground",
											children: "Confidentialité"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/legal/terms",
											className: "hover:text-navy-foreground",
											children: "Conditions"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/legal/aml",
											className: "hover:text-navy-foreground",
											children: "LCB-FT"
										})
									]
								})]
							})
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" ",
							LEGAL_ENTITY.name,
							" — ",
							LEGAL_ENTITY.brand,
							". Tous droits réservés."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"Siège : ",
							LEGAL_ENTITY_ADDRESS_LINE,
							"."
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Simplifiez votre finance, même la plus complexe." })]
				})]
			})
		]
	});
}
function FooterCol({ title, links }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm font-semibold",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 space-y-2.5 text-sm text-navy-foreground/70",
		children: links.map(([label, to]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to,
			className: "transition-colors hover:text-navy-foreground",
			children: label
		}) }, to))
	})] });
}
//#endregion
export { Navbar as i, LEGAL_ENTITY as n, LEGAL_ENTITY_ADDRESS_LINE as r, Footer as t };
