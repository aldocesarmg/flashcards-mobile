import { View, StyleSheet, type ViewProps } from "react-native"
import { colors, radius } from "@/lib/theme"

interface SurfaceProps extends ViewProps {
  accentBorder?: string
}

/** A rounded dark card surface, optionally with a colored left accent border. */
export function Surface({ style, accentBorder, children, ...rest }: SurfaceProps) {
  return (
    <View
      style={[
        styles.surface,
        accentBorder ? { borderLeftWidth: 3, borderLeftColor: accentBorder } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  surface: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
})
