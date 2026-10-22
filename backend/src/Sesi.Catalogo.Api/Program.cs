using Microsoft.EntityFrameworkCore;
using Sesi.Catalogo.Api.Data;
using Sesi.Catalogo.Api.Endpoints;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Catalogo")
    ?? "Data Source=catalogo.db";

builder.Services.AddDbContext<CatalogoDbContext>(o => o.UseSqlite(connectionString));

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

app.UseCors();
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapCursos();

// Rotas do React Router (SPA): qualquer caminho que não seja API cai no index.html.
app.MapFallbackToFile("index.html");

app.Run();
