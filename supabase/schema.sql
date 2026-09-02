-- DevNexus AI: esquema inicial de Supabase
-- Ejecutar como migración y adaptar roles/operaciones administrativas al proyecto.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  default_language text default 'typescript',
  default_framework text,
  code_style text default 'standard',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.snippets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  prompt text,
  code text not null,
  explanation text,
  language text not null,
  framework text,
  category text,
  is_favorite boolean not null default false,
  is_shared boolean not null default false,
  share_token uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  language text,
  framework text,
  prompt_template text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists snippets_user_created_idx on public.snippets (user_id, created_at desc);
create index if not exists snippets_user_favorite_idx on public.snippets (user_id, is_favorite);
create index if not exists templates_category_idx on public.templates (category) where is_published = true;

alter table public.profiles enable row level security;
alter table public.snippets enable row level security;
alter table public.templates enable row level security;

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can insert their own profile"
on public.profiles for insert to authenticated
with check (id = auth.uid());

create policy "Users manage their own snippets"
on public.snippets for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Authenticated users read published templates"
on public.templates for select to authenticated
using (is_published = true);

-- Crear automáticamente el perfil al registrarse.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', 'Developer'));
  return new;
end;
$$;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
