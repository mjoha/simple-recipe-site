using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

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
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    ingredients = table.Column<string>(type: "text", nullable: false),
                    instructions = table.Column<string>(type: "text", nullable: false),
                    category = table.Column<string>(type: "text", nullable: true),
                    servings = table.Column<int>(type: "integer", nullable: true),
                    prep_minutes = table.Column<int>(type: "integer", nullable: true),
                    cook_minutes = table.Column<int>(type: "integer", nullable: true),
                    source = table.Column<string>(type: "text", nullable: true),
                    created_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at_utc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_recipes", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "recipes",
                columns: new[] { "Id", "category", "cook_minutes", "created_at_utc", "description", "ingredients", "instructions", "prep_minutes", "servings", "source", "title", "updated_at_utc" },
                values: new object[] { 1, "Breakfast", 15, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "A simple family breakfast recipe.", "2 eggs\n200 ml milk\n150 g flour\n1 tsp baking powder\n1 pinch salt\nButter for frying", "Whisk eggs and milk.\nMix dry ingredients, then combine with wet ingredients.\nCook in a buttered pan until golden on both sides.", 10, 4, "Family recipe", "Pancakes", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "recipes");
        }
    }
}
