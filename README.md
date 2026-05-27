# Global Trail Race Finder

A production-ready MVP for discovering verified trail running races worldwide. The public website shows only admin-verified race records, while imported or scraped records stay in a pending review workflow until approved.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- Vercel-ready deployment structure

## Features

- Premium responsive public homepage
- Global race calendar with filters
- Race detail pages
- Organizer/user race submission form
- Backend race workflow model
- Pending / verified / rejected race states
- Admin import review queue
- Dry-run importer preview page
- Public calendar reads verified races only
- `robots.txt` and `sitemap.xml`
- SEO metadata via Next.js metadata API

## Data Safety

The ingestion pipeline is intentionally review-first:

- Imported records are saved as `pending`.
- Admins can approve, edit, reject, or merge duplicates.
- Only `verified` races are exposed on public pages and public APIs.
- `rejected` races never appear on the public site.
- Dry-run importer previews data without saving it.
- No scraper runs automatically.

## Local Development

```bash
npm install
npm run dev
```

Open:

- Public site: `http://127.0.0.1:3000`
- Race calendar: `http://127.0.0.1:3000/races`
- Admin review: `http://127.0.0.1:3000/admin/imports`
- Dry-run importer: `http://127.0.0.1:3000/admin/imports/dry-run`

## Production Build

```bash
npm run lint
npm run build
```

## Environment Variables

Copy `.env.example` to `.env.local` for local development.

```bash
cp .env.example .env.local
```

Set `NEXT_PUBLIC_SITE_URL` to the production Vercel URL or custom domain.

## Vercel Deployment

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in Vercel.
3. Set environment variables from `.env.example`.
4. Use the default Vercel Next.js build settings:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output: managed by Next.js
5. Deploy.

## Current Data Layer

This MVP uses an in-memory workflow store for demonstration:

- `src/backend/race-store.ts`
- `src/backend/race-model.ts`
- `src/lib/races.ts`

For production persistence, replace the in-memory store with a database-backed repository while keeping the same public/admin API boundaries.

## Important Notes

- No login is implemented yet.
- Admin routes are intentionally not linked from the public navigation.
- Add auth middleware before exposing admin routes in a real production environment.
- No scraping is run automatically.
- The source adapter framework exists, but imports only run when explicitly triggered from the admin dry-run page or future admin tooling.
