# Feature: Editorial Recipe Format

## Goal

Move the app away from conventional fixed-measurement recipe cards and toward an editorial cooking-guide format.

Recipes should teach judgment, technique, taste, and iteration. They should feel like written cooking guidance rather than rigid ingredient math.

The scrambled eggs example from the product discussion is the model: opinionated, useful, plainspoken, and structured around how to think while cooking.

---

## User Outcome

As a reader, I can open a recipe and understand:

- what the dish is trying to become
- what ingredients matter
- what to prepare
- how to execute the dish
- what mistakes to watch for
- how to adjust next time
- possible variations

The recipe should read like a short field guide entry, not a database card.

---

## Scope

### Include

- Update the recipe model to support editorial recipe sections.
- Update EF Core mapping and migration.
- Replace the current seed recipes with a smaller set of editorial sample recipes.
- Include the scrambled eggs recipe from the product discussion as a seed recipe.
- Update API response shape as needed.
- Update frontend TypeScript types.
- Update inline recipe rendering to show editorial sections.
- Preserve the recipe index, search, inline expansion, and hash URL behavior.
- Keep multiline plain text rendering.
- Update search to include the new editorial fields.

### Exclude

- No create/edit recipe UI.
- No user accounts.
- No voting/rating/contribution system.
- No comments.
- No markdown parser.
- No rich text editor.
- No ingredient normalization.
- No step table.
- No backend search endpoint.
- No frontend framework.
- No new dependencies.
- No images.

---

## Product Direction

The site is no longer aiming to be a standard recipe collection.

Avoid this shape:

```text
Ingredients
- 3 eggs
- 20 g butter
- 1/2 tsp salt

Steps
1. ...
```

Prefer this shape:

```text
Title

Introduction

Objective

Ingredients

Preparation

Execution

Reflection

Variation
```

The writing may include approximate amounts, but the model should not depend on fixed measurements.

---

## Suggested Recipe Model

Replace or reshape the existing recipe fields toward:

```csharp
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
```

Notes:

- Keep `Ingredients` as prose/plain text.
- Keep `Execution` as prose/plain text.
- Do not add structured ingredient or step tables.
- Prefer flexible string fields such as `TimeEstimate` over exact minute fields for now.
- `Slug` is optional in this feature. Add it only if useful and low-friction.

---

## Database Guidance

The app is still early and not deployed.

It is acceptable to replace/recreate the existing migration rather than preserve compatibility with the old seed/data shape.

Expected direction:

- remove rigid measurement-oriented fields if they no longer fit:
  - `description`
  - `instructions`
  - `servings`
  - `prep_minutes`
  - `cook_minutes`
- add editorial fields:
  - `introduction`
  - `objective`
  - `preparation`
  - `execution`
  - `reflection`
  - `variation`
  - `time_estimate`
  - `difficulty`
  - optionally `slug`

Keep snake_case column names.

---

## Seed Data

Replace the current large-ish test seed set with a smaller editorial set.

Include:

- `Scrambled Eggs`

Add only a few additional recipes if useful for testing the index, search, and expansion behavior. Quality matters more than quantity.

Guidelines:

- Each seed recipe should demonstrate the editorial format.
- Do not keep 30 generic measurement-style test recipes if they dilute the product direction.
- Use plain multiline strings.
- Keep the writing useful and readable.
- Avoid filler.

The scrambled eggs seed should preserve the spirit and structure of the provided sample:

- Introduction: bad scrambled eggs, rubber and regret, simplicity with consequence.
- Objective: decadent creamy scramble.
- Ingredients: eggs, butter, salt.
- Preparation: approximate butter guidance, saucepan, spatula, salt nearby.
- Execution: gentle heat, butter melting, add eggs, move gently, stop before fully done, salt/taste.
- Reflection: heat and overcooking are the common mistakes; try again and adjust.
- Variation: better eggs help, crème fraîche/herbs/pepper optional.

Do not worry about matching the sample text word-for-word unless explicitly requested.

---

## Frontend Rendering

Expanded recipes should render like an article entry:

```text
Scrambled Eggs

Intro paragraph...

Objective
...

Ingredients
...

Preparation
...

Execution
...

Reflection
...

Variation
...
```

Requirements:

- Only render optional sections when content exists.
- Preserve multiline text.
- Keep headings clear and quiet.
- Keep the inline expansion behavior.
- Keep the typography/readability direction intact.
- Do not introduce markdown parsing yet.

---

## Search Behavior

Update client-side search to include:

- Title
- Introduction
- Objective
- Ingredients
- Preparation
- Execution
- Reflection
- Variation
- Category
- Time estimate
- Difficulty
- Source

Remove references to old fields that no longer exist.

---

## API Requirements

- Keep `GET /api/recipes`.
- It should return the new editorial recipe shape.
- Keep the endpoint read-only.
- Do not add create/edit/delete.

---

## Verification

After implementation, verify:

- `dotnet tool restore` succeeds.
- Database migration can be applied cleanly.
- If migration history is recreated, document the local database reset command.
- `npm run build` succeeds.
- `dotnet build` succeeds.
- `npm run verify` succeeds.
- The recipe index still loads.
- Search still works.
- Inline expansion still works.
- `#/recipes/{id}` still opens the recipe.
- Scrambled Eggs renders with the editorial sections.
- No old measurement-oriented fields are referenced by TypeScript.

---

## Acceptance Criteria

- The data model supports editorial recipe sections.
- The old rigid prep/cook/servings-style rendering is removed or no longer primary.
- Seed data includes an editorial Scrambled Eggs recipe.
- Frontend rendering shows editorial sections in the expanded recipe.
- Search includes the new editorial fields.
- Existing index, expansion, and shareable hash-link behavior still works.
- No create/edit UI, accounts, comments, voting, markdown parser, rich text editor, or new dependencies are introduced.
