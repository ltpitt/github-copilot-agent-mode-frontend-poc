<script lang="ts">
	import { validateFormInputs } from '../utils/validation.js';
	import NumberInput from './NumberInput.svelte';
	import EnergyLabelSelect from './EnergyLabelSelect.svelte';
	import type { EnergyLabel } from '../utils/mortgageCalculator.js';

	// Props for event callbacks
	interface Props {
		onsubmit?: (data: {
			principal: number;
			annualInterestRate: number;
			durationYears: number;
			buyingAlone: boolean | null;
			energyLabel: EnergyLabel | null;
			partnerIncome?: number;
		}) => void;
	}

	let { onsubmit }: Props = $props();

	// Reactive state using Svelte 5 runes
	let principal = $state(300000); // Default loan amount in Euros
	let partnerIncome = $state(0); // Partner's gross annual income
	let annualInterestRate = $state(3.5); // Default annual interest rate in percentage
	let durationYears = $state(30); // Default duration in years
	let buyingAlone = $state<boolean | null>(true); // Default to 'Alone' preselected
	let energyLabel = $state<EnergyLabel | null>(null); // Energy label selection

	// Validation state
	let hasInteracted = $state(false); // Track if user has interacted with form
	let showErrors = $state(false); // Control when to show error messages

	// Form validation derived state - include partnerIncome for Together scenarios
	let validationResults = $derived(() => {
		return validateFormInputs(
			principal,
			annualInterestRate,
			durationYears,
			buyingAlone,
			energyLabel,
			partnerIncome
		);
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

		console.log('Form submitted, validation state:', {
			isFormValid: isFormValid(),
			buyingAlone,
			energyLabel,
			validationResults: validationResults()
		});

		if (isFormValid()) {
			// Calculate total income for the calculation
			const totalIncome = buyingAlone ? principal : principal + partnerIncome;

			onsubmit?.({
				principal: totalIncome, // Pass combined income as principal for calculation
				annualInterestRate,
				durationYears,
				buyingAlone,
				energyLabel,
				partnerIncome
			});
		} else {
			console.log('Form validation failed');
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
		<fieldset class:error={shouldShowErrors() && !!validationResults()?.errors?.buyingType}>
			<legend class="question-label">Do you buy alone or together?</legend>
			<div class="radio-group">
				<label class="radio-option">
					<input
						type="radio"
						bind:group={buyingAlone}
						value={true}
						name="buying-type"
						dataTestId="buying-alone-true"
						oninput={handleInputInteraction}
						aria-label="Buying alone"
					/>
					<span class="radio-icon">👤</span>
					Alone
				</label>
				<label class="radio-option">
					<input
						type="radio"
						bind:group={buyingAlone}
						value={false}
						name="buying-type"
						dataTestId="buying-alone-false"
						oninput={handleInputInteraction}
						aria-label="Buying together"
					/>
					<span class="radio-icon">👥</span>
					Together
				</label>
			</div>
			{#if shouldShowErrors() && validationResults()?.errors?.buyingType}
				<div class="error-message" role="alert" dataTestId="buying-alone-error-message">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="error-icon">
						<path
							d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8S4.4 14.5 8 14.5 14.5 11.6 14.5 8 11.6 1.5 8 1.5zm0 11.5c-.4 0-.8-.3-.8-.8s.3-.8.8-.8.8.3.8.8-.4.8-.8.8zm.8-3.2h-1.6V5.2h1.6v4.6z"
						/>
					</svg>
					{validationResults()?.errors?.buyingType}
				</div>
			{/if}
		</fieldset>
	</div>

	<div class="form-group">
		<NumberInput
			id="principal"
			label="Your gross annual income"
			bind:value={principal}
			min={1}
			max={10000000}
			suffix="EUR"
			required
			error={shouldShowErrors() && !!validationResults()?.errors?.principal}
			errorMessage={validationResults()?.errors?.principal || ''}
			helperText="Enter any amount between €1 and €10,000,000"
			oninput={handleInputInteraction}
			onblur={handleInputInteraction}
			onkeydown={handleKeyDown}
			dataTestId="principal-input"
		/>
	</div>

	{#if buyingAlone === false}
		<div class="form-group">
			<NumberInput
				id="partner-income"
				label="Partner's gross annual income"
				bind:value={partnerIncome}
				min={1}
				max={10000000}
				suffix="EUR"
				required
				error={shouldShowErrors() && !!validationResults()?.errors?.partnerIncome}
				errorMessage={validationResults()?.errors?.partnerIncome || ''}
				helperText="Enter any amount between €1 and €10,000,000"
				oninput={handleInputInteraction}
				onblur={handleInputInteraction}
				onkeydown={handleKeyDown}
			/>
		</div>
	{/if}

	<div class="form-group">
		<NumberInput
			id="interest-rate"
			label="Annual Interest Rate (%)"
			bind:value={annualInterestRate}
			min={0}
			max={50}
			suffix="%"
			required
			error={shouldShowErrors() && !!validationResults()?.errors?.interestRate}
			errorMessage={validationResults()?.errors?.interestRate || ''}
			helperText="Enter rate between 0% and 50% (e.g., 3.5, 4.25)"
			oninput={handleInputInteraction}
			onblur={handleInputInteraction}
			onkeydown={handleKeyDown}
			dataTestId="interest-rate-input"
		/>
	</div>

	<div class="form-group">
		<NumberInput
			id="duration"
			label="Duration (years)"
			bind:value={durationYears}
			min={1}
			max={50}
			suffix="years"
			required
			error={shouldShowErrors() && !!validationResults()?.errors?.duration}
			errorMessage={validationResults()?.errors?.duration || ''}
			helperText="Enter a whole number between 1 and 50 years"
			oninput={handleInputInteraction}
			onblur={handleInputInteraction}
			onkeydown={handleKeyDown}
			dataTestId="duration-input"
		/>
	</div>

	<div class="form-group">
		<EnergyLabelSelect
			id="energy-label"
			label="Energy label"
			bind:value={energyLabel}
			required
			error={shouldShowErrors() && !!validationResults()?.errors?.energyLabel}
			errorMessage={validationResults()?.errors?.energyLabel || ''}
			helperText="Select the energy efficiency rating of the property"
			oninput={handleInputInteraction}
			onblur={handleInputInteraction}
			onchange={handleInputInteraction}
			dataTestId="energy-label-select"
		/>
	</div>

	<button type="submit" class="submit-button" disabled={!isFormValid()} data-testid="calculate-button">
		{#if isFormValid()}
			Calculate
		{:else}
			Please fix errors above
		{/if}
	</button>
</form>

<style>
	.input-form {
		background: var(--color-background-section);
		padding: var(--spacing-3xl);
		border-radius: var(--border-radius-xl);
		box-shadow: var(--shadow-lg);
		border: 1px solid var(--color-border-light);
		width: 100%;
		margin: 0;
		position: relative;
		backdrop-filter: blur(10px);
	}

	.input-form::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
		border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
	}

	h2 {
		color: var(--color-primary);
		margin-bottom: var(--spacing-2xl);
		font-size: var(--font-size-h3);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		font-family: var(--font-family-display);
		letter-spacing: -0.01em;
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

	fieldset.error {
		border: 2px solid #cc0000;
		border-radius: var(--border-radius-sm);
		padding: var(--spacing-md);
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

	.error-icon {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
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
		gap: var(--spacing-md);
	}

	.radio-option {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-lg) var(--spacing-xl);
		border: 2px solid var(--color-border);
		border-radius: var(--border-radius-md);
		cursor: pointer;
		transition: all var(--transition-normal);
		flex: 1;
		justify-content: center;
		background: var(--color-background);
		font-weight: var(--font-weight-medium);
		position: relative;
		overflow: hidden;
		min-height: 56px;
		font-size: var(--font-size-body);
	}

	.radio-option::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 98, 0, 0.1), transparent);
		transition: left var(--transition-slow);
	}

	.radio-option:hover::before {
		left: 100%;
	}

	.radio-option:hover {
		border-color: var(--color-primary);
		background: var(--color-primary-lighter);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.radio-option input[type='radio'] {
		margin: 0;
		width: auto;
		min-height: auto;
		position: relative;
		z-index: 2;
	}

	.radio-option:has(input:checked) {
		border-color: var(--color-primary);
		background: var(--color-primary);
		color: white;
		transform: translateY(-1px);
		box-shadow: var(--shadow-lg);
	}

	.radio-option:has(input:checked)::before {
		display: none;
	}

	.radio-icon {
		font-size: 1.25em;
		position: relative;
		z-index: 2;
	}

	.submit-button {
		width: 100%;
		padding: var(--spacing-lg) var(--spacing-2xl);
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
		color: var(--color-background);
		border: none;
		border-radius: var(--border-radius-md);
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-semibold);
		font-family: var(--font-family);
		cursor: pointer;
		transition: all var(--transition-normal);
		margin-top: var(--spacing-2xl);
		min-height: 56px;
		position: relative;
		overflow: hidden;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		box-shadow: var(--shadow-md);
	}

	.submit-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left var(--transition-slow);
	}

	.submit-button:hover:not(:disabled)::before {
		left: 100%;
	}

	.submit-button:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
		transform: translateY(-2px);
		box-shadow: var(--shadow-xl);
	}

	.submit-button:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: var(--shadow-md);
	}

	.submit-button:disabled {
		background: linear-gradient(135deg, var(--color-text-light) 0%, #aaa 100%);
		cursor: not-allowed;
		opacity: 0.7;
		transform: none;
		box-shadow: var(--shadow-sm);
	}

	.submit-button:disabled::before {
		display: none;
	}

	.submit-button:focus {
		outline: none;
		box-shadow: var(--shadow-xl), var(--focus-ring);
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

	/* Enhanced Responsive design */
	@media (max-width: 768px) {
		.input-form {
			padding: var(--spacing-2xl);
			border-radius: var(--border-radius-lg);
		}

		h2 {
			font-size: var(--font-size-h4);
			text-align: center;
		}

		.form-group {
			margin-bottom: var(--spacing-xl);
		}

		.radio-group {
			flex-direction: column;
			gap: var(--spacing-md);
		}

		.radio-option {
			justify-content: flex-start;
			padding: var(--spacing-md) var(--spacing-lg);
		}
	}

	@media (max-width: 480px) {
		.input-form {
			padding: var(--spacing-xl);
		}

		.submit-button {
			font-size: 16px; /* Prevent zoom on iOS */
			min-height: 52px;
		}
	}
</style>
