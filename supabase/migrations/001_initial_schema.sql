-- ============================================================
-- Omatapalo CMS — Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Posts (Notícias)
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  excerpt     text,
  content     text,
  cover_image text,
  category    text default 'Geral',
  published   boolean default false,
  author_id   uuid references auth.users(id) on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.posts enable row level security;
create policy "Admins manage posts" on public.posts for all using (auth.role() = 'authenticated');
create policy "Public read published" on public.posts for select using (published = true);

-- Pages
create table if not exists public.pages (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  content      text,
  seo_title    text,
  seo_desc     text,
  published    boolean default false,
  author_id    uuid references auth.users(id) on delete set null,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
alter table public.pages enable row level security;
create policy "Admins manage pages" on public.pages for all using (auth.role() = 'authenticated');
create policy "Public read published pages" on public.pages for select using (published = true);

-- Portfolio Projects
create table if not exists public.portfolio_projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  description  text,
  category     text default 'Construção',
  client       text,
  location     text,
  year         int,
  cover_image  text,
  images       text[] default '{}',
  featured     boolean default false,
  published    boolean default false,
  author_id    uuid references auth.users(id) on delete set null,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);
alter table public.portfolio_projects enable row level security;
create policy "Admins manage portfolio" on public.portfolio_projects for all using (auth.role() = 'authenticated');
create policy "Public read published portfolio" on public.portfolio_projects for select using (published = true);

-- Media
create table if not exists public.media (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  url         text not null,
  mime_type   text,
  size        int,
  alt_text    text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at  timestamptz default now()
);
alter table public.media enable row level security;
create policy "Admins manage media" on public.media for all using (auth.role() = 'authenticated');

-- Profiles (roles)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  role       text default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins manage profiles" on public.profiles for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'editor'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger posts_updated_at before update on public.posts for each row execute procedure public.set_updated_at();
create trigger pages_updated_at before update on public.pages for each row execute procedure public.set_updated_at();
create trigger portfolio_updated_at before update on public.portfolio_projects for each row execute procedure public.set_updated_at();

-- Storage bucket for media
insert into storage.buckets (id, name, public) values ('cms-media', 'cms-media', true) on conflict do nothing;
create policy "Authenticated upload" on storage.objects for insert with check (bucket_id = 'cms-media' and auth.role() = 'authenticated');
create policy "Public read media" on storage.objects for select using (bucket_id = 'cms-media');
create policy "Authenticated delete" on storage.objects for delete using (bucket_id = 'cms-media' and auth.role() = 'authenticated');
