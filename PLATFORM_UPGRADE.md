# Platform upgrade — learning platform (Egypt Chess Academy parity)

Branch: `feat/learning-platform`. Ports the interactive learning-platform layer
from the Egypt Chess Academy sibling project into this site, adapted to the
`src/` layout, `/[locale]` i18n, and federation design tokens.

## What shipped (commits on `feat/learning-platform`)

| Commit | Phase | Adds |
|---|---|---|
| `React 19 + RQ foundation and /play` | 0 + 1A | React 18→19, deps, `Providers` (React Query), env validation; **`/play`** Stockfish-18 workspace (analyze / play / train / review) — verified live |
| `notifications bell, toasts, ratings history` | 1B | toasts (`notify`/sonner), data-layer hooks, **NotificationCenter** bell in dashboard topbar; migrations `0013` (ratings), `0014` (notifications), `0015` (graded emitter) |
| `live classroom (LiveKit + realtime)` | 1C | full **live classroom** (video, shared board, chat, hand-raise, attendance, session lifecycle); migrations `0016`–`0019` |
| `admin Branches/Classes CRUD + token bridge` | 1D | admin **Branches** + **Classes** tabs; `--c-*` federation token aliases |

Everything typechecks (`tsc --noEmit`), and `npm run build` passes with all new
routes (`/play`, `/classroom/*`, `/api/livekit`, `/api/classroom/*`).

## To make it fully live — two manual steps

### 1. Apply the new migrations (in order) in the Supabase SQL editor
Run `supabase/migrations/0013` → `0019` against the production DB. They are
additive and adapted to the existing schema (the `is_admin`/`is_coach`/
`coaches_player`/`is_parent_of_roster` helpers, `players.profile_id`,
`coaches.user_id`, the legacy `attendance` table). `0018` restructures the
`attendance` primary key non-destructively (surrogate id; keeps existing rows).
Back up / run on a branch first.

- `0013_ratings_history` — `rating_events` + `record_rating_event()` + views
- `0014_notifications` — templates/notifications/deliveries/preferences + `notify()`
- `0015_notification_emitters` — grading a submission notifies the player
- `0016_branches_classes` — branches, classes, class_enrollments, class_sessions
- `0017_classroom` — board/chat/raise-hand tables, `session_analytics`, RLS
- `0018_attendance_session_scope` — session-scoped attendance
- `0019_realtime` — add notifications + rating_events to the realtime publication

Until applied, the new surfaces degrade gracefully: the bell shows "all caught
up", Branches/Classes lists are empty, the classroom route 404s a missing session.

### 2. Add LiveKit credentials (only needed for classroom **video**)
Create a free LiveKit Cloud project and set in `.env.local` **and** Vercel:
```
NEXT_PUBLIC_LIVEKIT_URL=wss://<your-project>.livekit.cloud
LIVEKIT_API_KEY=<key>
LIVEKIT_API_SECRET=<secret>
```
Placeholders are already in `.env.local`. Without them, `/api/livekit/token`
returns a clean 503 and the rest of the classroom (board/chat/hand-raise/
attendance over Supabase Realtime) still works.

## How to reach the new surfaces
- **/play** — auth-gated to admin/coach/player. Entry points: player nav
  "Play & Train", coach + admin nav "Analyze".
- **Admin → Branches / Classes** — populate these so classes/sessions exist.
- **Live classroom** — `/classroom/[sessionId]` for a scheduled `class_sessions`
  row. (Coach "start class" + player "join" dashboard widgets are ported under
  `src/components/classroom/` but not yet wired into the dashboards — see below.)

## Not yet done (follow-ups)
- Wire coach/player **live-class entry widgets** (`CoachStartClass`,
  `LiveSessionCallout`, `UpcomingTodayWidget`, `LiveSessionsAllWidget`) into the
  coach/player dashboards, and a classroom scheduler tab for admins.
- **Ratings UI**: a "record rating" action + rating-history charts (needs the
  chart widget kit ported — `EngagementSpark`/`AttendanceHeatmap` are available).
- Parent dashboard **progress charts/heatmap**.
- **Phase 2 back-office** (deferred): payments/invoicing, AI analytics, audit log,
  reports, assessments/assignments depth (Egypt migrations `0014`–`0023`).
- Optional public-site sections Egypt has (Programs / Vision-Mission / Core
  Values / Team).

## Notes
- The live-room stage is a deliberate **dark video stage** (its own `--eca-*`
  tokens in `classroom.css`); the dashboard classroom widgets use the federation
  `--c-*` aliases added to `globals.css`.
- `AuthContext` deadlock workaround and the singleton browser client were left
  untouched; `Providers` wraps `AuthProvider` without reordering it.
