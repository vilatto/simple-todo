<script lang="ts">
  import { todoStore } from '../stores/todos';
  import TodoItem from './TodoItem.svelte';

  $: ({ todos, loading, error } = $todoStore);
</script>

<div class="todo-list">
  {#if loading}
    <div class="status">&gt; Loading todos...</div>
  {:else if error}
    <div class="error">
      &gt; Error: {error}
      <button on:click={() => todoStore.clearError()}>dismiss</button>
    </div>
  {:else if todos.length === 0}
    <div class="empty-state">
      <p>&gt; No todos yet.</p>
      <p>&gt; Create your first task above.</p>
    </div>
  {:else}
    <div class="list-header">
      <span>&gt; {todos.filter(t => !t.completed).length} active</span>
      <span>|</span>
      <span>{todos.filter(t => t.completed).length} completed</span>
    </div>

    <div class="items">
      {#each todos as todo (todo.id)}
        <TodoItem {todo} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .todo-list {
    border: 1px solid var(--border);
    background: var(--bg-primary);
  }

  .status,
  .empty-state {
    padding: 2rem;
    color: var(--fg-dim);
    text-align: center;
  }

  .empty-state p {
    margin: 0.5rem 0;
  }

  .error {
    padding: 1rem;
    color: var(--fg-error);
    background: rgba(244, 135, 113, 0.1);
    border: 1px solid var(--fg-error);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .error button {
    background: transparent;
    border: 1px solid var(--fg-error);
    color: var(--fg-error);
    padding: 0.25rem 0.5rem;
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
  }

  .error button:hover {
    background: rgba(244, 135, 113, 0.2);
  }

  .list-header {
    padding: 0.75rem;
    border-bottom: 1px solid var(--border);
    color: var(--fg-dim);
    font-size: 12px;
    display: flex;
    gap: 0.5rem;
  }

  .items {
    max-height: 500px;
    overflow-y: auto;
  }

  .items::-webkit-scrollbar {
    width: 8px;
  }

  .items::-webkit-scrollbar-track {
    background: var(--bg-primary);
  }

  .items::-webkit-scrollbar-thumb {
    background: var(--border);
  }

  .items::-webkit-scrollbar-thumb:hover {
    background: var(--fg-dim);
  }
</style>
