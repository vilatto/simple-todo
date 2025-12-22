<script lang="ts">
  import type { Todo } from '../../../../shared/types';
  import { todoStore } from '../stores/todos';

  export let todo: Todo;

  let isDeleting = false;

  async function handleToggle() {
    await todoStore.toggle(todo.id);
  }

  async function handleDelete() {
    if (isDeleting) return;
    isDeleting = true;
    await todoStore.remove(todo.id);
  }
</script>

<div class="todo-item" class:completed={todo.completed}>
  <button class="checkbox" on:click={handleToggle} aria-label="Toggle completion">
    {todo.completed ? '[x]' : '[ ]'}
  </button>

  <span class="description">{todo.description}</span>

  <button
    class="delete-btn"
    on:click={handleDelete}
    disabled={isDeleting}
    aria-label="Delete todo"
  >
    [del]
  </button>
</div>

<style>
  .todo-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem;
    border-bottom: 1px solid var(--border);
    transition: background-color 0.2s;
  }

  .todo-item:hover {
    background: var(--bg-secondary);
  }

  .checkbox {
    background: transparent;
    border: none;
    color: var(--fg-warning);
    font-family: var(--font-mono);
    font-size: 14px;
    cursor: pointer;
    padding: 0;
    user-select: none;
  }

  .todo-item.completed .checkbox {
    color: var(--fg-success);
  }

  .checkbox:hover {
    opacity: 0.8;
  }

  .description {
    flex: 1;
    color: var(--fg-primary);
    font-family: var(--font-mono);
    font-size: 14px;
  }

  .todo-item.completed .description {
    color: var(--fg-dim);
    text-decoration: line-through;
  }

  .delete-btn {
    background: transparent;
    border: none;
    color: var(--fg-error);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
    padding: 0;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .todo-item:hover .delete-btn {
    opacity: 1;
  }

  .delete-btn:hover {
    opacity: 0.8;
  }

  .delete-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
