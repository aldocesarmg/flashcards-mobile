import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { api } from "./api"
import type { Card, Deck, NewCard, NewDeck } from "./types"

/**
 * Reactive in-memory store for decks and cards.
 *
 * It is seeded from the API fetch layer on mount (so it still "fetches from an
 * API"), then holds the data in React state so create / edit / delete update
 * every screen instantly. Each mutation also calls the matching api method,
 * which persists to a real backend when EXPO_PUBLIC_API_URL is configured.
 */
interface DataContextValue {
  decks: Deck[]
  cards: Card[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getDeck: (id: string) => Deck | undefined
  getDeckCards: (deckId: string) => Card[]
  getCard: (id: string) => Card | undefined
  addDeck: (input: NewDeck) => Promise<Deck>
  addCard: (input: NewCard) => Promise<Card>
  editCard: (id: string, input: NewCard) => Promise<void>
  removeCard: (id: string) => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [nextDecks, nextCards] = await Promise.all([api.getDecks(), api.getAllCards()])
      setDecks(nextDecks)
      setCards(nextCards)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const getDeck = useCallback((id: string) => decks.find((d) => d.id === id), [decks])
  const getCard = useCallback((id: string) => cards.find((c) => c.id === id), [cards])
  const getDeckCards = useCallback(
    (deckId: string) => cards.filter((c) => c.deckId === deckId),
    [cards],
  )

  const addDeck = useCallback(async (input: NewDeck) => {
    const deck = await api.createDeck(input)
    setDecks((prev) => [deck, ...prev])
    return deck
  }, [])

  const addCard = useCallback(async (input: NewCard) => {
    const card = await api.createCard(input)
    setCards((prev) => [...prev, card])
    setDecks((prev) =>
      prev.map((d) =>
        d.id === input.deckId ? { ...d, cardCount: d.cardCount + 1, lastStudied: "Just now" } : d,
      ),
    )
    return card
  }, [])

  const editCard = useCallback(async (id: string, input: NewCard) => {
    await api.updateCard(id, input)
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, front: input.front, back: input.back } : c)),
    )
  }, [])

  const removeCard = useCallback(async (id: string) => {
    let deckId: string | undefined
    setCards((prev) => {
      deckId = prev.find((c) => c.id === id)?.deckId
      return prev.filter((c) => c.id !== id)
    })
    await api.deleteCard(id)
    setDecks((prev) =>
      prev.map((d) =>
        d.id === deckId ? { ...d, cardCount: Math.max(0, d.cardCount - 1) } : d,
      ),
    )
  }, [])

  const value = useMemo<DataContextValue>(
    () => ({
      decks,
      cards,
      loading,
      error,
      refresh,
      getDeck,
      getDeckCards,
      getCard,
      addDeck,
      addCard,
      editCard,
      removeCard,
    }),
    [decks, cards, loading, error, refresh, getDeck, getDeckCards, getCard, addDeck, addCard, editCard, removeCard],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error("useData must be used within a DataProvider")
  return ctx
}
