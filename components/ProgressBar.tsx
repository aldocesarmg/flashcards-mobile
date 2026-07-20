import { View, StyleSheet } from "react-native"
import { colors, radius } from "@/lib/theme"

interface ProgressBarProps {
  progress: number // 0 - 100
  color?: string
  height?: number
}

export function ProgressBar({ progress, color = colors.primary, height = 6 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, progress))
  return (
    <View style={[styles.track, { height, borderRadius: height }]}>
      <View
        style={{
          width: `${clamped}%`,
          height,
          backgroundColor: color,
          borderRadius: radius.pill,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
})
