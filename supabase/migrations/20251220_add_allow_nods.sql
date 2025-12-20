
-- Add allow_nods column to bridges
alter table public.bridges add column allow_nods boolean default false;

-- Create a policy that allows updating own bridges
create policy "Allow updating own bridges"
  on public.bridges
  for update
  to anon
  using (true)
  with check (true);
