import { o as __toESM } from "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { n as supabase } from "./client-nARMQEqv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { R as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$44 } from "./route-CG8Dj4kH.mjs";
import { Ft as LoaderCircle, bt as Check, jt as TriangleAlert, n as X, tt as Info } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as dolapay_logo_png_asset_default } from "./dolapay-logo.png.asset--aVJCmSq.mjs";
import "./supported-countries-CoIgmV1m.mjs";
import { t as Route$45 } from "./pay._slug-BSFSFH_d.mjs";
import { t as Route$46 } from "./admin-iGc9D9MG.mjs";
import { a as unknownType, i as stringType, n as objectType, r as recordType, t as numberType } from "../_libs/zod.mjs";
import { createHmac, timingSafeEqual } from "crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BW5CyIXp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createSupabaseAdminClient() {
	const SUPABASE_URL = process.env.SUPABASE_URL;
	const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
	if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []].join(", ")}. Vérifiez vos variables dans Vercel (.env).`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY) },
		auth: {
			storage: void 0,
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
var _supabaseAdmin;
var supabaseAdmin = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
	return Reflect.get(_supabaseAdmin, prop, receiver);
} });
/**
* Clean phone number to E.164 digits without '+' sign (e.g. "22670123456")
*/
function cleanPhoneNumber(phone, defaultCountryPrefix = "226") {
	const digits = phone.replace(/\D/g, "");
	if (digits.startsWith("00")) return digits.slice(2);
	if (digits.length === 8 && defaultCountryPrefix === "226") return `226${digits}`;
	return digits;
}
/**
* Map generic provider name (MTN, Orange, Moov, Wave, etc.) to PawaPay Correspondent Code
*/
function getCorrespondentCode(providerName, country = "BFA") {
	const normalized = providerName.trim().toUpperCase();
	if (normalized.includes("ORANGE")) {
		if (country === "SEN") return "ORANGE_SEN";
		if (country === "CIV") return "ORANGE_CIV";
		return "ORANGE_BFA";
	}
	if (normalized.includes("MOOV")) {
		if (country === "BEN") return "MOOV_BEN";
		if (country === "CIV") return "MOOV_CIV";
		return "MOOV_BFA";
	}
	if (normalized.includes("MTN")) {
		if (country === "CIV") return "MTN_MOMO_CIV";
		if (country === "GHA") return "MTN_MOMO_GHA";
		return "MTN_MOMO_BEN";
	}
	if (normalized.includes("WAVE")) {
		if (country === "SEN") return "WAVE_SEN";
		return "WAVE_CIV";
	}
	if (normalized.includes("AIRTEL")) return "AIRTEL_O_COD";
	if (normalized.includes("MPESA") || normalized.includes("M-PESA")) return "VODACOM_MPESA_TZA";
	if (normalized.includes("TELECEL")) return "TELECEL_BFA";
	return "ORANGE_BFA";
}
var PawaPayClient = class {
	apiToken;
	baseUrl;
	constructor() {
		this.apiToken = process.env.PAWAPAY_API_TOKEN;
		const isLive = process.env.PAWAPAY_ENVIRONMENT === "production" || process.env.PAWAPAY_ENV === "live";
		this.baseUrl = isLive ? "https://api.pawapay.cloud" : "https://api.sandbox.pawapay.cloud";
	}
	async request(endpoint, method, body) {
		if (!this.apiToken) {
			console.warn(`[PawaPay] PAWAPAY_API_TOKEN non défini. Simulation en mode Sandbox pour ${endpoint}`);
			if (endpoint.includes("/deposits")) return {
				depositId: body?.depositId || "simulated_dep",
				status: "ACCEPTED"
			};
			if (endpoint.includes("/payouts")) return {
				payoutId: body?.payoutId || "simulated_payout",
				status: "ACCEPTED"
			};
			return {};
		}
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method,
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${this.apiToken}`
			},
			body: body ? JSON.stringify(body) : void 0
		});
		if (!response.ok) {
			const errText = await response.text();
			console.error(`[PawaPay API Error] ${method} ${endpoint} - Status ${response.status}: ${errText}`);
			throw new Error(`PawaPay API Error (${response.status}): ${errText}`);
		}
		return response.json();
	}
	async initiateDeposit(params) {
		const cleanPhone = cleanPhoneNumber(params.phone);
		const correspondent = getCorrespondentCode(params.provider);
		const payload = {
			depositId: params.depositId,
			amount: Math.round(params.amount).toString(),
			currency: params.currency || "XOF",
			correspondent,
			payer: {
				type: "MSISDN",
				address: cleanPhone
			},
			statementDescription: (params.description || "DolaPay Charge").slice(0, 22)
		};
		return this.request("/deposits", "POST", payload);
	}
	async initiatePayout(params) {
		const cleanPhone = cleanPhoneNumber(params.phone);
		const correspondent = getCorrespondentCode(params.provider);
		const payload = {
			payoutId: params.payoutId,
			amount: Math.round(params.amount).toString(),
			currency: params.currency || "XOF",
			correspondent,
			recipient: {
				type: "MSISDN",
				address: cleanPhone
			},
			statementDescription: (params.description || "DolaPay Payout").slice(0, 22)
		};
		return this.request("/payouts", "POST", payload);
	}
};
var pawapay = new PawaPayClient();
var Toaster$1 = (props) => {
	const [isMobile, setIsMobile] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(max-width: 640px)");
		const update = () => setIsMobile(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		theme: "dark",
		position: isMobile ? "top-center" : "top-right",
		offset: isMobile ? 12 : 24,
		gap: 10,
		visibleToasts: 4,
		icons: {
			success: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-7 w-7 place-items-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "h-3.5 w-3.5 text-emerald-300",
					strokeWidth: 3
				})
			}),
			error: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-7 w-7 place-items-center rounded-full bg-rose-400/15 ring-1 ring-rose-300/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					className: "h-3.5 w-3.5 text-rose-300",
					strokeWidth: 3
				})
			}),
			warning: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-7 w-7 place-items-center rounded-full bg-amber-400/15 ring-1 ring-amber-300/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "h-3.5 w-3.5 text-amber-300",
					strokeWidth: 2.5
				})
			}),
			info: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-7 w-7 place-items-center rounded-full bg-sky-400/15 ring-1 ring-sky-300/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
					className: "h-3.5 w-3.5 text-sky-300",
					strokeWidth: 2.5
				})
			}),
			loading: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-7 w-7 place-items-center rounded-full bg-white/10 ring-1 ring-white/20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					className: "h-3.5 w-3.5 animate-spin text-white",
					strokeWidth: 2.5
				})
			})
		},
		toastOptions: {
			unstyled: true,
			classNames: {
				toast: "group pointer-events-auto relative flex w-full items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-[rgba(10,16,32,0.78)] py-3 pl-3 pr-9 text-[13px] text-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7),0_1px_0_0_rgba(255,255,255,0.05)_inset] backdrop-blur-2xl backdrop-saturate-150",
				title: "font-medium tracking-tight text-white leading-snug",
				description: "text-white/60 text-[12px] leading-relaxed mt-0.5",
				icon: "shrink-0",
				content: "min-w-0 flex-1",
				closeButton: "!absolute !top-1/2 !right-2 !left-auto !-translate-y-1/2 !translate-x-0 !h-6 !w-6 !rounded-md !border-0 !bg-transparent !text-white/40 hover:!bg-white/10 hover:!text-white !transition-colors",
				actionButton: "!rounded-lg !bg-white !px-3 !py-1.5 !text-xs !font-semibold !text-slate-900 hover:!bg-white/90 !transition",
				cancelButton: "!rounded-lg !bg-white/10 !px-3 !py-1.5 !text-xs !font-medium !text-white/80 hover:!bg-white/15 !transition",
				success: "!border-emerald-400/20",
				error: "!border-rose-400/20",
				warning: "!border-amber-400/20",
				info: "!border-sky-400/20"
			}
		},
		style: { "--width": isMobile ? "calc(100vw - 24px)" : "380px" },
		...props
	});
};
var styles_default = "/assets/styles-CpIxn7Y_.css";
var dolapay_icon_png_asset_default = {
	version: 1,
	asset_id: "56805e1b-9508-4b50-8375-78fcc1a41399",
	project_id: "9199219f-5519-4806-b061-ab4db3378b15",
	url: "/__l5e/assets-v1/56805e1b-9508-4b50-8375-78fcc1a41399/dolapay-icon.png",
	r2_key: "a/v1/9199219f-5519-4806-b061-ab4db3378b15/56805e1b-9508-4b50-8375-78fcc1a41399/dolapay-icon.png",
	original_filename: "dolapay-icon.png",
	size: 363980,
	content_type: "image/png",
	created_at: "2026-06-25T11:25:10Z"
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page introuvable"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "La page que vous cherchez n'existe pas ou a été déplacée."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Retour à l'accueil"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Cette page n'a pas pu être chargée"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Un problème est survenu de notre côté. Essayez de rafraîchir ou revenez à l'accueil."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Réessayer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Retour à l'accueil"
					})]
				})
			]
		})
	});
}
var Route$43 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "DolaPay — Infrastructure de paiement pour l'Afrique" },
			{
				name: "description",
				content: "Une API unifiée pour le Mobile Money et les cartes bancaires partout en Afrique."
			},
			{
				name: "author",
				content: "DolaPay"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:image",
				content: dolapay_logo_png_asset_default.url
			},
			{
				name: "twitter:image",
				content: dolapay_logo_png_asset_default.url
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/png",
				href: dolapay_icon_png_asset_default.url
			},
			{
				rel: "apple-touch-icon",
				href: dolapay_icon_png_asset_default.url
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$43.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		let mounted = true;
		import("./client-nARMQEqv.mjs").then((n) => n.t).then((n) => n.t).then(({ supabase }) => {
			if (!mounted) return;
			const { data: sub } = supabase.auth.onAuthStateChange((event) => {
				if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
				router.invalidate();
				if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
			});
			window.__sbSub = sub.subscription;
		});
		return () => {
			mounted = false;
		};
	}, [queryClient, router]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
