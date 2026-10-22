namespace Sesi.Catalogo.Api.Models;

public class Curso
{
    public int Id { get; set; }
    public required string NomeCompleto { get; set; }
    public required string NomeBreve { get; set; }
    public required string Descricao { get; set; }
    public required string Sobre { get; set; }

    public int CategoriaId { get; set; }
    public Categoria? Categoria { get; set; }

    public Modalidade Modalidade { get; set; }
    public int CargaHoraria { get; set; }
    public required string PublicoAlvo { get; set; }
    public StatusCurso Status { get; set; }
    public required string ImagemUrl { get; set; }

    /// <summary>Data de disponibilização; nula quando não se aplica.</summary>
    public DateOnly? DataDisponibilizacao { get; set; }

    /// <summary>Nome sem acentos e em minúsculas, usado na pesquisa por nome.</summary>
    public string BuscaNormalizada { get; set; } = "";

    public List<Modulo> Modulos { get; set; } = [];
    public List<SecaoConteudo> Secoes { get; set; } = [];
    public List<Faq> Faqs { get; set; } = [];
}
