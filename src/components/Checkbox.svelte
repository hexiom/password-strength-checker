<script lang="ts">
  import { derived, writable } from "svelte/store";

  type CheckboxProps = {value: string, disabled?: boolean, required?: boolean, onChange: (checked: boolean) => void}
  const {value, disabled, required, onChange}: CheckboxProps = $props();
  let checked = $state(false);

  function toggleCheckbox() {
    if (disabled) return;
    checked = !checked;
    onChange(checked)
  }
</script>

<button role="checkbox" class="checkbox-wrapper{checked ? ' checked' : ''}{disabled ? ' disabled' : ''}" onclick={toggleCheckbox} tabindex={disabled ? -1 : 0} aria-disabled={disabled} aria-required={required} aria-checked={checked}>
  <div class="checkbox">
    {#if checked}
      <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#fff"><path d="M389-267 195-460l51-52 143 143 325-324 51 51-376 375Z"/></svg>
    {/if}
  </div>
  {value}
</button>

<style>
  .checkbox-wrapper {
    border: 0;
    outline: 0;
    margin-block: 0.5rem;
    background: transparent;
    display: flex;
    align-items: center;

    gap: 0.75em;
    cursor: pointer;
    font-size: 0.95em;
    letter-spacing: -0.02em;
    font-weight: 500;
    padding: 0.5em 0.25em;
  }

  .checkbox-wrapper:focus-visible {
    outline: 2px solid var(--color-accent);
  }

  .checkbox-wrapper.checked > .checkbox {
    background-color: var(--color-accent);
    border: none;
  }

  .checkbox-wrapper.disabled {
    cursor: not-allowed;
    color: var(--color-text-secondary);
  }

  .checkbox-wrapper.disabled > .checkbox {
    background-color: #e2e1e1;
  }

  .checkbox {
    width: 16px;
    height: 16px;
    aspect-ratio: 1/1;

    border-radius: 2px;
    border: 1px solid var(--color-bg-secondary);
    background-color: #fff;
  }
</style>