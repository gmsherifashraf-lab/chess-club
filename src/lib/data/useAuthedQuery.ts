"use client";

import {
  useQuery,
  type UseQueryResult,
  type UseQueryOptions,
} from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

/**
 * Thin standardization layer for authenticated, user-scoped reads.
 *
 * It owns ONLY the cross-cutting concerns every dashboard read repeats:
 *   - session handling   — gates the query on a signed-in user; the fetcher is
 *                          only ever called with a guaranteed non-null userId.
 *   - Supabase access    — hands the fetcher a client (no per-hook createClient).
 *   - query defaults      — inherits the QueryClient baseline (staleTime 30s,
 *                          retry 1, no refetch-on-focus); overrides are opt-in
 *                          and only applied when explicitly passed, so we never
 *                          accidentally clobber the default staleTime with
 *                          `undefined` (which would disable our caching).
 *   - typed ergonomics   — returns a fully-typed UseQueryResult<TData>.
 *
 * It deliberately holds NO business logic. Each feature hook supplies its own
 * key factory + fetcher and keeps its own EMPTY fallback.
 */
export interface AuthedQueryContext {
  /** Signed-in user id — guaranteed non-null inside the fetcher. */
  userId: string;
  supabase: SupabaseClient;
}

export interface AuthedQueryOptions<TData> {
  /** Extra gate ANDed with "is there a session?". Default: true. */
  enabled?: boolean;
  /** Per-query staleTime (ms). Omit to inherit the client default (30s). */
  staleTime?: number;
  /** Pass `keepPreviousData` to avoid a loading flash when the KEY changes
   *  within the same logical view (use with care — never across distinct
   *  entities where showing the previous one's data would be misleading). */
  placeholderData?: UseQueryOptions<TData, Error, TData, readonly unknown[]>["placeholderData"];
}

export function useAuthedQuery<TData>(
  keyFor: (userId: string | undefined) => readonly unknown[],
  fetcher: (ctx: AuthedQueryContext) => Promise<TData>,
  options: AuthedQueryOptions<TData> = {},
): UseQueryResult<TData, Error> {
  const { user } = useAuth();
  const userId = user?.id;

  return useQuery<TData, Error, TData, readonly unknown[]>({
    queryKey: keyFor(userId),
    queryFn: () => fetcher({ userId: userId!, supabase: createClient() }),
    enabled: !!userId && (options.enabled ?? true),
    // Only spread overrides that were actually provided — passing an explicit
    // `staleTime: undefined` would override (and disable) the client default.
    ...(options.staleTime !== undefined ? { staleTime: options.staleTime } : {}),
    ...(options.placeholderData !== undefined ? { placeholderData: options.placeholderData } : {}),
  });
}
