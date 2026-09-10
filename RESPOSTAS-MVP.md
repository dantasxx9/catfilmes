# Catálogo de Filmes — Respostas da Aula do MVP

**Integrantes:** Mateus Dantas de Morais · Guilherme Lavigne Aguiar Brito · Alisson Silva Nascimento
**Projeto:** Catálogo de Filmes (React Native + Expo SDK 57)
**Repositório:** https://github.com/dantasxx9/catfilmes

---

## Etapa 1 — Tela de listagem

### 1. Como ficou a estrutura do componente de card de filme? Ele foi feito para ser reutilizado em outros pontos do app?

O `components/MovieCard.js` recebe exatamente duas props:

```jsx
<MovieCard movie={item} onPress={() => navigation.navigate('Details', { ... })} />
```

Por dentro ele é uma `TouchableOpacity` em linha com três partes: o pôster à esquerda (70x105),
um bloco central com título (limitado a 2 linhas por `numberOfLines`), ano e nota com ícone de
estrela, e uma seta `chevron-forward` à direita indicando que dá para tocar.

**Sim, foi feito para ser reutilizado**, e a decisão que garante isso é o card **não** saber
nada sobre navegação. Ele não importa `useNavigation` nem conhece a rota `Details` — só chama a
função `onPress` que recebeu. Quem decide o que acontece no toque é a tela que usa o card. Por
isso o mesmo componente serve numa futura tela de busca, de favoritos ou de "vistos
recentemente", só mudando o `onPress`.

Ele também trata a ausência de dados: se o filme não tiver pôster, no lugar da imagem aparece um
ícone de filme sobre o fundo cinza, em vez de um retângulo quebrado.

---

### 2. De onde vêm os dados exibidos na lista — de uma chamada direta à API na própria tela ou de uma função centralizada em `services/`?

De uma função centralizada. A `HomeScreen` faz:

```js
import { getPopularMovies } from '../services/moviesService';
// ...
setFilmes(await getPopularMovies());
```

A tela **não importa o axios** e não conhece a URL do TMDB, o token nem o nome do endpoint. Isso
está tudo em `services/`, dividido em dois arquivos:

- **`services/api.js`** — a instância única do axios, com `baseURL`, `timeout` de 10 segundos,
  `language=pt-BR` e o header `Authorization: Bearer <token>`. O token vem de um `.env` que está
  no `.gitignore`.
- **`services/moviesService.js`** — as funções `getPopularMovies()` e `getMovieById(id)`, e a
  `formatMovie()`, que converte a resposta crua do TMDB (`vote_average`, `poster_path`,
  `release_date`) para o formato que o app usa (`rating`, `posterUrl`, `year`).

O ganho prático: se o TMDB mudar o nome de um campo, o conserto é dentro do `formatMovie` e
nenhuma tela precisa ser tocada.

---

### 3. O que acontece na tela enquanto os dados ainda estão sendo carregados?

A `HomeScreen` começa com `carregando = true`, então a primeira coisa que o usuário vê é o
componente `components/Loading.js`: um `ActivityIndicator` grande, na cor vermelha do app,
centralizado na tela, com o texto **"Buscando filmes..."** logo abaixo.

A lista só é renderizada quando a requisição termina. Não existe momento de tela branca nem de
lista vazia piscando, porque os três estados são excludentes:

```js
if (carregando) return <Loading mensagem="Buscando filmes..." />;
if (erro) return <ErrorState mensagem={erro} onTentarNovamente={carregarFilmes} />;
return <FlatList ... />;
```

O mesmo componente `Loading` é reaproveitado na tela de detalhes, só trocando a mensagem para
"Carregando detalhes...".

---

## Etapa 2 — Navegação e tela de detalhes

### 4. Qual biblioteca de navegação foi usada e como os dados do filme selecionado são passados para a tela de detalhes?

**React Navigation**, com o `createNativeStackNavigator` do `@react-navigation/native-stack`. O
stack está declarado no `App.js`, dentro do `NavigationContainer` e do `SafeAreaProvider`, com
duas rotas: `Home` e `Details`.

Os dados são passados como parâmetros de rota, no segundo argumento do `navigate`:

```js
navigation.navigate('Details', { movieId: item.id, title: item.title })
```

E são lidos do outro lado com `route.params`:

```js
const { movieId } = route.params;
```

