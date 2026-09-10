import { formatMovie } from '../services/moviesService';

// Resposta reduzida do TMDB, com os mesmos nomes de campo que a API real usa.
// E um mock: o teste nao acessa a internet, entao roda sempre igual.
const respostaDaApi = {
  id: 969681,
  title: 'Homem-Aranha: Um Novo Dia',
  poster_path: '/x0nvYzQpyJc5pdT9lMnkMuYAg0O.jpg',
  release_date: '2026-07-29',
  vote_average: 7.85,
  overview: 'E um novo dia para Peter Parker.',
  runtime: 143,
  genres: [{ id: 878, name: 'Ficcao cientifica' }, { id: 28, name: 'Acao' }],
};

describe('formatMovie', () => {
  it('converte a resposta da API para o formato usado pelo app', () => {
    const filme = formatMovie(respostaDaApi);

    expect(filme.id).toBe(969681);
    expect(filme.title).toBe('Homem-Aranha: Um Novo Dia');
    expect(filme.runtime).toBe(143);
    expect(filme.genres).toEqual(['Ficcao cientifica', 'Acao']);
  });

  it('extrai apenas o ano da data de lancamento', () => {
    expect(formatMovie(respostaDaApi).year).toBe('2026');
  });

  it('monta a URL completa do poster a partir do caminho', () => {
    expect(formatMovie(respostaDaApi).posterUrl).toBe(
      'https://image.tmdb.org/t/p/w500/x0nvYzQpyJc5pdT9lMnkMuYAg0O.jpg'
    );
  });

  it('arredonda a nota para uma casa decimal', () => {
    expect(formatMovie(respostaDaApi).rating).toBe('7.9');
  });

  it('usa textos de reserva quando a API nao manda os campos', () => {
    const incompleto = formatMovie({ id: 1 });

    expect(incompleto.title).toBe('Titulo nao informado');
    expect(incompleto.year).toBe('----');
    expect(incompleto.overview).toBe('Sinopse nao disponivel para este filme.');
    expect(incompleto.genres).toEqual([]);
  });

  it('devolve posterUrl nulo quando o filme nao tem poster', () => {
    expect(formatMovie({ id: 1, poster_path: null }).posterUrl).toBeNull();
  });
});
