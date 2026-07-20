import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Surface } from "@/components/Surface"
import { ProgressBar } from "@/components/ProgressBar"
import { LoadingView, ErrorView } from "@/components/StateViews"
import { useFetch } from "@/hooks/useFetch"
import { api } from "@/lib/api"
import { accentMap, colors } from "@/lib/theme"
import type { Deck } from "@/lib/types"

export default function DecksScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { data, loading, error, refetch } = useFetch(api.getDecks)

  const totalCards = data?.reduce((sum, d) => sum + d.cardCount, 0) ?? 0

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Your Library</Text>
          <Text style={styles.subtitle}>
            {data ? `${data.length} decks · ${totalCards} cards` : "Loading your decks"}
          </Text>
        </View>
        <Pressable style={styles.addBtn} onPress={refetch}>
          <Ionicons name="add" size={22} color={colors.onPrimary} />
        </Pressable>
      </View>

      {loading ? (
        <LoadingView label="Loading decks..." />
      ) : error ? (
        <ErrorView message={error} onRetry={refetch} />
      ) : (
        <View style={styles.list}>
          {data?.map((deck) => (
            <DeckRow key={deck.id} deck={deck} onPress={() => router.push(`/deck/${deck.id}`)} />
          ))}
        </View>
      )}
    </ScrollView>
  )
}

function DeckRow({ deck, onPress }: { deck: Deck; onPress: () => void }) {
  const accent = accentMap[deck.accent]
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && { opacity: 0.7 }}>
      <Surface accentBorder={accent.color} style={styles.row}>
        <View style={styles.rowTop}>
          <View style={[styles.iconWrap, { backgroundColor: accent.soft }]}>
            <Ionicons name="book-outline" size={20} color={accent.color} />
          </View>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>{deck.title}</Text>
            <Text style={styles.rowMeta}>
              {deck.cardCount} cards · {deck.lastStudied}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textFaint} />
        </View>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressValue}>{deck.progress}%</Text>
        </View>
        <ProgressBar progress={deck.progress} color={accent.color} />
      </Surface>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { color: colors.text, fontSize: 28, fontWeight: "700" },
  subtitle: { color: colors.textMuted, fontSize: 15, marginTop: 4 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  list: { gap: 12 },
  row: { gap: 14 },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowInfo: { flex: 1, gap: 3 },
  rowTitle: { color: colors.text, fontSize: 16, fontWeight: "700" },
  rowMeta: { color: colors.textMuted, fontSize: 13 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { color: colors.textMuted, fontSize: 13 },
  progressValue: { color: colors.text, fontSize: 14, fontWeight: "700" },
})
