import { Platform, TextStyle, ViewStyle } from "react-native";

/**
 * Scottsdale Wine Trail design system.
 *
 * Boutique / warm / wine-tourism: cream backgrounds, burgundy accent,
 * charcoal text, gold for the passport + progress. Fonts are Playfair
 * Display (serif headings) + Inter (sans body), loaded in app/_layout.tsx.
 *
 * Import `theme` everywhere; compose `theme.type.*` presets for typography
 * so screens stay consistent without re-declaring text styles.
 */

export const colors = {
  // Surfaces
  background: "#FBF7EF", // warm cream
  backgroundAlt: "#F4ECDF", // slightly deeper cream for sections
  surface: "#FFFFFF",
  surfaceMuted: "#F7F1E8",

  // Brand — burgundy / wine
  wine: "#7B1E3B",
  wineDeep: "#3D0A18",
  wineSoft: "#FBEAEF",
  wineBorder: "#E7C9D2",

  // Gold — passport + progress + rewards
  gold: "#C77C00",
  goldBright: "#E0A82E",
  goldSoft: "#FBF0D9",

  // Ink used ON gold surfaces (dark brown reads better than charcoal on gold)
  inkOnGold: "#2A1A00",
  inkOnGoldMuted: "rgba(42,26,0,0.72)",
  inkOnGoldSubtle: "rgba(42,26,0,0.55)",
  onGoldTrack: "rgba(42,26,0,0.18)",

  // Faint cream used for decorative glyphs on dark/burgundy surfaces
  textOnDarkFaint: "rgba(251,247,239,0.55)",

  // Text — warm charcoal
  text: "#2A2024",
  textMuted: "#6B5C61",
  textSubtle: "#9C8D92",
  textOnDark: "#FBF7EF",
  textOnDarkMuted: "#D8C3CB",

  // Lines + states
  border: "#ECE1D3",
  borderStrong: "#DBCBB8",
  success: "#3F7D5A",
  successSoft: "#E6F0EA",
  danger: "#A3204F",
  dangerSoft: "#FBE7EE",

  // Misc
  overlay: "rgba(61, 10, 24, 0.55)",
  shimmer: "#EFE6D8",
} as const;

/** 4pt spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 48,
  "5xl": 64,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  "2xl": 32,
  pill: 999,
} as const;

/**
 * Font family names match the @expo-google-fonts exports loaded at startup.
 * Falls back to platform serif/sans before fonts finish loading.
 */
export const fonts = {
  serif: "PlayfairDisplay_600SemiBold",
  serifBold: "PlayfairDisplay_700Bold",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemibold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
} as const;

const platformSerifFallback = Platform.select({ ios: "Georgia", default: "serif" });

/** Composable typography presets. */
export const type: Record<string, TextStyle> = {
  display: {
    fontFamily: fonts.serifBold,
    fontSize: 34,
    lineHeight: 40,
    color: colors.text,
    letterSpacing: 0.2,
  },
  h1: {
    fontFamily: fonts.serif,
    fontSize: 26,
    lineHeight: 32,
    color: colors.text,
  },
  h2: {
    fontFamily: fonts.serif,
    fontSize: 21,
    lineHeight: 27,
    color: colors.text,
  },
  title: {
    fontFamily: fonts.sansSemibold,
    fontSize: 17,
    lineHeight: 23,
    color: colors.text,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15.5,
    lineHeight: 24,
    color: colors.text,
  },
  bodyMuted: {
    fontFamily: fonts.sans,
    fontSize: 15.5,
    lineHeight: 24,
    color: colors.textMuted,
  },
  label: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    lineHeight: 18,
    color: colors.text,
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  overline: {
    fontFamily: fonts.sansSemibold,
    fontSize: 11.5,
    lineHeight: 14,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: colors.textSubtle,
  },
  serifFallback: {
    fontFamily: platformSerifFallback,
  },
};

export const shadow: Record<string, ViewStyle> = {
  card: {
    shadowColor: "#3D0A18",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  soft: {
    shadowColor: "#3D0A18",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  raised: {
    shadowColor: "#3D0A18",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 8,
  },
};

/** A small palette of gradient pairs for winery emblems, keyed by index. */
export const emblemGradients: [string, string][] = [
  ["#7B1E3B", "#3D0A18"],
  ["#5A1B3A", "#2C0A2A"],
  ["#8B1C34", "#52111F"],
  ["#6D1429", "#360A18"],
  ["#A3204F", "#5A0F2C"],
  ["#7A2E2A", "#3A1212"],
  ["#612447", "#2E0F26"],
];

export const theme = {
  colors,
  spacing,
  radius,
  fonts,
  type,
  shadow,
  emblemGradients,
} as const;

export type Theme = typeof theme;
