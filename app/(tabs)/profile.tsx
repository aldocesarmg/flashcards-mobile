import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Surface } from "@/components/Surface"
import { LoadingView, ErrorView } from "@/components/StateViews"
import { useFetch } from "@/hooks/useFetch"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { accentMap, colors } from "@/lib/theme"
import type { AccentName } from "@/lib/theme"
import type { IconName } from "@/lib/types"

const MENU: { icon: IconName; label: string; accent: AccentName }[] = [
  { icon: "trophy-outline", label: "Achievements", accent: "orange" },
  { icon: "stats-chart-outline", label: "Statistics", accent: "blue" },
  { icon: "notifications-outline", label: "Reminders", accent: "green" },
  { icon: "settings-outline", label: "Settings", accent: "blue" },
  { icon: "help-circle-outline", label: "Help & Support", accent: "green" },
]

export default function ProfileScreen() {
  const insets = useSafeAreaInsets()
  const { user, signOut } = useAuth()
  const { data, loading, error, refetch } = useFetch(api.getProfile)

  const displayName = user?.name ?? data?.name ?? ""
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Profile</Text>

      {loading ? (
        <LoadingView label="Loading profile..." />
      ) : error || !data ? (
        <ErrorView message={error ?? "No profile found"} onRetry={refetch} />
      ) : (
        <>
          <Surface style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.email}>{data.email}</Text>
              <View style={styles.planBadge}>
                <Ionicons name="star" size={12} color={colors.primary} />
                <Text style={styles.planText}>{data.plan}</Text>
              </View>
            </View>
          </Surface>

          <View style={styles.statsRow}>
            <StatPill value={String(data.cardsMastered)} label="Mastered" accent="blue" />
            <StatPill value={`${data.currentStreak}d`} label="Streak" accent="orange" />
            <StatPill value={`${data.studyHours}h`} label="Daily avg" accent="green" />
          </View>

          <Surface style={styles.menu}>
            {MENU.map((item, i) => (
              <View
                key={item.label}
                style={[styles.menuRow, i !== MENU.length - 1 && styles.menuDivider]}
              >
                <View
                  style={[styles.menuIcon, { backgroundColor: accentMap[item.accent].soft }]}
                >
                  <Ionicons name={item.icon} size={18} color={accentMap[item.accent].color} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
              </View>
            ))}
          </Surface>

          <Pressable
            style={({ pressed }) => [styles.signOut, pressed && { opacity: 0.6 }]}
            onPress={signOut}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.textMuted} />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  )
}

function StatPill({ value, label, accent }: { value: string; label: string; accent: AccentName }) {
  return (
    <Surface style={styles.pill}>
      <Text style={[styles.pillValue, { color: accentMap[accent].color }]}>{value}</Text>
      <Text style={styles.pillLabel}>{label}</Text>
    </Surface>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 24, gap: 16 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginBottom: 4 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 16, padding: 20 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.onPrimary, fontSize: 26, fontWeight: "700" },
  profileInfo: { flex: 1, gap: 4 },
  name: { color: colors.text, fontSize: 20, fontWeight: "700" },
  email: { color: colors.textMuted, fontSize: 14 },
  planBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.primarySoft,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 4,
  },
  planText: { color: colors.primary, fontSize: 12, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: 12 },
  pill: { flex: 1, alignItems: "center", gap: 4, paddingVertical: 18 },
  pillValue: { fontSize: 22, fontWeight: "700" },
  pillLabel: { color: colors.textMuted, fontSize: 13 },
  menu: { padding: 4 },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { flex: 1, color: colors.text, fontSize: 15, fontWeight: "500" },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  signOutText: { color: colors.textMuted, fontSize: 15, fontWeight: "600" },
})
