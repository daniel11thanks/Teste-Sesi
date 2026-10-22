# Catálogo de Cursos — SESI Indústria

Aplicação web de catálogo de cursos para um ambiente virtual de aprendizagem (AVA), desenvolvida como atividade prática do processo seletivo de **Desenvolvedor de Sistemas I**. Todos os dados são fictícios.

| | |
|---|---|
| **Aplicação publicada** | **https://catalogo-sesi.onrender.com** (Render, plano gratuito; ver [Processo de publicação](#11-processo-de-publicação)) |
| **Repositório** | https://github.com/daniel11thanks/Teste-Sesi |
| **Execução local** | `docker compose up --build` → http://localhost:8080 |
| **Documentação da API (Swagger)** | https://catalogo-sesi.onrender.com/swagger (local: http://localhost:8080/swagger) |
| **Uso de IA** | [USO_DE_IA.md](USO_DE_IA.md) |

## Sumário

1. [Objetivo da aplicação](#1-objetivo-da-aplicação)
2. [Tecnologias utilizadas](#2-tecnologias-utilizadas)
3. [Arquitetura da solução](#3-arquitetura-da-solução)
4. [Estrutura das pastas](#4-estrutura-das-pastas)
5. [Instruções para execução](#5-instruções-para-execução)
6. [Configuração do banco](#6-configuração-do-banco)
7. [Endpoints](#7-endpoints)
8. [Modelo de dados](#8-modelo-de-dados)
9. [Estratégia de responsividade](#9-estratégia-de-responsividade)
10. [Decisões de acessibilidade](#10-decisões-de-acessibilidade)
11. [Processo de publicação](#11-processo-de-publicação)
12. [Limitações conhecidas e diferenças em relação ao Figma](#12-limitações-conhecidas-e-diferenças-em-relação-ao-figma)

---

## 1. Objetivo da aplicação

Permitir que o usuário **consulte, pesquise e filtre** os cursos disponíveis em um ambiente educacional e veja os **detalhes** de cada oferta, conforme o protótipo do Figma (“[TEST DEV] SESI Indústria”).

Funcionalidades obrigatórias do enunciado e onde estão:

| Requisito | Onde |
|---|---|
| Listar os cursos por meio da API | `GET /api/cursos` → catálogo (`/cursos`) e carrossel da Landing |
| Pesquisar cursos pelo nome | Campo de busca do catálogo (sem distinção de acentos e maiúsculas) |
| Filtrar por categoria, modalidade ou status | Três filtros no catálogo |
| Combinar pesquisa e filtros | Todos os parâmetros combinam entre si (`AND`) |
| Apresentar a quantidade de resultados | “N cursos encontrados” (anunciado a leitores de tela) |
| Limpar os filtros aplicados | Botão “Limpar filtros” (devolve o foco ao campo de busca) |
| Abrir os detalhes de um curso | `/cursos/:id` |
| Mensagem quando nenhum curso for encontrado | Estado vazio do catálogo |
| Estado de carregamento | Em todas as telas que dependem da API |
| Mensagem em caso de erro | Mensagens distintas para falha do servidor e falta de conexão, com “Tentar novamente” |
| Interface funcional em diferentes tamanhos de tela | Ver [responsividade](#9-estratégia-de-responsividade) |

Não há cadastro, edição ou exclusão de cursos (o enunciado dispensa) nem integração com o Moodle.

**Telas:** Landing (`/`), Catálogo (`/cursos`), Detalhes do curso (`/cursos/:id`), AVA (`/ava/:id`) e Página não encontrada.

## 2. Tecnologias utilizadas

| Camada | Tecnologia |
|---|---|
| Back-end | **C# / .NET 10** (ASP.NET Core, minimal API) |
| Acesso a dados | Entity Framework Core 10 com migrations |
| Banco de dados | **SQLite** (código aberto) |
| Documentação da API | Swagger UI (Swashbuckle 10) |
| Front-end | **React 19**, **Vite 8**, React Router 7, CSS puro (variáveis CSS, sem biblioteca de UI) |
| Fonte | Open Sans (arquivos fornecidos no teste) |
| Empacotamento | Docker (build multi-estágio) e Docker Compose |
| Testes do back-end | xUnit + `WebApplicationFactory` (integração HTTP com banco SQLite temporário) |
| Testes de interface | Puppeteer (Chrome headless) |
| Auditoria de acessibilidade | axe-core (WCAG 2.0/2.1/2.2 A e AA) e conferência da árvore de acessibilidade |
| Qualidade de código | Oxlint |

## 3. Arquitetura da solução

```
┌────────────────────────── Navegador ──────────────────────────┐
│  React (SPA) — Landing · Catálogo · Detalhes · AVA            │
│  services/api.js ──fetch──►  /api/...                         │
└───────────────────────────────┬───────────────────────────────┘
                                │ HTTP
┌───────────────────────────────▼───────────────────────────────┐
│  ASP.NET Core (.NET 10)  —  um único processo / container     │
│   • /api/cursos, /api/cursos/{id}, /api/filtros, /api/health  │
│   • /swagger                                                  │
│   • arquivos estáticos do React (wwwroot) + fallback da SPA   │
│  EF Core ──► SQLite (catalogo.db)                             │
└───────────────────────────────────────────────────────────────┘
```

Decisões principais:

- **Uma única unidade de implantação.** A API .NET serve também o front-end compilado (`wwwroot`). Assim há um só container, **não há CORS em produção** e a execução local é um comando.
- **Em desenvolvimento**, o Vite (porta 5173) encaminha `/api` para a API (porta 5080) por *proxy*, mantendo a mesma origem e recarga instantânea.
- **A API é a fonte de verdade da busca e dos filtros** (não é filtrado no navegador). A pesquisa ignora acentos usando uma coluna normalizada (`BuscaNormalizada`), calculada no seed e indexada.
- **Estado dos filtros na URL** (`?busca=&categoria=&modalidade=&status=`): o botão Voltar e links compartilhados reproduzem a mesma pesquisa.
- **Camada de API no front-end** (`services/api.js`) e hook `useAsync`, que cancelam requisições obsoletas (`AbortController`) e padronizam carregamento/erro.
- **Cache e compressão em produção:** arquivos do Vite com hash no nome ficam em cache por um ano; o `index.html` não; respostas são comprimidas (gzip/brotli).

## 4. Estrutura das pastas

```
.
├── backend/
│   ├── Sesi.Catalogo.sln
│   ├── tests/Sesi.Catalogo.Api.Tests/   # 63 testes xUnit (API, busca, seed, migrations)
│   └── src/Sesi.Catalogo.Api/
│       ├── Program.cs                 # configuração, Swagger, arquivos estáticos, fallback da SPA
│       ├── Endpoints/CursosEndpoints.cs
│       ├── Models/                    # Curso, Categoria, Modulo, SecaoConteudo, Faq, enums
│       ├── Dtos/                      # contratos de resposta e mapeamento
│       └── Data/
│           ├── CatalogoDbContext.cs
│           ├── SeedData.cs            # 8 cursos fictícios
│           ├── TextoBusca.cs          # normalização (sem acentos) para a pesquisa
│           └── Migrations/            # Inicial + AtualizaImagemBanner
├── frontend/
│   ├── public/                        # fontes, SVGs/imagens do Figma, ilustrações dos cursos
│   ├── src/
│   │   ├── pages/                     # Landing, Catalogo, CursoDetalhe, Ava, NaoEncontrada
│   │   ├── components/                # layout/, ui/, courses/, testimonials/
│   │   ├── services/api.js            # acesso à API
│   │   ├── hooks/                     # useAsync, useDocumentTitle
│   │   ├── styles/                    # tokens.css (cores/tipografia do Figma), base.css
│   │   ├── utils/  data/
│   ├── e2e/                           # testes de interface, axe-core e árvore de acessibilidade
│   └── scripts/                       # geração das ilustrações; otimização das imagens
├── docs/design/                       # extração do protótipo do Figma (textos, cores, interações, prints)
├── docs/teste-leitor-de-tela.md       # roteiro do teste manual com leitor de tela
├── Dockerfile  docker-compose.yml  render.yaml
├── README.md  USO_DE_IA.md  LIMITACOES.md  RELACAO_DE_ARQUIVOS.md
```

## 5. Instruções para execução

### 5.1 Com Docker (recomendado)

Requisito: Docker Desktop (ou Docker Engine + Compose).

```bash
docker compose up --build
```

Abra **http://localhost:8080**. O Swagger fica em http://localhost:8080/swagger. O banco SQLite fica no volume `catalogo-data` (persiste entre reinícios; criado e populado automaticamente na primeira execução).

```bash
docker compose down        # para (mantém o volume)
docker compose down -v     # para e apaga o banco
```

Sem Compose: `docker build -t catalogo-sesi .` e `docker run -p 8080:8080 catalogo-sesi`.

### 5.2 Sem Docker

Requisitos: **.NET SDK 10** e **Node.js 22+**.

```bash
# Terminal 1 — API (cria e popula o banco automaticamente)
cd backend/src/Sesi.Catalogo.Api
dotnet run --urls http://localhost:5080

# Terminal 2 — front-end com recarga automática
cd frontend
npm install
npm run dev
```

Abra **http://localhost:5173** (o Vite encaminha `/api` para a porta 5080). Swagger em http://localhost:5080/swagger.

Para gerar o front-end de produção e servi-lo pela própria API: `npm run build` em `frontend/` e copie `frontend/dist` para `backend/src/Sesi.Catalogo.Api/wwwroot` (é exatamente o que o Dockerfile faz).

### 5.3 Testes e verificações

**Back-end** (não precisa de nada rodando; cada execução usa um banco SQLite temporário):

```bash
cd backend
dotnet test           # 63 testes xUnit
```

Cobrem, pela API real em memória: listagem, pesquisa sem acentos/maiúsculas, cada filtro isolado e combinado, valores inválidos (400), detalhe, 404 em JSON, compressão, a normalização da busca, os mínimos do enunciado no seed (≥ 6 cursos, ≥ 3 categorias, ≥ 2 modalidades, ≥ 3 status), idempotência do seed e as migrations (incluindo a migration de dados aplicada a um banco “antigo”). Foi feita também uma verificação por mutação: defeitos injetados de propósito (busca sem normalização, filtros ignorados, 400 removido) são detectados pelos testes.

**Front-end** — com a API e o `npm run dev` rodando (ou `BASE_URL=http://localhost:8080` apontando para o container) e o Google Chrome instalado (caminho alterável com `CHROME_PATH`):

```bash
cd frontend
npm run lint          # análise estática
npm run build         # build de produção
npm run test:e2e      # ~50 verificações de interface (catálogo, detalhes, AVA)
npm run test:a11y     # auditoria axe-core: 9 telas × desktop e celular
npm run test:arvore   # árvore de acessibilidade: marcos, nomes, títulos e estados
```

Os testes de interface pressupõem o banco com o seed original (8 cursos) e foram executados também contra o container Docker e contra o site publicado.

## 6. Configuração do banco

- **SQLite**, por ser de código aberto, sem servidor e adequado ao volume de dados do catálogo.
- **Connection string:** `ConnectionStrings:Catalogo` (padrão `Data Source=catalogo.db`; no Docker, `Data Source=/data/catalogo.db`). Pode ser alterada por variável de ambiente: `ConnectionStrings__Catalogo`.
- **Migrations:** aplicadas automaticamente na inicialização (`Database.MigrateAsync()`).
  - `Inicial`: cria as tabelas.
  - `AtualizaImagemBanner`: migration de dados que atualiza o caminho da imagem do curso 1 em bancos criados antes da conversão das fotos para WebP.
- **Seed:** `Data/SeedData.cs` popula 8 cursos fictícios apenas se o banco estiver vazio (reiniciar não duplica).
- **Recriar o banco:** apague `catalogo.db` (ou `docker compose down -v`); ele é recriado e populado ao iniciar.
- **Nova migration:** `dotnet ef migrations add NomeDaMigration -o Data/Migrations` (a partir de `backend/src/Sesi.Catalogo.Api`).

Dados do seed (todos fictícios):

| # | Curso | Categoria | Modalidade | Carga | Status | Início |
|---|---|---|---|---|---|---|
| 1 | Matemática para a Precisão: Medidas e Escalas na Metalurgia | Matemática | Online | 60 h | Disponível | 05/01/2026 |
| 2 | Geometria e Modelagem no Design Têxtil | Matemática | Presencial | 40 h | Disponível | 09/02/2026 |
| 3 | Estatística e Controle de Qualidade na Produção | Matemática | Online | 80 h | Em breve | 16/11/2026 |
| 4 | Física do Movimento e da Energia na Metalurgia | Ciências da Natureza | Híbrido | 60 h | Disponível | 02/03/2026 |
| 5 | Química e Sustentabilidade | Ciências da Natureza | Online | 30 h | Encerrado | 10/03/2025 |
| 6 | Ciência dos Materiais na Metalurgia | Ciências da Natureza | Presencial | 100 h | Em breve | 07/12/2026 |
| 7 | Comunicação Técnica e Leitura de Manuais Industriais | Linguagens | Online | 45 h | Disponível | 06/04/2026 |
| 8 | Gestão de Resíduos e Economia Circular na Indústria | Sustentabilidade | Híbrido | 50 h | Disponível | 04/05/2026 |

Cumpre o mínimo do enunciado: 8 cursos (≥ 6), 4 categorias (≥ 3), 3 modalidades (≥ 2), 3 status (≥ 3), com cargas horárias, módulos, descrições de aulas e públicos-alvo diferentes. O curso 1 reproduz o conteúdo do Figma (10 módulos, 10 perguntas frequentes); os demais têm conteúdo próprio.

## 7. Endpoints

Base: `/api`. Respostas em JSON. Documentação interativa em `/swagger`.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/cursos` | Lista cursos, com pesquisa e filtros combináveis |
| `GET` | `/api/cursos/{id}` | Detalhe do curso (módulos, aulas/avaliações, perguntas frequentes) |
| `GET` | `/api/filtros` | Categorias, modalidades e status disponíveis (valor e rótulo) |
| `GET` | `/api/health` | Verificação de saúde (`{"status":"ok"}`) |

**`GET /api/cursos`** — parâmetros de consulta (todos opcionais):

| Parâmetro | Descrição | Exemplo |
|---|---|---|
| `busca` | Trecho do nome (completo ou breve), sem distinção de acentos/maiúsculas | `quimica` |
| `categoria` | Slug da categoria | `matematica`, `linguagens`, `ciencias-da-natureza`, `sustentabilidade` |
| `modalidade` | `Online`, `Presencial` ou `Hibrido` | `Hibrido` |
| `status` | `Disponivel`, `EmBreve` ou `Encerrado` | `EmBreve` |

```http
GET /api/cursos?busca=matematica&categoria=matematica&status=Disponivel
```

```json
{
  "total": 1,
  "itens": [
    {
      "id": 1,
      "nomeCompleto": "Matemática para a Precisão: Medidas e Escalas na Metalurgia",
      "nomeBreve": "Matemática para a Precisão",
      "descricao": "Aplicação de grandezas, proporções e escalas em processos de corte, furação e usinagem.",
      "categoria": { "slug": "matematica", "nome": "Matemática" },
      "modalidade": { "valor": "Online", "rotulo": "Online" },
      "cargaHoraria": 60,
      "publicoAlvo": "Operadores, técnicos e supervisores de produção da indústria metalúrgica.",
      "status": { "valor": "Disponivel", "rotulo": "Disponível" },
      "imagemUrl": "/assets/banner-ava.webp",
      "dataDisponibilizacao": "2026-01-05"
    }
  ]
}
```

**Erros** (corpo `{ "erro": "mensagem" }`):

| Código | Quando |
|---|---|
| `400` | `modalidade` ou `status` com valor inválido |
| `404` | Curso inexistente (`/api/cursos/999`) ou rota `/api/...` desconhecida |

## 8. Modelo de dados

```
Categoria 1 ──── * Curso 1 ──── * Modulo
                        1 ──── * SecaoConteudo
                        1 ──── * Faq
```

| Entidade | Campos principais |
|---|---|
| **Curso** | `Id`, `NomeCompleto`, `NomeBreve`, `Descricao`, `Sobre`, `CategoriaId`, `Modalidade` (Online/Presencial/Hibrido), `CargaHoraria` (horas), `PublicoAlvo`, `Status` (Disponivel/EmBreve/Encerrado), `ImagemUrl`, `DataDisponibilizacao` (opcional), `BuscaNormalizada` (índice) |
| **Categoria** | `Id`, `Slug` (único), `Nome` |
| **Modulo** | `Id`, `CursoId`, `Ordem`, `Titulo`, `Topicos` (lista de textos, gravada como JSON) |
| **SecaoConteudo** | `Id`, `CursoId`, `Ordem`, `Titulo`, `Introducao`, `Itens` (lista), `Fechamento` — descreve as aulas e as avaliações |
| **Faq** | `Id`, `CursoId`, `Ordem`, `Pergunta`, `Resposta` |

Campos exigidos pelo enunciado: nome completo, nome breve, descrição, categoria, modalidade, carga horária, público-alvo, status, imagem de apresentação e data de disponibilização (quando aplicável — opcional no modelo). Enums são gravados como texto; índices em `Categoria.Slug`, `Curso.Status` e `Curso.BuscaNormalizada`.

## 9. Estratégia de responsividade

O Figma só traz o layout de **desktop**; os demais tamanhos foram definidos por conta própria seguindo o mesmo visual.

- **Mobile-friendly por padrão:** unidades relativas (`rem`, `%`, `clamp()`), tipografia fluida (`--fs-hero`, `--fs-h2` com `clamp`) e container com largura máxima e margens proporcionais (`--gutter`).
- **Breakpoints:** ~**64 rem** (1024 px) e **60 rem** (960 px) — grades de 4/3 colunas passam a 2; **52 rem** (832 px) — o menu do site vira botão “hambúrguer” e o menu do AVA passa a um bloco recolhível; **40 rem / 36 rem** (640 / 576 px) — uma coluna.
- **Carrosséis** usam rolagem horizontal com `scroll-snap`; a trilha começa alinhada ao container e “sangra” até a borda da tela, como no Figma, e funciona por toque, mouse e teclado.
- **Imagens** com proporção fixa (`aspect-ratio`) e `object-fit`, e fotos em WebP otimizado (22–99 KB).
- **Verificação:** os testes automatizados conferem a ausência de rolagem horizontal em 390 px nas telas principais, e o axe foi executado em 1440 px e 390 px.

## 10. Decisões de acessibilidade

- **HTML semântico:** `header`, `nav`, `main`, `section`, `article`, `footer`, um único `h1` por tela e hierarquia de títulos; `lang="pt-BR"`; título da aba atualizado em cada página.
- **Navegação por teclado:** link “Ir para o conteúdo”, foco visível em todos os controles (contorno de 3 px), menu, acordeões, carrosséis e filtros operáveis por teclado. Quando há barra de matrícula fixa, `scroll-padding` evita que o foco fique escondido atrás dela.
- **Formulário de busca:** `role="search"`, rótulos visíveis associados (`label for`), `type="search"`.
- **Anúncios dinâmicos:** a quantidade de resultados, o carregamento e o estado vazio usam `role="status"`/`aria-live="polite"`; erros usam `role="alert"`.
- **Acordeões e menus:** botões com `aria-expanded`/`aria-controls`; painéis como `region` rotulada.
- **Carrosséis:** `role="region"` com `aria-roledescription="carrossel"`, trilha focável por teclado e botões Anterior/Próximo com rótulo.
- **Imagens e ícones:** decorativos com `alt=""`/`aria-hidden`; informativos com texto alternativo; ícones nunca são a única forma de informação (status tem texto e cor).
- **Cards clicáveis:** no catálogo, o link está no título e se estende por todo o card, de modo que o nome acessível coincide com o texto visível.
- **Contraste:** textos com contraste mínimo de 4,5:1 (a auditoria apontou e corrigimos o cargo dos depoimentos).
- **Movimento:** respeita `prefers-reduced-motion`.
- **Verificação automática:** (1) **axe-core** (WCAG 2.0/2.1/2.2 A e AA e boas práticas) em 9 telas, em desktop e celular — **0 violações** (`npm run test:a11y`); (2) conferência da **árvore de acessibilidade** do Chrome — a que os leitores de tela consomem — com 33 verificações: marcos e navegações nomeados, um único `h1`, rótulos dos campos, estados `expanded`/`disabled`, anúncio da contagem de resultados, nenhum controle sem nome (`npm run test:arvore`); (3) testes de teclado automatizados. Os testes foram validados injetando defeitos de acessibilidade de propósito (botão sem nome, `aria-expanded` removido etc.), todos detectados.
- **Teste manual com leitor de tela real: realizado de forma exploratória.** O candidato percorreu a aplicação com o **Narrador do Windows** (navegação por `Tab`, por títulos com `H`, por campos de formulário com `F` e pelas setas) e o Narrador leu o conteúdo percorrido, sem problemas relatados. A execução **item a item** do roteiro de 23 tarefas ([docs/teste-leitor-de-tela.md](docs/teste-leitor-de-tela.md)) não foi registrada; por isso comportamentos específicos (anúncio automático da contagem ao filtrar, estados expandido/recolhido dos acordeões, menu no celular) estão cobertos pela conferência automática da árvore de acessibilidade, mas não foram confirmados individualmente de ouvido.

## 11. Processo de publicação

A aplicação é publicada como **uma única imagem Docker** (API + front-end), em plataforma gratuita, sem custo para o SESI-SP. O repositório inclui um `render.yaml` para o **Render** (plano gratuito):

1. Faça login em https://render.com e conecte a conta do GitHub.
2. **New → Blueprint** e selecione o repositório `daniel11thanks/Teste-Sesi`. O Render lê o `render.yaml` e cria o serviço web `catalogo-sesi` a partir do `Dockerfile`.
3. Aguarde o build (alguns minutos). A URL pública aparece no painel do serviço: **https://catalogo-sesi.onrender.com**.
4. Verifique `/api/health` e `/swagger` na URL pública.

A versão publicada foi verificada com as mesmas suítes usadas localmente (testes de interface do catálogo, dos detalhes e do AVA, axe-core e árvore de acessibilidade) apontando `BASE_URL` para a URL pública. O `render.yaml` tem `autoDeploy: true`: cada `git push` na `main` publica uma nova versão automaticamente.

Detalhes:
- O Render informa a porta pela variável `PORT`, que a API usa automaticamente.
- No plano gratuito **não há disco persistente**: o banco SQLite é recriado e populado pelo seed a cada início. Como a aplicação é somente leitura, nada se perde.
- O plano gratuito **hiberna** o serviço após alguns minutos sem acessos; a primeira requisição seguinte pode levar cerca de um minuto. Se o serviço estiver indisponível, use a [execução local](#5-instruções-para-execução).
- Qualquer plataforma que execute um `Dockerfile` (Fly.io, Azure Container Apps, Railway etc.) serve da mesma forma.
- **Arquivos de publicação (ZIP):** `Dockerfile`, `docker-compose.yml`, `render.yaml`, `.dockerignore`, código-fonte do back-end e do front-end.

## 12. Limitações conhecidas e diferenças em relação ao Figma

### Diferenças em relação ao Figma (e justificativas)

| Diferença | Justificativa |
|---|---|
| **Tela de catálogo (`/cursos`) não existe no Figma** | O enunciado exige listar, pesquisar e filtrar; foi criada com o mesmo visual (header, footer, botões, etiquetas, cards em estilo próprio). O enunciado autoriza páginas adicionais seguindo o Figma. |
| **Página 404 e estados de carregamento, erro e vazio** | Exigidos pelo enunciado (estados) e boa prática; sem referência no Figma. |
| **Sem versões tablet/celular no Figma** | Layouts responsivos definidos por conta própria (ver seção 9). |
| **Cards dos cursos 2 a 8 usam ilustrações SVG em vez de fotos** | As fotos dos cards não foram fornecidas nos arquivos do teste; só a foto do curso 1 (paquímetro) existe. As ilustrações são geradas por script (`frontend/scripts/gerar-ilustracoes.mjs`) e podem ser trocadas por fotos reais sem alterar o código. |
| **Campos extras: descrição, status, carga horária, modalidade e público-alvo** | O enunciado pede esses campos em cada curso, mas o Figma não os mostra. Nos cards do catálogo eles aparecem diretamente; na página de detalhes o topo ficou idêntico ao Figma e os campos foram reunidos no bloco “Informações do curso”, numa faixa abaixo das duas colunas de “Sobre o curso” (a coluna do texto é fixa na rolagem, como no Figma, por isso foi mantida curta; nenhum elemento do Figma muda de posição). |
| **Coluna “Sobre o curso” fixa na rolagem** | Como no Figma, mas só em telas largas e altas (≥ 960 × 640 px); em celular, tablet e janelas baixas ela rola junto, para o texto não ficar cortado. |
| **Pequena margem depois do último card dos carrosséis** | No Figma, o último card de cada carrossel (Principais cursos e Depoimentos) encosta na borda direita da tela. Na aplicação ele para a uma pequena distância da borda, igual ao espaço entre os cards (18 px), para não ficar colado na janela. A distância é a variável `--espaco-cards` em `frontend/src/components/ui/Carousel.css` (zerar o `padding` direito da trilha reproduz o Figma à risca). |
| **Matrícula conforme o status** | Cursos “Em breve” mostram “Disponível em dd/mm/aaaa” e “Encerrado” mostra “Inscrições encerradas”, ambos desabilitados; o Figma só prevê “Matricule-se”. |
| **Barra de matrícula fixa: espaço extra no rodapé** | Na página de detalhes do curso a barra preta flutuante com o botão “Matricule-se” fica fixa na base da tela. No Figma, ao chegar ao fim da página, ela passa por cima do conteúdo do rodapé (endereço, links) e o esconde. Na aplicação o rodapé ganha um espaço extra embaixo (5,5 rem) só nessa página, de modo que, no fim da rolagem, a barra fica sobre uma área vazia e **nenhuma informação do rodapé fica coberta** (acessibilidade e legibilidade). Também há `scroll-padding` para que o foco do teclado não fique escondido atrás da barra. |
| **Destinos de links sem ação no Figma** | “Área do aluno” e “Matricule-se” levam ao AVA; “Sobre” rola até “Impacto transformador”; “Mandar uma mensagem” abre um e-mail; “Cursos populares”, “Suporte” e “Blog” levam a páginas existentes. |
| **AVA:** menu com um item por módulo do curso (o Figma mostra 6), busca que filtra o menu e menu recolhível no celular; texto da aula parametrizado pelo curso | Necessário para servir a qualquer curso do catálogo. |
| **Container de conteúdo com largura máxima (1212 px)** | O Figma escala o quadro com a janela; aqui o conteúdo é centralizado com largura máxima para melhor leitura em telas grandes. |
| **Medidas e cores do Figma são aproximações** | O Dev Mode não estava acessível; as medidas foram extraídas dos prints (px do print; frame de 1440 px assumido) e as cores por amostragem de pixels (±3). O hero foi calibrado comparando pixel a pixel com a referência (diferença média < 1/255 por canal); os tamanhos de texto, as proporções das colunas e os espaçamentos das demais seções foram calibrados depois, comparando cada print do Figma com a aplicação renderizada (imagens lado a lado e medição de larguras de texto). |
| **Cores das etiquetas “Linguagens” e “Sustentabilidade”** | Não aparecem no protótipo; escolhidas por nós. |
| **Fotos em WebP e favicon próprio** | PNG de 2,6–3,8 MB otimizados para 22–99 KB; o Figma não traz favicon. |

### Limitações e itens não concluídos

- **Sem CRUD de cursos e sem integração com o Moodle** (fora do escopo definido no enunciado). Um painel administrativo seria a evolução natural.
- **AVA ilustrativo:** os itens do menu (aulas e módulos) não são navegáveis (o protótipo também não define essa navegação), o progresso (10%) é fixo e há apenas o conteúdo da aula “Boas práticas”.
- **Sem autenticação e sem matrícula real:** “Matricule-se” e “Área do aluno” apenas levam ao AVA de demonstração.
- **Vídeo:** a miniatura com botão de reprodução é decorativa; não há player.
- **Pesquisa** apenas pelo nome do curso (completo ou breve); sem paginação nem ordenação (o volume é pequeno).
- **Páginas de apoio inexistentes:** Termos de Uso, Política de Privacidade, Blog etc. não têm conteúdo.
- **Banco SQLite:** adequado a este volume e a uma instância; não é indicado para várias réplicas ou escrita concorrente. No plano gratuito do Render é recriado a cada início.
- **Hospedagem gratuita hiberna** após inatividade (primeira resposta lenta).
- **Testes:** o back-end tem 63 testes xUnit; o front-end tem testes de interface (Puppeteer), axe-core e árvore de acessibilidade, que dependem do Chrome e dos serviços rodando. **Não há pipeline de CI** (os testes são executados manualmente) nem testes unitários dos componentes React isolados (a cobertura do front-end é de interface, de ponta a ponta).
- **Acessibilidade:** auditoria automática, conferência da árvore de acessibilidade e testes de teclado, além de um teste **exploratório** com o Narrador do Windows. A execução **item a item** do roteiro com leitor de tela (`docs/teste-leitor-de-tela.md`) não foi registrada, e não houve teste com NVDA nem VoiceOver.
- **Dados 100% fictícios**, inclusive depoimentos, estatísticas e endereços.

## Uso de Inteligência Artificial

O registro completo (ferramentas, prompts, o que foi aproveitado ou descartado, validação, exemplos de erro e correção) está em [USO_DE_IA.md](USO_DE_IA.md).
