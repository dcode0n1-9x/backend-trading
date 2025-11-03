# Elysia with Bun Runtime
##### This project is a starter template for building APIs with Elysia and the Bun runtime. It also integrates Prisma for database management.

## Getting Started
Follow these steps to set up the project from scratch.

1. Install dependencies
Inside your project folder, install the required dependencies with:

``` 
bun install
```
2. Configure Environment Variables
Copy the .env.example file to .env:

```
cp .env.example .env
```
Open .env and adjust the environment variables as needed for your setup (e.g., database connection strings).

Verify all environment variables are correctly set and working in your environment.

3. Setup Prisma
Run these commands to initialize Prisma and prepare the database:

Generate Prisma client:

```
bunx prisma generate
```
Create migrations when you modify your Prisma schema:

```
bunx prisma migrate dev --create-only
```
Apply migrations to the database:

```
bunx prisma migrate deploy
```
Alternatively, for quick schema changes use:

```
bunx prisma db push
```
Open Prisma Studio UI to manage your database interactively:

```
bunx prisma studio
```
5. Development Server
Start the development server with hot reload:

```
bun run dev
```
Open your browser and navigate to:

```text
http://localhost:3000/
```
You should see the running application.

6. Running Tests
There is a placeholder for tests in the scripts, but no tests are configured yet.

## Scripts

| Script                                     | Description                                    |
|--------------------------------------------|------------------------------------------------|
| `bun run dev`                              | Start development server with hot reload       |
| `bunx prisma migrate dev --create-only`   | Create a new migration with Prisma              |
| `bunx prisma generate`                     | Generate Prisma client                          |
| `bunx prisma migrate deploy`               | Apply migrations to the database                 |
| `bunx prisma db push`                      | Push Prisma schema changes to the database         |
| `bunx prisma studio`                       | Open Prisma Studio UI for database management    |
| `test`                                    | Placeholder for running tests (not set up yet) |

Additional Tips
Always ensure your .env file is properly configured before running migrations or starting the server.

Use Prisma Studio (bunx prisma studio) for a visual overview of your database.

Keep your Prisma schema and migrations in sync.

Use bun run dev during development for live reloads.





