using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Sesi.Catalogo.Api.Data;
using Sesi.Catalogo.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

// Plataformas de hospedagem (Render, Heroku etc.) informam a porta pela variável PORT.
if (Environment.GetEnvironmentVariable("PORT") is { Length: > 0 } porta)
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{porta}");
}

var connectionString = builder.Configuration.GetConnectionString("Catalogo")
    ?? "Data Source=catalogo.db";

builder.Services.AddDbContext<CatalogoDbContext>(o => o.UseSqlite(connectionString));

builder.Services.AddResponseCompression();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(o =>
{
    o.SwaggerDoc("v1", new() { Title = "API do Catálogo de Cursos", Version = "v1" });
    o.EnableAnnotations();
});

// CORS apenas para o servidor de desenvolvimento do Vite; em produção o front é servido pela própria API.
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p
    .WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
    .AllowAnyHeader()
    .AllowAnyMethod()));

var app = builder.Build();

await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CatalogoDbContext>();
    await db.Database.MigrateAsync();
    await SeedData.ExecutarAsync(db);
}

// Documentação interativa: ligada em desenvolvimento ou com "Swagger:Habilitado": true.
if (app.Environment.IsDevelopment() || app.Configuration.GetValue<bool>("Swagger:Habilitado"))
{
    app.UseSwagger();
    app.UseSwaggerUI(o =>
    {
        o.SwaggerEndpoint("/swagger/v1/swagger.json", "Catálogo de Cursos v1");
        o.RoutePrefix = "swagger";
    });
}

app.UseResponseCompression();
app.UseCors();

// Cache: os arquivos do Vite têm hash no nome (index-AbCd1234.js) e nunca mudam, então podem ficar em cache por
// um ano; o index.html não, para que uma nova publicação seja percebida de imediato.
var arquivosHash = new Regex(@"^index-[\w-]{8,}\.(js|css)$", RegexOptions.Compiled);
var opcoesEstaticas = new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        var cabecalhos = ctx.Context.Response.Headers;
        if (arquivosHash.IsMatch(ctx.File.Name))
            cabecalhos.CacheControl = "public,max-age=31536000,immutable";
        else if (ctx.File.Name == "index.html")
            cabecalhos.CacheControl = "no-cache";
    },
};

app.UseDefaultFiles();
app.UseStaticFiles(opcoesEstaticas);

app.MapCursos();

// Rotas do React Router (SPA): qualquer caminho que não seja API cai no index.html.
app.MapFallbackToFile("index.html", opcoesEstaticas);

app.Run();

// Necessário para os testes de integração (WebApplicationFactory<Program>) acessarem o ponto de entrada.
public partial class Program;
