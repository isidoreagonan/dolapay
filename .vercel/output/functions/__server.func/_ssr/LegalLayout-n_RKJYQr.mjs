import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { b as Shield, j as Scale, st as FileText, xt as Building2 } from "../_libs/lucide-react.mjs";
import { i as Navbar, n as LEGAL_ENTITY, r as LEGAL_ENTITY_ADDRESS_LINE, t as Footer } from "./Footer-CskEc_yW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LegalLayout-n_RKJYQr.js
var import_jsx_runtime = require_jsx_runtime();
var DOCS = [
	{
		label: "Politique de confidentialité",
		to: "/legal/privacy",
		icon: Shield
	},
	{
		label: "Conditions d'utilisation",
		to: "/legal/terms",
		icon: FileText
	},
	{
		label: "Politique LCB-FT",
		to: "/legal/aml",
		icon: Scale
	}
];
function LegalLayout({ title, updated, children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-7xl px-4 pb-20 pt-36 sm:pt-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
						className: "lg:sticky lg:top-28 lg:self-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Mentions légales"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "mt-2 space-y-1",
								children: DOCS.map((d) => {
									const active = pathname === d.to;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: d.to,
										className: `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-primary text-primary-foreground shadow-glow" : "text-foreground/80 hover:bg-accent"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(d.icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: d.label
										})]
									}, d.to);
								})
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-border pb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs font-semibold uppercase tracking-[0.2em] text-primary",
										children: "Mentions légales DolaPay"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl",
										children: title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-sm text-muted-foreground",
										children: ["Dernière mise à jour : ", updated]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "prose prose-neutral mt-8 max-w-3xl text-[15px] leading-[1.75] text-foreground/85 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
								children
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
								className: "mt-12 rounded-2xl border border-border bg-card/60 p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" }), " Éditeur du site"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 space-y-1 text-sm text-foreground/85",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: LEGAL_ENTITY.name
										}),
										" — éditeur de la marque ",
										LEGAL_ENTITY.brand,
										"."
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground",
										children: [
											"Siège social : ",
											LEGAL_ENTITY_ADDRESS_LINE,
											"."
										]
									})]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { LegalLayout as t };
