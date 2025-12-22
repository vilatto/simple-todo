import { db } from './connection.js';

export function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),

      -- Future extensibility (nullable fields)
      due_date TEXT,
      priority INTEGER,
      notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_completed ON todos(completed);
    CREATE INDEX IF NOT EXISTS idx_due_date ON todos(due_date);

    -- Future tags support (many-to-many relationship)
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      color TEXT
    );

    CREATE TABLE IF NOT EXISTS todo_tags (
      todo_id INTEGER REFERENCES todos(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (todo_id, tag_id)
    );

    CREATE INDEX IF NOT EXISTS idx_todo_tags_todo ON todo_tags(todo_id);
    CREATE INDEX IF NOT EXISTS idx_todo_tags_tag ON todo_tags(tag_id);
  `);

  console.log('Database initialized successfully');
}
