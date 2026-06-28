import { n as supabase } from "./client-DWb0N0jk.mjs";
import { N as isNotFound, O as isRedirect } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as createStart, t as createMiddleware } from "./createStart-Dt05N14y.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/start-CfWm78kk.js
var attachSupabaseAuth = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	return next({ headers: token ? { Authorization: `Bearer ${token}` } : {} });
});
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (isRedirect(error) || isNotFound(error) || error instanceof Response) throw error;
		if (error != null && typeof error === "object") {
			if ("isRedirect" in error || "options" in error) throw error;
			const st = error.status ?? error.statusCode;
			if (typeof st === "number" && st < 500) throw error;
		}
		console.error(error);
		const actualErr = error != null && typeof error === "object" && "cause" in error && error.cause ? error.cause : error;
		return new Response(renderErrorPage(actualErr), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var startInstance = createStart(() => ({
	functionMiddleware: [attachSupabaseAuth],
	requestMiddleware: [errorMiddleware]
}));
//#endregion
export { startInstance };
