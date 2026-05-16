-- =============================================================
-- Seed data for the chess club dashboards.
--
-- Idempotent: every row uses a fixed UUID + ON CONFLICT DO NOTHING
-- so re-running this script will not duplicate data. Existing rows
-- you've added manually (with auto-generated UUIDs) are untouched.
--
-- Run AFTER 0001_chess_club_schema.sql and 0002_coach_write_policies.sql.
-- Paste into Supabase SQL editor and click Run.
-- =============================================================

begin;

-- ── Players ──────────────────────────────────────────────────
insert into public.players (id, name, rating, age, image_url) values
  ('11111111-1111-1111-1111-000000000001', 'Layla Al-Rashid',    1842, 14, null),
  ('11111111-1111-1111-1111-000000000002', 'Reem Al-Ali',        1780, 15, null),
  ('11111111-1111-1111-1111-000000000003', 'Aisha bint Hamad',   1620, 13, null),
  ('11111111-1111-1111-1111-000000000004', 'Hana Khalifa',       1456, 12, null),
  ('11111111-1111-1111-1111-000000000005', 'Sara Mansour',       1320, 11, null),
  ('11111111-1111-1111-1111-000000000006', 'Mariam Al-Naimi',    1180, 10, null),
  ('11111111-1111-1111-1111-000000000007', 'Noor Al-Sayed',       980, 10, null),
  ('11111111-1111-1111-1111-000000000008', 'Noor Saeed',         null,  9, null)
on conflict (id) do nothing;

-- ── Coaches ──────────────────────────────────────────────────
insert into public.coaches (id, name, title, image_url) values
  ('22222222-2222-2222-2222-000000000001', 'Fatima Al-Maktoum', 'Head Coach',         null),
  ('22222222-2222-2222-2222-000000000002', 'Aisha Khan',        'Assistant Coach',    null),
  ('22222222-2222-2222-2222-000000000003', 'Maryam Hosseini',   'Junior Programs',    null),
  ('22222222-2222-2222-2222-000000000004', 'Sarah Williams',    'Tournament Trainer', null)
on conflict (id) do nothing;

-- ── Tournaments ──────────────────────────────────────────────
insert into public.tournaments (id, name, date, location, description) values
  ('33333333-3333-3333-3333-000000000001', 'UAE National Championship 2025', '2025-12-10', 'Dubai',    'Annual national chess championship — girls under-16 division.'),
  ('33333333-3333-3333-3333-000000000002', 'Sharjah Open 2026',              '2026-02-15', 'Sharjah',  'Open swiss-system tournament hosted by Sharjah Cultural Center.'),
  ('33333333-3333-3333-3333-000000000003', 'Arab Girls Chess Cup 2026',      '2026-04-22', 'Abu Dhabi','Regional cup featuring the strongest junior girls from across the Arab world.'),
  ('33333333-3333-3333-3333-000000000004', 'Emirates Youth Cup 2026',        '2026-05-18', 'Sharjah',  'Upcoming — registrations open. Multiple age categories.'),
  ('33333333-3333-3333-3333-000000000005', 'Gulf Junior Championship 2026',  '2026-07-08', 'Doha',     'Six-day classical event for the GCC junior squad.')
on conflict (id) do nothing;

-- ── Participations (past tournaments) ────────────────────────
insert into public.participations (player_id, tournament_id, result, score) values
  -- UAE National Championship 2025
  ('11111111-1111-1111-1111-000000000001', '33333333-3333-3333-3333-000000000001', '1st',     6.5),
  ('11111111-1111-1111-1111-000000000002', '33333333-3333-3333-3333-000000000001', '4th',     5.0),
  ('11111111-1111-1111-1111-000000000003', '33333333-3333-3333-3333-000000000001', '8th',     4.0),
  ('11111111-1111-1111-1111-000000000004', '33333333-3333-3333-3333-000000000001', '12th',    3.5),

  -- Sharjah Open 2026
  ('11111111-1111-1111-1111-000000000001', '33333333-3333-3333-3333-000000000002', '2nd',     6.0),
  ('11111111-1111-1111-1111-000000000002', '33333333-3333-3333-3333-000000000002', '3rd',     5.5),
  ('11111111-1111-1111-1111-000000000003', '33333333-3333-3333-3333-000000000002', '6th',     4.5),
  ('11111111-1111-1111-1111-000000000005', '33333333-3333-3333-3333-000000000002', 'withdrew', 1.0),

  -- Arab Girls Chess Cup 2026
  ('11111111-1111-1111-1111-000000000001', '33333333-3333-3333-3333-000000000003', '3rd',     5.5),
  ('11111111-1111-1111-1111-000000000002', '33333333-3333-3333-3333-000000000003', '5th',     5.0),
  ('11111111-1111-1111-1111-000000000004', '33333333-3333-3333-3333-000000000003', '11th',    3.5)
