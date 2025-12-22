<script lang="ts">
  import { todoStore } from '../stores/todos';
  import { onMount } from 'svelte';

  let inputValue = '';
  let isSubmitting = false;
  let inputElement: HTMLInputElement;
  let cursorElement: HTMLSpanElement;
  let inputContainer: HTMLDivElement;

  async function handleSubmit(event: Event) {
    event.preventDefault();

    if (inputValue.trim() === '' || isSubmitting) {
      return;
    }

    isSubmitting = true;

    try {
      await todoStore.add({ description: inputValue.trim() });
      inputValue = '';
      updateCursorPosition();
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      isSubmitting = false;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
  }

  function updateCursorPosition() {
    if (!inputElement || !cursorElement) return;

    const textBeforeCursor = inputValue.substring(0, inputElement.selectionStart || 0);

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      const computedStyle = window.getComputedStyle(inputElement);
      context.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`;
      const textWidth = context.measureText(textBeforeCursor).width;

      cursorElement.style.left = `${textWidth}px`;
    }
  }

  onMount(() => {
    updateCursorPosition();
    inputElement?.focus();
  });
</script>

<form class="todo-input" on:submit={handleSubmit}>
  <label for="todo-input" class="terminal-prefix">&gt;</label>
  <div class="input-wrapper" bind:this={inputContainer}>
    <input
      bind:this={inputElement}
      id="todo-input"
      type="text"
      bind:value={inputValue}
      on:keydown={handleKeydown}
      on:input={updateCursorPosition}
      on:click={updateCursorPosition}
      on:keyup={updateCursorPosition}
      placeholder="Add task..."
      disabled={isSubmitting}
      autocomplete="off"
    />
    <span class="cursor" bind:this={cursorElement}></span>
  </div>
</form>

<style>
  .todo-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
  }

  .terminal-prefix {
    color: var(--fg-success);
    font-weight: bold;
    user-select: none;
  }

  .input-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--fg-primary);
    font-family: var(--font-mono);
    font-size: 14px;
    caret-color: transparent;
  }

  input::placeholder {
    color: var(--fg-dim);
  }

  input:disabled {
    opacity: 0.5;
  }

  .cursor {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 1.1em;
    background: var(--fg-success);
    pointer-events: none;
    animation: blink 1s infinite;
  }

  input:not(:focus) + .cursor {
    opacity: 0.3;
    animation: none;
  }

  @keyframes blink {
    0%, 49% {
      opacity: 1;
    }
    50%, 100% {
      opacity: 0;
    }
  }
</style>
