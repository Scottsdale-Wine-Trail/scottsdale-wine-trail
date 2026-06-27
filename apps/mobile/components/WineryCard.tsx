import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Winery } from "@swt/shared";
import { Card } from "@/components/Card";
import { WineryEmblem } from "@/components/WineryEmblem";
import { colors, fonts, spacing, type } from "@/lib/theme";
import { trailStopNumber } from "@/lib/trail";

type Props = {
  winery: Winery;
  onPress?: () => void;
  /** Show a gold "Stamped" check when the user has collected this stop. */
  stamped?: boolean;
};

export function WineryCard({ winery, onPress, stamped }: Props) {
  const stop = trailStopNumber(winery.slug);
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        <WineryEmblem
          name={winery.name}
          seed={stop ? stop - 1 : 0}
          size={64}
          stopNumber={stop}
        />
        <View style={styles.body}>
          <Text style={styles.name} numberOfLines={2}>
            {winery.name}
          </Text>
          {!!winery.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {winery.description}
            </Text>
          )}
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={colors.textSubtle} />
            <Text style={styles.address} numberOfLines={1}>
              {winery.address}
            </Text>
          </View>
        </View>
        <View style={styles.trailing}>
          {stamped ? (
            <View style={styles.stamp}>
              <Ionicons name="checkmark" size={15} color={colors.inkOnGold} />
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={20} color={colors.textSubtle} />
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },
  body: {
    flex: 1,
  },
  name: {
    ...type.h2,
    fontSize: 18,
    lineHeight: 23,
  },
  desc: {
    ...type.caption,
    marginTop: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: spacing.sm,
  },
  address: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 12.5,
    color: colors.textSubtle,
  },
  trailing: {
    alignItems: "center",
    justifyContent: "center",
  },
  stamp: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
});
