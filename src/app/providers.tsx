"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { LangProvider } from "@/context/LangContext";
import type { Locale } from "@/lib/i18n";

/**
 * App-wide client providers.
 *
 * QueryClient is created once per browser session (useState initializer) so it
 * survives re-renders but never leaks between requests on the server.
 *
 * Defaults are tuned for the console dashboards, whose tab bodies mount/unmount
 * as the user navigates. `staleTime` keeps a freshly-fetched tab cached so
 * switching away and back is instant instead of re-hitting Supabase; data still
 * refreshes in the background once stale.
 *
 * Provider ORDER is load-bearing: QueryClientProvider → AuthProvider → LangProvider.
 * AuthProvider must stay intact (it encodes the supabase-js auth-lock deadlock
 * workaround — see src/context/AuthContext.tsx). Wrapping it never reorders or
 * blocks its initialisation.
 */
export function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000, // 30s — tab switches inside this window serve from cache
            gcTime: 5 * 60_000, // keep unused data 5 min before garbage-collecting
            refetchOnWindowFocus: false, // avoid surprise refetches mid-session
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LangProvider lang={locale}>{children}</LangProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
