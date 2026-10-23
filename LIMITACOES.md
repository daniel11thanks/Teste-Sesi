# Limitações e itens não concluídos

Entregável 9 da atividade prática. Este arquivo resume as limitações, os itens não concluídos e as diferenças em relação ao Figma; os detalhes e as justificativas completas estão na seção 12 do [README.md](README.md).

## Itens não concluídos / fora do escopo

| Item | Situação |
|---|---|
| Cadastro, edição e exclusão de cursos | **Não feito** — o enunciado dispensa. Um painel administrativo seria a evolução natural. |
| Integração com o Moodle | **Parcial.** Só há uma **exportação em CSV** (`GET /api/cursos/exportacao/moodle.csv`, ver README 7.1): sem conexão com um Moodle em execução, **não testada em um Moodle real** e sem exportar módulos, aulas e FAQ. Não está no front-end porque a aplicação é a área do aluno e exportar é uma tarefa administrativa; a rota é aberta porque o enunciado não prevê login |
| Teste manual com **leitor de tela real** | **Feito.** Teste exploratório com o **Narrador do Windows** (Tab, títulos, campos e setas), que leu o conteúdo percorrido sem problemas relatados. A execução item a item do roteiro ([docs/teste-leitor-de-tela.md](docs/teste-leitor-de-tela.md)) não foi registrada e não houve teste com NVDA nem VoiceOver. Há ainda a conferência automática da árvore de acessibilidade e a auditoria axe-core (0 violações). |
| Desempenho no celular (Lighthouse) | **Parcial.** Páginas inicial e catálogo em 75 e 86 de desempenho no celular simulado (LCP de 4 a 5 s); o restante ficou em 99 ou 100. Melhorar exigiria alterar o carregamento da imagem do topo e arriscaria o visual do Figma. **Decisão:** o custo-benefício não compensa, pois a simulação usa uma rede 4G bem lenta, o carregamento real já é bom (desktop em 98 ou 99) e o ganho seria pequeno diante do risco de alterar o visual (ver README 5.4) |
| Pipeline de integração contínua (CI) | **Feito** (GitHub Actions: testes do back-end, lint e build do front-end e testes de interface/acessibilidade contra a aplicação em Docker). Limite: não faz deploy, que continua sendo do autoDeploy do Render, e o resultado do CI não bloqueia esse deploy |
| Testes unitários do front-end | **Feitos** (Vitest, 68 testes: utilitários, API, hooks, componentes básicos e a página do catálogo). Limite: o carrossel, a página inicial, a de detalhes e o AVA só têm teste de interface (Puppeteer), não unitário |

## Limitações conhecidas

- **AVA ilustrativo:** os itens do menu (aulas e módulos) não são navegáveis (o protótipo também não define essa navegação), o progresso (10%) é fixo e há apenas o conteúdo da aula “Boas práticas”.
- **Sem autenticação e sem matrícula real:** “Matricule-se” e “Área do aluno” levam ao AVA de demonstração.
- **Vídeo:** a miniatura com botão de reprodução é decorativa; não há player.
- **Pesquisa** apenas pelo nome do curso (completo ou breve); sem paginação nem ordenação (o volume é pequeno).
- **Páginas de apoio inexistentes:** Termos de Uso, Política de Privacidade, Blog etc. não têm conteúdo (os links levam a páginas existentes).
- **Banco SQLite:** adequado a este volume e a uma instância; não indicado para várias réplicas ou escrita concorrente. No plano gratuito do Render é recriado (com o seed) a cada início.
- **Hospedagem gratuita hiberna** após alguns minutos sem acessos; a primeira resposta seguinte pode levar cerca de um minuto. Em caso de indisponibilidade, a solução roda localmente com `docker compose up --build` (ver README).
- **Dados 100% fictícios**, inclusive depoimentos, estatísticas e endereços.

## Diferenças em relação ao Figma (resumo)

| Diferença | Justificativa |
|---|---|
| Tela de catálogo (`/cursos`) e página 404 não existem no Figma | O enunciado exige listar, pesquisar e filtrar e prevê estados de erro; criadas com o mesmo visual |
| Sem layouts de tablet/celular no Figma | Responsividade definida por conta própria (README, seção 9) |
| Cards dos cursos 2 a 8 com **ilustrações SVG** em vez de fotos | As fotos dos cards **não foram fornecidas** nos arquivos do teste (só a do curso 1) |
| Campos extras (descrição, status, carga horária, modalidade, público-alvo) nos cards do catálogo e no bloco “Informações do curso” da página de detalhes, que é uma **faixa no fim da seção “Sobre o curso”**, abaixo das duas colunas | O enunciado pede esses campos em cada curso e o protótipo não os mostra. O topo da página de detalhes ficou idêntico ao Figma, e a faixa foi colocada abaixo das colunas porque a coluna do texto é fixa na rolagem (como no Figma) e precisa ser curta para caber na tela |
| Coluna “Sobre o curso” fixa na rolagem (como no Figma) | Reproduzida apenas em telas largas e altas (a partir de 960 px de largura e 640 px de altura); em celular, tablet e janelas baixas a coluna rola junto, para o texto não ficar cortado |
| Pequena margem (18 px) depois do último card dos carrosséis | No Figma o último card encosta na borda direita da tela; na aplicação ele para a 18 px dela, a mesma distância que há entre os cards, para não ficar colado na janela |
| Matrícula desabilitada para cursos “Em breve” e “Encerrado” | Regra de negócio que o protótipo não prevê |
| Barra preta flutuante de matrícula (página de detalhes do curso): espaço extra no rodapé | No Figma, no fim da página a barra fixa passa por cima do conteúdo do rodapé e o esconde. Na aplicação o rodapé ganha um recuo (espaço extra embaixo) só nessa página, para a barra **não ficar em cima das informações do rodapé**; o foco do teclado também não fica atrás dela |
| Destinos de links sem ação no protótipo (Área do aluno, Sobre etc.) | Apontados para páginas existentes ou âncoras |
| AVA: busca no menu, menu recolhível no celular e texto da aula parametrizado. O menu mostra no máximo 6 módulos (como o Figma); cursos com mais módulos listam todos só na página de detalhes | Necessário para servir a qualquer curso |
| Container de conteúdo com largura máxima (1212 px) | O Figma escala o quadro com a janela |
| Medidas e cores aproximadas (extraídas de prints; frame de 1440 px assumido) | O Dev Mode do Figma não estava acessível; o hero foi calibrado pixel a pixel e as demais seções por comparação lado a lado com os prints (pode haver diferenças de poucos pixels) |
| Cores das etiquetas “Linguagens” e “Sustentabilidade”; favicon; fotos em WebP | Não constam no protótipo / otimização de 2,6–3,8 MB para 22–99 KB |
