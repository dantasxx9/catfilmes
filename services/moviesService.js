import api, { buildPosterUrl } from './api';

// Toda a comunicacao com a API passa por aqui. As telas nunca chamam o axios
// direto: elas so chamam getPopularMovies() e getMovieById().

// Converte a resposta crua do TMDB para o formato que o app usa.
// Se a API mudar os nomes dos campos, so esta funcao precisa mudar.
export function formatMovie(raw) {
  return {
    id: raw.id,
    title: raw.title || 'Titulo nao informado',
    posterUrl: buildPosterUrl(raw.poster_path),
    year: raw.release_date ? raw.release_date.slice(0, 4) : '----',
    // Math.round antes do toFixed: (7.85).toFixed(1) devolve "7.8" por causa
    // da representacao binaria do numero. Com o Math.round o valor sai "7.9".
    rating:
      typeof raw.vote_average === 'number'
        ? (Math.round(raw.vote_average * 10) / 10).toFixed(1)
        : null,
    overview: raw.overview || 'Sinopse nao disponivel para este filme.',
    runtime: raw.runtime || null,
    genres: (raw.genres || []).map((genre) => genre.name),
  };
}

// Usada pela HomeScreen.
export async function getPopularMovies() {
  const { data } = await api.get('/movie/popular');
  return data.results.map(formatMovie);
}

// Usada pela DetailsScreen.
export async function getMovieById(id) {
  const { data } = await api.get(`/movie/${id}`);
  return formatMovie(data);
}
