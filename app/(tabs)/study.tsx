import { useMemo, useState } from "react"
import { View, Text, Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { ProgressBar } from "@/components/ProgressBar"
import { Button } from "@/components/ui"
import { LoadingView, ErrorView } from "@/components/StateViews"
import { useFetch } from "@/hooks/useFetch"
import { api } from "@/lib/api"
import { colors, radius } from "@/lib/theme"

export default function StudyScreen() {
  const insets = useSafeAreaInsets()
  const { data, loading, error, refetch } = useFetch(api.getStudyCards)

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState(0)

  const cards = data ?? []
  const total = cards.length
  const current = cards[index]
  const finished = total > 0 && index >= total

  const progress = useMemo(
    () => (total === 0 ? 0 : (Math.min(index, total) / total) * 100),
    [index, total],
  )

  function next(gotIt: boolean) {
    if (gotIt) setKnown((k) => k + 1)
    setFlipped(false)
    setIndex((i) => i + 1)
  }

  function restart() {
    setIndex(0)
    setFlipped(false)
    setKnown(0)
  }

  if (loading) {
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top }]}>
        <LoadingView label="Preparing your session..." />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.centered, { paddingTop: insets.top }]}>
        <ErrorView message={error} onRetry={refetch} />
      </View>
    )
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Study Session</Text>
      <Text style={styles.subtitle}>
        {finished ? "Session complete" : `Card ${index + 1} of ${total}`}
      </Text>

      <View style={styles.progressWrap}>
        <ProgressBar progress={finished ? 100 : progress} color={colors.green} height={8} />
      </View>

      {finished ? (
        <View style={styles.resultWrap}>
          <View style={styles.resultBadge}>
            <Ionicons name="checkmark-done" size={40} color={colors.green} />
          </View>
          <Text style={styles.resultTitle}>Nice work!</Text>
          <Text style={styles.resultText}>
            You knew {known} of {total} cards ({Math.round((known / total) * 100)}%).
          </Text>
          <Button label="Study again" icon="refresh" variant="green" onPress={restart} />
        </View>
      ) : (
        <>
          <Pressable style={styles.card} onPress={() => setFlipped((f) => !f)}>
            <Text style={styles.cardHint}>{flipped ? "ANSWER" : "QUESTION"}</Text>
            <Text style={styles.cardText}>{flipped ? current?.back : current?.front}</Text>
            <View style={styles.flipHint}>
              <Ionicons name="sync-outline" size={15} color={colors.textFaint} />
              <Text style={styles.flipHintText}>Tap to flip</Text>
            </View>
          </Pressable>

          {flipped ? (
            <View style={styles.answerRow}>
              <Pressable style={[styles.judge, styles.judgeMiss]} onPress={() => next(false)}>
                <Ionicons name="close" size={20} color={colors.orange} />
                <Text style={[styles.judgeText, { color: colors.orange }]}>Again</Text>
              </Pressable>
              <Pressable style={[styles.judge, styles.judgeGot]} onPress={() => next(true)}>
                <Ionicons name="checkmark" size={20} color={colors.green} />
                <Text style={[styles.judgeText, { color: colors.green }]}>Got it</Text>
              </Pressable>
            </View>
          ) : (
            <Button label="Show Answer" icon="eye-outline" onPress={() => setFlipped(true)} />
          )}
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 16 },
  centered: { justifyContent: "center" },
  title: { color: colors.text, fontSize: 28, fontWeight: "700" },
  subtitle: { color: colors.textMuted, fontSize: 15, marginTop: 4 },
  progressWrap: { marginTop: 20 },
  card: {
    marginTop: 28,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 28,
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  cardHint: {
    color: colors.textFaint,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  cardText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 30,
  },
  flipHint: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  flipHintText: { color: colors.textFaint, fontSize: 13 },
  answerRow: { flexDirection: "row", gap: 12, marginTop: 24 },
  judge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  judgeMiss: { backgroundColor: colors.orangeSoft, borderColor: "rgba(245,161,92,0.3)" },
  judgeGot: { backgroundColor: colors.greenSoft, borderColor: "rgba(111,224,160,0.3)" },
  judgeText: { fontSize: 15, fontWeight: "700" },
  resultWrap: { alignItems: "center", gap: 14, marginTop: 60 },
  resultBadge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  resultTitle: { color: colors.text, fontSize: 24, fontWeight: "700", marginTop: 8 },
  resultText: { color: colors.textMuted, fontSize: 15, textAlign: "center", marginBottom: 12 },
})
