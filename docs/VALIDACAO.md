# Validação — 18/09/2026

## Automatizada

- Antes das mudanças: 1 suíte e 6 testes do MVP aprovados.
- Depois: 2 suítes e 12 testes aprovados (`npm test -- --runInBand`).
- Testes originais preservados, sem alterações nas expectativas.
- Exportação de produção web concluída: `npm run build:web` → `dist/`.

## Interface no build exportado

Servidor: `node scripts/serve-build.cjs`, em `http://127.0.0.1:4173`.
Validação técnica feita por automação de navegador, com respostas reais do TMDB:

- Listagem exibiu 20 filmes e pôsteres.
- Busca por `zzzzzz` exibiu 0 de 20, instrução e botão Limpar busca e filtros.
- Limpar restaurou 20 de 20.
- Nota 7+ reduziu a lista para 12 de 20 na resposta recebida.
- Ordenar por nota exibiu Toy Story 5 (8.4) antes de Obsessão (8.2) e Zona Zero (8.1).
- Abertura de Toy Story 5 exibiu pôster, nota, ano, duração, gêneros e sinopse.
- Voltar preservou os 12 resultados filtrados e a ordenação por nota.
- Capturas reais: `listagem.png`, `busca-vazia.png` e `detalhes.png`.

Os números refletem a resposta do momento e podem mudar. Não foram simuladas respostas no app.

## Limites e pendências

- Não é revisão cruzada humana. Executar e preencher `REVISAO-CRUZADA.md`.
- APK/IPA e EAS Build não foram executados.
- Splash nativa e ícone no launcher ainda não foram conferidos em instalação nativa.
- Erros de rede, catálogo totalmente vazio e fallbacks existem no código; não houve execução manual de todos esses estados nesta verificação.
- Os testes automatizados cobrem formatação e descoberta, não toda a navegação ou renderização.
- A instalação informou 14 vulnerabilidades moderadas na árvore npm. Não foi aplicado `audit fix --force`, que poderia alterar versões fora do escopo; recomenda-se análise das dependências antes de distribuição pública.
