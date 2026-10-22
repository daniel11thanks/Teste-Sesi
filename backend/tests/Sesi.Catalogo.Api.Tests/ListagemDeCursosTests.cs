using System.Net;
using System.Net.Http.Json;
using Sesi.Catalogo.Api.Dtos;

namespace Sesi.Catalogo.Api.Tests;

/// <summary>GET /api/cursos: listagem, pesquisa por nome e filtros combináveis.</summary>
[Collection(ApiCollection.Nome)]
public class ListagemDeCursosTests(ApiFactory fabrica)
{
    private readonly HttpClient _http = fabrica.CreateClient();

    private async Task<ListaCursosDto> ListarAsync(string consulta = "")
    {
        var resposta = await _http.GetAsync($"/api/cursos{consulta}");
        resposta.EnsureSuccessStatusCode();
        return (await resposta.Content.ReadFromJsonAsync<ListaCursosDto>())!;
    }

    [Fact]
    public async Task Sem_parametros_lista_todos_os_cursos_com_o_total()
    {
        var lista = await ListarAsync();

        Assert.Equal(8, lista.Total);
        Assert.Equal(lista.Total, lista.Itens.Count);
        Assert.Equal(lista.Itens.Select(c => c.Id).Order(), lista.Itens.Select(c => c.Id));
    }

    [Fact]
    public async Task Resposta_traz_todos_os_campos_exigidos_pelo_enunciado()
    {
        var curso = (await ListarAsync()).Itens.First(c => c.Id == 1);

        Assert.Equal("Matemática para a Precisão: Medidas e Escalas na Metalurgia", curso.NomeCompleto);
        Assert.Equal("Matemática para a Precisão", curso.NomeBreve);
        Assert.False(string.IsNullOrWhiteSpace(curso.Descricao));
        Assert.Equal("matematica", curso.Categoria.Slug);
        Assert.Equal("Online", curso.Modalidade.Valor);
        Assert.Equal(60, curso.CargaHoraria);
        Assert.False(string.IsNullOrWhiteSpace(curso.PublicoAlvo));
        Assert.Equal("Disponivel", curso.Status.Valor);
        Assert.Equal("Disponível", curso.Status.Rotulo);
        Assert.False(string.IsNullOrWhiteSpace(curso.ImagemUrl));
        Assert.Equal(new DateOnly(2026, 1, 5), curso.DataDisponibilizacao);
    }

    [Theory]
    [InlineData("quimica", 1)]          // sem acento encontra "Química"
    [InlineData("QUÍMICA", 1)]          // maiúsculas e acento
    [InlineData("  quimica  ", 1)]      // espaços nas pontas
    [InlineData("sustentabilidade", 1)]
    [InlineData("metalurgia", 3)]       // aparece no nome completo dos cursos 1, 4 e 6
    [InlineData("matematica para a precisao", 1)]
    [InlineData("zzzz", 0)]
    public async Task Pesquisa_por_nome_ignora_acentos_e_maiusculas(string busca, int esperado)
    {
        var lista = await ListarAsync($"?busca={Uri.EscapeDataString(busca)}");

        Assert.Equal(esperado, lista.Total);
    }

    [Fact]
    public async Task Pesquisa_tambem_considera_o_nome_breve()
    {
        var lista = await ListarAsync("?busca=Geometria no Design");

        Assert.Equal(new[] { 2 }, lista.Itens.Select(c => c.Id));
    }

    [Fact]
    public async Task Busca_vazia_ou_so_com_espacos_equivale_a_sem_busca()
    {
        Assert.Equal(8, (await ListarAsync("?busca=")).Total);
        Assert.Equal(8, (await ListarAsync("?busca=%20%20")).Total);
    }

    [Theory]
    [InlineData("categoria=matematica", 3)]
    [InlineData("categoria=ciencias-da-natureza", 3)]
    [InlineData("categoria=linguagens", 1)]
    [InlineData("categoria=sustentabilidade", 1)]
    [InlineData("categoria=nao-existe", 0)]
    [InlineData("modalidade=Online", 4)]
    [InlineData("modalidade=Presencial", 2)]
    [InlineData("modalidade=Hibrido", 2)]
    [InlineData("status=Disponivel", 5)]
    [InlineData("status=EmBreve", 2)]
    [InlineData("status=Encerrado", 1)]
    public async Task Filtros_isolados(string consulta, int esperado)
    {
        var lista = await ListarAsync($"?{consulta}");

        Assert.Equal(esperado, lista.Total);
    }

    [Fact]
    public async Task Valores_de_filtro_nao_diferenciam_maiusculas()
    {
        Assert.Equal(2, (await ListarAsync("?modalidade=hibrido")).Total);
        Assert.Equal(2, (await ListarAsync("?status=embreve")).Total);
        Assert.Equal(3, (await ListarAsync("?categoria=MATEMATICA")).Total);
    }

    [Fact]
    public async Task Pesquisa_e_filtros_se_combinam()
    {
        var lista = await ListarAsync("?busca=matematica&categoria=matematica&status=Disponivel");

        Assert.Equal(new[] { 1 }, lista.Itens.Select(c => c.Id));
    }

    [Fact]
    public async Task Combinacao_sem_correspondencia_devolve_lista_vazia_e_status_200()
    {
        var resposta = await _http.GetAsync("/api/cursos?categoria=linguagens&status=Encerrado");

        Assert.Equal(HttpStatusCode.OK, resposta.StatusCode);
        var lista = (await resposta.Content.ReadFromJsonAsync<ListaCursosDto>())!;
        Assert.Equal(0, lista.Total);
        Assert.Empty(lista.Itens);
    }

    [Fact]
    public async Task Todos_os_filtros_juntos_restringem_o_resultado()
    {
        var lista = await ListarAsync("?categoria=ciencias-da-natureza&modalidade=Hibrido&status=Disponivel");

        Assert.Equal(new[] { 4 }, lista.Itens.Select(c => c.Id));
    }

    [Theory]
    [InlineData("modalidade=Remoto")]
    [InlineData("status=Cancelado")]
    public async Task Valor_invalido_de_enum_devolve_400_com_mensagem(string consulta)
    {
        var resposta = await _http.GetAsync($"/api/cursos?{consulta}");

        Assert.Equal(HttpStatusCode.BadRequest, resposta.StatusCode);
        Assert.Equal("application/json", resposta.Content.Headers.ContentType?.MediaType);
        Assert.Contains("inválid", await resposta.Content.ReadAsStringAsync());
    }
}
