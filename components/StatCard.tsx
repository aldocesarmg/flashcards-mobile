import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Surface } from "./Surface"
import { accentMap, colors } from "@/lib/theme"
import type { Stat } from "@/lib/types"

export function StatCard({ stat }: { stat: Stat }) {
  const accent = accentMap[stat.accent]
  return (
    <Surface style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>{stat.label}</Text>
        <View style={[styles.iconWrap, { backgroundColor: accent.soft }]}>
          <Ionicons name={stat.icon} size={16} color={accent.color} />
        </View>
      </View>
      <Text style={styles.value}>{stat.value}</Text>
      <Text style={styles.caption}>{stat.caption}</Text>
      <View style={styles.deltaRow}>
        <Text style={styles.delta}>{stat.delta}</Text>
        <Text style={styles.deltaCaption}>vs last week</Text>
      </View>
    </Surface>
  )
}

const styles = StyleSheet.create({
  card: { flex: 1, minWidth: 150, gap: 6 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  label: { color: colors.textMuted, fontSize: 13, flex: 1, paddingRight: 8, lineHeight: 18 },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  value: { color: colors.text, fontSize: 30, fontWeight: "700", marginTop: 6 },
  caption: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  deltaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  delta: { color: colors.success, fontSize: 12, fontWeight: "700" },
  deltaCaption: { color: colors.textFaint, fontSize: 12 },
})
