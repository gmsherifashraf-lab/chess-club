# Project Handoff — Chess & Culture Club for Women, Sharjah

> Continuity document for resuming this project in a new Claude session.
> Last updated: end of the redesign + 5-role auth/RBAC build session.

---

## 1. Project Overview

- **Purpose:** Official institutional website + role-gated operations platform for the Chess & Culture Club for Women in Sharjah, UAE (founded 1991). Public marketing site plus a private multi-role dashboard system for running the club.
- **Main goals:**
  1. A premium, trustworthy public site that reads like an official UAE sports federation (benchmarked against Fujairah Chess Club for structure, **not** copied).
  2. A secure 5-role operations system: admin-managed accounts, coach↔player workflow, parent monitoring, editor content management.
- **Brand identity:** White / black / red / green. Green-led (federation green `#0A5234`) carries the identity; red (`#C8102E`, UAE-flag) is a sparing accent; near-black ink on a clean neutral-white ground. No cream, no neon, no glow. Women's chess empowerment, modern but formal, premium and trustworthy.
- **Design direction:** Official UAE sports-organization aesthetic. Large confident typography, generous spacing, ruled section dividers, restrained ease-out motion, true bilingual Arabic/English with RTL.
- **Target users:** Prospective members/parents, club staff (admin/editor), coaches, players (often girls), and parents of players. Public visitors: officials, sponsors, press.

---

## 2. Current Tech Stack

- **Framework:** Next.js 16.2.4, App Router, Turbopack (default in dev).
- **UI:** React 18, TailwindCSS 3.4, framer-motion 12.
- **Component system:** Hand-built cva primitives (NOT the shadcn CLI) — `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Lang:** TypeScript 5, strict mode.
- **Backend:** Supabase — `@supabase/ssr` 0.10.2, `@supabase/supabase-js` 2.105.3 (Postgres + Auth + RLS). Project ref `fctezkqmvaydznrlizhs`.
- **Auth:** Supabase Auth (email/password). Public signup disabled (must be toggled off in dashboard). Accounts are admin-created only via a service-role API route.
- **Database:** Supabase Postgres. Migrations in `supabase/migrations/` (0001–0009).
- **Deployment:** Vercel project `project-oimbc`, auto-deploys on push to `main`. Live URL: https://project-oimbc.vercel.app
- **Anon key format:** new `sb_publishable_*` short key (NOT legacy JWT anon key).

---

## 3. Current Project Structure

```
src/
  app/
    layout.tsx                Root: fonts (IBM Plex Sans + Cairo), providers
    template.tsx              Per-navigation fade transition
    page.tsx                  Homepage (7 sections, curated)
    globals.css               Design tokens + base + bespoke classes (~2100 lines)
    loading.tsx               Federation splash (LoadingScreen)
    about/ news/ tournaments/ Public interior pages (PageHeader + rebuilt sections)
    register/page.tsx         Public club-registration form → enrollments (no account)
    login/page.tsx            Staff/parent portal (no signup)
    api/admin/create-user/route.ts   Admin-only account creation (service role)
    dashboard/
      page.tsx                Redirect to DEFAULT_DASHBOARD
      account/page.tsx        Self-serve name + password change (any role)
      admin/ coach/ editor/ player/ parent/   One route per role
  components/
    ui/                       Button, Card, Badge, Container, Eyebrow, Separator,
                              SectionTitle (+ index barrel) — cva primitives
    brand/                    Logo, SocialIcons, LoadingScreen
    layout/                   Navbar, Footer, PageHeader
    motion/                   Reveal, ScrollProgress (SectionDivider unused)
    home/                     Hero, Stats, AboutPreview, NewsPreview,
                              TournamentsPreview, BoardOfDirectors, Gallery
    admin/                    UsersManager, LinksManager, CrudShell, configs,
                              EnrollmentsList, CoachAssignments (legacy)
    coach/                    PlayersList, AttendanceTaker, ParticipationsEditor,
                              UnlinkedCoachBanner
    player/                   PlayerTasks, PlayerProfile
    tasks/                    TasksManager, SubmissionsReviewer, TaskFormModal
    dashboard/                DashboardShell (shared frame)
  context/                    AuthContext, LangContext
  hooks/                      useRequireAuth, useCurrentCoach, useMediaQuery
  lib/                        auth.ts, rbac.ts, utils.ts (cn), motion.ts,
                              logo.ts, supabase/{client,server,middleware},
                              queries/home.ts
