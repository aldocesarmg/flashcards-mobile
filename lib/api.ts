import type { Activity, Card, Deck, NewCard, NewDeck, Profile, Stat } from "./types"

/**
 * Data layer for FlashMind.
 *
 * Right now every function returns sample data through a simulated network
 * round-trip. To switch to a real backend, set EXPO_PUBLIC_API_URL and the
 * `request` helper below will hit your live endpoints instead of the mocks.
 *
 * Each mock function is written so its real counterpart is a one-line swap,
 * e.g. `return request<Deck[]>("/decks")`.
 */

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? ""

const NETWORK_DELAY = 600

function delay<T>(data: T, ms = NETWORK_DELAY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

/**
 * Real fetch helper. Used automatically when EXPO_PUBLIC_API_URL is set.
 * Throws on non-2xx responses so the useFetch hook can surface the error.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  })
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${path}`)
  }
  return (await res.json()) as T
}

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const stats: Stat[] = [
  {
    id: "mastered",
    label: "Cards Mastered",
    value: "247",
    caption: "Out of 380 total cards",
    delta: "+12%",
    icon: "sparkles-outline",
    accent: "blue",
  },
  {
    id: "accuracy",
    label: "Accuracy Rate",
    value: "89%",
    caption: "Last 7 days average",
    delta: "+5%",
    icon: "locate-outline",
    accent: "blue",
  },
  {
    id: "streak",
    label: "Current Streak",
    value: "14",
    caption: "Days of consistent study",
    delta: "+3%",
    icon: "flame-outline",
    accent: "orange",
  },
  {
    id: "time",
    label: "Study Time",
    value: "2.5h",
    caption: "Average daily this week",
    delta: "+8%",
    icon: "time-outline",
    accent: "green",
  },
]

const decks: Deck[] = [
  {
    id: "js-fundamentals",
    title: "JavaScript Fundamentals",
    cardCount: 45,
    progress: 78,
    lastStudied: "2 hours ago",
    accent: "blue",
  },
  {
    id: "react-hooks",
    title: "React Hooks",
    cardCount: 32,
    progress: 45,
    lastStudied: "Yesterday",
    accent: "green",
  },
  {
    id: "typescript-basics",
    title: "TypeScript Basics",
    cardCount: 28,
    progress: 92,
    lastStudied: "3 days ago",
    accent: "orange",
  },
  {
    id: "css-layout",
    title: "CSS Layout & Flexbox",
    cardCount: 36,
    progress: 61,
    lastStudied: "5 days ago",
    accent: "blue",
  },
  {
    id: "system-design",
    title: "System Design",
    cardCount: 52,
    progress: 24,
    lastStudied: "1 week ago",
    accent: "green",
  },
]

const cards: Card[] = [
  {
    id: "c1",
    deckId: "js-fundamentals",
    front: "What is a closure in JavaScript?",
    back: "A closure is a function that retains access to its lexical scope even when executed outside that scope.",
  },
  {
    id: "c2",
    deckId: "js-fundamentals",
    front: "What does the `this` keyword refer to?",
    back: "`this` refers to the execution context of a function, determined by how the function is called.",
  },
  {
    id: "c3",
    deckId: "js-fundamentals",
    front: "Difference between `==` and `===`?",
    back: "`==` compares values with type coercion; `===` compares both value and type with no coercion.",
  },
  {
    id: "c4",
    deckId: "react-hooks",
    front: "When does useEffect run?",
    back: "After the render is committed to the screen, and again whenever any dependency in its array changes.",
  },
  {
    id: "c5",
    deckId: "react-hooks",
    front: "What problem does useCallback solve?",
    back: "It memoizes a function reference so it stays stable between renders, avoiding unnecessary re-renders of children.",
  },
  {
    id: "c6",
    deckId: "typescript-basics",
    front: "What is a union type?",
    back: "A type formed from two or more other types, representing a value that can be any one of them, e.g. `string | number`.",
  },
]

const activity: Activity[] = [
  {
    id: "a1",
    title: "Completed study session",
    detail: "JavaScript Fundamentals",
    time: "2h ago",
    icon: "checkmark-circle-outline",
    accent: "green",
  },
  {
    id: "a2",
    title: "Added new cards",
    detail: "React Hooks - 8 cards",
    time: "5h ago",
    icon: "add-circle-outline",
    accent: "blue",
  },
  {
    id: "a3",
    title: "Achievement unlocked",
    detail: "7-day streak milestone",
    time: "1d ago",
    icon: "trophy-outline",
    accent: "orange",
  },
  {
    id: "a4",
    title: "Reviewed deck",
    detail: "TypeScript Basics",
    time: "2d ago",
    icon: "book-outline",
    accent: "blue",
  },
]

const profile: Profile = {
  name: "Aldo",
  plan: "Free Plan",
  email: "aldo@flashmind.app",
  initials: "A",
  totalCards: 380,
  cardsMastered: 247,
  currentStreak: 14,
  studyHours: 2.5,
}

// ---------------------------------------------------------------------------
// Public API — swap the mock body for `request(...)` when a backend is ready.
// ---------------------------------------------------------------------------

export const api = {
  getStats: (): Promise<Stat[]> =>
    API_BASE_URL ? request<Stat[]>("/stats") : delay(stats),

  getDecks: (): Promise<Deck[]> =>
    API_BASE_URL ? request<Deck[]>("/decks") : delay(decks),

  getDeck: (id: string): Promise<Deck | undefined> =>
    API_BASE_URL ? request<Deck>(`/decks/${id}`) : delay(decks.find((d) => d.id === id)),

  getCards: (deckId: string): Promise<Card[]> =>
    API_BASE_URL
      ? request<Card[]>(`/decks/${deckId}/cards`)
      : delay(cards.filter((c) => c.deckId === deckId)),

  getAllCards: (): Promise<Card[]> =>
    API_BASE_URL ? request<Card[]>("/cards") : delay(cards),

  getStudyCards: (): Promise<Card[]> =>
    API_BASE_URL ? request<Card[]>("/study") : delay(cards),

  getActivity: (): Promise<Activity[]> =>
    API_BASE_URL ? request<Activity[]>("/activity") : delay(activity),

  getProfile: (): Promise<Profile> =>
    API_BASE_URL ? request<Profile>("/profile") : delay(profile),

  // -------------------------------------------------------------------------
  // Mutations. When a backend is configured these persist remotely; otherwise
  // they resolve locally so the in-memory store stays the source of truth.
  // -------------------------------------------------------------------------
  createDeck: (input: NewDeck): Promise<Deck> => {
    const deck: Deck = {
      id: `deck-${Date.now()}`,
      title: input.title,
      accent: input.accent,
      cardCount: 0,
      progress: 0,
      lastStudied: "Never",
    }
    return API_BASE_URL
      ? request<Deck>("/decks", { method: "POST", body: JSON.stringify(input) })
      : delay(deck, 300)
  },

  createCard: (input: NewCard): Promise<Card> => {
    const card: Card = {
      id: `card-${Date.now()}`,
      deckId: input.deckId,
      front: input.front,
      back: input.back,
    }
    return API_BASE_URL
      ? request<Card>(`/decks/${input.deckId}/cards`, {
          method: "POST",
          body: JSON.stringify(input),
        })
      : delay(card, 300)
  },

  updateCard: (id: string, input: NewCard): Promise<Card> => {
    const card: Card = { id, deckId: input.deckId, front: input.front, back: input.back }
    return API_BASE_URL
      ? request<Card>(`/cards/${id}`, { method: "PUT", body: JSON.stringify(input) })
      : delay(card, 300)
  },

  deleteCard: (id: string): Promise<{ id: string }> =>
    API_BASE_URL
      ? request<{ id: string }>(`/cards/${id}`, { method: "DELETE" })
      : delay({ id }, 300),
}
