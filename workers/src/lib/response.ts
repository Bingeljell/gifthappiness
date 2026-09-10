import type { Env } from "./env";

// ALLOWED_ORIGIN holds a comma-separated list. It stayed singular in name so
// the existing Worker var didn't need renaming; a single value is still valid
// and behaves exactly as before.
//
// Multi-origin matters because CORS has no wildcard-with-credentials and the
// browser needs the header echoed back as one exact origin. Supporting a list
// is what makes the custom-domain cutover zero-downtime: gifthappiness.org and
// gifthappiness.pages.dev are both valid at once, so neither breaks while DNS
// propagates. It also unblocks Pages preview deployments, previously
// CORS-blocked (a known gap in docs/plan.md Phase 5).
function allowedOrigins(env: Env): string[] {
  return env.ALLOWED_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
}

// Returns the caller's origin when it's allowed, otherwise the first
// configured origin. Never echoes an arbitrary Origin header back -- doing so
// would defeat CORS entirely by making every site a permitted caller.
export function resolveOrigin(request: Request, env: Env): string {
  const origins = allowedOrigins(env);
  const requestOrigin = request.headers.get("Origin");

  if (requestOrigin && origins.includes(requestOrigin)) {
    return requestOrigin;
  }
  return origins[0] ?? "";
}

export function corsHeaders(env: Env, request?: Request): Record<string, string> {
  const origins = allowedOrigins(env);
  return {
    "Access-Control-Allow-Origin": request ? resolveOrigin(request, env) : (origins[0] ?? ""),
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    // Required whenever the allowed origin varies by request, or a shared
    // cache could serve one origin's response to another origin.
    Vary: "Origin",
  };
}

// json()/errorResponse() are called from route handlers that don't hold the
// Request, so they emit the default origin. withCors() then corrects it once,
// at the single point every response passes through (see src/index.ts) --
// cheaper than threading the Request through every call site.
export function withCors(request: Request, env: Env, response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", resolveOrigin(request, env));
  headers.set("Vary", "Origin");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function json(data: unknown, env: Env, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(env),
    },
  });
}

export function errorResponse(message: string, env: Env, status = 400): Response {
  return json({ error: message }, env, status);
}
