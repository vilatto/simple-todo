<script lang="ts">
  import { onMount } from 'svelte';
  import { todoStore } from './lib/stores/todos';
  import TodoInput from './lib/components/TodoInput.svelte';
  import TodoList from './lib/components/TodoList.svelte';

  onMount(async () => {
    const params = new URLSearchParams(window.location.search);
    const taskToAdd = params.get('add');

    if (taskToAdd) {
      try {
        await todoStore.add({ description: decodeURIComponent(taskToAdd) });
        window.history.replaceState({}, '', window.location.pathname);
      } catch (error) {
        console.error('Failed to add todo from URL:', error);
      }
    }

    await todoStore.load();
  });
</script>

<main>
  <header>
    <pre class="logo">
 _______                  ___  _____   ____  
|__   __|                |__ \|  __ \ / __ \ 
   | | ___ _ __ _ __ ___    ) | |  | | |  | |
   | |/ _ \ '__| '_ ` _ \  / /| |  | | |  | |
   | |  __/ |  | | | | | |/ /_| |__| | |__| |
   |_|\___|_|  |_| |_| |_|____|_____/ \____/ 
    </pre>
  </header>

  <div class="container">
    <TodoInput />
    <TodoList />
  </div>

  <footer>
    <p>&gt; Press Enter to submit | Hover to delete</p>
  </footer>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .logo {
    color: var(--fg-success);
    font-size: 10px;
    line-height: 1;
    margin: 0 0 1rem 0;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: normal;
    margin: 0 0 0.5rem 0;
    color: var(--fg-primary);
  }

  .subtitle {
    color: var(--fg-dim);
    font-size: 14px;
    margin: 0;
  }

  .container {
    margin-bottom: 2rem;
  }

  footer {
    text-align: center;
    color: var(--fg-dim);
    font-size: 12px;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  footer p {
    margin: 0;
  }
</style>
