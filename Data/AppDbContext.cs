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
            entity.Property(recipe => recipe.Id).HasColumnName("id");
            entity.Property(recipe => recipe.Title).HasColumnName("title");
            entity.Property(recipe => recipe.Slug).HasColumnName("slug");
            entity.Property(recipe => recipe.Introduction).HasColumnName("introduction");
            entity.Property(recipe => recipe.Objective).HasColumnName("objective");
            entity.Property(recipe => recipe.Ingredients).HasColumnName("ingredients");
            entity.Property(recipe => recipe.Preparation).HasColumnName("preparation");
            entity.Property(recipe => recipe.Execution).HasColumnName("execution");
            entity.Property(recipe => recipe.Reflection).HasColumnName("reflection");
            entity.Property(recipe => recipe.Variation).HasColumnName("variation");
            entity.Property(recipe => recipe.Category).HasColumnName("category");
            entity.Property(recipe => recipe.TimeEstimate).HasColumnName("time_estimate");
            entity.Property(recipe => recipe.Difficulty).HasColumnName("difficulty");
            entity.Property(recipe => recipe.Source).HasColumnName("source");
            entity.Property(recipe => recipe.CreatedAtUtc).HasColumnName("created_at_utc");
            entity.Property(recipe => recipe.UpdatedAtUtc).HasColumnName("updated_at_utc");

            var createdAtUtc = new DateTime(2026, 5, 5, 0, 0, 0, DateTimeKind.Utc);

            entity.HasData(
                new Recipe
                {
                    Id = 1,
                    Title = "Scrambled Eggs",
                    Slug = "scrambled-eggs",
                    Introduction = "Most scrambled eggs are overcooked into rubber and regret. The dish is simple, which means every choice matters.",
                    Objective = "A soft, decadent scramble that still tastes unmistakably like egg.",
                    Ingredients = "2 to 3 eggs per person\nA small knob of butter\nFine salt",
                    Preparation = "Use a small saucepan and a flexible spatula. Keep salt nearby. Start with less butter than you think and adjust next time.",
                    Execution = "Melt butter over gentle heat.\nAdd beaten eggs and stir slowly, scraping the base often.\nTake the pan off heat while the eggs still look slightly underdone.\nResidual heat will finish them.\nTaste, then salt.",
                    Reflection = "If the eggs tightened too quickly, your heat was too high. If they turned dry, you cooked a minute too long. Next batch: lower heat, earlier stop.",
                    Variation = "Better eggs improve flavor immediately.\nA spoon of creme fraiche at the end gives extra silk.\nFresh chives and black pepper are optional, not mandatory.",
                    Category = "Breakfast",
                    TimeEstimate = "About 10 minutes",
                    Difficulty = "Beginner",
                    Source = "Kitchen notes",
                    CreatedAtUtc = createdAtUtc,
                    UpdatedAtUtc = createdAtUtc
                },
                new Recipe
                {
                    Id = 2,
                    Title = "Tomato Soup",
                    Slug = "tomato-soup",
                    Introduction = "Tomato soup should feel bright and comforting at once, not flat or sweet.",
                    Objective = "A balanced soup with acidity, body, and warmth.",
                    Ingredients = "1 onion\n2 garlic cloves\n1 can whole tomatoes\nStock or water\nOlive oil\nSalt",
                    Preparation = "Slice onion and garlic before heating the pot. Keep a little stock aside for adjusting thickness later.",
                    Execution = "Cook onion gently in oil until soft.\nAdd garlic briefly.\nAdd tomatoes and stock, then simmer until integrated.\nBlend smooth or leave rustic.\nSeason in small steps.",
                    Reflection = "If it tastes dull, it usually needs salt first, then a touch of acidity. If too sharp, simmer longer.",
                    Variation = "Finish with cream for a softer bowl, or add chili for heat.",
                    Category = "Soup",
                    TimeEstimate = "30 to 40 minutes",
                    Difficulty = "Beginner",
                    Source = "Family notebook",
                    CreatedAtUtc = createdAtUtc,
                    UpdatedAtUtc = createdAtUtc
                },
                new Recipe
                {
                    Id = 3,
                    Title = "Roast Chicken Tray",
                    Slug = "roast-chicken-tray",
                    Introduction = "A tray roast is less about precision and more about sequencing and heat.",
                    Objective = "Juicy chicken with properly cooked vegetables in one pass.",
                    Ingredients = "Chicken pieces\nPotatoes\nCarrots\nOlive oil\nSalt and pepper",
                    Preparation = "Cut vegetables to similar size. Pat chicken dry so it roasts instead of steams.",
                    Execution = "Heat oven well before loading.\nToss vegetables with oil and seasoning.\nPlace chicken skin-side up with space between pieces.\nRoast until chicken is cooked and vegetables caramelized.\nRest before serving.",
                    Reflection = "Crowding the tray causes steaming. If vegetables lag behind, spread them out and give more high heat.",
                    Variation = "Swap carrots for fennel or onions. Lemon and thyme change the profile quickly.",
                    Category = "Dinner",
                    TimeEstimate = "About 1 hour",
                    Difficulty = "Intermediate",
                    Source = "Sunday routine",
                    CreatedAtUtc = createdAtUtc,
                    UpdatedAtUtc = createdAtUtc
                },
                new Recipe
                {
                    Id = 4,
                    Title = "Strawberry Jam",
                    Slug = "strawberry-jam",
                    Introduction = "Jam is about controlling moisture and timing, not just boiling fruit.",
                    Objective = "A spoonable jam that still tastes fresh.",
                    Ingredients = "Strawberries\nSugar\nLemon juice",
                    Preparation = "Wash and hull berries. Warm jars while cooking. Keep a cold plate in the freezer for set testing.",
                    Execution = "Cook berries and sugar until dissolved.\nAdd lemon juice and simmer steadily.\nSkim foam if needed.\nTest set on the cold plate.\nJar while hot.",
                    Reflection = "Underset jam needs longer simmer. Overcooked jam tastes dull and sticky.",
                    Variation = "A little black pepper or vanilla changes the finish without hiding the fruit.",
                    Category = "Preserves",
                    TimeEstimate = "45 to 60 minutes",
                    Difficulty = "Intermediate",
                    Source = "Summer preserve book",
                    CreatedAtUtc = createdAtUtc,
                    UpdatedAtUtc = createdAtUtc
                }
            );
        });
    }
}
