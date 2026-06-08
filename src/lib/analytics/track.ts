/**
 * Analytics shim.
 *
 * Default behavior is a no-op so production code paths (error boundaries,
 * key UX events) can call `track()` without depending on a specific
 * provider. Wire a real backend by setting one of:
 *
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN   → emits to window.plausible if loaded
 *   NEXT_PUBLIC_POSTHOG_KEY        → emits to window.posthog if loaded
 *
 * Server-side calls during render/SSR also no-op (we don't ship a server
 * collector by default). Add one by extending the `dispatchServer` block.
 */

export type AnalyticsEvent =
  | "app_error"
  | "classroom_error"
  | "dashboard_error"
  | "classroom_joined"
  | "classroom_left"
  | "classroom_hand_raised"
  | "classroom_board_pushed"
  | "classroom_engine_toggled"
  | "session_started"
  | "session_ended";

export type AnalyticsProps = Record<string, string | number | boolean | null | undefined>;

const isBrowser = typeof window !== "undefined";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
    posthog?: { capture: (event: string, props?: AnalyticsProps) => void };
  }
}

function dispatchClient(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (!isBrowser) return;
  try {
    if (typeof window.plausible === "function") {
      window.plausible(event, props ? { props } : undefined);
    }
    if (window.posthog?.capture) {
      window.posthog.capture(event, props);
    }
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", event, props ?? {});
    }
  } catch {
    /* never let analytics break a render */
  }
}

function dispatchServer(_event: AnalyticsEvent, _props?: AnalyticsProps): void {
  // Slot for a server-side collector (Vercel Analytics server SDK, an HTTP
  // beacon to your backend, etc.). Currently a no-op so server components
  // can call track() without conditional branching.
}

export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (isBrowser) {
    dispatchClient(event, props);
  } else {
    dispatchServer(event, props);
  }
}

/** Useful for inlining in JSX onClick without leaking the props shape. */
export function trackClick(event: AnalyticsEvent, props?: AnalyticsProps) {
  return () => track(event, props);
}
