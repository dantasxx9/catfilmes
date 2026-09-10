import axios from 'axios';

// O token fica em um arquivo .env na raiz (que esta no .gitignore), nunca no codigo.
// Veja .env.example. O prefixo EXPO_PUBLIC_ e o que faz o Expo injetar a variavel no bundle.
const TMDB_TOKEN = process.env.EXPO_PUBLIC_TMDB_TOKEN;

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Instancia unica do axios: baseURL, timeout, idioma e autenticacao ficam
// declarados em um lugar so e valem para todas as requisicoes do app.
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  params: { language: 'pt-BR' },
  headers: { Authorization: `Bearer ${TMDB_TOKEN}` },
});

// O TMDB devolve so o caminho do poster ("/abc.jpg"); aqui vira a URL completa.
export function buildPosterUrl(posterPath) {
  if (!posterPath) return null;
  return `${IMAGE_BASE_URL}${posterPath}`;
}

export default api;
