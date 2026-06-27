import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "@/lib/theme";

type Tone = "wine" | "gold" | "success" | "neutral";

const tones: Record<Tone, { bg: string; fg: string }> = {
  wine: { bg: colors.wineSoft, fg: colors.wine },
  gold: { bg: colors.goldSoft, fg: colors.gold },
  success: { bg: colors.successSoft, fg: colors.success },
  neutral: { bg: colors.surfaceMuted, fg: colors.textMuted },
};

type Props = {
  label: string;
  tone?: Tone;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
};

export function Badge({ label, tone = "neutral", icon }: Props) {
  const c = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      {icon && <Ionicons name={icon} size={12} color={c.fg} />}
      <Text style={[styles.label, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: fonts.sansSemibold,
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