on conflict (player_id, tournament_id) do nothing;

-- ── Attendance (last 4 weeks of M/W/F sessions) ──────────────
-- Helper CTE pattern: insert each row with explicit dates so it's
-- portable across timezones.
insert into public.attendance (player_id, date, status, note) values
  -- 2026-04-13 (Mon)
  ('11111111-1111-1111-1111-000000000001', '2026-04-13', 'present', null),
  ('11111111-1111-1111-1111-000000000002', '2026-04-13', 'present', null),
  ('11111111-1111-1111-1111-000000000003', '2026-04-13', 'present', null),
  ('11111111-1111-1111-1111-000000000004', '2026-04-13', 'late',    'arrived 15 min late'),
  ('11111111-1111-1111-1111-000000000005', '2026-04-13', 'present', null),
  ('11111111-1111-1111-1111-000000000006', '2026-04-13', 'absent',  null),
  ('11111111-1111-1111-1111-000000000007', '2026-04-13', 'present', null),
  ('11111111-1111-1111-1111-000000000008', '2026-04-13', 'absent',  null),

  -- 2026-04-15 (Wed)
  ('11111111-1111-1111-1111-000000000001', '2026-04-15', 'present', null),
  ('11111111-1111-1111-1111-000000000002', '2026-04-15', 'present', null),
  ('11111111-1111-1111-1111-000000000003', '2026-04-15', 'excused', 'family travel'),
  ('11111111-1111-1111-1111-000000000004', '2026-04-15', 'present', null),
  ('11111111-1111-1111-1111-000000000005', '2026-04-15', 'present', null),
  ('11111111-1111-1111-1111-000000000006', '2026-04-15', 'present', null),
  ('11111111-1111-1111-1111-000000000007', '2026-04-15', 'absent',  null),
  ('11111111-1111-1111-1111-000000000008', '2026-04-15', 'present', null),

  -- 2026-04-17 (Fri)
  ('11111111-1111-1111-1111-000000000001', '2026-04-17', 'present', null),
  ('11111111-1111-1111-1111-000000000002', '2026-04-17', 'late',    null),
  ('11111111-1111-1111-1111-000000000003', '2026-04-17', 'present', null),
  ('11111111-1111-1111-1111-000000000004', '2026-04-17', 'present', null),
  ('11111111-1111-1111-1111-000000000005', '2026-04-17', 'absent',  null),
  ('11111111-1111-1111-1111-000000000006', '2026-04-17', 'present', null),
  ('11111111-1111-1111-1111-000000000007', '2026-04-17', 'absent',  null),
  ('11111111-1111-1111-1111-000000000008', '2026-04-17', 'absent',  null),

  -- 2026-04-20 (Mon)
  ('11111111-1111-1111-1111-000000000001', '2026-04-20', 'present', null),
  ('11111111-1111-1111-1111-000000000002', '2026-04-20', 'present', null),
  ('11111111-1111-1111-1111-000000000003', '2026-04-20', 'present', null),
  ('11111111-1111-1111-1111-000000000004', '2026-04-20', 'present', null),
  ('11111111-1111-1111-1111-000000000005', '2026-04-20', 'present', null),
  ('11111111-1111-1111-1111-000000000006', '2026-04-20', 'late',    null),
  ('11111111-1111-1111-1111-000000000007', '2026-04-20', 'present', null),
  ('11111111-1111-1111-1111-000000000008', '2026-04-20', 'absent',  null),

  -- 2026-04-22 (Wed) — Cup day, several excused
  ('11111111-1111-1111-1111-000000000001', '2026-04-22', 'excused', 'Arab Girls Cup'),
  ('11111111-1111-1111-1111-000000000002', '2026-04-22', 'excused', 'Arab Girls Cup'),
  ('11111111-1111-1111-1111-000000000003', '2026-04-22', 'present', null),
  ('11111111-1111-1111-1111-000000000004', '2026-04-22', 'excused', 'Arab Girls Cup'),
  ('11111111-1111-1111-1111-000000000005', '2026-04-22', 'present', null),
  ('11111111-1111-1111-1111-000000000006', '2026-04-22', 'present', null),
  ('11111111-1111-1111-1111-000000000007', '2026-04-22', 'absent',  null),
  ('11111111-1111-1111-1111-000000000008', '2026-04-22', 'present', null),

  -- 2026-04-24 (Fri)
  ('11111111-1111-1111-1111-000000000001', '2026-04-24', 'present', null),
  ('11111111-1111-1111-1111-000000000002', '2026-04-24', 'present', null),
  ('11111111-1111-1111-1111-000000000003', '2026-04-24', 'present', null),
  ('11111111-1111-1111-1111-000000000004', '2026-04-24', 'absent',  null),
  ('11111111-1111-1111-1111-000000000005', '2026-04-24', 'present', null),
  ('11111111-1111-1111-1111-000000000006', '2026-04-24', 'present', null),
  ('11111111-1111-1111-1111-000000000007', '2026-04-24', 'absent',  null),
  ('11111111-1111-1111-1111-000000000008', '2026-04-24', 'absent',  null),

  -- 2026-04-27 (Mon)
  ('11111111-1111-1111-1111-000000000001', '2026-04-27', 'present', null),
  ('11111111-1111-1111-1111-000000000002', '2026-04-27', 'present', null),
  ('11111111-1111-1111-1111-000000000003', '2026-04-27', 'present', null),
  ('11111111-1111-1111-1111-000000000004', '2026-04-27', 'present', null),
  ('11111111-1111-1111-1111-000000000005', '2026-04-27', 'late',    null),
  ('11111111-1111-1111-1111-000000000006', '2026-04-27', 'present', null),
  ('11111111-1111-1111-1111-000000000007', '2026-04-27', 'absent',  null),
  ('11111111-1111-1111-1111-000000000008', '2026-04-27', 'present', null),

  -- 2026-05-04 (Mon, this week)
  ('11111111-1111-1111-1111-000000000001', '2026-05-04', 'present', null),
  ('11111111-1111-1111-1111-000000000002', '2026-05-04', 'present', null),
  ('11111111-1111-1111-1111-000000000003', '2026-05-04', 'present', null),
  ('11111111-1111-1111-1111-000000000004', '2026-05-04', 'present', null),
  ('11111111-1111-1111-1111-000000000005', '2026-05-04', 'present', null),
  ('11111111-1111-1111-1111-000000000006', '2026-05-04', 'absent',  null),
  ('11111111-1111-1111-1111-000000000007', '2026-05-04', 'absent',  null),
  ('11111111-1111-1111-1111-000000000008', '2026-05-04', 'absent',  null)
