# CatFilmes — Perguntas e respostas pós-MVP

Data: 18/09/2026. Integrantes: Mateus Dantas de Morais, Guilherme Lavigne Aguiar Brito e Alisson Silva Nascimento.
Repositório: https://github.com/dantasxx9/catfilmes

Este documento descreve o que foi implementado e verificado nesta entrega. Atividades que exigem participação humana ou instalação nativa estão identificadas como pendentes.

## 1. Qual paleta de cores e fonte de destaque foram escolhidas? Por quê?

Azul-noturno `#0B1220` no fundo, azul `#172338` nas superfícies, âmbar `#FFBE55` nos destaques, branco `#F5F7FC` no texto e cinza-azulado `#ACBBD0` nas informações secundárias. Bordas usam `#30415B`. A fonte de destaque é Space Grotesk Bold (700), com fonte do sistema no corpo. O fundo lembra uma sala de cinema; o âmbar remete à luz da projeção e destaca ações e notas.

## 2. Como foi mantida a consistência entre listagem e detalhes?

Cores e fonte vêm de `theme.js`. Ambas as telas têm contêiner de até 760 px com 16 px de margem interna, títulos na mesma fonte e metadados na mesma cor. Cards e botões usam cantos arredondados de 12 px. Loading, ErrorState e Button são compartilhados. Cabeçalhos e barra de status seguem o tema escuro.

## 3. Ícone e splash já refletem a identidade?

Sim, os arquivos do template foram substituídos por uma marca autoral com letra C e símbolo de play em âmbar. Há versões para ícone principal, Android adaptativo/monocromático, favicon e splash. `app.json` configura `expo-splash-screen` com o fundo da marca. A configuração e os arquivos estão prontos; a splash nativa ainda precisa de validação em um app instalado, pois a verificação desta etapa foi web.

## 4. Qual categoria pós-MVP foi implementada e por quê?

**Descoberta:** busca por título, filtro de nota mínima 7 e ordenação por popularidade, título ou nota. É uma única categoria, com três recursos complementares. Ajuda o usuário a escolher um filme e aproveita a API e os dados já disponíveis. Ficou fora do MVP porque o fluxo mínimo validava somente consultar a lista e abrir detalhes; refinar a seleção era uma melhoria posterior.

## 5. O que foi necessário instalar ou configurar?

A descoberta usa JavaScript e componentes do React Native, sem nova dependência, serviço ou permissão. Para identidade foram instalados `@expo-google-fonts/space-grotesk` e `expo-splash-screen`; configuramos fonte, tema, nome, imagens e plugin da splash. O TMDB continua usando `EXPO_PUBLIC_TMDB_TOKEN` em `.env`. A fonte é incluída no bundle.

## 6. Alguma categoria foi descartada? Por quê?

Login/cadastro exigiria serviço de autenticação e cuidado com dados pessoais. Notificações precisam de um gatilho de negócio útil, ausente no escopo atual. Monetização não tinha uma oferta premium definida. Personalização foi adiada para manter a entrega focada; favoritos locais poderiam funcionar sem login, mas sincronização entre aparelhos exigiria persistência e identidade do usuário. Essas decisões são de escopo, não afirmações de impossibilidade técnica.

## 7. Como a funcionalidade se conecta às telas existentes?

A busca, o filtro e os controles de ordenação ficam acima da listagem. O resultado continua usando MovieCard e abre Details com o ID do filme. Ao voltar, os critérios de descoberta permanecem na sessão. O botão Limpar restaura a lista na ordem original da API. A tela informa que a busca abrange somente a primeira página de populares carregada.

## 8. A funcionalidade é real ou simulada?

É real: os filmes vêm do TMDB e a lista é efetivamente filtrada e ordenada no dispositivo. Não há login fictício, pagamento ou dados mockados no fluxo do app. Os mocks existem somente nos testes. A busca não consulta todo o catálogo do TMDB; essa limitação foi assumida para manter o escopo pequeno e está visível na interface.

## 9. Quais estados vazios foram tratados?

