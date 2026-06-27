import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radius, spacing } from "@/lib/theme";

type Variant = "primary" | "secondary" | "gold" | "ghost" | "danger";
type Size = "md" | "lg";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  iconRight?: boolean;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

const palette: Record<
  Variant,
  { bg: string; fg: string; border?: string; pressedBg: string }
> = {
  primary: { bg: colors.wine, fg: colors.textOnDark, pressedBg: colors.wineDeep },
  secondary: {
    bg: colors.surface,
    fg: colors.wine,
    border: colors.wineBorder,
    pressedBg: colors.wineSoft,
  },
  gold: { bg: colors.gold, fg: colors.inkOnGold, pressedBg: "#A86400" },
  ghost: {
    bg: "transparent",
    fg: colors.wine,
    border: "transparent",
    pressedBg: colors.wineSoft,
  },
  danger: { bg: colors.dangerSoft, fg: colors.danger, pressedBg: "#F6D6E1" },
};

export function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  icon,
  iconRight = false,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: Props) {
  const c = palette[variant];
  const isDisabled = disabled || loading;
  const height = size === "lg" ? 54 : 46;
  const fontSize = size === "lg" ? 16 : 15;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          backgroundColor: pressed && !isDisabled ? c.pressedBg : c.bg,
          borderColor: c.border ?? "transparent",
          borderWidth: c.border ? 1.5 : 0,
          width: fullWidth ? "100%" : undefined,
          opacity: isDisabled ? 0.55 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={c.fg} />
      ) : (
        <View style={styles.content}>
          {icon && !iconRight && (
            <Ionicons name={icon} size={fontSize + 3} color={c.fg} />
          )}
          <Text style={[styles.label, { color: c.fg, fontSize }]}>{label}</Text>
          {icon && iconRight && (
            <Ionicons name={icon} size={fontSize + 3} color={c.fg} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  label: {
    fontFamily: fonts.sansSemibold,
    letterSpacing: 0.2,
  },
});
