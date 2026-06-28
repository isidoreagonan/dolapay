import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-nARMQEqv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { Ft as LoaderCircle, S as ShieldCheck, Tt as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as dolapay_logo_png_asset_default } from "./dolapay-logo.png.asset--aVJCmSq.mjs";
import { i as isValidLocalPhone, n as findCountryByCode, r as findCountryByName } from "./supported-countries-CoIgmV1m.mjs";
import { n as PhoneField, t as CountrySelect } from "./CountryPhone-CDvOBL3r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complete-profile-C7rjFvU1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompleteProfilePage() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [countryCode, setCountryCode] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return;
			const { data: p } = await supabase.from("profiles").select("first_name,last_name,full_name,country,phone").eq("id", u.user.id).maybeSingle();
			if (p?.country && p?.phone) {
				navigate({
					to: "/onboarding",
					replace: true
				});
				return;
			}
			const meta = u.user.user_metadata ?? {};
			setFirstName(p?.first_name ?? meta.given_name ?? p?.full_name?.split(" ")[0] ?? "");
			setLastName(p?.last_name ?? meta.family_name ?? p?.full_name?.split(" ").slice(1).join(" ") ?? "");
			if (p?.country) {
				const c = findCountryByName(p.country);
				if (c) setCountryCode(c.code);
			}
			setChecking(false);
		})();
	}, [navigate]);
	async function handleSubmit(e) {
		e.preventDefault();
		const country = findCountryByCode(countryCode);
		if (!country) return toast.error("Sélectionnez votre pays.");
		if (!isValidLocalPhone(country, phone)) return toast.error(`Numéro ${country.name} invalide. Attendu : ${country.phoneLengths.join(" ou ")} chiffres.`);
		setLoading(true);
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) {
			setLoading(false);
			return;
		}
		const fullName = `${firstName} ${lastName}`.trim();
		const { error } = await supabase.from("profiles").update({
			first_name: firstName,
			last_name: lastName,
			full_name: fullName,
			country: country.name,
			phone: `${country.dialCode}${phone}`
		}).eq("id", u.user.id);
		setLoading(false);
		if (error) return toast.error(error.message);
		toast.success("Profil complété ✓");
		navigate({ to: "/onboarding" });
	}
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen overflow-hidden bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-grid opacity-60" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -top-32 right-[-10%] h-[480px] w-[480px] rounded-full bg-primary/20 blur-3xl animate-float" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative mx-auto grid min-h-screen max-w-md place-items-center px-4 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-8 grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: dolapay_logo_png_asset_default.url,
							alt: "DolaPay",
							className: "h-14 w-auto object-contain"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card/80 p-8 shadow-elegant backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Étape obligatoire — Conformité"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold text-foreground",
								children: "Complétez votre profil"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "Pour ouvrir un compte DolaPay, nous devons connaître votre pays d'opération et un numéro joignable."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleSubmit,
								className: "mt-6 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleField, {
											label: "Prénom",
											value: firstName,
											onChange: setFirstName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleField, {
											label: "Nom",
											value: lastName,
											onChange: setLastName
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountrySelect, {
										value: countryCode,
										onChange: (c) => {
											setCountryCode(c);
											setPhone("");
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneField, {
										countryCode,
										value: phone,
										onChange: setPhone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: loading,
										className: "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.01] hover:bg-primary-glow disabled:opacity-60",
										children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Continuer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })] })
									})
								]
							})
						]
					})]
				})
			})
		]
	});
}
function SimpleField({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-xs font-semibold text-foreground/80",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 focus-within:border-primary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value,
				onChange: (e) => onChange(e.target.value),
				required: true,
				className: "min-w-0 flex-1 bg-transparent text-sm text-foreground focus:outline-none"
			})
		})]
	});
}
//#endregion
export { CompleteProfilePage as component };
