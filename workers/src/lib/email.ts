import type { Env } from "./env";

// Sends via Resend's HTTP API (https://resend.com/api-reference/emails/send-email)
// with a plain fetch call rather than pulling in the `resend` npm package --
// one endpoint doesn't justify a dependency.
//
// Sending addresses need no setup anywhere: any local part at a verified
// domain works immediately, so the addresses below are plain constants rather
// than provisioned accounts. Only *receiving* an address requires a mailbox
// provider, which is a separate concern from this file (see docs/plan.md
// "Email Delivery").
const SENDERS = {
  // Codes a user is actively waiting on. Kept on its own address so a
  // deliverability problem with celebration mail can never affect sign-in.
  auth: "GiftHappiness <noreply@{domain}>",
  // Celebration lifecycle mail to hosts and donors.
  celebrations: "GiftHappiness <celebrations@{domain}>",
  // Internal admin alerts. Separate address so admins can filter them.
  alerts: "GiftHappiness Alerts <alerts@{domain}>",
} as const;

export type SenderKey = keyof typeof SENDERS;

function fromAddress(env: Env, sender: SenderKey): string {
  return SENDERS[sender].replace("{domain}", env.EMAIL_DOMAIN);
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  sender?: SenderKey;
}

// Returns true only when Resend accepted the message. On failure the response
// body is logged -- without it a delivery problem is invisible in Worker logs,
// which is exactly how the sandbox-sender issue went unnoticed for weeks.
//
// Note this cannot detect a *silently dropped* send (Resend returns 200 and
// drops the message when the sender domain isn't verified). Verifying the
// domain is the only fix for that class of failure.
export async function sendEmail(env: Env, options: SendEmailOptions): Promise<boolean> {
  const { to, subject, text, html, sender = "celebrations" } = options;

  const payload: Record<string, unknown> = {
    from: fromAddress(env, sender),
    to: [to],
    subject,
    text,
    reply_to: env.EMAIL_REPLY_TO,
  };
  if (html) payload.html = html;

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error(`[email] network error sending "${subject}":`, err);
    return false;
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "<unreadable body>");
    console.error(`[email] Resend rejected "${subject}" (${response.status}): ${body}`);
    return false;
  }

  return true;
}

// Fire-and-forget send for *notifications* -- mail that reports on work the
// request already committed (a contribution row, a status change). These must
// never fail the request: the write already succeeded, so surfacing a mail
// error would tell the user their action didn't work when it did.
//
// Contrast with sign-in/verification codes, which stay synchronous and DO fail
// the request -- a user who never receives the code cannot continue, so a
// silent success there would be worse than an error.
export function sendNotification(env: Env, ctx: ExecutionContext, options: SendEmailOptions): void {
  ctx.waitUntil(
    sendEmail(env, options).then((sent) => {
      if (!sent) {
        console.error(`[email] notification "${options.subject}" to ${options.to} was not delivered`);
      }
    }),
  );
}
