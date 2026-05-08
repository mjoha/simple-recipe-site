# Simple Recipe Site

## Local Development

1. Build recipes and frontend:

   ```bash
   npm run build
   ```

2. Run static dev server:

   ```bash
   npm run dev
   ```

Frontend: `http://localhost:5002/`
Recipe data: `http://localhost:5002/data/recipes.json`

## Authoring Recipes

- Source files live in `content/recipes/*.md`.
- Run `npm run build:recipes` to regenerate `wwwroot/data/recipes.json`.
- `npm run build` runs both recipe generation and TypeScript compilation.