var $$splitComponentImporter$35 = () => import("./settings-dGpyOcf4.mjs");
var Route$42 = createFileRoute("/settings")({
	head: () => ({ meta: [
		{ title: "Décaissements (Pay-out) — DolaPay" },
		{
			name: "description",
			content: "Décaissements bulk instantanés via REST API sur 12 économies. 1% + Réseau, wallet-to-wallet gratuit."
		},
		{
			property: "og:title",
			content: "Décaissements (Pay-out) — DolaPay"
		},
		{
			property: "og:description",
			content: "Décaissements bulk instantanés via REST API sur 12 économies. 1% + Réseau, wallet-to-wallet gratuit."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./route-Di7iQBCH.mjs");
var Route$41 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		if (typeof window === "undefined") return {
			userId: "",
			userEmail: ""
		};
		const { data } = await supabase.auth.getSession();
		const user = data?.session?.user;
		if (!user) throw redirect({ to: "/auth/sign-in" });
		return {
			userId: user.id,
			userEmail: user.email ?? ""
		};
	},
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./routes-DarkM0Ah.mjs");
var Route$40 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "DolaPay — L'infrastructure de paiement ultime pour l'Afrique" },
		{
			name: "description",
			content: "DolaPay unifie le Mobile Money et les cartes derrière une seule API. Construisez, scalez et encaissez partout en Afrique avec une sécurité de niveau bancaire."
		},
		{
			property: "og:title",
			content: "DolaPay — Infrastructure de paiement pour l'Afrique"
		},
		{
			property: "og:description",
			content: "Une seule API pour le Mobile Money et les cartes. Simplifiez votre finance, même la plus complexe."
		},
		{
			property: "og:type",
			content: "website"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./products.payment-links-DzNNyxY8.mjs");
var Route$39 = createFileRoute("/products/payment-links")({
	head: () => ({ meta: [
		{ title: "Liens de paiement — Encaisser sans code | DolaPay" },
		{
			name: "description",
			content: "Encaissez sans site web. Partagez un lien DolaPay sur WhatsApp, SMS ou e-mail et recevez Mobile Money ou cartes instantanément."
		},
		{
			property: "og:title",
			content: "Liens de paiement — DolaPay"
		},
		{
			property: "og:description",
			content: "Partagez un lien. Encaissez. Sans une ligne de code."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./products.pay-out-DaEPeJ0e.mjs");
var Route$38 = createFileRoute("/products/pay-out")({
	head: () => ({ meta: [
		{ title: "Décaissements (Pay-out) — DolaPay" },
		{
			name: "description",
			content: "Décaissements bulk instantanés via REST API sur 12 économies. 1% + Réseau, wallet-to-wallet gratuit."
		},
		{
			property: "og:title",
			content: "Décaissements (Pay-out) — DolaPay"
		},
		{
			property: "og:description",
			content: "Décaissements bulk instantanés via REST API sur 12 économies. 1% + Réseau, wallet-to-wallet gratuit."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./products.pay-in-Sl_SsvC_.mjs");
var Route$37 = createFileRoute("/products/pay-in")({
	head: () => ({ meta: [
		{ title: "Encaissements (Pay-in) — DolaPay" },
		{
			name: "description",
			content: "Acceptez le Mobile Money et les cartes Visa/Mastercard sur 12 économies africaines. 2% + Opérateur, transparent."
		},
		{
			property: "og:title",
			content: "Encaissements (Pay-in) — DolaPay"
		},
		{
			property: "og:description",
			content: "Acceptez le Mobile Money et les cartes Visa/Mastercard sur 12 économies africaines. 2% + Opérateur, transparent."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./products.ecommerce-DdPp67Tu.mjs");
var Route$36 = createFileRoute("/products/ecommerce")({
	head: () => ({ meta: [
		{ title: "Checkout e-commerce — DolaPay" },
		{
			name: "description",
			content: "Un checkout sécurisé et à forte conversion pour les marchands africains, qu'ils vendent des produits physiques ou numériques. En intégration ou hébergé."
		},
		{
			property: "og:title",
			content: "E-commerce — DolaPay"
		},
		{
			property: "og:description",
			content: "Convertissez plus d'acheteurs avec un checkout conçu pour l'Afrique."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./legal.terms-D00gPj17.mjs");
var Route$35 = createFileRoute("/legal/terms")({
	head: () => ({ meta: [{ title: "Conditions d'utilisation — DolaPay" }, {
		name: "description",
		content: "Les conditions qui régissent votre utilisation des services DolaPay."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./legal.privacy-vdi04AvT.mjs");
var Route$34 = createFileRoute("/legal/privacy")({
	head: () => ({ meta: [{ title: "Politique de confidentialité — DolaPay" }, {
		name: "description",
		content: "Comment DolaPay collecte, utilise et protège vos données."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./legal.aml-BZQKk8ra.mjs");
var Route$33 = createFileRoute("/legal/aml")({
	head: () => ({ meta: [{ title: "Politique LCB-FT — DolaPay" }, {
		name: "description",
		content: "Notre politique de lutte contre le blanchiment de capitaux et le financement du terrorisme."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./developers.sdks-C_4BDTWl.mjs");
var Route$32 = createFileRoute("/developers/sdks")({
	head: () => ({ meta: [{ title: "SDKs DolaPay" }, {
		name: "description",
		content: "SDKs officiels DolaPay pour Node.js, Python, PHP/Laravel et Go avec commandes d'installation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./developers.api-DrgcPZ6n.mjs");
var Route$31 = createFileRoute("/developers/api")({
	head: () => ({ meta: [{ title: "Documentation API DolaPay" }, {
		name: "description",
		content: "Référence API DolaPay pour encaissements Mobile Money, décaissements, webhooks et SDKs en Afrique."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./company.pricing-BEVNUSjS.mjs");
var Route$30 = createFileRoute("/company/pricing")({
	head: () => ({ meta: [
		{ title: "Tarifs — DolaPay" },
		{
			name: "description",
			content: "Tarification transparente DolaPay : frais Pay-in et Pay-out par pays et opérateur Mobile Money."
		},
		{
			property: "og:title",
			content: "Tarifs — DolaPay"
		},
		{
			property: "og:description",
			content: "Tarification transparente DolaPay : frais Pay-in et Pay-out par pays et opérateur Mobile Money."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./company.contact-EPh9_LTL.mjs");
var Route$29 = createFileRoute("/company/contact")({
	head: () => ({ meta: [
		{ title: "Contact — DolaPay" },
		{
			name: "description",
			content: "Parlez à l'équipe DolaPay : ventes, support marchand, conformité ou partenariats. Réponse sous 24h ouvrées."
		},
		{
			property: "og:title",
			content: "Contact — DolaPay"
		},
		{
			property: "og:description",
			content: "Parlez à l'équipe DolaPay : ventes, support, conformité ou partenariats."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./company.about-BD7IpcC3.mjs");
var Route$28 = createFileRoute("/company/about")({
	head: () => ({ meta: [
		{ title: "À propos — Construire l'Autoroute Financière de l'Afrique | DolaPay" },
		{
			name: "description",
			content: "Une API unifiée pour connecter les entreprises du monde entier à plus de 500 millions de portefeuilles Mobile Money africains."
		},
		{
			property: "og:title",
			content: "À propos — DolaPay"
		},
		{
			property: "og:description",
			content: "Construire l'autoroute financière de l'Afrique. Une API unifiée, 500M+ de portefeuilles Mobile Money."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./auth.sign-up-DLqYhdF9.mjs");
var Route$27 = createFileRoute("/auth/sign-up")({
	head: () => ({ meta: [
		{ title: "Créer un compte — DolaPay" },
		{
			name: "description",
			content: "Créez votre compte DolaPay gratuit et commencez à construire."
		},
		{
			property: "og:title",
			content: "Créer un compte — DolaPay"
		},
		{
			property: "og:description",
			content: "Créez votre compte DolaPay gratuit et commencez à construire."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./auth.sign-in-C9fX2jhn.mjs");
var Route$26 = createFileRoute("/auth/sign-in")({
	head: () => ({ meta: [
		{ title: "Connexion — DolaPay" },
		{
			name: "description",
			content: "Connectez-vous à votre tableau de bord DolaPay."
		},
		{
			property: "og:title",
			content: "Connexion — DolaPay"
		},
		{
			property: "og:description",
			content: "Connectez-vous à votre tableau de bord DolaPay."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./onboarding-DdX3iSkX.mjs");
var Route$25 = createFileRoute("/_authenticated/onboarding")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./complete-profile-C7rjFvU1.mjs");
var Route$24 = createFileRoute("/_authenticated/complete-profile")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./route-BCePu9r4.mjs");
var Route$23 = createFileRoute("/_authenticated/admin")({
	ssr: false,
	beforeLoad: async () => {
		if (typeof window === "undefined") return;
		const { data: sessionData } = await supabase.auth.getSession();
		const user = sessionData?.session?.user;
		if (!user) throw redirect({ to: "/auth/sign-in" });
		const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
		if (error || !data) throw redirect({ to: "/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./dashboard-BIW7R_dN.mjs");
var Route$22 = createFileRoute("/_authenticated/dashboard/")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin-Dd09SLVs.mjs");
var Route$21 = createFileRoute("/_authenticated/admin/")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
async function authenticateMerchant(request) {
	const token = (request.headers.get("Authorization") || request.headers.get("x-api-key") || "").replace(/^Bearer\s+/i, "").trim();
	if (!token) return Response.json({ error: {
		code: "unauthorized",
		message: "Clé API manquante. En-tête Authorization: Bearer <API_KEY> requis."
	} }, { status: 401 });
	const isTest = token.startsWith("test_") || token.includes("test");
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
	const hashed = Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
	const { data: keyData, error } = await supabaseAdmin.from("api_keys").select("profile_id, revoked_at, prefix").eq("hashed_key", hashed).maybeSingle();
	if (error || !keyData || keyData.revoked_at) {
		if (token.startsWith("test_sk_")) return {
			profile_id: "00000000-0000-0000-0000-000000000000",
			prefix: "test_sk_dola",
			is_test: true
		};
		return Response.json({ error: {
			code: "invalid_api_key",
			message: "Clé API invalide ou révoquée."
		} }, { status: 401 });
	}
	return {
		profile_id: keyData.profile_id,
		prefix: keyData.prefix,
		is_test: isTest
	};
}
var PayoutBody = objectType({
	amount: numberType().int().positive("Le montant doit être supérieur à zéro"),
	currency: stringType().default("XOF"),
	recipient_phone: stringType().min(8, "Numéro de téléphone invalide"),
	provider: stringType().default("Orange"),
	reference: stringType().optional()
});
var Route$20 = createFileRoute("/api/v1/payouts")({ server: { handlers: { POST: async ({ request }) => {
	const auth = await authenticateMerchant(request);
	if (auth instanceof Response) return auth;
	let json;
	try {
		json = await request.json();
	} catch {
		return Response.json({ error: {
			code: "invalid_json",
			message: "Corps JSON invalide."
		} }, { status: 400 });
	}
	const parsed = PayoutBody.safeParse(json);
	if (!parsed.success) return Response.json({ error: {
		code: "validation_error",
		message: parsed.error.issues[0].message
	} }, { status: 400 });
	const { amount, currency, recipient_phone, provider, reference } = parsed.data;
	const correspondent = getCorrespondentCode(provider);
	if (auth.is_test && auth.profile_id === "00000000-0000-0000-0000-000000000000") return Response.json({
		id: `po_${crypto.randomUUID().slice(0, 12)}`,
		status: "processing",
		amount,
		currency,
		recipient_phone,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	}, { status: 201 });
	const { data: batch, error: batchErr } = await supabaseAdmin.from("payout_batches").insert({
		owner_id: auth.profile_id,
		profile_id: auth.profile_id,
		name: reference || `Payout API (${auth.prefix})`,
		reference: reference || `po_${Date.now()}`,
		total_amount: amount,
		currency,
		total_count: 1,
		status: "processing",
		provider: correspondent
	}).select("id, created_at").single();
	if (batchErr || !batch) return Response.json({ error: {
		code: "db_error",
		message: "Impossible d'initier le payout."
	} }, { status: 500 });
	const { data: item } = await supabaseAdmin.from("payout_batch_items").insert({
		batch_id: batch.id,
		recipient_phone,
		amount,
		currency,
		provider: correspondent,
		status: "processing"
	}).select("id").single();
	const payoutId = item?.id || batch.id;
	try {
		const res = await pawapay.initiatePayout({
			payoutId,
			amount,
			currency,
			phone: recipient_phone,
			provider,
			description: reference || "DolaPay Payout"
		});
		if (res.status === "REJECTED") {
			await supabaseAdmin.from("payout_batches").update({ status: "failed" }).eq("id", batch.id);
			return Response.json({ error: {
				code: "operator_rejected",
				message: res.rejectionReason?.rejectionMessage || "Retrait refusé."
			} }, { status: 400 });
		}
	} catch (err) {
		console.error("PawaPay payout error:", err);
	}
	return Response.json({
		id: batch.id,
		status: "processing",
		amount,
		currency,
		recipient_phone,
		created_at: batch.created_at
	}, { status: 201 });
} } } });
var ChargeBody = objectType({
	amount: numberType().int().positive("Le montant doit être un entier positif"),
	currency: stringType().default("XOF"),
	customer_phone: stringType().min(8, "Numéro de téléphone invalide"),
	provider: stringType().default("Orange"),
	metadata: recordType(unknownType()).optional(),
	description: stringType().optional()
});
var Route$19 = createFileRoute("/api/v1/charges")({ server: { handlers: { POST: async ({ request }) => {
	const auth = await authenticateMerchant(request);
	if (auth instanceof Response) return auth;
	let json;
	try {
		json = await request.json();
	} catch {
		return Response.json({ error: {
			code: "invalid_json",
			message: "Corps JSON invalide."
		} }, { status: 400 });
	}
	const parsed = ChargeBody.safeParse(json);
	if (!parsed.success) return Response.json({ error: {
		code: "validation_error",
		message: parsed.error.issues[0].message
	} }, { status: 400 });
	const { amount, currency, customer_phone, provider, description } = parsed.data;
	const correspondent = getCorrespondentCode(provider);
	if (auth.is_test && auth.profile_id === "00000000-0000-0000-0000-000000000000") return Response.json({
		id: `ch_${crypto.randomUUID().slice(0, 12)}`,
		status: "pending",
		amount,
		currency,
		operator: correspondent.toLowerCase(),
		customer_phone,
		created_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	const { data: tx, error: txErr } = await supabaseAdmin.from("transactions").insert({
		profile_id: auth.profile_id,
		merchant_id: auth.profile_id,
		amount,
		currency,
		type: "api_charge",
		status: "pending",
		payment_method: correspondent,
		customer_phone,
		description: description || `Encaissement API (${auth.prefix})`
	}).select("id, created_at").single();
	if (txErr || !tx) return Response.json({ error: {
		code: "db_error",
		message: "Impossible de créer la transaction."
	} }, { status: 500 });
	try {
		const res = await pawapay.initiateDeposit({
			depositId: tx.id,
			amount,
			currency,
			phone: customer_phone,
			provider,
			description: description || `DolaPay API Charge`
		});
		if (res.status === "REJECTED") {
			await supabaseAdmin.from("transactions").update({ status: "failed" }).eq("id", tx.id);
			return Response.json({ error: {
				code: "operator_rejected",
				message: res.rejectionReason?.rejectionMessage || "Rejeté par l'opérateur."
			} }, { status: 400 });
		}
	} catch (err) {
		console.error("PawaPay charge error:", err);
	}
	return Response.json({
		id: tx.id,
		status: "pending",
		amount,
		currency,
		operator: correspondent.toLowerCase(),
		customer_phone,
		created_at: tx.created_at
	}, { status: 201 });
} } } });
var Route$18 = createFileRoute("/api/public/pawapay-webhook")({ server: { handlers: { POST: async ({ request }) => {
	let payload;
	try {
		payload = await request.json();
	} catch {
		return Response.json({ error: "Invalid JSON" }, { status: 400 });
	}
	const { supabaseAdmin } = await import("./client.server-BVgwX-1S.mjs");
	if (payload.depositId) {
		const newStatus = payload.status === "COMPLETED" ? "success" : "failed";
		const { data: tx } = await supabaseAdmin.from("transactions").select("id, amount, profile_id, status").eq("id", payload.depositId).maybeSingle();
		if (tx && tx.status !== "success") {
			const amount = Number(tx.amount || payload.amount || 0);
			const feeAmount = Math.round(amount * .02);
			const netAmount = amount - feeAmount;
			await supabaseAdmin.from("transactions").update({
				status: newStatus,
				fee_amount: feeAmount,
				net_amount: netAmount
			}).eq("id", payload.depositId);
		}
	}
	if (payload.payoutId) {
		const newStatus = payload.status === "COMPLETED" ? "success" : "failed";
		await supabaseAdmin.from("payout_batch_items").update({
			status: newStatus,
			error_message: payload.failureReason?.failureMessage || null
		}).eq("id", payload.payoutId);
		const { data: item } = await supabaseAdmin.from("payout_batch_items").select("batch_id").eq("id", payload.payoutId).maybeSingle();
		if (item?.batch_id) {
			const { data: items } = await supabaseAdmin.from("payout_batch_items").select("status").eq("batch_id", item.batch_id);
			if (items && items.every((i) => i.status === "success" || i.status === "failed")) {
				const allSuccess = items.every((i) => i.status === "success");
				await supabaseAdmin.from("payout_batches").update({ status: allSuccess ? "completed" : "completed_with_errors" }).eq("id", item.batch_id);
			}
		}
	}
	return Response.json({
		received: true,
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	});
} } } });
/**
* Didit verification webhook.
* Signature: HMAC-SHA256(body, DIDIT_WEBHOOK_SECRET) sent as `x-signature` header.
* On a successful decision, updates `business_representatives.verified` for the
* matching `didit_session_id`.
*/
var Route$17 = createFileRoute("/api/public/didit-webhook")({ server: { handlers: { POST: async ({ request }) => {
	const secret = process.env.DIDIT_WEBHOOK_SECRET;
	if (!secret) return new Response("Webhook not configured", { status: 503 });
	const sig = request.headers.get("x-signature") ?? "";
	const body = await request.text();
	const expected = createHmac("sha256", secret).update(body).digest("hex");
	const a = Buffer.from(sig);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response("Invalid signature", { status: 401 });
	let payload;
	try {
		payload = JSON.parse(body);
	} catch {
		return new Response("Invalid JSON", { status: 400 });
	}
	const sessionId = payload.session_id;
	if (!sessionId) return new Response("Missing session_id", { status: 400 });
	const decision = payload.decision?.status ?? payload.status ?? "unknown";
	const approved = decision === "Approved" || decision === "approved";
	const { supabaseAdmin } = await import("./client.server-BVgwX-1S.mjs");
	const updates = {
		didit_status: decision,
		ai_verification_log: {
			provider: "didit",
			decision,
			face_match_score: payload.decision?.face_match?.score ?? null,
			liveness_score: payload.decision?.liveness?.score ?? null,
			received_at: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
	if (approved) {
		updates.verified = true;
		updates.verified_at = (/* @__PURE__ */ new Date()).toISOString();
	}
	const { error } = await supabaseAdmin.from("business_representatives").update(updates).eq("didit_session_id", sessionId);
	if (error) {
		console.error("Didit webhook update failed", error);
		return new Response("DB update failed", { status: 500 });
	}
	return new Response("ok", { status: 200 });
} } } });
var $$splitComponentImporter$13 = () => import("./verify-BQ2tTH4K.mjs");
var Route$16 = createFileRoute("/_authenticated/dashboard/verify")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./transactions-DijK2d3g.mjs");
var Route$15 = createFileRoute("/_authenticated/dashboard/transactions")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./team-BYv5mAxw.mjs");
var Route$14 = createFileRoute("/_authenticated/dashboard/team")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./settings-ZuSEzmVp.mjs");
var Route$13 = createFileRoute("/_authenticated/dashboard/settings")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./payouts-CLlqRuZ4.mjs");
var Route$12 = createFileRoute("/_authenticated/dashboard/payouts")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./payment-links-BSWug4pW.mjs");
var Route$11 = createFileRoute("/_authenticated/dashboard/payment-links")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./api-keys-B_wO2XrP.mjs");
var Route$10 = createFileRoute("/_authenticated/dashboard/api-keys")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./risk-D_N7bFfo.mjs");
var Route$9 = createFileRoute("/_authenticated/admin/risk")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./merchants-DjTRmXyI.mjs");
var Route$8 = createFileRoute("/_authenticated/admin/merchants")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./live-CNQfyubw.mjs");
var Route$7 = createFileRoute("/_authenticated/admin/live")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./finance-DywsQfcL.mjs");
var Route$6 = createFileRoute("/_authenticated/admin/finance")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./compliance-DyEkNLfY.mjs");
var Route$5 = createFileRoute("/_authenticated/admin/compliance")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./audit-hqYEqAn1.mjs");
var Route$4 = createFileRoute("/_authenticated/admin/audit")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var Route$3 = createFileRoute("/api/v1/charges/$id")({ server: { handlers: { GET: async ({ request, params }) => {
	const auth = await authenticateMerchant(request);
	if (auth instanceof Response) return auth;
	if (auth.is_test && auth.profile_id === "00000000-0000-0000-0000-000000000000") return Response.json({
		id: params.id,
		status: "succeeded",
		amount: 5e3,
		currency: "XOF",
		settled_at: (/* @__PURE__ */ new Date()).toISOString()
	});
	const { data: tx, error } = await supabaseAdmin.from("transactions").select("id, status, amount, currency, created_at, payment_method").eq("id", params.id).eq("profile_id", auth.profile_id).maybeSingle();
	if (error || !tx) return Response.json({ error: {
		code: "not_found",
		message: "Charge introuvable."
	} }, { status: 404 });
	const mappedStatus = tx.status === "success" ? "succeeded" : tx.status;
	return Response.json({
		id: tx.id,
		status: mappedStatus,
		amount: Number(tx.amount),
		currency: tx.currency,
		operator: tx.payment_method?.toLowerCase() || "orange_bfa",
		settled_at: tx.status === "success" ? tx.created_at : null
	});
} } } });
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
var Route$2 = createFileRoute("/api/public/tx-status/$id")({ server: { handlers: { GET: async ({ params }) => {
	if (!UUID_RE.test(params.id)) return Response.json({ error: "Invalid id" }, { status: 400 });
	const { supabaseAdmin } = await import("./client.server-BVgwX-1S.mjs");
	const { data, error } = await supabaseAdmin.from("transactions").select("status").eq("id", params.id).maybeSingle();
	if (error) return Response.json({ error: "Server error" }, { status: 500 });
	if (!data) return Response.json({ error: "Not found" }, { status: 404 });
	return Response.json({ status: data.status }, { headers: { "Cache-Control": "no-store" } });
} } } });
var Body = objectType({
	customer_name: stringType().trim().min(1).max(100),
	customer_phone: stringType().trim().min(6).max(20),
	provider: stringType().trim().min(1).max(40)
});
var RATE_WINDOW_SEC = 60;
var RATE_MAX = 8;
var Route$1 = createFileRoute("/api/public/pay/$slug")({ server: { handlers: { POST: async ({ request, params }) => {
	let json;
	try {
		json = await request.json();
	} catch {
		return Response.json({ error: "Invalid JSON" }, { status: 400 });
	}
	const parsed = Body.safeParse(json);
	if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });
	const idemKey = (request.headers.get("idempotency-key") ?? "").trim().slice(0, 100);
	if (!idemKey) return Response.json({ error: "Missing Idempotency-Key header" }, { status: 400 });
	const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
	const { supabaseAdmin } = await import("./client.server-BVgwX-1S.mjs");
	const { pawapay } = await import("./pawapay.server-BpQ3WrJE.mjs");
	const since = (/* @__PURE__ */ new Date(Date.now() - RATE_WINDOW_SEC * 1e3)).toISOString();
	const { count } = await supabaseAdmin.from("pay_attempts").select("id", {
		count: "exact",
		head: true
	}).eq("ip", ip).eq("slug", params.slug).gte("created_at", since);
	if ((count ?? 0) >= RATE_MAX) return Response.json({ error: "Too many requests. Please retry later." }, {
		status: 429,
		headers: { "Retry-After": String(RATE_WINDOW_SEC) }
	});
	await supabaseAdmin.from("pay_attempts").insert({
		ip,
		slug: params.slug
	});
	const { data: link, error: linkErr } = await supabaseAdmin.from("payment_links").select("id,profile_id,amount,currency,title,active,success_url,failure_url").eq("slug", params.slug).maybeSingle();
	if (linkErr || !link || !link.active) return Response.json({ error: "Lien introuvable ou inactif" }, { status: 404 });
	const { data: existing } = await supabaseAdmin.from("transactions").select("id,status").eq("profile_id", link.profile_id).eq("idempotency_key", idemKey).maybeSingle();
	if (existing) return Response.json({
		transaction_id: existing.id,
		status: existing.status,
		success_url: link.success_url,
		failure_url: link.failure_url,
		idempotent: true
	});
	const { data: tx, error: txErr } = await supabaseAdmin.from("transactions").insert({
		profile_id: link.profile_id,
		amount: link.amount,
		currency: link.currency,
		type: "payment_link",
		status: "pending",
		idempotency_key: idemKey,
		description: `${link.title} · ${parsed.data.customer_name} · ${parsed.data.provider} ${parsed.data.customer_phone}`
	}).select("id").single();
	if (txErr) {
		if (txErr.code === "23505") {
			const { data: again } = await supabaseAdmin.from("transactions").select("id,status").eq("profile_id", link.profile_id).eq("idempotency_key", idemKey).maybeSingle();
			if (again) return Response.json({
				transaction_id: again.id,
				status: again.status,
				success_url: link.success_url,
				failure_url: link.failure_url,
				idempotent: true
			});
		}
		return Response.json({ error: "Échec de création" }, { status: 500 });
	}
	try {
		if ((await pawapay.initiateDeposit({
			depositId: tx.id,
			amount: Number(link.amount),
			currency: link.currency || "XOF",
			phone: parsed.data.customer_phone,
			provider: parsed.data.provider,
			description: `${link.title} · ${parsed.data.customer_name}`
		})).status === "REJECTED") {
			await supabaseAdmin.from("transactions").update({ status: "failed" }).eq("id", tx.id);
			return Response.json({ error: "Paiement refusé par l'opérateur Mobile Money" }, { status: 400 });
		}
	} catch (err) {
		console.error("Erreur PawaPay initDeposit:", err);
	}
	return Response.json({
		transaction_id: tx.id,
		status: "pending",
		success_url: link.success_url,
		failure_url: link.failure_url
	});
} } } });
var $$splitComponentImporter = () => import("./merchants._id-CEqhlfbi.mjs");
var Route = createFileRoute("/_authenticated/admin/merchants/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var SettingsRoute = Route$42.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$43
});
var AuthenticatedRouteRoute = Route$41.update({
	id: "/_authenticated",
	getParentRoute: () => Route$43
});
var IndexRoute = Route$40.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$43
});
var ProductsPaymentLinksRoute = Route$39.update({
	id: "/products/payment-links",
	path: "/products/payment-links",
	getParentRoute: () => Route$43
});
var ProductsPayOutRoute = Route$38.update({
	id: "/products/pay-out",
	path: "/products/pay-out",
	getParentRoute: () => Route$43
});
var ProductsPayInRoute = Route$37.update({
	id: "/products/pay-in",
	path: "/products/pay-in",
	getParentRoute: () => Route$43
});
var ProductsEcommerceRoute = Route$36.update({
	id: "/products/ecommerce",
	path: "/products/ecommerce",
	getParentRoute: () => Route$43
});
var PaySlugRoute = Route$45.update({
	id: "/pay/$slug",
	path: "/pay/$slug",
	getParentRoute: () => Route$43
});
var LegalTermsRoute = Route$35.update({
	id: "/legal/terms",
	path: "/legal/terms",
	getParentRoute: () => Route$43
});
var LegalPrivacyRoute = Route$34.update({
	id: "/legal/privacy",
	path: "/legal/privacy",
	getParentRoute: () => Route$43
});
var LegalAmlRoute = Route$33.update({
	id: "/legal/aml",
	path: "/legal/aml",
	getParentRoute: () => Route$43
});
var DevelopersSdksRoute = Route$32.update({
	id: "/developers/sdks",
	path: "/developers/sdks",
	getParentRoute: () => Route$43
});
var DevelopersApiRoute = Route$31.update({
	id: "/developers/api",
	path: "/developers/api",
	getParentRoute: () => Route$43
});
var CompanyPricingRoute = Route$30.update({
	id: "/company/pricing",
	path: "/company/pricing",
	getParentRoute: () => Route$43
});
var CompanyContactRoute = Route$29.update({
	id: "/company/contact",
	path: "/company/contact",
	getParentRoute: () => Route$43
});
var CompanyAboutRoute = Route$28.update({
	id: "/company/about",
	path: "/company/about",
	getParentRoute: () => Route$43
});
var AuthSignUpRoute = Route$27.update({
	id: "/auth/sign-up",
	path: "/auth/sign-up",
	getParentRoute: () => Route$43
});
var AuthSignInRoute = Route$26.update({
	id: "/auth/sign-in",
	path: "/auth/sign-in",
	getParentRoute: () => Route$43
});
var AuthenticatedOnboardingRoute = Route$25.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCompleteProfileRoute = Route$24.update({
	id: "/complete-profile",
	path: "/complete-profile",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRouteRoute = Route$44.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminRouteRoute = Route$23.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardIndexRoute = Route$22.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedDashboardRouteRoute
});
var AuthenticatedAdminIndexRoute = Route$21.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var ApiV1PayoutsRoute = Route$20.update({
	id: "/api/v1/payouts",
	path: "/api/v1/payouts",
	getParentRoute: () => Route$43
});
var ApiV1ChargesRoute = Route$19.update({
	id: "/api/v1/charges",
	path: "/api/v1/charges",
	getParentRoute: () => Route$43
});
var ApiPublicPawapayWebhookRoute = Route$18.update({
	id: "/api/public/pawapay-webhook",
	path: "/api/public/pawapay-webhook",
	getParentRoute: () => Route$43
});
var ApiPublicDiditWebhookRoute = Route$17.update({
	id: "/api/public/didit-webhook",
	path: "/api/public/didit-webhook",
	getParentRoute: () => Route$43
});
var AuthenticatedDashboardVerifyRoute = Route$16.update({
	id: "/verify",
	path: "/verify",
	getParentRoute: () => AuthenticatedDashboardRouteRoute
});
var AuthenticatedDashboardTransactionsRoute = Route$15.update({
	id: "/transactions",
	path: "/transactions",
	getParentRoute: () => AuthenticatedDashboardRouteRoute
});
var AuthenticatedDashboardTeamRoute = Route$14.update({
	id: "/team",
	path: "/team",
	getParentRoute: () => AuthenticatedDashboardRouteRoute
});
var AuthenticatedDashboardSettingsRoute = Route$13.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuthenticatedDashboardRouteRoute
});
var AuthenticatedDashboardPayoutsRoute = Route$12.update({
	id: "/payouts",
	path: "/payouts",
	getParentRoute: () => AuthenticatedDashboardRouteRoute
});
var AuthenticatedDashboardPaymentLinksRoute = Route$11.update({
	id: "/payment-links",
	path: "/payment-links",
	getParentRoute: () => AuthenticatedDashboardRouteRoute
});
var AuthenticatedDashboardApiKeysRoute = Route$10.update({
	id: "/api-keys",
	path: "/api-keys",
	getParentRoute: () => AuthenticatedDashboardRouteRoute
});
var AuthenticatedDashboardAdminRoute = Route$46.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedDashboardRouteRoute
});
var AuthenticatedAdminRiskRoute = Route$9.update({
	id: "/risk",
	path: "/risk",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminMerchantsRoute = Route$8.update({
	id: "/merchants",
	path: "/merchants",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminLiveRoute = Route$7.update({
	id: "/live",
	path: "/live",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminFinanceRoute = Route$6.update({
	id: "/finance",
	path: "/finance",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminComplianceRoute = Route$5.update({
	id: "/compliance",
	path: "/compliance",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var AuthenticatedAdminAuditRoute = Route$4.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AuthenticatedAdminRouteRoute
});
var ApiV1ChargesIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => ApiV1ChargesRoute
});
var ApiPublicTxStatusIdRoute = Route$2.update({
	id: "/api/public/tx-status/$id",
	path: "/api/public/tx-status/$id",
	getParentRoute: () => Route$43
});
var ApiPublicPaySlugRoute = Route$1.update({
	id: "/api/public/pay/$slug",
	path: "/api/public/pay/$slug",
	getParentRoute: () => Route$43
});
var AuthenticatedAdminMerchantsRouteChildren = { AuthenticatedAdminMerchantsIdRoute: Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AuthenticatedAdminMerchantsRoute
}) };
var AuthenticatedAdminRouteRouteChildren = {
	AuthenticatedAdminAuditRoute,
	AuthenticatedAdminComplianceRoute,
	AuthenticatedAdminFinanceRoute,
	AuthenticatedAdminLiveRoute,
	AuthenticatedAdminMerchantsRoute: AuthenticatedAdminMerchantsRoute._addFileChildren(AuthenticatedAdminMerchantsRouteChildren),
	AuthenticatedAdminRiskRoute,
	AuthenticatedAdminIndexRoute
};
var AuthenticatedAdminRouteRouteWithChildren = AuthenticatedAdminRouteRoute._addFileChildren(AuthenticatedAdminRouteRouteChildren);
var AuthenticatedDashboardRouteRouteChildren = {
	AuthenticatedDashboardAdminRoute,
	AuthenticatedDashboardApiKeysRoute,
	AuthenticatedDashboardPaymentLinksRoute,
	AuthenticatedDashboardPayoutsRoute,
	AuthenticatedDashboardSettingsRoute,
	AuthenticatedDashboardTeamRoute,
	AuthenticatedDashboardTransactionsRoute,
	AuthenticatedDashboardVerifyRoute,
	AuthenticatedDashboardIndexRoute
};
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminRouteRoute: AuthenticatedAdminRouteRouteWithChildren,
	AuthenticatedDashboardRouteRoute: AuthenticatedDashboardRouteRoute._addFileChildren(AuthenticatedDashboardRouteRouteChildren),
	AuthenticatedCompleteProfileRoute,
	AuthenticatedOnboardingRoute
};
var AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
var ApiV1ChargesRouteChildren = { ApiV1ChargesIdRoute };
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
	SettingsRoute,
	AuthSignInRoute,
	AuthSignUpRoute,
	CompanyAboutRoute,
	CompanyContactRoute,
	CompanyPricingRoute,
	DevelopersApiRoute,
	DevelopersSdksRoute,
	LegalAmlRoute,
	LegalPrivacyRoute,
	LegalTermsRoute,
	PaySlugRoute,
	ProductsEcommerceRoute,
	ProductsPayInRoute,
	ProductsPayOutRoute,
	ProductsPaymentLinksRoute,
	ApiPublicDiditWebhookRoute,
	ApiPublicPawapayWebhookRoute,
	ApiV1ChargesRoute: ApiV1ChargesRoute._addFileChildren(ApiV1ChargesRouteChildren),
	ApiV1PayoutsRoute,
	ApiPublicPaySlugRoute,
	ApiPublicTxStatusIdRoute
};
var routeTree = Route$43._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { supabaseAdmin as a, getRouter, pawapay as i, cleanPhoneNumber as n, getCorrespondentCode as r, PawaPayClient as t };
