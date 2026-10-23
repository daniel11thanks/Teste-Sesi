using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using Sesi.Catalogo.Api.Data;
using Sesi.Catalogo.Api.Dtos;
using Sesi.Catalogo.Api.Exportacao;
using Sesi.Catalogo.Api.Models;
using System.Text;

namespace Sesi.Catalogo.Api.Endpoints;

public static class CursosEndpoints
{
    public static IEndpointRouteBuilder MapCursos(this IEndpointRouteBuilder app)
    {
        var api = app.MapGroup("/api");

        api.MapGet("/health", () => Results.Ok(new { status = "ok" }))
            .WithTags("Sistema")
            .WithMetadata(new SwaggerOperationAttribute("Verifica se a API está no ar."));

        api.MapGet("/cursos", ListarAsync)
            .WithTags("Cursos")
            .WithMetadata(new SwaggerOperationAttribute(
                "Lista cursos",
                "Pesquisa por nome (sem distinção de acentos ou maiúsculas) e filtra por categoria, modalidade e status. Os parâmetros podem ser combinados."))
            .Produces<ListaCursosDto>()
            .ProducesProblem(StatusCodes.Status400BadRequest);

        api.MapGet("/cursos/{id:int}", ObterAsync)
            .WithTags("Cursos")
            .WithMetadata(new SwaggerOperationAttribute(
                "Detalha um curso",
                "Retorna o curso com módulos, seções de aulas e avaliações, e perguntas frequentes."))
            .Produces<CursoDetalheDto>()
            .Produces(StatusCodes.Status404NotFound);

        // Integração: exportação administrativa, fora da interface do aluno (ver README, "Integração com o Moodle").
        api.MapGet("/cursos/exportacao/moodle.csv", ExportarMoodleAsync)
            .WithTags("Integração com o Moodle")
            .WithMetadata(new SwaggerOperationAttribute(
                "Exporta cursos em CSV para a ferramenta \"Carregar cursos\" do Moodle",
                "Gera um arquivo CSV (UTF-8, separado por vírgula) com as colunas shortname, fullname, category_path, summary, "
                + "startdate, visible, idnumber, format e lang. Aceita os mesmos filtros da listagem. "
                + "As categorias (category_path) precisam existir antes no Moodle. Cursos \"Em breve\" e \"Encerrado\" saem ocultos "
                + "(visible=0). Carga horária, modalidade, público-alvo e status vão em lista HTML dentro do resumo. "
                + "É um arquivo gerado, não uma integração com um Moodle em execução."))
            .Produces(StatusCodes.Status200OK, contentType: "text/csv")
            .ProducesProblem(StatusCodes.Status400BadRequest);

        // Rotas /api desconhecidas devolvem 404 em JSON (e não o index.html do fallback da SPA).
        api.MapFallback("{**rota}", () => Results.NotFound(new { erro = "Rota da API não encontrada." }))
            .ExcludeFromDescription();

        api.MapGet("/filtros", FiltrosAsync)
            .WithTags("Cursos")
            .WithMetadata(new SwaggerOperationAttribute(
                "Lista as opções de filtro",
                "Categorias, modalidades e status disponíveis, com o valor aceito pela API e o rótulo para exibição."))
            .Produces<FiltrosDto>();

        return app;
    }

    private static async Task<IResult> ListarAsync(
        CatalogoDbContext db,
        [FromQuery, SwaggerParameter("Trecho do nome do curso. Ex.: quimica")] string? busca,
        [FromQuery, SwaggerParameter("Slug da categoria. Ex.: matematica, linguagens, ciencias-da-natureza, sustentabilidade")] string? categoria,
        [FromQuery, SwaggerParameter("Online, Presencial ou Hibrido")] string? modalidade,
        [FromQuery, SwaggerParameter("Disponivel, EmBreve ou Encerrado")] string? status,
        CancellationToken ct)
    {
        var (cursos, erro) = await ConsultarCursosAsync(db, busca, categoria, modalidade, status, ct);
        if (erro is not null) return erro;

        var itens = cursos!.Select(c => c.ToResumo()).ToList();
        return Results.Ok(new ListaCursosDto(itens.Count, itens));
    }

