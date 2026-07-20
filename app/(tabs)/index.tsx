import { ScrollView, View, Text, StyleSheet, ScrollView as HScroll } from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { StatCard } from "@/components/StatCard"
import { DeckCard } from "@/components/DeckCard"
import { Surface } from "@/components/Surface"
import { Button, SectionHeader } from "@/components/ui"
import { LoadingView, ErrorView } from "@/components/StateViews"
import { useFetch } from "@/hooks/useFetch"
import { api } from "@/lib/api"
import { accentMap, colors } from "@/lib/theme"
import type { Activity } from "@/lib/types"

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const stats = useFetch(api.getStats)
  const decks = useFetch(api.getDecks)
  const activity = useFetch(api.getActivity)

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand + greeting */}
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          <Ionicons name="sparkles" size={18} color={colors.text} />
        </View>
        <Text style={styles.brand}>FlashMind</Text>
      </View>

      <Text style={styles.greeting}>Welcome back, Aldo</Text>
      <Text style={styles.subtitle}>You have 24 cards due for review today</Text>

      <View style={styles.ctaRow}>
        <Button
          label="Start Study"
          icon="play"
          variant="green"
          style={styles.cta}
          onPress={() => router.push("/study")}
        />
        <Button
          label="Add Flashcard"
          icon="add"
          variant="primary"
          style={styles.cta}
          onPress={() => router.push("/decks")}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsGrid}>
        {stats.loading ? (
          <LoadingView label="Loading stats..." />
        ) : stats.error ? (
          <ErrorView message={stats.error} onRetry={stats.refetch} />
        ) : (
          stats.data?.map((s) => (
            <View key={s.id} style={styles.statCell}>
              <StatCard stat={s} />
            </View>
          ))
        )}
      </View>

      {/* Continue Learning */}
      <View style={styles.section}>
        <SectionHeader
          title="Continue Learning"
          actionLabel="View all"
          onAction={() => router.push("/decks")}
        />
        {decks.loading ? (
          <LoadingView label="Loading decks..." />
        ) : decks.error ? (
          <ErrorView message={decks.error} onRetry={decks.refetch} />
        ) : (
          <HScroll
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.deckRow}
          >
            {decks.data?.map((d) => (
              <DeckCard key={d.id} deck={d} onPress={() => router.push(`/deck/${d.id}`)} />
            ))}
          </HScroll>
        )}
      </View>

      {/* Recent Activity */}
      <View style={[styles.section, { paddingBottom: 24 }]}>
        <SectionHeader title="Recent Activity" />
        {activity.loading ? (
          <LoadingView label="Loading activity..." />
        ) : activity.error ? (
          <ErrorView message={activity.error} onRetry={activity.refetch} />
        ) : (
          <Surface style={styles.activityCard}>
            {activity.data?.map((item, i) => (
              <ActivityRow
                key={item.id}
                item={item}
                isLast={i === (activity.data?.length ?? 0) - 1}
              />
            ))}
          </Surface>
        )}
      </View>
    </ScrollView>
  )
}

function ActivityRow({ item, isLast }: { item: Activity; isLast: boolean }) {
  const accent = accentMap[item.accent]
  return (
    <View style={[styles.activityRow, !isLast && styles.activityDivider]}>
      <View style={[styles.activityIcon, { backgroundColor: accent.soft }]}>
        <Ionicons name={item.icon} size={16} color={accent.color} />
      </View>
      <View style={styles.activityText}>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <Text style={styles.activityDetail}>{item.detail}</Text>
      </View>
      <Text style={styles.activityTime}>{item.time}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, gap: 4 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  brandMark: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { color: colors.text, fontSize: 20, fontWeight: "700" },
  greeting: { color: colors.text, fontSize: 28, fontWeight: "700" },
  subtitle: { color: colors.textMuted, fontSize: 15, marginTop: 4 },
  ctaRow: { flexDirection: "row", gap: 12, marginTop: 20 },
  cta: { flex: 1 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
  },
  statCell: { width: "47%", flexGrow: 1 },
  section: { marginTop: 28 },
  deckRow: { gap: 12, paddingRight: 4 },
  activityCard: { padding: 4, gap: 0 },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  activityDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityText: { flex: 1, gap: 2 },
  activityTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  activityDetail: { color: colors.textMuted, fontSize: 13 },
  activityTime: { color: colors.textFaint, fontSize: 12 },
})
