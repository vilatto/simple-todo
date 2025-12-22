import { db } from './connection.js';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../../../shared/types.js';

interface TodoRow {
  id: number;
  description: string;
  completed: number;
  created_at: string;
  updated_at: string;
  due_date: string | null;
  priority: number | null;
  notes: string | null;
}

function rowToTodo(row: TodoRow): Todo {
  return {
    id: row.id,
    description: row.description,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    dueDate: row.due_date || undefined,
    priority: row.priority as (1 | 2 | 3) | undefined,
    notes: row.notes || undefined,
  };
}

export function getAllTodos(): Todo[] {
  const stmt = db.prepare('SELECT * FROM todos ORDER BY created_at DESC');
  const rows = stmt.all() as TodoRow[];
  return rows.map(rowToTodo);
}

export function getTodoById(id: number): Todo | undefined {
  const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
  const row = stmt.get(id) as TodoRow | undefined;
  return row ? rowToTodo(row) : undefined;
}

export function createTodo(dto: CreateTodoDto): Todo {
  const stmt = db.prepare(`
    INSERT INTO todos (description, due_date, priority)
    VALUES (?, ?, ?)
  `);

  const info = stmt.run(
    dto.description,
    dto.dueDate || null,
    dto.priority || null
  );

  const newTodo = getTodoById(info.lastInsertRowid as number);
  if (!newTodo) {
    throw new Error('Failed to create todo');
  }

  return newTodo;
}

export function updateTodo(id: number, dto: UpdateTodoDto): Todo | undefined {
  const existingTodo = getTodoById(id);
  if (!existingTodo) {
    return undefined;
  }

  const updates: string[] = [];
  const values: any[] = [];

  if (dto.description !== undefined) {
    updates.push('description = ?');
    values.push(dto.description);
  }

  if (dto.completed !== undefined) {
    updates.push('completed = ?');
    values.push(dto.completed ? 1 : 0);
  }

  if (dto.dueDate !== undefined) {
    updates.push('due_date = ?');
    values.push(dto.dueDate || null);
  }

  if (dto.priority !== undefined) {
    updates.push('priority = ?');
    values.push(dto.priority || null);
  }

  if (dto.notes !== undefined) {
    updates.push('notes = ?');
    values.push(dto.notes || null);
  }

  updates.push("updated_at = datetime('now')");

  if (updates.length === 1) {
    return existingTodo;
  }

  values.push(id);

  const stmt = db.prepare(`
    UPDATE todos
    SET ${updates.join(', ')}
    WHERE id = ?
  `);

  stmt.run(...values);

  return getTodoById(id);
}

export function deleteTodo(id: number): boolean {
  const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

export function toggleTodoCompletion(id: number): Todo | undefined {
  const todo = getTodoById(id);
  if (!todo) {
    return undefined;
  }

  const stmt = db.prepare(`
    UPDATE todos
    SET completed = ?, updated_at = datetime('now')
    WHERE id = ?
  `);

  stmt.run(todo.completed ? 0 : 1, id);

  return getTodoById(id);
}
