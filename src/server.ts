import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  const err = consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`);
  console.error(err);
  return new Response(renderErrorPage(err), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      
      // Serve static assets normally
      if (!url.pathname.startsWith('/_build') && !url.pathname.startsWith('/assets')) {
        let newPathname = url.pathname;
        const hn = url.hostname;
        
        if (hn.startsWith('docs') && !url.pathname.startsWith('/developers')) {
          newPathname = '/developers' + (url.pathname === '/' ? '' : url.pathname);
        } else if (hn.startsWith('dashboard') && !url.pathname.startsWith('/dashboard') && !url.pathname.startsWith('/auth')) {
          newPathname = '/dashboard' + (url.pathname === '/' ? '' : url.pathname);
        }
        
        if (newPathname !== url.pathname) {
          url.pathname = newPathname;
          request = new Request(url.toString(), request);
        }
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      if (error instanceof Response) return error;
      if (error != null && typeof error === "object") {
        if ("options" in error || "isRedirect" in error) throw error;
        const st = (error as any).status ?? (error as any).statusCode;
        if (typeof st === "number" && st < 500) throw error;
      }
      console.error(error);
      const actualErr = (error != null && typeof error === "object" && "cause" in error && (error as any).cause) ? (error as any).cause : error;
      return new Response(renderErrorPage(actualErr), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
