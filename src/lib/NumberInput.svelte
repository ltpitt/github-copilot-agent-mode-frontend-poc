<script lang="ts">
	// Props interface for the NumberInput component
	interface Props {
		id: string;
		label: string;
		value: number;
		min?: number;
		max?: number;
		step?: number;
		suffix?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		error?: boolean;
		errorMessage?: string;
		oninput?: (event: Event) => void;
		onblur?: (event: Event) => void;
		onkeydown?: (event: KeyboardEvent) => void;
	}

	let {
		id,
		label,
		value = $bindable(),
		min = 0,
		max = Number.MAX_SAFE_INTEGER,
		step = 1,
		suffix = '',
		placeholder = '',
		required = false,
		disabled = false,
		error = false,
		errorMessage = '',
		oninput,
		onblur,
		onkeydown
	}: Props = $props();

	// Handle increment/decrement with proper bounds checking
	function increment() {
		if (disabled) return;
		const newValue = value + step;
		if (newValue <= max) {
			value = newValue;
			// Trigger input event for consistency
			const event = new Event('input', { bubbles: true });
			oninput?.(event);
		}
	}

	function decrement() {
		if (disabled) return;
		const newValue = value - step;
		if (newValue >= min) {
			value = newValue;
			// Trigger input event for consistency
			const event = new Event('input', { bubbles: true });
			oninput?.(event);
		}
	}

	// Handle keyboard shortcuts
	function handleKeyDown(event: KeyboardEvent) {
		if (disabled) return;

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			increment();
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			decrement();
		}

		onkeydown?.(event);
	}

	// Handle input changes with validation
	function handleInput(event: Event) {
		if (disabled) return;

		const target = event.target as HTMLInputElement;
		const newValue = parseFloat(target.value);

		if (!isNaN(newValue)) {
			// Apply bounds checking
			if (newValue >= min && newValue <= max) {
				value = newValue;
			} else if (newValue < min) {
				value = min;
				target.value = min.toString();
			} else if (newValue > max) {
				value = max;
				target.value = max.toString();
			}
		}

		oninput?.(event);
	}

	function handleBlur(event: Event) {
		onblur?.(event);
	}
</script>

<div class="number-input-group">
	<label for={id} class="input-label">
		{label}
		{#if required}
			<span class="required-indicator" aria-label="required">*</span>
		{/if}
	</label>

	<div class="number-input-container" class:error class:disabled>
		<button
			type="button"
			class="stepper-button decrement"
			onclick={decrement}
			disabled={disabled || value <= min}
			aria-label="Decrease {label}"
			tabindex="-1"
		>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1.5" rx="2" />
				<path d="M5 8h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
		</button>

		<input
			{id}
			type="number"
			bind:value
			{min}
			{max}
			{step}
			{placeholder}
			{required}
			{disabled}
			class="number-input"
			class:error
			oninput={handleInput}
			onblur={handleBlur}
			onkeydown={handleKeyDown}
			autocomplete="off"
		/>

		<button
			type="button"
			class="stepper-button increment"
			onclick={increment}
			disabled={disabled || value >= max}
			aria-label="Increase {label}"
			tabindex="-1"
		>
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
				<rect x="2" y="2" width="12" height="12" stroke="currentColor" stroke-width="1.5" rx="2" />
				<path d="M8 5v6M5 8h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
		</button>

		{#if suffix}
			<span class="input-suffix">{suffix}</span>
		{/if}
	</div>

	{#if error && errorMessage}
		<div class="error-message" role="alert">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="error-icon">
				<path
					d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8S4.4 14.5 8 14.5 14.5 11.6 14.5 8 11.6 1.5 8 1.5zm0 11.5c-.4 0-.8-.3-.8-.8s.3-.8.8-.8.8.3.8.8-.4.8-.8.8zm.8-3.2h-1.6V5.2h1.6v4.6z"
				/>
			</svg>
			{errorMessage}
		</div>
	{/if}
</div>

<style>
	.number-input-group {
		margin-bottom: var(--spacing-xl);
	}

	.input-label {
		display: block;
		margin-bottom: var(--spacing-xs);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		font-size: var(--font-size-body);
	}

	.required-indicator {
		color: #cc0000;
		margin-left: 0.25rem;
	}

	.number-input-container {
		position: relative;
		display: flex;
		align-items: center;
		border: 1px solid var(--color-border);
		border-radius: var(--border-radius-sm);
		background: var(--color-background);
		transition: border-color var(--transition-normal);
		overflow: hidden;
	}

	.number-input-container:focus-within {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.2);
	}

	.number-input-container:hover:not(.disabled):not(:focus-within) {
		border-color: var(--color-primary);
	}

	.number-input-container.error {
		border-color: #cc0000;
		background-color: #fff5f5;
	}

	.number-input-container.error:focus-within {
		border-color: #cc0000;
		box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.2);
	}

	.number-input-container.disabled {
		background-color: var(--color-background-light);
		opacity: 0.6;
	}

	.number-input {
		flex: 1;
		border: none;
		outline: none;
		padding: 1rem var(--spacing-md);
		font-size: var(--font-size-body);
		font-family: var(--font-family);
		background: transparent;
		color: var(--color-text-primary);
		min-height: 48px;
		box-sizing: border-box;
		text-align: center;
	}

	.number-input:disabled {
		color: var(--color-text-light);
		cursor: not-allowed;
	}

	/* Hide browser default spinner arrows */
	.number-input::-webkit-outer-spin-button,
	.number-input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.number-input[type='number'] {
		appearance: textfield;
		-moz-appearance: textfield;
	}

	.stepper-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border: none;
		background: var(--color-background);
		color: var(--color-primary);
		cursor: pointer;
		transition: all var(--transition-normal);
		flex-shrink: 0;
		border-radius: var(--border-radius-sm);
	}

	.stepper-button:hover:not(:disabled) {
		background: var(--color-background-light);
		color: var(--color-primary-dark);
	}

	.stepper-button:active:not(:disabled) {
		background: var(--color-primary);
		color: white;
	}

	.stepper-button:disabled {
		background: var(--color-background-light);
		color: var(--color-text-light);
		cursor: not-allowed;
		opacity: 0.5;
	}

	.stepper-button:focus {
		outline: 2px solid var(--color-blue);
		outline-offset: 2px;
		z-index: 1;
	}

	.increment {
		border-left: 1px solid var(--color-border-light);
	}

	.decrement {
		border-right: 1px solid var(--color-border-light);
	}

	.input-suffix {
		position: absolute;
		right: 60px; /* Account for increment button width */
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-small);
		background: var(--color-background-light);
		padding: 0.25rem 0.5rem;
		border-radius: var(--border-radius-sm);
		border: 1px solid var(--color-border-light);
		pointer-events: none;
	}

	.error-message {
		margin-top: var(--spacing-xs);
		color: #cc0000;
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-medium);
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		line-height: var(--line-height-normal);
	}

	.error-icon {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.number-input-container {
			border-width: 2px;
		}

		.stepper-button {
			border: 1px solid var(--color-text-primary);
		}

		.number-input-container:focus-within {
			border-color: var(--color-blue);
			outline: 3px solid var(--color-blue);
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.number-input-container,
		.stepper-button {
			transition: none;
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.stepper-button {
			width: 44px;
			height: 44px;
		}

		.number-input {
			font-size: 16px; /* Prevent zoom on iOS */
		}
	}

	@media (max-width: 480px) {
		.stepper-button {
			width: 52px;
			height: 52px;
		}
	}
</style>
