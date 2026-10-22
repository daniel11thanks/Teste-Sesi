using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Sesi.Catalogo.Api.Data;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Tests;

/// <summary>Normalização da pesquisa (unitário) e regras do enunciado sobre os dados fictícios (seed).</summary>
public class TextoBuscaTests
{
    [Theory]
    [InlineData("Química", "quimica")]
    [InlineData("  Química   e  Sustentabilidade ", "quimica e sustentabilidade")]
    [InlineData("MATEMÁTICA para a Precisão", "matematica para a precisao")]
    [InlineData("Estatística e Controle de Qualidade na Produção", "estatistica e controle de qualidade na producao")]
    [InlineData("ção ãõ ñ ü", "cao ao n u")]
    [InlineData("", "")]
    [InlineData("   ", "")]
    [InlineData(null, "")]
    public void Normalizar_remove_acentos_minusculiza_e_compacta_espacos(string? entrada, string esperado)
    {
        Assert.Equal(esperado, TextoBusca.Normalizar(entrada));
    }
}

[Collection(ApiCollection.Nome)]
public class SeedDataTests(ApiFactory fabrica)
{
    private async Task<T> ComBancoAsync<T>(Func<CatalogoDbContext, Task<T>> acao)
    {
        await using var escopo = fabrica.Services.CreateAsyncScope();
        return await acao(escopo.ServiceProvider.GetRequiredService<CatalogoDbContext>());
    }

    [Fact]
    public async Task Testes_usam_um_banco_temporario_e_nunca_o_de_desenvolvimento()
    {
        var conexao = await ComBancoAsync(db => Task.FromResult(db.Database.GetConnectionString()));

        Assert.Contains(fabrica.ArquivoBanco, conexao);
        Assert.Contains("catalogo-testes-", conexao);
        Assert.True(File.Exists(fabrica.ArquivoBanco));
    }

    [Fact]
    public async Task Seed_atende_aos_minimos_do_enunciado()
    {
        var cursos = await ComBancoAsync(db => db.Cursos.AsNoTracking().Include(c => c.Categoria).ToListAsync());

        Assert.True(cursos.Count >= 6, "mínimo de 6 cursos");
        Assert.True(cursos.Select(c => c.CategoriaId).Distinct().Count() >= 3, "mínimo de 3 categorias");
        Assert.True(cursos.Select(c => c.Modalidade).Distinct().Count() >= 2, "mínimo de 2 modalidades");
        Assert.True(cursos.Select(c => c.Status).Distinct().Count() >= 3, "mínimo de 3 status");
        Assert.True(cursos.Select(c => c.CargaHoraria).Distinct().Count() >= 4, "cargas horárias diferentes");
        Assert.True(cursos.Select(c => c.PublicoAlvo).Distinct().Count() == cursos.Count, "públicos-alvo diferentes");
    }

    [Fact]
    public async Task Todos_os_campos_obrigatorios_estao_preenchidos()
    {
        var cursos = await ComBancoAsync(db => db.Cursos.AsNoTracking().ToListAsync());

        Assert.All(cursos, c =>
        {
            Assert.False(string.IsNullOrWhiteSpace(c.NomeCompleto));
            Assert.False(string.IsNullOrWhiteSpace(c.NomeBreve));
            Assert.False(string.IsNullOrWhiteSpace(c.Descricao));
            Assert.False(string.IsNullOrWhiteSpace(c.PublicoAlvo));
            Assert.False(string.IsNullOrWhiteSpace(c.ImagemUrl));
            Assert.True(c.CargaHoraria > 0);
            Assert.False(string.IsNullOrWhiteSpace(c.BuscaNormalizada));
        });
    }

    [Fact]
    public async Task Cursos_em_breve_tem_data_futura_e_encerrados_data_passada()
    {
        var cursos = await ComBancoAsync(db => db.Cursos.AsNoTracking().ToListAsync());
        var referencia = new DateOnly(2026, 10, 22); // data do desenvolvimento; os dados fictícios foram escritos em torno dela

        Assert.All(cursos.Where(c => c.Status == StatusCurso.EmBreve), c => Assert.True(c.DataDisponibilizacao > referencia));
        Assert.All(cursos.Where(c => c.Status == StatusCurso.Encerrado), c => Assert.True(c.DataDisponibilizacao < referencia));
    }

    [Fact]
    public async Task Seed_executado_de_novo_nao_duplica_os_dados()
    {
        var antes = await ComBancoAsync(db => db.Cursos.CountAsync());

        await ComBancoAsync(async db => { await SeedData.ExecutarAsync(db); return 0; });

        Assert.Equal(antes, await ComBancoAsync(db => db.Cursos.CountAsync()));
        Assert.Equal(4, await ComBancoAsync(db => db.Categorias.CountAsync()));
    }

    [Fact]
    public async Task Imagens_do_seed_apontam_para_arquivos_existentes_no_front_end()
    {
        var urls = await ComBancoAsync(db => db.Cursos.AsNoTracking().Select(c => c.ImagemUrl).ToListAsync());
        var publico = LocalizarPastaPublicaDoFrontEnd();

        Assert.All(urls, url => Assert.True(File.Exists(Path.Combine(publico, url.TrimStart('/'))), $"imagem inexistente: {url}"));
    }

    // Parte do caminho deste arquivo-fonte (gravado na compilação) e não da pasta do binário, que pode estar fora do repositório.
    private static string LocalizarPastaPublicaDoFrontEnd([System.Runtime.CompilerServices.CallerFilePath] string arquivoFonte = "")
    {
        var dir = new DirectoryInfo(Path.GetDirectoryName(arquivoFonte)!);
        while (dir is not null && !Directory.Exists(Path.Combine(dir.FullName, "frontend", "public")))
            dir = dir.Parent;
        return dir is null
            ? throw new DirectoryNotFoundException("frontend/public não encontrado a partir de " + arquivoFonte)
            : Path.Combine(dir.FullName, "frontend", "public");
    }
}
