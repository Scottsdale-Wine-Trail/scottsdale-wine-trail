import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Screen } from "@/components/Screen";
import { Loading } from "@/components/States";
import { useAuth } from "@/lib/auth";
import { FLIGHT_DISCOUNT } from "@/lib/constants";
import { colors, fonts, radius, spacing, type } from "@/lib/theme";

const APP_VERSION = "v0.1.0";

type ValueProp = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  body: string;
};

const VALUE_PROPS: ValueProp[] = [
  {
    icon: "ribbon-outline",
    title: "Save every stamp",
    body: "Your Digital Passport syncs across visits — pick up right where you left off.",
  },
  {
    icon: "trending-up-outline",
    title: "Track your progress",
    body: "See how many of the trail's stops you've collected on the way to the full set.",
  },
  {
    icon: "pricetag-outline",
    title: `${FLIGHT_DISCOUNT} off every flight`,
    body: "Members save on a tasting flight at every winery on the trail.",
  },
];

type QuickLink = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  caption: string;
  route: "/passport" | "/" | "/map";
};

const QUICK_LINKS: QuickLink[] = [
  {
    icon: "ribbon-outline",
    label: "Your Passport",
    caption: "Stamps & rewards",
    route: "/passport",
  },
  {
    icon: "compass-outline",
    label: "Explore the trail",
    caption: "Wineries & tasting rooms",
    route: "/",
  },
  {
    icon: "map-outline",
    label: "Trail map",
    caption: "Plan your route",
    route: "/map",
  },
];

export default function AccountScreen() {
  const router = useRouter();
  const { initializing, isLoggedIn, user, signOut } = useAuth();

  if (initializing) {
    return (
      <Screen title="Account">
        <Loading label="Loading your account…" />
      </Screen>
    );
  }

  if (!isLoggedIn) {
    return (
      <Screen
        title="Account"
        subtitle="Sign in to save your stamps and unlock member perks."
      >
        <Card>
          <Text style={styles.overline}>Why sign in</Text>
          <View style={styles.propList}>
            {VALUE_PROPS.map((prop) => (
              <View key={prop.title} style={styles.propRow}>
                <View style={styles.propIcon}>
                  <Ionicons name={prop.icon} size={20} color={colors.wine} />
                </View>
                <View style={styles.propText}>
                  <Text style={styles.propTitle}>{prop.title}</Text>
                  <Text style={styles.propBody}>{prop.body}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.ctaWrap}>
            <Button
              label="Sign in"
              icon="log-in"
              onPress={() => router.push("/login")}
            />
            <View style={styles.passwordlessRow}>
              <Ionicons
                name="sparkles-outline"
                size={14}
                color={colors.textSubtle}
              />
              <Text style={styles.passwordlessText}>
                Passwordless — we'll email you a quick six-digit code.
              </Text>
            </View>
          </View>
        </Card>

        <Footer />
      </Screen>
    );
  }

  const email = user?.email ?? "";
  const initial = (email.trim()[0] ?? "?").toUpperCase();

  return (
    <Screen title="Account">
      <Card>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLetter}>{initial}</Text>
          </View>
          <View style={styles.profileText}>
            <Text style={styles.profileEmail} numberOfLines={1}>
              {email}
            </Text>
            <View style={styles.profileBadge}>
              <Badge label="Signed in" tone="success" icon="checkmark-circle" />
            </View>
          </View>
        </View>
      </Card>

      <Card style={styles.linksCard} padded={false}>
        <Text style={[styles.overline, styles.linksHeading]}>Quick links</Text>
        {QUICK_LINKS.map((link, index) => (
          <Pressable
            key={link.label}
            onPress={() => router.push(link.route)}
            accessibilityRole="button"
            accessibilityLabel={link.label}
            style={({ pressed }) => [
              styles.linkRow,
              index < QUICK_LINKS.length - 1 && styles.linkDivider,
              pressed && styles.linkRowPressed,
            ]}
          >
            <View style={styles.linkIcon}>
              <Ionicons name={link.icon} size={20} color={colors.wine} />
            </View>
            <View style={styles.linkText}>
              <Text style={styles.linkLabel}>{link.label}</Text>
              <Text style={styles.linkCaption}>{link.caption}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textSubtle}
            />
          </Pressable>
        ))}
      </Card>

      <View style={styles.logoutWrap}>
        <Button
          variant="danger"
          label="Log out"
          icon="log-out"
          onPress={async () => {
            await signOut();
            router.replace("/");
          }}
        />
      </View>

      <Footer />
    </Screen>
  );
}

function Footer() {
  return (
    <Text style={styles.footer}>
      Scottsdale Wine Trail · {APP_VERSION}
    </Text>
  );
}

const styles = StyleSheet.create({
  overline: {
    ...type.overline,
  },

  // Logged-out value props
  propList: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  propRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  propIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.wineSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  propText: {
    flex: 1,
    gap: 2,
  },
  propTitle: {
    ...type.title,
  },
  propBody: {
    ...type.bodyMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  ctaWrap: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  passwordlessRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  passwordlessText: {
    ...type.caption,
    color: colors.textSubtle,
    flexShrink: 1,
  },

  // Profile card
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: radius.pill,
    backgroundColor: colors.wine,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontFamily: fonts.serifBold,
    fontSize: 26,
    color: colors.textOnDark,
  },
  profileText: {
    flex: 1,
    gap: spacing.sm,
  },
  profileEmail: {
    ...type.title,
  },
  profileBadge: {
    flexDirection: "row",
  },

  // Quick links
  linksCard: {
    marginTop: spacing.lg,
    overflow: "hidden",
  },
  linksHeading: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 60,
  },
  linkRowPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  linkDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.wineSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    flex: 1,
    gap: 2,
  },
  linkLabel: {
    ...type.title,
  },
  linkCaption: {
    ...type.caption,
  },

  // Logout
  logoutWrap: {
    marginTop: spacing["2xl"],
  },

  footer: {
    ...type.caption,
    color: colors.textSubtle,
    textAlign: "center",
    marginTop: spacing["3xl"],
  },
});
