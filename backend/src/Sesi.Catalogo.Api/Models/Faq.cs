namespace Sesi.Catalogo.Api.Models;

public class Faq
{
    public int Id { get; set; }
    public int CursoId { get; set; }
    public int Ordem { get; set; }
    public required string Pergunta { get; set; }
    public required string Resposta { get; set; }
}
