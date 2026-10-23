# Uso de Inteligência Artificial

> Documento mantido ao longo do desenvolvimento e revisado antes da entrega.

## 1. Ferramentas utilizadas

| Ferramenta | Onde foi usada |
|---|---|
| **Claude Code** (extensão do VS Code, modelo Claude Sonnet 5.5) | Planejamento, geração e revisão de código (API .NET, front-end React, testes, documentação) |
| **Claude in Chrome** (extensão do navegador) | Leitura do protótipo do Figma, que exige login e não pôde ser lido pelo Claude Code (HTTP 403) |

## 2. Objetivo do uso

- Acelerar o desenvolvimento do catálogo (back-end, front-end e testes), com revisão e decisões de arquitetura feitas pelo candidato.
- Extrair do protótipo do Figma os textos, cores, estrutura e interações, que foram registrados em `docs/design/`.
- Escrever dados fictícios coerentes (cursos, módulos, FAQ) e a documentação.

## 3. Prompts relevantes: o que foi aproveitado ou descartado

| Prompt / pedido (resumo) | Aproveitado | Descartado ou ajustado |
|---|---|---|
| Ao Claude in Chrome: "percorra os 3 fluxos do protótipo e descreva, sem escrever código, textos literais, cores (hex), tipografia, estrutura, componentes, assets, interações e tire prints" | Textos literais, estrutura das telas, interações e prints (`docs/design/`) | Medidas vieram em px do **print**, não do design, e as cores foram amostradas de JPEG (±3 por canal): tratadas como aproximação e conferidas visualmente. Fontes "supostas" (Arimo) ignoradas: usada a Open Sans fornecida |
| Ao Claude Code: escolher a stack do front-end | React + Vite, servido pela própria API .NET em um único container | **Next.js foi descartado**: duplicaria o servidor (Node + .NET) e complicaria a publicação gratuita sem benefício para um catálogo pequeno |
| Ao Claude Code: "faça o back-end em C# com busca e filtros" | API minimal com EF Core + SQLite, migration e seed; pesquisa sem acento via coluna normalizada | Painel administrativo (CRUD) **não foi feito**: o enunciado dispensa; registrado como limitação |
| Ao Claude Code: "adicione uma tela para testar a API" | Swagger UI em `/swagger` (ligado em desenvolvimento) | — |
| Ao Claude Code: reproduzir Header, Footer e Landing a partir da extração e dos prints | Estrutura e estilos, depois ajustados na comparação com os prints (sobreposição vermelha do hero, título do CTA, link "Sobre" ativo) | Cores/tamanhos que destoavam foram corrigidos à mão |
| Ao Claude Code: criar o catálogo `/cursos` (não existe no Figma) | Busca com atraso, filtros combinados, contagem, limpar filtros e estados de carregamento/erro/vazio | — |
| Ao Claude Code: gerar ilustrações para os cursos | 7 ilustrações SVG geradas por script (`frontend/scripts/gerar-ilustracoes.mjs`), pois as fotos dos cards não foram fornecidas | — |

## 4. Como o conteúdo gerado foi validado

- **Compilação e lint** a cada etapa (`dotnet build`, `npm run build`, `npm run lint`).
- **Chamadas reais à API** (busca, filtros combinados, valores inválidos, 404) antes de usar no front-end.
- **Comparação visual** com os prints do Figma, em 1440, 768 e 390 px, usando capturas do Chrome.
- **Testes do back-end** (`backend/tests/`, xUnit, 90 testes) — e uma **verificação por mutação**: defeitos injetados de propósito no código (busca sem normalização, filtros ignorados, validação removida) para confirmar que os testes realmente falham quando deveriam.
- **Testes automatizados de interface** (`frontend/e2e/`, com Chrome headless e axe-core) cobrindo busca, filtros combinados, contagem, limpar filtros, link direto, botão Voltar, estados de carregamento, erro e vazio, acessibilidade básica e ausência de rolagem horizontal em 390 px.
- **Revisão do candidato** de todo o código antes de cada commit.

## 5. Exemplo de erro ou inadequação identificado

**Busca atrasada apagava os filtros escolhidos.** No catálogo, o texto da busca só é aplicado à URL 300 ms depois da última tecla (para não chamar a API a cada letra). O código gerado pela IA atualizava a URL com `setSearchParams((anterior) => ...)`, assumindo que `anterior` seria sempre o estado mais recente. No React Router isso não é verdade: a função recebe o estado da renderização em que o temporizador foi criado.

- **Sintoma:** digitar "matematica" e, em seguida, escolher categoria e status antes de passar 300 ms fazia a busca atrasada gravar a URL só com `?busca=matematica`, e os filtros escolhidos desapareciam.
- **Como foi descoberto:** o teste automatizado do cenário "busca + categoria + status" falhou; a depuração mostrou a última requisição saindo sem `categoria` e `status`. Teste manual rápido provavelmente não teria pego.

## 6. Correção realizada

A função que atualiza a URL passou a partir de uma **referência (`useRef`) ao estado mais recente** da URL, em vez do valor capturado pelo temporizador (`frontend/src/pages/Catalogo.jsx`). Foi adicionada uma verificação específica no teste (cenário 3b: "busca atrasada não apaga filtros escolhidos antes dela"), que passa após a correção.

### Segundo exemplo: acessibilidade que parecia correta e não estava

Depois de testar rótulos, foco e teclado manualmente, uma auditoria automática com **axe-core** (`npm run test:a11y`) encontrou 18 ocorrências em código gerado pela IA que passaram despercebidas:

