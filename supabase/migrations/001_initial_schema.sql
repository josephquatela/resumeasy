-- resumes table: one row per resume snapshot per user
create table resumes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null default 'My Resume',
  data        jsonb not null default '{}',   -- full ResumeData (contact, sections, experience, etc.)
  design      jsonb not null default '{}',   -- DesignSettings
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Row-level security: users can only access their own resumes
alter table resumes enable row level security;

create policy "Users access own resumes" on resumes
  for all using (auth.uid() = user_id);

-- Auto-update updated_at on write
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger resumes_updated_at
  before update on resumes
  for each row execute function update_updated_at();
