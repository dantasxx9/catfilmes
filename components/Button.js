import { StyleSheet, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function Button({ titulo, onPress, icone, secondary = false, selected }) {
  const foreground = secondary && !selected ? colors.text : colors.background;
  return <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress}
    style={({ pressed }) => [styles.button, secondary && !selected && styles.secondary, pressed && { opacity: 0.65 }]}>
    {icone && <Ionicons name={icone} size={18} color={foreground} />}
    <Text style={[styles.text, { color: foreground }]}>{titulo}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    minHeight: 44, backgroundColor: colors.accent, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12 },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  text: { fontSize: 14, fontWeight: '600' },
});
