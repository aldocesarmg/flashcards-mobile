import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  type TextInputProps,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, radius } from "@/lib/theme"
import type { IconName } from "@/lib/types"

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8} style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons name="arrow-forward" size={15} color={colors.primary} />
        </Pressable>
      ) : null}
    </View>
  )
}

interface ButtonProps {
  label: string
  icon?: IconName
  onPress?: () => void
  variant?: "primary" | "green" | "ghost"
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  loading?: boolean
}

export function Button({
  label,
  icon,
  onPress,
  variant = "primary",
  style,
  disabled = false,
  loading = false,
}: ButtonProps) {
  const bg =
    variant === "primary" ? colors.primary : variant === "green" ? colors.green : "transparent"
  const fg = variant === "ghost" ? colors.text : colors.onPrimary
  const isDisabled = disabled || loading
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg },
        variant === "ghost" && styles.ghost,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
          <Text style={[styles.buttonText, { color: fg }]}>{label}</Text>
        </>
      )}
    </Pressable>
  )
}

interface TextFieldProps extends Omit<TextInputProps, "style"> {
  label: string
  containerStyle?: StyleProp<ViewStyle>
}

export function TextField({ label, containerStyle, ...props }: TextFieldProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textFaint}
        style={styles.input}
        {...props}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: "700" },
  action: { flexDirection: "row", alignItems: "center", gap: 4 },
  actionText: { color: colors.primary, fontSize: 14, fontWeight: "600" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
  },
  ghost: { borderWidth: 1, borderColor: colors.border },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.45 },
  buttonText: { fontSize: 15, fontWeight: "700" },
  field: { gap: 8 },
  fieldLabel: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 15,
  },
})
