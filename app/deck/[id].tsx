import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Surface } from "@/components/Surface"
import { ProgressBar } from "@/components/ProgressBar"
import { Button } from "@/components/ui"
import { LoadingView, ErrorView } from "@/components/StateViews"
import { useFetch } from "@/hooks/useFetch"
import { api } from "@/lib/api"
import { accentMap, colors } from "@/lib/theme"

export default function DeckDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const deck = useFetch(() => api.getDeck(id), [id])
  const cards = useFetch(() => api.getCards(id), [id])

  const accent = deck.data ? accentMap[deck.data.accent] : accentMap.blue

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
        <Ionicons name="chevron-back" size={22} color={colors.text} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      {deck.loading ? (
        <LoadingView />
      ) : deck.error || !deck.data ? (
        <ErrorView message={deck.error ?? "Deck not found"} onRetry={deck.refetch} />
      ) : (
        <>
          <View style={[styles.iconWrap, { backgroundColor: accent.soft }]}>
            <Ionicons name="book" size={26} color={accent.color} />
          </View>
          <Text style={styles.title}>{deck.data.title}</Text>
          <Text style={styles.meta}>
            {deck.data.cardCount} cards · Last studied {deck.data.lastStudied}
          </Text>

          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>{deck.data.progress}%</Text>
          </View>
          <ProgressBar progress={deck.data.progress} color={accent.color} height={8} />

          <Button
            label="Study this deck"
            icon="play"
            variant="green"
            style={styles.studyBtn}
            onPress={() => router.push("/study")}
          />

          <Text style={styles.sectionTitle}>Cards</Text>
          {cards.loading ? (
            <LoadingView label="Loading cards..." />
          ) : cards.error ? (
            <ErrorView message={cards.error} onRetry={cards.refetch} />
          ) : cards.data && cards.data.length > 0 ? (
            <View style={styles.cardList}>
              {cards.data.map((card) => (
                <Surface key={card.id} style={styles.cardItem}>
                  <Text style={styles.cardFront}>{card.front}</Text>
                  <Text style={styles.cardBack}>{card.back}</Text>
                </Surface>
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>No cards in this deck yet.</Text>
          )}
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  back: { flexDirection: "row", alignItems: "center", gap: 2, marginBottom: 16 },
  backText: { color: colors.text, fontSize: 16, fontWeight: "500" },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: { color: colors.text, fontSize: 26, fontWeight: "700" },
  meta: { color: colors.textMuted, fontSize: 14, marginTop: 4, marginBottom: 20 },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: { color: colors.textMuted, fontSize: 14 },
  progressValue: { color: colors.text, fontSize: 15, fontWeight: "700" },
  studyBtn: { marginTop: 24 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: "700", marginTop: 32, marginBottom: 14 },
  cardList: { gap: 12 },
  cardItem: { gap: 8 },
  cardFront: { color: colors.text, fontSize: 16, fontWeight: "600", lineHeight: 22 },
  cardBack: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  empty: { color: colors.textMuted, fontSize: 14, paddingVertical: 12 },
})
