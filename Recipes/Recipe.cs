namespace SimpleRecipeSite.Recipes;

public class Recipe
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public string? Description { get; set; }

    public required string Ingredients { get; set; }

    public required string Instructions { get; set; }

    public string? Category { get; set; }

    public int? Servings { get; set; }

    public int? PrepMinutes { get; set; }

    public int? CookMinutes { get; set; }

    public string? Source { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }
}
