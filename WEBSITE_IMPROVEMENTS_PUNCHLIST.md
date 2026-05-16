# Website Improvements Punch List

Generated 2026-05-16 from the state of `main` after the federation redesign,
5-role RBAC, real Supabase Storage uploads, RBAC auth-model cleanup, and the
dashboard → federation-token alignment pass (`e9247de`).

Most of these flow directly out of that token-alignment + uploads work: the
token pass re-pointed `globals.css` but the inline-styled feature components
that landed in the same window were not swept, leaving a handful of legacy
palette leaks and one genuine color collision.

Ranked. Effort: S = <1h, M = a few hours, L = a day+.

---

### 1. `.badge-gold` collides with `.badge-green` — status badges are indistinguishable  ✅ SHIPPED
**Where:** `src/app/globals.css:368`; surfaces in `src/components/admin/EnrollmentsList.tsx:35` (join-request "Pending"), `src/components/admin/configs.tsx:89,111,115` (News/Gallery "Draft", gallery "gold" accent).
**Problem:** `e9247de` repointed `.dot-gold` and `.kpi-tile.t-gold` to a distinct muted neutral (`--ds-text-3`) but repointed `.badge-gold` to the *exact same values as `.badge-green`* (`rgba(10,82,52,.07)` / `--ds-emerald-700`). Result: a **Pending** join request looks identical to an **Approved** one, and a **Draft** news/gallery item looks identical to **Published**. This is a real triage hazard for editors/admins.
**Fix:** repoint `.badge-gold` to the same muted-neutral treatment the rest of the legacy-gold family already uses, so it reads as a distinct "in-progress / draft" state. Centralized, zero call-site churn.
**Effort:** S.

### 2. Legacy `#1E5BAA` blue file/attachment links survived the token pass  ✅ SHIPPED
**Where:** `src/components/ui/FileUpload.tsx:59`, `src/components/player/PlayerTasks.tsx:172,186`, `src/components/tasks/SubmissionsReviewer.tsx:183`, `src/components/tasks/TasksManager.tsx:183`.
**Problem:** `e9247de`'s message explicitly says it removed "the dead legacy palette (… `#1E5BAA` blue)". It did so in `globals.css`, but the uploads feature (`0f4e27f`) and task components render file links with inline `style={{ color: "#1E5BAA" }}` — the exact blue the brief bans. Off-brief on every dashboard that shows an uploaded file.
**Fix:** swap the inline hex for the federation emerald token used everywhere else for links.
**Effort:** S.

### 3. Admin & Coach dashboards hardcode legacy role colors instead of `ROLE_COLOR`  ✅ SHIPPED
**Where:** `src/app/dashboard/admin/page.tsx:49` (`roleColor="#D42B3C"`), `src/app/dashboard/coach/page.tsx:37` (`roleColor="#007A38"`).
**Problem:** `src/lib/auth.ts:44` already defines a federation-token `ROLE_COLOR` map (admin `#C8102E`, coach `#0A5234`, …) and editor/parent/player dashboards consume it. Admin and coach instead pass the dead legacy crimson/green. The role chip + avatar in `DashboardShell` therefore render off-brief for the two highest-traffic roles.
**Fix:** import and use `ROLE_COLOR.admin` / `ROLE_COLOR.coach`.
**Effort:** S.

### 4. Coach dashboard internals still use legacy hex inline styles
**Where:** `src/app/dashboard/coach/page.tsx:157,165-166` (`#007A38`, `#141414`, `#999`), plus `AttendanceTaker.tsx:23-24,205`, `ParticipationsEditor.tsx:217,275`, `PlayersList.tsx:132,140`, `PlayerProfile.tsx:68` (`#007A38`, `#A07820`, `#D42B3C`).
**Problem:** `e9247de` aligned the shared CSS classes but the coach/player feature components still inline the dead legacy palette (`#007A38` green, `#A07820` gold, `#D42B3C` crimson). Functional but visibly off the federation palette up close.
**Why it matters:** consistency; this is HANDOFF §8 item 5 ("dashboard internal polish") only partially done.
**Fix:** replace inline hex with the `--ds-*` tokens / Tailwind aliases. Mechanical but spread across ~7 files; do as one focused sweep.
**Effort:** M.

### 5. `ROLE_NAV.coach` diverges from the coach dashboard's real tabs (and a "Material" tab is advertised but unbuilt)
**Where:** `src/lib/rbac.ts:77-84` vs `src/app/dashboard/coach/page.tsx:15-22`.
**Problem:** `ROLE_NAV.coach` lists `material` (📚 Material) and `players`/`assignments`/`submissions` keys; the coach page uses its own local `NAV` with `participations`/`tasks` keys and **no** `material` tab. `material.upload` is in the `rbac.ts` permission matrix and `FileUpload`/storage helpers exist, but there is no coach Material UI. Either the nav promises a feature that doesn't exist, or the page silently ignores the canonical nav. Admin has the same local-`NAV`-vs-`ROLE_NAV` split (HANDOFF §9).
**Fix (two options):** (a) trim `ROLE_NAV.coach` to match reality and converge admin/coach onto `ROLE_NAV` like the other three dashboards; or (b) build the Material tab (coach uploads training material via the existing `FileUpload` + `training-material` bucket; admin/players can already see `tasks.attachment_url`). (b) is the higher-value but larger piece.
**Effort:** (a) S–M, (b) M–L.

