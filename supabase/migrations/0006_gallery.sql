-- =============================================================
-- Gallery — institutional photo library shown on the home page
--
-- Additive on top of 0005. Idempotent (drops nothing destructive).
-- Each row maps to one tile in <Gallery />: image_url is rendered
-- when present; otherwise the component falls back to its emoji /
-- gradient tile for that accent.
-- =============================================================

create table if not exists public.gallery_images (
  id           uuid        primary key default gen_random_uuid(),
  title_ar     text        not null,
  title_en     text        not null,
  subtitle_ar  text,
  subtitle_en  text,
  image_url    text,
  emoji        text        default '✦',
  span         text        not null default 'normal'
                check (span in ('normal','wide','tall')),
  accent       text        not null default 'red'
                check (accent in ('red','green','ink','gold')),
  sort_order   int         not null default 0,
  is_published boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists gallery_images_sort_idx
  on public.gallery_images (is_published, sort_order, created_at desc);

drop trigger if exists set_updated_at_gallery_images on public.gallery_images;
create trigger set_updated_at_gallery_images
  before update on public.gallery_images
  for each row execute function public.set_updated_at();

-- ── RLS ───────────────────────────────────────────────────────
alter table public.gallery_images enable row level security;

drop policy if exists "gallery_images: public read"   on public.gallery_images;
drop policy if exists "gallery_images: admin all"     on public.gallery_images;

-- Public (anon + authenticated) can read PUBLISHED tiles. Drafts
-- (is_published = false) are admin-only.
create policy "gallery_images: public read"
  on public.gallery_images for select
  to anon, authenticated
  using (is_published = true or public.is_admin());

create policy "gallery_images: admin all"
  on public.gallery_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ── Privileges ───────────────────────────────────────────────
grant select on public.gallery_images to anon, authenticated;
grant insert, update, delete on public.gallery_images to authenticated;
