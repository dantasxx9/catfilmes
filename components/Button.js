import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Botao padrao do app, com icone opcional.
export default function Button({ titulo, onPress, icone }) {
  return (
    <TouchableOpacity style={styles.botao} onPress={onPress} activeOpacity={0.8}>
      {icone && <Ionicons name={icone} size={18} color="#fff" style={styles.icone} />}
      <Text style={styles.texto}>{titulo}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e50914',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  icone: { marginRight: 8 },
  texto: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
