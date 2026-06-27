import React, { useCallback, useEffect, useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { Winery } from "@swt/shared";

import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { WineryEmblem } from "@/components/WineryEmblem";
import { ErrorState, Loading } from "@/components/States";
import { getWineries } from "@/lib/data";
import {
  directionsToUrl,
  nextStop,
  trailStopNumber,
  walkingDirectionsUrl,
} from "@/lib/trail";
import { TOTAL_STOPS } from "@/lib/constants";
import { colors, radius, shadow, spacing, type } from "@/lib/theme";

export default function MapScreen() {
  const router = useRouter();

  const [wineries, setWineries] = useState<Winery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (mode: "initial" | "refresh") => {
    if (mode === "initial") setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await getWineries();
      setWineries(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "We couldn't load the trail right now."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load("initial");
  }, [load]);

  const openUrl = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      /* If the maps handler is unavailable we silently no-op rather than crash. */
    });
  }, []);

  return (
    <Screen
      title="Trail Map"
      subtitle="Walk the trail in order through Old Town Scottsdale."
      refreshing={refreshing}
      onRefresh={() => void load("refresh")}
    >
      {loading ? (
        <Loading label="Mapping the trail…" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void load("initial")} />
      ) : (
        <View style={styles.container}>
          <IntroCard count={wineries.length} />

          <Text style={[type.overline, styles.sectionLabel]}>
            The walking itinerary
          </Text>

          <View>
            {wineries.map((winery, index) => {
              const stop = trailStopNumber(winery.slug) ?? index + 1;
              const next = nextStop(winery.slug, wineries);
              const isLast = index === wineries.length - 1;

              return (
                <View key={winery.id} style={styles.stopRow}>
                  {/* Itinerary spine: dot + connector */}
                  <View style={styles.spine}>
                    <View style={styles.spineDot}>
                      <Text style={styles.spineDotText}>{stop}</Text>
                    </View>
                    {!isLast && <View style={styles.connector} />}
                  </View>

                  <View style={styles.stopBody}>
                    <Card
                      onPress={() => router.push(`/explore/${winery.slug}`)}
                      style={styles.card}
                    >
                      <View style={styles.cardHead}>
                        <WineryEmblem
                          name={winery.name}
                          seed={stop - 1}
                          size={58}
                          stopNumber={stop}
                        />
                        <View style={styles.cardHeadText}>
                          <Text style={styles.name} numberOfLines={2}>
                            {winery.name}
                          </Text>
                          <View style={styles.metaRow}>
                            <Ionicons
                              name="location-outline"
                              size={13}
                              color={colors.textSubtle}
                            />
                            <Text style={styles.address} numberOfLines={2}>
                              {winery.address}
                            </Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.actions}>
                        <View style={styles.actionItem}>
                          <Button
                            variant="secondary"
                            size="md"
                            icon="navigate"
                            label="Directions"
                            onPress={() => openUrl(directionsToUrl(winery))}
                          />
                        </View>

                        {next ? (
                          <View style={styles.actionItem}>
                            <Button
                              variant="primary"
                              size="md"
                              icon="walk"
                              label="Walk to next stop"
                              onPress={() =>
                                openUrl(walkingDirectionsUrl(winery, next))
                              }
                            />
                          </View>
                        ) : (
                          <View style={styles.finalNote}>
                            <Ionicons
                              name="flag"
                              size={15}
                              color={colors.gold}
                            />
                            <Text style={styles.finalNoteText}>
                              Final stop — trail complete!
                            </Text>
                          </View>
                        )}
                      </View>
                    </Card>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </Screen>
  );
}

function IntroCard({ count }: { count: number }) {
  const stops = count || TOTAL_STOPS;
  return (
    <Card style={styles.intro} padded={false}>
      <LinearGradient
        colors={[colors.wine, colors.wineDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.introMap}
      >
        {/* Stylized "map" illustration: a gentle walking path of stops. */}
        <View style={styles.introPath}>
          {Array.from({ length: Math.min(stops, TOTAL_STOPS) }).map((_, i) => (
            <View key={i} style={styles.introPathItem}>
              <View
                style={[
                  styles.introNode,
                  i === 0 && styles.introNodeFirst,
                  i === Math.min(stops, TOTAL_STOPS) - 1 &&
                    styles.introNodeLast,
                ]}
              >
                {i === 0 ? (
                  <Ionicons name="walk" size={13} color={colors.wineDeep} />
                ) : i === Math.min(stops, TOTAL_STOPS) - 1 ? (
                  <Ionicons name="flag" size={12} color={colors.wineDeep} />
                ) : (
                  <View style={styles.introNodeDot} />
                )}
              </View>
              {i < Math.min(stops, TOTAL_STOPS) - 1 && (
                <View style={styles.introDash} />
              )}
            </View>
          ))}
        </View>
        <View style={styles.introMapLabel}>
          <Ionicons name="map" size={14} color={colors.textOnDarkMuted} />
          <Text style={styles.introMapLabelText}>Old Town Scottsdale</Text>
        </View>
      </LinearGradient>

      <View style={styles.introCopy}>
        <Badge label="All within a short walk" tone="gold" icon="walk" />
        <Text style={styles.introTitle}>One easy loop, on foot</Text>
        <Text style={styles.introBody}>
          Every tasting room sits within a few walking minutes of the next in
          the heart of Old Town. Follow the stops in order below and tap for
          turn-by-turn directions.
        </Text>
        <View style={styles.introSoon}>
          <Ionicons
            name="navigate-circle-outline"
            size={16}
            color={colors.wine}
          />
          <Text style={styles.introSoonText}>
            A live in-app map is on the way — for now we'll hand you off to your
            maps app for directions.
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },

  // Intro card
  intro: {
    overflow: "hidden",
    marginBottom: spacing["2xl"],
  },
  introMap: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing["2xl"],
    gap: spacing.lg,
  },
  introPath: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  introPathItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  introNode: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: "rgba(251,247,239,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  introNodeFirst: {
    backgroundColor: colors.goldBright,
  },
  introNodeLast: {
    backgroundColor: colors.goldBright,
  },
  introNodeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.wine,
  },
  introDash: {
    width: 18,
    height: 2,
    borderRadius: 1,
    marginHorizontal: 3,
    backgroundColor: "rgba(251,247,239,0.4)",
  },
  introMapLabel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  introMapLabelText: {
    ...type.overline,
    color: colors.textOnDarkMuted,
  },
  introCopy: {
    padding: spacing.xl,
    gap: spacing.sm,
  },
  introTitle: {
    ...type.h2,
    marginTop: spacing.xs,
  },
  introBody: {
    ...type.bodyMuted,
  },
  introSoon: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.wineSoft,
  },
  introSoonText: {
    ...type.caption,
    flex: 1,
    color: colors.wine,
  },

  // Section
  sectionLabel: {
    marginBottom: spacing.lg,
    marginLeft: spacing.xs,
  },

  // Itinerary rows
  stopRow: {
    flexDirection: "row",
  },
  spine: {
    width: 34,
    alignItems: "center",
  },
  spineDot: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.wine,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xs,
    ...shadow.soft,
  },
  spineDotText: {
    fontFamily: type.label.fontFamily,
    fontSize: 13,
    color: colors.textOnDark,
  },
  connector: {
    flex: 1,
    width: 2,
    borderRadius: 1,
    backgroundColor: colors.borderStrong,
    marginVertical: spacing.xs,
  },
  stopBody: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.lg,
  },
  card: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  cardHeadText: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...type.h2,
    fontSize: 18,
    lineHeight: 23,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
  },
  address: {
    ...type.caption,
    flex: 1,
    color: colors.textSubtle,
  },
  actions: {
    gap: spacing.sm,
  },
  actionItem: {
    width: "100%",
  },
  finalNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.goldSoft,
  },
  finalNoteText: {
    ...type.label,
    color: colors.gold,
  },
});
