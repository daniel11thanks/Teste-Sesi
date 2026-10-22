# 03. AVA — extração do protótipo Figma "[TEST DEV] SESI Indústria"

Fonte: protótipo público (`node-id=6017-1042`), visto no Chrome. Mesmas regras dos outros fluxos: sem Dev Mode, textos literais, hex medidos por pixel (±3), medidas em **px do print**. Tamanho do frame em px de design: **não identificado**.

## 8. Layout do frame

| Item | Valor |
|---|---|
| Janela visível no print | 1133 × 627 px do print (x 217→1350, y 49→676). É um pouco mais larga que Landing/Detalhes (1117) |
| Altura rolável | só a área de conteúdo rola: ≈ 292 px do print de rolagem (total ≈ 919). O menu lateral fica **fixo** |
| Sidebar | 163 px de largura (x 217→380), altura total da janela |
| Área de conteúdo | x 380→1350 (970); coluna de texto x 488→1242 (754), margens internas ≈ 108 de cada lado |

## 1. Estrutura

1. **Sidebar fixa** (x 217→380), de cima para baixo:
   1. Barra superior com seta ← (y 49→80, 31 de altura).
   2. Bloco escuro do curso (y 80→211): rótulo, título (4 linhas).
   3. Faixa de progresso (y 211→250): trilho + 10%.
   4. Campo de busca (y 264→287).
   5. Lista do curso: "1. Introdução" com 3 subitens, depois "2. Módulo 1" a "7. Módulo 6".
2. **Conteúdo** (rola):
   1. Banner com foto (y 82→207, 125 de altura).
   2. Título "Boas práticas" + 3 parágrafos.
   3. Título "Recomendações" + 4 parágrafos.

Não há header no topo, rodapé, nem botões de "próxima aula" visíveis. Na base da rolagem aparece um elemento escuro de ≈ 35 px de largura cortado pela borda do frame (x 488→523, y 676): provável início de um botão ou controle, **não identificado**.

## 2. Textos (literais, na ordem)

**Sidebar**
- Rótulo: `CERTIFICAÇÃO`
- Título: `Matemática para a Precisão: Medidas e Escalas na Metalurgia`
- Progresso: `10%`
- Busca: campo vazio, **sem placeholder visível** (placeholder: não identificado)
- Lista:
  - `1. Introdução`
    - `1.1 Introdução` — ícone de check preenchido (concluído)
    - `1.2 Boas práticas` — ícone de play em círculo (item atual)
    - `1.3 Extras` — círculo vazio (não iniciado)
  - `2. Módulo 1`
  - `3. Módulo 2`
  - `4. Módulo 3`
  - `5. Módulo 4`
  - `6. Módulo 5`
  - `7. Módulo 6`

**Conteúdo**
- Título (H2): `Boas práticas`
- Parágrafo 1: `Se você está interessado em se aprofundar em Matemática para a Precisão, especialmente em Medidas e Escalas na Metalurgia, aqui estão algumas dicas para maximizar sua experiência online. Primeiro, crie um espaço de estudo livre de distrações, onde você possa se concentrar totalmente no material.`
- Parágrafo 2: `Estabeleça uma rotina de estudos, reservando horários específicos para assistir às aulas e realizar as atividades. Além disso, interaja com seus colegas e instrutores nos fóruns e chats disponíveis, pois isso enriquece o aprendizado e ajuda a esclarecer dúvidas. Não se esqueça de revisar o conteúdo regularmente e aplicar os conhecimentos em situações práticas sempre que possível.`
- Parágrafo 3: `Por fim, mantenha-se atualizado sobre as novas técnicas e normas em medidas e escalas na metalurgia, já que essa área está sempre evoluindo. Com dedicação e as estratégias corretas, você estará preparado para se destacar no setor!`
- Título (H2): `Recomendações`
- Parágrafo 4: `Se você está interessado em se aprofundar na matemática aplicada à metalurgia, aqui estão algumas dicas valiosas. Primeiro, escolha um curso que ofereça uma abordagem prática, com aulas que incluam exercícios e estudos de caso. Isso ajudará a entender como aplicar medidas e escalas na prática. Além disso, verifique se o curso é reconhecido por instituições relevantes, pois isso pode impactar sua formação e carreira.`
- Parágrafo 5: `Outro aspecto importante é a experiência dos instrutores. Procure cursos que tenham profissionais com experiência no setor, pois eles podem compartilhar insights valiosos que vão além da teoria.`
- Parágrafo 6: `Considere também a carga horária e a flexibilidade do curso. Se você trabalha, um curso que ofereça aulas noturnas ou aos finais de semana pode ser mais conveniente.`
- Parágrafo 7: `Por fim, não se esqueça de se conectar com outros alunos e profissionais da área. Isso pode abrir portas e proporcionar um aprendizado ainda mais enriquecedor. Investir em um bom curso de matemática para a metalurgia é essencial para garantir precisão e eficiência no trabalho.`

