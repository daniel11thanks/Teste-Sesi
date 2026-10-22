# 02. Detalhes curso — extração do protótipo Figma "[TEST DEV] SESI Indústria"

Fonte: protótipo público (`node-id=6017-707`), visto no Chrome. Mesmas regras da Landing: sem Dev Mode, textos literais, hex medidos por pixel (±3), medidas em **px do print** (tamanho do frame em px de design: **não identificado**). Veja `99-paleta-tipografia-globais.md`.

## 8. Layout do frame

| Item | Valor |
|---|---|
| Janela visível no print | 1117 × 627 px do print (x 225→1342, y 49→676) — mesma janela da Landing |
| Altura total rolável | ≈ 2044 px do print com todos os acordeões **fechados** (627 + 1417 de rolagem). Com acordeões abertos fica maior. |
| Container | 940 px do print (x 313→1253), margens ≈ 88/89 (igual à Landing) |
| Rolagem | vertical; header **não** é fixo nesta tela (rola junto); há uma **barra fixa** na base (ver abaixo) |

## 1. Estrutura (y de página, px do print, acordeões fechados)

1. **Header** (0→60), fundo branco, linha inferior 1 px ≈ #E1E1E1. Não acompanha a rolagem.
2. **Hero do curso** (≈ 60→470): 2 colunas.
   - Esquerda (x 313): tag, título (3 linhas), 2 linhas de metadados, botão preto.
   - Direita (x 710→1253, 543 × 306): thumbnail de vídeo com botão play.
3. **Benefícios** (≈ 492→616): 4 colunas em x 313, 553, 793, 1033 (passo 240).
4. **Sobre o curso** (≈ 670→930): 2 colunas. Esquerda: título e texto (x 313→615). Direita (x 664→1253, 589 de largura): 3 acordeões.
5. **Depoimentos** (965→1536): fundo pêssego, mesma estrutura de cards da Landing, mas brancos.
6. **Fale com a gente** (1536→1751): fundo vinho, tudo centralizado.
7. **Footer** (1751→2044): igual ao da Landing.
8. **Barra fixa inferior** (sobre o conteúdo, sempre visível): x 313→1253 (940 de largura), altura 61, a ≈ 15 px acima da borda inferior do frame.

## 2. Textos (literais, na ordem)

**Header**: logo "SESI+INDÚSTRIA" · Início · Cursos · Sobre · Área do aluno

**Hero**
- Tag: `MATEMÁTICA`
- Título: `Matemática para a Precisão: Medidas e Escalas na Metalurgia`
- Metadados: `Início do curso: 05/01/2026` (data em negrito) · `Certificação: SESI` (SESI em negrito)
- Botão: `Matricule-se` + seta →

**Benefícios (4)**
- `Certificação SESI` — `Cursos com a melhor certificação do mercado industrial reconhecidos pelo SESI.`
- `Professores especialistas` — `Contamos com professores reconhecidos por sua excelência no mercado.`
- `Suporte contínuo` — `Você não está sozinho! Acompanhamento online durante todo o curso.`
- `Flexibilidade` — `Turmas presenciais e online com horários que se adaptam à sua rotina.`

**Sobre o curso**
- Título: `Sobre o curso`
- Texto: `Explore nosso curso de Matemática para a Precisão: Medidas e Escalas na Metalurgia, perfeito para quem deseja se destacar nesse campo! Este programa abrangente foi desenvolvido para capacitar profissionais com as habilidades e conhecimentos fundamentais para garantir medições precisas e eficientes no ambiente metalúrgico.`
- Acordeões (títulos): `Módulos` · `Aulas online e avaliações` · `Dúvidas frequentes`

**Acordeão "Módulos"** (títulos de módulo em negrito; itens com marcador •)

1. **1. Introdução à Matemática na Metalurgia**
   - Conceitos fundamentais de medidas e escalas aplicados à metalurgia.
   - Importância da precisão nas medições e controle de qualidade.
   - Panorama das normas e regulamentos no Brasil relacionados à metalurgia.
2. **2. Identificação e Avaliação de Medidas**
   - Tipos de medidas utilizadas: comprimento, massa, volume e temperatura.
   - Técnicas de análise de precisão nas medições.
   - Elaboração de gráficos e tabelas de medidas.
3. **3. Normas e Regulamentações**
   - Estudo das principais normas aplicáveis à metalurgia (ABNT, ISO, entre outras).
   - Interpretação e aplicação prática das normas de medição.
   - Atualizações e impactos legais nas práticas de medição.
4. **4. Instrumentos de Medição**
   - Tipos de instrumentos utilizados na metalurgia: paquímetros, micrômetros e balanças.
   - Critérios de seleção, uso e calibração.
   - Responsabilidades legais de operadores e supervisores.
