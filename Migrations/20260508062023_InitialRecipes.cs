using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SimpleRecipeSite.Migrations
{
    /// <inheritdoc />
    public partial class InitialRecipes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "recipes",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "text", nullable: false),
                    slug = table.Column<string>(type: "text", nullable: true),
                    introduction = table.Column<string>(type: "text", nullable: true),
                    objective = table.Column<string>(type: "text", nullable: true),
                    ingredients = table.Column<string>(type: "text", nullable: false),
                    preparation = table.Column<string>(type: "text", nullable: true),
                    execution = table.Column<string>(type: "text", nullable: false),
                    reflection = table.Column<string>(type: "text", nullable: true),
                    variation = table.Column<string>(type: "text", nullable: true),
                    category = table.Column<string>(type: "text", nullable: true),
                    time_estimate = table.Column<string>(type: "text", nullable: true),
                    difficulty = table.Column<string>(type: "text", nullable: true),
                    source = table.Column<string>(type: "text", nullable: true),
                    created_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_recipes", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "recipes",
                columns: new[] { "id", "category", "created_at_utc", "difficulty", "execution", "ingredients", "introduction", "objective", "preparation", "reflection", "slug", "source", "time_estimate", "title", "updated_at_utc", "variation" },
                values: new object[,]
                {
                    { 1, "Breakfast", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Beginner", "Melt butter over gentle heat.\nAdd beaten eggs and stir slowly, scraping the base often.\nTake the pan off heat while the eggs still look slightly underdone.\nResidual heat will finish them.\nTaste, then salt.", "2 to 3 eggs per person\nA small knob of butter\nFine salt", "Most scrambled eggs are overcooked into rubber and regret. The dish is simple, which means every choice matters.", "A soft, decadent scramble that still tastes unmistakably like egg.", "Use a small saucepan and a flexible spatula. Keep salt nearby. Start with less butter than you think and adjust next time.", "If the eggs tightened too quickly, your heat was too high. If they turned dry, you cooked a minute too long. Next batch: lower heat, earlier stop.", "scrambled-eggs", "Kitchen notes", "About 10 minutes", "Scrambled Eggs", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Better eggs improve flavor immediately.\nA spoon of creme fraiche at the end gives extra silk.\nFresh chives and black pepper are optional, not mandatory." },
                    { 2, "Soup", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Beginner", "Cook onion gently in oil until soft.\nAdd garlic briefly.\nAdd tomatoes and stock, then simmer until integrated.\nBlend smooth or leave rustic.\nSeason in small steps.", "1 onion\n2 garlic cloves\n1 can whole tomatoes\nStock or water\nOlive oil\nSalt", "Tomato soup should feel bright and comforting at once, not flat or sweet.", "A balanced soup with acidity, body, and warmth.", "Slice onion and garlic before heating the pot. Keep a little stock aside for adjusting thickness later.", "If it tastes dull, it usually needs salt first, then a touch of acidity. If too sharp, simmer longer.", "tomato-soup", "Family notebook", "30 to 40 minutes", "Tomato Soup", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Finish with cream for a softer bowl, or add chili for heat." },
                    { 3, "Dinner", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Intermediate", "Heat oven well before loading.\nToss vegetables with oil and seasoning.\nPlace chicken skin-side up with space between pieces.\nRoast until chicken is cooked and vegetables caramelized.\nRest before serving.", "Chicken pieces\nPotatoes\nCarrots\nOlive oil\nSalt and pepper", "A tray roast is less about precision and more about sequencing and heat.", "Juicy chicken with properly cooked vegetables in one pass.", "Cut vegetables to similar size. Pat chicken dry so it roasts instead of steams.", "Crowding the tray causes steaming. If vegetables lag behind, spread them out and give more high heat.", "roast-chicken-tray", "Sunday routine", "About 1 hour", "Roast Chicken Tray", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Swap carrots for fennel or onions. Lemon and thyme change the profile quickly." },
                    { 4, "Preserves", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Intermediate", "Cook berries and sugar until dissolved.\nAdd lemon juice and simmer steadily.\nSkim foam if needed.\nTest set on the cold plate.\nJar while hot.", "Strawberries\nSugar\nLemon juice", "Jam is about controlling moisture and timing, not just boiling fruit.", "A spoonable jam that still tastes fresh.", "Wash and hull berries. Warm jars while cooking. Keep a cold plate in the freezer for set testing.", "Underset jam needs longer simmer. Overcooked jam tastes dull and sticky.", "strawberry-jam", "Summer preserve book", "45 to 60 minutes", "Strawberry Jam", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "A little black pepper or vanilla changes the finish without hiding the fruit." }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "recipes");
        }
    }
}
