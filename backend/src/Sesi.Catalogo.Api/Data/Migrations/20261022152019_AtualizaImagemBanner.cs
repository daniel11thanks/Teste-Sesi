using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Sesi.Catalogo.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AtualizaImagemBanner : Migration
    {
        /// <inheritdoc />
        // Migration só de dados: as fotos do site passaram de PNG (3 a 4 MB) para WebP otimizado (dezenas de KB).
        // Bancos criados antes dessa mudança ainda guardam o caminho antigo da imagem do curso 1.
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "UPDATE Cursos SET ImagemUrl = '/assets/banner-ava.webp' WHERE ImagemUrl = '/assets/banner-ava.png';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "UPDATE Cursos SET ImagemUrl = '/assets/banner-ava.png' WHERE ImagemUrl = '/assets/banner-ava.webp';");
        }
    }
}
