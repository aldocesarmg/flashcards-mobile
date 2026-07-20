import { useEffect } from "react"
import { Stack, useRouter, useSegments } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { colors } from "@/lib/theme"
import { AuthProvider, useAuth } from "@/lib/auth"
import { DataProvider } from "@/lib/store"

function RootNavigator() {
  const { user } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inAuthGroup = segments[0] === "login" || segments[0] === "signup"
    if (!user && !inAuthGroup) {
      router.replace("/login")
    } else if (user && inAuthGroup) {
      router.replace("/")
    }
  }, [user, segments, router])

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="deck/[id]" options={{ presentation: "card" }} />
      <Stack.Screen name="card/[id]" options={{ presentation: "card" }} />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="deck/[id]" options={{ presentation: "card" }} />
      </Stack>
    </SafeAreaProvider>
  )
}
