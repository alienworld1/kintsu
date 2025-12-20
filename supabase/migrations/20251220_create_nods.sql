
-- Create the nods table
create table public.nods (
  id uuid default gen_random_uuid() primary key,
  bridge_id uuid not null references public.bridges(id) on delete cascade,
  affirmation text not null,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.nods enable row level security;

-- Create a policy that allows anyone to insert (since it's anonymous)
create policy "Allow anonymous inserts to nods"
  on public.nods
  for insert
  to anon
  with check (true);

-- Create a policy that allows reading nods for a bridge
create policy "Allow reading nods"
  on public.nods
  for select
  to anon
  using (true);

-- Enable realtime for nods
alter publication supabase_realtime add table public.nods;
