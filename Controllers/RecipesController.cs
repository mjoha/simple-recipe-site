using Microsoft.AspNetCore.Mvc;

namespace SimpleRecipeSite.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecipesController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Recipes API ready" });
    }
}
