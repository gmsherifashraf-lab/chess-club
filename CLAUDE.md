# Chess & Culture Club for Women — Sharjah

Bilingual (Arabic + English) institutional site for a 1991-founded women's chess club in Sharjah, UAE. Public marketing pages plus a role-gated dashboard backed by Supabase.

**Live:** https://project-oimbc.vercel.app
**Repo:** gmsherifashraf-lab/chess-and-culture-club
**Vercel project:** `project-oimbc` (auto-deploys on push to `main`)

---

## Stack

- **Framework:** Next.js 16.2.4 (App Router, Turbopack default in dev)
- **UI:** React 18, TailwindCSS 3.4, framer-motion 12
- **Auth + DB:** Supabase — `@supabase/ssr` 0.10.2, `@supabase/supabase-js` 2.105.3
- **Lang:** TypeScript 5, strict mode

## Run it

```bash
npm install
npm run dev        # localhost:3000
```

`.env.local` must contain (already set on this machine):

```
NEXT_PUBLIC_SUPABASE_URL=https://fctezkqmvaydznrlizhs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...      # NEW format, not the legacy JWT anon key
```

The anon key uses the **new `sb_publishable_*` short-key format** — don't swap it for the legacy JWT-style key.

---

## ⚠️ Critical gotcha — read before touching auth

**Do NOT make the `onAuthStateChange` callback in `src/context/AuthContext.tsx` async.** Do NOT `await` any `supabase.*` call inside it.

Why: `supabase-js@2.105+` holds a `navigator.lock` during `getSession()` / `_initialize()`, and synchronously awaits every `onAuthStateChange` subscriber. If our callback `await`s a `supabase.from(...)` query, the query needs the same lock the client is still holding → **deadlock**. The dashboard sits forever on the loading spinner. Reproduces reliably in local dev, intermittently on Vercel.

The fix (in place since `e8b7eb9`): callback is synchronous, profile fetch is deferred to `queueMicrotask` so it runs **after** the lock releases. A 4-second watchdog also exists as defense in depth — leave it alone.

Reference: https://github.com/supabase/auth-js/issues/888

---

## Architecture cheatsheet

### Roles

Three roles, stored in `public.profiles.role` and mirrored to `auth.users.raw_user_meta_data.role` via trigger so middleware can read it from the JWT without a DB hit:

- `admin` — super-admin, bypasses role checks
- `coach`
- `player`

Defined in `src/lib/auth.ts`. Old code referenced `parent` / `board` — these are gone since commit `2d242d2`. `normaliseRole()` in both `middleware.ts` and `AuthContext.tsx` maps any unknown value to `player`.

### Auth flow

1. `signIn(supabase, ...)` in `src/lib/auth.ts` calls `signInWithPassword`, then preferentially reads the role from `profiles` table.
2. Login page hard-navigates with `window.location.assign(dashboard)` (not `router.push`) — production was silently swallowing client-router errors.
3. `middleware.ts` calls `getUser()` (not `getSession()` — the latter doesn't refresh cookies). Redirects:
   - protected route + no user → `/login`
   - auth route + user → role's dashboard
   - wrong-role dashboard → correct dashboard
4. `useRequireAuth(role)` hook in dashboards gates page render on `loading` and redirects on role mismatch.

### Key files

- `src/app/page.tsx` — homepage sections
- `src/components/home/Hero.tsx` — hero with **background video**, parallax, CTAs
- `src/context/AuthContext.tsx` — auth state, the deadlock fix lives here
- `src/lib/supabase/client.ts` — singleton browser client
- `src/lib/supabase/middleware.ts` — server client for middleware
- `src/lib/auth.ts` — roles, dashboards, signIn/signUp/signOut
- `src/app/dashboard/{admin,coach,player}/page.tsx` — role-specific dashboards
- `src/components/admin/` — CrudShell, EnrollmentsList, CoachAssignments, UsersManager, configs
- `src/components/coach/` — PlayersList, AttendanceTaker, ParticipationsEditor (all scoped via `useCurrentCoach`)
- `middleware.ts` — root middleware (auth + role redirects)

### DB tables (Supabase)

`profiles`, `players`, `coaches`, `coach_assignments`, `tournaments`, `participations`, `attendance`, `enrollments`, `tasks`, `submissions`, `news`, `gallery_images`. RLS policies in `supabase/migrations/0005_role_system_refactor.sql`.

---

## Conventions

- **Bilingual UI:** every visible string has `<span className="ar">…</span><span className="en">…</span>` siblings; CSS shows one based on the `<html dir>` / `lang` toggle via `LangContext`.
- **Visual style:** "light luxury" — cream `#EDE9E2` background, dark ink text, restrained green `#1F6B4F` accents, occasional crimson `#C8102E`. The Hero is the canonical look.
- **No emojis in copy unless explicitly requested.**
- **Commit style:** Conventional commits (`feat`, `fix`, `chore`, `refactor`). Co-authored-by Claude when applicable.

---

## Hero background video

`src/components/home/Hero.tsx` renders a silent looping `<video>` behind the hero text.

- **File:** `public/videos/hero.mp4` — H.264 High, 1080×1920 portrait, 25 fps, audio stripped, `+faststart`. Currently 730 KB.
- **Re-encoding** (if replacing): `ffmpeg -i input.mp4 -vf scale=1080:-2 -c:v libx264 -preset slow -crf 28 -an -movflags +faststart public/videos/hero.mp4`
- The video is at `opacity-[0.7]` with a diagonal cream wash (heavy top-left where text sits, light bottom-right where video is most visible). Don't add a webm `<source>` — we don't ship one, and Edge has been observed to fail-over poorly when the first source 404s through Vercel's CDN.
- Hidden via CSS for `prefers-reduced-motion: reduce`.
- Component falls back gracefully (`setVideoOk(false)`) if the file fails to load.

---

## Known followups (not urgent)

- Three orphan worktree directories under `.claude/worktrees/` from prior sessions: `gracious-hawking-0213f2`, `reverent-franklin-931b70`, `zen-haibt-41548f`, and possibly `awesome-brown-a6d037` + `eager-matsumoto-6b25bc`. Locked by Windows file handles when `next dev` is running. Stop dev server, then:
  ```powershell
  git worktree prune
  Remove-Item -Force -Recurse .claude\worktrees\*
  ```
- Vercel deploys produce a build manifest log we don't currently read. If a deploy fails, check `vercel ls project-oimbc` + `vercel inspect <url>`.
- `next dev` on Next 16 + Edge sometimes pipes browser `console.log` selectively. If you need to see logs from the browser in the terminal, use `console.warn` / `console.error` — those are reliably forwarded; `console.log` is dropped.

---

## Resuming a session

`git log --oneline -10` and a short prompt like "what did the last session ship?" is enough. The shipped fixes are documented in commit messages — they're more authoritative than this file.
