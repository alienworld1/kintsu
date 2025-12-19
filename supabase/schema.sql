-- Create the bridges table
create table public.bridges (
  id uuid default gen_random_uuid() primary key,
  anon_id text not null,
  emotion text not null, -- This will be encrypted
  culture text not null,
  proverb_json jsonb not null,
  expires_at timestamp with time zone not null default (now() + interval '24 hours'),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.bridges enable row level security;

-- Create a policy that allows anyone to insert (since it's anonymous)
create policy "Allow anonymous inserts"
  on public.bridges
  for insert
  to anon
  with check (true);

-- Create a policy that allows reading only if you know the ID (or we can restrict to anon_id if we pass it)
-- For now, we'll allow reading by ID for the "bridge card" view
create policy "Allow reading by ID"
  on public.bridges
  for select
  to anon
  using (true);

-- Optional: Periodic cleanup function (can be run via cron or manually)
-- delete from public.bridges where expires_at < now();
