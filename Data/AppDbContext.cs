using Microsoft.EntityFrameworkCore;
using SimpleRecipeSite.Recipes;

namespace SimpleRecipeSite.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Recipe> Recipes => Set<Recipe>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.ToTable("recipes");
            entity.Property(recipe => recipe.Title).HasColumnName("title");
            entity.Property(recipe => recipe.Description).HasColumnName("description");
            entity.Property(recipe => recipe.Ingredients).HasColumnName("ingredients");
            entity.Property(recipe => recipe.Instructions).HasColumnName("instructions");
            entity.Property(recipe => recipe.Category).HasColumnName("category");
            entity.Property(recipe => recipe.Servings).HasColumnName("servings");
            entity.Property(recipe => recipe.PrepMinutes).HasColumnName("prep_minutes");
            entity.Property(recipe => recipe.CookMinutes).HasColumnName("cook_minutes");
            entity.Property(recipe => recipe.Source).HasColumnName("source");
            entity.Property(recipe => recipe.CreatedAtUtc).HasColumnName("created_at_utc");
            entity.Property(recipe => recipe.UpdatedAtUtc).HasColumnName("updated_at_utc");

            entity.HasData(new Recipe
            {
                Id = 1,
                Title = "Pancakes",
                Description = "A simple family breakfast recipe.",
                Ingredients = "2 eggs\n200 ml milk\n150 g flour\n1 tsp baking powder\n1 pinch salt\nButter for frying",
                Instructions = "Whisk eggs and milk.\nMix dry ingredients, then combine with wet ingredients.\nCook in a buttered pan until golden on both sides.",
                Category = "Breakfast",
                Servings = 4,
                PrepMinutes = 10,
                CookMinutes = 15,
                Source = "Family recipe",
                CreatedAtUtc = new DateTime(2026, 5, 5, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAtUtc = new DateTime(2026, 5, 5, 0, 0, 0, DateTimeKind.Utc)
            });
        });
    }
}
