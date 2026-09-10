import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import {
  readJsonBody,
  requireString,
  optionalMobile,
  requirePositiveAmount,
  optionalString,
  requireEmail,
  optionalBoolean,
  ValidationError,
} from "../lib/validate";
import { getSessionUser } from "../lib/session";
import { notifyDonorContribution } from "../lib/emails";
import type { Env } from "../lib/env";

// POST /celebrations/:slug/contributions
// Records donor intent as a pending contribution. No payment gateway is
// wired up yet (docs/plan.md "Payments Plan" lists this as an open decision),
// so payment_status stays "pending" here; moving it to "succeeded" is meant
// to happen via a future gateway webhook, not this route.
export async function submitContribution(slug: string, request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  try {
    const body = await readJsonBody(request);

    const donorName = requireString(body.donorName, "donorName");
    // Email required, mobile optional -- the reverse of how this started.
    // Email is the channel this platform actually uses: the donor gets their
    // confirmation and (once payments exist) their payment instructions by
    // email, so a contribution without one leaves us unable to tell the donor
    // how to complete it. Mobile is a second contact channel for someone we
    // can already reach, and every required field here costs contributions.
    const donorEmail = requireEmail(body.donorEmail, "donorEmail");
    const donorMobile = optionalMobile(body.donorMobile, "donorMobile");
    const pan = optionalString(body.pan, "pan", { maxLength: 20 });
    const amount = requirePositiveAmount(body.amount);
    const message = optionalString(body.message, "message", { maxLength: 1000 });
    const showName = optionalBoolean(body.showName, true);
    const showAmount = optionalBoolean(body.showAmount, false);
    const anonymous = optionalBoolean(body.anonymous, false);

    const supabase = getSupabaseClient(env);

    // Best-effort: attach the signed-in donor's id when present, but never
    // gate this route on it -- guest (unauthenticated) contributions are
    // expected and must keep working.
    const donor = await getSessionUser(request, env);

    const { data: celebration, error: celebrationError } = await supabase
      .from("celebrations")
      .select("id, status, celebration_type, charity:charities!charity_id(name)")
      .eq("slug", slug)
      .maybeSingle();

    if (celebrationError || !celebration) {
      return errorResponse("Celebration not found", env, 404);
    }
    if (celebration.status !== "published") {
      return errorResponse("This celebration is not currently accepting contributions", env, 409);
    }

    const { data: contribution, error: contributionError } = await supabase
      .from("contributions")
      .insert({
        celebration_id: celebration.id,
        donor_id: donor?.id ?? null,
        donor_name: donorName,
        donor_mobile: donorMobile ?? null,
        donor_email: donorEmail,
        pan,
        amount,
        message,
        show_name: showName,
        show_amount: showAmount,
        anonymous,
        payment_status: "pending",
      })
      .select("id, payment_status")
      .single();

    if (contributionError || !contribution) {
      return errorResponse("Could not record contribution", env, 500);
    }

    // Notification only -- the contribution row is already committed, so the
    // send must not affect the response the donor gets.
    //
    // The host is deliberately NOT emailed per contribution (product decision
    // 2026-09-10): the public celebration page lists contributors, so that is
    // the host's channel. Revisit with a digest if hosts ask for one.
    const charity = (Array.isArray(celebration.charity) ? celebration.charity[0] : celebration.charity) as
      | { name: string }
      | undefined;
    const charityName = charity?.name ?? "the charity";
    const celebrationType = (celebration.celebration_type as string) ?? "celebration";

    notifyDonorContribution(env, ctx, {
      donorEmail,
      donorName,
      amount,
      charityName,
      celebrationType,
    });

    return json({ contribution }, env, 201);
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}
