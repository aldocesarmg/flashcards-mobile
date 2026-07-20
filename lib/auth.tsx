import { createContext, useCallback, useContext, useMemo, useState } from "react"

/**
 * Lightweight auth for the demo. Credentials live in memory and default to the
 * seeded account (username "aldo", password "1234"). Sign up appends to the
 * in-memory list for the current session. Swap these calls for real endpoints
 * (e.g. api.login / api.register) when a backend is connected.
 */
export interface AuthUser {
  username: string
  name: string
}

interface Account extends AuthUser {
  password: string
}

interface AuthContextValue {
  user: AuthUser | null
  signIn: (username: string, password: string) => Promise<void>
  signUp: (name: string, username: string, password: string) => Promise<void>
  signOut: () => void
}

const SEED_ACCOUNTS: Account[] = [{ username: "aldo", name: "Aldo", password: "1234" }]

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(SEED_ACCOUNTS)
  const [user, setUser] = useState<AuthUser | null>(null)

  const signIn = useCallback(
    async (username: string, password: string) => {
      const u = username.trim().toLowerCase()
      const match = accounts.find((a) => a.username.toLowerCase() === u && a.password === password)
      if (!match) throw new Error("Invalid username or password")
      setUser({ username: match.username, name: match.name })
    },
    [accounts],
  )

  const signUp = useCallback(
    async (name: string, username: string, password: string) => {
      const u = username.trim().toLowerCase()
      if (!name.trim() || !u || !password) throw new Error("Please fill in all fields")
      if (accounts.some((a) => a.username.toLowerCase() === u)) {
        throw new Error("That username is already taken")
      }
      const account: Account = { username: u, name: name.trim(), password }
      setAccounts((prev) => [...prev, account])
      setUser({ username: account.username, name: account.name })
    },
    [accounts],
  )

  const signOut = useCallback(() => setUser(null), [])

  const value = useMemo(() => ({ user, signIn, signUp, signOut }), [user, signIn, signUp, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
