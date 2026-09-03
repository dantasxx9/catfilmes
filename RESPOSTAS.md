# Catálogo de Filmes — Respostas das Perguntas da Aula

**Integrantes:** Mateus Dantas de Morais · Guilherme Lavigne Aguiar Brito · Alisson Silva Nascimento
**Projeto:** Catálogo de Filmes (React Native + Expo SDK 57)
**Repositório:** https://github.com/dantasxx9/catfilmes
**Data:** 03/09/2026

---

## Etapa 1 — Pesquisa de bibliotecas

### 1. Quais bibliotecas o grupo escolheu para cada uma dessas três necessidades?

| Necessidade | Biblioteca escolhida | Versão instalada |
|---|---|---|
| Navegação entre telas | `@react-navigation/native` + `@react-navigation/native-stack` | 7.3.18 / 7.18.10 |
| Consumo de API | `axios` | 1.20.0 |
| Ícones | `@expo/vector-icons` | 15.1.1 |

A navegação ainda exigiu duas dependências nativas de apoio, que a própria documentação do
React Navigation manda instalar junto: `react-native-screens` (4.26.0) e
`react-native-safe-area-context` (5.7.0). E o `@expo/vector-icons` exigiu o `expo-font`
(explicado na pergunta 11).

---

### 2. Por que escolheram cada uma delas, em vez de outras opções encontradas na pesquisa?

**Navegação — React Navigation (native-stack)**

Alternativas avaliadas: Expo Router e react-native-navigation (Wix).

- É a biblioteca indicada tanto pela documentação do React Native quanto pela do Expo, o que
  significa mais tutoriais, mais respostas no Stack Overflow e menos risco de travar em um
  problema sem solução documentada.
- O `native-stack` usa os componentes de navegação **nativos** de cada plataforma. Na prática,
  as transições e o gesto de voltar ficam iguais aos de qualquer app do sistema — coisa que a
  versão em JavaScript puro (`@react-navigation/stack`) não entrega com a mesma fluidez.
- **Descartamos o Expo Router** porque ele define as rotas pelo caminho dos arquivos dentro de
  uma pasta `app/`. É uma abordagem moderna e boa, mas conflita com a estrutura `screens/`
  pedida no projeto e esconde a configuração de rotas que queremos aprender a escrever
  explicitamente nesta disciplina.
- **Descartamos o react-native-navigation (Wix)** porque ele exige alteração de código nativo
  (Android/iOS) e não roda no Expo Go — precisaríamos sair do fluxo gerenciado do Expo logo no
  começo do projeto.

**Consumo de API — Axios**

Alternativas avaliadas: `fetch` nativo e TanStack Query (react-query).

- O Axios permite criar uma **instância configurada** (`axios.create`) com `baseURL`, `timeout`
  e parâmetros fixos. No nosso caso, a chave da API e o `language=pt-BR` serão declarados uma
  vez só e valerão para todas as requisições. Com `fetch`, essa concatenação se repetiria em
  cada chamada.
- O Axios converte a resposta para JSON automaticamente (`response.data`), enquanto o `fetch`
  exige um `await response.json()` a mais em toda chamada.
- O Axios **lança erro** em respostas 404 e 500. O `fetch` considera isso "sucesso" e só rejeita
  em falha de rede — ou seja, com `fetch` teríamos que checar `response.ok` manualmente toda
  vez, e esquecer disso uma única vez já vira bug silencioso.
- Ele tem `timeout` embutido. Sem isso, uma requisição travada deixa o app carregando para
  sempre.
- **Descartamos o TanStack Query** porque ele resolve cache, revalidação e estado de servidor.
  São recursos ótimos, mas para duas telas com duas requisições ele adiciona conceitos
  (query keys, provider, invalidação) que não se pagam neste tamanho de projeto.

**Ícones — @expo/vector-icons**

Alternativas avaliadas: `react-native-vector-icons` puro e imagens PNG.

