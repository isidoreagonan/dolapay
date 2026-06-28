import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-9EjmF9OT.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-Cacr74nd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/didit.functions-Du9YDScL.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var DIDIT_BASE = "https://verification.didit.me/v1";
/**
* Creates a Didit verification session for a single representative.
* When DIDIT_API_KEY is not configured, returns a simulated session so
* the UI keeps working in development / preview.
*/
var createDiditSession_createServerFn_handler = createServerRpc({
	id: "158d1a193e9456320172cc4afc4fd4556dd54feb0dd0023dccdfb9908fb9b113",
	name: "createDiditSession",
	filename: "src/lib/didit.functions.ts"
}, (opts) => createDiditSession.__executeServer(opts));
var createDiditSession = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.full_name || !input.email) throw new Error("full_name and email required");
	return input;
}).handler(createDiditSession_createServerFn_handler, async ({ data, context }) => {
	const apiKey = process.env.DIDIT_API_KEY;
	const workflowId = process.env.DIDIT_WORKFLOW_ID;
	if (!apiKey || !workflowId) return {
		simulated: true,
		session_id: `sim_${crypto.randomUUID()}`,
		verification_url: null,
		status: "pending"
	};
	const callbackUrl = `${process.env.PUBLIC_SITE_URL ?? ""}/api/public/didit-webhook`;
	const res = await fetch(`${DIDIT_BASE}/session/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": apiKey
		},
		body: JSON.stringify({
			workflow_id: workflowId,
			callback: callbackUrl,
			vendor_data: JSON.stringify({
				profile_id: context.userId,
				rep_local_id: data.representative_local_id
			}),
			contact_details: {
				email: data.email,
				email_lang: "fr"
			}
		})
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Didit session creation failed: ${err.slice(0, 200)}`);
	}
	const json = await res.json();
	return {
		simulated: false,
		session_id: json.session_id,
		verification_url: json.url,
		status: json.status
	};
});
var markRepresentativeSimVerified_createServerFn_handler = createServerRpc({
	id: "bc1fbc72782a474d5433f616a4abde91c6aac9166ee6d24136736461cb39a2bb",
	name: "markRepresentativeSimVerified",
	filename: "src/lib/didit.functions.ts"
}, (opts) => markRepresentativeSimVerified.__executeServer(opts));
var markRepresentativeSimVerified = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(markRepresentativeSimVerified_createServerFn_handler, async ({ data, context }) => {
	if (!data.session_id.startsWith("sim_")) throw new Error("Only simulation sessions may be auto-verified");
	return {
		ok: true,
		profile_id: context.userId
	};
});
//#endregion
export { createDiditSession_createServerFn_handler, markRepresentativeSimVerified_createServerFn_handler };
