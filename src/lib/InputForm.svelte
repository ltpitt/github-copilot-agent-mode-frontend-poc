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
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		max-width: 500px;
		margin: 0 auto;
	}

	h2 {
		color: #ff6200;
		text-align: center;
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
	}

	.description {
		text-align: center;
		color: #666;
		margin-bottom: 2rem;
		font-size: 0.9rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #333;
		font-size: 0.95rem;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #ff6200;
		box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
	}

	input:invalid {
		border-color: #e74c3c;
	}

	.submit-button {
		width: 100%;
		padding: 1rem;
		background-color: #ff6200;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.2s,
			opacity 0.2s;
		margin-top: 1rem;
	}

	.submit-button:hover:not(:disabled) {
		background-color: #e55a00;
	}

	.submit-button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
		opacity: 0.6;
	}

	.submit-button:focus {
		outline: none;
		box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.3);
	}

	/* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		input,
		.submit-button {
			transition: none;
		}
	}

	/* Responsive design */
	@media (max-width: 600px) {
		.input-form {
			padding: 1.5rem;
			margin: 1rem;
		}

		h2 {
			font-size: 1.3rem;
		}
	}
</style>
