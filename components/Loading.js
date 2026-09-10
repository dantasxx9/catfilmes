import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// Estado de carregamento, mostrado enquanto a API nao responde.
export default function Loading({ mensagem = 'Carregando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#e50914" />
      <Text style={styles.mensagem}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#12151c' },
  mensagem: { color: '#8b90a0', marginTop: 14 },
});
