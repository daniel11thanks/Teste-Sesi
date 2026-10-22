using System.Net;
using System.Net.Http.Json;
using Sesi.Catalogo.Api.Dtos;

namespace Sesi.Catalogo.Api.Tests;

/// <summary>GET /api/cursos/{id}, /api/filtros, /api/health e o comportamento de rotas desconhecidas.</summary>
[Collection(ApiCollection.Nome)]
public class DetalheEFiltrosTests(ApiFactory fabrica)
{
    private readonly HttpClient _http = fabrica.CreateClient();

    [Fact]
    public async Task Detalhe_do_curso_1_traz_modulos_aulas_e_perguntas_frequentes()
    {
        var curso = (await _http.GetFromJsonAsync<CursoDetalheDto>("/api/cursos/1"))!;

        Assert.Equal(1, curso.Id);
        Assert.Equal(10, curso.Modulos.Count);
        Assert.Equal(2, curso.Secoes.Count);
        Assert.Equal(10, curso.Faqs.Count);
        Assert.Equal("Introdução à Matemática na Metalurgia", curso.Modulos[0].Titulo);
        Assert.Equal(3, curso.Modulos[0].Topicos.Count);
        Assert.StartsWith("Explore nosso curso", curso.Sobre);
    }

    [Fact]
    public async Task Modulos_secoes_e_perguntas_vem_ordenados()
    {
        var curso = (await _http.GetFromJsonAsync<CursoDetalheDto>("/api/cursos/1"))!;

        Assert.Equal(Enumerable.Range(1, 10), curso.Modulos.Select(m => m.Ordem));
        Assert.Equal(Enumerable.Range(1, 10), curso.Faqs.Select(f => f.Ordem));
    }

    [Theory]
    [InlineData(1)] [InlineData(2)] [InlineData(3)] [InlineData(4)]
    [InlineData(5)] [InlineData(6)] [InlineData(7)] [InlineData(8)]
    public async Task Todos_os_cursos_tem_conteudo_completo_no_detalhe(int id)
    {
        var curso = (await _http.GetFromJsonAsync<CursoDetalheDto>($"/api/cursos/{id}"))!;

        Assert.NotEmpty(curso.Modulos);
        Assert.All(curso.Modulos, m => Assert.NotEmpty(m.Topicos));
        Assert.NotEmpty(curso.Secoes);
        Assert.NotEmpty(curso.Faqs);
        Assert.False(string.IsNullOrWhiteSpace(curso.Sobre));
    }

    [Fact]
    public async Task Curso_inexistente_devolve_404_em_json()
    {
        var resposta = await _http.GetAsync("/api/cursos/999");

        Assert.Equal(HttpStatusCode.NotFound, resposta.StatusCode);
        Assert.Equal("application/json", resposta.Content.Headers.ContentType?.MediaType);
        Assert.Contains("não encontrado", await resposta.Content.ReadAsStringAsync());
    }

    [Theory]
    [InlineData("/api/cursos/abc")]
    [InlineData("/api/rota-que-nao-existe")]
    [InlineData("/api/cursos/1/extra")]
    public async Task Rotas_de_api_desconhecidas_devolvem_404_em_json_e_nao_o_index_html(string caminho)
    {
        var resposta = await _http.GetAsync(caminho);

        Assert.Equal(HttpStatusCode.NotFound, resposta.StatusCode);
        Assert.Equal("application/json", resposta.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Filtros_listam_categorias_modalidades_e_status_com_rotulos()
    {
        var filtros = (await _http.GetFromJsonAsync<FiltrosDto>("/api/filtros"))!;

        Assert.Equal(
            new[] { "Ciências da Natureza", "Linguagens", "Matemática", "Sustentabilidade" },
            filtros.Categorias.Select(c => c.Nome));
        Assert.Equal(new[] { "Online", "Presencial", "Híbrido" }, filtros.Modalidades.Select(m => m.Rotulo));
        Assert.Equal(new[] { "Hibrido" }, filtros.Modalidades.Where(m => m.Rotulo == "Híbrido").Select(m => m.Valor));
        Assert.Equal(new[] { "Disponível", "Em breve", "Encerrado" }, filtros.Status.Select(s => s.Rotulo));
    }

    [Fact]
    public async Task Todo_valor_de_filtro_oferecido_e_aceito_pela_listagem()
    {
        var filtros = (await _http.GetFromJsonAsync<FiltrosDto>("/api/filtros"))!;

        foreach (var c in filtros.Categorias)
            Assert.Equal(HttpStatusCode.OK, (await _http.GetAsync($"/api/cursos?categoria={c.Slug}")).StatusCode);
        foreach (var m in filtros.Modalidades)
            Assert.Equal(HttpStatusCode.OK, (await _http.GetAsync($"/api/cursos?modalidade={m.Valor}")).StatusCode);
        foreach (var s in filtros.Status)
            Assert.Equal(HttpStatusCode.OK, (await _http.GetAsync($"/api/cursos?status={s.Valor}")).StatusCode);
    }

    [Fact]
    public async Task Health_responde_ok()
    {
        var resposta = await _http.GetAsync("/api/health");

        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
        Assert.Contains("ok", await resposta.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Rotas_do_front_end_caem_no_fallback_da_spa_e_nao_no_404_da_api()
    {
        // Sem o build do React em wwwroot (ambiente de testes) o fallback não tem arquivo para servir,
        // mas a rota NÃO pode ser tratada como uma rota da API (que responderia JSON com "erro").
        var resposta = await _http.GetAsync("/cursos/1");

        Assert.NotEqual("application/json", resposta.Content.Headers.ContentType?.MediaType);
    }

    [Fact]
    public async Task Resposta_de_api_e_comprimida_quando_o_cliente_aceita()
    {
        using var requisicao = new HttpRequestMessage(HttpMethod.Get, "/api/cursos/1");
        requisicao.Headers.AcceptEncoding.ParseAdd("gzip");
        var cliente = fabrica.CreateDefaultClient(new NoDecompressionHandler());

        var resposta = await cliente.SendAsync(requisicao);

        Assert.Contains("gzip", resposta.Content.Headers.ContentEncoding);
    }

    private sealed class NoDecompressionHandler : DelegatingHandler;
}
