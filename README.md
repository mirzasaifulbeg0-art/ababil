# ABABIL

**Nature • Technology • Trust** — an all-in-one platform for digital services,
natural products, a free Islamic PDF library, and a blog.

## Tech stack

- **Next.js (App Router)** + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **PostgreSQL** + **Prisma ORM**
- **NextAuth (Auth.js)** for authentication
- **Cloudinary** for image & PDF storage
- Deployed on **Vercel**

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Create your environment file
cp .env.example .env      # then fill in the values

# 3. Create the database tables
npm run db:migrate

# 4. (Optional) Add sample data
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open http://localhost:3000.

## Useful scripts

| Command              | What it does                              |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Start the development server              |
| `npm run build`      | Production build                          |
| `npm run start`      | Run the production build                  |
| `npm run lint`       | Check code for problems                   |
| `npm run db:migrate` | Create/update database tables from schema |
| `npm run db:studio`  | Visual database browser (Prisma Studio)   |
| `npm run db:seed`    | Insert sample data                        |

## Deploy to Vercel

The repo is Vercel-ready. `vercel.json` runs
`prisma generate && prisma migrate deploy && next build`, so database
migrations are applied automatically on every deploy.

**Before deploying you need two cloud services** (the local dev setup won't work
in production):

1. **A hosted PostgreSQL** — Vercel cannot reach `localhost`. Create a free DB on
   [Neon](https://neon.tech) or [Supabase](https://supabase.com) and copy its
   connection string.
2. **Cloudinary** — Vercel's filesystem is read-only, so uploaded images/PDFs
   only persist when Cloudinary is configured. The local `public/uploads`
   fallback is for development only.

**Steps:**

1. Push to GitHub (already done).
2. On [vercel.com](https://vercel.com) → **Add New Project** → import this repo.
3. Add the environment variables from [`.env.production.example`](.env.production.example)
   (hosted `DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL` = your `*.vercel.app`
   URL, `AUTH_TRUST_HOST=true`, and the four `CLOUDINARY_*` values).
4. **Deploy.** Migrations run during the build.
5. Seed the admin user once against the cloud DB (locally, with the production
   `DATABASE_URL` and a **strong** `SEED_ADMIN_PASSWORD` exported):
   ```bash
   npm run db:seed
   ```

> ⚠️ Set `SEED_ADMIN_PASSWORD` to something strong before seeding a public site —
> otherwise the seed uses a weak, publicly-known default password.

## Project structure

See the folder tree in the project. Public pages live in
`src/app/(marketing)`, the user area in `src/app/(dashboard)`, and the admin
panel in `src/app/admin`.

## Build progress

This project is being built module by module — see `ROADMAP.md`.
