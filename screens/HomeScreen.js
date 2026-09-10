import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MovieCard from '../components/MovieCard';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { getPopularMovies } from '../services/moviesService';

// Tela inicial: lista os filmes populares vindos da API.
export default function HomeScreen({ navigation }) {
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarFilmes = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      setFilmes(await getPopularMovies());
    } catch (e) {
      setErro('Nao foi possivel carregar os filmes. Verifique sua conexao e tente de novo.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarFilmes();
  }, [carregarFilmes]);

  if (carregando) return <Loading mensagem="Buscando filmes..." />;

  // O X dispensa a mensagem e cai na lista vazia abaixo, que tem o botao de recarregar.
  if (erro) {
    return (
      <ErrorState
        mensagem={erro}
        onTentarNovamente={carregarFilmes}
        onFechar={() => setErro(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filmes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={filmes.length ? styles.lista : styles.listaVazia}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('Details', { movieId: item.id, title: item.title })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vazio}>
            <Ionicons name="film-outline" size={44} color="#8b90a0" />
            <Text style={styles.vazioTexto}>Nenhum filme carregado</Text>
            <Button titulo="Recarregar" icone="refresh" onPress={carregarFilmes} />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12151c' },
  lista: { padding: 14 },
  listaVazia: { flexGrow: 1, padding: 14 },
  vazio: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  vazioTexto: { color: '#8b90a0', fontSize: 15, marginVertical: 16 },
});
