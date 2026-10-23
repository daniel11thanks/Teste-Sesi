using System.Globalization;
using System.Text;
using Sesi.Catalogo.Api.Dtos;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Exportacao;

/// <summary>
/// Gera o CSV da ferramenta "Carregar cursos" do Moodle (Administração do site → Cursos → Carregar cursos).
/// Todas as colunas são derivadas dos dados que o catálogo já tem; nada é gravado a mais no banco.
/// </summary>
/// <remarks>
/// O formato segue a documentação oficial do Moodle (campos obrigatórios shortname, fullname e categoria, aqui por
/// category_path). Não há integração com um Moodle em execução: o arquivo é gerado, não enviado.
/// </remarks>
public static class MoodleCsv
{
    /// <summary>Colunas na ordem em que são escritas (nomes em minúsculas, como o Moodle exige).</summary>
    public static readonly IReadOnlyList<string> Colunas =
        ["shortname", "fullname", "category_path", "summary", "startdate", "visible", "idnumber", "format", "lang"];

    private const string QuebraDeLinha = "\r\n";

    public static string Gerar(IEnumerable<Curso> cursos)
    {
        var sb = new StringBuilder();
        sb.Append(string.Join(',', Colunas)).Append(QuebraDeLinha);

        foreach (var c in cursos)
        {
            var linha = new[]
            {
                c.NomeBreve,                                  // shortname: único no Moodle
                c.NomeCompleto,                               // fullname
                c.Categoria?.Nome ?? "",                      // category_path: a categoria precisa existir no Moodle
                Resumo(c),                                    // summary (HTML)
                c.DataDisponibilizacao?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? "",
                // O Moodle só distingue visível/oculto: só cursos disponíveis ficam visíveis.
                c.Status == StatusCurso.Disponivel ? "1" : "0",
                $"SESI-{c.Id:000}",                           // idnumber estável, para reimportar/atualizar
                "topics",                                     // formato de curso padrão do Moodle
                "pt_br",
            };
            sb.Append(string.Join(',', linha.Select(Escapar))).Append(QuebraDeLinha);
        }

        return sb.ToString();
    }

    /// <summary>Resumo em HTML. Carga horária, modalidade, público-alvo e status não existem como campos nativos do Moodle.</summary>
    public static string Resumo(Curso c) =>
        $"<p>{Html(c.Descricao)}</p>" +
        "<ul>" +
        $"<li>Carga horária: {c.CargaHoraria} horas</li>" +
        $"<li>Modalidade: {Html(Rotulos.Of(c.Modalidade).Rotulo)}</li>" +
        $"<li>Público-alvo: {Html(c.PublicoAlvo)}</li>" +
        $"<li>Status: {Html(Rotulos.Of(c.Status).Rotulo)}</li>" +
        "</ul>";

    /// <summary>
    /// Escapa só os caracteres que são marcação HTML. (WebUtility.HtmlEncode também converteria cada letra acentuada em
    /// entidade numérica, como "&amp;#231;", deixando o CSV ilegível para quem o abrir.)
    /// </summary>
    private static string Html(string texto) =>
        texto.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;").Replace("'", "&#39;");

    /// <summary>Escape de campo conforme a RFC 4180: aspas quando há vírgula, aspas, quebra de linha ou espaço nas pontas.</summary>
    public static string Escapar(string? campo)
    {
        if (string.IsNullOrEmpty(campo)) return "";

        var precisaDeAspas = campo.AsSpan().IndexOfAny(",\"\r\n") >= 0 || campo[0] == ' ' || campo[^1] == ' ';
        return precisaDeAspas ? $"\"{campo.Replace("\"", "\"\"")}\"" : campo;
    }
}
