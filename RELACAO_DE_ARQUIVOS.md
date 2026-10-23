# Relação dos arquivos de publicação

Entregável 8 da atividade prática. Este pacote (ZIP) reúne tudo o que é necessário para **publicar e executar** o catálogo de cursos, inclusive localmente, caso a hospedagem esteja indisponível.

- **Aplicação publicada:** https://catalogo-sesi.onrender.com (Render, plano gratuito; pode levar cerca de 1 minuto para “acordar”)
- **Repositório:** https://github.com/daniel11thanks/Teste-Sesi

## Executar localmente (a partir deste ZIP)

Requisito: Docker Desktop (ou Docker Engine com Compose).

```bash
docker compose up --build
```

Abra http://localhost:8080 (Swagger em http://localhost:8080/swagger). Alternativa sem Docker: ver `README.md`, seção 5.2.

## Arquivos de publicação

| Arquivo | Função |
|---|---|
| `Dockerfile` | Build multi-estágio: compila o React (Node 22), publica a API .NET 10 e gera **uma única imagem** com a API e o front-end |
| `docker-compose.yml` | Sobe a aplicação completa na porta 8080, com o banco SQLite em um volume |
| `.dockerignore` | Exclui do contexto de build arquivos desnecessários (`node_modules`, `bin`, `obj`, `docs`…) |
| `render.yaml` | Blueprint do Render (plano gratuito): cria o serviço web a partir do `Dockerfile` |

## Código-fonte, banco e documentação

| Caminho | Conteúdo |
|---|---|
| `backend/src/Sesi.Catalogo.Api/` | API em C#/.NET 10: endpoints (`Endpoints/`), modelos (`Models/`), contratos (`Dtos/`), acesso a dados (`Data/`) |
| `backend/src/Sesi.Catalogo.Api/Data/Migrations/` | **Migrations do banco** (SQLite): `Inicial` e `AtualizaImagemBanner` |
| `backend/src/Sesi.Catalogo.Api/Data/SeedData.cs` | **Dados fictícios** (8 cursos), carregados automaticamente no primeiro início |
| `backend/src/Sesi.Catalogo.Api/Exportacao/` | Gerador do CSV de exportação para o Moodle (diferencial; endpoint `GET /api/cursos/exportacao/moodle.csv`) |
| `backend/tests/Sesi.Catalogo.Api.Tests/` | 90 testes xUnit do back-end |
| `frontend/` | Front-end React + Vite: `src/` (páginas e componentes), `public/` (fontes, ícones e imagens do Figma, ilustrações dos cursos), `e2e/` (testes de interface e de acessibilidade), `scripts/` |
| `docs/design/` | Extração do protótipo do Figma (textos, cores, interações e prints de referência) |
| `docs/teste-leitor-de-tela.md` | Roteiro do teste manual com leitor de tela |
| `README.md` | Documentação técnica (objetivo, arquitetura, execução, banco, endpoints, modelo de dados, responsividade, acessibilidade, publicação, limitações) |
| `USO_DE_IA.md` | Registro do uso de Inteligência Artificial |
| `LIMITACOES.md` | Relação das limitações e dos itens não concluídos |

Banco de dados: **SQLite**. Não há arquivo de banco no pacote; ele é criado e populado automaticamente (migrations + seed) na primeira execução.
