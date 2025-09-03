<script lang="ts">
	import { validateFormInputs } from './validation.js';

	// Props for event callbacks
	interface Props {
		onsubmit?: (data: {
			principal: number;
			annualInterestRate: number;
			durationYears: number;
			buyingAlone: boolean;
		}) => void;
	}

	let { onsubmit }: Props = $props();

	// Reactive state using Svelte 5 runes
	let principal = $state(300000); // Default loan amount in Euros
	let annualInterestRate = $state(3.5); // Default annual interest rate in percentage
	let durationYears = $state(30); // Default duration in years
	let buyingAlone = $state(true); // Whether buying alone or with partner

	// Validation state
	let hasInteracted = $state(false); // Track if user has interacted with form
	let showErrors = $state(false); // Control when to show error messages

	// Form validation derived state
	let validationResults = $derived(() => {
		return validateFormInputs(principal, annualInterestRate, durationYears);
	});

	let isFormValid = $derived(() => {
		return validationResults().isValid;
	});

	// Show errors when user tries to submit invalid form or after interaction
	let shouldShowErrors = $derived(() => {
		return showErrors || (hasInteracted && !isFormValid());
	});

	// Handle form submission
	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		hasInteracted = true;
		showErrors = true;

		if (isFormValid()) {
			onsubmit?.({
				principal,
				annualInterestRate,
				durationYears,
				buyingAlone
			});
		}
	}

	// Handle form submission on Enter key
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			// Create a synthetic SubmitEvent for consistency
			const submitEvent = new SubmitEvent('submit', { cancelable: true });
			handleSubmit(submitEvent);
		}
	}

	// Handle input interaction
	function handleInputInteraction() {
		if (!hasInteracted) {
			hasInteracted = true;
		}
	}
</script>