- Já faz parte do ecossistema Expo e embute vários conjuntos de ícones (Ionicons,
  MaterialIcons, FontAwesome, Feather...) com uma API única:
  `<Ionicons name="star" size={16} color="#f5c518" />`.
- Ícone é fonte vetorial: escala em qualquer densidade de tela sem borrar e muda de cor por
  prop. Com PNG, precisaríamos de um arquivo para cada tamanho e cada cor.
- **Descartamos o `react-native-vector-icons` puro** porque, fora do Expo, ele exige linkagem
  manual das fontes no projeto Android e iOS. O `@expo/vector-icons` é justamente um wrapper
  dele que já resolve esse registro.

---

### 3. Alguma dessas bibliotecas precisa ser instalada com `npx expo install` em vez de `npm install`? Por quê?

Sim. Instalamos assim:

```bash
# Precisam de expo install (têm código nativo ou são gerenciadas pelo SDK)
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install @expo/vector-icons expo-font

# Pode ser npm install (JavaScript puro)
npm install axios
```

**O motivo:** o `npm install` sempre instala a versão **mais recente** de um pacote. O
`npx expo install` consulta antes uma tabela de compatibilidade do Expo e instala a versão
**testada com o SDK que o projeto usa** (no nosso caso, o SDK 57).

Isso importa para bibliotecas que têm código nativo (Java/Kotlin, Swift/Objective-C) compilado
dentro do runtime do Expo Go. Se instalarmos uma versão de `react-native-screens` mais nova do
que a que o Expo Go 57 embute, o JavaScript vai chamar um módulo nativo que não existe no app —
e o erro aparece só quando a tela abre no celular, não na instalação. Foi exatamente o que o
`expo install` evitou: repare que ele instalou `react-native-screens@~4.26.0`, e não a última
versão publicada no npm.

O `axios` é 100% JavaScript — não tem parte nativa, não depende do SDK, então `npm install`
resolve. Na prática, `npx expo install axios` também funcionaria (ele repassa para o npm quando
não há regra de compatibilidade), então usar `expo install` para tudo é um hábito seguro.

---

### 4. Essas bibliotecas são bem mantidas e documentadas? Como o grupo verificou isso?

Sim. Verificamos com quatro critérios objetivos:

**a) Data da última publicação no npm** (comando `npm view <pacote> time.modified`, rodado em
03/09/2026):

| Biblioteca | Última publicação | Licença |
|---|---|---|
| `@react-navigation/native` | 26/08/2026 | MIT |
| `axios` | 26/08/2026 | MIT |
| `@expo/vector-icons` | 01/08/2026 | MIT |

As três foram atualizadas há menos de dois meses — nenhuma está abandonada.

**b) Site de documentação próprio, não só o README do GitHub:** reactnavigation.org,
axios-http.com e expo.github.io/vector-icons (este último com um buscador visual de ícones).

**c) Atividade no repositório do GitHub:** issues sendo respondidas e releases frequentes.

**d) Licença MIT nas três** — permissiva, sem impedimento para uso no trabalho.

Um sinal extra de confiança: as três aparecem na documentação oficial do Expo como a opção
recomendada para cada finalidade.

---

### 5. Existe alguma limitação ou ponto de atenção já identificado sobre alguma delas?

Sim, três pontos que já anotamos:

1. **React Navigation não é uma biblioteca só.** É um conjunto: além do `@react-navigation/native`
   e do navegador escolhido, ele exige `react-native-screens` e `react-native-safe-area-context`.
   Esquecer uma dessas gera erro em tempo de execução com mensagem pouco clara. Além disso, o
   `App.js` precisará envolver o app no `SafeAreaProvider`.

2. **`@expo/vector-icons` depende de `expo-font`, e isso não é instalado junto.** O
   `npx expo-doctor` apontou `Missing peer dependency: expo-font` com o aviso de que o app
   *pode quebrar fora do Expo Go*. Ou seja: funcionaria nos nossos testes e poderia quebrar no
   APK final. Detalhe importante para a etapa de **build**.

