/**
 * FlashMind design tokens.
 * Replicated from the FlashMind dashboard: near-black surfaces, a vivid blue
 * primary, a soft mint-green secondary, and a warm orange tertiary accent.
 */
export const colors = {
  // Surfaces
  background: "#0A0A0B",
  surface: "#131315",
  surfaceElevated: "#18181B",
  surfaceHover: "#1E1E22",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",

  // Text
  text: "#F5F5F7",
  textMuted: "#8A8A90",
  textFaint: "#5C5C63",

  // Brand accents
  primary: "#4C82FB",
  primarySoft: "rgba(76,130,251,0.14)",
  green: "#6FE0A0",
  greenSoft: "rgba(111,224,160,0.14)",
  orange: "#F5A15C",
  orangeSoft: "rgba(245,161,92,0.14)",

  // Semantic
  success: "#4ADE80",
  onPrimary: "#0A0A0B",
  onGreen: "#0A0A0B",
} as const

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const

export const font = {
  // System font stack keeps it clean and native-feeling on every platform.
  regular: "System",
  weightRegular: "400" as const,
  weightMedium: "500" as const,
  weightSemibold: "600" as const,
  weightBold: "700" as const,
}

/** Maps a semantic accent name to its color + soft background pair. */
export const accentMap = {
  blue: { color: colors.primary, soft: colors.primarySoft },
  green: { color: colors.green, soft: colors.greenSoft },
  orange: { color: colors.orange, soft: colors.orangeSoft },
} as const

export type AccentName = keyof typeof accentMap
