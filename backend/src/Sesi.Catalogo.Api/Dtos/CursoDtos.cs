namespace Sesi.Catalogo.Api.Dtos;

public record CategoriaDto(string Slug, string Nome);

public record OpcaoDto(string Valor, string Rotulo);

public record CursoResumoDto(
    int Id,
    string NomeCompleto,
    string NomeBreve,
    string Descricao,
    CategoriaDto Categoria,
    OpcaoDto Modalidade,
    int CargaHoraria,
    string PublicoAlvo,
    OpcaoDto Status,
    string ImagemUrl,
    DateOnly? DataDisponibilizacao);

public record ModuloDto(int Ordem, string Titulo, IReadOnlyList<string> Topicos);

public record SecaoDto(string Titulo, string Introducao, IReadOnlyList<string> Itens, string? Fechamento);

public record FaqDto(int Ordem, string Pergunta, string Resposta);

public record CursoDetalheDto(
    int Id,
    string NomeCompleto,
    string NomeBreve,
    string Descricao,
    string Sobre,
    CategoriaDto Categoria,
    OpcaoDto Modalidade,
    int CargaHoraria,
    string PublicoAlvo,
    OpcaoDto Status,
    string ImagemUrl,
    DateOnly? DataDisponibilizacao,
    IReadOnlyList<ModuloDto> Modulos,
    IReadOnlyList<SecaoDto> Secoes,
    IReadOnlyList<FaqDto> Faqs);

public record ListaCursosDto(int Total, IReadOnlyList<CursoResumoDto> Itens);

public record FiltrosDto(
    IReadOnlyList<CategoriaDto> Categorias,
    IReadOnlyList<OpcaoDto> Modalidades,
    IReadOnlyList<OpcaoDto> Status);
