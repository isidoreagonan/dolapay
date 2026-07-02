import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { B as MessageSquare, Bt as CircleCheck, E as Send, Ft as LoaderCircle, G as MapPin, K as Mail, b as Shield, xt as Building2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Navbar, n as LEGAL_ENTITY, r as LEGAL_ENTITY_ADDRESS_LINE, t as Footer } from "./Footer-CskEc_yW.mjs";
import { t as Reveal } from "./Reveal-BBiBtf47.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/company.contact-EPh9_LTL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CHANNELS = [
	{
		icon: MessageSquare,
		label: "Ventes & Démos",
		desc: "Discutez avec un expert paiements pour estimer vos volumes et choisir vos canaux.",
		email: "sales@dola-pay.com"
	},
	{
		icon: Building2,
		label: "Support Marchand",
		desc: "Une question sur votre intégration, vos décaissements ou vos transactions.",
		email: "support@dola-pay.com"
	},
	{
		icon: Shield,
		label: "Conformité & KYC",
		desc: "Documents, vérification d'identité, AML/CFT et réclamations réglementaires.",
		email: "compliance@dola-pay.com"
	}
];
function ContactPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [sent, setSent] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		company: "",
		topic: "Ventes",
		message: ""
	});
	function update(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	async function onSubmit(e) {
		e.preventDefault();
		setLoading(true);
		const subject = encodeURIComponent(`[${form.topic}] ${form.name} — ${form.company || "DolaPay"}`);
		const body = encodeURIComponent(`Nom: ${form.name}\nEmail: ${form.email}\nEntreprise: ${form.company}\nSujet: ${form.topic}\n\n${form.message}`);
		window.location.href = `mailto:hello@dola-pay.com?subject=${subject}&body=${body}`;
		setTimeout(() => {
			setLoading(false);
			setSent(true);
			toast.success("Votre client mail s'ouvre — finalisez l'envoi à hello@dola-pay.com");
		}, 400);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pb-24 pt-32 sm:pt-40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-2xl text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), " Contact"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl",
								children: "Parlons de votre projet de paiement"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-lg text-muted-foreground",
								children: "Une équipe basée entre l'Afrique de l'Ouest et les États-Unis, qui répond sous 24h ouvrées."
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-6 lg:grid-cols-3",
						children: CHANNELS.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: i * 80,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `mailto:${c.email}`,
								className: "group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-elegant transition-all hover:-translate-y-0.5 hover:border-primary/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: "h-5 w-5" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 text-base font-semibold text-foreground",
										children: c.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1.5 flex-1 text-sm text-muted-foreground",
										children: c.desc
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:underline",
										children: c.email
									})
								]
							})
						}, c.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 grid gap-6 lg:grid-cols-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							className: "lg:col-span-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit,
								className: "rounded-3xl border border-border bg-card p-6 shadow-elegant sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-xl font-semibold text-foreground",
										children: "Écrivez-nous"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted-foreground",
										children: "Tous les champs sont requis. Nous reviendrons vers vous très vite."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 grid gap-4 sm:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Nom complet",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													required: true,
													value: form.name,
													onChange: (e) => update("name", e.target.value),
													className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none",
													placeholder: "Awa Diallo"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Email professionnel",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													required: true,
													type: "email",
													value: form.email,
													onChange: (e) => update("email", e.target.value),
													className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none",
													placeholder: "awa@entreprise.com"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Entreprise",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													required: true,
													value: form.company,
													onChange: (e) => update("company", e.target.value),
													className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none",
													placeholder: "Votre société"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: "Sujet",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: form.topic,
													onChange: (e) => update("topic", e.target.value),
													className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Ventes" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Support technique" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Conformité / KYC" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Partenariat" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Presse" })
													]
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Message",
										className: "mt-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											required: true,
											rows: 5,
											value: form.message,
											onChange: (e) => update("message", e.target.value),
											className: "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none resize-none",
											placeholder: "Volumes prévus, pays cibles, calendrier… plus c'est précis, mieux on répond."
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: loading || sent,
										className: "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.01] hover:bg-primary-glow disabled:opacity-70 sm:w-auto",
										children: sent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), " Message prêt à envoyer"] }) : loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Préparation…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Envoyer le message"] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs text-muted-foreground",
										children: "En soumettant ce formulaire, vous acceptez notre politique de confidentialité."
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							delay: 120,
							className: "lg:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-full flex-col gap-4 rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-card p-6 shadow-elegant sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-semibold text-foreground",
										children: "Siège social"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3 rounded-2xl border border-border bg-background/60 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-foreground",
												children: LEGAL_ENTITY.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-muted-foreground",
												children: LEGAL_ENTITY_ADDRESS_LINE
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-background/60 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: "Horaires support"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
											className: "mt-2 space-y-1.5 text-sm text-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Lundi — Vendredi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "08:00 — 20:00 GMT"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Samedi" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "09:00 — 14:00 GMT"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dimanche" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Sur incident"
													})]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-auto rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold",
											children: "Urgence opérationnelle ?"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-muted-foreground",
											children: [
												"Marchands actifs : écrivez à",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: "mailto:oncall@dola-pay.com",
													className: "font-semibold text-primary hover:underline",
													children: "oncall@dola-pay.com"
												}),
												" ",
												"avec votre identifiant ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
													className: "rounded bg-card px-1 py-0.5 text-xs",
													children: "acc_…"
												}),
												"."
											]
										})]
									})
								]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Field({ label, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `block ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1.5 block text-xs font-semibold text-foreground/80",
			children: label
		}), children]
	});
}
//#endregion
export { ContactPage as component };