- cargo dos depoimentos sobre o vermelho com contraste de 3,5:1 (mínimo 4,5:1), por causa de uma opacidade aplicada ao texto;
- o card do catálogo usava `aria-labelledby` apontando só para o título, de modo que o nome acessível do link não continha todo o texto visível (WCAG 2.5.3);
- o carrossel de depoimentos era rolável, mas sem nenhum item focável, portanto inacessível por teclado;
- a seção e o carrossel de "Principais cursos" tinham o mesmo nome de marco (landmark);
- as páginas 404 e "curso não encontrado" não tinham `h1`.

**Correção:** cor cheia no cargo (sobre o vermelho); link estendido a partir do título do card (o nome acessível passa a ser o título visível); trilha do carrossel focável (`tabindex="0"` com rótulo); nome distinto para o carrossel; nível de título configurável (`h1` nas telas de página inteira). A auditoria passa a retornar zero violações nas 9 telas, em desktop e celular, e ficou no repositório como teste.

### Terceiro exemplo: tamanhos de texto subestimados

Os tamanhos de fonte da primeira versão foram **estimados pela IA a partir da altura das letras maiúsculas** nos prints do Figma. Uma comparação lado a lado de cada print com a aplicação renderizada (imagem do Figma em cima, a nossa embaixo, no mesmo trecho e na mesma escala) mostrou que **quase todos os textos estavam de 6% a 30% menores** que o protótipo (títulos de cards, depoimentos, botões, acordeões, FAQ), além de outros desvios: os ícones de benefício apareciam minúsculos porque os SVGs fornecidos já trazem a caixa colorida e a IA os colocou dentro de uma segunda caixa; e as proporções de coluna do Impacto, do CTA e do AVA divergiam.

**Correção:** os tamanhos passaram a ser calibrados por **medida** (largura de uma mesma linha de texto no Figma e na aplicação), as colunas foram ajustadas às proporções do protótipo e os ícones passaram a ser usados no tamanho original. Depois do ajuste, a quebra de linha dos títulos de cards, do CTA e do rodapé ficou igual à do Figma, e as suítes de interface e de acessibilidade (inclusive contraste) continuaram passando.

### Imagens pesadas

As fotos fornecidas (PNG de 2,6 a 3,8 MB) foram aplicadas direto pela IA nas telas. Ao revisar o peso da página, foram convertidas para WebP (22 a 99 KB, sem perda visível), com script em `frontend/scripts/otimizar-imagens.mjs` e uma migration de dados para atualizar o caminho da imagem em bancos já criados.

### Exportação para o Moodle (diferencial)

A IA propôs e implementou um endpoint que gera o CSV da ferramenta “Carregar cursos” do Moodle. Duas decisões foram do candidato: **não colocar a exportação no front-end** (é uma tarefa administrativa e a aplicação é a área do aluno; a IA tinha sugerido um link no catálogo e a sugestão foi descartada) e **não tentar uma integração ao vivo** (não há Moodle disponível para testar). O formato foi conferido por busca na documentação oficial (a página direta bloqueou o acesso automático com HTTP 403, então só os campos obrigatórios e o exemplo oficial foram confirmados; o README diz quais colunas não puderam ser confirmadas e que a importação não foi testada em um Moodle real).

Um teste automatizado revelou um erro da IA no próprio gerador: o `WebUtility.HtmlEncode` do .NET converte **cada letra acentuada em entidade numérica** (`ç` vira `&#231;`), o que deixaria o CSV ilegível. Foi trocado por um escape só dos caracteres de marcação (`& < > " '`).

### Auditoria Lighthouse e inércia dos carrosséis

A IA mediu o site com o Lighthouse e propôs correções; o candidato impôs a regra de **não alterar o visual** do Figma, então só entraram ajustes invisíveis (reserva de altura durante o carregamento, prioridade de imagens e cache), conferidos por comparação pixel a pixel. O que arriscava o visual foi deixado de fora e registrado. Ao conferir, o candidato percebeu dois desvios que a IA não havia notado: o menu do AVA listava 10 módulos (o Figma mostra 6) e o carrossel parava na hora ao soltar o mouse (no Figma há inércia). Ambos foram corrigidos, e a inércia ganhou testes automatizados, validados por mutação (com a inércia desligada, 4 testes falham). A primeira versão da inércia parava em qualquer ponto e dava um “tranco” ao encaixar; a IA a refez para terminar exatamente no card de destino.

### Pipeline de CI (GitHub Actions)

O candidato nunca havia configurado CI; a IA explicou o conceito antes e o fluxo foi combinado assim: desenvolver numa branch separada, ver o resultado e só então juntar na `main`. O workflow passou verde na primeira execução, o que não prova que ele detecta falhas; por isso foi criada uma branch descartável com dois defeitos injetados de propósito, e o CI ficou vermelho nos jobs esperados (a branch foi apagada). Como o log do Actions exige login, a IA criou um script que transforma as linhas de erro em anotações, legíveis também pela API pública.

### Outros problemas da IA corrigidos durante o desenvolvimento

- **Migration não aplicada:** a API foi iniciada com `dotnet run --no-build` usando um binário anterior à migration, e falhou com "no such table: Cursos". Corrigido recompilando antes de rodar.
- **Pacote ausente:** as anotações do Swagger exigem o pacote `Swashbuckle.AspNetCore.Annotations`, separado do pacote principal; o build falhou até adicioná-lo.
- **Testes do próprio teste:** duas falhas do script E2E eram do teste (triplo clique que não seleciona texto no Chrome headless; espera por `requestAnimationFrame` em aba em segundo plano) e não do aplicativo. Foram diagnosticadas e o teste ajustado, sem alterar o app.
