// Minimal hand-rolled validation. Deliberately not pulling in a schema
// library (e.g. zod) for a handful of fields per route — revisit if the
// number of routes/fields grows enough to justify it.

export class ValidationError extends Error {}

export function requireString(value: unknown, field: string, { maxLength = 2000 } = {}): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ValidationError(`${field} is required`);
  }
  if (value.length > maxLength) {
    throw new ValidationError(`${field} is too long`);
  }
  return value.trim();
}

export function optionalString(value: unknown, field: string, { maxLength = 2000 } = {}): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return requireString(value, field, { maxLength });
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requireEmail(value: unknown, field = "email"): string {
  const email = requireString(value, field, { maxLength: 254 });
  if (!EMAIL_PATTERN.test(email)) {
    throw new ValidationError(`${field} must be a valid email address`);
  }
  return email.toLowerCase();
}

const MOBILE_PATTERN = /^\+?[0-9]{10,15}$/;

export function requireMobile(value: unknown, field = "mobile"): string {
  const mobile = requireString(value, field, { maxLength: 20 });
  if (!MOBILE_PATTERN.test(mobile.replace(/\s/g, ""))) {
    throw new ValidationError(`${field} must be a valid phone number`);
  }
  return mobile;
}

export function requirePositiveAmount(value: unknown, field = "amount"): number {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ValidationError(`${field} must be a positive number`);
  }
  return amount;
}

export function optionalBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}


// ISO calendar date (YYYY-MM-DD). Checked against Date rather than the regex
// alone so "2026-02-31" is rejected rather than silently rolling into March.
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function optionalDate(value: unknown, field: string): string | undefined {
  const raw = optionalString(value, field, { maxLength: 10 });
  if (raw === undefined) return undefined;

  if (!DATE_PATTERN.test(raw)) {
    throw new ValidationError(`${field} must be a date in YYYY-MM-DD format`);
  }
  const parsed = new Date(`${raw}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== raw) {
    throw new ValidationError(`${field} is not a real date`);
  }
  return raw;
}

// The contribution window has to make sense on its own, and relative to the
// celebration. A window that closes before it opens accepts nothing; a window
// that opens only after the celebration has passed means guests arrive at the
// page and cannot give -- the failure a host is least likely to notice, since
// the page looks fine to them.
//
// Takes the *effective* values (existing row merged with the update) so an
// edit that changes one end of the window is still checked against the other.
export function validateCelebrationWindow(dates: {
  celebrationDate?: string | null;
  activeFrom?: string | null;
  activeTill?: string | null;
}): void {
  const { celebrationDate, activeFrom, activeTill } = dates;

  if (activeFrom && activeTill && activeFrom > activeTill) {
    throw new ValidationError("Contributions cannot close before they open. Check the contribution dates.");
  }
  if (celebrationDate && activeFrom && activeFrom > celebrationDate) {
    throw new ValidationError(
      "Contributions would open after the celebration date, so guests could not give in time. Open the window on or before the celebration.",
    );
  }
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    if (typeof body !== "object" || body === null) {
      throw new ValidationError("Request body must be a JSON object");
    }
    return body as Record<string, unknown>;
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
}
