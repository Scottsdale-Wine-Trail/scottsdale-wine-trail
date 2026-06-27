import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import { colors, spacing, type } from "@/lib/theme";

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.wine} size="large" />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.center}>
      <Ionicons name="cloud-offline-outline" size={40} color={colors.textSubtle} />
      <Text style={[type.title, styles.title]}>Couldn't load this</Text>
      <Text style={styles.muted}>{message}</Text>
      {onRetry && (
        <View style={styles.retry}>
          <Button label="Try again" variant="secondary" fullWidth={false} onPress={onRetry} />
        </View>
      )}
    </View>
  );
}

export function EmptyState({
  icon = "wine-outline",
  title,
  message,
}: {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  message?: string;
}) {
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={40} color={colors.textSubtle} />
      <Text style={[type.title, styles.title]}>{title}</Text>
      {message ? <Text style={styles.muted}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: spacing["4xl"],
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  title: {
    marginTop: spacing.xs,
  },
  muted: {
    ...type.bodyMuted,
    textAlign: "center",
    paddingHorizontal: spacing.xl,
  },
  retry: {
    marginTop: spacing.md,
  },
});