Passamos **duas** coisas, com propósitos diferentes:

- **`movieId`** é o dado essencial — é ele que identifica o filme na API.
- **`title`** vai junto só para o cabeçalho da tela já abrir com o nome do filme durante o
  carregamento, em vez de mostrar "Detalhes" e trocar depois. Isso é feito no `App.js`:
  `options={({ route }) => ({ title: route.params?.title ?? 'Detalhes' })}`.

Vale registrar que `params` precisa carregar apenas dados simples e serializáveis — não dá para
passar funções ou objetos complexos por ali.

---

### 5. A tela de detalhes busca os dados novamente na API ou reaproveita os dados recebidos da tela de listagem? Qual foi a decisão do grupo e por quê?

**Busca de novo**, chamando `getMovieById(movieId)`.

A decisão não foi por preferência de estilo: **o endpoint de listagem não retorna todos os campos
que a tela de detalhes precisa exibir**. Conferimos isso na resposta real da API antes de
decidir. O `/movie/popular` traz `title`, `poster_path`, `release_date`, `vote_average` e
`overview`, mas **não traz `runtime` nem `genres`** — esses só existem no `/movie/{id}`.

Ou seja, reaproveitar o objeto da lista deixaria a tela sem duração e sem gêneros, que são
justamente parte das "informações completas" que a tela de detalhes deve mostrar.

O custo dessa decisão é que a tela abre com um spinner por um instante. A alternativa que
consideramos foi passar o objeto inteiro do filme para pintar a tela na hora e buscar os campos
que faltam em paralelo. Descartamos por enquanto porque dobra o número de caminhos de estado na
tela (dado parcial, dado completo, erro no complemento) para ganhar poucos milissegundos.
Ficou anotado como possível melhoria.

---

### 6. É possível voltar da tela de detalhes para a listagem sem perder o estado da lista (ex: posição do scroll)?

Sim, e isso vem de graça pelo funcionamento do stack navigator: ao empilhar a tela de detalhes,
a `HomeScreen` **não é desmontada** — ela continua montada por baixo. Quando o usuário volta, é
a tela de detalhes que sai da pilha; a Home reaparece com o mesmo componente, o mesmo `useState`
e a mesma `FlatList`, então a posição do scroll e a lista já carregada continuam lá.

Duas consequências práticas disso:

- **Não há nova requisição ao voltar.** O `useEffect` da Home roda na montagem, e voltar não é
  uma montagem nova.
- Se um dia o app precisar **atualizar** a lista ao voltar (por exemplo, depois de marcar um
  favorito), aí sim seria necessário usar o hook `useFocusEffect` do React Navigation, que
  dispara toda vez que a tela ganha foco — e não só quando é montada.

---

## Etapa 3 — Tratamento de estados (loading e erro)

### 7. O que o usuário vê se a API demorar para responder? E se a requisição falhar (ex: sem internet)?

