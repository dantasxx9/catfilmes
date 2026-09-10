import { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import MovieCard from '../components/MovieCard';
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
  if (erro) return <ErrorState mensagem={erro} onTentarNovamente={carregarFilmes} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={filmes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('Details', { movieId: item.id, title: item.title })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#12151c' },
  lista: { padding: 14 },
});
