# Horizon Real Estate

Production-ready real estate platform built with Next.js 15, Prisma, PostgreSQL, Tailwind CSS.

## Features

- Modern glass-morphism UI with light/dark theme
- Server-side filtering (type, listing type, city, price range, rooms)
- Property detail page with gallery, amenities, interactive map, mortgage calculator
- Contact-agent form posting to `Lead` table with Zod validation
- Agents + offices directories
- Leaflet map with custom markers
- Seeded with 60 sample properties across 6 Albanian cities

## Setup

```bash
# 1. Install
npm install

# 2. Push schema to your PostgreSQL database
npm run db:push

# 3. Seed sample data
npm run db:seed

# 4. Run dev server
npm run dev
```

Open http://localhost:3000

Prisma Studio: `npm run db:studio`

## Database

Configured via `DATABASE_URL` in `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/realestete?schema=public"
```

## Stack

- Next.js 15 (App Router, RSC)
- TypeScript
- Tailwind CSS (custom brand palette + glass utilities)
- Prisma 5
- PostgreSQL
- Leaflet + react-leaflet (free maps, no API key)
- Zod (API validation)
- lucide-react (icons)
- next-themes (dark mode)

## Project structure

```
src/
  app/
    page.tsx               # Home
    properties/            # List + [slug] detail
    agents/                # List + [id] profile
    offices/               # Office directory
    about/ contact/ list-property/
    api/properties, api/leads, api/stats
  components/              # Reusable UI
  lib/prisma.ts, lib/utils.ts
prisma/
  schema.prisma            # Full schema
  seed.ts                  # Seed script
```
