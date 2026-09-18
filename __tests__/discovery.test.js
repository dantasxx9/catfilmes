import { discoverMovies } from '../services/discovery';
const movies = [
  { id: 1, title: 'Órbita', rating: '6.9' },
  { id: 2, title: 'Aurora', rating: '8.5' },
  { id: 3, title: 'Caminho', rating: null },
  { id: 4, title: 'Luz', rating: '7.0' },
];
test('busca ignora acentos, caixa e espaços nas extremidades', () => {
  expect(discoverMovies(movies, { query: ' ORBITA ' }).map(m => m.id)).toEqual([1]);
});
test('combina busca e nota mínima inclusiva, excluindo nota ausente', () => {
  expect(discoverMovies(movies, { topRated: true }).map(m => m.id)).toEqual([2, 4]);
  expect(discoverMovies(movies, { query: 'órbita', topRated: true })).toEqual([]);
});
test('ordena por título sem alterar a lista original', () => {
  expect(discoverMovies(movies, { order: 'title' }).map(m => m.id)).toEqual([2, 3, 4, 1]);
  expect(movies.map(m => m.id)).toEqual([1, 2, 3, 4]);
});
test('ordena por nota e coloca notas ausentes no fim', () => {
  expect(discoverMovies(movies, { order: 'rating' }).map(m => m.id)).toEqual([2, 4, 1, 3]);
});
test('limpar opções restaura popularidade e todos os resultados', () => {
  expect(discoverMovies(movies)).toEqual(movies);
});
test('trata catálogo vazio e busca sem resultado', () => {
  expect(discoverMovies([])).toEqual([]);
  expect(discoverMovies(movies, { query: 'zzzz' })).toEqual([]);
});
