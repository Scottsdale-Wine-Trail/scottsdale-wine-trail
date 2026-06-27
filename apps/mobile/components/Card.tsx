import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius, shadow, spacing } from "@/lib/theme";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padded?: boolean;
};

/** Rounded white surface with a soft warm shadow. Tappable when onPress is set. */
export function Card({ children, onPress, style, padded = true }: Props) {
  const content = (
    <View
      style={[styles.card, padded && styles.padded, style]}
    >
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  padded: {
    padding: spacing.xl,
  },
});
