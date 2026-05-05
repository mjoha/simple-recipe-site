# Simple Recipe Site

## Local Development

1. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

2. Apply database migrations:

   ```bash
   dotnet tool restore
   dotnet ef database update
   ```

   If your existing local Docker volume was created with older migrations and you hit schema mismatch issues, reset local DB volume first:

   ```bash
   docker compose down -v
   docker compose up -d
   dotnet ef database update
   ```

3. Build frontend TypeScript:

   ```bash
   npm run build
   ```

4. Run the app:

   ```bash
   dotnet run --launch-profile http
   ```

Frontend: `http://localhost:5002/`  
API: `http://localhost:5002/api/recipes`