on conflict (player_id, date) do nothing;

-- ── News ─────────────────────────────────────────────────────
insert into public.news (id, title, category, excerpt, body, image_url, published_at) values
  ('44444444-4444-4444-4444-000000000001',
   'Layla Al-Rashid Wins UAE National Championship',
   'Achievement',
   'Our top junior took home gold at the under-16 division with 6.5/7 — an undefeated run.',
   'In a commanding seven-round performance at the UAE National Championship in Dubai, Layla Al-Rashid finished 6.5/7 and clinched the gold medal in the under-16 girls section. Special thanks to her coaches and teammates for the months of preparation.',
   null,
   '2026-04-28 09:00:00+00'),
  ('44444444-4444-4444-4444-000000000002',
   'Summer Intensive Camp 2026 — Registration Open',
   'Program',
   'Two weeks of focused training for ages 8–16. Limited spots — early-bird discount until May 30.',
   'The annual summer intensive returns July 6–17 with three program tiers (Little Queens, Rising Stars, Competitive Juniors) and daily endgame, tactics, and game-review sessions. Contact the club to register.',
   null,
   '2026-04-15 12:00:00+00'),
  ('44444444-4444-4444-4444-000000000003',
   'May Newsletter — Upcoming Events',
   'Newsletter',
   'Emirates Youth Cup, board updates, and a coach spotlight.',
   'Draft body — TBD before publish.',
   null,
   null)
on conflict (id) do nothing;

-- ── Board members ────────────────────────────────────────────
insert into public.board_members (id, name, role, image_url, bio) values
  ('55555555-5555-5555-5555-000000000001',
   'H.E. Sheikha Maryam Al-Qasimi',
   'Patron',
   null,
   'Patron of the Chess & Culture Club since its founding in 2017. Long-time advocate for girls'' education in Sharjah.'),
  ('55555555-5555-5555-5555-000000000002',
   'Dr. Sarah Al-Mansoori',
   'Chairperson',
   null,
   'Educator and author. Leads the club''s strategic direction and external partnerships.'),
  ('55555555-5555-5555-5555-000000000003',
   'Eng. Layla Al-Suwaidi',
   'Vice Chair',
   null,
   'Civil engineer and FIDE-rated player. Oversees competition and tournament logistics.'),
  ('55555555-5555-5555-5555-000000000004',
   'Hala Mohammed',
   'Treasurer',
   null,
   'Chartered accountant managing club finances and grant administration.')
on conflict (id) do nothing;

commit;

-- Sanity check: how many rows landed?
select 'players'        as table_name, count(*) from public.players        union all
select 'coaches',           count(*) from public.coaches        union all
select 'tournaments',       count(*) from public.tournaments    union all
select 'participations',    count(*) from public.participations union all
select 'attendance',        count(*) from public.attendance     union all
select 'news',              count(*) from public.news           union all
select 'board_members',     count(*) from public.board_members;
