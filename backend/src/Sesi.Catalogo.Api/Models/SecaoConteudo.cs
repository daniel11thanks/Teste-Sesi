namespace Sesi.Catalogo.Api.Models;

/// <summary>Bloco de texto do curso (por exemplo "Aulas online" ou "Provas e Avaliações").</summary>
public class SecaoConteudo
{
    public int Id { get; set; }
    public int CursoId { get; set; }
    public int Ordem { get; set; }
    public required string Titulo { get; set; }
    public required string Introducao { get; set; }
    public List<string> Itens { get; set; } = [];
    public string? Fechamento { get; set; }
}
