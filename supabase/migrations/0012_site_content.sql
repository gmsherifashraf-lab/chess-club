-- =============================================================================
-- 0012_site_content.sql
--
-- Makes the previously-hardcoded homepage sections (Board of Directors,
-- Partners, Stats) database-backed + admin/editor manageable, mirroring
-- the gallery_images pattern (0006/0008): public read of published rows,
-- admin + editor full write. Seeded with the EXACT current hardcoded
-- values so the public site is unchanged until the club edits them.
--
-- Apply any time after 0008. Idempotent.
-- =============================================================================

-- ── Board of Directors ──────────────────────────────────────────────────────
create table if not exists public.board_members (
  id            uuid        primary key default gen_random_uuid(),
  name_ar       text        not null,
  name_en       text        not null,
  role_ar       text,
  role_en       text,
  honorific_ar  text,
  honorific_en  text,
  photo         text,
  category      text        not null default 'member'
                  check (category in ('chair','secretary','member','executive')),
  sort_order    int         not null default 0,
  is_published  boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Partners ────────────────────────────────────────────────────────────────
create table if not exists public.partners (
  id            uuid        primary key default gen_random_uuid(),
  name_ar       text        not null,
  name_en       text        not null,
  url           text,
  sort_order    int         not null default 0,
  is_published  boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Stats ───────────────────────────────────────────────────────────────────
create table if not exists public.stats (
  id            uuid        primary key default gen_random_uuid(),
  value         int         not null,
  prefix        text,
  suffix        text,
  grouped       boolean     not null default false,
  label_ar      text        not null,
  label_en      text        not null,
  accent        text        check (accent in ('green','red')),
  sort_order    int         not null default 0,
  is_published  boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Self-heal: ensure every column exists even if a table predated this
--    migration with a different shape (create-if-not-exists would skip it).
alter table public.board_members
  add column if not exists name_ar text,
  add column if not exists name_en text,
  add column if not exists role_ar text,
  add column if not exists role_en text,
  add column if not exists honorific_ar text,
  add column if not exists honorific_en text,
  add column if not exists photo text,
  add column if not exists category text default 'member',
  add column if not exists sort_order int default 0,
  add column if not exists is_published boolean default true,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();
alter table public.partners
  add column if not exists name_ar text,
  add column if not exists name_en text,
  add column if not exists url text,
  add column if not exists sort_order int default 0,
  add column if not exists is_published boolean default true,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();
alter table public.stats
  add column if not exists value int,
  add column if not exists prefix text,
  add column if not exists suffix text,
  add column if not exists grouped boolean default false,
  add column if not exists label_ar text,
  add column if not exists label_en text,
  add column if not exists accent text,
  add column if not exists sort_order int default 0,
  add column if not exists is_published boolean default true,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- ── updated_at triggers (reuse the shared fn) ───────────────────────────────
drop trigger if exists set_updated_at_board on public.board_members;
create trigger set_updated_at_board before update on public.board_members
  for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_partners on public.partners;
create trigger set_updated_at_partners before update on public.partners
  for each row execute function public.set_updated_at();
drop trigger if exists set_updated_at_stats on public.stats;
create trigger set_updated_at_stats before update on public.stats
  for each row execute function public.set_updated_at();

-- ── RLS — public read published, admin + editor full write ──────────────────
do $$
declare t text;
begin
  foreach t in array array['board_members','partners','stats'] loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "%s: public read" on public.%I;', t, t);
    execute format($f$create policy "%s: public read" on public.%I
      for select to anon, authenticated
      using (is_published = true or public.is_admin());$f$, t, t);
    execute format('drop policy if exists "%s: admin all" on public.%I;', t, t);
    execute format($f$create policy "%s: admin all" on public.%I
      for all to authenticated
      using (public.is_admin()) with check (public.is_admin());$f$, t, t);
    execute format('drop policy if exists "%s: editor all" on public.%I;', t, t);
    execute format($f$create policy "%s: editor all" on public.%I
      for all to authenticated
      using (public.is_editor()) with check (public.is_editor());$f$, t, t);
    execute format('grant select on public.%I to anon, authenticated;', t);
    execute format('grant insert, update, delete on public.%I to authenticated;', t);
  end loop;
end $$;

-- ── Seed: exact current hardcoded values (idempotent: only if empty) ────────
insert into public.board_members (name_ar, name_en, role_ar, role_en, honorific_ar, honorific_en, photo, category, sort_order)
select * from (values
  ('نجلاء عبدالله أحمد الدرويشي الشامسي','Najla Abdullah Ahmed Al Darwishi Al Shamsi','رئيسة مجلس الإدارة','Chairperson','سعادة','H.E.','/images/board/najla.jpg','chair',0),
  ('ميثاء عيسى خلفان بن عيسى الذبحاني','Maitha Issa Khalfan bin Isa Al Dhabahi','الأمين العام','Secretary General','سعادة','H.E.',null,'secretary',1),
  ('أروى محمد سلطان محمد العويس','Arwa Mohammed Sultan Mohammed Al Owais','عضو مجلس','Board Member','سعادة','H.E.','/images/board/arwa.jpg','member',2),
  ('أمينة جمعة حسن صالح الجسمي','Amina Juma Hassan Saleh Al Jasmi','عضو مجلس','Board Member','سعادة','H.E.','/images/board/amina.jpg','member',3),
  ('إيمان محمد مبارك محمد العلي','Iman Mohammed Mubarak Mohammed Al Ali','عضو مجلس','Board Member','سعادة','H.E.','/images/board/iman.jpg','member',4),
  ('حمدة سالم سلطان العقروبي السويدي','Hamda Salem Sultan Al Aqroubi Al Suwaidi','عضو مجلس','Board Member','سعادة','H.E.','/images/board/hamda.jpg','member',5),
  ('علياء علي غريب أحمد المزمي','Alia Ali Gharib Ahmed Al Mazmi','عضو مجلس','Board Member','سعادة','H.E.','/images/board/alia.jpg','member',6),
  ('آمنة الملا','Amna Al Mulla','المدير التنفيذي','Executive Director',null,null,'/images/board/amna.jpg','executive',7)
) v(name_ar,name_en,role_ar,role_en,honorific_ar,honorific_en,photo,category,sort_order)
where not exists (select 1 from public.board_members);

insert into public.partners (name_ar, name_en, sort_order)
select * from (values
  ('مجلس الشارقة الرياضي','Sharjah Sports Council',0),
  ('اتحاد الإمارات للشطرنج','UAE Chess Federation',1),
  ('مكتب الشارقة لرياضة المرأة','Sharjah Women''s Sport',2),
  ('الاتحاد الآسيوي للشطرنج','Asian Chess Federation',3)
) v(name_ar,name_en,sort_order)
where not exists (select 1 from public.partners);

insert into public.stats (value, prefix, suffix, grouped, label_ar, label_en, accent, sort_order)
select * from (values
  (180,  null, '+',  false, 'لاعبة مسجّلة',        'Registered players',          'green', 0),
  (120,  null, '+',  false, 'ألقاب في البطولات',    'Tournament wins',             null,    1),
  (40,   null, '+',  false, 'بطولة وطنية',          'National championships',      null,    2),
  (90,   null, '+',  false, 'مشاركة دولية',         'International appearances',   null,    3),
  (2150, null, null, true,  'أعلى تصنيف للاعبة',    'Peak player rating',          'red',   4)
) v(value,prefix,suffix,grouped,label_ar,label_en,accent,sort_order)
where not exists (select 1 from public.stats);
