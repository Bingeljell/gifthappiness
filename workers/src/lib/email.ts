import type { Env } from "./env";

// Sends via Resend's HTTP API (https://resend.com/api-reference/emails/send-email)
// with a plain fetch call rather than pulling in the `resend` npm package --
// one endpoint doesn't justify a dependency. Uses Resend's shared sandbox
// sender until gifthappiness.com is verified as a sending domain there; until
// then Resend only delivers to the email address on the Resend account
// itself, so end-to-end tests must send to that address.
const FROM_ADDRESS = "GiftHappiness <onboarding@resend.dev>";

export async function sendEmail(env: Env, to: string, subject: string, text: string): Promise<boolean> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, text }),
  });

  return response.ok;
}
