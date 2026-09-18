import { colors, headingFont } from '../theme';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Card de um filme na listagem. Recebe o filme e o que fazer no toque,
// entao serve em qualquer lista (populares, busca, favoritos).
export default function MovieCard({ movie, onPress }) {
  return (
    <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Ver detalhes de ${movie.title}`} style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {movie.posterUrl ? (
        <Image source={{ uri: movie.posterUrl }} style={styles.poster} />
      ) : (
        <View style={[styles.poster, styles.posterVazio]}>
          <Ionicons name="film-outline" size={26} color={colors.muted} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.ano}>{movie.year}</Text>

        {movie.rating && (
          <View style={styles.notaLinha}>
            <Ionicons name="star" size={14} color={colors.accent} />
            <Text style={styles.nota}>{movie.rating}</Text>
          </View>
        )}
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  poster: { width: 70, height: 105, borderRadius: 8, backgroundColor: colors.border },
  posterVazio: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginHorizontal: 14 },
  titulo: { color: colors.text, fontSize: 16, fontFamily: headingFont },
  ano: { color: colors.muted, fontSize: 13, marginTop: 4 },
  notaLinha: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  nota: { color: colors.muted, fontSize: 13, marginLeft: 4 },
});
