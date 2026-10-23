using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using Sesi.Catalogo.Api.Exportacao;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Tests;

/// <summary>GET /api/cursos/exportacao/moodle.csv e o gerador MoodleCsv.</summary>
[Collection(ApiCollection.Nome)]
public partial class ExportacaoMoodleTests(ApiFactory fabrica)
{
    private const string Rota = "/api/cursos/exportacao/moodle.csv";
    private readonly HttpClient _http = fabrica.CreateClient();

    private async Task<List<string[]>> BaixarAsync(string consulta = "")
    {
        var resposta = await _http.GetAsync($"{Rota}{consulta}");
        resposta.EnsureSuccessStatusCode();
        return LerCsv(await resposta.Content.ReadAsStringAsync());
    }

    // Leitor mínimo de CSV (RFC 4180): é o que o Moodle faria ao ler o arquivo. Se o escape estiver errado, as colunas desalinham.
    private static List<string[]> LerCsv(string texto)
    {
        var registros = new List<string[]>();
        var campos = new List<string>();
        var atual = new StringBuilder();
        var entreAspas = false;

        for (var i = 0; i < texto.Length; i++)
        {
            var c = texto[i];
            if (entreAspas)
            {
                if (c == '"' && i + 1 < texto.Length && texto[i + 1] == '"') { atual.Append('"'); i++; }
                else if (c == '"') entreAspas = false;
                else atual.Append(c);
            }
            else if (c == '"') entreAspas = true;
            else if (c == ',') { campos.Add(atual.ToString()); atual.Clear(); }
            else if (c == '\r') { /* faz parte do \r\n */ }
            else if (c == '\n') { campos.Add(atual.ToString()); atual.Clear(); registros.Add([.. campos]); campos.Clear(); }
            else atual.Append(c);
        }
        if (atual.Length > 0 || campos.Count > 0) { campos.Add(atual.ToString()); registros.Add([.. campos]); }
        return registros;
    }

    private static int Coluna(string nome) => MoodleCsv.Colunas.ToList().IndexOf(nome);

    [Fact]
    public async Task Resposta_e_um_arquivo_csv_utf8_para_download()
    {
        var resposta = await _http.GetAsync(Rota);

        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
        Assert.Equal("text/csv", resposta.Content.Headers.ContentType?.MediaType);
        Assert.Equal("utf-8", resposta.Content.Headers.ContentType?.CharSet);
        Assert.Equal("attachment", resposta.Content.Headers.ContentDisposition?.DispositionType);
        Assert.Equal("cursos-moodle.csv", resposta.Content.Headers.ContentDisposition?.FileName);
    }

    [Fact]
    public async Task Arquivo_nao_tem_BOM_para_nao_contaminar_o_nome_da_primeira_coluna()
    {
        var bytes = await _http.GetByteArrayAsync(Rota);

        Assert.False(bytes.Length >= 3 && bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF);
        Assert.StartsWith("shortname,", Encoding.UTF8.GetString(bytes));
    }

    [Fact]
    public async Task Cabecalho_tem_as_colunas_esperadas_em_minusculas_e_na_ordem()
    {
        var registros = await BaixarAsync();

        Assert.Equal(
            ["shortname", "fullname", "category_path", "summary", "startdate", "visible", "idnumber", "format", "lang"],
            registros[0]);
    }

    [Fact]
    public async Task Tem_uma_linha_por_curso_e_todas_com_o_mesmo_numero_de_colunas()
    {
        var registros = await BaixarAsync();

        Assert.Equal(1 + 8, registros.Count);
        Assert.All(registros, r => Assert.Equal(MoodleCsv.Colunas.Count, r.Length));
    }

    [Fact]
    public async Task Campos_obrigatorios_do_moodle_estao_preenchidos_e_o_nome_breve_e_unico()
    {
        var linhas = (await BaixarAsync()).Skip(1).ToList();

        Assert.All(linhas, l =>
        {
            Assert.False(string.IsNullOrWhiteSpace(l[Coluna("shortname")]));
            Assert.False(string.IsNullOrWhiteSpace(l[Coluna("fullname")]));
            Assert.False(string.IsNullOrWhiteSpace(l[Coluna("category_path")]));
        });
        Assert.Equal(linhas.Count, linhas.Select(l => l[Coluna("shortname")]).Distinct().Count());
        Assert.Equal(linhas.Count, linhas.Select(l => l[Coluna("idnumber")]).Distinct().Count());
    }

    [Fact]
    public async Task Campos_do_curso_1_sao_mapeados_corretamente()
    {
        var linha = (await BaixarAsync()).Skip(1).First(l => l[Coluna("idnumber")] == "SESI-001");

        Assert.Equal("Matemática para a Precisão", linha[Coluna("shortname")]);
        Assert.Equal("Matemática para a Precisão: Medidas e Escalas na Metalurgia", linha[Coluna("fullname")]);
        Assert.Equal("Matemática", linha[Coluna("category_path")]);
        Assert.Equal("2026-01-05", linha[Coluna("startdate")]);
        Assert.Equal("1", linha[Coluna("visible")]);
        Assert.Equal("topics", linha[Coluna("format")]);
        Assert.Equal("pt_br", linha[Coluna("lang")]);
    }