**Se demorar:** vê o `Loading` — spinner e a mensagem "Buscando filmes..." (ou "Carregando
detalhes...", na outra tela). E essa espera tem limite: a instância do axios foi criada com
`timeout: 10000`. Passados 10 segundos sem resposta, o axios cancela a requisição e lança erro,
o que leva ao caso seguinte. Sem esse timeout, uma conexão ruim deixaria o app girando o spinner
para sempre.

**Se falhar:** vê o `ErrorState` — um ícone de nuvem cortada, a mensagem *"Nao foi possivel
carregar os filmes. Verifique sua conexao e tente de novo."* e o botão **Tentar novamente**.

O `try/catch/finally` cobre os dois casos de uma vez. O `finally` é o detalhe importante: ele
zera o `carregando` **mesmo quando dá erro**, o que impede o app de ficar preso no spinner
depois de uma falha.

Testamos esse caminho de propósito, apontando a `baseURL` para um domínio inexistente e
recarregando o app: a tela de erro apareceu com a mensagem e o botão, exatamente como esperado.

---

### 8. O grupo implementou alguma forma de tentar novamente (retry) após um erro? Por que isso é importante em apps mobile?

Sim. O `ErrorState` recebe uma prop `onTentarNovamente` e renderiza o componente `Button` com o
ícone de refresh. Em cada tela, essa prop aponta para a mesma função que faz a busca
(`carregarFilmes` na Home, `carregarFilme` na Details), que está memorizada com `useCallback`.
Tocar no botão limpa o erro, volta para o estado de carregamento e refaz a requisição.

**Por que isso importa especialmente em mobile:**

- **A conexão é instável por natureza.** O usuário entra no elevador, perde o sinal no metrô,
  troca do Wi-Fi para o 4G. A falha de rede num app mobile não é exceção rara — é rotina.
- **Sem retry, a única saída é fechar e reabrir o app.** É uma experiência ruim o suficiente
  para o usuário desinstalar, e transforma uma falha de dois segundos em perda de usuário.
- **A falha costuma ser temporária.** Na maioria das vezes, tocar de novo dez segundos depois
  resolve, porque o problema era o sinal e não o servidor.
- **É barato de implementar.** Como a lógica de busca já estava isolada em uma função por causa
  do `useCallback`, ligar o botão a ela custou uma linha.

---

## Etapa 4 — Testes manuais do MVP

### 9. Em quais dispositivos/ambientes o grupo testou o app? Quais diferenças de comportamento ou de layout foram observadas entre eles?

Testamos a mesma build rodando via `npx expo start --web`, em dois tamanhos de viewport, medindo
os elementos pelo DOM:

| Ambiente | Viewport | Largura do card | Altura do card | Pôster |
|---|---|---|---|---|
| Formato celular | 375 x 812 | 347 px | 121 px | 70 x 105 |
| Formato tablet / desktop | 1024 x 768 | 981 px | 121 px | 70 x 105 |

**Diferenças observadas:**

- **O card estica, o pôster não.** A largura do card acompanha a tela (347 → 981 px), mas o
  pôster continua fixo em 70x105. No formato celular o card fica equilibrado; a 1024 px ele vira
  uma faixa larga com um pôster pequeno à esquerda e muito espaço vazio no meio. Funciona, mas
  não fica bonito — em tela larga o certo seria uma grade de vários filmes por linha, e não uma
  lista de uma coluna.
- **A altura do card não muda** (121 px nos dois), o que confirma que ela é ditada pelo pôster e
  pelo padding, e não pelo tamanho do texto.
- **A rolagem muda de forma:** no navegador aparece a barra de rolagem do sistema, que come
  alguns pixels da largura útil; no celular a rolagem é por gesto e não ocupa espaço.
- **Acentuação e caracteres não-latinos vieram corretos** nos dois: a lista trouxe títulos em
  português ("Código: Vingança", "Obsessão", "O Último Nascer do Sol") e um título em japonês
  ("愛のぬくもり"), todos renderizados sem quadradinho.

**Pendente:** falta rodar a mesma passagem no **Expo Go em um Android físico**, que é onde o
gesto de voltar do sistema e o comportamento nativo da `FlatList` realmente aparecem. É o
próximo teste da lista.

---

### 10. Quais bugs ou comportamentos inesperados foram encontrados durante os testes manuais? Como foram corrigidos?

Três achados, todos reais:

**1. Nota arredondada para baixo (corrigido).** O `formatMovie` usava `vote_average.toFixed(1)`.
Para um filme com nota `7.85`, isso devolve `"7.8"` e não `"7.9"` — não é erro de digitação, é a
representação binária do número: `7.85` guardado em ponto flutuante é ligeiramente menor que
7,85, e o `toFixed` arredonda o valor real. Quem pegou isso foi o **teste automatizado**, não o
teste manual (na tela, ninguém desconfiaria que 7.8 estava errado). Corrigimos arredondando
antes de formatar:

```js
(Math.round(raw.vote_average * 10) / 10).toFixed(1)
```

**2. O navegador serviu resposta do cache e mascarou uma falha de autenticação (não é bug do
app, mas atrapalhou o teste).** Ao tentar testar o estado de erro, trocamos o token do `.env` por
um inválido e recarregamos — e o app continuou mostrando os filmes normalmente. Conferimos o
bundle e o token inválido estava lá. O que acontecia: o **cache HTTP do navegador** devolvia a
resposta 200 anterior da mesma URL, sem sequer ir à rede, então o header de autorização trocado
não fazia diferença. Provamos isso na própria página:

```js
await fetch(url, { headers: h })                    // 200 (veio do cache)
await fetch(url, { headers: h, cache: 'no-store' }) // 401 (foi à rede)
```

Para conseguir testar a falha de verdade, apontamos a `baseURL` para um domínio inexistente
(URL diferente = sem cache) e aí sim a tela de erro apareceu. Fica o registro: **teste de erro
no navegador pode ser mascarado pelo cache**, e no aparelho isso se comporta de outro jeito.

**3. Filme com nota zero aparece como "0.0".** A lista trouxe um lançamento ainda sem votos
("The Mongoose"), e o card mostra a estrela com "0.0", como se fosse uma nota péssima em vez de
"ainda não avaliado". Não corrigimos ainda — está anotado como melhoria: quando
`vote_average` for 0, o certo é esconder a estrela ou escrever "sem nota".

---

### 11. Por que testar em mais de um ambiente é especialmente importante em desenvolvimento mobile híbrido?

Porque no desenvolvimento híbrido **o mesmo código JavaScript é traduzido para coisas diferentes
em cada plataforma**, e o resultado nem sempre é igual:

- **Os componentes viram elementos nativos distintos.** Uma `FlatList` vira `RecyclerView` no
  Android, `UITableView` no iOS e uma `div` com rolagem no navegador. A rolagem, a inércia e o
  desempenho com lista grande são diferentes em cada um.
- **A tela varia demais.** Densidade, resolução, notch, barra de gestos. O nosso próprio teste
  mostrou o card indo de 347 para 981 px de largura só mudando o tamanho da janela — um layout
  que parece certo em um tamanho pode ficar estranho em outro.
- **Comportamentos exclusivos de uma plataforma.** O botão físico de voltar do Android não
  existe no iOS. Fontes e sombras renderizam diferente. E, como vimos, o cache HTTP do
  navegador se comporta de um jeito que o app nativo não reproduz.
- **O Expo Go não é o app final.** Ele já traz os módulos nativos embutidos; o APK gerado no
  build usa exatamente as versões que estão no `package.json`. Foi por isso que o
  `expo-doctor` avisou, na aula passada, que faltava o `expo-font` — um problema que só
  apareceria fora do Expo Go.
- **Erro de plataforma aparece tarde.** Testando em um só ambiente, o problema só é descoberto
  quando alguém instala o app no aparelho — quando já é caro consertar.

---

## Etapa 5 — Teste automatizado simples

### 12. Qual ferramenta de teste foi usada (ex: Jest, React Native Testing Library) e por que essa foi a escolha do grupo?

**Jest**, com o preset **`jest-expo`**. Instalados como dependências de desenvolvimento:

```bash
npx expo install jest-expo jest
```

E configurados no `package.json`:

```json
"scripts": { "test": "jest" },
"jest": { "preset": "jest-expo" }
```

**Por quê:**

- **Jest já é o padrão do React Native.** É o test runner que a documentação do React Native e a
  do Expo assumem, então tudo que a gente procurar de exemplo vai estar em Jest.
- **O preset `jest-expo` é a peça que faz funcionar.** Sem ele, o Jest não entende JSX nem os
  imports de módulos do Expo/React Native, e o teste quebra antes de rodar. O preset já configura
  o transformador e os mocks dos módulos nativos.
- **Instalamos com `npx expo install`** e não com `npm install`, pela mesma razão da aula
  passada: assim veio o `jest-expo@~57.0.5`, alinhado ao SDK 57, e não a última versão do npm.
- **Não usamos a React Native Testing Library nesta etapa.** Ela seria necessária para testar a
  *renderização* de um componente, mas escolhemos começar pela função de formatação do
  `services/` — que é onde está a lógica de verdade, é a parte mais fácil de quebrar sem
  ninguém perceber e não exige montar árvore de componentes. Fica como próximo passo.

Um detalhe do processo: o `npx expo install jest-expo jest -- --save-dev` não repassou a flag e
os pacotes caíram em `dependencies`. Movemos os dois para `devDependencies` na mão, porque
ferramenta de teste não deve ir junto no bundle do app.

---

### 13. O que exatamente o teste escrito verifica? O que ele NÃO cobre (limitações)?

O arquivo é `__tests__/moviesService.test.js` e são **6 testes**, todos sobre a função
`formatMovie` — a que converte a resposta crua do TMDB no formato que as telas consomem. O teste
usa um **mock** com a estrutura real da resposta da API (os mesmos nomes de campo:
`vote_average`, `poster_path`, `release_date`, `genres`).

**O que ele verifica:**

1. Os campos são mapeados corretamente (`id`, `title`, `runtime`, e `genres` virando um array de
   nomes em vez de objetos).
2. `release_date: '2026-07-29'` vira `year: '2026'` — só o ano.
3. `poster_path: '/x0nv...jpg'` vira a URL completa `https://image.tmdb.org/t/p/w500/x0nv...jpg`.
4. A nota é arredondada para uma casa decimal — **este é o teste que pegou o bug do `toFixed`**.
5. Quando a API não manda um campo, entram os textos de reserva ("Titulo nao informado",
   "----", "Sinopse nao disponivel...", array vazio de gêneros).
6. Filme sem pôster devolve `posterUrl: null`, que é o que faz o card mostrar o ícone no lugar
   da imagem quebrada.

Resultado: `Tests: 6 passed, 6 total`.

**O que ele NÃO cobre — as limitações, sendo honesto:**

- **Não testa nenhuma tela nem componente.** Se o `MovieCard` parar de renderizar o título, ou
  se a `FlatList` sumir da Home, os 6 testes continuam passando.
- **Não testa a navegação.** O toque no card e a passagem de `params` não são exercitados.
- **Não testa a comunicação real com a API.** Como o dado é um mock, se o TMDB mudar o formato
  da resposta amanhã, o teste continua verde e o app quebra. Ele garante que a nossa conversão
  está certa para *aquele* formato — não que o formato ainda é aquele.
- **Não testa os estados de carregamento e erro**, que vivem dentro das telas.
- **Não testa o `getPopularMovies` nem o `getMovieById`**, porque isso exigiria fazer mock do
  axios.

---

### 14. Qual a diferença entre o que esse teste automatizado garante e o que os testes manuais da Etapa 4 garantem?

A diferença ficou clara na prática nesta aula, com um caso de cada lado:

**O teste automatizado pegou o que o olho não pega.** O bug do `7.85` virando `"7.8"` estava na
tela, visível, e ninguém teria desconfiado — "7.8" parece uma nota perfeitamente normal. Só um
teste que compara com um valor esperado poderia flagrar isso.

**O teste manual pegou o que o teste automatizado nunca veria.** O cache do navegador mascarando
a resposta 401 e o "0.0" para filme sem votos são coisas que só aparecem com o app rodando de
verdade, em um ambiente de verdade.

Resumindo a divisão:

| | Teste automatizado | Teste manual |
|---|---|---|
| **Garante** | que uma função dá o resultado certo para uma entrada conhecida | que o app funciona de ponta a ponta para uma pessoa usando |
| **Cobre** | lógica isolada, casos-limite, dados que a API "esqueceu" de mandar | layout, toque, rolagem, navegação, integração real com a rede |
| **Custo de repetir** | 0,8 segundo, um comando | vários minutos, e alguém precisa fazer |
| **Ponto fraco** | passa mesmo com o app quebrado, se o quebrado estiver fora do teste | é cansativo, ninguém repete tudo a cada mudança e falhas raras escapam |

O ponto principal é o **custo de repetição**. O teste automatizado é o que protege contra
regressão: daqui a três semanas, quando alguém mexer no `formatMovie` para adicionar um campo
novo, `npm test` avisa na hora se algo antigo quebrou. Nenhum de nós ia lembrar de conferir
manualmente o arredondamento da nota de novo.

Eles não competem — cobrem coisas diferentes, e nenhum dos dois substitui o outro.

---

## Etapa 6 — Documentação e commit

### 15. O que foi acrescentado ao README nesta etapa? Isso é suficiente para outra pessoa entender o estado atual do MVP?

Acrescentamos:

- Uma linha de **status** no topo, dizendo que o MVP está funcional e o que ele já faz.
- A seção **"Estados de carregamento e erro"**, explicando os três estados das telas e o botão
  de tentar novamente.
- A **estrutura de pastas expandida**, agora com cada arquivo real e seu papel — não mais só o
  nome das pastas.
- A atualização do **fluxo de dados**, incluindo o `title` que vai junto do `movieId` e por quê.
- A configuração do **`.env`**: onde pegar o token do TMDB, qual dos dois valores copiar e o
  aviso de que sem ele o app abre no estado de erro. Junto com um `.env.example` versionado.
- Uma seção **"Testes"**, com o comando `npm test`, o que os 6 testes cobrem e a informação de
  que não dependem de internet nem do token.

**É suficiente?** Para *rodar* e *entender* o MVP, sim: uma pessoa nova clona, roda
`npm install`, cria o `.env` seguindo o passo a passo, roda e tem o app funcionando; e sabe onde
mexer, porque a estrutura está documentada arquivo por arquivo.

**O que ainda falta**, sendo justo: não há nenhuma captura de tela no README, então a pessoa só
descobre a aparência do app depois de rodar. E continua sem a divisão de tarefas do grupo e sem
a convenção de branches e commits — ela entenderia o projeto, mas não em que parte encostar sem
perguntar.

---

### 16. O que esse commit representa em relação ao commit anterior (o do setup)? O grupo considera que o app já é um MVP utilizável? Por quê?

**Em relação ao commit do setup**, a diferença é que aquele era uma *estrutura*, e este é um
*produto*. O commit anterior tinha as pastas `screens/`, `components/` e `services/` vazias, com
`.gitkeep` dentro, o `App.js` padrão do template e a documentação das decisões. Dava para clonar
e rodar, mas o que aparecia na tela era "Open up App.js to start working on your app!".

Este commit preenche essas pastas: 2 telas, 4 componentes, 2 arquivos de serviço, o stack de
navegação, 6 testes e a documentação atualizada.

**É um MVP utilizável? Sim.** O critério de MVP é entregar valor mínimo de ponta a ponta, e ele
entrega: a pessoa abre o app, vê filmes reais e atualizados do TMDB em português com pôster,
toca em um e lê a ficha completa com duração, gêneros e sinopse. Se a internet cair, ela entende
o que aconteceu e consegue tentar de novo sem fechar o app. Esse é o fluxo inteiro que o
trabalho pedia, e ele funciona.

**O que o torna "mínimo"**, e não pronto: só existe a lista de populares (sem busca, sem
filtro), só carrega a primeira página de 20 filmes, não guarda nada offline e não tem favoritos.
São ausências de recurso — não impedem ninguém de usar o que existe.

---

### 17. Olhando para o app pronto até aqui, qual seria o próximo problema técnico ou funcional mais importante a resolver?

**O mais importante é a busca por título.** Hoje o app mostra 20 filmes populares e é só isso —
não existe forma de chegar a um filme específico. Um catálogo em que não dá para procurar um
filme é a limitação que mais pesa contra o propósito do app. Tecnicamente é o passo mais
próximo: o TMDB já tem o endpoint `/search/movie`, e a nossa camada de serviços foi feita
justamente para receber uma função nova sem mexer nas telas — bastaria um `searchMovies(termo)`
ao lado do `getPopularMovies()`, um componente `SearchBar` e reaproveitar o `MovieCard` que já
está pronto.

Logo atrás, na ordem em que resolveríamos:

1. **Paginação da lista.** A lista para nos 20 primeiros porque só pedimos a página 1. Com o
   `onEndReached` da `FlatList` e o parâmetro `page` da API, o catálogo deixa de ter fim
   artificial.
2. **O layout do card em tela larga.** O teste manual mostrou o card indo a 981 px com o pôster
   parado em 70 px. Resolver com uma grade de várias colunas (`numColumns` da `FlatList`)
   quando a tela for larga.
3. **Cobrir a renderização com teste.** Hoje os 6 testes não olham para nenhum componente.
   Adicionar a React Native Testing Library e testar o `MovieCard` fecharia a maior lacuna
   apontada na pergunta 13.
4. **O "0.0" de filme sem votos**, que já está anotado como achado do teste manual.

---

## Checklist de entrega

- [x] Perguntas 1 a 17 respondidas (este arquivo)
- [x] Tela de listagem funcionando com dados da API (20 filmes do TMDB em pt-BR)
- [x] Navegação para a tela de detalhes implementada (native-stack, `params`)
- [x] Estados de loading e erro tratados (`Loading` e `ErrorState` com retry)
- [x] Testes manuais realizados e documentados (2 viewports, 3 achados registrados)
- [x] Pelo menos 1 teste automatizado escrito, funcional e documentado (6 testes, todos passando)
- [x] README atualizado
- [x] Commit do MVP feito
- [x] Envio do repositório
- [x] Documento com perguntas e respostas no repositório (`RESPOSTAS-MVP.md`)
