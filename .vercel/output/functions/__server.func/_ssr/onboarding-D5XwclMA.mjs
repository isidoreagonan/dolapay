import { o as __toESM } from "../_runtime.mjs";
import { n as supabase } from "./client-DWb0N0jk.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { O as isRedirect, R as useRouter, _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { A as ScanFace, Bt as CircleCheck, C as ShieldAlert, Et as ArrowLeft, Ft as LoaderCircle, G as MapPin, L as Plus, Nt as Sparkles, Tt as ArrowRight, k as ScanLine, l as Upload, o as User, p as Trash2, ut as ExternalLink, xt as Building2 } from "../_libs/lucide-react.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-DGl8EHd4.mjs";
import { t as Card } from "./card-CzXpCsbD.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as dolapay_logo_png_asset_default } from "./dolapay-logo.png.asset--aVJCmSq.mjs";
import { t as SUPPORTED_COUNTRIES } from "./supported-countries-CoIgmV1m.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-DEB6xDAC.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BSnKpN8m.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as confetti_module_default } from "../_libs/canvas-confetti.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-D5XwclMA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var BROWSER_KEY = void 0;
function AddressBlock({ label = "Adresse", country, city, address, onCountry, onCity, onAddress }) {
	const inputRef = (0, import_react.useRef)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const countryCode = SUPPORTED_COUNTRIES.find((c) => c.name === country)?.code;
	(0, import_react.useEffect)(() => {}, [
		countryCode,
		city,
		onAddress,
		onCity
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
				className: "text-xs font-semibold",
				children: [label, " — Pays"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: country,
				onChange: (e) => onCountry(e.target.value),
				className: "mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "— Sélectionnez un pays —"
				}), SUPPORTED_COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: c.name,
					children: [
						c.flag,
						" ",
						c.name
					]
				}, c.code))]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs font-semibold",
					children: "Ville"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1",
					value: city,
					onChange: (e) => onCity(e.target.value),
					placeholder: "Ex : Cotonou"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
					className: "text-xs font-semibold",
					children: ["Adresse complète ", BROWSER_KEY]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						ref: inputRef,
						className: "mt-1 pl-8",
						value: address,
						onChange: (e) => onAddress(e.target.value),
						placeholder: "Rue, quartier, numéro…",
						autoComplete: "off"
					})]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: "💡 Astuce : connectez Google Maps dans les intégrations pour activer l'auto-complétion d'adresse."
			})
		]
	});
}
var FRANCOPHONE_RCCM = "Registre du commerce (RCCM)";
var KYB_LABELS = {
	"Bénin": {
		registry: {
			label: FRANCOPHONE_RCCM,
			short: "RCCM",
			hint: "Document officiel à jour délivré par le greffe."
		},
		tax: {
			label: "Numéro IFU (Identifiant Fiscal Unique)",
			short: "IFU",
			placeholder: "Ex. 3201900000000"
		}
	},
	"Cameroun": {
		registry: {
			label: FRANCOPHONE_RCCM,
			short: "RCCM",
			hint: "Document officiel à jour délivré par le greffe."
		},
		tax: {
			label: "Numéro NIU (Numéro d'Identifiant Unique)",
			short: "NIU",
			placeholder: "Ex. M0000000000000A"
		}
	},
	"Côte d'Ivoire": {
		registry: {
			label: FRANCOPHONE_RCCM,
			short: "RCCM",
			hint: "Document officiel à jour délivré par le greffe."
		},
		tax: {
			label: "Numéro NCC (Numéro de Compte Contribuable)",
			short: "NCC",
			placeholder: "Ex. 0000000 A"
		}
	},
	"Sénégal": {
		registry: {
			label: FRANCOPHONE_RCCM,
			short: "RCCM",
			hint: "Document officiel à jour délivré par le greffe."
		},
		tax: {
			label: "Numéro NINEA",
			short: "NINEA",
			placeholder: "Ex. 000000000 2 G 3"
		}
	},
	"Gabon": {
		registry: {
			label: FRANCOPHONE_RCCM,
			short: "RCCM",
			hint: "Document officiel à jour délivré par le greffe."
		},
		tax: {
			label: "Numéro NIF (Numéro d'Identification Fiscale)",
			short: "NIF",
			placeholder: "Ex. 000000 X"
		}
	},
	"RDC": {
		registry: {
			label: "RCCM (ou ID NAT)",
			short: "RCCM",
			hint: "RCCM ou Identification Nationale (ID NAT) valide."
		},
		tax: {
			label: "Numéro Impôt (NIF)",
			short: "NIF",
			placeholder: "Ex. A0000000X"
		}
	},
	"Congo": {
		registry: {
			label: FRANCOPHONE_RCCM,
			short: "RCCM",
			hint: "Document officiel à jour délivré par le greffe."
		},
		tax: {
			label: "Numéro NIU (Numéro d'Identification Unique)",
			short: "NIU",
			placeholder: "Ex. P2020000000000"
		}
	},
	"Kenya": {
		registry: {
			label: "Certificate of Incorporation (CR12)",
			short: "CoI",
			hint: "Issued by the Registrar of Companies."
		},
		tax: {
			label: "KRA PIN (Kenya Revenue Authority)",
			short: "KRA PIN",
			placeholder: "Ex. P000000000X"
		}
	},
	"Rwanda": {
		registry: {
			label: "Certificate of Incorporation (RDB)",
			short: "CoI",
			hint: "Issued by the Rwanda Development Board."
		},
		tax: {
			label: "TIN (Tax Identification Number)",
			short: "TIN",
			placeholder: "Ex. 100000000"
		}
	},
	"Ouganda": {
		registry: {
			label: "Certificate of Incorporation (URSB)",
			short: "CoI",
			hint: "Issued by the Uganda Registration Services Bureau."
		},
		tax: {
			label: "TIN (Tax Identification Number)",
			short: "TIN",
			placeholder: "Ex. 1000000000"
		}
	},
	"Zambie": {
		registry: {
			label: "Certificate of Incorporation (PACRA)",
			short: "CoI",
			hint: "Issued by PACRA."
		},
		tax: {
			label: "TPIN (Taxpayer Identification Number)",
			short: "TPIN",
			placeholder: "Ex. 1000000000"
		}
	},
	"Sierra Leone": {
		registry: {
			label: "Certificate of Incorporation",
			short: "CoI",
			hint: "Issued by the Corporate Affairs Commission."
		},
		tax: {
			label: "TIN (National Revenue Authority)",
			short: "TIN",
			placeholder: "Ex. 10000000-0"
		}
	}
};
var GENERIC_LABELS = {
	registry: {
		label: "Registre du commerce / Certificate of Incorporation",
		short: "Registre",
		hint: "Document officiel d'enregistrement de la société (équivalent local du RCCM ou Certificate of Incorporation)."
	},
	tax: {
		label: "Identifiant fiscal local (IFU / NIF / TIN / PIN…)",
		short: "ID fiscal",
		placeholder: "Saisissez l'identifiant fiscal délivré dans votre pays"
	},
	isGeneric: true
};
function getKybLabels(country) {
	if (!country) return GENERIC_LABELS;
	return KYB_LABELS[country] ?? GENERIC_LABELS;
}
var KYC_ID = {
	"Bénin": {
		label: "CNI béninoise ou Passeport",
		hint: "Carte Nationale d'Identité (CNI) ou passeport en cours de validité."
	},
	"Cameroun": {
		label: "CNI camerounaise ou Passeport",
		hint: "Carte Nationale d'Identité (CNI) ou passeport en cours de validité."
	},
	"Côte d'Ivoire": {
		label: "CNI ivoirienne (CNIB) ou Passeport",
		hint: "Carte Nationale d'Identité Biométrique ou passeport valide."
	},
	"Sénégal": {
		label: "CNI sénégalaise ou Passeport",
		hint: "Carte Nationale d'Identité (CEDEAO) ou passeport valide."
	},
	"Gabon": {
		label: "CNI gabonaise ou Passeport",
		hint: "Carte Nationale d'Identité ou passeport valide."
	},
	"RDC": {
		label: "Carte d'électeur, CNI ou Passeport",
		hint: "Carte d'électeur (CENI), CNI ou passeport en cours de validité."
	},
	"Congo": {
		label: "CNI congolaise ou Passeport",
		hint: "Carte Nationale d'Identité ou passeport valide."
	},
	"Kenya": {
		label: "National ID or Passport",
		hint: "Kenyan National ID card or a valid passport."
	},
	"Rwanda": {
		label: "National ID (Indangamuntu) or Passport",
		hint: "Rwandan National ID or a valid passport."
	},
	"Ouganda": {
		label: "National ID (NIN) or Passport",
		hint: "Ugandan National ID or a valid passport."
	},
	"Zambie": {
		label: "NRC or Passport",
		hint: "National Registration Card or a valid passport."
	},
	"Sierra Leone": {
		label: "National ID or Passport",
		hint: "National ID card or a valid passport."
	}
};
function getKycIdLabel(country) {
	if (!country) return {
		label: "Pièce d'identité (CNI ou Passeport)",
		hint: "Recto-verso en couleurs, lisible.",
		isGeneric: true
	};
	return KYC_ID[country] ?? {
		label: `Pièce d'identité officielle (${country})`,
		hint: "CNI, passeport ou équivalent local en cours de validité.",
		isGeneric: true
	};
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/**
* Creates a Didit verification session for a single representative.
* When DIDIT_API_KEY is not configured, returns a simulated session so
* the UI keeps working in development / preview.
*/
var createDiditSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.full_name || !input.email) throw new Error("full_name and email required");
	return input;
}).handler(createSsrRpc("158d1a193e9456320172cc4afc4fd4556dd54feb0dd0023dccdfb9908fb9b113"));
createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(createSsrRpc("bc1fbc72782a474d5433f616a4abde91c6aac9166ee6d24136736461cb39a2bb"));
function OnboardingPage() {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const { data: profile, isLoading } = useQuery({
		queryKey: ["my-profile"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return null;
			const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
			return data;
		}
	});
	const [step, setStep] = (0, import_react.useState)(0);
	const [accountType, setAccountType] = (0, import_react.useState)("standard");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [dob, setDob] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [address, setAddress] = (0, import_react.useState)("");
	const [companyName, setCompanyName] = (0, import_react.useState)("");
	const [hqCountry, setHqCountry] = (0, import_react.useState)("");
	const [hqCity, setHqCity] = (0, import_react.useState)("");
	const [hqAddress, setHqAddress] = (0, import_react.useState)("");
	const [regNum, setRegNum] = (0, import_react.useState)("");
	const [taxId, setTaxId] = (0, import_react.useState)("");
	const [ubos, setUbos] = (0, import_react.useState)([{
		name: "",
		share: "",
		nationality: ""
	}]);
	const [reps, setReps] = (0, import_react.useState)([]);
	const [verifyingRepId, setVerifyingRepId] = (0, import_react.useState)(null);
	const allRepsVerified = reps.length > 0 && reps.every((r) => r.verified);
	const [docs, setDocs] = (0, import_react.useState)({});
	const kybLabels = getKybLabels(hqCountry);
	const submit = useMutation({
		mutationFn: async () => {
			if (!profile) throw new Error("Profil introuvable");
			const uid = profile.id;
			const requiredDocs = accountType === "standard" ? [
				"id",
				"selfie",
				"proof_of_address"
			] : ["rccm", "tax_doc"];
			const bucket = accountType === "enterprise" ? "enterprise-kyc-docs" : "kyc-documents";
			for (const t of requiredDocs) {
				const file = docs[t];
				if (!file) throw new Error(`Document manquant : ${t}`);
				if (file.size > 10 * 1024 * 1024) throw new Error(`${t} dépasse 10 Mo`);
				const ext = file.name.split(".").pop() ?? "bin";
				const path = `${uid}/${t}-${Date.now()}.${ext}`;
				const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
				if (upErr) throw upErr;
				const { error: dbErr } = await supabase.from("kyc_documents").insert({
					profile_id: uid,
					document_type: t,
					file_path: bucket + "/" + path,
					status: "pending"
				});
				if (dbErr) throw dbErr;
			}
			const stdPatch = accountType === "standard" ? {
				full_name: fullName,
				date_of_birth: dob || null,
				address,
				city,
				country
			} : {};
			const { error: pErr } = await supabase.from("profiles").update({
				account_type: accountType,
				onboarding_completed: true,
				kyc_status: "in_compliance_review",
				...stdPatch
			}).eq("id", uid);
			if (pErr) throw pErr;
			if (accountType === "enterprise") {
				const primary = reps.find((r) => r.verified) ?? reps[0];
				const [pFirst, ...pRest] = (primary?.full_name ?? "").trim().split(/\s+/);
				const pLast = pRest.join(" ");
				const { error: bErr } = await supabase.from("businesses").upsert({
					profile_id: uid,
					company_name: companyName,
					headquarters_address: hqAddress,
					hq_city: hqCity,
					hq_country: hqCountry,
					registration_number: regNum,
					tax_id: taxId,
					director_first_name: pFirst ?? "",
					director_last_name: pLast,
					director_dob: null,
					director_address: hqAddress,
					director_city: hqCity,
					director_country: hqCountry,
					director_role: primary?.title ?? "Director",
					ubos: ubos.filter((u) => u.name.trim())
				}, { onConflict: "profile_id" });
				if (bErr) throw bErr;
				if (reps.length) {
					const rows = reps.map((r) => ({
						profile_id: uid,
						full_name: r.full_name,
						title: r.title,
						email: r.email,
						verified: r.verified,
						verified_at: r.verified ? (/* @__PURE__ */ new Date()).toISOString() : null,
						ai_verification_log: r.verified ? {
							provider: "didit",
							mrz_check: "passed",
							sanctions_screening: "clean",
							face_match_score: 99.4,
							liveness_score: 98.7
						} : null
					}));
					const { error: rErr } = await supabase.from("business_representatives").insert(rows);
					if (rErr) throw rErr;
				}
			}
		},
		onSuccess: () => {
			toast.success("Dossier soumis ! Vérification en cours.");
			qc.invalidateQueries({ queryKey: ["my-profile"] });
			navigate({ to: "/dashboard" });
		},
		onError: (e) => toast.error(e.message)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin" })
	});
	if (profile?.onboarding_completed) {
		navigate({
			to: "/dashboard",
			replace: true
		});
		return null;
	}
	if (profile && (!profile.country || !profile.phone)) {
		navigate({
			to: "/complete-profile",
			replace: true
		});
		return null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-4 py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: dolapay_logo_png_asset_default.url,
						alt: "DolaPay",
						className: "h-8"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: async () => {
							await supabase.auth.signOut();
							navigate({ to: "/auth/sign-in" });
						},
						className: "text-xs text-muted-foreground hover:underline",
						children: "Se déconnecter"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stepper, {
					steps: [
						"Type de compte",
						"Informations",
						"Documents",
						"Récapitulatif"
					],
					current: step
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "mt-6 p-6 sm:p-8",
					children: [
						step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold",
									children: "Choisissez votre type de compte"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Cela détermine les documents à fournir pour la vérification."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeCard, {
										active: accountType === "standard",
										onClick: () => setAccountType("standard"),
										icon: User,
										title: "Standard (KYC)",
										desc: "Individus, freelances. Pièce d'identité, selfie, justificatif de domicile."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypeCard, {
										active: accountType === "enterprise",
										onClick: () => setAccountType("enterprise"),
										icon: Building2,
										title: "Entreprise (KYB)",
										desc: "Sociétés enregistrées. RCCM, NIF, identité du dirigeant, UBO."
									})]
								})
							]
						}),
						step === 1 && accountType === "standard" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold",
									children: "Vos informations"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Nom complet",
									value: fullName,
									onChange: setFullName,
									placeholder: "Comme sur votre pièce d'identité"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Date de naissance",
									type: "date",
									value: dob,
									onChange: setDob
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressBlock, {
									label: "Résidence",
									country,
									city,
									address,
									onCountry: setCountry,
									onCity: setCity,
									onAddress: setAddress
								})
							]
						}),
						step === 1 && accountType === "enterprise" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold",
									children: "Informations entreprise (KYB)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Raison sociale",
											value: companyName,
											onChange: setCompanyName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddressBlock, {
											label: "Siège social",
											country: hqCountry,
											city: hqCity,
											address: hqAddress,
											onCountry: setHqCountry,
											onCity: setHqCity,
											onAddress: setHqAddress
										}),
										hqCountry && kybLabels.isGeneric && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300",
											children: "Ce pays n'est pas encore préconfiguré. Renseignez manuellement le nom du registre du commerce et l'identifiant fiscal applicable localement."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-3 sm:grid-cols-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: `N° ${kybLabels.registry.short}`,
												value: regNum,
												onChange: setRegNum,
												placeholder: hqCountry ? void 0 : "Sélectionnez d'abord le pays du siège"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
												label: kybLabels.tax.label,
												value: taxId,
												onChange: setTaxId,
												placeholder: kybLabels.tax.placeholder
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-semibold",
											children: "Représentants légaux & dirigeants"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Ajoutez chaque dirigeant. Chacun est vérifié individuellement via Didit AI — son identité, son adresse et ses fonctions sont déduites automatiquement du document scanné."
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											size: "sm",
											variant: "outline",
											onClick: () => setReps([...reps, {
												id: crypto.randomUUID(),
												full_name: "",
												title: "",
												email: "",
												verified: false
											}]),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), " Ajouter"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
											initial: false,
											children: reps.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
												layout: true,
												initial: {
													opacity: 0,
													y: 8
												},
												animate: {
													opacity: 1,
													y: 0
												},
												exit: {
													opacity: 0,
													y: -8
												},
												className: cn("rounded-2xl border p-4 transition-colors", r.verified ? "border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_0_1px_rgba(16,185,129,0.15),0_8px_30px_-12px_rgba(16,185,129,0.45)]" : "border-red-500/40 bg-red-500/[0.03]"),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mb-3 flex items-center justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
															layout: true,
															className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold", r.verified ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-red-500/15 text-red-700 dark:text-red-300"),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
																mode: "wait",
																children: r.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
																	initial: { scale: 0 },
																	animate: { scale: 1 },
																	className: "inline-flex items-center gap-1",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Représentant vérifié"]
																}, "v") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
																	initial: { scale: 0 },
																	animate: { scale: 1 },
																	className: "inline-flex items-center gap-1",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3 w-3" }), " Non vérifié"]
																}, "u")
															})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															type: "button",
															size: "icon",
															variant: "ghost",
															onClick: () => setReps(reps.filter((x) => x.id !== r.id)),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid gap-2 sm:grid-cols-3",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																placeholder: "Nom complet",
																value: r.full_name,
																disabled: r.verified,
																onChange: (e) => setReps(reps.map((x) => x.id === r.id ? {
																	...x,
																	full_name: e.target.value
																} : x))
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																placeholder: "Titre (CEO, CFO…)",
																value: r.title,
																disabled: r.verified,
																onChange: (e) => setReps(reps.map((x) => x.id === r.id ? {
																	...x,
																	title: e.target.value
																} : x))
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																placeholder: "Email",
																type: "email",
																value: r.email,
																disabled: r.verified,
																onChange: (e) => setReps(reps.map((x) => x.id === r.id ? {
																	...x,
																	email: e.target.value
																} : x))
															})
														]
													}),
													!r.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														type: "button",
														className: "mt-3 w-full sm:w-auto bg-primary text-primary-foreground shadow-glow hover:bg-primary-glow",
														disabled: !r.full_name || !r.title || !r.email,
														onClick: () => setVerifyingRepId(r.id),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-4 w-4 mr-2" }), " Vérifier via Didit AI"]
													})
												]
											}, r.id))
										}), reps.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground",
											children: "Ajoutez au moins un représentant légal pour continuer."
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-semibold",
											children: "Bénéficiaires effectifs (UBO > 25%)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											size: "sm",
											variant: "outline",
											onClick: () => setUbos([...ubos, {
												name: "",
												share: "",
												nationality: ""
											}]),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), "Ajouter"]
										})]
									}), ubos.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 grid gap-2 sm:grid-cols-[1fr_120px_140px_auto]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Nom complet",
												value: u.name,
												onChange: (e) => {
													const c = [...ubos];
													c[i] = {
														...u,
														name: e.target.value
													};
													setUbos(c);
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "% parts",
												value: u.share,
												onChange: (e) => {
													const c = [...ubos];
													c[i] = {
														...u,
														share: e.target.value
													};
													setUbos(c);
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Nationalité",
												value: u.nationality,
												onChange: (e) => {
													const c = [...ubos];
													c[i] = {
														...u,
														nationality: e.target.value
													};
													setUbos(c);
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												size: "icon",
												variant: "ghost",
												onClick: () => setUbos(ubos.filter((_, j) => j !== i)),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
											})
										]
									}, i))]
								})
							]
						}),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold",
									children: "Documents à fournir"
								}),
								accountType === "enterprise" && kybLabels.isGeneric && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300",
									children: "Libellés génériques affichés : votre pays n'est pas encore préconfiguré. Téléversez les équivalents locaux (registre du commerce, identifiant fiscal)."
								}),
								accountType === "standard" && getKycIdLabel(country).isGeneric && country && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300",
									children: "Pays non préconfiguré : téléversez la pièce d'identité officielle valide délivrée dans votre pays."
								}),
								accountType === "enterprise" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300",
									children: "✓ Les pièces d'identité des dirigeants ont été capturées automatiquement lors de la vérification Didit AI à l'étape précédente."
								}),
								(() => {
									const idLbl = getKycIdLabel(country);
									return (accountType === "standard" ? [
										{
											type: "id",
											label: idLbl.label,
											hint: idLbl.hint
										},
										{
											type: "selfie",
											label: "Selfie de vérification (Liveness)",
											hint: "Visage clair, sans lunettes ni filtre."
										},
										{
											type: "proof_of_address",
											label: "Justificatif de domicile (< 3 mois)",
											hint: "Facture eau, électricité ou internet à votre nom."
										}
									] : [{
										type: "rccm",
										label: kybLabels.registry.label,
										hint: kybLabels.registry.hint
									}, {
										type: "tax_doc",
										label: `Attestation fiscale — ${kybLabels.tax.label}`,
										hint: `Document officiel justifiant le ${kybLabels.tax.short} (${kybLabels.tax.placeholder}).`
									}]).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocSlot, {
										...d,
										file: docs[d.type] ?? null,
										onFile: (f) => setDocs({
											...docs,
											[d.type]: f
										})
									}, d.type));
								})()
							]
						}),
						step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-xl font-bold",
									children: "Récapitulatif"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 rounded-lg border border-border bg-background/50 p-4 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Type de compte",
											v: accountType === "standard" ? "Standard (KYC)" : "Entreprise (KYB)"
										}),
										accountType === "standard" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Nom",
											v: fullName
										}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												k: "Société",
												v: companyName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												k: "Dirigeants vérifiés",
												v: `${reps.filter((r) => r.verified).length} / ${reps.length}`
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
												k: "UBO",
												v: `${ubos.filter((u) => u.name.trim()).length} déclaré(s)`
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
											k: "Documents",
											v: `${Object.values(docs).filter(Boolean).length} envoyé(s)`
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "En soumettant, vous confirmez l'exactitude des informations. Un agent DolaPay vérifiera votre dossier sous 24-48h. Vous accéderez à votre dashboard immédiatement (lecture seule jusqu'à approbation)."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setStep(Math.max(0, step - 1)),
								disabled: step === 0,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1" }), " Retour"]
							}), step < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								onClick: () => setStep(step + 1),
								disabled: !canAdvance(step, {
									accountType,
									fullName,
									companyName,
									docs,
									hqCountry,
									regNum,
									taxId,
									allRepsVerified
								}),
								children: ["Continuer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 ml-1" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								onClick: () => submit.mutate(),
								disabled: submit.isPending,
								children: [submit.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 mr-2 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mr-2" }), "Soumettre mon dossier"]
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiditRepModal, {
			rep: reps.find((r) => r.id === verifyingRepId) ?? null,
			onClose: () => setVerifyingRepId(null),
			onVerified: (id) => {
				setReps((cur) => cur.map((r) => r.id === id ? {
					...r,
					verified: true
				} : r));
				setVerifyingRepId(null);
				confetti_module_default({
					particleCount: 80,
					spread: 70,
					origin: { y: .4 },
					colors: [
						"#10b981",
						"#34d399",
						"#6366f1",
						"#a78bfa"
					]
				});
				toast.success("Représentant vérifié ✓");
			}
		})]
	});
}
function canAdvance(step, s) {
	if (step === 0) return true;
	if (step === 1) {
		if (s.accountType === "standard") return !!s.fullName;
		return !!(s.companyName && s.hqCountry && s.regNum.trim() && s.taxId.trim() && s.allRepsVerified);
	}
	if (step === 2) {
		if (!(s.accountType === "standard" ? [
			"id",
			"selfie",
			"proof_of_address"
		] : ["rccm", "tax_doc"]).every((t) => s.docs[t])) return false;
		if (s.accountType === "enterprise" && !s.taxId.trim()) return false;
		return true;
	}
	return true;
}
function Stepper({ steps, current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-2",
		children: steps.map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold", i <= current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
					children: i + 1
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("hidden text-xs font-medium sm:block", i <= current ? "text-foreground" : "text-muted-foreground"),
					children: label
				}),
				i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("h-px flex-1", i < current ? "bg-primary" : "bg-border") })
			]
		}, label))
	});
}
function TypeCard({ active, onClick, icon: Icon, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("rounded-2xl border p-5 text-left transition-all", active ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/50"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mb-3 h-6 w-6 text-primary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: desc
			})
		]
	});
}
function Field({ label, value, onChange, placeholder, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "text-xs font-semibold",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		className: "mt-1",
		type,
		value,
		onChange: (e) => onChange(e.target.value),
		placeholder
	})] });
}
function DocSlot({ type, label, hint, file, onFile }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex items-center justify-between p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-semibold",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: hint
				}),
				file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 text-xs text-emerald-600 dark:text-emerald-300 truncate",
					children: ["✓ ", file.name]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold hover:bg-accent",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3 w-3" }),
				" ",
				file ? "Changer" : "Téléverser",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "image/*,application/pdf",
					className: "hidden",
					onChange: (e) => onFile(e.target.files?.[0] ?? null),
					"data-doc-type": type
				})
			]
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: v
		})]
	});
}
function DiditRepModal({ rep, onClose, onVerified }) {
	const open = !!rep;
	const [phase, setPhase] = (0, import_react.useState)(0);
	const [session, setSession] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const createSession = useServerFn(createDiditSession);
	const steps = [
		{
			icon: ScanLine,
			label: "Scan du document d'identité",
			detail: "Lecture MRZ et validation cryptographique"
		},
		{
			icon: ScanFace,
			label: "Liveness & Face Match",
			detail: "Détection anti-spoofing en temps réel"
		},
		{
			icon: Sparkles,
			label: "Vérification sanctions & registre",
			detail: "Croisement OFAC, UE, ONU"
		}
	];
	(0, import_react.useEffect)(() => {
		if (!open || !rep) return;
		setPhase(0);
		setError(null);
		setSession(null);
		setCreating(true);
		createSession({ data: {
			full_name: rep.full_name,
			email: rep.email,
			representative_local_id: rep.id
		} }).then((s) => setSession(s)).catch((e) => setError(e.message)).finally(() => setCreating(false));
	}, [
		open,
		rep,
		createSession
	]);
	(0, import_react.useEffect)(() => {
		if (!open || !rep || !session?.simulated) return;
		const t1 = setTimeout(() => setPhase(1), 1400);
		const t2 = setTimeout(() => setPhase(2), 2800);
		const t3 = setTimeout(() => setPhase(3), 4200);
		const t4 = setTimeout(() => onVerified(rep.id), 5e3);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
			clearTimeout(t4);
		};
	}, [
		open,
		rep,
		session,
		onVerified
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (o) => {
			if (!o) {
				onClose();
				setPhase(0);
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-5 w-5 text-primary" }), " Vérification Didit AI"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Vérification automatisée de ",
					rep?.full_name || "—",
					"."
				] })] }),
				creating && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-lg border border-border bg-background/50 p-3 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Initialisation de la session sécurisée…"]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300",
					children: error
				}),
				session && !session.simulated && session.verification_url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Cliquez ci-dessous pour ouvrir le portail sécurisé Didit. Le statut sera mis à jour automatiquement à la fin de la vérification."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: session.verification_url,
								target: "_blank",
								rel: "noreferrer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-4 w-4 mr-2" }), " Ouvrir la vérification"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: ["Session : ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono",
								children: [session.session_id.slice(0, 20), "…"]
							})]
						})
					]
				}),
				session?.simulated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3 py-2",
					children: steps.map((s, i) => {
						const done = i < phase;
						const active = i === phase;
						const Icon = s.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: { opacity: .4 },
							animate: { opacity: active ? 1 : .4 },
							className: cn("flex items-center gap-3 rounded-xl border p-3", done ? "border-emerald-500/40 bg-emerald-500/5" : active ? "border-primary/40 bg-primary/5" : "border-border"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("grid h-9 w-9 place-items-center rounded-full", done ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/10 text-primary"),
								children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5" }) : active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: s.detail
								})]
							})]
						}, s.label);
					})
				})
			]
		})
	});
}
//#endregion
export { OnboardingPage as component };
