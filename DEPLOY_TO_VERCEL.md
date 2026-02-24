# Deploying Bhatta Manager to Vercel

This application is configured for deployment on Vercel with Vercel Postgres.

## Prerequisites
1. A [Vercel Account](https://vercel.com).
2. A GitHub repository containing this code.

## Steps to Deploy

1.  **Push to GitHub**
    Push this codebase to a new repository on your GitHub account.

2.  **Create Project on Vercel**
    - Go to your Vercel Dashboard.
    - Click **Add New > Project**.
    - Import the GitHub repository you just created.

3.  **Configure Database (Vercel Postgres)**
    - On the project configuration screen (before clicking Deploy), or in the Project Settings after deployment (if you skip step):
    - Go to the **Storage** tab in your Vercel Project Dashboard.
    - Click **Connect Store** and select **Postgres**.
    - Create a new database (e.g., `bhatta-db`).
    - Select the region closest to you/your users (e.g., Singapore `sin1` or Mumbai `bom1` if available).
    - Vercel will automatically add the environment variables (`POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, etc.) to your project.

4.  **Deploy**
    - Click **Deploy**.
    - The build might fail initially if the database schema is not pushed yet, OR it might succeed but the app will error at runtime.
    - Wait for the build to finish.

5.  **Initialize the Database**
    Once the project is created and database linked, you need to push the schema and seed data.
    You can do this from your local machine if you link it, OR use the Vercel CLI.

    **Option A: Local Machine (Recommended)**
    1.  Install Vercel CLI: `npm i -g vercel`
    2.  Login: `vercel login`
    3.  Link project: `vercel link`
    4.  Pull env vars: `vercel env pull .env.local`
    5.  Run migration: `npx prisma migrate deploy`
    6.  Run seed: `npx tsx prisma/seed.ts`

    **Option B: Vercel Console**
    Vercel doesn't run migrations automatically on deploy unless you configure a specific build command.
    The easiest way is to override the "Build Command" in Vercel Settings > General:

    `npx prisma migrate deploy && next build`

    (Note: Only do this once, or ensure migrations are idempotent. It's safer to run migrations manually locally connecting to the remote DB).

## Environment Variables
Ensure these are set in Vercel (automatically set if you add Vercel Postgres):
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`

## Local Development (with Postgres)
If you want to run this locally with the Vercel DB:
1. `vercel env pull .env.local`
2. `npm run dev`

## Troubleshooting
- If you see `P1001: Can't reach database`, check if you are allowed to access the database from your IP (Vercel Postgres is usually open, but check settings).
- If you see `PrismaClientInitializationError`, ensure you ran `prisma generate` (which is in `postinstall`).
