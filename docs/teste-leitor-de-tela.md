# Roteiro de teste manual com leitor de tela

Complementa as verificações automáticas (`npm run test:a11y`, que usa o axe-core, e `npm run test:arvore`, que confere a árvore de acessibilidade — papéis, nomes, níveis de título e estados — que o Chrome entrega aos leitores de tela). **Elas não substituem ouvir a aplicação sendo lida por um leitor de tela de verdade**; este roteiro serve para isso.

> **Status:** _roteiro pronto; execução ainda não registrada._ Preencha o quadro abaixo depois de executar. Não registre como feito o que não foi testado.

## Preparação (5 min)

| Item | O que fazer |
|---|---|
| Leitor de tela | **NVDA** (gratuito, https://www.nvaccess.org) ou o **Narrador** do Windows (já instalado: `Ctrl` + `Win` + `Enter` liga/desliga) |
| Navegador | Google Chrome ou Microsoft Edge |
| Aplicação | `docker compose up` e abrir http://localhost:8080 (ou a URL publicada) |
| Dica | Teste de olhos fechados ou com o monitor desligado. Se for possível entender e concluir as tarefas só pelo som, a página está acessível |

Teclas úteis do **NVDA** (modo de navegação): `H` próximo título · `D` próximo marco (região) · `F` próximo campo de formulário · `K` próximo link · `B` próximo botão · `Tab` próximo controle · `NVDA+F7` lista de títulos, links e marcos. (`Shift` + a letra volta.) A tecla NVDA é `Insert` ou `Caps Lock`.

## Tarefas e o que deve acontecer

Marque ✅ se aconteceu, ❌ se não e anote o que foi lido.

### A. Landing (`/`)

| # | Tarefa | Esperado | Resultado |
|---|---|---|---|
| A1 | Ao abrir a página, ouvir o título da aba | “Impulsione sua carreira na indústria \| SESI Indústria” | |
| A2 | Apertar `Tab` uma vez | Foca “Ir para o conteúdo” (link de salto); `Enter` leva ao conteúdo principal | |
| A3 | Navegar por títulos (`H`) | Começa em “Impulsione sua carreira na indústria” (nível 1) e depois seções (nível 2) | |
| A4 | Navegar por marcos (`D`) | Anuncia banner, navegação “Principal”, principal, regiões nomeadas (ex.: “Cursos em destaque”) e rodapé (informação do conteúdo) | |
| A5 | Chegar ao carrossel de cursos e usar os botões | “Anterior” / “Próximo” são lidos com esses nomes; “Anterior” aparece como indisponível no início | |
| A6 | Abrir um card de curso com `Enter` | Navega para a página do curso e o título da aba muda para o nome do curso | |

### B. Catálogo (`/cursos`)

| # | Tarefa | Esperado | Resultado |
|---|---|---|---|
| B1 | Pressionar `F` (campos de formulário) | Lê “Pesquisar pelo nome do curso”, “Categoria”, “Modalidade” e “Status”, cada um com o seu rótulo | |
| B2 | Digitar “quimica” no campo de busca e aguardar | Após uma breve pausa é anunciado “1 curso encontrado” (sem precisar mover o foco) | |
| B3 | Escolher uma categoria no filtro e apertar `Tab` | Anuncia a nova quantidade (“N cursos encontrados”) | |
| B4 | Procurar o botão “Limpar filtros” | Lido como botão; ao ativá-lo, o foco volta ao campo de busca e a lista volta a “8 cursos encontrados” | |
| B5 | Buscar “zzzz” | Anuncia “Nenhum curso encontrado” e “0 cursos encontrados” | |
| B6 | Navegar pelos cards com `K` (links) | Cada link é lido pelo título do curso (ex.: “Química e Sustentabilidade”) | |
| B7 | No celular do leitor ou com a janela estreita | O menu do cabeçalho é lido como botão “Abrir menu” e, depois de aberto, como “Fechar menu” (estado expandido/recolhido) | |

### C. Detalhes do curso (`/cursos/1`)

| # | Tarefa | Esperado | Resultado |
|---|---|---|---|
| C1 | `H` | Único título de nível 1 com o nome do curso | |
| C2 | Chegar aos acordeões (`B`) | “Módulos”, “Aulas online e avaliações” e “Dúvidas frequentes” são lidos como botões **recolhidos** | |
| C3 | Ativar “Módulos” com `Enter` ou `Espaço` | Passa a ser lido como **expandido** e o conteúdo (10 módulos) pode ser lido logo em seguida | |
| C4 | Abrir outro acordeão | O primeiro continua aberto (são independentes) | |
| C5 | Abrir `/cursos/3` (curso “Em breve”) | O botão de matrícula é lido como indisponível: “Disponível em 16/11/2026” | |
| C6 | Abrir `/cursos/999` | Lê “Curso não encontrado” como título principal e oferece o link “Ver todos os cursos” | |

### D. AVA (`/ava/1`)

| # | Tarefa | Esperado | Resultado |
|---|---|---|---|
| D1 | Procurar a barra de progresso | “Progresso no curso”, 10 por cento | |
| D2 | Navegar pelo menu do curso | Navegação “Aulas e módulos”; “1.1 Introdução (concluída)”, “1.2 Boas práticas (aula atual)”, “1.3 Extras (não iniciada)” | |
| D3 | Seta de voltar (primeiro link) | “Voltar para a página do curso” | |
| D4 | `H` | Título “Boas práticas” (nível 1) e “Recomendações” (nível 2) | |

## Registro do teste

| Campo | Preencher |
|---|---|
| Data | |
| Executado por | |
| Leitor de tela e versão | |
| Navegador e versão | |
| Sistema operacional | |
| Itens que passaram | ___ de 23 |

**Problemas encontrados** (descreva o item, o que foi lido e o que era esperado):

1. 

**Correções feitas depois do teste:**

1. 
