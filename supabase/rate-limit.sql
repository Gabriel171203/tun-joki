-- Rate limiter persisten (fixed window) berbasis tabel Supabase.
-- Jalankan di SQL Editor proyek yang SUDAH ada — idempoten, aman diulang.
-- Proyek Supabase baru: jalankan supabase/schema.sql dulu, lalu file ini.

create table if not exists public.rate_limits (
  key text primary key,
  count integer not null default 0,
  window_started_at timestamptz not null default now()
);

create index if not exists rate_limits_window_started_at_idx
  on public.rate_limits (window_started_at);

-- RLS aktif tanpa policy: anon/authenticated tidak bisa menyentuh baris.
-- Akses hanya lewat service role (bypass RLS) dari API routes.
alter table public.rate_limits enable row level security;

create or replace function public.rate_limit(
  p_key text,
  p_limit integer,
  p_window_ms integer,
  p_count boolean default true
)
returns jsonb
language plpgsql
as $$
declare
  v_count integer;
  v_started timestamptz;
  v_blocked boolean := false;
  v_retry integer := 0;
  v_window_sec numeric := p_window_ms / 1000.0;
begin
  insert into public.rate_limits (key, count, window_started_at)
  values (p_key, 0, now())
  on conflict (key) do nothing;

  select count, window_started_at into v_count, v_started
  from public.rate_limits
  where key = p_key
  for update;

  if v_started < now() - make_interval(secs => v_window_sec) then
    v_count := 0;
    v_started := now();
  end if;

  if v_count >= p_limit then
    v_blocked := true;
    v_retry := greatest(
      ceil(extract(epoch from (v_started + make_interval(secs => v_window_sec) - now()))),
      0
    )::integer;
  elsif p_count then
    v_count := v_count + 1;
  end if;

  update public.rate_limits
  set count = v_count, window_started_at = v_started
  where key = p_key;

  delete from public.rate_limits
  where window_started_at < now() - interval '1 day';

  return jsonb_build_object(
    'blocked', v_blocked,
    'retry_after', v_retry,
    'count', v_count
  );
end;
$$;

-- Hanya service role (dipakai API routes) yang boleh memanggil.
revoke execute on function public.rate_limit(text, integer, integer, boolean)
  from public, anon, authenticated;
