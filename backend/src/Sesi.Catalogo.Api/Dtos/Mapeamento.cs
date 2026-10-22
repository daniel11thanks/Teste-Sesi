using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Dtos;

public static class Mapeamento
{
    public static CursoResumoDto ToResumo(this Curso c) => new(
        c.Id, c.NomeCompleto, c.NomeBreve, c.Descricao,
        new CategoriaDto(c.Categoria!.Slug, c.Categoria.Nome),
        Rotulos.Of(c.Modalidade), c.CargaHoraria, c.PublicoAlvo,
        Rotulos.Of(c.Status), c.ImagemUrl, c.DataDisponibilizacao);

    public static CursoDetalheDto ToDetalhe(this Curso c) => new(
        c.Id, c.NomeCompleto, c.NomeBreve, c.Descricao, c.Sobre,
        new CategoriaDto(c.Categoria!.Slug, c.Categoria.Nome),
        Rotulos.Of(c.Modalidade), c.CargaHoraria, c.PublicoAlvo,
        Rotulos.Of(c.Status), c.ImagemUrl, c.DataDisponibilizacao,
        c.Modulos.OrderBy(m => m.Ordem).Select(m => new ModuloDto(m.Ordem, m.Titulo, m.Topicos)).ToList(),
        c.Secoes.OrderBy(s => s.Ordem).Select(s => new SecaoDto(s.Titulo, s.Introducao, s.Itens, s.Fechamento)).ToList(),
        c.Faqs.OrderBy(f => f.Ordem).Select(f => new FaqDto(f.Ordem, f.Pergunta, f.Resposta)).ToList());
}