    [Fact]
    public async Task Resumo_em_html_carrega_os_dados_que_o_moodle_nao_tem_como_campo()
    {
        var resumo = (await BaixarAsync()).Skip(1).First(l => l[Coluna("idnumber")] == "SESI-001")[Coluna("summary")];

        // a descrição tem vírgulas: só sobrevive inteira se o campo foi escapado com aspas
        Assert.StartsWith("<p>Aplicação de grandezas, proporções e escalas em processos de corte, furação e usinagem.</p>", resumo);
        Assert.Contains("<li>Carga horária: 60 horas</li>", resumo);
        Assert.Contains("<li>Modalidade: Online</li>", resumo);
        Assert.Contains("<li>Público-alvo: Operadores, técnicos e supervisores de produção da indústria metalúrgica.</li>", resumo);
        Assert.Contains("<li>Status: Disponível</li>", resumo);
    }

    [Fact]
    public async Task Somente_cursos_disponiveis_ficam_visiveis_no_moodle()
    {
        var linhas = (await BaixarAsync()).Skip(1).ToList();

        Assert.Equal(5, linhas.Count(l => l[Coluna("visible")] == "1"));
        Assert.Equal(3, linhas.Count(l => l[Coluna("visible")] == "0")); // 2 em breve + 1 encerrado
    }

    [Fact]
    public async Task Datas_seguem_o_formato_aaaa_mm_dd()
    {
        var datas = (await BaixarAsync()).Skip(1).Select(l => l[Coluna("startdate")]).ToList();

        Assert.All(datas, d => Assert.Matches(@"^\d{4}-\d{2}-\d{2}$", d));
    }

    [Theory]
    [InlineData("?categoria=matematica", 3)]
    [InlineData("?status=Disponivel", 5)]
    [InlineData("?modalidade=Hibrido", 2)]
    [InlineData("?busca=quimica", 1)]
    [InlineData("?categoria=matematica&status=Disponivel", 2)]
    [InlineData("?busca=zzzz", 0)]
    public async Task Aceita_os_mesmos_filtros_da_listagem(string consulta, int esperado)
    {
        var registros = await BaixarAsync(consulta);

        Assert.Equal(esperado, registros.Count - 1); // sem o cabeçalho
    }

    [Fact]
    public async Task Filtro_invalido_devolve_400_em_json_como_na_listagem()
    {
        var resposta = await _http.GetAsync($"{Rota}?status=Cancelado");

        Assert.Equal(HttpStatusCode.BadRequest, resposta.StatusCode);
        Assert.Equal("application/json", resposta.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Rota_nao_conflita_com_o_detalhe_do_curso()
    {
        // /api/cursos/{id:int} continua funcionando ao lado de /api/cursos/exportacao/moodle.csv
        var detalhe = await _http.GetAsync("/api/cursos/1");

        Assert.Equal(HttpStatusCode.OK, detalhe.StatusCode);
        Assert.Equal("application/json", detalhe.Content.Headers.ContentType?.MediaType);
    }
}

/// <summary>Gerador de CSV isolado (sem banco): escape, HTML e mapeamento.</summary>
public class MoodleCsvTests
{
    [Theory]
    [InlineData("simples", "simples")]
    [InlineData("com, vírgula", "\"com, vírgula\"")]
    [InlineData("com \"aspas\"", "\"com \"\"aspas\"\"\"")]
    [InlineData("duas\nlinhas", "\"duas\nlinhas\"")]
    [InlineData(" espaço na ponta", "\" espaço na ponta\"")]
    [InlineData("", "")]
    [InlineData(null, "")]
    public void Escapar_segue_a_rfc_4180(string? entrada, string esperado)
    {
        Assert.Equal(esperado, MoodleCsv.Escapar(entrada));
    }

    private static Curso Exemplo(string descricao = "Descrição simples") => new()
    {
        Id = 7,
        NomeCompleto = "Curso de \"Teste\", completo",
        NomeBreve = "Teste",
        Descricao = descricao,
        Sobre = "Sobre",
        Categoria = new Categoria { Slug = "x", Nome = "Categoria X" },
        Modalidade = Modalidade.Hibrido,
        CargaHoraria = 45,
        PublicoAlvo = "Quem quiser",
        Status = StatusCurso.EmBreve,
        ImagemUrl = "/x.svg",
        DataDisponibilizacao = null,
    };

    [Fact]
    public void Html_do_resumo_e_codificado_para_nao_injetar_marcacao()
    {
        var resumo = MoodleCsv.Resumo(Exemplo("<script>alert('x')</script> & mais"));

        Assert.DoesNotContain("<script>", resumo);
        Assert.Contains("&lt;script&gt;", resumo);
        Assert.Contains("&amp; mais", resumo);
    }

    [Fact]
    public void Curso_sem_data_gera_startdate_vazio_e_em_breve_fica_oculto()
    {
        var linhas = MoodleCsv.Gerar([Exemplo()]).Split("\r\n", StringSplitOptions.RemoveEmptyEntries);

        Assert.Equal(2, linhas.Length);
        Assert.EndsWith(",,0,SESI-007,topics,pt_br", linhas[1]); // startdate vazio, visible=0
        Assert.Contains("\"Curso de \"\"Teste\"\", completo\"", linhas[1]);
    }

    [Fact]
    public void Linhas_terminam_em_crlf_e_o_arquivo_acaba_com_quebra_de_linha()
    {
        var csv = MoodleCsv.Gerar([Exemplo()]);

        Assert.EndsWith("\r\n", csv);
        Assert.Equal(2, Regex.Matches(csv, "\r\n").Count);
    }
}
