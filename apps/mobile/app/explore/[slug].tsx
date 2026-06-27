import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import type { Winery, Wine, WineryEvent } from "@swt/shared";

import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { WineryEmblem } from "@/components/WineryEmblem";
import { Loading, ErrorState, EmptyState } from "@/components/States";

import {
  getWineryBySlug,
  getWinesByWinery,
  getUpcomingEventsByWinery,
  getStamps,
  verifyStampCode,
  addStamp,
} from "@/lib/data";
import { useAuth } from "@/lib/auth";
import { trailStopNumber, directionsToUrl } from "@/lib/trail";
import { colors, fonts, radius, shadow, spacing, type } from "@/lib/theme";

const EVENT_TYPE_LABEL: Record<WineryEvent["type"], string> = {
  educational: "Educational",
  festival: "Festival",
  tasting: "Tasting",
  tour: "Tour",
  other: "Event",
};

const EVENT_TYPE_TONE: Record<
  WineryEvent["type"],
  React.ComponentProps<typeof Badge>["tone"]
> = {
  educational: "neutral",
  festival: "wine",
  tasting: "wine",
  tour: "neutral",
  other: "neutral",
};

function formatEventDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} · ${time}`;
}

function formatPrice(price: number | null): string | null {
  if (price == null) return null;
  return Number.isInteger(price) ? `$${price}` : `$${price.toFixed(2)}`;
}

export default function WineryDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [winery, setWinery] = useState<Winery | null>(null);
  const [wines, setWines] = useState<Wine[]>([]);
  const [events, setEvents] = useState<WineryEvent[]>([]);
  const [stamped, setStamped] = useState(false);

  // Stamp modal state.
  const [modalOpen, setModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [justStamped, setJustStamped] = useState(false);

  const load = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const found = await getWineryBySlug(slug);
      if (!found) {
        setWinery(null);
        setWines([]);
        setEvents([]);
        setLoading(false);
        return;
      }
      setWinery(found);

      const [wineList, eventList, stampList] = await Promise.all([
        getWinesByWinery(found.id),
        getUpcomingEventsByWinery(found.id),
        isLoggedIn && user ? getStamps(user.id) : Promise.resolve([]),
      ]);

      setWines(wineList);
      setEvents(eventList);
      setStamped(stampList.some((s) => s.winery_id === found.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load this winery.");
    } finally {
      setLoading(false);
    }
  }, [slug, isLoggedIn, user]);

  useEffect(() => {
    load();
  }, [load]);

  const openCodeModal = useCallback(() => {
    setCode("");
    setCodeError(null);
    setModalOpen(true);
  }, []);

  const closeCodeModal = useCallback(() => {
    if (submitting) return;
    setModalOpen(false);
  }, [submitting]);

  const submitCode = useCallback(async () => {
    if (!winery || !user) return;
    setCodeError(null);

    if (!verifyStampCode(code)) {
      setCodeError(
        "That code didn't match. Ask a team member to confirm today's code."
      );
      return;
    }

    setSubmitting(true);
    try {
      const result = await addStamp(user.id, winery.id);
      if (result.ok) {
        setStamped(true);
        setModalOpen(false);
        setJustStamped(true);
      } else {
        setCodeError(result.error);
      }
    } catch (e) {
      setCodeError(
        e instanceof Error ? e.message : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }, [winery, user, code]);

  const open = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {});
  }, []);

  // --- Loading / error / not-found states ---
  if (loading) {
    return (
      <Screen back title="Winery" subtitle="On the trail">
        <Loading label="Loading winery…" />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen back title="Winery" subtitle="On the trail">
        <ErrorState message={error} onRetry={load} />
      </Screen>
    );
  }

  if (!winery) {
    return (
      <Screen back title="Not found">
        <EmptyState
          icon="wine-outline"
          title="Winery not found"
          message="We couldn't find this tasting room on the trail."
        />
      </Screen>
    );
  }

  const stop = trailStopNumber(slug);
  const seed = stop ? stop - 1 : 0;

  // --- Stamp action card ---
  const stampCard = (
    <Card style={styles.stampCard}>
      {stamped ? (
        <>
          <View style={styles.stampHeaderRow}>
            <View style={styles.stampIconGold}>
              <Ionicons name="checkmark" size={20} color={colors.inkOnGold} />
            </View>
            <View style={styles.stampHeaderText}>
              <Text style={styles.stampTitle}>Stamp collected</Text>
              <Text style={styles.stampSub}>
                {justStamped
                  ? "Nicely done — this stop is on your passport."
                  : "This stop is on your passport."}
              </Text>
            </View>
          </View>
          <Button
            label="Stamp Collected"
            variant="gold"
            icon="checkmark-circle"
            disabled
            onPress={() => {}}
          />
        </>
      ) : isLoggedIn ? (
        <>
          <View style={styles.stampHeaderRow}>
            <View style={styles.stampIconSoft}>
              <Ionicons name="ribbon" size={20} color={colors.gold} />
            </View>
            <View style={styles.stampHeaderText}>
              <Text style={styles.stampTitle}>Collect your stamp</Text>
              <Text style={styles.stampSub}>
                Visiting now? Add this stop to your Digital Passport.
              </Text>
            </View>
          </View>
          <Button
            label="Stamp Visit"
            variant="gold"
            icon="ribbon"
            onPress={openCodeModal}
          />
        </>
      ) : (
        <>
          <View style={styles.stampHeaderRow}>
            <View style={styles.stampIconSoft}>
              <Ionicons name="lock-closed" size={18} color={colors.gold} />
            </View>
            <View style={styles.stampHeaderText}>
              <Text style={styles.stampTitle}>Start your passport</Text>
              <Text style={styles.stampSub}>
                Log in to collect a stamp at each tasting room.
              </Text>
            </View>
          </View>
          <Button
            label="Log in to stamp this visit"
            variant="gold"
            icon="lock-closed"
            onPress={() => router.push("/login")}
          />
        </>
      )}
    </Card>
  );

  return (
    <Screen
      back
      title={winery.name}
      subtitle={stop ? `Stop ${stop} on the trail` : "On the trail"}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <WineryEmblem
          name={winery.name}
          seed={seed}
          size={120}
          stopNumber={stop}
          rounded="xl"
        />
        <View style={styles.heroLocationRow}>
          <Ionicons name="location-outline" size={15} color={colors.textMuted} />
          <Text style={styles.heroLocation}>
            {winery.city}, {winery.state}
          </Text>
        </View>
      </View>

      {/* Passport stamp action */}
      {stampCard}

      {/* About */}
      {!!winery.description && (
        <View style={styles.section}>
          <Text style={styles.overline}>About</Text>
          <Card>
            <Text style={styles.body}>{winery.description}</Text>
          </Card>
        </View>
      )}

      {/* Visit */}
      <View style={styles.section}>
        <Text style={styles.overline}>Visit</Text>
        <Card>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={20}
              color={colors.wine}
              style={styles.infoIcon}
            />
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>
                {winery.address}
                {winery.address ? "\n" : ""}
                {winery.city}, {winery.state} {winery.zip}
              </Text>
            </View>
          </View>

          <View style={styles.directionsRow}>
            <Button
              label="Directions"
              variant="secondary"
              icon="navigate"
              fullWidth={false}
              onPress={() => open(directionsToUrl(winery))}
            />
          </View>

          {!!winery.phone && (
            <>
              <View style={styles.divider} />
              <Pressable
                onPress={() => open(`tel:${winery.phone}`)}
                style={styles.linkRow}
                accessibilityRole="button"
                accessibilityLabel={`Call ${winery.name}`}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color={colors.wine}
                  style={styles.infoIcon}
                />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoLink}>{winery.phone}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textSubtle}
                />
              </Pressable>
            </>
          )}

          {!!winery.website && (
            <>
              <View style={styles.divider} />
              <Pressable
                onPress={() => open(winery.website as string)}
                style={styles.linkRow}
                accessibilityRole="button"
                accessibilityLabel={`Open ${winery.name} website`}
              >
                <Ionicons
                  name="globe-outline"
                  size={20}
                  color={colors.wine}
                  style={styles.infoIcon}
                />
                <View style={styles.infoText}>
                  <Text style={styles.infoLabel}>Website</Text>
                  <Text style={styles.infoLink} numberOfLines={1}>
                    {winery.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textSubtle}
                />
              </Pressable>
            </>
          )}
        </Card>
      </View>

      {/* Wines */}
      {wines.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.overline}>Wines</Text>
          <Card padded={false}>
            {wines.map((wine, i) => {
              const price = formatPrice(wine.price);
              return (
                <View
                  key={wine.id}
                  style={[styles.wineRow, i > 0 && styles.rowBordered]}
                >
                  <View style={styles.wineInfo}>
                    <Text style={styles.wineName}>{wine.name}</Text>
                    {!!wine.varietal && (
                      <Text style={styles.wineVarietal}>{wine.varietal}</Text>
                    )}
                    {wine.available === false && (
                      <View style={styles.wineBadge}>
                        <Badge tone="neutral" label="Sold out" />
                      </View>
                    )}
                  </View>
                  {price && (
                    <Text
                      style={[
                        styles.winePrice,
                        wine.available === false && styles.winePriceMuted,
                      ]}
                    >
                      {price}
                    </Text>
                  )}
                </View>
              );
            })}
          </Card>
        </View>
      )}

      {/* Upcoming events */}
      {events.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.overline}>Upcoming events</Text>
          <View style={styles.eventList}>
            {events.map((event) => (
              <Card key={event.id}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Badge
                    tone={EVENT_TYPE_TONE[event.type]}
                    label={EVENT_TYPE_LABEL[event.type]}
                  />
                </View>
                <View style={styles.eventDateRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={colors.gold}
                  />
                  <Text style={styles.eventDate}>
                    {formatEventDate(event.start_date)}
                  </Text>
                </View>
                {!!event.description && (
                  <Text style={styles.eventDesc} numberOfLines={3}>
                    {event.description}
                  </Text>
                )}
              </Card>
            ))}
          </View>
        </View>
      )}

      {/* Guest reviews placeholder */}
      <View style={styles.section}>
        <Text style={styles.overline}>Guest reviews</Text>
        <Card>
          <View style={styles.reviewsRow}>
            <View style={styles.reviewsIcon}>
              <Ionicons name="chatbubbles-outline" size={20} color={colors.wine} />
            </View>
            <Text style={styles.reviewsText}>
              Guest reviews coming soon — tasting notes from fellow trail-goers.
            </Text>
          </View>
        </Card>
      </View>

      {/* Stamp code modal */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={closeCodeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalBackdrop}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="ribbon" size={26} color={colors.gold} />
            </View>
            <Text style={styles.modalTitle}>Stamp My Visit</Text>
            <Text style={styles.modalHelp}>
              Ask a team member for today's code.
            </Text>

            <TextInput
              value={code}
              onChangeText={(t) => {
                setCode(t);
                if (codeError) setCodeError(null);
              }}
              autoCapitalize="characters"
              autoCorrect={false}
              autoFocus
              placeholder="Enter code"
              placeholderTextColor={colors.textSubtle}
              style={[styles.input, !!codeError && styles.inputError]}
              returnKeyType="done"
              onSubmitEditing={submitCode}
              editable={!submitting}
              accessibilityLabel="Stamp code"
            />

            {codeError ? (
              <Text style={styles.errorText}>{codeError}</Text>
            ) : null}

            <View style={styles.modalActions}>
              <Button
                label="Stamp it"
                variant="gold"
                icon="ribbon"
                loading={submitting}
                disabled={code.trim().length === 0}
                onPress={submitCode}
              />
              <Button
                label="Cancel"
                variant="ghost"
                disabled={submitting}
                onPress={closeCodeModal}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  heroLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  heroLocation: {
    ...type.bodyMuted,
    fontSize: 14,
  },

  section: {
    marginTop: spacing["2xl"],
  },
  overline: {
    ...type.overline,
    marginBottom: spacing.md,
  },
  body: {
    ...type.body,
  },

  // Stamp action card
  stampCard: {
    borderColor: colors.goldSoft,
    backgroundColor: colors.surface,
  },
  stampHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  stampHeaderText: {
    flex: 1,
  },
  stampIconGold: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  stampIconSoft: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stampTitle: {
    ...type.title,
  },
  stampSub: {
    ...type.caption,
    marginTop: 2,
  },

  // Visit rows
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
  },
  infoIcon: {
    marginTop: 1,
    marginRight: spacing.md,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    ...type.overline,
    color: colors.textSubtle,
    marginBottom: 3,
  },
  infoValue: {
    ...type.body,
    fontSize: 15,
    lineHeight: 21,
  },
  infoLink: {
    ...type.body,
    fontSize: 15,
    color: colors.wine,
  },
  directionsRow: {
    marginTop: spacing.lg,
    alignSelf: "flex-start",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  // Wines
  wineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.lg,
  },
  rowBordered: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  wineInfo: {
    flex: 1,
  },
  wineName: {
    ...type.title,
    fontSize: 16,
  },
  wineVarietal: {
    ...type.caption,
    marginTop: 2,
  },
  wineBadge: {
    marginTop: spacing.sm,
  },
  winePrice: {
    ...type.title,
    fontSize: 16,
    color: colors.wine,
  },
  winePriceMuted: {
    color: colors.textSubtle,
  },

  // Events
  eventList: {
    gap: spacing.md,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  eventTitle: {
    ...type.h2,
    fontSize: 18,
    lineHeight: 23,
    flex: 1,
  },
  eventDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  eventDate: {
    ...type.label,
    color: colors.textMuted,
  },
  eventDesc: {
    ...type.bodyMuted,
    fontSize: 14.5,
    marginTop: spacing.sm,
  },

  // Reviews placeholder
  reviewsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  reviewsIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.wineSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewsText: {
    ...type.bodyMuted,
    flex: 1,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing["2xl"],
    alignItems: "center",
    ...shadow.raised,
  },
  modalIconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.goldSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...type.h1,
    fontSize: 24,
    textAlign: "center",
  },
  modalHelp: {
    ...type.bodyMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  input: {
    width: "100%",
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.lg,
    fontFamily: fonts.serif,
    fontSize: 22,
    letterSpacing: 4,
    textAlign: "center",
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    ...type.caption,
    color: colors.danger,
    textAlign: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  modalActions: {
    width: "100%",
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
});
