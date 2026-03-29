-- SmartPickup initial database schema

-- Profiles: extends Supabase auth.users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  audience_level text not null default 'beginner'
    check (audience_level in ('beginner', 'advanced')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Matches: cached external match data
create table public.matches (
  id text primary key,
  competition text not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'live', 'halftime', 'finished')),
  kickoff_at timestamptz,
  home_team text not null,
  away_team text not null,
  home_score integer not null default 0,
  away_score integer not null default 0,
  stats jsonb not null default '{}',
  events jsonb not null default '[]',
  raw_provider_data jsonb,
  cached_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index idx_matches_status on public.matches(status);
create index idx_matches_kickoff on public.matches(kickoff_at desc);
create index idx_matches_competition on public.matches(competition);

-- Analyses: AI-generated tactical analyses
create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  match_id text not null references public.matches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  audience_level text not null
    check (audience_level in ('beginner', 'advanced')),
  mode text not null default 'post_match'
    check (mode in ('post_match', 'live_snapshot', 'halftime')),
  result jsonb not null,
  headline text not null,
  prompt_tokens integer,
  completion_tokens integer,
  model text not null default 'gpt-4o-mini',
  created_at timestamptz not null default now()
);

create index idx_analyses_match on public.analyses(match_id);
create index idx_analyses_user on public.analyses(user_id);
create index idx_analyses_user_match on public.analyses(user_id, match_id);

-- Saved moments: user bookmarks of specific key moments
create table public.saved_moments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  moment_index integer not null,
  note text,
  created_at timestamptz not null default now(),
  unique(user_id, analysis_id, moment_index)
);

create index idx_saved_moments_user on public.saved_moments(user_id);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.matches enable row level security;
alter table public.analyses enable row level security;
alter table public.saved_moments enable row level security;

-- Profiles: users can read/update their own
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Matches: all authenticated users can read
create policy "Authenticated users can read matches"
  on public.matches for select
  to authenticated
  using (true);

-- Analyses: users can read and insert their own
create policy "Users can read own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

-- Saved moments: users manage their own
create policy "Users can read own saved moments"
  on public.saved_moments for select
  using (auth.uid() = user_id);

create policy "Users can insert own saved moments"
  on public.saved_moments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saved moments"
  on public.saved_moments for delete
  using (auth.uid() = user_id);

-- Trigger: auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
