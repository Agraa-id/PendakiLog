create table if not exists public.mountain_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  location text not null,
  elevation integer not null check (elevation > 0),
  status text not null check (status in ('Buka', 'Waspada', 'Tutup')),
  description text not null default '',
  price numeric not null default 35000 check (price >= 0),
  difficulty text not null default 'Belum diketahui',
  estimated_time text not null default 'Belum diketahui',
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now()
);

alter table public.mountain_logs enable row level security;

grant select, insert, update, delete on public.mountain_logs to authenticated;

create policy "Users can read their own mountain logs"
  on public.mountain_logs for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own mountain logs"
  on public.mountain_logs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own mountain logs"
  on public.mountain_logs for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own mountain logs"
  on public.mountain_logs for delete
  to authenticated
  using ((select auth.uid()) = user_id);
