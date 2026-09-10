// Shared email layout. Every outbound email renders through `layout()` so
// branding lives in exactly one place.
//
// The HTML here is deliberately old-fashioned -- table-based, inline styles,
// no flexbox/grid, no <style> block beyond a minimal head. Email clients
// (Outlook and Gmail especially) strip stylesheets and ignore modern layout,
// so the constraints that apply to the Next.js site do not apply here.
//
// Palette matches src/app/globals.css so mail looks like the site.
const BRAND = {
  pink: "#FF2D55",
  softPink: "#FFF0F5",
  creme: "#FFFDF9",
  text: "#111827",
  muted: "#4B5563",
  border: "#F0E6E9",
} as const;

export interface Button {
  label: string;
  url: string;
}

export interface LayoutOptions {
  // Short line under the logo describing the email's purpose.
  preheader: string;
  heading: string;
  // Each string becomes its own paragraph. Pre-escaped HTML is NOT allowed --
  // callers pass plain text and it is escaped here.
  paragraphs: string[];
  button?: Button;
  // Optional key/value block (e.g. celebration details) rendered as rows.
  details?: Array<[string, string]>;
  // Small print under the divider, e.g. why this email was received.
  footerNote?: string;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${BRAND.text};">${escapeHtml(text)}</p>`;
}

function detailRows(details: Array<[string, string]>): string {
  const rows = details
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:6px 0;font-size:14px;color:${BRAND.muted};width:40%;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;font-size:14px;color:${BRAND.text};font-weight:600;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
           style="background:${BRAND.softPink};border-radius:8px;padding:16px;margin:0 0 24px;">
      ${rows}
    </table>`;
}

function buttonHtml(button: Button): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
      <tr>
        <td style="background:${BRAND.pink};border-radius:999px;">
          <a href="${escapeHtml(button.url)}"
             style="display:inline-block;padding:13px 28px;font-size:16px;font-weight:600;
                    color:#ffffff;text-decoration:none;">${escapeHtml(button.label)}</a>
        </td>
      </tr>
    </table>`;
}

export function layout(options: LayoutOptions): string {
  const { preheader, heading, paragraphs, button, details, footerNote } = options;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.creme};">
    <!-- Preheader: shown as preview text in the inbox list, hidden in the body. -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
           style="background:${BRAND.creme};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                 style="max-width:560px;background:#ffffff;border:1px solid ${BRAND.border};
                        border-radius:12px;padding:32px;">
            <tr>
              <td>
                <p style="margin:0 0 24px;font-size:20px;font-weight:700;color:${BRAND.pink};">
                  GiftHappiness
                </p>
                <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;color:${BRAND.text};">
                  ${escapeHtml(heading)}
                </h1>
                ${paragraphs.map(paragraph).join("\n")}
                ${details && details.length > 0 ? detailRows(details) : ""}
                ${button ? buttonHtml(button) : ""}
                <hr style="border:none;border-top:1px solid ${BRAND.border};margin:24px 0 16px;">
                <p style="margin:0;font-size:13px;line-height:1.5;color:${BRAND.muted};">
                  ${escapeHtml(footerNote ?? "Celebrate by giving.")}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// Plain-text alternative. Always sent alongside the HTML: some clients render
// text only, and a missing text part measurably hurts spam scoring.
export function plainText(options: LayoutOptions): string {
  const { heading, paragraphs, button, details, footerNote } = options;
  const parts = [heading, "", ...paragraphs];

  if (details && details.length > 0) {
    parts.push("");
    for (const [label, value] of details) parts.push(`${label}: ${value}`);
  }
  if (button) {
    parts.push("", `${button.label}: ${button.url}`);
  }
  parts.push("", "---", footerNote ?? "Celebrate by giving.");

  return parts.join("\n");
}
