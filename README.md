# Scottsdale Wine Trail

A production-ready monorepo for the Scottsdale Wine Trail platform.

## Structure

```
/apps
  /web        — Next.js website (App Router, TypeScript, Tailwind)
  /mobile     — Expo mobile app (stub only, not yet implemented)
/packages
  /shared     — Zod schemas + TypeScript types
/supabase
  /migrations — SQL schema migrations
  /seed       — Sample data seed
```

## Tech Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Web**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **Map**: Mapbox GL JS via react-map-gl
- **State/Data**: TanStack React Query
- **Validation**: Zod (shared package)

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) project
- A [Mapbox](https://mapbox.com) access token

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-mapbox-token
```

### 3. Apply database migrations

Using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase link --project-ref your-project-ref
supabase db push
```

Or run the SQL manually in the Supabase SQL editor:

```bash
cat supabase/migrations/20240101000000_initial_schema.sql
```

### 4. Seed the database

```bash
# Via Supabase CLI
supabase db seed

# Or run manually in the SQL editor
cat supabase/seed/seed.sql
```

### 5. Run locally

```bash
pnpm dev
```

This starts the Next.js dev server at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Run ESLint across the monorepo |
| `pnpm type-check` | Run TypeScript type checking |

## Pages

| Route | Description |
|---|---|
| `/` | Landing page with hero, featured wineries, upcoming events |
| `/wineries` | Searchable, filterable winery grid |
| `/wineries/[slug]` | Winery detail: address, hours, reviews |
| `/trail-map` | Interactive Mapbox map with winery pins |
| `/events` | Event list with type filters |
| `/wines` | Wine database with search and winery filter |

## Shared Package

`packages/shared` exports Zod schemas and TypeScript types for `Winery`, `WineryEvent`, and `Wine`. Import them in any app:

```typescript
import { WinerySchema, type Winery } from "@swt/shared";
```

## Deployment

The web app can be deployed to Vercel with zero config:

```bash
vercel --cwd apps/web
```

Set the same environment variables in your Vercel project settings.
