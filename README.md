# Terminal Todo

A minimalist, terminal-styled todo application built with modern web technologies.

## Tech Stack

**Frontend:**
- Svelte + TypeScript
- Vite (dev server & bundler)
- Custom CSS (terminal theme)

**Backend:**
- Fastify (Node.js framework)
- SQLite (via better-sqlite3)
- Zod (validation)

## Features

- Create, read, update, and delete todos
- Toggle completion status
- Add todos via URL parameters (`?add=your+task`)
- Terminal/CLI-inspired aesthetic
- Persistent storage with SQLite
- Extensible architecture for future features (tags, due dates, reminders)

## Project Structure

```
simple-todo/
├── client/              # Svelte frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/    # TodoInput, TodoItem, TodoList
│   │   │   ├── stores/        # Svelte stores for state management
│   │   │   └── api/           # API client functions
│   │   ├── App.svelte         # Main component + URL param handling
│   │   └── app.css            # Terminal theme
│   └── vite.config.ts         # Vite configuration with API proxy
│
├── server/              # Fastify backend
│   ├── src/
│   │   ├── db/               # Database schema, queries, connection
│   │   ├── routes/           # REST API endpoints
│   │   ├── middleware/       # Zod validation schemas
│   │   ├── server.ts         # Fastify app initialization
│   │   └── config.ts         # Environment configuration
│   └── data/
│       └── todos.db          # SQLite database
│
└── shared/              # Shared TypeScript types
    └── types.ts
```

## Getting Started

### Development

Both the backend and frontend are currently running:

- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5174

To start them manually in the future:

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

Or use the convenience script from the root:

```bash
npm run dev
```

(Note: This requires `concurrently` to be installed at the root level)

### API Endpoints

```
GET    /api/todos              # List all todos
POST   /api/todos              # Create todo
GET    /api/todos/:id          # Get single todo
PATCH  /api/todos/:id          # Update todo
DELETE /api/todos/:id          # Delete todo
POST   /api/todos/:id/complete # Toggle completion
GET    /health                 # Health check
```

### URL Parameters

Add a todo directly via URL:

```
http://localhost:5174/?add=Buy+groceries
```

The task will be created automatically and the URL will be cleaned.

## Database Schema

The SQLite database includes tables for future extensibility:

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  description TEXT NOT NULL,
  completed INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  -- Future features
  due_date TEXT,
  priority INTEGER,
  notes TEXT
);

-- Future tags support (many-to-many)
CREATE TABLE tags (...);
CREATE TABLE todo_tags (...);
```

## UI Features

- **Terminal aesthetic**: Monospace fonts, CLI-style input with `>` prefix
- **ASCII checkboxes**: `[ ]` for incomplete, `[x]` for complete
- **Keyboard shortcuts**: Press Enter to submit new todos
- **Hover interactions**: Delete button appears on hover
- **Color coding**:
  - Green (`#4ec9b0`) - Success/completed tasks
  - Yellow (`#dcdcaa`) - Active/pending tasks
  - Red (`#f48771`) - Delete actions/errors

## Future Enhancements (Planned)

The architecture supports these extensions:

1. **Tags/Categories**: Filter and organize todos by tags
2. **Due Dates & Reminders**: Schedule tasks with deadlines
3. **Vim-style Navigation**: j/k keys to navigate list
4. **Command History**: Up/down arrows in input
5. **Boot Sequence Animation**: Terminal-style loading screen
6. **Persistent Filters**: Save custom views

## Testing

API endpoints have been tested and verified:

```bash
# Create todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"description": "Test task"}'

# List todos
curl http://localhost:3000/api/todos

# Toggle completion
curl -X POST http://localhost:3000/api/todos/1/complete

# Delete todo
curl -X DELETE http://localhost:3000/api/todos/1
```

## Development Notes

- **Hot Module Reload**: Both client and server support HMR
- **TypeScript**: Strict mode enabled for type safety
- **Vite Proxy**: `/api/*` requests are proxied to `http://localhost:3000`
- **SQLite WAL Mode**: Enabled for better concurrent access
- **Foreign Keys**: Enabled for referential integrity

## Troubleshooting

**Server won't start:**
```bash
# Ensure data directory exists
mkdir -p server/data

# Reinstall dependencies
cd server && npm install
```

**Client won't start:**
```bash
# Reinstall dependencies
cd client && npm install

# Clear Vite cache
rm -rf client/node_modules/.vite
```

**Port conflicts:**
- Backend runs on port 3000 (configurable via `PORT` env var)
- Frontend runs on port 5173 (Vite auto-increments if in use)

## License

MIT
