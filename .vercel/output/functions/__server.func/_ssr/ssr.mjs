//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 1e4;
function recordError(error) {
	if (error != null && typeof error === "object") {
		if ("statusCode" in error || "status" in error || "isRedirect" in error || "options" in error) return;
	}
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => recordError(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => recordError(event.reason));
}
if (typeof process !== "undefined" && typeof process.on === "function") {
	process.on("uncaughtException", (err) => recordError(err));
	process.on("unhandledRejection", (reason) => recordError(reason));
}
var origConsoleError = console.error;
console.error = (...args) => {
	origConsoleError(...args);
	for (const arg of args) if (arg && (arg instanceof Error || typeof arg === "object" && (arg.stack || arg.message))) {
		recordError(arg);
		break;
	}
};
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage(error) {
	let debugDetails = "";
	if (error) {
		const stack = error?.stack || error?.message || (typeof error === "string" ? error : JSON.stringify(error, null, 2));
		debugDetails = `<div style="margin-top:1.5rem;text-align:left;background:#fee2e2;color:#991b1b;padding:1rem;border-radius:0.375rem;font-family:monospace;font-size:12px;overflow:auto;max-height:300px;border:1px solid #f87171;"><b>Détails de l'erreur Vercel :</b><pre style="margin:0;white-space:pre-wrap;">${String(stack || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></div>`;
	}
	return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Cette page n'a pas pu être chargée</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 36rem; width: 100%; text-align: center; padding: 2rem; background: #fff; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-top: 1.5rem; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Cette page n'a pas pu être chargée</h1>
      <p>Un problème est survenu lors du rendu serveur sur Vercel.</p>
      ${debugDetails}
      <div class="actions">
        <button class="primary" onclick="location.reload()">Réessayer</button>
        <a class="secondary" href="/">Retour à l'accueil</a>
      </div>
    </div>
  </body>
</html>`;
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-DC9Rodaz.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!body.includes("\"unhandled\":true") || !body.includes("\"message\":\"HTTPError\"")) return response;
	const err = consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`);
	console.error(err);
	return new Response(renderErrorPage(err), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
var server_default = { async fetch(request, env, ctx) {
	try {
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		if (error instanceof Response) return error;
		if (error != null && typeof error === "object" && ("options" in error || "isRedirect" in error || "statusCode" in error || "status" in error)) throw error;
		console.error(error);
		return new Response(renderErrorPage(error), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as t };
