import { layout, plainText, type LayoutOptions } from "./emailTemplate";
import { sendEmail, sendNotification } from "./email";
import { getSupabaseClient } from "./supabase";
import type { Env } from "./env";

// One module holding every outbound email's copy, so wording can be reviewed
// in a single place instead of being scattered across route handlers.

function build(options: LayoutOptions) {
  return { html: layout(options), text: plainText(options) };
}

function formatAmount(amount: number | string): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value)) return String(amount);
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// ---------------------------------------------------------------------------
// Codes (synchronous -- the caller must fail the request if these don't send)
// ---------------------------------------------------------------------------

export async function sendVerificationCode(
  env: Env,
  to: string,
  code: string,
  ttlMinutes: number,
): Promise<boolean> {
  const content = build({
    preheader: `Your verification code is ${code}`,
    heading: "Verify your email",
    paragraphs: [
      `Your GiftHappiness verification code is ${code}.`,
      `It expires in ${ttlMinutes} minutes. If you didn't request this, you can safely ignore this email.`,
    ],
    footerNote: "This code was requested while setting up a celebration on GiftHappiness.",
  });

  return sendEmail(env, {
    to,
    subject: "Your GiftHappiness verification code",
    sender: "auth",
    ...content,
  });
}

export async function sendSignInCode(
  env: Env,
  to: string,
  code: string,
  ttlMinutes: number,
): Promise<boolean> {
  const content = build({
    preheader: `Your sign-in code is ${code}`,
    heading: "Your sign-in code",
    paragraphs: [
      `Your GiftHappiness sign-in code is ${code}.`,
      `It expires in ${ttlMinutes} minutes. If you didn't try to sign in, you can safely ignore this email.`,
    ],
    footerNote: "This code was requested from the GiftHappiness sign-in page.",
  });

  return sendEmail(env, {
    to,
    subject: "Your GiftHappiness sign-in code",
    sender: "auth",
    ...content,
  });
}

// ---------------------------------------------------------------------------
// Notifications (fire-and-forget -- never fail the request)
// ---------------------------------------------------------------------------

export interface CelebrationSummary {
  slug: string;
  celebrationType: string;
  celebrationDate: string | null;
  charityName: string;
  hostName: string | null;
  hostEmail: string;
}

// 1. Host submitted a celebration -> confirm we received it.
export function notifyHostSubmitted(env: Env, ctx: ExecutionContext, celebration: CelebrationSummary): void {
  const details: Array<[string, string]> = [
    ["Celebration", titleCase(celebration.celebrationType)],
    ["Supporting", celebration.charityName],
  ];
  if (celebration.celebrationDate) details.push(["Date", celebration.celebrationDate]);

  const content = build({
    preheader: "We've received your celebration and it's under review.",
    heading: "Your celebration is under review",
    paragraphs: [
      `Thanks${celebration.hostName ? `, ${celebration.hostName}` : ""} — we've received your celebration.`,
      "Our team reviews every celebration before it goes live, mainly to check the charity details are right. This usually takes a day or so, and we'll email you the moment it's approved.",
      "Nothing is needed from you in the meantime.",
    ],
    details,
    footerNote: "You're receiving this because you created a celebration on GiftHappiness.",
  });

  sendNotification(env, ctx, {
    to: celebration.hostEmail,
    subject: "We've received your celebration",
    ...content,
  });
}

// 2. A new celebration needs admin review. Goes to every admin in the
// database rather than a hardcoded address, so adding an admin doesn't
// require a redeploy.
export function notifyAdminsOfNewCelebration(
  env: Env,
  ctx: ExecutionContext,
  celebration: CelebrationSummary,
): void {
  ctx.waitUntil(
    (async () => {
      const supabase = getSupabaseClient(env);
      const { data: admins, error } = await supabase
        .from("users")
        .select("email")
        .eq("is_admin", true);

      if (error || !admins || admins.length === 0) {
        console.error("[email] no admins to notify about new celebration", celebration.slug, error);
        return;
      }

      const details: Array<[string, string]> = [
        ["Celebration", titleCase(celebration.celebrationType)],
        ["Host", celebration.hostName ?? celebration.hostEmail],
        ["Supporting", celebration.charityName],
        ["Slug", celebration.slug],
      ];
      if (celebration.celebrationDate) details.push(["Date", celebration.celebrationDate]);

      const content = build({
        preheader: `${celebration.hostName ?? celebration.hostEmail} submitted a celebration for review.`,
        heading: "A celebration needs review",
        paragraphs: [
          "A new celebration was submitted and is waiting for approval. It stays invisible to the public until someone approves it.",
        ],
        details,
        button: { label: "Review in admin", url: `${env.SITE_URL}/admin` },
        footerNote: "You're receiving this because you're an admin on GiftHappiness.",
      });

      for (const admin of admins) {
        await sendEmail(env, {
          to: admin.email,
          subject: `Celebration to review: ${celebration.slug}`,
          sender: "alerts",
          ...content,
        });
      }
    })(),
  );
}

