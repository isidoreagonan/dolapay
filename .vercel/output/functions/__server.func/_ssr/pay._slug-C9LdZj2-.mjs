import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-nARMQEqv.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as notFound } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { Bt as CircleCheck, Ft as LoaderCircle, b as Shield, v as Smartphone, zt as CircleX } from "../_libs/lucide-react.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as dolapay_logo_png_asset_default } from "./dolapay-logo.png.asset--aVJCmSq.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as Route } from "./pay._slug-BSFSFH_d.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pay._slug-C9LdZj2-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PROVIDERS = [
	"MTN",
	"MOOV",
	"Orange",
	"Wave",
	"Airtel",
	"M-PESA"
];
function PayPage() {
	const { slug } = Route.useParams();
	const { data: link, isLoading, error } = useQuery({
		queryKey: ["public-link", slug],
		queryFn: async () => {
			const { data, error } = await supabase.from("payment_links").select("id,title,amount,currency,active,description,image_url,invoice_number,thank_you_message,fees_paid_by").eq("slug", slug).eq("active", true).maybeSingle();
			if (error) throw error;
			if (!data) throw notFound();
			return data;
		}
	});
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [provider, setProvider] = (0, import_react.useState)("MTN");
	const [txId, setTxId] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [idemKey] = (0, import_react.useState)(() => crypto.randomUUID());
	const [redirectUrls, setRedirectUrls] = (0, import_react.useState)({});
	const [redirectCountdown, setRedirectCountdown] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!txId) return;
		let cancelled = false;
		const poll = setInterval(async () => {
			if (cancelled) return;
			try {
				const res = await fetch(`/api/public/tx-status/${txId}`, { cache: "no-store" });
				if (!res.ok) return;
				const json = await res.json();
				if (json?.status) setStatus(json.status);
			} catch {}
		}, 2e3);
		return () => {
			cancelled = true;
			clearInterval(poll);
		};
	}, [txId]);
	(0, import_react.useEffect)(() => {
		if (status === "success" || status === "failed") setSubmitting(false);
	}, [status]);
	(0, import_react.useEffect)(() => {
		if (status !== "success" && status !== "failed") return;
		const url = status === "success" ? redirectUrls.success_url : redirectUrls.failure_url;
		if (!url) return;
		setRedirectCountdown(5);
		const t = setInterval(() => {
			setRedirectCountdown((c) => {
				if (c === null) return null;
				if (c <= 1) {
					clearInterval(t);
					window.location.href = url;
					return 0;
				}
				return c - 1;
			});
		}, 1e3);
		return () => clearInterval(t);
	}, [status, redirectUrls]);
	async function handleSubmit(e) {
		e.preventDefault();
		if (!name || !phone) {
			toast.error("Renseignez votre nom et téléphone");
			return;
		}
		setSubmitting(true);
		setStatus("pending");
		try {
			const res = await fetch(`/api/public/pay/${slug}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Idempotency-Key": idemKey
				},
				body: JSON.stringify({
					customer_name: name,
					customer_phone: phone,
					provider
				})
			});
			const body = await res.json();
			if (res.status === 429) {
				toast.error("Trop de tentatives. Patientez un instant.");
				setStatus(null);
				setSubmitting(false);
				return;
			}
			if (!res.ok || !body.transaction_id) {
				toast.error(body.error ?? "Échec");
				setStatus(null);
				setSubmitting(false);
				return;
			}
			setRedirectUrls({
				success_url: body.success_url,
				failure_url: body.failure_url
			});
			setTxId(body.transaction_id);
			if (body.status) setStatus(body.status);
		} catch {
			toast.error("Erreur réseau");
			setStatus(null);
			setSubmitting(false);
		}
	}
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) });
	if (error || !link) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CenteredCard, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-12 w-12 text-rose-500" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-4 text-xl font-bold",
			children: "Lien introuvable"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "Ce lien de paiement n'existe pas ou n'est plus actif."
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex items-center justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: dolapay_logo_png_asset_default.url,
					alt: "DolaPay",
					className: "h-8"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "overflow-hidden border-white/10 backdrop-blur-2xl",
				children: [
					link.image_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-40 w-full overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: link.image_url,
							alt: "",
							className: "h-full w-full object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-primary p-6 text-primary-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs uppercase tracking-wider opacity-80",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vous payez" }), link.invoice_number && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono",
									children: ["#", link.invoice_number]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-lg font-semibold",
								children: link.title
							}),
							link.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm opacity-80",
								children: link.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 text-4xl font-bold tracking-tight",
								children: [
									fmt(link.amount),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xl opacity-80",
										children: link.currency
									})
								]
							}),
							link.fees_paid_by === "customer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 inline-block rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold",
								children: "Frais de transaction inclus"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6",
						children: [!txId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleSubmit,
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "name",
									children: "Nom complet"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "name",
									value: name,
									onChange: (e) => setName(e.target.value),
									required: true,
									maxLength: 100
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "phone",
									children: "Numéro Mobile Money"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									required: true,
									maxLength: 20,
									placeholder: "+229 ..."
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Opérateur" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 grid grid-cols-3 gap-2",
									children: PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setProvider(p),
										className: cn("rounded-xl border px-3 py-2 text-xs font-semibold transition-colors", provider === p ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-accent"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "mx-auto mb-1 h-4 w-4" }), p]
									}, p))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									className: "w-full",
									size: "lg",
									disabled: submitting,
									children: [
										submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
										"Payer ",
										fmt(link.amount),
										" ",
										link.currency
									]
								})
							]
						}), txId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusView, {
							status: status ?? "pending",
							amount: link.amount,
							currency: link.currency,
							countdown: redirectCountdown,
							thankYou: link.thank_you_message
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-center gap-2 border-t border-border bg-muted/30 px-6 py-3 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }), " Paiement sécurisé par DolaPay"]
					})
				]
			})]
		})
	});
}
function StatusView({ status, amount, currency, countdown, thankYou }) {
	if (status === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto h-12 w-12 animate-spin text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-lg font-bold",
				children: "Paiement en cours…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Confirmez la demande sur votre téléphone pour finaliser le paiement."
			})
		]
	});
	if (status === "success") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto h-14 w-14 text-emerald-500" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-lg font-bold",
				children: "Paiement réussi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Votre paiement de ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold",
						children: [
							fmt(amount),
							" ",
							currency
						]
					}),
					" a été reçu."
				]
			}),
			thankYou && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-4 max-w-xs rounded-2xl border border-emerald-200/40 bg-emerald-50/60 p-3 text-sm text-emerald-900 dark:bg-emerald-500/5 dark:text-emerald-200",
				children: thankYou
			}),
			countdown !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [
					"Redirection dans ",
					countdown,
					"s…"
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mx-auto h-14 w-14 text-rose-500" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 text-lg font-bold",
				children: "Paiement échoué"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Réessayez ou contactez le commerçant."
			}),
			countdown !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [
					"Redirection dans ",
					countdown,
					"s…"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				variant: "outline",
				onClick: () => window.location.reload(),
				children: "Réessayer"
			})
		]
	});
}
function CenteredCard({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen grid place-items-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "flex w-full max-w-md flex-col items-center p-10 text-center",
			children
		})
	});
}
function fmt(n) {
	return new Intl.NumberFormat("fr-FR").format(Math.round(n));
}
//#endregion
export { PayPage as component };
