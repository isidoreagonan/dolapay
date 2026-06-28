import { createStart, createMiddleware } from "@tanstack/react-start";
import { isRedirect, isNotFound } from "@tanstack/react-router";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (isRedirect(error) || isNotFound(error) || error instanceof Response) {
      throw error;
    }
    if (error != null && typeof error === "object") {
      if ("isRedirect" in error || "options" in error) throw error;
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
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware],
}));
