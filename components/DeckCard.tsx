import { View, Text, Pressable, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Surface } from "./Surface"
import { ProgressBar } from "./ProgressBar"
import { accentMap, colors } from "@/lib/theme"
import type { Deck } from "@/lib/types"

interface DeckCardProps {
  deck: Deck
  onPress?: () => void
}

export function DeckCard({ deck, onPress }: DeckCardProps) {
  const accent = accentMap[deck.accent]
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Surface accentBorder={accent.color} style={styles.card}>
        <View style={styles.top}>
          <View style={[styles.iconWrap, { backgroundColor: accent.soft }]}>
            <Ionicons name="book-outline" size={18} color={accent.color} />
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={2}>
              {deck.title}
            </Text>
            <Text style={styles.count}>{deck.cardCount} cards</Text>
          </View>
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{deck.progress}%</Text>
        </View>
        <ProgressBar progress={deck.progress} color={accent.color} />

        <Text style={styles.lastStudied}>Last studied: {deck.lastStudied}</Text>
      </Surface>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { gap: 14, width: 240 },
  pressed: { opacity: 0.7 },
  top: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: { flex: 1, gap: 3 },
  title: { color: colors.text, fontSize: 17, fontWeight: "700", lineHeight: 22 },
  count: { color: colors.textMuted, fontSize: 13 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { color: colors.textMuted, fontSize: 13 },
  progressValue: { color: colors.text, fontSize: 14, fontWeight: "700" },
  lastStudied: { color: colors.textFaint, fontSize: 12 },
})
