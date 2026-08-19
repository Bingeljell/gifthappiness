// Client for the GiftHappiness Worker API (see workers/). NEXT_PUBLIC_API_BASE_URL
// is set per-environment (Cloudflare Pages env var in production, .env.local
// for local dev); the fallback below is a placeholder that won't resolve, so
// callers should treat a network-error result as a config problem, not
// assume the backend doesn't exist.
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

// Public charity directory, reads from the live charities table (see
// workers/src/routes/charities.ts) -- replaces the static dummy list that
// used to live in src/lib/charities.ts (see docs/plan.md "Phase 7: Live
// Charity Data").
export type Charity = {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: string;
  short_description: string;
  what_they_do: string;
  who_they_help: string;
  why_selected: string;
  impact_example: string | null;
  sdgs: string[];
  amount_raised: number;
  registration: string | null;
  years_active: number | null;
  verification_notes: string | null;
  website: string | null;
};

export function getCharities(): Promise<ApiResult<{ charities: Charity[] }>> {
  return apiFetch("/charities");
}

export function getCharity(slug: string): Promise<ApiResult<{ charity: Charity }>> {
  return apiFetch(`/charities/${encodeURIComponent(slug)}`);
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
  token?: string,
): Promise<ApiResult<{ contribution: { id: string; payment_status: string }; note: string }>> {
  return apiFetch(`/celebrations/${encodeURIComponent(celebrationSlug)}/contributions`, {
    method: "POST",
    body: JSON.stringify(input),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

// Accounts And Sign-In (Phase 6). One unified account for hosts, donors, and
// admins -- see docs/plan.md "Phase 6: Accounts And Sign-In". Login reuses
// the same email-code mechanism as host-signup verification above; the
// session is a bearer token the caller stores (see src/lib/session.tsx) and
// passes back as an Authorization header, not a cookie -- the frontend
// (static export) and API are different origins.
export type User = { id: string; name: string | null; email: string; mobile: string | null; isAdmin: boolean };

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

export type MyContribution = {
  id: string;
  celebration_id: string;
  amount: number;
  message: string | null;
  show_name: boolean;
  show_amount: boolean;
  anonymous: boolean;
  payment_status: string;
  created_at: string;
  celebration: { slug: string; celebration_type: string } | null;
};

export function getMyContributions(token: string): Promise<ApiResult<{ contributions: MyContribution[] }>> {
  return apiFetch("/me/contributions", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type AdminCharity = {
  id: string;
  slug: string;
  name: string;
  category: string;
  status: string;
  short_description: string;
  what_they_do: string;
  who_they_help: string;
  why_selected: string;
  impact_example: string | null;
  sdgs: string[];
  amount_raised: number;
  registration: string | null;
  years_active: number | null;
  verification_notes: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
};

export function adminListCharities(token: string): Promise<ApiResult<{ charities: AdminCharity[] }>> {
  return apiFetch("/admin/charities", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export type AdminCreateCharityInput = {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  whatTheyDo: string;
  whoTheyHelp: string;
  whySelected: string;
  impactExample?: string;
  sdgs?: string[];
  registration?: string;
  yearsActive?: number;
  verificationNotes?: string;
  website?: string;
};

export function adminCreateCharity(token: string, input: AdminCreateCharityInput): Promise<ApiResult<{ charity: AdminCharity }>> {
  return apiFetch("/admin/charities", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}

// PATCH /admin/charities/:slug expects raw DB column names (snake_case),
// unlike POST /admin/charities above -- matches workers/src/routes/admin.ts's
// updateCharity, which reads allowedFields directly off the request body.
export type AdminUpdateCharityInput = Partial<{
  name: string;
  category: string;
  status: string;
  short_description: string;
  what_they_do: string;
  who_they_help: string;
  why_selected: string;
  impact_example: string;
  sdgs: string[];
  amount_raised: number;
  registration: string;
  years_active: number | null;
  verification_notes: string;
  website: string;
}>;

export function adminUpdateCharity(
  token: string,
  slug: string,
  input: AdminUpdateCharityInput,
): Promise<ApiResult<{ charity: AdminCharity }>> {
  return apiFetch(`/admin/charities/${encodeURIComponent(slug)}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  });
}
