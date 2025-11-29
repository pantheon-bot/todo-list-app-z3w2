# Todo List App

A full-stack Todo List application built with Next.js 16, TypeScript, TiDB Cloud Serverless, and Kysely query builder.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: TiDB Cloud Serverless (MySQL-compatible)
- **Query Builder**: Kysely with TiDB dialect
- **Styling**: Tailwind CSS with dark mode support

## Features

- Create, read, update, and delete todos
- Mark todos as completed/not completed
- Filter todos by status (All, Active, Completed)
- Persistent storage in TiDB Cloud
- Responsive UI with dark mode support
- Type-safe database queries with Kysely

## Prerequisites

- Node.js 20+ installed
- npm or another package manager
- TiDB Cloud account with a serverless cluster

## Environment Setup

1. Clone the repository

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with your TiDB Cloud connection string:

```env
DATABASE_URL=https://[username]:[password]@[host]:[port]/[database]
```

You can find your TiDB Cloud connection string in the TiDB Cloud console:
- Go to your cluster
- Click "Connect"
- Copy the serverless driver connection string

## Database Setup

The application uses a `todos` table with the following schema:

```sql
CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Running Migrations

To create the todos table in your TiDB Cloud database, run:

```bash
npm run migrate
```

This will:
- Connect to your TiDB Cloud database using the `DATABASE_URL` from `.env.local`
- Create the `todos` table if it doesn't exist
- Verify the table was created successfully

The migration script uses Kysely to execute the SQL, ensuring compatibility with the rest of the application.

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── todos/
│   │   │       ├── route.ts          # GET (list) and POST (create) endpoints
│   │   │       └── [id]/
│   │   │           └── route.ts      # GET, PATCH, and DELETE endpoints
│   │   ├── layout.tsx                # Root layout with metadata
│   │   ├── page.tsx                  # Main Todo List UI
│   │   └── globals.css               # Global styles
│   └── lib/
│       └── db/
│           ├── db.ts                 # Kysely database instance
│           ├── index.ts              # Database exports
│           ├── schema.d.ts           # TypeScript schema definitions
│           └── todos.ts              # Todo data access layer
├── migrations/
│   └── 001_create_todos_table.sql    # SQL migration file
├── scripts/
│   └── migrate-kysely.ts             # Migration script
├── .env.local                        # Environment variables (create this)
└── package.json
```

## API Endpoints

### GET /api/todos
List all todos. Optionally filter by completion status.

**Query Parameters:**
- `is_completed` (optional): `true` or `false`

**Response:**
```json
{
  "todos": [
    {
      "id": 1,
      "title": "Example Todo",
      "description": "This is an example",
      "is_completed": false,
      "created_at": "2025-11-29 10:00:00",
      "updated_at": "2025-11-29 10:00:00"
    }
  ]
}
```

### POST /api/todos
Create a new todo.

**Request Body:**
```json
{
  "title": "New Todo",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "todo": {
    "id": 2,
    "title": "New Todo",
    "description": "Optional description",
    "is_completed": false,
    "created_at": "2025-11-29 10:05:00",
    "updated_at": "2025-11-29 10:05:00"
  }
}
```

### GET /api/todos/:id
Get a single todo by ID.

**Response:**
```json
{
  "todo": {
    "id": 1,
    "title": "Example Todo",
    "description": "This is an example",
    "is_completed": false,
    "created_at": "2025-11-29 10:00:00",
    "updated_at": "2025-11-29 10:00:00"
  }
}
```

### PATCH /api/todos/:id
Update a todo. Can update title, description, and/or is_completed status.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "is_completed": true
}
```

**Response:**
```json
{
  "todo": {
    "id": 1,
    "title": "Updated Title",
    "description": "Updated description",
    "is_completed": true,
    "created_at": "2025-11-29 10:00:00",
    "updated_at": "2025-11-29 10:10:00"
  }
}
```

### DELETE /api/todos/:id
Delete a todo.

**Response:**
```json
{
  "message": "Todo deleted successfully"
}
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Run database migrations

## Database Connection

The application uses Kysely with the TiDB Serverless dialect to query the database. The connection is configured in `src/lib/db/db.ts` and uses the `DATABASE_URL` environment variable.

Kysely provides type-safe queries based on the schema defined in `src/lib/db/schema.d.ts`.

## Deployment

This application can be deployed to Vercel or any platform that supports Next.js:

1. Set up your TiDB Cloud cluster
2. Add the `DATABASE_URL` environment variable to your deployment platform
3. Run migrations: `npm run migrate`
4. Deploy the application

For Vercel deployment, the `DATABASE_URL` should be added as an environment variable in the Vercel project settings.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [TiDB Cloud Documentation](https://docs.pingcap.com/tidbcloud/)
- [Kysely Documentation](https://kysely.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is licensed under the MIT License.
