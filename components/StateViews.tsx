import { View, Text, ActivityIndicator, Pressable, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, radius } from "@/lib/theme"

export function LoadingView({ label = "Loading..." }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  )
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={styles.center}>
      <Ionicons name="cloud-offline-outline" size={28} color={colors.textMuted} />
      <Text style={styles.errorText}>{message}</Text>
      {onRetry ? (
        <Pressable style={styles.retry} onPress={onRetry}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  muted: { color: colors.textMuted, fontSize: 14 },
  errorText: { color: colors.textMuted, fontSize: 14, textAlign: "center", maxWidth: 260 },
  retry: {
    marginTop: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  retryText: { color: colors.primary, fontWeight: "600" },
})
