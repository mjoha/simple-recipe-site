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
                    table.PrimaryKey("PK_recipes", x => x.id);
                });

            migrationBuilder.InsertData(
                table: "recipes",
                columns: new[] { "id", "category", "cook_minutes", "created_at_utc", "description", "ingredients", "instructions", "prep_minutes", "servings", "source", "title", "updated_at_utc" },
                values: new object[,]
                {
                    { 1, "Breakfast", 15, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "A simple family breakfast recipe.", "2 eggs\n200 ml milk\n150 g flour\n1 tsp baking powder\n1 pinch salt\nButter for frying", "Whisk eggs and milk.\nMix dry ingredients, then combine with wet ingredients.\nCook in a buttered pan until golden on both sides.", 10, 4, "Family recipe", "Pancakes", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, "Breakfast", 10, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Warm oats with fruit and cinnamon.", "80 g oats\n400 ml milk\n1 apple\n1 tsp cinnamon", "Simmer oats in milk.\nStir in chopped apple and cinnamon.\nServe warm.", 5, 2, "Weekday staple", "Oatmeal With Apple", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, "Breakfast", 6, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Soft eggs for a quick start.", "4 eggs\n2 tbsp milk\nSalt\nButter", "Whisk eggs with milk.\nCook gently in butter while stirring.\nSeason and serve.", 5, 2, "Family basics", "Scrambled Eggs", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, "Breakfast", null, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "No-cook breakfast bowl.", "300 g yogurt\n1 cup berries\n2 tbsp nuts\n1 tbsp honey", "Add yogurt to bowls.\nTop with berries, nuts, and honey.\nServe immediately.", 5, 2, "Summer breakfast", "Yogurt Berry Bowl", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, "Soup", 25, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Simple smooth tomato soup.", "1 onion\n2 cloves garlic\n800 g canned tomatoes\n500 ml stock", "Saute onion and garlic.\nAdd tomatoes and stock.\nSimmer and blend.", 10, 4, "Weeknight dinner", "Tomato Soup", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 6, "Soup", 30, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Comforting broth with noodles.", "1 onion\n2 carrots\n200 g chicken\n1.2 l stock\n120 g noodles", "Cook vegetables in pot.\nAdd stock and chicken, simmer.\nShred chicken and add noodles until tender.", 15, 4, "Cold-weather meal", "Chicken Noodle Soup", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 7, "Soup", 35, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Hearty pantry soup.", "1 cup lentils\n1 onion\n2 carrots\n1.2 l stock\n1 tsp cumin", "Saute vegetables.\nAdd lentils, stock, and cumin.\nSimmer until lentils are tender.", 10, 4, "Pantry recipe", "Lentil Soup", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 8, "Soup", 20, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Creamy mushroom soup without fuss.", "400 g mushrooms\n1 onion\n20 g butter\n500 ml stock\n100 ml cream", "Cook onion and mushrooms in butter.\nAdd stock and simmer.\nBlend partly, then stir in cream.", 10, 4, "Family notebook", "Mushroom Soup", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 9, "Dinner", 75, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "One-tray chicken and vegetables.", "1 whole chicken\n600 g potatoes\n3 carrots\n2 tbsp oil\nSalt and pepper", "Season chicken and vegetables.\nRoast until chicken is cooked through.\nRest before serving.", 15, 4, "Sunday dinner", "Roast Chicken Tray", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 10, "Dinner", 35, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Classic meat sauce pasta.", "400 g minced beef\n1 onion\n2 garlic cloves\n400 g tomatoes\n300 g spaghetti", "Brown beef with onion and garlic.\nAdd tomatoes and simmer.\nCook spaghetti and serve with sauce.", 10, 4, "Family favorite", "Spaghetti Bolognese", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 11, "Dinner", 12, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Fast vegetable dinner.", "1 broccoli\n1 pepper\n2 carrots\n2 tbsp soy sauce\n1 tbsp oil", "Slice vegetables.\nStir fry on high heat.\nAdd soy sauce and serve with rice.", 10, 3, "Quick dinner list", "Vegetable Stir Fry", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 12, "Dinner", 18, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Simple lemon salmon.", "4 salmon fillets\n1 lemon\n1 tbsp olive oil\nSalt\nPepper", "Season salmon and add lemon slices.\nBake until flaky.\nServe with potatoes or salad.", 8, 4, "Weeknight fish", "Baked Salmon", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 13, "Lunch", null, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Quick lunch sandwich.", "4 slices bread\n120 g turkey\nLettuce\nTomato\nMustard", "Toast bread if desired.\nLayer turkey, lettuce, and tomato.\nSpread mustard and close sandwich.", 7, 2, "Work lunch", "Turkey Sandwich", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 14, "Lunch", null, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Bright salad with chickpeas.", "1 can chickpeas\n1 cucumber\n2 tomatoes\n2 tbsp olive oil\n1 tbsp lemon juice", "Drain chickpeas and chop vegetables.\nMix with oil and lemon.\nSeason and serve.", 12, 3, "Light lunch", "Chickpea Salad", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 15, "Lunch", 12, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Cold pasta lunch.", "250 g pasta\n1 can tuna\n1 cup peas\n2 tbsp mayo\n1 tbsp lemon juice", "Cook and cool pasta.\nMix tuna, peas, mayo, and lemon.\nCombine and chill briefly.", 10, 4, "Picnic recipe", "Tuna Pasta Salad", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 16, "Lunch", 4, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Open sandwich with basil.", "4 slices bread\n2 tomatoes\n125 g mozzarella\nBasil\nOlive oil", "Toast bread.\nTop with tomato and mozzarella.\nFinish with basil and olive oil.", 8, 2, "Summer lunch", "Tomato Mozzarella Toast", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 17, "Baking", 50, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Moist loaf for snack time.", "3 ripe bananas\n2 eggs\n180 g flour\n100 g sugar\n1 tsp baking soda", "Mash bananas and mix with eggs.\nStir in dry ingredients.\nBake until golden.", 10, 8, "Grandma's notes", "Banana Bread", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 18, "Baking", 14, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Simple afternoon scones.", "300 g flour\n2 tsp baking powder\n75 g butter\n150 ml milk", "Rub butter into flour.\nAdd milk to form dough.\nCut rounds and bake.", 12, 8, "Tea-time recipe", "Scones", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 19, "Baking", 25, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Soft rolls with cinnamon filling.", "500 g flour\n250 ml milk\n7 g yeast\n80 g sugar\n2 tsp cinnamon", "Mix dough and let rise.\nFill with sugar and cinnamon.\nRoll, slice, and bake.", 25, 10, "Weekend baking", "Cinnamon Rolls", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 20, "Baking", 40, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Basic everyday loaf.", "500 g whole wheat flour\n350 ml water\n7 g yeast\n1 tsp salt", "Knead dough and let rise.\nShape loaf and proof.\nBake until crusty.", 20, 10, "Daily bread", "Whole Wheat Bread", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 21, "Dessert", 10, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Quick stovetop dessert.", "500 ml milk\n40 g cocoa powder\n60 g sugar\n30 g cornstarch", "Whisk all ingredients cold.\nCook while stirring until thick.\nChill before serving.", 8, 4, "Family dessert", "Chocolate Pudding", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 22, "Dessert", 35, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Warm apples under crunchy topping.", "6 apples\n120 g flour\n80 g sugar\n80 g butter\n1 tsp cinnamon", "Slice apples and season.\nRub crumble topping ingredients.\nBake until bubbling and golden.", 15, 6, "Autumn favorite", "Apple Crumble", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 23, "Dessert", 70, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Creamy baked rice pudding.", "120 g short-grain rice\n1 l milk\n60 g sugar\n1 tsp vanilla", "Mix ingredients in baking dish.\nBake slowly, stirring once.\nServe warm or cold.", 10, 6, "Old cookbook", "Rice Pudding", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 24, "Dessert", 30, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Tangy bars with short crust.", "150 g flour\n90 g butter\n180 g sugar\n2 eggs\n2 lemons", "Bake crust first.\nWhisk lemon filling and pour over crust.\nBake again and cool.", 15, 12, "Bake sale", "Lemon Bars", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 25, "Sides", 20, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Creamy mashed potatoes.", "1 kg potatoes\n40 g butter\n120 ml milk\nSalt", "Boil potatoes until tender.\nMash with butter and milk.\nSeason well.", 10, 4, "Dinner side", "Mashed Potatoes", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 26, "Sides", 25, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Sweet oven-roasted carrots.", "600 g carrots\n1 tbsp oil\nSalt\nPepper", "Slice carrots and season.\nRoast until browned at edges.\nServe warm.", 8, 4, "Sheet pan side", "Roasted Carrots", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 27, "Sides", null, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Fresh and simple salad.", "1 cucumber\n2 tbsp yogurt\n1 tbsp vinegar\nDill", "Slice cucumber thinly.\nMix dressing ingredients.\nToss and chill briefly.", 8, 3, "Summer table", "Cucumber Salad", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 28, "Sides", 10, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Pan-tossed green beans.", "400 g green beans\n2 cloves garlic\n1 tbsp olive oil\nSalt", "Blanch green beans.\nSaute garlic in oil.\nToss beans and season.", 8, 4, "Weeknight side", "Garlic Green Beans", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 29, "Preserves", 30, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Small-batch fruit preserve.", "1 kg strawberries\n700 g sugar\n2 tbsp lemon juice", "Cook strawberries with sugar.\nSimmer until jammy.\nJar while hot.", 15, null, "Summer preserving", "Strawberry Jam", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 30, "Preserves", 5, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Crunchy quick pickles.", "2 cucumbers\n250 ml vinegar\n250 ml water\n2 tbsp sugar\n1 tbsp salt", "Slice cucumbers.\nBoil brine ingredients.\nPour over cucumbers and cool.", 10, null, "Pantry shelf", "Pickled Cucumbers", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 31, "Preserves", 35, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Sweet-spiced chutney.", "800 g peaches\n1 onion\n150 ml vinegar\n100 g sugar\n1 tsp ginger", "Chop peaches and onion.\nCook with remaining ingredients.\nSimmer until thick.", 15, null, "Late summer batch", "Peach Chutney", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 32, null, 12, new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Light pasta with fresh herbs.", "300 g pasta\n2 tbsp olive oil\n2 cloves garlic\nParsley\nBasil", "Cook pasta.\nWarm oil with garlic.\nToss pasta with herbs and season.", 10, 3, "Garden season", "Garden Herb Pasta", new DateTime(2026, 5, 5, 0, 0, 0, 0, DateTimeKind.Utc) }
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
