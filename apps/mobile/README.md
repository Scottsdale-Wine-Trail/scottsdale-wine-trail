# SWT Mobile

The Scottsdale Wine Trail mobile app — the real home of the **Digital Passport**.
Built with Expo + React Native + Expo Router + TypeScript, on the shared Supabase backend.

## What's in the MVP

- **Explore** — browse the 7 participating tasting rooms (live Supabase data)
- **Winery detail** — description, address, phone, website, wines, events, directions, and the "Stamp My Visit" flow
- **Passport** — digital passport progress, stamps collected, $2-off-every-flight messaging, demo purchase state
- **Map** — the trail in order with "Walk to Next Stop" external directions
- **Account** — Supabase email-OTP login / logout

Intentionally **not** in this MVP (foundation is ready for them): real Apple/Google in-app
purchase, QR scanning, push notifications, and photo upload. The "Stamp My Visit" flow uses a
simple employee/manual code for now.

## Stack

- Expo SDK 54 (React Native 0.81, React 19) — matches the Expo Go version on the App Store
- Expo Router v6 (file-based navigation, bottom tabs)
- `@supabase/supabase-js` with AsyncStorage session persistence
- Shared domain types from `@swt/shared`
- Playfair Display + Inter via `@expo-google-fonts`

## Setup

From the **repo root**:

```bash
pnpm install
```

Then create the mobile env file:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Fill in `apps/mobile/.env`:

| Variable                         | What it is                                           |
| -------------------------------- | ---------------------------------------------------- |
| `EXPO_PUBLIC_SUPABASE_URL`       | Supabase project URL (or local `http://...:54321`)   |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`  | Supabase anon/public key                             |
| `EXPO_PUBLIC_STAMP_CODE`         | Employee code for stamping (defaults to `TRAIL2026`) |

> **Local Supabase networking:** `127.0.0.1` works on the **iOS Simulator**. On the
> **Android emulator** use `http://10.0.2.2:54321`. On a **physical device (Expo Go)** use your
> machine's LAN IP, e.g. `http://192.168.1.50:54321`.

## Run

```bash
# from repo root
pnpm --filter @swt/mobile start      # Expo dev server + QR code
pnpm --filter @swt/mobile ios        # open iOS Simulator
pnpm --filter @swt/mobile android    # open Android emulator

# or from apps/mobile
cd apps/mobile && npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android) or press `i` / `a` in the terminal for a simulator.

## Database

The passport requires the `passport_stamps` table. Apply migrations:

```bash
npx supabase db reset        # local: runs all migrations + seed
# or push the new migration to a hosted project:
npx supabase db push
```

Migration: `supabase/migrations/20260622000000_passport_stamps.sql`.

## Notes

- Auth uses **email OTP** (6-digit code) — no deep-link setup required, works in Expo Go.
- Winery cards use generated gradient emblems (no bundled photos) so the app has no broken-image
  dependencies; swap in `hero_image_url` later when images are hosted.
- The map screen is a premium **fallback list** with real coordinates + external directions. It's
  structured so `react-native-maps` (which needs a custom dev build) can be dropped in later.
