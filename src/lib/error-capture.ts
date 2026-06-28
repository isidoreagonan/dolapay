// Captures the original Error out-of-band so server.ts can recover the stack
// when h3 has already swallowed the throw into a generic 500 Response.

let lastCapturedError: { error: unknown; at: number } | undefined;
const TTL_MS = 10_000;

export function recordError(error: unknown) {
  if (error != null && typeof error === "object") {
    if ("statusCode" in error || "status" in error || "isRedirect" in error || "options" in error) {
      return;
    }
  }
  lastCapturedError = { error, at: Date.now() };
}

if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => recordError((event as ErrorEvent).error ?? event));
  globalThis.addEventListener("unhandledrejection", (event) =>
    recordError((event as PromiseRejectionEvent).reason),
  );
}

if (typeof process !== "undefined" && typeof process.on === "function") {
  process.on("uncaughtException", (err) => recordError(err));
  process.on("unhandledRejection", (reason) => recordError(reason));
}

const origConsoleError = console.error;
console.error = (...args: any[]) => {
  origConsoleError(...args);
  for (const arg of args) {
    if (arg && (arg instanceof Error || (typeof arg === "object" && (arg.stack || arg.message)))) {
      recordError(arg);
      break;
    }
  }
};

export function consumeLastCapturedError(): unknown {
  if (!lastCapturedError) return undefined;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = undefined;
    return undefined;
  }
  const { error } = lastCapturedError;
  lastCapturedError = undefined;
  return error;
}