### 6. `FileUpload` is not tokenized, not bilingual-consistent, and the file input has no label
**Where:** `src/components/ui/FileUpload.tsx`.
**Problem:** It is a `ui/` primitive but uses raw inline styles (no Tailwind/tokens), a bare `<input type="file">` with no associated `<label>` (accessibility), and English-only "Upload failed" fallback error (rest of the app is bilingual `.ar/.en`). No file-type/size constraint or client-side validation before hitting Storage.
**Fix:** wrap the input in a labelled, tokenized control; bilingual error strings; optional `accept`/size guard prop.
**Effort:** M.

### 7. `/login` has no page metadata / title
**Where:** `src/app/login/page.tsx` (client component, no `metadata`).
**Problem:** `16e9f73` added a `register/layout.tsx` to give the client `/register` page a real `<title>`/description, but `/login` (also a client component) was left with the default root title. `robots.ts` disallows `/login`, so SEO impact is nil, but the browser tab / bookmark / share title is still the generic site default.
**Fix:** add a `login/layout.tsx` mirroring `register/layout.tsx` (bilingual title, `robots: { index: false }`).
**Effort:** S.

### 8. Suspense / loading fallbacks are unstyled blanks
**Where:** `src/app/login/page.tsx:20` (`<div style={{ minHeight: "60vh" }} />`), dashboard `Spinner()` helpers (bare `♟` glyph) in coach/admin/etc.
**Problem:** `16e9f73` shipped branded `not-found`/`error`/`global-error` and there is a federation `LoadingScreen` component, but the auth-gated surfaces still flash an empty div or a lone pawn. Inconsistent with the production-readiness pass.
**Fix:** route these through the shared `LoadingScreen` / a skeleton.
**Effort:** S–M.

### 9. Gallery still offers an off-brief "Gold" accent option
**Where:** `src/components/admin/configs.tsx:130` (gallery `accent` select still lists `{ value: "gold" }`), rendered at `:111`.
**Problem:** the brief is a 4-color system with gold explicitly removed; the admin gallery form still lets an editor pick "Gold", which now silently maps to the (broken, see #1) `badge-gold` and to whatever the public Gallery does with `accent="gold"`. New content can still be tagged with a dead accent.
**Fix:** drop the `gold` option from the select; map any legacy `accent="gold"` rows to `ink` at render.
**Effort:** S.

### 10. No automated tests anywhere
**Where:** repo-wide (`package.json` has only `dev`/`build`/`start`/`lint`).
**Problem:** auth deadlock fix, `normaliseRole`, RBAC `can()`/permission matrix, and middleware redirects are load-bearing and entirely untested. The `CLAUDE.md` deadlock gotcha is exactly the kind of regression a unit test would catch.
**Fix:** add Vitest + a focused suite on `rbac.can()`, `normaliseRole`, `ROLE_COLOR`/`ROLE_NAV` completeness (every `UserRole` has an entry), and the `auth.ts` dashboard map. Pure functions, no DB.
**Effort:** M.

### 11. `next.config` / lockfile workspace-root warning
**Where:** repo root + worktree both have a lockfile (HANDOFF §9).
**Problem:** Next infers an ambiguous workspace root and warns on every `dev`/`build`. Harmless but noisy and can mis-resolve the output file tracing root on Vercel.
**Fix:** set `turbopack.root` / `outputFileTracingRoot` in `next.config` to the project dir.
**Effort:** S.

### 12. Public-content empty states depend on unseeded data
**Where:** News/Tournaments/Gallery (`lib/queries/home.ts` consumers).
**Problem:** with an empty DB the public site shows fallback placeholders. Not a code defect, but the site is not launch-ready until real news/tournaments/gallery/board content + partner logos are entered (HANDOFF §8 item 7). Flagged so it isn't forgotten; needs the client, not code.
**Fix:** content entry via admin CRUD once DB migrations are live.
**Effort:** L (content, not engineering) — **needs user/client input.**

### 13. Coach attendance/participations color semantics use legacy gold for "Late"
**Where:** `src/components/coach/AttendanceTaker.tsx:24` (`Late` → `#A07820` gold bg/text).
**Problem:** "Late" is encoded with the removed gold; on-brief there is no caution color, so Late currently reads as an arbitrary brown. Decide the semantic: muted neutral (consistent with the #1 fix) or sparing scarlet.
**Fix:** align "Late" to the same neutral chosen in #1 so all "in-between" states share one treatment.
**Effort:** S.

---

## Shipped in this follow-up branch

Items **1, 2, 3** — the clearly-safe, clearly-valuable, zero-behavior-change
slice that finishes the `e9247de` token pass. One commit each. See branch
`website-improvements-followup`.

## Deliberately deferred (and why)

- **#4, #6, #8, #13**: correct and valuable but each is a multi-file
  inline-style sweep / component rework — medium scope, more diff surface than
  an autonomous safe pass should land unreviewed. Natural next batch.
- **#5(b), #10, #11**: net-new surface (a feature tab / a test harness / build
  config) — worth doing, but a design/scope call the user should weigh in on.
- **#12**: content, not code — needs the client.
