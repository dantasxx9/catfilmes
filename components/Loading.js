import { colors } from '../theme';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

// Estado de carregamento, mostrado enquanto a API nao responde.
export default function Loading({ mensagem = 'Carregando...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.mensagem}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  mensagem: { color: colors.muted, marginTop: 14 },
});
