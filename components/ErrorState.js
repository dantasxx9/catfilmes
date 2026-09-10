import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

// Estado de erro, com botao para tentar a requisicao de novo.
export default function ErrorState({ mensagem, onTentarNovamente }) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color="#e50914" />
      <Text style={styles.mensagem}>{mensagem}</Text>
      {onTentarNovamente && (
        <Button titulo="Tentar novamente" icone="refresh" onPress={onTentarNovamente} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#12151c',
  },
  mensagem: { color: '#fff', textAlign: 'center', marginVertical: 16, lineHeight: 21 },
});
