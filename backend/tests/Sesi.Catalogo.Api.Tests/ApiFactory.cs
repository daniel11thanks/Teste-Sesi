using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Sesi.Catalogo.Api.Tests;

/// <summary>
/// Sobe a API real em memória (pipeline HTTP completo, EF Core, migrations e seed), com um banco SQLite temporário
/// por execução, para que os testes nunca toquem no banco de desenvolvimento.
/// </summary>
public class ApiFactory : WebApplicationFactory<Program>
{
    private readonly string _arquivoBanco = Path.Combine(Path.GetTempPath(), $"catalogo-testes-{Guid.NewGuid():N}.db");

    public string ArquivoBanco => _arquivoBanco;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseSetting("ConnectionStrings:Catalogo", $"Data Source={_arquivoBanco}");
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (!disposing) return;

        foreach (var sufixo in new[] { "", "-shm", "-wal" })
        {
            try { File.Delete(_arquivoBanco + sufixo); } catch (IOException) { /* arquivo ainda em uso: o SO limpa o diretório temporário */ }
        }
    }
}

/// <summary>Uma única API (e um único banco) compartilhada por todas as classes de teste de integração.</summary>
[CollectionDefinition(Nome)]
public class ApiCollection : ICollectionFixture<ApiFactory>
{
    public const string Nome = "api";
}
