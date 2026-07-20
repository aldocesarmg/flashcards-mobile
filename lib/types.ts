import type { AccentName } from "./theme"

export type IconName = keyof typeof import("@expo/vector-icons/Ionicons").glyphMap

export interface Stat {
  id: string
  label: string
  value: string
  caption: string
  delta: string
  icon: IconName
  accent: AccentName
}

export interface Deck {
  id: string
  title: string
  cardCount: number
  progress: number // 0 - 100
  lastStudied: string
  accent: AccentName
}

export interface Card {
  id: string
  deckId: string
  front: string
  back: string
}

export interface NewDeck {
  title: string
  accent: AccentName
}

export interface NewCard {
  deckId: string
  front: string
  back: string
}

export interface Activity {
  id: string
  title: string
  detail: string
  time: string
  icon: IconName
  accent: AccentName
}

export interface Profile {
  name: string
  plan: string
  email: string
  initials: string
  totalCards: number
  cardsMastered: number
  currentStreak: number
  studyHours: number
}
