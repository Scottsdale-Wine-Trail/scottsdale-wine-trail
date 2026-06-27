/// <reference types="expo/types" />

// Committed companion to the auto-generated (and gitignored) expo-env.d.ts.
// Expo only regenerates expo-env.d.ts while `expo start` runs, so this file
// guarantees `process.env.EXPO_PUBLIC_*` always type-checks — and gives the
// app's public env vars real types for autocomplete.
declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_SUPABASE_URL: string | undefined;
    EXPO_PUBLIC_SUPABASE_ANON_KEY: string | undefined;
    EXPO_PUBLIC_STAMP_CODE: string | undefined;
  }
}
