export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ADMIN_API_KEY: string;
  ALLOWED_ORIGIN: string;
  RESEND_API_KEY: string;
  // Verified Resend sending domain, e.g. "mail.gifthappiness.org". A
  // subdomain, not the root: the root's MX records are reserved for the
  // mailbox provider that receives human mail (see docs/plan.md).
  EMAIL_DOMAIN: string;
  // Monitored inbox replies should land in. Distinct from EMAIL_DOMAIN --
  // outbound mail is sent from the subdomain but replies go to a real
  // mailbox on the root domain.
  EMAIL_REPLY_TO: string;
  // Public site origin, used to build links inside emails. Separate from
  // ALLOWED_ORIGIN (a CORS control) because the two can legitimately differ
  // during local development.
  SITE_URL: string;
}
