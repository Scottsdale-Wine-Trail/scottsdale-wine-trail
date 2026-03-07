# Scottsdale Wine Trail

Monorepo for the Scottsdale Wine Trail MVP.

## Apps

- `apps/web`: Next.js 15 App Router website
- `packages/shared`: Shared Zod schemas and types
- `supabase`: SQL migrations and seed data

## Environment

Create `apps/web/.env.local` from `apps/web/.env.example` and set:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

## Local Dev

```bash
pnpm install
npx supabase start
npx supabase db reset
pnpm --filter @swt/web dev
```
