"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { notify } from "@/lib/notify";

/**
 * Auth-expiry handling for mutations (ratified ADR-005 §4).
 *
 * Detection (`isAuthExpiryError`) is a pure predicate, exported for reuse — the
 * read layer will want it too (see the ARCHITECTURE_DECISIONS watch-list:
 * "Auth-refresh ↔ in-flight-query races").
 *
 * The handler does ONE controlled refresh — never a silent refresh *loop*:
 *   - attempt a single `supabase.auth.refreshSession()`;
 *   - on success → surface a distinct "session restored, please retry" notice
 *     and stop. We deliberately do NOT auto-replay the mutation; auto-replay is
 *     the loop the ADR forbids. The user re-triggers intentionally.
 *   - on failure → clear auth state safely and redirect to a distinct
 *     session-expired UX (`/login?reason=session-expired`).
 *
 * Central observability (logging these transitions) is a documented follow-up;
 * the two TODO call-sites below are where that hook lands.
 */

const AUTH_EXPIRY_HINTS = [
  "jwt expired",
  "token is expired",
  "invalid token",
  "invalid claim",
  "invalid jwt",
  "session expired",
  "refresh token",
  "not authenticated",
  "missing authorization",
];

/** True when an error indicates an expired / missing / invalid session. Pure. */
export function isAuthExpiryError(error: unknown): boolean {
  if (!error) return false;

  const e = error as {
    status?: number;
    code?: string;
    message?: string;
    name?: string;
  };

  // HTTP 401 from PostgREST / GoTrue.
  if (e.status === 401) return true;
  // PostgREST JWT codes: PGRST301 (expired), PGRST302 (missing/invalid).
  if (e.code === "PGRST301" || e.code === "PGRST302") return true;
  // supabase-js auth error classes.
  if (e.name === "AuthApiError" || e.name === "AuthSessionMissingError") return true;

  const msg = (e.message ?? "").toLowerCase();
  return AUTH_EXPIRY_HINTS.some((hint) => msg.includes(hint));
}

export type AuthExpiryOutcome =
  | "ignored" // not an auth-expiry error — caller should handle normally
  | "recovered" // one refresh succeeded; user should retry
  | "signed-out"; // refresh failed; auth cleared + redirected

/**
 * Returns a handler that inspects a mutation error and, if it is an auth
 * expiry, performs the one-shot refresh-or-redirect described above. Returns
 * the outcome so the caller (useAppMutation) can suppress its generic error
 * toast for handled cases.
 */
export function useAuthExpiryHandler() {
  const router = useRouter();

  return useCallback(
    async (error: unknown): Promise<AuthExpiryOutcome> => {
      if (!isAuthExpiryError(error)) return "ignored";

      const supabase = createClient();

      // ── ONE controlled refresh (no loop) ─────────────────────────────────
      const { data, error: refreshError } = await supabase.auth.refreshSession();
      if (!refreshError && data.session) {
        // TODO(observability): log "auth-expiry: recovered" centrally.
        notify.error("Your session was refreshed — please try that again.");
        return "recovered";
      }

      // ── Refresh failed → clear + redirect to the distinct expired UX ──────
      // TODO(observability): log "auth-expiry: signed-out" centrally.
      // signOut clears local auth; AuthContext's onAuthStateChange listener
      // nulls session/profile in response, so state stays consistent.
      await supabase.auth.signOut().catch(() => {
        /* token already dead — nothing to clear; proceed to redirect */
      });
      router.replace("/login?reason=session-expired");
      return "signed-out";
    },
    [router],
  );
}