Botões e links no conteúdo: nenhum visível. Rodapé: não existe.

## 3. Estilo (px do print; hex medidos)

| Elemento | Fundo | Texto | Fonte / peso | Tamanho estimado | Outros |
|---|---|---|---|---|---|
| Sidebar, barra superior | ≈ #151314 | seta branca | — | seta ≈ 12 px | altura 31 |
| Sidebar, bloco do curso | #0C0C0C | branco | — | — | padding esquerdo ≈ 13 |
| Rótulo CERTIFICAÇÃO | — | ≈ #949494 | Open Sans Medium, CAIXA ALTA | ≈ 8 | — |
| Título do curso | — | #FFFFFF | Open Sans **Bold** | ≈ 14 (maiúscula 10), passo 21 | 4 linhas |
| Trilho de progresso | #444444 | — | — | — | 111 × ≈ 5, raio total; preenchimento branco ≈ 14 px (≈ 10%) |
| Texto "10%" | — | #FFFFFF | Open Sans Regular | ≈ 8 | à direita do trilho |
| Campo de busca | #FFFFFF, borda 1 px cinza claro | — | — | — | 137 × 23, raio total (pílula), ícone de lupa à direita (x 352, ≈ 11 px) |
| Lista da sidebar | #FFFFFF | #000000 | Open Sans **Bold** nos itens "N. ..."; **Regular** nos subitens | itens ≈ 12; subitens ≈ 11 | passo dos subitens 31; passo dos módulos ≈ 32,6; divisores 1 px ≈ #E1E1E1 |
| Divisor vertical sidebar/conteúdo | 1 px ≈ #CECECE | — | — | — | em x 379 |
| Conteúdo | #FFFFFF | — | — | — | — |
| Banner | foto | — | — | — | 754 × 125, raio ≈ 5; logo "SESI" branco pequeno no canto superior esquerdo (≈ 45 px de largura) |
| H2 | — | #000000 | Open Sans **Bold** | ≈ 20 (maiúscula 14) | — |
| Parágrafos | — | #000000 | Open Sans Regular | ≈ 14 (maiúscula 10), passo 21,3 | blocos separados por ≈ 21 px; título → 1º parágrafo ≈ 36 |

Estados vistos na sidebar: concluído (check preenchido), atual (play em círculo), não iniciado (círculo vazio). Hover/ativo dos módulos: não observados. Cores dos ícones de estado: pretas.

## 4. Componentes repetidos

- **Item de módulo da sidebar**: linha de 32,6 de altura com texto em negrito e divisor. 6 itens (Módulo 1 a 6) + o grupo "1. Introdução". Sem ícone de expandir/recolher visível; conteúdo interno dos módulos: **não identificado**.
- **Subitem de aula**: ícone de estado + rótulo, 3 itens (1.1, 1.2, 1.3).
- Não há cards, tags, carga horária, modalidade ou status de curso nesta tela (só o percentual de progresso: 10%).

## 5. Assets

| Onde aparece | Arquivo provável | Observação |
|---|---|---|
| Banner do topo do conteúdo | `banner-ava.png` | provável (foto do paquímetro) |
| "SESI" branco sobre o banner | `logo-sesi.svg` ou parte do `banner-ava.png` | não identificado |
| Seta ← da sidebar | `arrow-navigation-1.svg` (ou `arrow-navigation.svg`) | provável; qual: não identificado |
| Lupa da busca | **não está na lista** | |
| Ícones de estado (check, play em círculo, círculo vazio) | **não estão na lista** | |

## 6. Responsividade

Só desktop. Sem versão tablet/mobile: **não identificado** (o canvas não foi acessível).

## 7. Interações (testadas por clique)

| Elemento | Resultado |
|---|---|
| Seta ← (topo da sidebar) | navega para **02. Detalhes curso** (mantém a rolagem e os acordeões abertos) |
| "2. Módulo 1" | nenhuma ação observada |
| "1.3 Extras" | nenhuma ação observada |
| Campo de busca | nenhuma mudança visível ao clicar (digitação não testada) |
| Demais itens (1.1, 1.2, Módulos 2 a 6) | não testados individualmente |
| Rolagem | só o conteúdo rola; a sidebar fica fixa |
| Acordeões, abas, carrossel, player, filtros | não existem nesta tela |

Chega-se ao AVA por: Detalhes → "Matricule-se" (hero ou barra fixa).

## Prints (pasta `prints/03-ava`)

- `03-ava-01-topo.jpg` — sidebar + início do conteúdo
- `03-ava-02-fim-do-conteudo.jpg` — conteúdo rolado até o fim (mostra o elemento cortado na base)
