// Client for the GiftHappiness Worker API (see workers/). No backend is
// deployed yet, so NEXT_PUBLIC_API_BASE_URL defaults to a placeholder that
// won't resolve -- every call below is expected to fail with a network error
// until a real Worker URL is set in .env.local. Callers should treat that as
// a normal, expected state (see the friendly error copy in the UI), not a bug.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.gifthappiness.example";

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const message = (body && typeof body === "object" && "error" in body ? String(body.error) : null) ?? `Request failed (${response.status})`;
      return { ok: false, error: message };
    }

    return { ok: true, data: body as T };
  } catch {
    return {
      ok: false,
      error: "Could not reach the GiftHappiness API. The backend isn't deployed yet.",
    };
  }
}

export type VerificationChannel = "email" | "mobile";
export type VerificationPurpose = "host_signup" | "contribution";

export function requestVerification(
  channel: VerificationChannel,
  contact: string,
  purpose: VerificationPurpose,
): Promise<ApiResult<{ status: string; channel: string; expiresInMinutes: number }>> {
  return apiFetch("/verify/request", {
    method: "POST",
    body: JSON.stringify({ channel, contact, purpose }),
  });
}

export function confirmVerification(
  channel: VerificationChannel,
  contact: string,
  purpose: VerificationPurpose,
  code: string,
): Promise<ApiResult<{ verified: boolean }>> {
  return apiFetch("/verify/confirm", {
    method: "POST",
    body: JSON.stringify({ channel, contact, purpose, code }),
  });
}

export type CreateCelebrationInput = {
  hostName: string;
  hostEmail: string;
  hostMobile: string;
  hostAddress?: string;
  celebrationType: string;
  celebrationDate?: string;
  charitySlug: string;
  activeFrom?: string;
  activeTill?: string;
  message?: string;
};

export function createCelebration(
  input: CreateCelebrationInput,
): Promise<ApiResult<{ celebration: { id: string; slug: string; status: string } }>> {
  return apiFetch("/celebrations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export type SubmitContributionInput = {
  donorName: string;
  donorMobile: string;
  donorEmail?: string;
  pan?: string;
  amount: number;
  message?: string;
  showName?: boolean;
  showAmount?: boolean;
  anonymous?: boolean;
};

export function submitContribution(
  celebrationSlug: string,
  input: SubmitContributionInput,
): Promise<ApiResult<{ contribution: { id: string; payment_status: string }; note: string }>> {
  return apiFetch(`/celebrations/${encodeURIComponent(celebrationSlug)}/contributions`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Accounts And Sign-In (Phase 6). One unified account for hosts, donors, and
// admins -- see docs/plan.md "Phase 6: Accounts And Sign-In". Login reuses
// the same email-code mechanism as host-signup verification above; the
// session is a bearer token the caller stores (see src/lib/session.tsx) and
// passes back as an Authorization header, not a cookie -- the frontend
// (static export) and API are different origins.
export type User = { id: string; name: string | null; email: string; isAdmin: boolean };

export function requestLogin(email: string): Promise<ApiResult<{ status: string; expiresInMinutes: number }>> {
  return apiFetch("/auth/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function confirmLogin(email: string, code: string): Promise<ApiResult<{ token: string; user: User }>> {
  return apiFetch("/auth/confirm", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export function getMe(token: string): Promise<ApiResult<{ user: User }>> {
  return apiFetch("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function logout(token: string): Promise<ApiResult<{ status: string }>> {
  return apiFetch("/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type MyCelebration = {
  id: string;
  slug: string;
  celebration_type: string;
  celebration_date: string | null;
  active_from: string | null;
  active_till: string | null;
  status: string;
  charity_id: string;
};

export function getMyCelebrations(token: string): Promise<ApiResult<{ celebrations: MyCelebration[] }>> {
  return apiFetch("/me/celebrations", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
