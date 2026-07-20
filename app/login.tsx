import { useState } from "react"
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { Button, TextField } from "@/components/ui"
import { useAuth } from "@/lib/auth"
import { colors } from "@/lib/theme"

export default function LoginScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { signIn } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    setError(null)
    setLoading(true)
    try {
      await signIn(username, password)
      // The root navigator redirects to the tabs once `user` is set.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 48 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandMark}>
          <Ionicons name="sparkles" size={26} color={colors.text} />
        </View>
        <Text style={styles.brand}>FlashMind</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue studying</Text>

        <View style={styles.form}>
          <TextField
            label="Username"
            placeholder="aldo"
            autoCapitalize="none"
            autoCorrect={false}
            value={username}
            onChangeText={setUsername}
            onSubmitEditing={handleSignIn}
          />
          <TextField
            label="Password"
            placeholder="••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={handleSignIn}
          />

          {error ? (
            <View style={styles.errorRow}>
              <Ionicons name="alert-circle" size={16} color={colors.orange} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Button label="Sign In" onPress={handleSignIn} loading={loading} style={styles.submit} />
        </View>

        <View style={styles.hint}>
          <Ionicons name="information-circle-outline" size={15} color={colors.textFaint} />
          <Text style={styles.hintText}>Demo login — username: aldo · password: 1234</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Pressable onPress={() => router.push("/signup")} hitSlop={8}>
            <Text style={styles.link}>Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 24, paddingBottom: 40, alignItems: "center" },
  brandMark: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { color: colors.text, fontSize: 22, fontWeight: "700", marginTop: 12 },
  title: { color: colors.text, fontSize: 28, fontWeight: "700", marginTop: 28 },
  subtitle: { color: colors.textMuted, fontSize: 15, marginTop: 6, marginBottom: 8 },
  form: { width: "100%", gap: 16, marginTop: 24 },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  errorText: { color: colors.orange, fontSize: 13, flex: 1 },
  submit: { marginTop: 4 },
  hint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
  },
  hintText: { color: colors.textFaint, fontSize: 12 },
  footer: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 28 },
  footerText: { color: colors.textMuted, fontSize: 14 },
  link: { color: colors.primary, fontSize: 14, fontWeight: "700" },
})
