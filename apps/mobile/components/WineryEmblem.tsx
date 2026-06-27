import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, emblemGradients, fonts, radius } from "@/lib/theme";

type Props = {
  name: string;
  /** Stable index (e.g. trail position) to pick a gradient. */
  seed?: number;
  size?: number;
  /** Optional small trail-stop number chip in the corner. */
  stopNumber?: number | null;
  rounded?: keyof typeof radius;
  style?: ViewStyle;
};

/**
 * Photo-free winery visual: a warm burgundy gradient with the winery's
 * initial in serif + a wine-glass glyph. Keeps the app premium without
 * depending on hosted images. Swap for <Image> when hero images exist.
 */
export function WineryEmblem({
  name,
  seed = 0,
  size = 64,
  stopNumber = null,
  rounded = "md",
  style,
}: Props) {
  const [a, b] = emblemGradients[Math.abs(seed) % emblemGradients.length];
  const initial = name.trim().charAt(0).toUpperCase() || "•";

  return (
    <LinearGradient
      colors={[a, b]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.box,
        { width: size, height: size, borderRadius: radius[rounded] },
        style,
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.42 }]}>{initial}</Text>
      <Ionicons
        name="wine"
        size={size * 0.22}
        color={colors.textOnDarkFaint}
        style={styles.glyph}
      />
      {stopNumber != null && (
        <View style={styles.stop}>
          <Text style={styles.stopText}>{stopNumber}</Text>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  initial: {
    fontFamily: fonts.serifBold,
    color: colors.textOnDark,
  },
  glyph: {
    position: "absolute",
    bottom: 6,
    right: 7,
  },
  stop: {
    position: "absolute",
    top: 6,
    left: 6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  stopText: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: colors.inkOnGold,
  },
});
