# Paleta e tipografia globais — "[TEST DEV] SESI Indústria"

Método: protótipo visto no Chrome (sem login, sem Dev Mode). Hex medidos por amostragem de pixel em prints JPEG (±3). Tamanhos em **px do print** (a janela do protótipo tem 1117 px de largura nos fluxos 01 e 02, e 1133 no 03). Tamanhos em px de design: **não identificado**.

Hipótese NÃO confirmada: se o frame de design tiver 1440 px de largura, a escala é ≈ 0,776 e basta multiplicar as medidas por ≈ 1,289. Não há nada no protótipo que confirme os 1440.

## Paleta

| Hex (≈) | Onde é usado |
|---|---|
| #000000 | Texto principal (títulos e corpo) em Landing, Detalhes e AVA |
| #FFFFFF | Fundo de páginas e do conteúdo do AVA; texto sobre vermelho/preto; cards de depoimento (Detalhes); botão da barra fixa e botão "Mandar uma mensagem" |
| #0C0C0C | Botão "Matricule-se" (hero), barra fixa inferior (Detalhes), bloco do curso na sidebar do AVA |
| #151314 | Barra superior da sidebar do AVA |
| #981816–#9F2122 | Overlay vermelho sobre a foto do hero (Landing) |
| #9A0312 | Cards de curso (Landing) |
| #880002 | Seções de depoimentos (Landing), CTA "Pronto para transformar" (Landing), "Fale com a gente" (Detalhes) |
| #C3212C | Cards de depoimento (Landing) |
| #1E0200 | Footer |
| #FFFBF4 | Títulos de colunas do footer |
| #A58D89 | Links do footer |
| #FAD19A | Tag Matemática |
| #E5CFF7 | Tag Ciências |
| #FCECED | Caixa dos ícones de benefícios (Landing) |
| #FBD19B / #FCD19C | Caixa dos ícones de benefícios e seção de depoimentos (Detalhes) |
| #E1E1E1 | Divisores e bordas finas (header, acordeões, lista da sidebar) |
| #CECECE | Divisor vertical sidebar/conteúdo (AVA) |
| #545454 / #4D4D4D | Textos secundários (descrições, respostas de FAQ, textos de benefícios) |
| #444444 | Trilho de progresso do AVA |
| #949494 | Rótulo "CERTIFICAÇÃO" no AVA |

Tag Linguagens e tag Sustentabilidade: cor **não identificada** nesta extração (as tags de Matemática e Ciências foram as medidas).

## Tipografia

- **Família principal: Open Sans** (confirmada pelo carregamento de `OpenSans_wdth_wght__2` na rede). 
- `Arimo` também é carregada; onde é usada: **não identificado**.
- Cap height da Open Sans ≈ 0,714 em, usado para estimar o tamanho a partir da altura da maiúscula.

| Estilo | Tamanho (px do print) | Peso | Passo de linha | Onde |
|---|---|---|---|---|
| H1 Landing | ≈ 59 | Bold | 61 | Hero |
| H1 Detalhes | ≈ 32 | Bold | 39 | Título do curso |
| H2 de seção | ≈ 32–34 | Bold | — | Títulos das seções (Landing e Detalhes); "Fale com a gente" ≈ 40 |
| H2 AVA | ≈ 20 | Bold | — | "Boas práticas", "Recomendações" |
| Números de impacto | ≈ 46 | Regular | — | Landing, seção de impacto |
| Título de card / acordeão | ≈ 20 | Bold | — | Cards de curso, cabeçalhos dos acordeões |
| Corpo | ≈ 14–15 | Regular | ≈ 21 | Parágrafos (Landing, Detalhes, AVA ≈ 14 / 21,3) |
| Corpo pequeno | ≈ 11–13 | Regular | 18 | Textos de benefícios, respostas de FAQ |
| Botão | ≈ 13 | Medium | — | Todos os botões |
| Tag / rótulo | ≈ 8–10 | Medium, CAIXA ALTA | — | Tags, "DEPOIMENTOS", "CERTIFICAÇÃO" |

Letter-spacing: não identificado.

## Grid e espaçamento

- Landing e Detalhes: container de **940 px do print** em janela de 1117 (≈ 84%), alinhado ao centro, margens laterais ≈ 88/89 (x 313→1253).
- Detalhes: 4 colunas de benefícios com passo 240; hero em 2 colunas (texto à esquerda; vídeo 543 × 306 a partir de x 710).
- Depoimentos: 5 cards de 224 de largura, gap 14.
- Acordeões: linhas de 52 de altura.
- AVA: sidebar fixa de 163; conteúdo com coluna de texto de 754 (margens ≈ 108).
- Gutter e espaçamento vertical padrão entre seções: ver cada fluxo; padrão único não identificado.

## Raios e sombras

- Botões ≈ 5; tags ≈ 3; ícones de benefício 40 × 40 com raio ≈ 5; thumbnail ≈ 6; barra fixa ≈ 8; busca do AVA em pílula.
- Sombras: leve nos cards de depoimento; valores exatos **não identificados**.

## Breakpoints

Só desktop foi visto. Breakpoints: **não identificado**.

## Prints

Todas as capturas estão em `prints/01-landing`, `prints/02-detalhes-curso` e `prints/03-ava`. Resolução: 1568 × 726 (máximo disponível na ferramenta).
