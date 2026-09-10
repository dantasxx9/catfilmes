# Catálogo de Filmes

Aplicativo mobile em **React Native + Expo** que lista filmes em uma tela inicial
(pôster e título) e abre uma tela de detalhes com as informações completas do filme
selecionado.

**Status:** MVP funcional — listagem, navegação, tela de detalhes, tratamento de
carregamento e erro, e teste automatizado.

---

## Integrantes do grupo

- Mateus Dantas de Morais
- Guilherme Lavigne Aguiar Brito
- Alisson Silva Nascimento

---

## Bibliotecas escolhidas

| Necessidade | Biblioteca | Versão | Instalação |
|---|---|---|---|
| Navegação entre telas | `@react-navigation/native` + `@react-navigation/native-stack` | 7.3.18 / 7.18.10 | `npx expo install` |
| Dependências nativas da navegação | `react-native-screens` / `react-native-safe-area-context` | 4.26.0 / 5.7.0 | `npx expo install` |
| Consumo de API | `axios` | 1.20.0 | `npm install` |
| Ícones | `@expo/vector-icons` (+ `expo-font`) | 15.1.1 | `npx expo install` |

**React Navigation (native-stack)** — é a solução recomendada pela documentação do React Native
e do Expo, e o `native-stack` usa os componentes de navegação nativos de cada plataforma, então
as transições ficam iguais às de qualquer app do sistema. Descartamos o **Expo Router**, que
organiza rotas por arquivos em `app/` e conflita com a estrutura `screens/` do projeto, e o
**react-native-navigation (Wix)**, que exige código nativo e não roda no Expo Go.

**Axios** — permite criar uma instância com `baseURL`, `timeout` e parâmetros fixos (chave da
API e idioma) declarados uma única vez. Converte a resposta em JSON automaticamente e lança erro
em status 4xx/5xx, o que o `fetch` nativo não faz. Descartamos o **TanStack Query**, que resolve
cache e estado de servidor — recursos que não se pagam em um app de duas telas.

**@expo/vector-icons** — já faz parte do ecossistema Expo e embute vários conjuntos de ícones
com uma API única. Ícone vetorial escala sem borrar e muda de cor por prop. Descartamos o
`react-native-vector-icons` puro, que exige linkagem manual das fontes fora do Expo.

---

## Arquitetura

### Telas

| Tela | O que exibe | De onde vêm os dados |
|---|---|---|
| **Home** | Lista rolável de filmes: pôster, título e ano | `GET /movie/popular` (TMDB) |
| **Details** | Pôster, título, ano, nota, duração, gêneros e sinopse | `GET /movie/{id}` (TMDB) |

### Fluxo de dados

A Home busca a lista pela camada de serviços e renderiza um card por filme. Ao tocar em um card,
chama `navigation.navigate('Details', { movieId, title })`. A tela de detalhes lê o `movieId` em
`route.params` e busca os dados completos — necessário porque o endpoint de listagem não retorna
duração nem gêneros. O `title` vai junto só para o cabeçalho já aparecer preenchido durante o
carregamento.

### Estados de carregamento e erro

As duas telas tratam três estados. Enquanto a requisição não volta, aparece o componente
`Loading` (spinner + mensagem). Se a requisição falhar — sem internet, timeout de 10s do axios
ou erro 4xx/5xx —, aparece o `ErrorState` com a mensagem e um botão **Tentar novamente**, que
dispara a mesma função de busca sem precisar fechar o app.

O `ErrorState` também tem um **X** no canto superior direito para dispensar a mensagem: na tela
de detalhes ele volta para a listagem; na tela inicial ele cai em um estado de lista vazia com o
texto "Nenhum filme carregado" e um botão para recarregar.

### Estrutura de pastas

```
catfilmes/
├── App.js                        # ponto de entrada: providers e rotas do stack
├── app.json                      # configuração do Expo
├── .env.example                  # modelo do arquivo .env (token do TMDB)
├── assets/                       # imagens estáticas (ícone, splash)
├── screens/
│   ├── HomeScreen.js             # lista de filmes
│   └── DetailsScreen.js          # detalhes de um filme
├── components/
│   ├── MovieCard.js              # card de filme da listagem
│   ├── Button.js                 # botão padrão com ícone
│   ├── Loading.js                # estado de carregamento
│   └── ErrorState.js             # estado de erro com "tentar novamente"
├── services/
│   ├── api.js                    # instância do axios (baseURL, timeout, autenticação)
│   └── moviesService.js          # formatMovie, getPopularMovies, getMovieById
└── __tests__/
    └── moviesService.test.js     # testes da formatação de dados da API
```

A separação existe para que cada pasta tenha uma responsabilidade só: `screens/` monta telas,
`components/` desenha pedaços reutilizáveis de interface e `services/` conversa com a rede.
Assim o grupo trabalha em arquivos diferentes sem conflito de merge, e trocar a API afeta apenas
`services/`.

---

## Como rodar

```bash
npm install
```

Depois, crie um arquivo `.env` na raiz (use o `.env.example` como modelo) com o token da API:

```
EXPO_PUBLIC_TMDB_TOKEN=seu_api_read_access_token_do_tmdb
```

O token sai de [themoviedb.org](https://www.themoviedb.org) → *Configurações → API* → campo
**API Read Access Token**. O `.env` está no `.gitignore`, então o token não vai para o
repositório. Sem ele, o app abre direto no estado de erro.

```bash
npx expo start
```

Leia o QR Code com o app **Expo Go** ou pressione `a` para abrir no emulador Android.

## Testes

```bash
npm test
```

Roda o Jest com o preset `jest-expo`. São 6 testes sobre a função `formatMovie` do
`services/moviesService.js`, que converte a resposta crua do TMDB para o formato que as telas
usam: extração do ano, montagem da URL do pôster, arredondamento da nota e os valores de
reserva quando a API não manda um campo. Os testes usam um mock da resposta da API, então não
dependem de internet nem do token.

---

Respostas das perguntas das aulas: [RESPOSTAS.md](RESPOSTAS.md) (arquitetura e setup) e
[RESPOSTAS-MVP.md](RESPOSTAS-MVP.md) (implementação e testes do MVP).