Busca/filtro sem resultados: “Nenhum filme encontrado”, orientação para tentar outro título/remover o filtro e botão “Limpar busca e filtros”. Resposta de catálogo vazia: “Catálogo vazio por enquanto” e botão Recarregar. Erro de rede/autenticação: mensagem e Tentar novamente. Durante a requisição há indicador e texto de carregamento. Filme sem pôster tem ícone substituto na lista e texto nos detalhes; sinopse, título e ano ausentes mantêm os fallbacks do MVP.

## 10. O que mudou após a revisão cruzada? Houve confusão?

**A revisão cruzada com outro participante/grupo ainda não foi realizada nesta entrega.** Não há feedback humano comprovado para atribuir mudanças a essa atividade. Na implementação foram incluídos aviso sobre o alcance da busca, contagem de resultados, estados selecionados e botão Limpar para reduzir ambiguidades. A verificação técnica no navegador confirmou esses fluxos, mas não substitui a revisão cruzada. O roteiro em `docs/REVISAO-CRUZADA.md` deve ser executado e preenchido com observações reais.

## 11. O que foi removido ou reorganizado na limpeza?

Removemos `.gitkeep` das pastas que já têm código e a imagem de fundo Android do template que deixou de ser usada. As cores repetidas foram centralizadas em `theme.js`; a lógica de descoberta foi separada em `services/discovery.js`, fora da renderização. Foram eliminadas variáveis de exceção não usadas. HomeScreen usa nomes consistentes para seus estados e callbacks. Componentes compartilhados receberam o novo tema, sem duplicar botões por tela. Os documentos antigos foram preservados como histórico.

## 12. Os testes do MVP ainda passam? O que foi ajustado?

Sim. Os 6 testes originais passaram antes e depois das alterações, sem modificar seus asserts. Adicionamos 6 testes de descoberta: normalização de busca, combinação com nota mínima, ordenação alfabética sem mutação, ordem por nota com valores ausentes, restauração da popularidade e resultados vazios. Resultado: **2 suítes, 12 testes aprovados**, com `npm test -- --runInBand`. Isso valida as regras testadas, não substitui testes de interface em aparelho.

## 13. O README documenta o app, execução e decisões? O que foi adicionado?

Sim. O README atual explica o produto, identidade visual, recursos, limite da busca local, configuração do TMDB, instalação, execução, testes e build. Inclui estrutura de pastas, justificativas de escopo, dependências adicionadas, prints reais da listagem/detalhes/busca vazia, pendências e links para as respostas e os registros de validação.

## 14. Foi gerado um build de teste? Qual o obstáculo, se houver?

Sim, **build web de produção**, gerado por `npm run build:web` em `dist/`. Foi servido por `node scripts/serve-build.cjs` e verificado no navegador fora do servidor de desenvolvimento, usando dados reais. A saída é regenerável e não vai ao Git porque incorpora a configuração local do token. **Não foi gerado APK/IPA nem preview via EAS.** O projeto ainda não está configurado/vinculado nesta entrega para esse fluxo nativo. Se o avaliador exigir APK, é necessário concluir a configuração EAS/build nativo e testar em aparelho. Não houve tentativa de EAS que justifique alegar uma falha do serviço.

## 15. O que o app final tem além do MVP e o que fica para depois?

Agora tem nome e marca CatFilmes, paleta e fonte próprias, ícones/splash configurados, busca tolerante a acentos e caixa, filtro por nota, ordenação, contador de resultados, limpeza dos critérios, documentação com prints e uma suíte ampliada de testes. Para depois: pesquisa remota com paginação, favoritos, sincronização autenticada se necessária e validação nativa. A revisão cruzada humana permanece uma pendência desta atividade, e não uma funcionalidade futura.

## Checklist honesto da entrega

- [x] 15 perguntas respondidas neste arquivo.
- [x] Identidade visual definida e aplicada; assets de ícone e splash próprios.
- [x] Categoria descoberta implementada e integrada à listagem/detalhes.
- [x] Estados vazios e feedback visual tratados.
- [x] Código revisado e testes do MVP revalidados.
- [x] README com instruções, decisões e prints reais.
- [x] Build web gerado e conferido fora do ambiente de desenvolvimento.
- [ ] Revisão cruzada com outro grupo (roteiro disponível).
- [ ] Build e validação nativa APK/IPA, caso exigidos.
- [ ] Conferência da splash e do ícone no launcher de um aparelho instalado.
