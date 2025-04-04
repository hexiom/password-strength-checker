<script lang="ts">
  import zxcvbn from "zxcvbn";
  import "../app.css"
  import Checkbox from "../components/Checkbox.svelte";
  import { getPasswordStrength } from "$lib/checker";
  import LoadingSpinner from "../components/LoadingSpinner.svelte";
  import strengthJson from "../data/strength.json"

  type Strength = {
    text: string,
    color: string
  }

  type ZXCVBNResultWithPassword = zxcvbn.ZXCVBNResult & {password: string};

  let showPassword = $state(false);
  let passwordValue = $state('');
  let isLoading = $state(false)
  let timeoutId = $state(-1)
  let result: ZXCVBNResultWithPassword|undefined = $state();
  let passwordStrength: Strength = $derived.by(() => strengthJson[result ? result.score+1 : 0])

  function updatePassword() {
    if (passwordValue.length === 0) {
      return
    }

    result = getPasswordStrength(passwordValue) as ZXCVBNResultWithPassword
    isLoading = true;

    if (timeoutId > 0) {
      clearInterval(timeoutId)
    }

    timeoutId = setTimeout(() => {
      isLoading = false
      clearInterval(timeoutId)
    }, 400) // Timeout to avoid spam
  }

</script>

<header class="horizontally-centered header">
  <h1>Password Strength Checker</h1>
</header>

<main class="horizontally-centered">
  <div class="actions horizontally-centered">
    <div class="labelled-field">
      <div class="input-field">
        <label for="password-field" class="field-label">
          Password
        </label>
        <input required bind:value={passwordValue} type={showPassword ? 'text' : 'password'} name="Password" placeholder=" " id="password-field">
      </div>
      <p class="invalid-label">Please enter password...</p>
    </div>

    <div class="checkboxes">
      <Checkbox onChange={() => showPassword = !showPassword} value="Show password" />
    </div>

    <button type="button" disabled={isLoading} onclick={() => updatePassword()} class="btn">Check</button>
  </div>

  <div class="results">
    {#if isLoading}
      <LoadingSpinner />
    {:else if result}
      {@render results()}
    {/if}
  </div>
</main>

{#snippet resultField(fieldName: string, fieldValue: string, color?: string)}
  <div><span class="semibold">{fieldName}:</span> <span style={color ? `color: ${color}` : undefined}>{fieldValue}</span></div>
{/snippet}

{#snippet results()}
  {@render resultField("password", result!.password)}
  {@render resultField("password_strength", passwordStrength.text, passwordStrength.color)}
  {@render resultField("guesses", result!.guesses.toFixed(0))}
  {@render resultField("guesses_log10", result!.guesses_log10.toFixed(4))}
  {@render resultField("function runtime", result!.calc_time.toString() + "ms")}
  
  <div class="padding-block-large">
    <h3>crack_time</h3>
    <div class="crack-time indent">
      <div class="time-display-grid">
        <p class="semibold">100/h:</p>
        <p>{result!.crack_times_display.online_throttling_100_per_hour} <span class="underline">(online throttling)</span></p>
      </div>

      <div class="time-display-grid">
        <p class="semibold">10/s:</p>
        <p>{result!.crack_times_display.online_no_throttling_10_per_second} <span class="underline">(no throttling)</span></p>
      </div>

      <div class="time-display-grid">
        <p class="semibold">1e+10/s:</p>
        <p>{result!.crack_times_display.offline_fast_hashing_1e10_per_second} <span class="underline">(offline fast hash)</span></p>
      </div>

      <div class="time-display-grid">
        <p class="semibold">1e+4/s:</p>
        <p>{result!.crack_times_display.offline_slow_hashing_1e4_per_second} <span class="underline">(offline slow hash)</span></p>
      </div>
    </div>
  </div>

  <div>
    {#if result!.feedback.suggestions.length > 0 || result!.feedback.warning.length > 0}
      <p class="semibold">feedback:</p>
    {/if}
    
    {#if result!.feedback.suggestions.length > 0}
      <p class="indent padding-top-small"><span class="semibold">suggestion</span>: {result!.feedback.suggestions}</p>
    {/if}
    
    {#if result!.feedback.warning.length > 0}
      <p class="indent padding-top-small"><span class="semibold">warning</span>: {result!.feedback.warning}</p>
    {/if}
  </div>
{/snippet }

<style>
  .indent {
    --indent: 1.25em;

    padding-left: var(--indent);
  }

  .padding-top-small {
    padding-top: 0.5em;
  }

  .underline {
    text-decoration: underline;
  }

  .italic {
    font-style: italic;
  }

  .semibold {
    font-weight: 600;
  }

  .padding-block-large {
    padding-block: 1.5rem;
  }

  .time-display-grid {
    display: grid;
    grid-template-columns: 7rem auto;
  }

  .crack-time {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-top: 0.5rem;
  }

  .horizontally-centered {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .results {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25em;

    max-width: 30em;
  }

  .btn {
    outline: none;
    border: none;
    padding: 0.75em 4em;
    background-color: var(--color-accent);
    border-radius: 8px;
    color: #fff;
    font-size: 1em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: -0.01em;
    cursor: pointer;
  }

  .btn:hover {
    background-color: var(--color-accent-lighter);
  }

  .btn:active {
    background-color: var(--color-accent-active);
  }

  .btn:disabled {
    color: var(--color-text-lighter);
    background-color: var(--color-accent-disabled);
    opacity: 0.6;
    cursor: not-allowed;
  }

  .checkboxes {
    display: grid;
    grid-template-columns: repeat(2, minmax(150px, 1fr));
    margin-bottom: 1.5em;
    margin-top: 0.25em;
  }

  .header {
    padding-block: 3em;
  }

  .labelled-field {
    --input-color: var(--color-bg-secondary);
    --label-color: var(--color-text-secondary);

    --input-horizontal-padding: 0.75rem;
  }

  .input-field {
    position: relative;
  }

  .field-label {
    position: absolute;
    background: transparent;
    color: var(--label-color);
    transition: all 150ms ease;
  }

  .field-label {
    font-weight: 600;
    background-color: var(--color-bg);
    padding-inline: 4px;
    font-size: 0.95em;

    /* MOVE DOWN TO TEXT */
    top: 50%;
    left: 0;
    transform: translate(var(--input-horizontal-padding), -50%);
  }

  .labelled-field:has(input:not(:placeholder-shown)) .field-label,
  .labelled-field:has(input:focus-visible) .field-label {
    /* MOVE UP TO BORDER */
    top: -2px;
    transform: translate(var(--input-horizontal-padding), -50%);
    font-size: 0.75em;
  }

  /* Input is focused */
  .labelled-field:has(input:focus-within) {
    --input-color: var(--color-accent);
    --label-color: var(--color-accent);
  }

  input {
    border: 0;
    outline: 0;
    font-size: 1rem;

    background-color: var(--color-bg);
    outline: 1px solid var(--input-color);
    padding: 0.75rem var(--input-horizontal-padding);
    border-radius: 2px;

    min-width: 300px;
    transition: outline 75ms linear;
  }

  .labelled-field:has(input:user-invalid) {
    --input-color: var(--color-error);
    --label-color: var(--color-error);
  }

  .invalid-label {
    display: none;
    font-size: 0.9rem;
    color: var(--color-error);
    margin-left: 0.5rem;
    margin-top: 0.25rem;
    font-style: italic;
  }

  .labelled-field:has(input:user-invalid) > .invalid-label {
    display: block;
  }

</style>