middleware.ts                 Auth + role-gating
supabase/migrations/          0001 … 0009
.env.example                  Documents required env vars
HANDOFF.md                    This file
```

**Routing:** Public: `/`, `/about`, `/news`, `/tournaments`, `/register`, `/login`. Gated: `/dashboard/{admin,coach,editor,player,parent}`, `/dashboard/account`. API: `/api/admin/create-user`. `/auth/callback`.

**Component architecture:** `src/components/ui/*` are the reusable design-system primitives (token-driven, bilingual-aware, cva variants). Public sections compose them. Dashboards use the shared `DashboardShell` + role-specific feature components; dashboard internals still use legacy bespoke CSS classes (`panel`, `dtable`, `kpi-tile`, `.form-inp`) which re-skin via re-pointed tokens.

---

## 4. Implemented Features

**Public site (complete, building clean):**
- Federation design system (tokens, Tailwind theme, fonts, ui primitives).
- Cinematic Hero (video bg + dark overlay, animated chessboard + drifting pieces, stats, scroll indicator, reduced-motion + mobile gating).
- Stats (animated counters), AboutPreview (dark institutional band), NewsPreview (featured + grid, CMS-ready, branded cover fallback), TournamentsPreview (date badges, status, live countdown, calendar list), BoardOfDirectors (chair/secretary/roster/executive, real data + portraits), Gallery (editorial masonry + accessible lightbox).
- Navbar (transparent→solid, accessible dropdown, mobile drawer, skip link), Footer (pre-footer CTA, partners, contact, newsletter form, back-to-top).
- Interior pages on shared `PageHeader`. `/register` = public club form (→ `enrollments`, no account). `/login` = staff/parent portal.
- Mobile optimization pass, premium motion pass (shared Reveal, page transitions, button press), final polish pass.

**Auth/RBAC (code complete; DB activation pending):**
- 5-role model (admin/editor/coach/player/parent) in `auth.ts` + `rbac.ts` permission matrix + `ROLE_NAV`.
- Middleware + `useRequireAuth` role gating; `normaliseRole` (5 roles, unknown→player).
- Admin-only account creation API (`/api/admin/create-user`, service role, parent-link enforced for players, transactional rollback).
- Admin dashboard: Users (with create-account modal), **Links** (parent↔player, coach↔player, **roster↔login bridge**), tasks, submissions, players/coaches CRUD, tournaments, enrollments, news, gallery.
- Coach dashboard: tasks, submissions (grade/feedback), players (coach-scoped), attendance, participations.
- Editor dashboard: news + gallery CRUD, join requests (read).
- Player dashboard: overview, tasks, history, profile.
- Parent dashboard: **read-only** monitor — assignments, attendance (via roster bridge), progress, coach notes; multi-child selector; empty state.
- `/dashboard/account`: self-serve name + password change.
- Migrations `0008` (RBAC + relations + RLS) and `0009` (attendance roster↔auth bridge) written.

---

## 5. UI/UX Direction

- **Structure:** Fujairah-style federation hierarchy (institutional masthead, tight homepage, real index→detail intent), recreated for Sharjah Ladies, never copied.
- **Aesthetic:** Official UAE sports federation. Premium, formal, trustworthy.
- **Colors (tokens in `globals.css` `:root` + mirrored in `tailwind.config.ts`):**
  - Surfaces: neutral whites `#FFFFFF`→`#E6E6E2` (no cream).
  - Ink: `#111111` near-black (tinted), text scale to `#8C8C8A`.
  - Green (primary): `--ds-emerald-700 #0A5234`, hover `#117A4F`. Tailwind alias `forest-*`.
  - Red (accent, sparing): `#C8102E`. Tailwind alias `scarlet-*`.
  - Dark institutional band gradient: `linear-gradient(170deg,#0C1310,#0A1F16 55%,#070B09)`.
  - UAE flag hairline motif: `linear-gradient(90deg,#C8102E 33.3%,#fff 33.3% 66.6%,#117A4F 66.6%)`.
  - Gold removed (4-color brief).
- **Typography:** Latin = **IBM Plex Sans** (mapped to legacy CSS vars `--font-inter`/`--font-playfair`); Arabic = **Cairo** (`--font-cairo`/`--font-tajawal`). Fluid `clamp()` display scale `.t-hero/.t-h1..h4/.t-lead/.t-stat` with phone-safe minimums, RTL word-break guards. Larger sizes than the original.
- **Motion:** Single ease-out signature curve (`EASE_EMPHASIS` `[0.16,1,0.3,1]`). Shared `Reveal` (scroll), `app/template.tsx` (page), button press, hover lift. All gated by `useReducedMotion()` + `useIsMobile()`. No bounce/elastic, no glow.
- **Layout philosophy:** Left-aligned institutional composition, hairline-ruled section bands, `SectionTitle` headers with red-ruled kicker, generous container rhythm, deliberate light/dark cadence between sections, true `[dir]` RTL with `.ar/.en` bilingual spans.

---

## 6. Role System

Roles in `src/lib/auth.ts` (`UserRole`) and `src/lib/rbac.ts` (permission matrix `can()` + `ROLE_NAV`). RLS in migrations 0005/0008/0009 is the real boundary; `rbac.ts` mirrors it for UI gating.

- **ADMIN** — full control. Only role that creates accounts (via `/api/admin/create-user`). Manages all users/roles, parent↔player + coach↔player links, roster↔login bridge, tasks, submissions, players/coaches roster, tournaments, news, gallery, join requests, analytics. RLS: `is_admin()` → `* admin all` everywhere. Bootstrap: `gmsherifashraf@gmail.com` auto-promoted in 0005.
- **EDITOR** — content only. Full CRUD on `gallery_images` and `news`; read `enrollments`/join requests. **No** user/role management. RLS: `is_editor()` policies on gallery/news (all) + enrollments (select).
- **COACH** — manages only assigned players. Tasks (create/edit own, `created_by`), submissions (grade/feedback on own tasks), attendance, participations, training material, player evaluations. Coach↔player scoping via `coach_assignments` (roster, legacy) and `coach_player_relationships` (auth, new). RLS: `is_coach()` + created_by + `coaches_player()`.
- **PLAYER** — student. View assigned tasks, submit answers/files, view feedback, view own progress. RLS: `is_player()` + `assigned_to/player_id = auth.uid()`. Every player MUST be linked to a parent (enforced in the create-account API).
- **PARENT** — strictly read-only monitor of linked child(ren). Sees assignments, attendance, progress, coach notes, achievements. Cannot edit anything. RLS: `is_parent()` + `is_parent_of()` (tasks/submissions/profile) and `is_parent_of_roster()` (attendance via the `players.profile_id` bridge).

---

## 7. Database Architecture

**Two coexisting models — critical to understand:**
- **Roster model** (0001): `players`, `coaches`, `attendance`, `participations`, `coach_assignments`, `tournaments`, `news`, `enrollments`. Keyed by their own table UUIDs (NOT auth users).
- **Auth model** (0005): `profiles` (mirrors `auth.users`, holds `role`), `tasks`, `submissions`. Keyed by `auth.users.id`.
- **Bridge** (0009): `players.profile_id → auth.users(id)` connects a roster player to their login. Set via the admin Links tab.

**Relationship tables (0008):** `parent_player_relationships` (`unique(player_id)` — one parent per player), `coach_player_relationships` (coach↔player many-to-many). Both keyed by `auth.users.id`.

**Views:** `join_requests` (= `enrollments`), `players_without_parent`, `roster_players_unbridged`.

**Helper functions (security-definer, RLS-safe):** `user_role()`, `is_admin()`, `is_coach()`, `is_player()`, `is_editor()`, `is_parent()`, `is_parent_of(uuid)`, `coaches_player(uuid)`, `is_parent_of_roster(uuid)`.

**Triggers:** `handle_new_user` (auto-creates profile, default role `player`), `sync_role_to_metadata` (mirrors `profiles.role` → JWT `raw_user_meta_data.role` so middleware reads role without a DB hit), `set_updated_at`.

**Migrations:** 0001 base · 0003 set_updated_at · 0004 coach_assignments · 0005 role refactor (enum admin/coach/player, profiles/tasks/submissions, RLS) · 0006 gallery_images · 0007 add editor/parent enum · 0008 multirole RBAC (relations + helpers + RLS + views) · 0009 attendance bridge.

**Auth flow:** `signIn` (password) → profile role read → `ROLE_DASHBOARD[role]`. Login hard-navigates with `window.location.assign`. `middleware.ts` calls `getUser()`, redirects unauth→`/login`, auth-on-`/login`→role dashboard, wrong dashboard→correct. `AuthContext` is the deadlock-sensitive area (see CLAUDE.md — onAuthStateChange must stay sync, profile fetch deferred to microtask, 4s watchdog).

---

## 8. Remaining Tasks (priority order)

1. **Activate DB (BLOCKING):** apply migration `0008` then `0009` in Supabase SQL editor (run the two `ALTER TYPE … ADD VALUE` lines separately if it errors 55P04); set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` AND Vercel; disable signup in Supabase Auth dashboard.
2. **End-to-end auth test:** admin creates each role → Links (parent, coach, roster↔login bridge) → log in as each role → verify RLS actually scopes data; fix breakages.
3. **Reconcile the two coach-link mechanisms:** legacy `coach_assignments` (roster) vs new `coach_player_relationships` (auth). The coach dashboard still uses the legacy roster path; decide on one source of truth and migrate.
4. **File uploads (Supabase Storage):** buckets + upload UI for player submission files and coach training material (currently URL text fields only).
5. **Dashboard internal polish:** dashboard feature components still use legacy bespoke CSS; align to the federation token system (shell is already polished).
6. **Production readiness:** sitemap, robots, per-page metadata, OG image, Lighthouse perf + a11y pass, real 404/error pages.
7. **Content entry:** real news, tournaments, gallery images, partner logos, Chairperson message.
8. **Commit & deploy:** this work lives in an uncommitted git worktree (see §11) — it is NOT on `main`/production yet.

---

## 9. Current Issues / Known Incomplete Areas

- **Migrations 0008/0009 NOT applied to live DB** (user applying). Until then the 5-role system, relations, and parent monitoring are inert. RLS is untested against live data.
- **`SUPABASE_SERVICE_ROLE_KEY` not set** — admin "Create Account" returns a clear 500 until added (server + Vercel).
- **Signup not yet disabled** in the Supabase Auth dashboard.
- **Roster↔auth duality:** attendance/participations are roster-keyed; tasks/submissions auth-keyed. Parent attendance only flows after admin sets the roster↔login bridge for each player. Two coach-link tables overlap (legacy `coach_assignments` vs new `coach_player_relationships`).
- **`attendance` schema assumption:** parent view + `is_parent_of_roster` assume `attendance.player_id` references roster `players.id` (confirmed from 0001) and a `status` enum (`present/absent/late/excused`).
- **Dashboard internals** use legacy CSS classes (functional, not fully on-brand); admin/coach pages use their own local `NAV` arrays, not `rbac.ROLE_NAV` (minor inconsistency; editor/parent/player use `ROLE_NAV`).
- **No file upload** infrastructure (Storage) yet.
- **Two lockfiles** (repo root + worktree) cause a Next "inferred workspace root" warning; harmless.
- **Build env:** `.env.local` was copied into the worktree so `next build` prerender succeeds; production relies on Vercel env vars.

---

## 10. Design System

- **Tokens:** `src/app/globals.css` `:root` (`--ds-*` color/type/space/shadow/motion) mirrored in `tailwind.config.ts`. Legacy alias names kept and re-pointed (e.g. `forest`, `scarlet`, `cream`, `ink`, `emerald`, `green`) so the whole codebase re-skins with zero churn.
- **Fonts:** loaded in `app/layout.tsx` via `next/font` — IBM Plex Sans (Latin) + Cairo (Arabic), assigned to the existing CSS-variable names. `.font-disp` = display.
- **Tailwind:** colors (forest/scarlet/cream/onyx/text/line/honor scales), `fontSize` (eyebrow/caption + fluid `d-sm..d-xl`), `container`, negative z-index, subtle de-tinted shadows (`shadow-card/feature/emerald/scarlet/dark`), `transitionTimingFunction.emphasis`, mobile rules (`pointer:coarse` 44px targets, text-size-adjust, safe-area helpers `.safe-b/.safe-t/.overscroll-contain`).
- **Reusable UI (`src/components/ui/`):** `Button` (variants primary/red/secondary/ghost/light × sm/md/lg, press micro-interaction), `Card`+`CardBody`+`CardTitle`, `Badge`, `Container`, `Eyebrow`, `Separator` (plain/flag/node), `SectionTitle` (bilingual). All via `cn()` (`src/lib/utils.ts`) + cva.
- **Layout/motion:** `layout/PageHeader` (federation masthead, breadcrumb), `motion/Reveal` + `RevealStagger` + `childVariants`, `motion/ScrollProgress`, `app/template.tsx`.
- **Theme:** light, federation. Dark only as deliberate institutional bands. No dark-mode toggle.

---

## 11. Deployment Status

- **Vercel:** project `project-oimbc`, auto-deploys on push to `main`. Live: https://project-oimbc.vercel.app
- **⚠ This session's work is in a git worktree (`claude/keen-banach-92d563`), NOT committed or pushed.** The live site does NOT yet have the redesign or the auth system. Committing/merging to `main` is a pending, deliberate step.
- **Environment variables:**
  - `NEXT_PUBLIC_SUPABASE_URL` — set (root `.env.local` + Vercel).
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — set (new `sb_publishable_*` format).
  - `SUPABASE_SERVICE_ROLE_KEY` — **NOT set**; required for admin account creation (add to `.env.local` and Vercel). Documented in `.env.example`.
- **Supabase connection:** working with anon key for public/data reads. Service-role path inert until key added. Migrations 0001–0007 assumed applied; **0008/0009 pending**.
- **Build status:** local `npx tsc --noEmit` and `npm run build` both green across all routes (with `.env.local` present in the worktree). Dev server runs via the preview tool on port 3000.

---

## 12. Next Session Starter

> Paste this into a new Claude session to resume with full context:

```
Resume the Chess & Culture Club for Women (Sharjah) project. Read HANDOFF.md
at the project root first — it has full context. Working dir is a git worktree
on branch claude/keen-banach-92d563 (NOT main; nothing pushed yet).

State: public federation redesign + 5-role auth/RBAC (admin/editor/coach/
player/parent) are code-complete and building clean (tsc + next build green).
Stack: Next.js 16 App Router, Tailwind 3.4, framer-motion, Supabase, TS, cva
primitives in src/components/ui. Two DB models bridged by players.profile_id:
roster (0001) + auth (0005); relations/RLS in migrations 0008 + 0009.

BLOCKING before anything live: (1) apply supabase/migrations/0008 then 0009
in the Supabase SQL editor (run the two ALTER TYPE ADD VALUE lines separately
if 55P04); (2) set SUPABASE_SERVICE_ROLE_KEY in .env.local + Vercel;
(3) disable signup in Supabase Auth dashboard.

Then priority roadmap (HANDOFF.md §8): end-to-end role test → reconcile the
two coach-link tables (coach_assignments vs coach_player_relationships) →
file uploads (Supabase Storage) → dashboard internal polish → production
readiness (SEO/Lighthouse/error pages) → commit & deploy to main.

Respect CLAUDE.md: the AuthContext onAuthStateChange deadlock rule is
load-bearing — do not make it async. Verify with tsc + next build; the auth
system is admin-gated so build/typecheck is the honest verification until
migrations are applied. Ask before destructive/live-DB/push actions.

Tell me which roadmap item to start, or I'll begin with the end-to-end
auth test plan.
```
