using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleRecipeSite.Data;

namespace SimpleRecipeSite.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var recipes = await dbContext.Recipes
            .AsNoTracking()
            .OrderBy(recipe => recipe.Title)
            .ToListAsync();

        return Ok(recipes);
    }
}
