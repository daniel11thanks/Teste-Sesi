using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Sesi.Catalogo.Api.Data;

namespace Sesi.Catalogo.Api.Tests;

/// <summary>
/// A migration "AtualizaImagemBanner" corrige o caminho da imagem do curso 1 em bancos criados antes da
/// conversão das fotos para WebP. Aqui ela é aplicada a um banco "antigo" montado de propósito.
/// </summary>
public class MigracaoTests : IDisposable
{
    private const string MigracaoInicial = "20261022134315_Inicial";
    private readonly string _arquivo = Path.Combine(Path.GetTempPath(), $"catalogo-migracao-{Guid.NewGuid():N}.db");

    private CatalogoDbContext NovoContexto() =>
        new(new DbContextOptionsBuilder<CatalogoDbContext>().UseSqlite($"Data Source={_arquivo}").Options);

    [Fact]
    public async Task Banco_antigo_com_png_passa_a_apontar_para_webp_e_outras_imagens_nao_mudam()
    {
        await using (var db = NovoContexto())
        {
            // banco no estado anterior à migration de dados
            await db.GetService<IMigrator>().MigrateAsync(MigracaoInicial);
            await db.Database.ExecuteSqlRawAsync("INSERT INTO Categorias (Id, Slug, Nome) VALUES (1, 'matematica', 'Matemática')");
            await InserirCursoAsync(db, 1, "/assets/banner-ava.png");
            await InserirCursoAsync(db, 2, "/cursos/geometria-textil.svg");
        }

        await using (var db = NovoContexto())
        {
            await db.Database.MigrateAsync(); // aplica as migrations pendentes
        }

        await using (var db = NovoContexto())
        {
            var imagens = await db.Cursos.AsNoTracking().OrderBy(c => c.Id).Select(c => c.ImagemUrl).ToListAsync();
            Assert.Equal(new[] { "/assets/banner-ava.webp", "/cursos/geometria-textil.svg" }, imagens);
        }
    }

    [Fact]
    public async Task Banco_novo_aplica_todas_as_migrations_sem_pendencias()
    {
        await using var db = NovoContexto();

        await db.Database.MigrateAsync();

        Assert.Empty(await db.Database.GetPendingMigrationsAsync());
        Assert.Equal(2, (await db.Database.GetAppliedMigrationsAsync()).Count());
    }

    private static Task<int> InserirCursoAsync(CatalogoDbContext db, int id, string imagem) =>
        db.Database.ExecuteSqlRawAsync(
            """
            INSERT INTO Cursos (Id, NomeCompleto, NomeBreve, Descricao, Sobre, CategoriaId, Modalidade, CargaHoraria,
                                PublicoAlvo, Status, ImagemUrl, DataDisponibilizacao, BuscaNormalizada)
            VALUES ({0}, 'Curso de teste', 'Teste', 'Descrição', 'Sobre', 1, 'Online', 10,
                    'Público', 'Disponivel', {1}, NULL, 'curso de teste teste')
            """,
            id, imagem);

    public void Dispose()
    {
        SqliteConnection.ClearAllPools();
        foreach (var sufixo in new[] { "", "-shm", "-wal" })
        {
            try { File.Delete(_arquivo + sufixo); } catch (IOException) { }
        }
    }
}
