import React from "react";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, spacing, type } from "@/lib/theme";

type Props = {
  title: string;
  subtitle?: string;
  /** Show a small "SCOTTSDALE WINE TRAIL" overline above the title. */
  overline?: string;
  /** Show a back chevron (router.back()). Use on pushed/stack screens. */
  back?: boolean;
  /** Element rendered at the right of the header row. */
  right?: React.ReactNode;
  /** Scrollable body (default true). Set false for screens that manage their own list. */
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Sticky element pinned above the bottom safe area (e.g. a primary CTA). */
  footer?: React.ReactNode;
  contentStyle?: ViewStyle;
  children: React.ReactNode;
};

export function Screen({
  title,
  subtitle,
  overline = "Scottsdale Wine Trail",
  back = false,
  right,
  scroll = true,
  refreshing,
  onRefresh,
  footer,
  contentStyle,
  children,
}: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const header = (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        {back ? (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={22} color={colors.wine} />
          </Pressable>
        ) : (
          <Text style={styles.overline}>{overline.toUpperCase()}</Text>
        )}
        {right ? <View>{right}</View> : null}
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );

  const body = (
    <>
      {header}
      {children}
    </>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: spacing["4xl"] + (footer ? 88 : 0) },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={!!refreshing}
                onRefresh={onRefresh}
                tintColor={colors.wine}
                colors={[colors.wine]}
              />
            ) : undefined
          }
        >
          {body}
        </ScrollView>
      ) : (
        <View style={[styles.content, { flex: 1 }, contentStyle]}>{body}</View>
      )}

      {footer ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.xl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 28,
    marginBottom: spacing.sm,
  },
  overline: {
    ...type.overline,
    color: colors.gold,
  },
  backBtn: {
    marginLeft: -6,
    width: 34,
    height: 28,
    justifyContent: "center",
  },
  title: {
    ...type.display,
  },
  subtitle: {
    ...type.bodyMuted,
    marginTop: spacing.xs,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: Platform.select({
      ios: "rgba(251,247,239,0.94)",
      default: colors.background,
    }),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