5. **5. Prevenção de Erros de Medição**
   - Tipos de erros e incertezas nas medições.
   - Procedimentos para garantir a precisão e exatidão.
   - Treinamento prático em técnicas de medição.
6. **6. Ergonomia e Eficiência na Medição**
   - Princípios ergonômicos aplicados ao uso de instrumentos de medição.
   - Prevenção de lesões por uso inadequado de ferramentas.
   - Qualidade de vida no ambiente de trabalho.
7. **7. Análise de Resultados de Medição**
   - Técnicas de análise de dados de medições.
   - Elaboração de relatórios e planos de ação para melhorias.
   - Indicadores de precisão e melhoria contínua.
8. **8. Cultura de Precisão e Comportamento Seguro**
   - Desenvolvimento de uma cultura organizacional voltada à precisão nas medições.
   - Comunicação eficaz e liderança em práticas de medição.
   - Programas de conscientização e engajamento dos colaboradores.
9. **9. Tecnologias Aplicadas à Medição**
   - Uso de plataformas digitais, sensores e automação na medição de precisão.
   - Sistemas de gestão de qualidade.
   - Tendências e inovações no setor metalúrgico.
10. **10. Avaliação Final e Certificação**
    - Teste de conhecimentos adquiridos sobre medidas e escalas.
    - Atividades práticas e estudos de caso.
    - Emissão de certificado digital de conclusão.

**Acordeão "Aulas online e avaliações"**

- **Aulas online** — `As aulas são organizadas em módulos temáticos e disponibilizadas em formato multimídia, combinando:`
  - Vídeo-aulas com especialistas da área, gravadas em alta qualidade e com recursos visuais que facilitam a compreensão dos conteúdos técnicos.
  - Materiais complementares como apostilas digitais, infográficos, artigos e estudos de caso.
  - Atividades interativas, como quizzes, simulações e fóruns de discussão, que promovem o engajamento e a troca de experiências entre os participantes.
  - Acesso multiplataforma, permitindo que os alunos estudem pelo computador, tablet ou celular, a qualquer hora e de qualquer lugar.
  - Parágrafo: `Cada aula é acompanhada de recursos de acessibilidade, como legendas, transcrição de áudio e navegação intuitiva, garantindo inclusão e autonomia para todos os perfis de usuários.`
- **Provas e Avaliações** — `As avaliações são realizadas diretamente na plataforma, com foco na verificação do aprendizado e na aplicação prática dos conhecimentos adquiridos:`
  - Provas objetivas ao final de cada módulo, com correção automática e feedback imediato.
  - Estudos de caso e atividades práticas, que simulam situações reais da indústria e exigem análise crítica e tomada de decisão.
  - Avaliação final integradora, que consolida os conteúdos do curso e valida a competência do aluno para atuar com segurança no ambiente industrial.
  - Sistema antifraude, com controle de tempo, embaralhamento de questões e, opcionalmente, reconhecimento facial para garantir a integridade das avaliações.
  - Parágrafo: `Ao concluir o curso e ser aprovado nas avaliações, o aluno recebe um certificado digital reconhecido, que pode ser compartilhado em redes profissionais e utilizado para comprovação de capacitação técnica.`

**Acordeão "Dúvidas frequentes"** (pergunta em negrito, resposta em cinza)

1. **1. O curso é totalmente online?** — Sim. Todas as aulas, atividades e avaliações são realizadas pela plataforma digital, permitindo que o aluno estude de onde estiver, no seu próprio ritmo.
2. **2. Preciso estar disponível em horários específicos?** — Não. As aulas são gravadas e ficam disponíveis 24 horas por dia. O aluno pode acessar o conteúdo quando for mais conveniente, respeitando os prazos de cada módulo.
3. **3. Como são feitas as avaliações?** — As avaliações são realizadas diretamente na plataforma, por meio de provas objetivas, estudos de caso e atividades práticas. Algumas avaliações podem ter tempo limitado e exigem atenção às instruções.
4. **4. O curso oferece certificado?** — Sim. Ao concluir todos os módulos e ser aprovado nas avaliações, o aluno recebe um certificado digital de conclusão, válido em todo o território nacional.
5. **5. Quem são os professores?** — O corpo docente é formado por especialistas, engenheiros e professores com ampla experiência em segurança do trabalho e atuação direta na indústria. Os perfis dos docentes estão disponíveis na plataforma.
6. **6. Há suporte para dúvidas durante o curso?** — Sim. Os alunos podem enviar dúvidas por meio dos fóruns de discussão, chats da plataforma ou durante os webinários ao vivo. A equipe pedagógica está disponível para auxiliar durante todo o curso.
7. **7. O curso exige algum conhecimento prévio?** — Não é obrigatório, mas é recomendado que o aluno tenha interesse ou alguma familiaridade com o ambiente industrial. O curso foi estruturado para atender tanto iniciantes quanto profissionais em busca de atualização.
8. **8. Posso acessar o curso pelo celular?** — Sim. A plataforma é responsiva e compatível com computadores, tablets e smartphones, garantindo uma experiência completa em qualquer dispositivo.
9. **9. Quanto tempo tenho para concluir o curso?** — O prazo para conclusão varia conforme o plano escolhido. Em geral, o aluno tem entre 3 a 6 meses para finalizar todos os módulos e avaliações.
10. **10. O curso é reconhecido por órgãos oficiais?** — O curso segue as diretrizes das Normas Regulamentadoras (NRs) e boas práticas da área, sendo reconhecido como formação complementar. Para certificações oficiais, é necessário verificar os requisitos específicos de cada órgão regulador.

