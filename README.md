This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

### Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Vercel CLI installed: `npm i -g vercel`

### Setup Steps

1. **Create a Vercel Postgres database**

   - Go to your Vercel dashboard → Storage → Create Database → Postgres
   - Copy the connection string

2. **Configure environment variables**

   In your Vercel project settings (Settings → Environment Variables), add:

   ```
   POSTGRES_URL=your_vercel_postgres_connection_string
   ```

3. **Deploy**

   ```bash
   # Link your project (first time only)
   vercel link

   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

4. **Push database schema**

   After deployment, push the Prisma schema to your production database:

   ```bash
   DATABASE_URL="your_vercel_postgres_connection_string" yarn db:push
   ```

### Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_URL` | Vercel Postgres connection string | Yes |

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
