# Catálogo de Filmes

Aplicativo mobile em **React Native + Expo** que vai listar filmes em uma tela inicial
(pôster e título) e abrir uma tela de detalhes com as informações completas do filme
selecionado.

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
chama `navigation.navigate('Details', { movieId })`. A tela de detalhes lê o `id` em
`route.params` e busca os dados completos — necessário porque o endpoint de listagem não retorna
duração nem gêneros.

### Estrutura de pastas

```
catfilmes/
├── App.js           # ponto de entrada do app
├── app.json         # configuração do Expo
├── assets/          # imagens estáticas (ícone, splash)
├── screens/         # telas: HomeScreen e DetailsScreen
├── components/      # componentes reutilizáveis: MovieCard, Button, Loading
└── services/        # comunicação com a API (instância do axios e funções de busca)
```

A separação existe para que cada pasta tenha uma responsabilidade só: `screens/` monta telas,
`components/` desenha pedaços reutilizáveis de interface e `services/` conversa com a rede.
Assim o grupo trabalha em arquivos diferentes sem conflito de merge, e trocar a API afeta apenas
`services/`.

---

## Como rodar

```bash
npm install
npx expo start
```

Depois, leia o QR Code com o app **Expo Go** ou pressione `a` para abrir no emulador Android.

---

As respostas das 17 perguntas da aula estão em [RESPOSTAS.md](RESPOSTAS.md).
