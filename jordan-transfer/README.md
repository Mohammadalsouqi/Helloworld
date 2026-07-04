# Jordan Transfer

Fixed-price airport transfer booking platform for Jordan. Built with Next.js, next-intl (EN/AR), and JSON file storage.

## Setup

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Admin Panel

Visit `/en/admin` — default password is `admin123`.

Change the admin password at `/en/admin/settings`.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import in Vercel dashboard
3. Add env vars from `.env.local.example`
4. Deploy

Note: Vercel's serverless functions don't persist file writes. Mount persistent storage for production.

## Deploy to VPS (Docker)

```bash
docker build -t jordan-transfer .
docker run -p 3000:3000 -v $(pwd)/data:/app/data jordan-transfer
```

Mount `/app/data` as a volume to persist booking and settings data.

## Custom Domain

In Vercel: Settings → Domains → Add your domain.

In Docker/VPS, configure nginx to proxy port 3000.

## Structure

- `data/` — JSON files (cars, destinations, bookings, settings)
- `lib/` — data layer, pricing, WhatsApp
- `app/[locale]/` — pages (en/ar)
- `app/api/` — REST API routes
- `components/` — UI components
- `messages/` — i18n strings