3. **A chave da API do TMDB ficará exposta no código do app.** Qualquer app mobile publicado
   pode ter seu bundle inspecionado — não existe "segredo" de verdade no client. Para este
   trabalho isso é aceitável, mas registramos que **a chave não deve ir para o repositório
   público** em um projeto real (o certo seria variáveis de ambiente + um backend
   intermediário).

---

## Etapa 2 — Arquitetura do projeto

### 6. Quais telas o app vai ter e o que cada uma exibe?

Duas telas:

**Home** — tela inicial
- Lista rolável (`FlatList`) de filmes populares.
- Cada item mostra pôster, título e ano de lançamento.
- Precisará de três estados na tela: carregando, erro (com opção de tentar de novo) e a lista
  carregada.
- **Origem dos dados:** endpoint `GET /movie/popular` do TMDB.

**Details** — tela de detalhes
- Abre ao tocar em um filme da Home.
- Mostra pôster grande, título, ano, nota, duração, gêneros e a sinopse completa.
- O título do filme aparece no cabeçalho da navegação.
- **Origem dos dados:** endpoint `GET /movie/{id}` do TMDB.

---

### 7. Como os dados vão fluir entre a tela de listagem e a tela de detalhes?

O fluxo planejado é este:

```
Home                                  Details
  |                                      |
  | 1. pede a lista para services/       |
  |    -> axios -> TMDB                  |
  | 2. renderiza um card por filme       |
  | 3. usuário toca em um card           |
  |                                      |
  | navigation.navigate('Details', {     |
  |     movieId: item.id                 |
  | })  ------------------------------>  |
  |                                      | 4. lê route.params
  |                                      | 5. busca o filme pelo id em services/
  |                                      | 6. renderiza os detalhes
```

A navegação vai carregar apenas o `movieId`, e não o objeto do filme inteiro. Dois motivos:

- O `id` é o dado essencial — é ele que identifica o filme na API. Os `params` da navegação
  precisam ser dados simples e serializáveis, então quanto menos passar por ali, melhor.
- A busca por `id` seria necessária de qualquer forma, porque **o endpoint de listagem não
  retorna todos os campos**: duração (`runtime`) e gêneros (`genres`) só vêm no endpoint de
  detalhes.

---

### 8. Por que separar o código em `screens/`, `components/` e `services/` em vez de deixar tudo em um único arquivo?

Cinco motivos concretos, não só "fica organizado":

1. **Cada pasta tem uma responsabilidade só.** `screens/` monta telas, `components/` desenha
   pedaços reutilizáveis de interface, `services/` conversa com a rede. Quando algo quebra,
   sabemos onde procurar: erro de requisição → `services/`; layout errado → `components/`.

2. **Reaproveitamento.** O card de filme será usado na Home. Quando criarmos uma tela de busca
   ou de favoritos, ele é reutilizado sem copiar e colar nada.

3. **Trabalho em grupo com menos conflito no Git.** Se tudo estivesse no `App.js`, os três
   integrantes mexendo em partes diferentes do app editariam o mesmo arquivo e todo commit
   viraria conflito de merge. Com a separação, cada um trabalha no seu arquivo.

4. **Troca de peça sem reescrever o app.** Se um dia trocarmos o TMDB por outra API, mudamos só
   `services/`. As telas continuam chamando a mesma função sem saber de onde o dado vem.

5. **Legibilidade.** Um `App.js` com listagem, detalhes, requisições e estilos passaria de 500
   linhas e ninguém consegue ler isso.

---

### 9. Quais componentes reutilizáveis o grupo já consegue identificar que vai precisar?

| Componente | O que faz | Onde será usado |
|---|---|---|
| `MovieCard` | Card da listagem: pôster, título, ano e nota. Recebe o filme e o que fazer no toque | Home (e futuras telas de busca/favoritos) |
| `Button` | Botão padrão do app, com ícone opcional | qualquer tela com ação |
| `Loading` | Indicador de carregamento centralizado | Home e Details |
| `ErrorMessage` | Ícone de alerta, mensagem e botão "tentar novamente" | Home e Details |

