import React, { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { Winery } from "@swt/shared";

import { Screen } from "@/components/Screen";
import { WineryCard } from "@/components/WineryCard";
import { Loading, ErrorState, EmptyState } from "@/components/States";
import { getWineries, getStamps } from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { FLIGHT_DISCOUNT, TOTAL_STOPS } from "@/lib/constants";
import { colors, fonts, radius, shadow, spacing, type } from "@/lib/theme";

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [wineries, setWineries] = useState<Winery[]>([]);
  const [stamped, setStamped] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  // `silent` refreshes keep the current content on screen and swallow errors
  // (used on tab re-focus) so we never flash the full-screen loader or wipe a
  // loaded list on a transient failure.
  const load = useCallback(
    async (silent = false) => {
      if (!silent) setError(false);
      try {
        const list = await getWineries();
        setWineries(list);

        if (user) {
          try {
            const stamps = await getStamps(user.id);
            setStamped(new Set(stamps.map((s) => s.winery_id)));
          } catch {
            // Stamps are non-critical to browsing the trail; never block the list.
            setStamped(new Set());
          }
        } else {
          setStamped(new Set());
        }
      } catch {
        if (!silent) setError(true);
      }
    },
    [user]
  );

  const hasLoaded = useRef(false);

  // Full loader on first load; silent background refresh on every later focus so
  // stamps collected on a detail screen show their gold check without a flash.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!hasLoaded.current) {
        setLoading(true);
        load().finally(() => {
          if (active) {
            setLoading(false);
            hasLoaded.current = true;
          }
        });
      } else {
        load(true);
      }
      return () => {
        active = false;
      };
    }, [load])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  }, [load]);

  const collectedCount = wineries.reduce(
    (n, w) => (stamped.has(w.id) ? n + 1 : n),
    0
  );

  return (
    <Screen
      title="Explore"
      subtitle="Seven Old Town tasting rooms. One unforgettable trail."
      refreshing={refreshing}
      onRefresh={onRefresh}
    >
      {loading ? (
        <Loading label="Pouring the trail…" />
      ) : error ? (
        <ErrorState
          message="We couldn't load the wine trail. Check your connection and try again."
          onRetry={onRefresh}
        />
      ) : (
        <>
          <Pressable
            onPress={() => router.push("/passport")}
            accessibilityRole="button"
            accessibilityLabel="Open your Digital Passport"
            style={({ pressed }) => [
              styles.promoWrap,
              { opacity: pressed ? 0.94 : 1 },
            ]}
          >
            <LinearGradient
              colors={[colors.goldSoft, colors.surface]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.promo}
            >
              <View style={styles.promoIcon}>
                <Ionicons name="ticket" size={22} color={colors.gold} />
              </View>
              <View style={styles.promoBody}>
                <Text style={styles.promoOverline}>Digital Passport</Text>
                <Text style={styles.promoTitle}>
                  Save {FLIGHT_DISCOUNT} on every flight
                </Text>
                <Text style={styles.promoMeta}>
                  {user
                    ? `${collectedCount} of ${TOTAL_STOPS} stamps collected`
                    : `Collect all ${TOTAL_STOPS} stamps • Complete the trail`}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gold} />
            </LinearGradient>
          </Pressable>

          <Text style={styles.sectionLabel}>The Trail</Text>

          {wineries.length === 0 ? (
            <EmptyState
              icon="wine-outline"
              title="No tasting rooms yet"
              message="The trail is being uncorked. Pull to refresh in a moment."
            />
          ) : (
            <View style={styles.list}>
              {wineries.map((winery) => (
                <WineryCard
                  key={winery.id}
                  winery={winery}
                  stamped={stamped.has(winery.id)}
                  onPress={() => router.push(`/explore/${winery.slug}`)}
                />
              ))}
            </View>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  promoWrap: {
    borderRadius: radius.lg,
    ...shadow.soft,
  },
  promo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.goldSoft,
  },
  promoIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.goldSoft,
  },
  promoBody: {
    flex: 1,
  },
  promoOverline: {
    ...type.overline,
    color: colors.gold,
  },
  promoTitle: {
    ...type.h2,
    fontSize: 19,
    lineHeight: 24,
    marginTop: 2,
  },
  promoMeta: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 3,
  },
  sectionLabel: {
    ...type.overline,
    marginTop: spacing["2xl"],
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
});
