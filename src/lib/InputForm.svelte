<script lang="ts">
	import { validateFormInputs } from './validation.js';
	import NumberInput from './NumberInput.svelte';

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
		<NumberInput
			id="principal"
			label="Your gross annual income"
			bind:value={principal}
			min={1}
			max={10000000}
			step={1000}
			suffix="EUR"
			required
			error={shouldShowErrors() && !!validationResults()?.errors?.principal}
			errorMessage={validationResults()?.errors?.principal || ''}
			oninput={handleInputInteraction}
			onblur={handleInputInteraction}
			onkeydown={handleKeyDown}
		/>
	</div>

	<div class="form-group">
		<NumberInput
			id="interest-rate"
			label="Annual Interest Rate (%)"
			bind:value={annualInterestRate}
			min={0}
			max={50}
			step={0.01}
			suffix="%"
			required
			error={shouldShowErrors() && !!validationResults()?.errors?.interestRate}
			errorMessage={validationResults()?.errors?.interestRate || ''}
			oninput={handleInputInteraction}
			onblur={handleInputInteraction}
			onkeydown={handleKeyDown}
		/>
	</div>

	<div class="form-group">
		<NumberInput
			id="duration"
			label="Duration (years)"
			bind:value={durationYears}
			min={1}
			max={50}
			step={1}
			suffix="years"
			required
			error={shouldShowErrors() && !!validationResults()?.errors?.duration}
			errorMessage={validationResults()?.errors?.duration || ''}
			oninput={handleInputInteraction}
			onblur={handleInputInteraction}
			onkeydown={handleKeyDown}
		/>
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

	/* Increase spacing between form groups for better visual hierarchy */
	.form-group:not(:last-child) {
		margin-bottom: calc(var(--spacing-xl) * 1.5);
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

		.radio-option {
			border-width: 2px;
		}

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

		.submit-button {
			font-size: 16px; /* Prevent zoom on iOS */
		}
	}
</style>
