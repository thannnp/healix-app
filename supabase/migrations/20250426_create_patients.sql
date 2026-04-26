-- Create patients table
create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  middle_name text,
  date_of_birth text not null,
  gender text not null,
  phone_number text not null,
  email text not null,
  address text not null,
  preferred_language text not null,
  nationality text not null,
  emergency_contact_name text,
  emergency_contact_relationship text,
  religion text,
  created_at timestamptz not null default now()
);
 
-- Enable Row Level Security
alter table patients enable row level security;
 
-- Allow anonymous users to insert (patient form submission)
create policy "Allow anonymous insert"
  on patients for insert
  to anon
  with check (true);
 
-- Allow anonymous users to read (staff dashboard)
create policy "Allow anonymous select"
  on patients for select
  to anon
  using (true);