Já mapeados para depois:

- `SearchBar` — campo de busca por título na Home.
- `GenreChip` — etiqueta de gênero na tela de detalhes.
- `RatingStars` — a nota desenhada em estrelas em vez de só um número.
- `EmptyState` — o que mostrar quando a busca não retorna nada.

O `MovieCard` é o mais importante: é ele que vai receber o filme por prop, o que permite usá-lo
em qualquer lista sem alteração.

---

### 10. Onde ficará centralizada a lógica de comunicação com a API? Por que isso é uma boa prática?

Na pasta `services/`, dividida em dois arquivos com papéis diferentes:

**`services/api.js`** — o *como* conectar. Cria a instância única do axios, com a URL base, o
timeout e os parâmetros fixos (chave da API e idioma):

```js
const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  timeout: 10000,
  params: { api_key: TMDB_API_KEY, language: 'pt-BR' },
});
```

**`services/moviesService.js`** — o *o quê* buscar. Vai expor `getPopularMovies()` e
`getMovieById(id)`, e normalizar a resposta antes de devolver para a tela.

**Por que isso é boa prática:**

- **Um lugar só para mudar.** A chave da API aparece uma vez. Se ela mudar, ou se precisarmos
  adicionar um cabeçalho de autenticação em todas as requisições, o ajuste é em uma linha.
- **As telas não conhecem a API.** A Home chama `getPopularMovies()` e recebe uma lista pronta.
  Ela não precisa saber que existe TMDB, nem `api_key`, nem `/movie/popular`.
- **A normalização protege o app da API.** O TMDB devolve `vote_average` e `poster_path`. Se
  convertermos isso para nomes nossos no `services/`, uma mudança de formato na API é corrigida
  em um arquivo só, sem tocar em nenhum componente.
- **Facilita testar.** Dá para testar `getPopularMovies()` isoladamente, sem renderizar tela.

---

## Etapa 3 — Setup do projeto

### 11. O projeto rodou sem erros após a instalação das bibliotecas? Se não, o que precisou ser ajustado?

**Roda, mas houve um ajuste no caminho.**

Depois de instalar tudo, rodamos a verificação do Expo:

```bash
npx expo-doctor
```

Resultado: **20 de 21 checks passaram**, com uma falha:

```
✖ Check that required peer dependencies are installed
  Missing peer dependency: expo-font
  Required by: @expo/vector-icons
  Advice: Install missing required peer dependency with "npx expo install expo-font"
  Your app may crash outside of Expo Go without this dependency.
```

O `@expo/vector-icons` precisa do `expo-font` para registrar as fontes de ícone, mas o npm não
instala peer dependencies automaticamente. O aviso é sério: o app funcionaria no Expo Go durante
os testes e poderia quebrar no APK final — exatamente o tipo de erro que só aparece na etapa de
build.

**Correção:**

```bash
npx expo install expo-font
```

O comando instalou o pacote e ainda adicionou o config plugin `"expo-font"` ao `app.json`
sozinho. Nova verificação:

```
21/21 checks passed. No issues detected!
```

Depois disso, geramos um bundle de verdade para confirmar que o projeto compila:

```bash
npx expo export --platform android
```

O bundle foi gerado com sucesso, sem erro. Ou seja: o projeto está rodando.

---

### 12. Alguma biblioteca gerou conflito de versão com o SDK do Expo? Como o grupo resolveu (ou pretende resolver)?

**Conflito de versão não houve — e isso foi consequência direta de ter usado `npx expo install`.**

Dá para ver a diferença no `package.json`: o `expo install` fixou `react-native-screens` em
`~4.26.0` e `react-native-safe-area-context` em `~5.7.0`, que são as versões homologadas para o
SDK 57, e **não** as mais recentes do npm. Se tivéssemos usado `npm install`, teríamos pegado
versões mais novas, com risco de incompatibilidade com o runtime nativo do Expo Go 57.

