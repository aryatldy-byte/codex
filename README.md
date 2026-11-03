# Codex Innovation – Website + Admin Panel

React (Vite) website with a Supabase-powered admin dashboard.
Public pages read content from Supabase; only authenticated **admins** can edit anything.

## 1. Supabase setup
1. Create a project at supabase.com.
2. Open **SQL Editor**, paste all of `supabase/schema.sql`, and run it. This creates the tables, RLS policies, permissions, realtime and starter content.

## 2. Create the admin user
1. **Authentication → Users → Add user → Create new user.** Enter email + password and tick *Auto Confirm User*.
2. In the SQL Editor, grant that user admin rights (replace the email):
```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'you@example.com';
```
Signing up alone does not make anyone an admin: access requires a row in `admin_users`. Also turn off public sign-ups under **Authentication → Providers → Email → Allow new users to sign up**.

## 3. Environment
```bash
cp .env.example .env
```
Fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project Settings → API). Use the anon key only, never the service_role key.

## 4. Run locally
```bash
npm install
npm run dev
```
Website: http://localhost:5173 · Admin: http://localhost:5173/admin/login

## 5. First login
1. Go to `/admin/login`, sign in with the user from step 2.
2. **Settings:** add your address, phone, email, website and social links (the placeholders from the content draft).
3. **Content:** review the hero, about, CTA, contact and footer text, then save.
4. Submit the website contact form once to see it under **Inquiries**.

## 6. Deploy to Vercel
1. Push this project to GitHub.
2. In Vercel: **Add New → Project**, import the repo (framework: Vite is detected; build `npm run build`, output `dist`).
3. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Deploy. `vercel.json` already rewrites all routes to `index.html` so `/admin/*` works on refresh.
5. In Supabase **Authentication → URL Configuration**, set Site URL to your Vercel domain.

## Admin routes
`/admin` · `/admin/login` · `/admin/inquiries` · `/admin/content` · `/admin/settings`

## Notes
- Edits show on the site instantly through Supabase Realtime (included in the schema).
- Service cards and "Why us" items come from the content draft and are fixed in `src/pages/Home.jsx`.
