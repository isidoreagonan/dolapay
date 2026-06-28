import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { bt as Check, yt as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as findCountryByCode, t as SUPPORTED_COUNTRIES } from "./supported-countries-CoIgmV1m.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CountryPhone-CDvOBL3r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
function CountrySelect({ value, onChange, label = "Pays", disabled }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const selected = (0, import_react.useMemo)(() => findCountryByCode(value), [value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1.5 block text-xs font-semibold text-foreground/80",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled,
						className: "flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors hover:border-primary/60 disabled:opacity-60",
						children: [selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg leading-none",
									children: selected.flag
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: selected.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: selected.dialCode
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Sélectionnez un pays…"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
					align: "start",
					className: "w-(--radix-popover-trigger-width) max-h-72 overflow-y-auto p-1",
					children: SUPPORTED_COUNTRIES.map((c) => {
						const active = c.code === value;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								onChange(c.code);
								setOpen(false);
							},
							className: cn("flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent", active && "bg-accent"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl leading-none",
									children: c.flag
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex-1 font-medium text-foreground",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: c.dialCode
								}),
								active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary" })
							]
						}, c.code);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-[11px] text-muted-foreground",
				children: "DolaPay couvre 12 marchés africains. Les autres pays seront ajoutés prochainement."
			})
		]
	});
}
function PhoneField({ countryCode, value, onChange, label = "Numéro de téléphone" }) {
	const country = (0, import_react.useMemo)(() => findCountryByCode(countryCode), [countryCode]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-xs font-semibold text-foreground/80",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-stretch gap-2 rounded-xl border border-border bg-background px-3 py-2.5 focus-within:border-primary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-1.5 border-r border-border pr-3 text-sm font-semibold text-foreground/80",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-base",
					children: country?.flag ?? "🌍"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: country?.dialCode ?? "+ —" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "tel",
				inputMode: "numeric",
				placeholder: country ? `${country.phoneLengths[0]} chiffres` : "Sélectionnez d'abord un pays",
				value,
				disabled: !country,
				onChange: (e) => onChange(e.target.value.replace(/\D/g, "")),
				required: true,
				className: "min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-60"
			})]
		})]
	});
}
//#endregion
export { PhoneField as n, CountrySelect as t };
