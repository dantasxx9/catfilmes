const normalize = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

export function discoverMovies(movies, { query = '', topRated = false, order = 'popular' } = {}) {
  const term = normalize(query.trim());
  const result = movies.filter((movie) => normalize(movie.title).includes(term)
    && (!topRated || (movie.rating !== null && Number(movie.rating) >= 7)));
  if (order === 'title') result.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  if (order === 'rating') result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  return result;
}
