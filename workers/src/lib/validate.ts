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
