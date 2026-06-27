import React from "react";
import { StyleSheet, View } from "react-native";
import { colors, radius } from "@/lib/theme";

type Props = {
  /** 0..1 */
  progress: number;
  height?: number;
  trackColor?: string;
  fillColor?: string;
};

/** Gold progress bar for passport completion. */
export function ProgressBar({
  progress,
  height = 12,
  trackColor = colors.goldSoft,
  fillColor = colors.gold,
}: Props) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View
      style={[styles.track, { height, backgroundColor: trackColor }]}
      accessibilityRole="progressbar"
      accessibilityValue={{ now: Math.round(pct), min: 0, max: 100 }}
    >
      <View
        style={[styles.fill, { width: `${pct}%`, backgroundColor: fillColor }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
  },
});
