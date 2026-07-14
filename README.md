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

## Project structure

See the folder tree in the project. Public pages live in
`src/app/(marketing)`, the user area in `src/app/(dashboard)`, and the admin
panel in `src/app/admin`.

## Build progress

This project is being built module by module — see `ROADMAP.md`.
