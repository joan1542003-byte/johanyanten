-- Applied to project hxcvuhrsbeqakgzohyhx on 2026-10-21

-- Admins: only users listed here can write content
create schema if not exists private;

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

create policy "admins read own row" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title jsonb not null,
  tagline jsonb not null,
  categories text[] not null default '{}',
  is_new boolean not null default false,
  published boolean not null default true,
  cover jsonb not null,
  description jsonb not null default '[]',
  youtube text,
  gallery jsonb not null default '[]',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_position_idx on public.projects (position);
alter table public.projects enable row level security;

create trigger projects_updated_at before update on public.projects
  for each row execute function private.touch_updated_at();

create policy "public reads published projects" on public.projects
  for select to anon, authenticated using (published or (select private.is_admin()));
create policy "admins insert projects" on public.projects
  for insert to authenticated with check ((select private.is_admin()));
create policy "admins update projects" on public.projects
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "admins delete projects" on public.projects
  for delete to authenticated using ((select private.is_admin()));

-- Editable site texts (hero, about, contact), one row per section: { es: {...}, en: {...} }
create table public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

create trigger site_content_updated_at before update on public.site_content
  for each row execute function private.touch_updated_at();

create policy "public reads site content" on public.site_content
  for select to anon, authenticated using (true);
create policy "admins insert site content" on public.site_content
  for insert to authenticated with check ((select private.is_admin()));
create policy "admins update site content" on public.site_content
  for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

-- Media bucket: public read, admin-only writes
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 15728640, array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif']);

create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and (select private.is_admin()));
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and (select private.is_admin()));
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and (select private.is_admin()));