<form class="input-form" onsubmit={handleSubmit}>
	<h2>What maximum amount can I borrow?</h2>

	<div class="form-group">
		<fieldset>
			<legend class="question-label">Do you buy alone or together?</legend>
			<div class="radio-group">
				<label class="radio-option">
					<input type="radio" bind:group={buyingAlone} value={true} name="buying-type" />
					<span class="radio-icon">👤</span>
					Alone
				</label>
				<label class="radio-option">
					<input type="radio" bind:group={buyingAlone} value={false} name="buying-type" />
					<span class="radio-icon">👥</span>
					Together
				</label>
			</div>
		</fieldset>
	</div>

	<div class="form-group">
		<label for="principal">Your gross annual income</label>
		<div class="input-with-suffix">
			<input
				id="principal"
				type="number"
				bind:value={principal}
				min="1"
				step="1000"
				placeholder="40,000"
				onkeydown={handleKeyDown}
				oninput={handleInputInteraction}
				onblur={handleInputInteraction}
				class:error={shouldShowErrors() && validationResults()?.errors?.principal}
				required
			/>
			<span class="input-suffix">EUR</span>
		</div>
		{#if shouldShowErrors() && validationResults()?.errors?.principal}
			<div class="error-message" role="alert">
				{validationResults().errors.principal}
			</div>
		{/if}
	</div>

	<div class="form-group">
		<label for="interest-rate">Annual Interest Rate (%)</label>
		<div class="input-with-suffix">
			<input
				id="interest-rate"
				type="number"
				bind:value={annualInterestRate}
				min="0"
				max="50"
				step="0.01"
				placeholder="3.5"
				onkeydown={handleKeyDown}
				oninput={handleInputInteraction}
				onblur={handleInputInteraction}
				class:error={shouldShowErrors() && validationResults()?.errors?.interestRate}
				required
			/>
			<span class="input-suffix">%</span>
		</div>
		{#if shouldShowErrors() && validationResults()?.errors?.interestRate}
			<div class="error-message" role="alert">
				{validationResults().errors.interestRate}
			</div>
		{/if}
	</div>

	<div class="form-group">
		<label for="duration">Duration (years)</label>
		<div class="input-with-suffix">
			<input
				id="duration"
				type="number"
				bind:value={durationYears}
				min="1"
				max="50"
				step="1"
				placeholder="30"
				onkeydown={handleKeyDown}
				oninput={handleInputInteraction}
				onblur={handleInputInteraction}
				class:error={shouldShowErrors() && validationResults()?.errors?.duration}
				required
			/>
			<span class="input-suffix">years</span>
		</div>
		{#if shouldShowErrors() && validationResults()?.errors?.duration}
			<div class="error-message" role="alert">
				{validationResults().errors.duration}
			</div>
		{/if}
	</div>

	<button type="submit" class="submit-button" disabled={!isFormValid()}>
		{#if isFormValid()}
			Calculate
		{:else}
			Please fix errors above
		{/if}
	</button>
</form>

<style>
	.input-form {
		background: var(--color-background);
		padding: var(--spacing-xl);
		border-radius: var(--border-radius-lg);
		box-shadow: var(--shadow-medium);
		border: 1px solid var(--color-border-light);
		width: 100%;
		margin: 0;
	}

	h2 {
		color: var(--color-primary);
		margin-bottom: var(--spacing-xl);
		font-size: var(--font-size-h3);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
	}

	.form-group {
		margin-bottom: var(--spacing-xl);
		position: relative;
	}

	.question-label {
		display: block;
		margin-bottom: var(--spacing-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		font-size: var(--font-size-body);
		border: none;
		padding: 0;
	}

	fieldset {
		border: none;
		margin: 0;
		padding: 0;
	}

	label {
		display: block;
		margin-bottom: var(--spacing-xs);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		font-size: var(--font-size-body);
	}

	.radio-group {
		display: flex;
		gap: var(--spacing-lg);
	}

	.radio-option {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		border: 2px solid var(--color-border);
		border-radius: var(--border-radius-sm);
		cursor: pointer;
		transition: all var(--transition-normal);
		flex: 1;
		justify-content: center;
		background: var(--color-background);
		font-weight: var(--font-weight-medium);
	}

	.radio-option:hover {
		border-color: var(--color-primary);
		background: var(--color-background-light);
	}

	.radio-option input[type='radio'] {
		margin: 0;
		width: auto;
		min-height: auto;
	}

	.radio-option:has(input:checked) {
		border-color: var(--color-primary);
		background: var(--color-primary);
		color: white;
	}

	.radio-icon {
		font-size: 1.2em;
	}

	.input-with-suffix {
		position: relative;
		display: flex;
		align-items: center;
	}

	input {
		width: 100%;
		padding: 1rem var(--spacing-md);
		border: 2px solid var(--color-border);
		border-radius: var(--border-radius-sm);
		font-size: var(--font-size-body);
		font-family: var(--font-family);
		background-color: var(--color-background);
		color: var(--color-text-primary);
		transition:
			border-color var(--transition-normal),
			box-shadow var(--transition-normal),
			background-color var(--transition-normal);
		box-sizing: border-box;
		min-height: 48px; /* Minimum touch target size */
	}

	.input-with-suffix input {
		padding-right: 4rem;
	}

	.input-suffix {
		position: absolute;
		right: var(--spacing-md);
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-small);
		background: var(--color-background-light);
		padding: 0.25rem 0.5rem;
		border-radius: var(--border-radius-sm);
		border: 1px solid var(--color-border-light);
		pointer-events: none;
	}

	input:focus {
		outline: none;
		border-color: var(--color-blue);
		box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
		background-color: var(--color-background);
	}

	input:hover:not(:focus) {
		border-color: var(--color-text-secondary);
	}

	input:invalid:not(:focus) {
		border-color: #cc0000;
	}

	input:invalid:focus {
		border-color: #cc0000;
		box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.2);
	}

	/* Error state styling */
	input.error {
		border-color: #cc0000;
		background-color: #fff5f5;
	}

	input.error:focus {
		border-color: #cc0000;
		box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.2);
		background-color: #fff5f5;
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

	.error-message::before {
		content: '⚠️';
		font-size: 0.9em;
	}

	.submit-button {
		width: 100%;
		padding: 1rem var(--spacing-lg);
		background-color: var(--color-primary);
		color: var(--color-background);
		border: none;
		border-radius: var(--border-radius-sm);
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-semibold);
		font-family: var(--font-family);
		cursor: pointer;
		transition:
			background-color var(--transition-normal),
			transform var(--transition-fast),
			box-shadow var(--transition-normal);
		margin-top: var(--spacing-lg);
		min-height: 48px; /* Minimum touch target size */
		position: relative;
		overflow: hidden;
	}

	.submit-button:hover:not(:disabled) {
		background-color: var(--color-primary-dark);
		transform: translateY(-1px);
		box-shadow: var(--shadow-light);
	}

	.submit-button:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: none;
	}

	.submit-button:disabled {
		background-color: var(--color-text-light);
		cursor: not-allowed;
		opacity: 0.6;
		transform: none;
		box-shadow: none;
	}

	.submit-button:focus {
		outline: 2px solid var(--color-blue);
		outline-offset: 2px;
	}

	/* Enhanced focus indicators for accessibility */
	input:focus,
	.submit-button:focus {
		outline: 2px solid var(--color-blue);
		outline-offset: 2px;
	}

	.radio-option:focus-within {
		outline: 2px solid var(--color-blue);
		outline-offset: 2px;
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.input-form {
			border: 2px solid var(--color-text-primary);
		}

		input,
		.radio-option {
			border-width: 2px;
		}

		input:focus,
		.radio-option:focus-within {
			border-color: var(--color-blue);
			outline: 3px solid var(--color-blue);
		}

		.submit-button {
			border: 2px solid var(--color-text-primary);
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		input,
		.submit-button,
		.radio-option {
			transition: none;
		}

		.submit-button:hover:not(:disabled) {
			transform: none;
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.input-form {
			padding: var(--spacing-lg);
			border-radius: var(--border-radius-md);
		}

		h2 {
			font-size: var(--font-size-h3);
		}

		.form-group {
			margin-bottom: var(--spacing-lg);
		}

		.radio-group {
			flex-direction: column;
			gap: var(--spacing-sm);
		}

		.radio-option {
			justify-content: flex-start;
		}
	}

	@media (max-width: 480px) {
		.input-form {
			padding: var(--spacing-md);
		}

		input,
		.submit-button {
			font-size: 16px; /* Prevent zoom on iOS */
		}
	}
</style>
