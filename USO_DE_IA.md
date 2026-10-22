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

### Imagens pesadas

As fotos fornecidas (PNG de 2,6 a 3,8 MB) foram aplicadas direto pela IA nas telas. Ao revisar o peso da página, foram convertidas para WebP (22 a 99 KB, sem perda visível), com script em `frontend/scripts/otimizar-imagens.mjs` e uma migration de dados para atualizar o caminho da imagem em bancos já criados.

### Outros problemas da IA corrigidos durante o desenvolvimento

- **Migration não aplicada:** a API foi iniciada com `dotnet run --no-build` usando um binário anterior à migration, e falhou com "no such table: Cursos". Corrigido recompilando antes de rodar.
- **Pacote ausente:** as anotações do Swagger exigem o pacote `Swashbuckle.AspNetCore.Annotations`, separado do pacote principal; o build falhou até adicioná-lo.
- **Testes do próprio teste:** duas falhas do script E2E eram do teste (triplo clique que não seleciona texto no Chrome headless; espera por `requestAnimationFrame` em aba em segundo plano) e não do aplicativo. Foram diagnosticadas e o teste ajustado, sem alterar o app.
