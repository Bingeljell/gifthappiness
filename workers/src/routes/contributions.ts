import { getSupabaseClient } from "../lib/supabase";
import { json, errorResponse } from "../lib/response";
import {
  readJsonBody,
  requireString,
  requireMobile,
  requirePositiveAmount,
  optionalString,
  optionalBoolean,
  ValidationError,
} from "../lib/validate";
import type { Env } from "../lib/env";

// POST /celebrations/:slug/contributions
// Records donor intent as a pending contribution. No payment gateway is
// wired up yet (docs/plan.md "Payments Plan" lists this as an open decision),
// so payment_status stays "pending" here; moving it to "succeeded" is meant
// to happen via a future gateway webhook, not this route.
export async function submitContribution(slug: string, request: Request, env: Env): Promise<Response> {
  try {
    const body = await readJsonBody(request);

    const donorName = requireString(body.donorName, "donorName");
    const donorMobile = requireMobile(body.donorMobile, "donorMobile");
    const donorEmail = optionalString(body.donorEmail, "donorEmail");
    const pan = optionalString(body.pan, "pan", { maxLength: 20 });
    const amount = requirePositiveAmount(body.amount);
    const message = optionalString(body.message, "message", { maxLength: 1000 });
    const showName = optionalBoolean(body.showName, true);
    const showAmount = optionalBoolean(body.showAmount, false);
    const anonymous = optionalBoolean(body.anonymous, false);

    const supabase = getSupabaseClient(env);

    const { data: celebration, error: celebrationError } = await supabase
      .from("celebrations")
      .select("id, status")
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
        donor_name: donorName,
        donor_mobile: donorMobile,
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

    return json(
      {
        contribution,
        note: "Payment gateway integration is not live yet; this contribution is recorded as pending.",
      },
      env,
      201,
    );
  } catch (err) {
    if (err instanceof ValidationError) {
      return errorResponse(err.message, env, 422);
    }
    return errorResponse("Unexpected error", env, 500);
  }
}
