/**
 * Next.js instrumentation hook — runs once when the server process boots.
 * We use it to validate environment variables loudly at startup rather than
 * discovering a missing key on the first request. Node runtime only.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("@/lib/env");
    validateEnv();
  }
}
