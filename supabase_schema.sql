-- Esquema de Supabase para fuchsia.com.co (proyecto Supabase: fuchsia, ref unwbfjkjcuslbnesbgjd)
-- Aplicado via mcp Supabase (apply_migration: fuchsia_schema_inicial) + supabase_seed.sql (historico)
-- Ver build_fuchsia.py en la carpeta superior para regenerar el seed.

-- Perfiles + admin
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  correo text,
  celular text,
  is_admin boolean not null default false,
  acepto_datos boolean default false,
  acepto_fecha timestamptz,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
-- (select auth.uid()) en vez de auth.uid() evita reevaluar la funcion por cada fila (advisor de performance)
create policy "select propio perfil" on public.profiles for select using ((select auth.uid()) = id);
create policy "update propio perfil" on public.profiles for update using ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nombre, correo, celular)
  values (new.id, new.raw_user_meta_data->>'nombre', new.email, new.raw_user_meta_data->>'telefono');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- Esta funcion solo debe ejecutarse via el trigger de auth.users, nunca via RPC publico
revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Talleres (Fuchsia)
create type taller_estado as enum ('proximo','pasado','desactivado');

create table public.talleres (
  id bigint generated always as identity primary key,
  slug text unique not null,
  titulo text not null,
  descripcion text,
  foco text,
  modalidad text default 'virtual',
  imagen_url text,
  video_url text,
  fecha_taller date,
  fecha_limite_preventa date,
  link_pago_preventa text,
  link_pago_regular text,
  campos_inscripcion jsonb not null default '[{"name":"nombre","label":"Nombre completo","type":"text","required":true},{"name":"celular","label":"Celular","type":"tel","required":true}]',
  estado taller_estado not null default 'proximo',
  created_at timestamptz not null default now()
);
alter table public.talleres enable row level security;
create policy "select publico talleres" on public.talleres for select using (true);
-- Policies de admin separadas por comando (en vez de "for all") para que no se
-- evaluen junto con "select publico talleres" en cada SELECT (advisor de performance)
create policy "admin inserta talleres" on public.talleres for insert with check (
  exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin)
);
create policy "admin actualiza talleres" on public.talleres for update using (
  exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin)
);
create policy "admin borra talleres" on public.talleres for delete using (
  exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin)
);

create table public.registros_talleres (
  id bigint generated always as identity primary key,
  taller_id bigint not null references public.talleres(id) on delete cascade,
  datos jsonb not null,
  ip_registro text,
  created_at timestamptz not null default now()
);
alter table public.registros_talleres enable row level security;
create policy "insert publico registros" on public.registros_talleres for insert with check (true);
create policy "admin lee registros" on public.registros_talleres for select using (
  exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin)
);
create index if not exists idx_registros_talleres_taller_id on public.registros_talleres(taller_id);

-- Masterclasses (Empowerd Mujer, siempre gratis)
create type masterclass_estado as enum ('proxima','pasada');

create table public.masterclasses (
  id bigint generated always as identity primary key,
  titulo text not null,
  imagen_url text,
  video_url text,
  fecha date,
  estado masterclass_estado not null default 'proxima',
  created_at timestamptz not null default now()
);
alter table public.masterclasses enable row level security;
create policy "select publico masterclasses" on public.masterclasses for select using (true);
create policy "admin inserta masterclasses" on public.masterclasses for insert with check (
  exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin)
);
create policy "admin actualiza masterclasses" on public.masterclasses for update using (
  exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin)
);
create policy "admin borra masterclasses" on public.masterclasses for delete using (
  exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin)
);

-- Contacto
create table public.contactos_fuchsia (
  id bigint generated always as identity primary key,
  nombre text not null,
  correo text not null,
  celular text,
  servicio text,
  mensaje text,
  created_at timestamptz not null default now()
);
alter table public.contactos_fuchsia enable row level security;
create policy "insert publico contacto" on public.contactos_fuchsia for insert with check (true);
create policy "admin lee contactos" on public.contactos_fuchsia for select using (
  exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.is_admin)
);

-- Storage bucket publico para imagenes subidas desde el admin
insert into storage.buckets (id, name, public) values ('fuchsia-img','fuchsia-img', true);
create policy "lectura publica fuchsia-img" on storage.objects for select using (bucket_id = 'fuchsia-img');
create policy "admin sube fuchsia-img" on storage.objects for insert with check (
  bucket_id = 'fuchsia-img' and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
);

-- Para volver admin a un usuario ya registrado:
-- update public.profiles set is_admin = true where correo = 'admin@fuchsia.com.co';
