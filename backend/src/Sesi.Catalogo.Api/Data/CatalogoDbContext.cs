using Microsoft.EntityFrameworkCore;
using Sesi.Catalogo.Api.Models;

namespace Sesi.Catalogo.Api.Data;

public class CatalogoDbContext(DbContextOptions<CatalogoDbContext> options) : DbContext(options)
{
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Curso> Cursos => Set<Curso>();
    public DbSet<Modulo> Modulos => Set<Modulo>();
    public DbSet<SecaoConteudo> Secoes => Set<SecaoConteudo>();
    public DbSet<Faq> Faqs => Set<Faq>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Categoria>(e =>
        {
            e.HasIndex(c => c.Slug).IsUnique();
            e.Property(c => c.Slug).HasMaxLength(60);
            e.Property(c => c.Nome).HasMaxLength(80);
        });

        modelBuilder.Entity<Curso>(e =>
        {
            e.Property(c => c.NomeCompleto).HasMaxLength(200);
            e.Property(c => c.NomeBreve).HasMaxLength(80);
            e.Property(c => c.Descricao).HasMaxLength(500);
            e.Property(c => c.PublicoAlvo).HasMaxLength(300);
            e.Property(c => c.ImagemUrl).HasMaxLength(300);
            e.Property(c => c.Modalidade).HasConversion<string>().HasMaxLength(20);
            e.Property(c => c.Status).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(c => c.BuscaNormalizada);
            e.HasIndex(c => c.Status);
            e.HasOne(c => c.Categoria).WithMany(c => c.Cursos).HasForeignKey(c => c.CategoriaId);
            e.HasMany(c => c.Modulos).WithOne().HasForeignKey(m => m.CursoId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(c => c.Secoes).WithOne().HasForeignKey(s => s.CursoId).OnDelete(DeleteBehavior.Cascade);
            e.HasMany(c => c.Faqs).WithOne().HasForeignKey(f => f.CursoId).OnDelete(DeleteBehavior.Cascade);
        });

        // List<string> é gravada como JSON (coleção primitiva do EF Core).
        modelBuilder.Entity<Modulo>().Property(m => m.Titulo).HasMaxLength(200);
        modelBuilder.Entity<SecaoConteudo>().Property(s => s.Titulo).HasMaxLength(120);
        modelBuilder.Entity<Faq>().Property(f => f.Pergunta).HasMaxLength(300);
    }
}
