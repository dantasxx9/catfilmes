import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import MovieCard from '../components/MovieCard';
import Button from '../components/Button';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import { getPopularMovies } from '../services/moviesService';
import { discoverMovies } from '../services/discovery';
import { colors, headingFont, spacing } from '../theme';

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [topRated, setTopRated] = useState(false);
  const [order, setOrder] = useState('popular');
  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setMovies(await getPopularMovies()); }
    catch { setError('Não foi possível carregar os filmes. Verifique sua conexão e tente novamente.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { loadMovies(); }, [loadMovies]);
  const results = useMemo(() => discoverMovies(movies, { query, topRated, order }), [movies, query, topRated, order]);
  const reset = () => { setQuery(''); setTopRated(false); setOrder('popular'); };
  return <View style={styles.container}>
    <FlatList data={loading || error ? [] : results} keyboardShouldPersistTaps="handled"
      keyExtractor={(movie) => String(movie.id)} contentContainerStyle={styles.content}
      ListHeaderComponent={<View style={styles.header}>
        <Text style={styles.eyebrow}>SEU PRÓXIMO PLAY COMEÇA AQUI</Text>
        <Text style={styles.title}>Histórias que{'\n'}merecem sua sessão.</Text>
        <Text style={styles.subtitle}>Explore os populares e encontre seu próximo filme.</Text>
        <TextInput accessibilityLabel="Buscar nos filmes carregados" placeholder="Buscar por título…"
          placeholderTextColor={colors.muted} value={query} onChangeText={setQuery}
          style={styles.search} autoCorrect={false} returnKeyType="search" />
        <View style={styles.controls}>
          <Button titulo="Nota 7+" icone="star" selected={topRated} secondary onPress={() => setTopRated(!topRated)} />
          <Button titulo="Limpar" icone="close" secondary onPress={reset} />
        </View>
        <Text style={styles.label}>ORDENAR POR</Text>
        <View style={styles.controls}>
          {[['popular', 'Popularidade'], ['title', 'A–Z'], ['rating', 'Nota']].map(([value, label]) =>
            <Button key={value} titulo={label} secondary selected={order === value} onPress={() => setOrder(value)} />)}
        </View>
        <Text accessibilityLiveRegion="polite" style={styles.subtitle}>
          {loading ? 'Carregando catálogo…' : `${results.length} de ${movies.length} filmes carregados`}
        </Text>
        <Text style={styles.scope}>Busca e filtros aplicados à primeira página de populares do TMDB.</Text>
      </View>}
      renderItem={({ item }) => <MovieCard movie={item} onPress={() => navigation.navigate('Details', { movieId: item.id, title: item.title })} />}
      ListEmptyComponent={loading ? <Loading mensagem="Preparando sua sessão…" /> : error ?
        <ErrorState mensagem={error} onTentarNovamente={loadMovies} /> :
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{movies.length ? 'Nenhum filme encontrado' : 'Catálogo vazio por enquanto'}</Text>
          <Text style={styles.subtitle}>{movies.length ? 'Tente outro título ou remova o filtro de nota.' : 'Tente carregar o catálogo novamente.'}</Text>
          <Button titulo={movies.length ? 'Limpar busca e filtros' : 'Recarregar'} icone="refresh" onPress={movies.length ? reset : loadMovies} />
        </View>}
      ListFooterComponent={<Text style={styles.footer}>Dados e imagens: TMDB. Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB.</Text>}
    />
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.medium, width: '100%', maxWidth: 760, alignSelf: 'center', paddingBottom: 40 },
  header: { gap: 12, marginBottom: spacing.large },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  title: { color: colors.text, fontFamily: headingFont, fontSize: 32, lineHeight: 39 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21 },
  search: { color: colors.text, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 16 },
  controls: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.small },
  label: { color: colors.muted, fontSize: 11, letterSpacing: 1.5, marginTop: 4 },
  scope: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  empty: { paddingVertical: 32, gap: 16, alignItems: 'center' },
  emptyTitle: { color: colors.text, fontFamily: headingFont, fontSize: 20 },
  footer: { color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 24 },
});
