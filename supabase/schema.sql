-- Codex Innovation: run this whole file in Supabase > SQL Editor.
create extension if not exists "pgcrypto";

-- 1. Tables ------------------------------------------------------------
create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null, email text not null, phone text, service text, message text not null,
  status text not null default 'new' check (status in ('new','contacted','closed'))
);
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company_name text, tagline text, address text, phone text, email text,
  website text, facebook text, linkedin text, instagram text, youtube text
);
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  title text, subtitle text, content text,
  updated_at timestamptz not null default now()
);
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 2. Admin helper -------------------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

-- 3. RLS ----------------------------------------------------------------
alter table public.contact_inquiries enable row level security;
alter table public.site_settings enable row level security;
alter table public.site_content enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "public can submit inquiries" on public.contact_inquiries;
create policy "public can submit inquiries" on public.contact_inquiries
  for insert to anon, authenticated with check (status = 'new');
drop policy if exists "admin manage inquiries" on public.contact_inquiries;
create policy "admin manage inquiries" on public.contact_inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
drop policy if exists "admin write settings" on public.site_settings;
create policy "admin write settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "public read content" on public.site_content;
create policy "public read content" on public.site_content for select to anon, authenticated using (true);
drop policy if exists "admin write content" on public.site_content;
create policy "admin write content" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read own admin row" on public.admin_users;
create policy "read own admin row" on public.admin_users for select to authenticated using (user_id = auth.uid());

-- 4. Permissions --------------------------------------------------------
revoke all on public.contact_inquiries, public.site_settings, public.site_content, public.admin_users from anon, authenticated;
grant insert on public.contact_inquiries to anon, authenticated;
grant select, update, delete on public.contact_inquiries to authenticated;
grant select on public.site_settings, public.site_content to anon, authenticated;
grant insert, update, delete on public.site_settings, public.site_content to authenticated;
grant select on public.admin_users to authenticated;

-- 5. Realtime (instant website updates) ---------------------------------
alter publication supabase_realtime add table public.site_settings;
alter publication supabase_realtime add table public.site_content;

-- 6. Seed data ----------------------------------------------------------
insert into public.site_settings (company_name, tagline, address, phone, email, website)
select 'Codex Innovation','Smart Solutions for a Digital Future','','','',''
where not exists (select 1 from public.site_settings);

insert into public.site_content (section_key, title, subtitle, content) values
('hero','Smart Solutions for a Digital Future','Digital Marketing • Software • AI • Accounting • Medical Coding','At Codex Innovation, we help businesses simplify operations, strengthen their digital presence, and embrace technology through practical and reliable solutions.'),
('about','Innovation That Helps Businesses Move Forward','About Us','Codex Innovation is a technology and professional services company focused on helping businesses adapt, grow, and succeed in an increasingly digital world.

We bring together expertise across digital marketing, software development, artificial intelligence, accounting, and medical coding to provide solutions that meet the changing needs of modern organisations.

Whether you are a start-up looking to establish your digital presence or an established organisation seeking to improve efficiency through technology, our aim is to understand your requirements and provide practical solutions tailored to your business.'),
('cta','Let''s Build Something Better Together.','Have a Project in Mind?','Whether you need to improve your digital presence, develop a software solution, introduce AI into your business, organise your accounting processes, or require medical coding support, we would be happy to discuss your requirements.'),
('contact','Contact Us','Tell us about your project and we will get back to you.','We usually reply by email. Please include as much detail as you can.'),
('footer','Codex Innovation','','© 2026 Codex Innovation. All Rights Reserved.')
on conflict (section_key) do nothing;

-- 7. First admin (after creating the user in Authentication > Users):
-- insert into public.admin_users (user_id) select id from auth.users where email = 'you@example.com';