    private static async Task<IResult> ExportarMoodleAsync(
        CatalogoDbContext db,
        [FromQuery, SwaggerParameter("Trecho do nome do curso. Ex.: quimica")] string? busca,
        [FromQuery, SwaggerParameter("Slug da categoria. Ex.: matematica")] string? categoria,
        [FromQuery, SwaggerParameter("Online, Presencial ou Hibrido")] string? modalidade,
        [FromQuery, SwaggerParameter("Disponivel, EmBreve ou Encerrado")] string? status,
        CancellationToken ct)
    {
        var (cursos, erro) = await ConsultarCursosAsync(db, busca, categoria, modalidade, status, ct);
        if (erro is not null) return erro;

        // UTF-8 sem BOM (o BOM pode ser lido como parte do nome da primeira coluna).
        var bytes = new UTF8Encoding(encoderShouldEmitUTF8Identifier: false).GetBytes(MoodleCsv.Gerar(cursos!));
        return Results.File(bytes, "text/csv; charset=utf-8", "cursos-moodle.csv");
    }

    /// <summary>Consulta compartilhada pela listagem e pela exportação: pesquisa por nome e filtros combináveis.</summary>
    private static async Task<(List<Curso>? Cursos, IResult? Erro)> ConsultarCursosAsync(
        CatalogoDbContext db, string? busca, string? categoria, string? modalidade, string? status, CancellationToken ct)
    {
        Modalidade? modalidadeFiltro = null;
        if (!string.IsNullOrWhiteSpace(modalidade))
        {
            if (!Enum.TryParse<Modalidade>(modalidade, ignoreCase: true, out var m))
                return (null, Results.BadRequest(new { erro = $"Modalidade inválida: '{modalidade}'." }));
            modalidadeFiltro = m;
        }

        StatusCurso? statusFiltro = null;
        if (!string.IsNullOrWhiteSpace(status))
        {
            if (!Enum.TryParse<StatusCurso>(status, ignoreCase: true, out var st))
                return (null, Results.BadRequest(new { erro = $"Status inválido: '{status}'." }));
            statusFiltro = st;
        }

        var consulta = db.Cursos.AsNoTracking().Include(c => c.Categoria).AsQueryable();

        var termo = TextoBusca.Normalizar(busca);
        if (termo.Length > 0)
            consulta = consulta.Where(c => c.BuscaNormalizada.Contains(termo));

        if (!string.IsNullOrWhiteSpace(categoria))
        {
            var slug = categoria.Trim().ToLowerInvariant();
            consulta = consulta.Where(c => c.Categoria!.Slug == slug);
        }

        if (modalidadeFiltro is { } mf) consulta = consulta.Where(c => c.Modalidade == mf);
        if (statusFiltro is { } sf) consulta = consulta.Where(c => c.Status == sf);

        return (await consulta.OrderBy(c => c.Id).ToListAsync(ct), null);
    }

    private static async Task<IResult> ObterAsync(int id, CatalogoDbContext db, CancellationToken ct)
    {
        var curso = await db.Cursos.AsNoTracking()
            .AsSplitQuery()
            .Include(c => c.Categoria)
            .Include(c => c.Modulos)
            .Include(c => c.Secoes)
            .Include(c => c.Faqs)
            .FirstOrDefaultAsync(c => c.Id == id, ct);

        return curso is null
            ? Results.NotFound(new { erro = "Curso não encontrado." })
            : Results.Ok(curso.ToDetalhe());
    }

    private static async Task<IResult> FiltrosAsync(CatalogoDbContext db, CancellationToken ct)
    {
        var categorias = await db.Categorias.AsNoTracking()
            .OrderBy(c => c.Nome)
            .Select(c => new CategoriaDto(c.Slug, c.Nome))
            .ToListAsync(ct);

        return Results.Ok(new FiltrosDto(categorias, Rotulos.Modalidades(), Rotulos.Status()));
    }
}
