namespace SimpleRecipeSite.Recipes;

public class Recipe
{
    public int Id { get; set; }

    public required string Title { get; set; }

    public string? Slug { get; set; }

    public string? Introduction { get; set; }

    public string? Objective { get; set; }

    public required string Ingredients { get; set; }

    public string? Preparation { get; set; }

    public required string Execution { get; set; }

    public string? Reflection { get; set; }

    public string? Variation { get; set; }

    public string? Category { get; set; }

    public string? TimeEstimate { get; set; }

    public string? Difficulty { get; set; }

    public string? Source { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public DateTime UpdatedAtUtc { get; set; }
}
