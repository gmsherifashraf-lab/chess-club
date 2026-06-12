"use client";

import {
  useMutation,
  useQueryClient,
  type QueryClient,
  type QueryKey,
  type UseMutationResult,
} from "@tanstack/react-query";
import { notify } from "@/lib/notify";
import { useAuthExpiryHandler } from "./auth-expiry";

/**
 * useAppMutation — the one mutation standard (ratified ADR-005 §2, §3, §4, §6).
 *
 * A thin wrapper over React Query's `useMutation` that owns the cross-cutting
 * mutation concerns and NOTHING else:
 *   - retry      — mutations default to `retry: 0` (ADR-005). Don't silently
 *                  re-run a write.
 *   - toasts     — optional success / error toasts via `notify` (presentation
 *                  adapter). Opt-out per call when a screen shows inline state.
 *   - invalidate — EXPLICIT targets only (§2). You list the exact query keys
 *                  this write makes stale; the wrapper never auto-invalidates a
 *                  broad domain prefix for you. Hidden invalidation storms are
 *                  the failure mode we're designing out for multi-tenant scale.
 *   - auth-expiry — a 401 / expired-JWT triggers ONE controlled refresh, then
 *                  retry-notice or sign-out + redirect (§4, see auth-expiry.ts).
 *
 * Optimistic updates (§3) are NOT abstracted here — there are zero mutating
 * screens yet, and the ADR culture is "observe a need 3× before extracting".
 * The `onMutate` / `onError` / `onSettled` pass-throughs give you React Query's
 * native optimistic mechanism. When you use it, obey the ratified rules:
 *   optimistic updates must be LOCAL, DETERMINISTIC, IDEMPOTENT, and
 *   IMMEDIATELY REVERSIBLE (snapshot in onMutate, roll back in onError).
 *   NEVER optimistic-update aggregate analytics, rankings, cross-entity
 *   counters, permission-sensitive data, or server-generated values.
 *
 * Mutation-state ownership (§6): this wrapper returns React Query's mutation
 * object — read `isPending` / `isError` from it. Do NOT mirror results into
 * local `useState` ("isSaving" trees, shadow copies of server data). Queries
 * own canonical server state; mutations own only transient in-flight UI state.
 */

/** A message that is either static or derived from the success/error payload. */
type MessageFor<A> = string | ((arg: A) => string);

export interface AppMutationOptions<TData, TVars, TContext> {
  mutationFn: (vars: TVars) => Promise<TData>;

  /**
   * EXPLICIT invalidation targets. List the exact keys this mutation makes
   * stale — pulled from the `queryKeys` registry, never inlined. May be a
   * function of (data, vars) when the affected keys depend on the result.
   *
   *   invalidate: [queryKeys.enrollments.list(), queryKeys.admin.overview()]
   *
   * Passing a broad prefix (e.g. `queryKeys.player.all`) is allowed but must be
   * a deliberate choice, not a default — prefer the narrowest keys that cover
   * what actually changed.
   */
  invalidate?: QueryKey[] | ((data: TData, vars: TVars) => QueryKey[]);

  /** Success toast. Omit for none; a string or `(data) => string` to show one. */
  successToast?: MessageFor<TData>;
  /**
   * Error toast. Defaults to a generic message. Pass `false` to suppress (the
   * screen surfaces the error inline). Auth-expiry errors are handled
   * separately (§4) and never produce this generic toast.
   */
  errorToast?: false | MessageFor<unknown>;

  // ── Optimistic / lifecycle pass-throughs (see the §3 rules above) ─────────
  // onMutate returns the rollback context (the pre-mutation snapshot) that
  // onError/onSettled receive back. Type it `void` when you don't need one.
  onMutate?: (vars: TVars) => TContext | Promise<TContext>;
  onSuccess?: (data: TData, vars: TVars, context: TContext | undefined) => void;
  onError?: (error: unknown, vars: TVars, context: TContext | undefined) => void;
  onSettled?: (
    data: TData | undefined,
    error: unknown,
    vars: TVars,
    context: TContext | undefined,
  ) => void;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

/** Invalidate several keys at once. Exported for reuse outside mutations — e.g.
 *  a realtime handler that must refresh a set of queries on an event (ADR-006).
 *  Note: React Query matches by key *prefix*, so pass the narrowest keys. */
export function invalidateMany(client: QueryClient, keys: QueryKey[]): void {
  keys.forEach((queryKey) => client.invalidateQueries({ queryKey }));
}

export function useAppMutation<TData = unknown, TVars = void, TContext = unknown>(
  options: AppMutationOptions<TData, TVars, TContext>,
): UseMutationResult<TData, unknown, TVars, TContext> {
  const queryClient = useQueryClient();
  const handleAuthExpiry = useAuthExpiryHandler();

  return useMutation<TData, unknown, TVars, TContext>({
    mutationFn: options.mutationFn,
    retry: 0, // mutations never auto-retry a write (ADR-005)
    onMutate: options.onMutate,

    onSuccess: (data, vars, context) => {
      // Explicit invalidation only — exactly the keys the caller listed.
      const keys =
        typeof options.invalidate === "function"
          ? options.invalidate(data, vars)
          : options.invalidate;
      if (keys?.length) invalidateMany(queryClient, keys);

      if (options.successToast !== undefined) {
        notify.success(
          typeof options.successToast === "function"
            ? options.successToast(data)
            : options.successToast,
        );
      }

      options.onSuccess?.(data, vars, context);
    },

    onError: async (error, vars, context) => {
      // Auth-expiry owns its own UX (controlled refresh → retry notice, or
      // sign-out + redirect). Only fall back to a generic error toast when the
      // error is NOT an auth-expiry case.
      const outcome = await handleAuthExpiry(error);
      if (outcome === "ignored" && options.errorToast !== false) {
        notify.error(
          typeof options.errorToast === "function"
            ? options.errorToast(error)
            : options.errorToast ?? DEFAULT_ERROR_MESSAGE,
        );
      }

      options.onError?.(error, vars, context);
    },

    onSettled: options.onSettled,
  });
}
