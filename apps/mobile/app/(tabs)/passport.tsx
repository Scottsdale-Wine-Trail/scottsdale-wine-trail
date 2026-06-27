import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { Winery } from "@swt/shared";

import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { ProgressBar } from "@/components/ProgressBar";
import { WineryCard } from "@/components/WineryCard";
import { ErrorState, Loading } from "@/components/States";
import { useAuth } from "@/lib/auth";
import { getStamps, getWineries } from "@/lib/data";
import { PASSPORT_BENEFITS, PASSPORT_PRICE, FLIGHT_DISCOUNT } from "@/lib/constants";
import { colors, radius, shadow, spacing, type } from "@/lib/theme";

export default function PassportScreen() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn || !user) {
    return <LoggedOut onLogin={() => router.push("/login")} />;
  }

  return <LoggedIn userId={user.id} onOpenWinery={(slug) => router.push(`/explore/${slug}`)} />;
}

/* -------------------------------------------------------------------------- */
/*  Logged-out: the sales pitch                                               */
/* -------------------------------------------------------------------------- */

function LoggedOut({ onLogin }: { onLogin: () => void }) {
  return (
    <Screen
      title="The Digital Passport"
      subtitle="One pass for all seven Scottsdale tasting rooms."
      footer={<Button label="Log in to start your passport" onPress={onLogin} />}
    >
      <LinearGradient
        colors={[colors.wine, colors.wineDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTopRow}>
          <Badge label="Digital Passport" tone="gold" icon="ticket" />
          <Ionicons name="wine" size={22} color={colors.textOnDarkFaint} />
        </View>
        <Text style={styles.heroPrice}>{PASSPORT_PRICE}</Text>
        <Text style={styles.heroPitch}>
          Collect a stamp at every tasting room and save {FLIGHT_DISCOUNT} on every wine flight along
          the trail.
        </Text>
      </LinearGradient>

      <Text style={styles.sectionLabel}>What's included</Text>
      <View style={styles.benefitList}>
        {PASSPORT_BENEFITS.map((benefit) => (
          <Card key={benefit.title} style={styles.benefitCard}>
            <View style={styles.benefitRow}>
              <View style={styles.benefitIcon}>
                <Ionicons name={benefit.icon} size={20} color={colors.gold} />
              </View>
              <View style={styles.benefitBody}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitText}>{benefit.body}</Text>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Get yours</Text>
      <Card style={styles.demoCard}>
        <View style={styles.demoHeader}>
          <Text style={styles.demoTitle}>Digital Passport — {PASSPORT_PRICE}</Text>
          <Badge label="Demo" tone="neutral" />
        </View>
        <Text style={styles.demoBody}>Purchase flow coming soon.</Text>
        <View style={styles.demoButton}>
          <Button variant="gold" label={`Get the Passport — ${PASSPORT_PRICE}`} disabled />
        </View>
      </Card>
    </Screen>
  );
}

/* -------------------------------------------------------------------------- */
/*  Logged-in: the live passport                                              */
/* -------------------------------------------------------------------------- */

function LoggedIn({
  userId,
  onOpenWinery,
}: {
  userId: string;
  onOpenWinery: (slug: string) => void;
}) {
  const [wineries, setWineries] = useState<Winery[]>([]);
  const [stampedIds, setStampedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // "silent" keeps the current passport on screen and swallows errors — used on
  // tab re-focus so we never flash the loader or wipe the list on a hiccup.
  const load = useCallback(
    async (mode: "initial" | "refresh" | "silent") => {
      if (mode === "refresh") setRefreshing(true);
      else if (mode === "initial") setLoading(true);
      if (mode !== "silent") setError(null);
      try {
        const [allWineries, stamps] = await Promise.all([
          getWineries(),
          getStamps(userId),
        ]);
        setWineries(allWineries);
        setStampedIds(new Set(stamps.map((s) => s.winery_id)));
        if (mode === "silent") setError(null); // recovered in the background
      } catch (e) {
        if (mode !== "silent") {
          setError(e instanceof Error ? e.message : "Please try again.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId]
  );

  const hasLoaded = useRef(false);

  // Full loader on first focus; silent background refresh afterwards (e.g. when
  // returning from a detail screen where a stamp was just collected).
  useFocusEffect(
    useCallback(() => {
      if (!hasLoaded.current) {
        load("initial").finally(() => {
          hasLoaded.current = true;
        });
      } else {
        load("silent");
      }
    }, [load])
  );

  const { stamped, unstamped, stampedCount, total, progress } = useMemo(() => {
    const collected = wineries.filter((w) => stampedIds.has(w.id));
    const remaining = wineries.filter((w) => !stampedIds.has(w.id));
    const totalCount = wineries.length;
    return {
      stamped: collected,
      unstamped: remaining,
      stampedCount: collected.length,
      total: totalCount,
      progress: totalCount > 0 ? collected.length / totalCount : 0,
    };
  }, [wineries, stampedIds]);

  const complete = total > 0 && stampedCount === total;
  const pctLabel = `${Math.round(progress * 100)}% complete`;

  let body: React.ReactNode;
  if (loading) {
    body = <Loading label="Loading your passport…" />;
  } else if (error) {
    body = <ErrorState message={error} onRetry={() => load("initial")} />;
  } else {
    body = (
      <>
        {/* Progress hero */}
        <LinearGradient
          colors={[colors.goldBright, colors.gold]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressHero}
        >
          <Text style={styles.progressOverline}>Your passport</Text>
          <View style={styles.progressCountRow}>
            <Text style={styles.progressCount}>{stampedCount}</Text>
            <Text style={styles.progressTotal}> / {total}</Text>
          </View>
          <Text style={styles.progressCaption}>stamps collected</Text>

          <View style={styles.progressBarWrap}>
            <ProgressBar
              progress={progress}
              height={14}
              trackColor={colors.onGoldTrack}
              fillColor={colors.surface}
            />
          </View>

          <View style={styles.progressFootRow}>
            <Text style={styles.progressPct}>{pctLabel}</Text>
            <View style={styles.progressPerk}>
              <Ionicons name="pricetag" size={13} color={colors.inkOnGold} />
              <Text style={styles.progressPerkText}>
                {FLIGHT_DISCOUNT} off every flight with your passport
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Completion celebration */}
        {complete && (
          <Card style={styles.completeCard}>
            <View style={styles.completeIcon}>
              <Ionicons name="trophy" size={26} color={colors.gold} />
            </View>
            <Text style={styles.completeTitle}>Trail Complete!</Text>
            <Text style={styles.completeBody}>
              You've visited all {total} tasting rooms on the Scottsdale Wine Trail. Your reward is
              coming soon.
            </Text>
          </Card>
        )}

        {/* Demo passport */}
        <Card style={styles.demoMini}>
          <View style={styles.demoMiniLeft}>
            <View style={styles.demoMiniIcon}>
              <Ionicons name="ticket" size={18} color={colors.gold} />
            </View>
            <View style={styles.demoMiniText}>
              <Text style={styles.demoMiniTitle}>
                Digital Passport — {PASSPORT_PRICE} · Demo
              </Text>
              <Text style={styles.demoMiniSub}>Purchase flow coming soon</Text>
            </View>
          </View>
        </Card>

        {/* Collected */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>Collected</Text>
          {stampedCount > 0 && (
            <Text style={styles.sectionCount}>
              {stampedCount} of {total}
            </Text>
          )}
        </View>
        {stamped.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="ribbon-outline" size={22} color={colors.textSubtle} />
            <Text style={styles.emptyText}>
              No stamps yet — visit a tasting room to collect your first.
            </Text>
          </Card>
        ) : (
          <View style={styles.cardList}>
            {stamped.map((w) => (
              <WineryCard
                key={w.id}
                winery={w}
                stamped
                onPress={() => onOpenWinery(w.slug)}
              />
            ))}
          </View>
        )}

        {/* Still to visit */}
        {unstamped.length > 0 && (
          <>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionLabel}>Still to visit</Text>
              <Text style={styles.sectionCount}>{unstamped.length}</Text>
            </View>
            <View style={styles.cardList}>
              {unstamped.map((w) => (
                <WineryCard key={w.id} winery={w} onPress={() => onOpenWinery(w.slug)} />
              ))}
            </View>
          </>
        )}
      </>
    );
  }

  return (
    <Screen
      title="Your Passport"
      subtitle="Collect a stamp at every tasting room."
      refreshing={refreshing}
      onRefresh={() => load("refresh")}
    >
      {body}
    </Screen>
  );
}

/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  /* Shared section headers */
  sectionLabel: {
    ...type.overline,
    marginTop: spacing["2xl"],
    marginBottom: spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing["2xl"],
    marginBottom: spacing.md,
  },
  sectionCount: {
    ...type.caption,
    fontFamily: type.label.fontFamily,
    color: colors.textSubtle,
  },
  cardList: {
    gap: spacing.md,
  },

  /* Logged-out hero */
  hero: {
    borderRadius: radius.xl,
    padding: spacing["2xl"],
    ...shadow.raised,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  heroPrice: {
    ...type.display,
    fontSize: 52,
    lineHeight: 56,
    color: colors.goldBright,
  },
  heroPitch: {
    ...type.body,
    color: colors.textOnDark,
    marginTop: spacing.sm,
  },

  /* Benefits */
  benefitList: {
    gap: spacing.md,
  },
  benefitCard: {
    padding: spacing.lg,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.lg,
  },
  benefitIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitBody: {
    flex: 1,
  },
  benefitTitle: {
    ...type.title,
  },
  benefitText: {
    ...type.bodyMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 3,
  },

  /* Logged-out demo purchase card */
  demoCard: {
    padding: spacing.xl,
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  demoTitle: {
    ...type.title,
    flex: 1,
  },
  demoBody: {
    ...type.bodyMuted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  demoButton: {
    marginTop: spacing.lg,
  },

  /* Logged-in progress hero */
  progressHero: {
    borderRadius: radius.xl,
    padding: spacing["2xl"],
    ...shadow.raised,
  },
  progressOverline: {
    ...type.overline,
    color: colors.inkOnGoldMuted,
  },
  progressCountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: spacing.sm,
  },
  progressCount: {
    ...type.display,
    fontSize: 56,
    lineHeight: 60,
    color: colors.inkOnGold,
  },
  progressTotal: {
    ...type.h1,
    fontSize: 28,
    color: colors.inkOnGoldSubtle,
  },
  progressCaption: {
    ...type.label,
    color: colors.inkOnGoldMuted,
    marginTop: -2,
  },
  progressBarWrap: {
    marginTop: spacing.lg,
  },
  progressFootRow: {
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  progressPct: {
    ...type.label,
    color: colors.inkOnGold,
  },
  progressPerk: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  progressPerkText: {
    ...type.caption,
    color: colors.inkOnGoldMuted,
    fontFamily: type.label.fontFamily,
  },

  /* Completion */
  completeCard: {
    marginTop: spacing.lg,
    alignItems: "center",
    paddingVertical: spacing["2xl"],
    borderColor: colors.goldBright,
    backgroundColor: colors.goldSoft,
  },
  completeIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  completeTitle: {
    ...type.h1,
    color: colors.wine,
  },
  completeBody: {
    ...type.bodyMuted,
    textAlign: "center",
    marginTop: spacing.xs,
  },

  /* Demo mini card */
  demoMini: {
    marginTop: spacing.lg,
    padding: spacing.lg,
  },
  demoMiniLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  demoMiniIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  demoMiniText: {
    flex: 1,
  },
  demoMiniTitle: {
    ...type.label,
  },
  demoMiniSub: {
    ...type.caption,
    marginTop: 1,
  },

  /* Empty collected */
  emptyCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
  },
  emptyText: {
    ...type.bodyMuted,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
