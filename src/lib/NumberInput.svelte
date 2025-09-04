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
		helperText?: string;
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
		helperText = '',
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
			step="any"
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
	{:else if helperText}
		<div class="helper-text">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="info-icon">
				<path
					d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8S4.4 14.5 8 14.5 14.5 11.6 14.5 8 11.6 1.5 8 1.5zm0 11c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3.9c0 .2-.1.4-.3.5-.2.1-.4.2-.7.2s-.5-.1-.7-.2c-.2-.1-.3-.3-.3-.5V6.5c0-.2.1-.4.3-.5.2-.1.4-.2.7-.2s.5.1.7.2c.2.1.3.3.3.5v1.6z"
				/>
			</svg>
			{helperText}
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
		border: 2px solid var(--color-border);
		border-radius: var(--border-radius-md);
		background: var(--color-background);
		transition: all var(--transition-normal);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
	}

	.number-input-container:focus-within {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md), var(--focus-ring);
		transform: translateY(-1px);
	}

	.number-input-container:hover:not(.disabled):not(:focus-within) {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
		transform: translateY(-1px);
	}

	.number-input-container.error {
		border-color: var(--color-error);
		background-color: #fff5f5;
		box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
	}

	.number-input-container.error:focus-within {
		border-color: var(--color-error);
		box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2);
	}

	.number-input-container.disabled {
		background-color: var(--color-background-light);
		opacity: 0.7;
		transform: none;
	}

	.number-input {
		flex: 1;
		border: none;
		outline: none;
		padding: var(--spacing-lg) var(--spacing-md);
		font-size: var(--font-size-body);
		font-family: var(--font-family);
		font-weight: var(--font-weight-medium);
		background: transparent;
		color: var(--color-text-primary);
		min-height: 56px;
		box-sizing: border-box;
		text-align: center;
		transition: all var(--transition-normal);
	}

	.number-input::placeholder {
		color: var(--color-text-placeholder);
		font-weight: var(--font-weight-regular);
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
		width: 56px;
		height: 56px;
		border: none;
		background: var(--color-background-light);
		color: var(--color-primary);
		cursor: pointer;
		transition: all var(--transition-normal);
		flex-shrink: 0;
		position: relative;
		overflow: hidden;
	}

	.stepper-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, transparent, rgba(255, 98, 0, 0.1), transparent);
		opacity: 0;
		transition: opacity var(--transition-normal);
	}

	.stepper-button:hover:not(:disabled) {
		background: var(--color-primary-lighter);
		color: var(--color-primary-dark);
		transform: scale(1.05);
	}

	.stepper-button:hover:not(:disabled)::before {
		opacity: 1;
	}

	.stepper-button:active:not(:disabled) {
		background: var(--color-primary);
		color: white;
		transform: scale(0.98);
	}

	.stepper-button:disabled {
		background: var(--color-background-light);
		color: var(--color-text-light);
		cursor: not-allowed;
		opacity: 0.5;
		transform: none;
	}

	.stepper-button:focus {
		outline: none;
		box-shadow: var(--focus-ring);
		z-index: 1;
	}

	.increment {
		border-left: 1px solid var(--color-border-light);
		border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
	}

	.decrement {
		border-right: 1px solid var(--color-border-light);
		border-radius: var(--border-radius-md) 0 0 var(--border-radius-md);
	}

	.input-suffix {
		position: absolute;
		right: 68px; /* Account for increment button width + padding */
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-small);
		background: var(--color-background-light);
		padding: 0.375rem 0.75rem;
		border-radius: var(--border-radius-sm);
		border: 1px solid var(--color-border-light);
		pointer-events: none;
		box-shadow: var(--shadow-sm);
		text-transform: uppercase;
		letter-spacing: 0.5px;
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

	.helper-text {
		margin-top: var(--spacing-xs);
		color: var(--color-text-secondary);
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-regular);
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

	.info-icon {
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
