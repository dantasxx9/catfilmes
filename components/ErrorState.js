import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';

// Estado de erro, com botao para tentar a requisicao de novo.
// O X no topo (onFechar) e opcional: cada tela decide para onde ele leva.
export default function ErrorState({ mensagem, onTentarNovamente, onFechar }) {
  return (
    <View style={styles.container}>
      {onFechar && (
        <TouchableOpacity
          style={styles.fechar}
          onPress={onFechar}
          hitSlop={12}
          accessibilityLabel="Fechar mensagem de erro"
        >
          <Ionicons name="close" size={26} color="#8b90a0" />
        </TouchableOpacity>
      )}

      <View style={styles.conteudo}>
        <Ionicons name="cloud-offline-outline" size={48} color="#e50914" />
        <Text style={styles.mensagem}>{mensagem}</Text>
        {onTentarNovamente && (
          <Button titulo="Tentar novamente" icone="refresh" onPress={onTentarNovamente} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12151c' },
  fechar: { position: 'absolute', top: 12, right: 12, padding: 6, zIndex: 1 },
  conteudo: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  mensagem: { color: '#fff', textAlign: 'center', marginVertical: 16, lineHeight: 21 },
});
