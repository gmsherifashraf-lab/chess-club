/**
 * Env validation.
 *
 * Called from `instrumentation.ts` at server start. Required vars throw fast in
 * production so misconfigured deploys fail visibly instead of returning 500s at
 * request time. Optional vars (LiveKit) only log a warning so the app still
 * boots without live-classroom video configured.
 *
 * Never import anything that runs in the browser — this file is server-only.
 */

interface EnvShape {
  // Required
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // Optional but warned-about
  NEXT_PUBLIC_LIVEKIT_URL?: string;
  LIVEKIT_API_KEY?: string;
  LIVEKIT_API_SECRET?: string;
}

const REQUIRED: (keyof EnvShape)[] = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

const OPTIONAL_GROUPS: { name: string; vars: (keyof EnvShape)[] }[] = [
  {
    name: "LiveKit (live classroom video)",
    vars: ["NEXT_PUBLIC_LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"],
  },
];

let validated = false;

export function validateEnv(): void {
  if (validated) return;
  validated = true;

  const missingRequired = REQUIRED.filter((k) => !process.env[k]);
  if (missingRequired.length > 0) {
    const lines = missingRequired.map((k) => `  - ${k}`).join("\n");
    const msg = `\n[env] Missing required environment variables:\n${lines}\n\nSet these in .env.local (development) or your deployment platform.\n`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    }
    // eslint-disable-next-line no-console
    console.error(msg);
  }

  for (const group of OPTIONAL_GROUPS) {
    const present = group.vars.filter((k) => !!process.env[k]);
    if (present.length > 0 && present.length < group.vars.length) {
      const missing = group.vars.filter((k) => !process.env[k]);
      // eslint-disable-next-line no-console
      console.warn(
        `[env] ${group.name} is partially configured. Missing: ${missing.join(", ")}. Set the rest, or leave the whole group unset to disable the feature.`,
      );
    }
  }
}

/** True only when all three LiveKit vars are present. The classroom token
 *  endpoint returns 503 when this is false, and the UI degrades gracefully. */
export function isLiveKitConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_LIVEKIT_URL &&
      process.env.LIVEKIT_API_KEY &&
      process.env.LIVEKIT_API_SECRET,
  );
}
