# 01. Landing page — extração do protótipo Figma "[TEST DEV] SESI Indústria"

Fonte: protótipo público (`node-id=6017-342`), visto no Chrome. O Dev Mode/Inspect **não** estava disponível (a visão de design pede login), então:

- **Textos**: transcritos literalmente dos prints.
- **Cores (hex)**: medidas por amostragem de pixel nos prints JPEG (margem de erro de ±3 por canal). Onde o fundo é foto, o valor é aproximado.
- **Medidas**: em **px do print** (a tela do protótipo é redimensionada para caber na janela). O tamanho real do frame em px de design é **não identificado**. Veja a nota de escala em `99-paleta-tipografia-globais.md`.
- Tamanhos de fonte: estimados pela altura de maiúsculas (Open Sans, altura de maiúscula ≈ 0,714 em). São estimativas.

## 8. Layout do frame

| Item | Valor |
|---|---|
| Janela visível do frame no print | 1117 × 627 px do print (x 225→1342, y 49→676) |
| Altura total rolável (cabeçalho a rodapé) | ≈ 2859 px do print (627 visíveis + 2232 de rolagem) |
| Tamanho do frame em px de design | não identificado |
| Container de conteúdo | 940 px do print de largura (x 313→1253), margens laterais ≈ 88/89 px do print (≈ 7,9% da largura de cada lado) |
| Tipo de rolagem | vertical dentro do frame; cabeçalho **fixo** (sticky) |

## 1. Estrutura (ordem de cima para baixo, em y de página, px do print)

