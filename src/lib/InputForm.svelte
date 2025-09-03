<script lang="ts">
	// Props for event callbacks
	interface Props {
		onsubmit?: (data: {
			principal: number;
			annualInterestRate: number;
			durationYears: number;
		}) => void;
	}

	let { onsubmit }: Props = $props();

	// Reactive state using Svelte 5 runes
	let principal = $state(300000); // Default loan amount in Euros
	let annualInterestRate = $state(3.5); // Default annual interest rate in percentage
	let durationYears = $state(30); // Default duration in years

	// Form validation derived state
	let isFormValid = $derived(() => {
		return principal > 0 && annualInterestRate >= 0 && durationYears > 0;
	});

	// Handle form submission
	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (isFormValid()) {
			onsubmit?.({
				principal,
				annualInterestRate,
				durationYears
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
</script>

<form class="input-form" onsubmit={handleSubmit}>
	<h2>Mortgage Calculator</h2>
	<p class="description">Enter your loan details to calculate monthly payments in Euros</p>

	<div class="form-group">
		<label for="principal">Principal Amount (€)</label>
		<input
			id="principal"
			type="number"
			bind:value={principal}
			min="1"
			step="1000"
			placeholder="300000"
			onkeydown={handleKeyDown}
			required
		/>
	</div>

	<div class="form-group">
		<label for="interest-rate">Annual Interest Rate (%)</label>
		<input
			id="interest-rate"
			type="number"
			bind:value={annualInterestRate}
			min="0"
			max="50"
			step="0.01"
			placeholder="3.5"
			onkeydown={handleKeyDown}
			required
		/>
	</div>

	<div class="form-group">
		<label for="duration">Duration (years)</label>
		<input
			id="duration"
			type="number"
			bind:value={durationYears}
			min="1"
			max="50"
			step="1"
			placeholder="30"
			onkeydown={handleKeyDown}
			required
		/>
	</div>

	<button type="submit" class="submit-button" disabled={!isFormValid()}>
		Calculate Monthly Payment
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
		max-width: 500px;
		margin: 0 auto;
	}

	h2 {
		color: var(--color-text-primary);
		text-align: center;
		margin-bottom: var(--spacing-xs);
		font-size: var(--font-size-h2);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
	}

	.description {
		text-align: center;
		color: var(--color-text-secondary);
		margin-bottom: var(--spacing-xl);
		font-size: var(--font-size-small);
		line-height: var(--line-height-relaxed);
	}

	.form-group {
		margin-bottom: var(--spacing-lg);
		position: relative;
	}

	label {
		display: block;
		margin-bottom: var(--spacing-xs);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		font-size: var(--font-size-body);
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
		margin-top: var(--spacing-md);
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

	/* Loading state for button */
	.submit-button:active:not(:disabled)::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 20px;
		height: 20px;
		margin: -10px 0 0 -10px;
		border: 2px solid transparent;
		border-top: 2px solid rgba(255, 255, 255, 0.6);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Enhanced focus indicators for accessibility */
	input:focus,
	.submit-button:focus {
		outline: 2px solid var(--color-blue);
		outline-offset: 2px;
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.input-form {
			border: 2px solid var(--color-text-primary);
		}

		input {
			border-width: 2px;
		}

		input:focus {
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
		.submit-button {
			transition: none;
		}

		.submit-button:hover:not(:disabled) {
			transform: none;
		}

		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(0deg);
			}
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.input-form {
			padding: var(--spacing-lg);
			margin: var(--spacing-sm);
			border-radius: var(--border-radius-md);
		}

		h2 {
			font-size: var(--font-size-h3);
		}

		.form-group {
			margin-bottom: var(--spacing-md);
		}
	}

	@media (max-width: 480px) {
		.input-form {
			padding: var(--spacing-md);
			margin: var(--spacing-xs);
		}

		input,
		.submit-button {
			font-size: 16px; /* Prevent zoom on iOS */
		}
	}
</style>
