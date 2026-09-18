import { colors, headingFont } from '../theme';
import { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { getMovieById } from '../services/moviesService';

// Tela de detalhes: recebe o id pela rota e busca os dados completos do filme.
// Busca de novo (em vez de reaproveitar o objeto da lista) porque o endpoint
// de listagem nao retorna duracao nem generos.
export default function DetailsScreen({ route, navigation }) {
  const { movieId } = route.params;

  const [filme, setFilme] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarFilme = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      setFilme(await getMovieById(movieId));
    } catch {
      setErro('Não foi possível carregar os detalhes deste filme.');
    } finally {
      setCarregando(false);
    }
  }, [movieId]);

  useEffect(() => {
    carregarFilme();
  }, [carregarFilme]);

  if (carregando) return <Loading mensagem="Carregando detalhes..." />;
  // O X fecha a mensagem e devolve o usuario para a listagem.
  if (erro) {
    return (
      <ErrorState
        mensagem={erro}
        onTentarNovamente={carregarFilme}
        onFechar={() => navigation.goBack()}
      />
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      {filme.posterUrl ? <Image accessibilityLabel={`Pôster de ${filme.title}`} source={{ uri: filme.posterUrl }} style={styles.poster} /> : <Text style={styles.meta}>Pôster não disponível</Text>}

      <Text style={styles.titulo}>{filme.title}</Text>

      <View style={styles.metaLinha}>
        <Ionicons name="calendar-outline" size={15} color={colors.muted} />
        <Text style={styles.meta}>{filme.year}</Text>

        {filme.rating && (
          <>
            <Ionicons name="star" size={15} color={colors.accent} style={styles.metaIcone} />
            <Text style={styles.meta}>{filme.rating}</Text>
          </>
        )}

        {filme.runtime && (
          <>
            <Ionicons name="time-outline" size={15} color={colors.muted} style={styles.metaIcone} />
            <Text style={styles.meta}>{filme.runtime} min</Text>
          </>
        )}
      </View>

      {filme.genres.length > 0 && <Text style={styles.generos}>{filme.genres.join(' · ')}</Text>}

      <Text style={styles.secao}>Sinopse</Text>
      <Text style={styles.sinopse}>{filme.overview}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 16, paddingBottom: 32, width: '100%', maxWidth: 760, alignSelf: 'center' },
  poster: { width: '100%', height: 420, resizeMode: 'contain', borderRadius: 12, backgroundColor: colors.surface },
  titulo: { color: colors.text, fontSize: 23, fontFamily: headingFont, marginTop: 16 },
  metaLinha: { flexDirection: 'row', alignItems: 'center', marginTop: 10, flexWrap: 'wrap' },
  metaIcone: { marginLeft: 14 },
  meta: { color: colors.muted, fontSize: 14, marginLeft: 5 },
  generos: { color: colors.muted, fontSize: 14, marginTop: 8 },
  secao: { color: colors.text, fontSize: 17, fontFamily: headingFont, marginTop: 24, marginBottom: 8 },
  sinopse: { color: colors.muted, fontSize: 15, lineHeight: 22 },
});