O que apareceu, e já foi resolvido, foi o problema de **peer dependency** descrito na pergunta 11
(`expo-font`) — que é uma dependência faltando, não um conflito de versão.

Também rodamos `npm audit` e ele reportou 16 vulnerabilidades de severidade moderada em
dependências indiretas (pacotes de build, não código que vai para o app). **Decidimos não rodar
`npm audit fix --force`**, porque essa flag instala versões *major* diferentes e quebraria
justamente o alinhamento de versões que o `expo install` acabou de garantir.

**Como pretendemos evitar conflitos daqui pra frente:**

1. Sempre instalar com `npx expo install`, e reservar o `npm install` para bibliotecas
   comprovadamente 100% JavaScript.
2. Rodar `npx expo-doctor` depois de cada nova biblioteca instalada — foi ele que pegou o
   problema desta vez.
3. Versionar o `package-lock.json` (ele está commitado), para que os três integrantes tenham
   exatamente as mesmas versões e ninguém tenha o clássico "na minha máquina funciona".
4. Não atualizar o SDK do Expo no meio do desenvolvimento.

---

## Etapa 4 — README.md

### 13. Por que documentar as decisões do projeto (bibliotecas, arquitetura) desde o início é importante para o grupo?

- **Evita refazer a mesma pesquisa.** Comparamos React Navigation com Expo Router e Axios com
  fetch. Sem registrar o porquê, daqui a três semanas alguém pergunta "por que não usamos Expo
  Router?" e a discussão inteira recomeça.
- **Todo mundo segue o mesmo padrão.** Com a estrutura de pastas documentada, quem criar a tela
  de detalhes sabe onde colocar o arquivo e onde chamar a API. Sem isso, cada um organiza do seu
  jeito e o projeto vira uma colcha de retalhos.
- **Documentar depois quase nunca acontece.** No fim do projeto o foco é entregar, e o motivo
  das escolhas já foi esquecido. Escrever agora custa 15 minutos; reconstruir depois custa muito
  mais.
- **É o registro dos pontos de atenção.** O caso do `expo-font` está escrito. Quando formos
  gerar o APK e algo relacionado a fontes falhar, existe uma anotação explicando o problema em
  vez de horas de depuração.

---

### 14. Se outra pessoa entrasse no projeto agora, o README atual seria suficiente para ela entender o que foi decidido? Por quê?

**Em grande parte sim, com uma ressalva.**

**O que o README já resolve para essa pessoa:**
- Quem são os integrantes.
- Qual biblioteca foi escolhida para cada necessidade, com a versão e o comando de instalação.
- **Por que** cada uma foi escolhida e quais foram descartadas — ela não vai propor trocar por
  algo que já avaliamos e recusamos.
- A estrutura de pastas comentada, então ela sabe onde escrever código novo.
- As duas telas, o que cada uma exibe e de onde vêm os dados.
- Como rodar o projeto (`npm install` + `npx expo start`) — ela consegue subir o app sozinha,
  sem perguntar nada a ninguém.

**A ressalva:** faltam a divisão de tarefas entre os integrantes e a convenção de commits e
branches do grupo. Uma pessoa nova entenderia o **projeto**, mas não saberia **em que parte
mexer** sem perguntar. É o que pretendemos acrescentar na próxima etapa.

---

## Etapa 5 — Primeiro commit

### 15. O que esse primeiro commit representa dentro do desenvolvimento do projeto?

Representa a **fundação do projeto** — o ponto em que ele deixa de ser uma ideia discutida em
sala e vira algo que existe, roda e pode ser compartilhado.

Concretamente, esse commit registra:
- O projeto Expo criado e configurado (SDK 57).
- As bibliotecas escolhidas, nas versões exatas, travadas no `package-lock.json`.
- A estrutura de pastas que combinamos.
- As decisões documentadas no README.

