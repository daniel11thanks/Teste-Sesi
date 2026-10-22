namespace Sesi.Catalogo.Api.Models;

public class Categoria
{
    public int Id { get; set; }
    public required string Slug { get; set; }
    public required string Nome { get; set; }

    public List<Curso> Cursos { get; set; } = [];
}