**Depoimentos**
- Rótulo: `DEPOIMENTOS` · Título: `Quem fez recomenda`
- Os 5 depoimentos são **os mesmos** da Landing (Lucas Pereira, Mariana Costa, Thiago Almeida, Fernanda Silva, Gabriel Santos), com os mesmos textos e cargos. Veja `01-landing-page.md`.

**Fale com a gente**
- Rótulo: `PRECISA DE AJUDA PARA DECIDIR?`
- Título: `Fale com a gente`
- Botão: `Mandar uma mensagem` + seta →

**Barra fixa inferior**
- Texto: `Matemática para a Precisão: Medidas e Escalas na Metalurgia`
- Botão: `Matricule-se` + seta →

**Footer**: igual à Landing (coluna 1: logo, `contato@sesindustria.com.br`, `Av. Paulista, 1313`; colunas NAVEGAÇÃO, CURSOS POPULARES, SUPORTE; base com "Todos os direitos reservados." e ícones sociais). Nesta tela a barra fixa cobre parte do footer quando a rolagem está no fim; as colunas e a linha de copyright foram lidas na Landing.

## 3. Estilo (px do print; hex medidos)

| Elemento | Fundo | Texto | Fonte / peso | Tamanho estimado | Outros |
|---|---|---|---|---|---|
| Header | #FFFFFF | #000000 | Open Sans Regular/Medium | links ≈ 13 | altura 60, borda inferior 1 px ≈ #E1E1E1; logo vermelho |
| Tag "MATEMÁTICA" | ≈ #FAD19A (medido #F5D2A3 nesta tela, diferença de compressão) | ≈ #000000 | Open Sans Medium, CAIXA ALTA | ≈ 10 | 89 × 22, raio ≈ 3, ícone 12 px |
| H1 | — | #000000 | Open Sans **Bold** | ≈ 32 (maiúscula 23), passo 39 | 3 linhas |
| Metadados | — | #181818; valores em Bold | Open Sans Regular + Bold | ≈ 13 (passo 26) | ícones 12 px (calendário, medalha) |
| Botão "Matricule-se" (hero) | #0C0C0C | #FFFFFF | Open Sans Medium | ≈ 13 | 130 × 32, raio ≈ 5, seta à direita |
| Thumbnail do vídeo | foto escurecida | — | — | — | 543 × 306, raio ≈ 6; play: círculo branco ≈ 65 px, triângulo preto |
| Ícone de benefício | caixa #FBD19B | traço preto | — | — | 40 × 40, raio ≈ 5 |
| Título de benefício | — | #000000 | Open Sans Bold | ≈ 13 | — |
| Texto de benefício | — | ≈ #4D4D4D | Open Sans Regular | ≈ 11 (passo 18) | — |
| H2 "Sobre o curso" | — | #000000 | Open Sans **Bold** | ≈ 34 (maiúscula 24) | — |
| Texto "Sobre o curso" | — | #000000 | Open Sans Regular | ≈ 14 (passo 21) | 8 linhas, coluna de ≈ 300 px |
| Título do acordeão | — | #000000 | Open Sans **Bold/SemiBold** | ≈ 20 (maiúscula 14) | linha de 52 de altura, linha inferior 1 px ≈ #E1E1E1 |
| Ícone do acordeão | — | #000000 | — | ≈ 14 px, à direita (x 1243) | "+" fechado; "−" aberto (a fonte do título fica um pouco mais leve quando aberto) |
| Conteúdo do acordeão | — | títulos de item #000000 Bold ≈ 15; texto ≈ #545454 Regular ≈ 13; marcador • | — | passo ≈ 21 | blocos separados por ≈ 21 px |
| Seção Depoimentos | ≈ #FCD19C | — | — | — | altura 965→1536 |
| Card de depoimento | #FFFFFF | #000000 | igual à Landing | — | mesmo tamanho (224 × 322), sombra leve; estrelas pretas |
| Seção "Fale com a gente" | #880002 | branco | — | — | altura 215 |
| Rótulo | — | branco | Open Sans Medium CAIXA ALTA | ≈ 9 | centralizado |
| H2 "Fale com a gente" | — | #FFFFFF | Open Sans **Bold** | ≈ 40 | centralizado |
| Botão "Mandar uma mensagem" | #FFFFFF | #000000 | Open Sans Medium | ≈ 13 | 207 × 32, raio ≈ 5 |
| Barra fixa | #0C0C0C | #FFFFFF | Open Sans Medium | ≈ 13,5 | 940 × 61, raio ≈ 8, padding ≈ 19; botão branco 130 × 36 à direita (texto #000) |
| Footer | #1E0200 | igual à Landing | — | — | — |

