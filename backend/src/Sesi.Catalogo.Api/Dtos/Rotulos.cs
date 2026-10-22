using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Dtos;

public static class Rotulos
{
    public static OpcaoDto Of(Modalidade m) => new(m.ToString(), m switch
    {
        Modalidade.Online => "Online",
        Modalidade.Presencial => "Presencial",
        Modalidade.Hibrido => "Híbrido",
        _ => m.ToString()
    });

    public static OpcaoDto Of(StatusCurso s) => new(s.ToString(), s switch
    {
        StatusCurso.Disponivel => "Disponível",
        StatusCurso.EmBreve => "Em breve",
        StatusCurso.Encerrado => "Encerrado",
        _ => s.ToString()
    });

    public static IReadOnlyList<OpcaoDto> Modalidades() =>
        Enum.GetValues<Modalidade>().Select(Of).ToList();

    public static IReadOnlyList<OpcaoDto> Status() =>
        Enum.GetValues<StatusCurso>().Select(Of).ToList();
}
