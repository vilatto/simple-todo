import { writable } from 'svelte/store';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../../../../shared/types';
import * as api from '../api/client';

interface TodoStore {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

function createTodoStore() {
  const { subscribe, set, update } = writable<TodoStore>({
    todos: [],
    loading: false,
    error: null,
  });

  return {
    subscribe,

    load: async () => {
      update(state => ({ ...state, loading: true, error: null }));
      try {
        const todos = await api.fetchTodos();
        set({ todos, loading: false, error: null });
      } catch (error: any) {
        update(state => ({
          ...state,
          loading: false,
          error: error.message || 'Failed to load todos',
        }));
      }
    },

    add: async (dto: CreateTodoDto) => {
      try {
        const newTodo = await api.createTodo(dto);
        update(state => ({
          ...state,
          todos: [newTodo, ...state.todos],
          error: null,
        }));
        return newTodo;
      } catch (error: any) {
        update(state => ({
          ...state,
          error: error.message || 'Failed to create todo',
        }));
        throw error;
      }
    },

    toggle: async (id: number) => {
      try {
        const updatedTodo = await api.toggleTodo(id);
        update(state => ({
          ...state,
          todos: state.todos.map(t => (t.id === id ? updatedTodo : t)),
          error: null,
        }));
      } catch (error: any) {
        update(state => ({
          ...state,
          error: error.message || 'Failed to toggle todo',
        }));
      }
    },

    updateTodo: async (id: number, dto: UpdateTodoDto) => {
      try {
        const updatedTodo = await api.updateTodo(id, dto);
        update(state => ({
          ...state,
          todos: state.todos.map(t => (t.id === id ? updatedTodo : t)),
          error: null,
        }));
      } catch (error: any) {
        update(state => ({
          ...state,
          error: error.message || 'Failed to update todo',
        }));
        throw error;
      }
    },

    remove: async (id: number) => {
      try {
        await api.deleteTodo(id);
        update(state => ({
          ...state,
          todos: state.todos.filter(t => t.id !== id),
          error: null,
        }));
      } catch (error: any) {
        update(state => ({
          ...state,
          error: error.message || 'Failed to delete todo',
        }));
      }
    },

    clearError: () => {
      update(state => ({ ...state, error: null }));
    },
  };
}

export const todoStore = createTodoStore();