// 3. Celebration approved and published -> tell the host it's live, with the
// shareable link. This is the email that matters most: the host's whole next
// step is sending that link to their guests.
export function notifyHostApproved(env: Env, ctx: ExecutionContext, celebration: CelebrationSummary): void {
  const content = build({
    preheader: "Your celebration is approved and live.",
    heading: "Your celebration is live",
    paragraphs: [
      `Good news${celebration.hostName ? `, ${celebration.hostName}` : ""} — your celebration has been approved and is now live.`,
      `Guests can now contribute to ${celebration.charityName} in place of gifts. Share the link below with them — that's all that's left to do.`,
      `Your link: ${env.SITE_URL}/celebration/${celebration.slug}`,
      // Linked rather than embedded: Gmail and most clients strip data: URIs
      // in <img>, so an inline QR would render as a broken image for most
      // recipients. The dashboard shows it and offers a print-quality PNG.
      `Prefer a QR code for invitations? You'll find one to download on your account page: ${env.SITE_URL}/account`,
    ],
    details: [
      ["Celebration", titleCase(celebration.celebrationType)],
      ["Supporting", celebration.charityName],
    ],
    button: { label: "View your celebration page", url: `${env.SITE_URL}/celebration/${celebration.slug}` },
    footerNote: "You're receiving this because you created a celebration on GiftHappiness.",
  });

  sendNotification(env, ctx, {
    to: celebration.hostEmail,
    subject: "Your celebration is live",
    ...content,
  });
}

// 4a. Donor contributed -> confirm what was recorded.
//
// Deliberately NOT a receipt. No payment has been taken (contributions are
// written with payment_status "pending"), so this must never claim money was
// received. The copy stays customer-facing rather than admitting to an
// unfinished gateway -- it promises payment details, which is both true and
// what the donor actually needs next. Revisit when payments go live.
export function notifyDonorContribution(
  env: Env,
  ctx: ExecutionContext,
  args: { donorEmail: string; donorName: string; amount: number | string; charityName: string; celebrationType: string },
): void {
  const content = build({
    preheader: "We've recorded your contribution.",
    heading: "Thank you for your contribution",
    paragraphs: [
      `Thank you, ${args.donorName}. We've recorded your contribution of ${formatAmount(args.amount)} to ${args.charityName}.`,
      "We'll be in touch shortly with payment details so you can complete it. No amount has been debited yet.",
    ],
    details: [
      ["Amount", formatAmount(args.amount)],
      ["Charity", args.charityName],
      ["Celebration", titleCase(args.celebrationType)],
      ["Status", "Awaiting payment"],
    ],
    footerNote: "You're receiving this because you contributed to a celebration on GiftHappiness.",
  });

  sendNotification(env, ctx, {
    to: args.donorEmail,
    subject: "We've recorded your contribution",
    ...content,
  });
}

// (A per-contribution host email lived here until 2026-09-10. Removed by
// product decision: it would flood a popular celebration's host, and the
// public celebration page now lists contributors, which is the better
// channel. If hosts later ask to be told, add a daily digest behind a cron
// trigger rather than reinstating one email per contribution.)

// 5. Celebration marked complete -> wrap-up for the host.
export function notifyHostCompleted(
  env: Env,
  ctx: ExecutionContext,
  args: { hostEmail: string; hostName: string | null; charityName: string; celebrationType: string; contributionCount: number; totalAmount: number },
): void {
  const paragraphs = [
    `Your ${args.celebrationType} celebration has wrapped up${args.hostName ? `, ${args.hostName}` : ""}.`,
  ];

  if (args.contributionCount > 0) {
    paragraphs.push(
      `${args.contributionCount} ${args.contributionCount === 1 ? "person" : "people"} contributed a total of ${formatAmount(args.totalAmount)} to ${args.charityName} because of your celebration.`,
    );
  } else {
    paragraphs.push(`No contributions came in this time, but thank you for choosing to celebrate with ${args.charityName} in mind.`);
  }
  paragraphs.push("Thank you for celebrating by giving.");

  const content = build({
    preheader: "Your celebration has wrapped up.",
    heading: "Your celebration is complete",
    paragraphs,
    details: [
      ["Charity", args.charityName],
      ["Contributions", String(args.contributionCount)],
      ["Total raised", formatAmount(args.totalAmount)],
    ],
    footerNote: "You're receiving this because you hosted a celebration on GiftHappiness.",
  });

  sendNotification(env, ctx, {
    to: args.hostEmail,
    subject: "Your celebration is complete",
    ...content,
  });
}
