-- =============================================================================
-- 0026_classroom.sql
-- Live classroom: shared board state, chat persistence, raise-hand events,
-- presence snapshots, and a session_analytics view that powers post-class
-- summary cards on the coach / admin dashboards.
--
-- LiveKit handles the WebRTC plane; this migration only persists what the
-- realtime broadcast channel needs to replay or aggregate after the session.
-- Recording is intentionally NOT modeled — academy policy is no recordings.
-- =============================================================================

-- ── 1. Shared board state ───────────────────────────────────────────────────
-- Snapshot of the live board the coach + students are looking at. One row
-- per "lift" (coach moves a piece on the shared board); we keep history so
-- a student joining mid-session can catch up to the current position.
create table if not exists public.session_board_states (
  id           uuid        primary key default gen_random_uuid(),
  session_id   uuid        not null references public.class_sessions(id) on delete cascade,
  fen          text        not null,
  last_move    text,                                                   -- e.g. "e2e4" — for arrow rendering
  ply          int         not null default 0,
  pushed_by    uuid                 references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists session_board_states_session_idx
  on public.session_board_states (session_id, created_at desc);

-- ── 2. Chat persistence (broadcast also fires for live feel) ────────────────
create type public.classroom_chat_kind as enum ('message', 'reaction', 'system');

create table if not exists public.session_chat_messages (
  id           uuid        primary key default gen_random_uuid(),
  session_id   uuid        not null references public.class_sessions(id) on delete cascade,
  author_id    uuid                 references public.profiles(id) on delete set null,
  author_name  text        not null,
  kind         public.classroom_chat_kind not null default 'message',
  body         text        not null check (length(body) between 1 and 2000),
  created_at   timestamptz not null default now()
);

create index if not exists session_chat_session_idx
  on public.session_chat_messages (session_id, created_at);

-- ── 3. Raise-hand events ────────────────────────────────────────────────────
-- The live UI tracks raised hands via presence metadata for instant feedback.
-- This table is the audit trail: when did each student raise + when answered.
create table if not exists public.raise_hand_events (
  id            uuid        primary key default gen_random_uuid(),
  session_id    uuid        not null references public.class_sessions(id) on delete cascade,
  student_id    uuid        not null references public.profiles(id) on delete cascade,
  raised_at     timestamptz not null default now(),
  answered_at   timestamptz,
  answered_by   uuid                 references public.profiles(id) on delete set null
);

create index if not exists raise_hand_session_idx
  on public.raise_hand_events (session_id, raised_at desc);
create index if not exists raise_hand_unanswered_idx
  on public.raise_hand_events (session_id) where answered_at is null;

-- ── 4. Attendance snapshot helper ───────────────────────────────────────────
-- The presence channel computes attendance live; the /api/classroom/.../attendance
-- route writes a final row to public.attendance(session_id, player_id, ...) on
-- session end. We reuse the legacy attendance table (from 0001) via the
-- session_id bridge added in 0013, so no new table is needed here — but we add
-- two columns to capture engagement quality:
do $$
begin
  if exists (select 1 from information_schema.tables
              where table_schema = 'public' and table_name = 'attendance')
  then
    begin
      alter table public.attendance
        add column if not exists joined_at        timestamptz,
        add column if not exists left_at          timestamptz,
        add column if not exists active_seconds   int default 0,
        add column if not exists hand_raises      int default 0;
    exception when others then null;
    end;
  end if;
end $$;

-- ── 5. Session analytics view ───────────────────────────────────────────────
-- One row per class_session with counts the dashboards render.
create or replace view public.session_analytics as
  select
    cs.id                                                                      as session_id,
    cs.class_id,
    cs.starts_at,
    cs.ends_at,
    cs.state,
    coalesce((select count(*) from public.attendance a
              where a.session_id = cs.id), 0)::int                             as attendees,
    coalesce((select avg(a.active_seconds) from public.attendance a
              where a.session_id = cs.id and a.active_seconds > 0), 0)::int    as avg_active_seconds,
    coalesce((select count(*) from public.raise_hand_events r
              where r.session_id = cs.id), 0)::int                             as raise_hand_count,
    coalesce((select count(*) from public.session_chat_messages m
              where m.session_id = cs.id and m.kind = 'message'), 0)::int      as chat_message_count,
    coalesce((select max(ply) from public.session_board_states b
              where b.session_id = cs.id), 0)::int                             as board_ply_count
  from public.class_sessions cs;

grant select on public.session_analytics to authenticated;

-- ── 6. Realtime publication ─────────────────────────────────────────────────
-- The board/chat/hand events all need to flow to subscribers in the room.
do $$
declare t text;
begin
  foreach t in array array[
    'public.session_board_states',
    'public.session_chat_messages',
    'public.raise_hand_events'
  ] loop
    begin
      execute format('alter publication supabase_realtime add table %s', t);
    exception
      when duplicate_object then null;
      when undefined_object then null;
      when undefined_table  then null;
    end;
  end loop;
end $$;

-- ── 7. RLS ──────────────────────────────────────────────────────────────────
alter table public.session_board_states  enable row level security;
alter table public.session_chat_messages enable row level security;
alter table public.raise_hand_events     enable row level security;

-- Helper: is the caller a participant of this session (admin, the assigned
-- coach, or an enrolled player)?
create or replace function public.is_session_participant(s_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_admin()
    or exists (
      select 1 from public.class_sessions cs
       where cs.id = s_id
         and cs.coach_id in (select c.id from public.coaches c where c.user_id = auth.uid())
    )
    or exists (
      select 1
        from public.class_sessions cs
        join public.class_enrollments ce on ce.class_id = cs.class_id
        join public.players p            on p.id = ce.player_id
       where cs.id = s_id
         and p.profile_id = auth.uid()
         and ce.state = 'active'
    );
$$;

grant execute on function public.is_session_participant(uuid) to authenticated;

-- session_board_states: any participant reads, only coach + admin write.
drop policy if exists "board_states: participant reads" on public.session_board_states;
drop policy if exists "board_states: coach writes"      on public.session_board_states;
create policy "board_states: participant reads" on public.session_board_states
  for select to authenticated using (public.is_session_participant(session_id));
create policy "board_states: coach writes" on public.session_board_states
  for insert to authenticated with check (
    public.is_admin() or exists (
      select 1 from public.class_sessions cs
       where cs.id = session_id
         and cs.coach_id in (select c.id from public.coaches c where c.user_id = auth.uid())
    )
  );

-- session_chat_messages: participants read + write.
drop policy if exists "chat: participant reads"  on public.session_chat_messages;
drop policy if exists "chat: participant writes" on public.session_chat_messages;
create policy "chat: participant reads" on public.session_chat_messages
  for select to authenticated using (public.is_session_participant(session_id));
create policy "chat: participant writes" on public.session_chat_messages
  for insert to authenticated with check (
    public.is_session_participant(session_id)
    and (author_id is null or author_id = auth.uid())
  );

-- raise_hand_events: students raise their own, coach + admin can answer.
drop policy if exists "hand: own insert"      on public.raise_hand_events;
drop policy if exists "hand: participant read" on public.raise_hand_events;
drop policy if exists "hand: coach answers"   on public.raise_hand_events;
create policy "hand: own insert" on public.raise_hand_events
  for insert to authenticated
  with check (
    student_id = auth.uid() and public.is_session_participant(session_id)
  );
create policy "hand: participant read" on public.raise_hand_events
  for select to authenticated
  using (public.is_session_participant(session_id));
create policy "hand: coach answers" on public.raise_hand_events
  for update to authenticated
  using (
    public.is_admin() or exists (
      select 1 from public.class_sessions cs
       where cs.id = session_id
         and cs.coach_id in (select c.id from public.coaches c where c.user_id = auth.uid())
    )
  );
