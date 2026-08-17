"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getMe, logout as apiLogout, type User } from "./api";

// Bearer token in localStorage, not a cookie: the frontend (static export)
// and the Worker API are different origins, so a cookie session means
// fighting SameSite/CORS-credentials rules for no real benefit at this scale
// (see docs/plan.md "Phase 6: Accounts And Sign-In").
const TOKEN_STORAGE_KEY = "gh_session_token";

type SessionState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  setToken: (token: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Bumped by setToken to re-trigger the session fetch below after login,
  // since the effect otherwise only runs once on mount.
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const stored = window.localStorage.getItem(TOKEN_STORAGE_KEY);
      const result = stored ? await getMe(stored) : null;
      if (cancelled) return;

      if (result?.ok) {
        setUser(result.data.user);
        setTokenState(stored);
      } else {
        if (stored) window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
        setTokenState(null);
      }
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [generation]);

  const setToken = useCallback((newToken: string) => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
    setLoading(true);
    setGeneration((n) => n + 1);
  }, []);

  const signOut = useCallback(() => {
    const stored = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    setTokenState(null);
    if (stored) {
      apiLogout(stored);
    }
  }, []);

  return <SessionContext.Provider value={{ user, token, loading, setToken, signOut }}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return ctx;
}
