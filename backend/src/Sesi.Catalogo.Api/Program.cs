using Microsoft.EntityFrameworkCore;
using Sesi.Catalogo.Api.Data;
using Sesi.Catalogo.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Catalogo")
    ?? "Data Source=catalogo.db";

builder.Services.AddDbContext<CatalogoDbContext>(o => o.UseSqlite(connectionString));

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

app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapCursos();

// Rotas do React Router (SPA): qualquer caminho que não seja API cai no index.html.
app.MapFallbackToFile("index.html");

app.Run();
