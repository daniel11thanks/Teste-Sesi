namespace Sesi.Catalogo.Api.Models;

public class Modulo
{
    public int Id { get; set; }
    public int CursoId { get; set; }
    public int Ordem { get; set; }
    public required string Titulo { get; set; }
    public List<string> Topicos { get; set; } = [];
}
