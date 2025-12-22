import type { Todo, CreateTodoDto, UpdateTodoDto } from '../../../../shared/types';

const API_BASE_URL = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function fetchTodos(): Promise<Todo[]> {
  const response = await fetch(`${API_BASE_URL}/todos`);
  return handleResponse<Todo[]>(response);
}

export async function fetchTodoById(id: number): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`);
  return handleResponse<Todo>(response);
}

export async function createTodo(dto: CreateTodoDto): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  return handleResponse<Todo>(response);
}

export async function updateTodo(id: number, dto: UpdateTodoDto): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  return handleResponse<Todo>(response);
}

export async function deleteTodo(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });
  return handleResponse<void>(response);
}

export async function toggleTodo(id: number): Promise<Todo> {
  const response = await fetch(`${API_BASE_URL}/todos/${id}/complete`, {
    method: 'POST',
  });
  return handleResponse<Todo>(response);
}