Não identificado: sombras exatas, raios exatos, tamanho em px de design.

## 4. Componentes repetidos

- **Benefícios**: 4 itens (ícone + título + texto) — ver seção 2.
- **Acordeão**: 3 itens. Cabeçalho (título + ícone +/−) e conteúdo. **Os acordeões são independentes**: abrir um não fecha os outros (testado com os três abertos ao mesmo tempo). Estado padrão: todos fechados.
- **Depoimentos**: 5 cards, mesmos da Landing, versão clara (fundo branco, texto preto, estrelas pretas).
- **Cards de curso**: não existem nesta tela. Carga horária, modalidade e status do curso: não aparecem (só data de início e certificação).

## 5. Assets

| Onde aparece | Arquivo provável | Observação |
|---|---|---|
| Logo do header (vermelho) | `logo-sesi-industria-primary.svg` | provável |
| Logo do footer | `logo-sesi-industria-white.svg` | provável |
| "SESI" pequeno no copyright | `logo-sesi.svg` | provável |
| Ícone da tag Matemática | `icon-matematica-20px.svg` | provável |
| Thumbnail do vídeo | `video-thumb.png` | provável |
| Setas dos botões | `arrow-navigation.svg` | provável |
| Setas dos carrosséis | `arrow-navigation.svg` / `arrow-navigation-1.svg` | qual é qual: não identificado |
| Ícones dos 4 benefícios | `01-certificacao-bege.svg`, `02-professores-bege.svg`, `03-suporte-bege.svg`, `04-flexibilidade-bege.svg` | provável (caixa pêssego = variante "bege"); os nomes exatos dos três primeiros seguem o padrão da lista, não verificados |
| "+" dos acordeões | `add_2.svg` | provável |
| "−" dos acordeões | `remove.svg` | provável |
| Estrelas | `star.svg` | provável |
| Ícones sociais | `icon-linkedIn-24px.svg`, `icon-instagram-24px.svg`, `icon-facebook-24px.svg` | |
| Ícones dos metadados (calendário e medalha, 12 px) | **não estão na lista** | |
| Botão play | **não está na lista** | |

## 6. Responsividade

Só desktop. Não há versão tablet/mobile neste fluxo (nem nos outros); o canvas completo não foi acessível: **não identificado**.

## 7. Interações (testadas por clique)

| Elemento | Resultado |
|---|---|
| Logo | nenhuma ação observada na landing; não testado aqui |
| Início | navega para **01. Landing page** (topo) |
| Cursos, Sobre, Área do aluno | não testados aqui (na Landing: Cursos rola até Principais cursos; Sobre e Área do aluno sem ação) |
| Botão Matricule-se (hero) | navega para **03. AVA** |
| Botão Matricule-se (barra fixa) | navega para **03. AVA** |
| Play do vídeo | nenhuma ação observada |
| Acordeões (Módulos, Aulas online e avaliações, Dúvidas frequentes) | clique no cabeçalho abre/fecha; o ícone vira "−"; o conteúdo empurra o que vem abaixo; independentes entre si |
| Setas do carrossel de depoimentos | não testadas nesta tela (o estado do carrossel é compartilhado com a Landing) |
| Mandar uma mensagem | nenhuma ação observada |
| Links do footer (testado "Início") | nenhuma ação observada |
| Retorno do AVA (seta ←) | volta para esta tela, mantendo a posição de rolagem e os acordeões abertos |

## Prints (pasta `prints/02-detalhes-curso`)

- `02-detalhes-00-topo-recarregado.jpg`, `02-detalhes-01-hero.jpg`
- `02-detalhes-02-beneficios-sobre-o-curso.jpg`
- `02-detalhes-03-depoimentos-inicio.jpg`, `02-detalhes-04-depoimentos.jpg`
- `02-detalhes-05-fale-com-a-gente-rodape.jpg`, `02-detalhes-06-fim-da-pagina.jpg`
- `02-detalhes-07` a `09`: acordeão Módulos aberto (módulos 1–10)
- `02-detalhes-10` a `12`: acordeão Aulas online e avaliações aberto
- `02-detalhes-13` a `16`: acordeão Dúvidas frequentes aberto (perguntas 1–10)
