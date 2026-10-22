# Limitações e itens não concluídos

Entregável 9 da atividade prática. Este arquivo resume as limitações, os itens não concluídos e as diferenças em relação ao Figma; os detalhes e as justificativas completas estão na seção 12 do [README.md](README.md).

## Itens não concluídos / fora do escopo

| Item | Situação |
|---|---|
| Cadastro, edição e exclusão de cursos | **Não feito** — o enunciado dispensa. Um painel administrativo seria a evolução natural. |
| Integração com o Moodle | **Não feita** — o enunciado dispensa (diferencial). |
| Teste manual com **leitor de tela real** | **Feito em parte.** Teste exploratório com o **Narrador do Windows** (Tab, títulos, campos e setas), que leu o conteúdo percorrido sem problemas relatados. A execução item a item do roteiro ([docs/teste-leitor-de-tela.md](docs/teste-leitor-de-tela.md)) não foi registrada e não houve teste com NVDA nem VoiceOver. Há ainda a conferência automática da árvore de acessibilidade e a auditoria axe-core (0 violações). |
| Pipeline de integração contínua (CI) | **Não feito** — os testes são executados manualmente. |
| Testes unitários de componentes React isolados | **Não feitos** — a cobertura do front-end é de interface, de ponta a ponta. |

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
| Campos extras (status, carga horária, modalidade, público-alvo) em cards e detalhes | Exigidos pelo enunciado e ausentes no protótipo |
| Matrícula desabilitada para cursos “Em breve” e “Encerrado” | Regra de negócio que o protótipo não prevê |
| Barra de matrícula não cobre o rodapé | Evita conteúdo escondido (acessibilidade) |
| Destinos de links sem ação no protótipo (Área do aluno, Sobre etc.) | Apontados para páginas existentes ou âncoras |
| AVA: um item de menu por módulo do curso, busca no menu e menu recolhível no celular; texto da aula parametrizado | Necessário para servir a qualquer curso |
| Container de conteúdo com largura máxima (1212 px) | O Figma escala o quadro com a janela |
| Medidas e cores aproximadas (extraídas de prints; frame de 1440 px assumido) | O Dev Mode do Figma não estava acessível; o hero foi calibrado pixel a pixel e as demais seções por comparação lado a lado com os prints (pode haver diferenças de poucos pixels) |
| Cores das etiquetas “Linguagens” e “Sustentabilidade”; favicon; fotos em WebP | Não constam no protótipo / otimização de 2,6–3,8 MB para 22–99 KB |