É também o **ponto de retorno seguro**: a partir daqui, se alguém quebrar alguma coisa
experimentando, dá para voltar a um estado que sabidamente funciona. E é o marco que permite os
outros integrantes clonarem o repositório e começarem a trabalhar a partir da mesma base — antes
dele, cada um teria que montar o projeto por conta e as versões divergiriam.

---

### 16. Por que é importante começar o versionamento desde já, e não só quando o app estiver "pronto"?

- **O Git protege o trabalho em andamento, não o trabalho terminado.** É durante o
  desenvolvimento que quebramos as coisas. Sem histórico, um erro grande significa refazer do
  zero.
- **Sem versionamento não dá para trabalhar em grupo.** Antes do primeiro commit não existe nada
  para clonar. Os três ficariam trocando arquivo por WhatsApp e mesclando na mão — que é onde
  código se perde.
- **O histórico conta a história do projeto.** Uma sequência de commits mostra a evolução e
  facilita achar *quando* um bug entrou. Um commit único com "app pronto" não explica nada.
- **Commits pequenos são reversíveis; commits gigantes não.** Um commit com 60 arquivos
  alterados é impossível de revisar e de desfazer parcialmente.
- **"Pronto" nunca chega.** Sempre falta um ajuste. Esperando o momento perfeito, o versionamento
  não começa nunca.
- **Comprova o trabalho.** O histórico mostra quem contribuiu com o quê e quando — o que importa
  em um trabalho em grupo avaliado.

---

### 17. Quais arquivos ou pastas vocês decidiram (ou vão decidir) manter fora do controle de versão, e por quê?

Ficam fora, via `.gitignore`:

| Item | Motivo |
|---|---|
| `node_modules/` | São centenas de MB e milhares de arquivos, **reconstruíveis** a partir do `package.json` com um `npm install`. Versionar isso deixaria o clone lentíssimo e encheria os diffs de ruído. |
| `.expo/` | Cache e estado local do Expo, específico da máquina de cada um. Geraria conflito toda hora. |
| `dist/`, `web-build/`, `*.apk`, `*.aab` | Saídas de build. São **geradas** a partir do código; versionar arquivo gerado é duplicar informação que pode ficar desatualizada. |
| `.env` e chaves de API | Segredo não vai para repositório público. Quando a chave do TMDB entrar no projeto, ela deve ficar em `.env`, com um `.env.example` versionado no lugar mostrando quais variáveis existem. |
| `.DS_Store`, `Thumbs.db`, `*.log` | Lixo do sistema operacional e logs. Não têm relação com o projeto. |
| `/ios` e `/android` | Só existem se rodarmos `expo prebuild`. Como estamos no fluxo gerenciado, essas pastas são regeneráveis a partir do `app.json`. |

**O que fica dentro, de propósito:**

- **`package-lock.json`** — este *precisa* ser versionado. É ele que garante que os três
  integrantes instalem exatamente as mesmas versões. Sem ele, cada `npm install` pode trazer
  versões ligeiramente diferentes e o app funciona na máquina de um e quebra na do outro.
- **`assets/`** — imagens são parte do app e não são geradas por build.
- **`app.json`** — a configuração do Expo, incluindo o plugin `expo-font` que foi adicionado.

Um detalhe que descobrimos na prática: o Git **não versiona pasta vazia**. Como as pastas
`screens/`, `components/` e `services/` ainda não têm arquivos, colocamos um arquivo vazio
`.gitkeep` dentro de cada uma para que a estrutura fosse para o repositório.

A regra geral que seguimos: **versione o que é fonte, ignore o que é gerado ou secreto.**

---

## Checklist de entrega

- [x] Perguntas 1 a 17 respondidas (este arquivo)
- [x] Estrutura de pastas criada (`screens/`, `components/`, `services/`, `assets/`)
- [x] README com integrantes, bibliotecas e arquitetura
- [x] Projeto rodando sem erro (`expo-doctor` 21/21 e bundle gerado com sucesso)
- [x] Primeiro commit feito
- [x] Envio do repositório
- [x] Documento com perguntas e respostas dentro do repositório (`RESPOSTAS.md`)
