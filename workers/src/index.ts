import type { Env } from "./lib/env";
import { corsHeaders, errorResponse, json } from "./lib/response";
import { createCelebration, getCelebration } from "./routes/celebrations";
import { listCharities, getCharityBySlug } from "./routes/charities";
import { submitContribution } from "./routes/contributions";
import { requestVerification, confirmVerification } from "./routes/verification";
import { requestLogin, confirmLogin, getMe, logout } from "./routes/auth";
import { listMyCelebrations, listMyContributions } from "./routes/me";
import { listCharitiesAdmin, createCharity, updateCharity } from "./routes/admin";
import { uploadCharityLogo, uploadCharityHeader } from "./routes/uploads";

// Hand-rolled routing: the route count here doesn't justify pulling in a
// router library. Revisit if this grows past a dozen or so routes.
const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const method = request.method;

    if (method === "GET" && segments.length === 1 && segments[0] === "health") {
      return json({ status: "ok" }, env);
    }

    // POST /celebrations
    if (method === "POST" && segments.length === 1 && segments[0] === "celebrations") {
      return createCelebration(request, env);
    }

    // GET /celebrations/:slug
    if (method === "GET" && segments.length === 2 && segments[0] === "celebrations") {
      return getCelebration(segments[1], env);
    }

    // GET /charities
    if (method === "GET" && segments.length === 1 && segments[0] === "charities") {
      return listCharities(env);
    }

    // GET /charities/:slug
    if (method === "GET" && segments.length === 2 && segments[0] === "charities") {
      return getCharityBySlug(segments[1], env);
    }

    // POST /celebrations/:slug/contributions
    if (method === "POST" && segments.length === 3 && segments[0] === "celebrations" && segments[2] === "contributions") {
      return submitContribution(segments[1], request, env);
    }

    // POST /verify/request
    if (method === "POST" && segments.length === 2 && segments[0] === "verify" && segments[1] === "request") {
      return requestVerification(request, env);
    }

    // POST /verify/confirm
    if (method === "POST" && segments.length === 2 && segments[0] === "verify" && segments[1] === "confirm") {
      return confirmVerification(request, env);
    }

    // POST /auth/request
    if (method === "POST" && segments.length === 2 && segments[0] === "auth" && segments[1] === "request") {
      return requestLogin(request, env);
    }

    // POST /auth/confirm
    if (method === "POST" && segments.length === 2 && segments[0] === "auth" && segments[1] === "confirm") {
      return confirmLogin(request, env);
    }

    // GET /auth/me
    if (method === "GET" && segments.length === 2 && segments[0] === "auth" && segments[1] === "me") {
      return getMe(request, env);
    }

    // POST /auth/logout
    if (method === "POST" && segments.length === 2 && segments[0] === "auth" && segments[1] === "logout") {
      return logout(request, env);
    }

    // GET /me/celebrations
    if (method === "GET" && segments.length === 2 && segments[0] === "me" && segments[1] === "celebrations") {
      return listMyCelebrations(request, env);
    }

    // GET /me/contributions
    if (method === "GET" && segments.length === 2 && segments[0] === "me" && segments[1] === "contributions") {
      return listMyContributions(request, env);
    }

    // GET/POST /admin/charities, PATCH /admin/charities/:slug
    if (segments[0] === "admin" && segments[1] === "charities") {
      if (method === "GET" && segments.length === 2) return listCharitiesAdmin(request, env);
      if (method === "POST" && segments.length === 2) return createCharity(request, env);
      if (method === "PATCH" && segments.length === 3) return updateCharity(segments[2], request, env);
    }

    // POST /admin/uploads/charity-logo
    if (method === "POST" && segments.length === 3 && segments[0] === "admin" && segments[1] === "uploads" && segments[2] === "charity-logo") {
      return uploadCharityLogo(request, env);
    }

    // POST /admin/uploads/charity-header
    if (method === "POST" && segments.length === 3 && segments[0] === "admin" && segments[1] === "uploads" && segments[2] === "charity-header") {
      return uploadCharityHeader(request, env);
    }

    return errorResponse("Not found", env, 404);
  },
};

export default worker;