1. **Header fixo**, altura 60 (0→60).
   - No topo da página: transparente sobre o hero, logo e textos brancos.
   - Depois de rolar: fundo branco, logo vermelho, textos pretos, linha inferior de 1 px cinza claro (≈ #E1E1E1).
2. **Hero** (0→491): foto com sobreposição vermelha, texto à esquerda, alinhado ao container.
3. **Principais cursos** (≈ 540→1010): título, carrossel horizontal de cards (4 cards inteiros + 1 cortado visíveis), botão "Ver todos os cursos" à esquerda e setas ← → à direita.
4. **Impacto transformador** (≈ 1070→1600): grid de 2 colunas. Coluna esquerda: título e texto (x 313). Coluna direita (x 631→1253, 622 de largura): 4 linhas de estatística + 3 benefícios em 3 colunas.
5. **Depoimentos** (1601→2171): fundo vinho; rótulo, título e carrossel de 5 cards; setas ← → à direita.
6. **CTA "Pronto para transformar sua carreira?"** (2171→2567): mesmo fundo vinho, separado do bloco anterior por uma linha de 1 px mais clara. 2 colunas: texto e botão à esquerda (x 313), thumbnail de vídeo à direita (x 644→1253, 609 × 342).
7. **Footer** (2567→2859, altura ≈ 292): fundo marrom-escuro; 4 colunas (x 313, 551, 789, 1027; passo de 238) e linha de copyright/redes na base.

Alinhamento: tudo alinhado à esquerda do container, exceto rótulos de estatística (alinhados à direita), setas dos carrosséis (alinhadas à direita do container) e o ícone de play (centralizado na thumbnail).

## 2. Textos (literais, na ordem)

**Header**: logo "SESI+INDÚSTRIA" (imagem/wordmark) · Início · Cursos · Sobre · Área do aluno

**Hero**
- Título (3 linhas): `Impulsione` / `sua carreira` / `na indústria`
- Subtítulo (2 linhas): `Amplie seus conhecimentos com excelência na melhor plataforma de estudos da indústria brasileira`
- Botão: `Conhecer cursos` + seta →

**Principais cursos**
- Título: `Principais cursos`
- Cards (ver seção 4)
- Botão: `Ver todos os cursos`

**Impacto transformador**
- Título: `Impacto transformador`
- Texto: `Resultados que demonstram o sucesso da nossa metodologia de capacitação contínua para a indústria`
- Estatísticas (número à esquerda, rótulo à direita):
  - `25.000+` — `Profissionais Capacitados`
  - `500+` — `Empresas parceiras`
  - `4.8/5` — `Avaliação média`
  - `2.5M+` — `Horas de capacitação`
- Benefícios:
  - `Certificação SESI` — `Cursos com a melhor certificação do mercado industrial reconhecidos pelo SESI.`
  - `Professores especialistas` — `Contamos com professores reconhecidos por sua excelência no mercado.`
  - `Suporte contínuo` — `Você não está sozinho! Acompanhamento online durante todo o curso.`

**Depoimentos**
- Rótulo: `DEPOIMENTOS`
- Título: `Quem fez recomenda`
- Cards (ver seção 4)

**CTA**
- Título (3 linhas): `Pronto para` / `transformar sua` / `carreira?`
- Texto: `Junte-se a milhares de profissionais que já estão transformando a indústria através dos nossos cursos. Invista no seu futuro hoje mesmo!`
- Botão: `Matricule-se` + seta →
- Vídeo: thumbnail com botão play (sem legenda)

**Footer**
- Coluna 1: logo "SESI+INDÚSTRIA" (branco) · `contato@sesindustria.com.br` · `Av. Paulista, 1313`
- Coluna `NAVEGAÇÃO`: Início · Certificação · Cursos · Sobre · Blog
- Coluna `CURSOS POPULARES`: Cultura Organizacional · Ferramentas Google para Produtividade · Excel Básico ao Avançado · Trabalho em Equipe e Colaboração · Gestão do Tempo e Produtividade · Comunicação Assertiva · Inteligência Emocional no Trabalho
- Coluna `SUPORTE`: Termos de Uso · Política de Privacidade · Trabalhe Conosco · Fale Conosco · Central de Ajuda
- Base: logo "SESI" pequeno + `Todos os direitos reservados.` · ícones LinkedIn, Instagram, Facebook (nessa ordem, à direita)

Placeholders / labels de formulário: não há (a tela não tem campos).

## 3. Estilo (px do print; hex medidos)

| Elemento | Fundo | Texto | Fonte / peso | Tamanho estimado | Outros |
|---|---|---|---|---|---|
| Header (rolado) | #FFFFFF | #000000 | Open Sans, Regular/Medium | links ≈ 13 px do print | altura 60; borda inferior 1 px ≈ #E1E1E1 |
| Header (no topo) | transparente sobre o hero | branco | idem | idem | — |
| Botão "Área do aluno" | transparente; hover cinza claro | branco (topo) / preto (rolado) | Open Sans Medium | ≈ 13 | 115 × 34, borda 1 px, raio ≈ 6; padding horizontal ≈ 13 |
| Hero (sobreposição) | vermelho ≈ #981816 a #9F2122 sobre a foto (opacidade não identificada) | branco | — | — | altura 491; foto vista à direita |
| Hero H1 | — | #FFFFFF | Open Sans **Bold (700)** | ≈ 59 (altura de maiúscula 42) | passo entre linhas 61 (≈ 1,04 do tamanho), 3 linhas |
| Hero subtítulo | — | ≈ #FFEDE3 (branco com leve transparência) | Open Sans Regular | ≈ 14 (passo de linha 21) | 2 linhas |
| Botão "Conhecer cursos" | #FFFFFF; hover cinza claro (≈ #E8E8E8, não medido com precisão) | #000000 | Open Sans Medium/SemiBold | ≈ 13 | 157 × 32, raio ≈ 5; seta 16 px à direita |
| Fundo da seção Principais cursos / Impacto | #FFFFFF | — | — | — | — |
| H2 "Principais cursos" | — | #000000 | Open Sans **Bold** | ≈ 32 (maiúscula 23) | — |
| Card de curso | base vermelha sólida #9A0312, com foto no terço superior em degradê para o vermelho | branco | — | — | 224 × 324, raio ≈ 6, sombra suave abaixo (blur grande, opacidade baixa), padding interno ≈ 19–20 |
| Título do card | — | #FFFFFF | Open Sans **Bold** | ≈ 20 (maiúscula 14), passo 25,5 | alinhado à base, acima da descrição |
| Descrição do card | — | #FFFFFF (≈ 90%) | Open Sans Regular | ≈ 12 (passo 17) | 3–4 linhas |
| Tag "MATEMÁTICA" | #FAD19A | ≈ #000000 | Open Sans Medium, CAIXA ALTA | ≈ 10 | 88 × 21, raio ≈ 3, ícone 12 px à esquerda; posição: 20 px da esquerda, 21 px do topo do card |
| Tag "CIÊNCIAS DA NATUREZA" | #E5CFF7 | ≈ #000000 | idem | ≈ 10 | 134 × 21 |
| Card "Todos os cursos" | #FFFFFF, sombra como os outros | #000000 | Open Sans **Bold** | ≈ 17 | texto na base + seta →; raio ≈ 6 |
| Botão "Ver todos os cursos" | #FFFFFF | #000000 | Open Sans Medium | ≈ 12,5 | 151 × 29, borda 1 px cinza, raio ≈ 4 |
| Setas dos carrosséis | — | preto (cursos) / branco (depoimentos) | — | ícone ≈ 25 px de largura | área de hover ≈ 40 × 40, raio ≈ 4 |
| H2 "Impacto transformador" | — | #000000 | Open Sans **Bold** | ≈ 34 (maiúscula 24), passo 39 | 2 linhas |
| Texto do Impacto | — | #000000 | Open Sans Regular | ≈ 15 (maiúscula 11), passo 21 | 4 linhas |
| Números das estatísticas | — | #000000 | Open Sans Regular | ≈ 46 (altura do dígito 33) | uma por linha |
| Rótulos das estatísticas | — | #000000 | Open Sans SemiBold | ≈ 14 | alinhados à direita |
| Divisores das estatísticas | linha 1 px ≈ #E1E1E1 | — | — | — | altura de cada linha ≈ 75 |
| Ícone de benefício | caixa #FCECED | traço vermelho (≈ #C3212C, antialiased) | — | — | 40 × 40, raio ≈ 5; ícone ≈ 20 px |
| Título de benefício | — | #000000 | Open Sans Bold | ≈ 13 | — |
| Texto de benefício | — | ≈ #545454 | Open Sans Regular | ≈ 11 (passo 18) | 3 linhas |
| Seção Depoimentos / CTA | #880002 | — | — | — | altura total 1601→2567 |
| Rótulo "DEPOIMENTOS" | — | #FFFFFF (≈ 90%) | Open Sans Medium, CAIXA ALTA | ≈ 9 | — |
| H2 "Quem fez recomenda" | — | #FFFFFF | Open Sans **Bold** | ≈ 40 | — |
| Card de depoimento | #C3212C | texto ≈ #FFEEE9 | — | — | 224 × ≈ 322, raio ≈ 5, padding ≈ 19; nome e estrelas ancorados na base |
| Texto do depoimento | — | branco | Open Sans Regular | ≈ 13,5 (passo 21) | aspas curvas “ ” |
| Nome | — | branco | Open Sans **Bold** | ≈ 11,5 | — |
| Cargo | — | branco ≈ 70% (≈ #FFABAE medido) | Open Sans Regular | ≈ 10,5 | — |
| Estrelas | — | branco | — | 5 por card, ≈ 12 px cada | — |
| CTA: título | — | #FFFFFF | Open Sans **Bold** | ≈ 40 (passo 39) | 3 linhas |
| CTA: texto | — | ≈ #FFEDE3 | Open Sans Regular | ≈ 14 (passo 21) | 4 linhas |
| CTA: botão "Matricule-se" | #FFFFFF | #000000 | Open Sans Medium | ≈ 13 | 130 × 32, raio ≈ 5 |
| CTA: thumbnail | foto escurecida | — | — | — | 609 × 342, raio ≈ 6; play: círculo branco ≈ 65 px, triângulo preto |
| Footer | #1E0200 | títulos ≈ #FFFBF4; links ≈ #A58D89; e-mail/endereço ≈ #FFFAF4 | Open Sans; títulos Bold CAIXA ALTA ≈ 10; links Regular ≈ 11,5 | — | passo de links ≈ 24,5; copyright ≈ #AD9C95 |

Espaçamento entre blocos (px do print): fim do hero → centro do título da seção ≈ 74; centro do título → topo dos cards ≈ 52; fim dos cards → botões ≈ 32; botões → Impacto ≈ 115; Impacto/benefícios → Depoimentos ≈ 54; cards de depoimento → setas ≈ 46; setas → CTA ≈ 72; CTA → footer ≈ 53. Gap entre cards: 14.

Não identificado: valores exatos de raio, sombra (offset/blur/opacidade) e opacidades — só dá para estimar pelo print.

## 4. Componentes repetidos

### Card de curso (7 itens no carrossel: 6 cursos + 1 card de link)

Campos, em ordem vertical: foto de fundo com degradê → tag de categoria (ícone + texto em caixa alta, canto superior esquerdo) → título (bold, 3–4 linhas) → descrição (2–4 linhas). Não há botão, carga horária, modalidade, status ou preço visíveis no card.

| # | Tag | Título | Descrição | Foto |
|---|---|---|---|---|
| 1 | MATEMÁTICA | Matemática para a Precisão: Medidas e Escalas na Metalurgia | Aplicação de grandezas, proporções e escalas em processos de corte, furação e usinagem. | paquímetro/medição em tons laranja |
| 2 | MATEMÁTICA | Geometria e Modelagem no Design Têxtil | Explora formas geométricas, simetria e padrões matemáticos presentes em tecidos e estampas. | pilhas de tecidos coloridos |
| 3 | MATEMÁTICA | Estatística e Controle de Qualidade na Produção | Leitura e interpretação de dados de controle de qualidade e produtividade. | tablet com gráficos e braço robótico |
| 4 | CIÊNCIAS DA NATUREZA | Física do Movimento e da Energia na Metalurgia | Estudo de forças, atrito, calor e energia em máquinas, fornos e prensas. | solda com faíscas |
| 5 | CIÊNCIAS DA NATUREZA | Química e Sustentabilidade | Estudo das reações químicas envolvidas na tinturaria e acabamento de tecidos. | balão de laboratório |
| 6 | CIÊNCIAS DA NATUREZA | Ciência dos Materiais na Metalurgia | Conceitos básicos de estrutura, resistência e propriedades dos metais. | engrenagem metálica / mangueira |
| 7 | — | **Todos os cursos →** (card branco, só texto e seta) | — | — |

Estados observados:
- **Hover**: o card sobe ≈ 7 px do print e a sombra fica mais forte.
- **Ativo/desabilitado**: não observados.

### Card de depoimento (5 itens)

Ordem: aspas + texto → nome (bold) → cargo → 5 estrelas.

| # | Texto | Nome | Cargo |
|---|---|---|---|
| 1 | “A experiência do curso foi incrível! As aulas foram muito bem estruturadas e o cronograma foi cuidadosamente planejado, facilitando muito o aprendizado.” | Lucas Pereira | Analista na Empresa X |
| 2 | “Concluir o curso foi uma jornada enriquecedora. As aulas eram dinâmicas e o horário foi organizado para maximizar nosso tempo de estudo.” | Mariana Costa | Gestora na Empresa X |
| 3 | “O curso superou minhas expectativas! As aulas eram bem elaboradas e o planejamento do horário ajudou a manter o foco e a produtividade.” | Thiago Almeida | Técnico na Empresa X |
| 4 | “Finalizar o curso foi uma experiência motivadora. As aulas foram muito bem preparadas e o cronograma foi ideal para o aprendizado.” | Fernanda Silva | Analista na Empresa X |
| 5 | “A conclusão do curso foi uma etapa muito gratificante. As aulas eram bem organizadas e o horário foi pensado para facilitar nosso aprendizado.” | Gabriel Santos | Analista na Empresa X |

### Benefício (3 itens) e estatística (4 itens)
Descritos nas seções 2 e 3.

## 5. Assets

| Onde aparece | Arquivo provável | Observação |
|---|---|---|
| Logo no header sobre o hero (branco) | `logo-sesi-industria-white.svg` | provável |
| Logo no header rolado (vermelho) | `logo-sesi-industria-primary.svg` | provável |
| Logo no footer (coluna 1) | `logo-sesi-industria-white.svg` | provável |
| "SESI" pequeno no copyright | `logo-sesi.svg` | provável (variante cinza/clara; cor exata não identificada) |
| Foto do hero | `hero-image.png` | provável |
| Thumbnail do vídeo do CTA | `video-thumb.png` | provável |
| Setas dentro dos botões (→) | `arrow-navigation.svg` | provável |
| Setas dos carrosséis (← →) | `arrow-navigation.svg` / `arrow-navigation-1.svg` | provável; qual é qual não identificado |
| Ícone da tag Matemática | `icon-matematica-20px.svg` | provável |
| Ícone da tag Ciências da Natureza | `icon-ciencias-natureza-20px.svg` | provável |
| Ícones de benefício (certificação, professores, suporte) | `01-certificacao-red.svg`, `02-professores-red.svg`, `03-suporte-red.svg` | provável (variante red, caixa rosada) |
| Estrelas | `star.svg` | provável |
| Ícones sociais | `icon-linkedIn-24px.svg`, `icon-instagram-24px.svg`, `icon-facebook-24px.svg` | na ordem LinkedIn, Instagram, Facebook |
| 6 fotos dos cards de curso | **não estão na lista** | caliper (também usado como `banner-ava.png` no AVA), tecidos, tablet, solda, balão, engrenagem |
| Botão play (círculo branco + triângulo) | **não está na lista** | |
| Ícones `icon-linguagens-20px.svg`, `icon-sustentabilidade-20px.svg`, `add_2.svg`, `remove.svg`, `04-flexibilidade-bege.svg` | não aparecem nesta tela | |

(Os nomes dos arquivos de benefício seguem o padrão da lista; o número/ordem exatos de cada arquivo não foram verificados.)

## 6. Responsividade

Só existe a versão **desktop** no protótipo. Não há frames de tablet ou mobile nos 3 fluxos. O canvas do arquivo (que poderia ter outras páginas/frames) não foi acessível sem login: **não identificado**.

## 7. Interações (testadas por clique)

| Elemento | Resultado |
|---|---|
| Logo do header | sem navegação visível (já está na landing) |
| Início | volta ao topo da landing (a partir de Detalhes → Landing; na landing não houve mudança testável) |
| Cursos | rola suavemente até "Principais cursos" |
| Sobre | nenhuma ação observada |
| Área do aluno | nenhuma ação; hover muda o fundo para cinza claro |
| Conhecer cursos (hero) | rola até "Principais cursos" |
| Card de curso nº 1 (Matemática para a Precisão) | navega para **02. Detalhes curso** |
| Cards nº 5 (Química e Sustentabilidade) e "Todos os cursos" | nenhuma ação observada |
| Cards 2, 3, 4 e 6 | não testados individualmente |
| Ver todos os cursos | navega para **02. Detalhes curso** |
| Setas do carrossel de cursos | → desloca o carrossel até o fim (mostra cards 5, 6 e "Todos os cursos"); ← volta ao início; deslocamento animado |
| Setas do carrossel de depoimentos | → desloca até o fim (mostra o card 5 inteiro; um segundo clique não muda mais nada); ← não testada |
| Botão Matricule-se (CTA) | navega para **02. Detalhes curso** |
| Play do vídeo (CTA) | nenhuma ação observada (sem player) |
| Links do footer (testado "Início"), ícones sociais | nenhuma ação observada (não testei todos) |
| Busca, filtros, abas | não existem nesta tela |

Observação: o estado dos carrosséis de depoimentos é compartilhado entre Landing e Detalhes (ao abrir Detalhes depois de avançar na Landing, o carrossel de lá já aparecia deslocado).

## Prints (pasta `prints/01-landing`)

Rolagem em partes sequenciais de ~326 px do print cada (4 passos de rolagem). Resolução disponível: 1568 × 726 JPEG (máximo que a captura entrega).

- `01-landing-01-hero.jpg`
- `01-landing-02-principais-cursos.jpg`
- `01-landing-03-impacto-transformador.jpg`
- `01-landing-04-beneficios.jpg`
- `01-landing-05-depoimentos.jpg`
- `01-landing-06-depoimentos-cta.jpg`
- `01-landing-07-cta-pronto-para-transformar.jpg`
- `01-landing-08-rodape.jpg`
- `01-landing-09-carrossel-cursos-fim.jpg`
- `01-landing-10-cards-5-6-e-todos-os-cursos-hover.jpg` (mostra o hover do card 5)
- `01-landing-11-carrossel-depoimentos-fim.jpg`
