<script lang="ts">
	import { InputForm } from '$lib';
	import { calculateMonthlyPayment } from '$lib';

	let calculationResult = $state<{
		monthlyPayment: number;
		totalPayments: number;
		totalInterest: number;
	} | null>(null);

	function handleFormSubmit(data: {
		principal: number;
		annualInterestRate: number;
		durationYears: number;
	}) {
		const { principal, annualInterestRate, durationYears } = data;

		try {
			// Convert percentage to decimal and years to months
			const annualRate = annualInterestRate / 100;
			const numberOfPayments = durationYears * 12;

			const monthlyPayment = calculateMonthlyPayment(principal, annualRate, numberOfPayments);
			const totalPayments = monthlyPayment * numberOfPayments;
			const totalInterest = totalPayments - principal;

			calculationResult = {
				monthlyPayment,
				totalPayments,
				totalInterest
			};
		} catch (error) {
			console.error('Calculation error:', error);
			calculationResult = null;
		}
	}
</script>

<svelte:head>
	<title>InputForm Demo - Mortgage Calculator</title>
	<meta
		name="description"
		content="Demonstration of the InputForm component for mortgage calculations"
	/>
</svelte:head>

<main>
	<h1>InputForm Component Demo</h1>
	<p class="intro">
		This page demonstrates the <code>InputForm</code> component that emits form data on submit. The component
		uses Euro currency formatting and includes validation.
	</p>

	<div class="demo-container">
		<InputForm onsubmit={handleFormSubmit} />

		{#if calculationResult}
			<div class="results">
				<h3>Calculation Results</h3>
				<div class="result-grid">
					<div class="result-item">
						<span class="label">Monthly Payment:</span>
						<span class="value">€{calculationResult.monthlyPayment.toFixed(2)}</span>
					</div>
					<div class="result-item">
						<span class="label">Total Interest:</span>
						<span class="value">€{calculationResult.totalInterest.toFixed(2)}</span>
					</div>
					<div class="result-item">
						<span class="label">Total Amount:</span>
						<span class="value">€{calculationResult.totalPayments.toFixed(2)}</span>
					</div>
				</div>
			</div>
		{:else}
			<div class="placeholder">
				<p>Click "Calculate Monthly Payment" to see results</p>
			</div>
		{/if}
	</div>

	<div class="features">
		<h2>Component Features</h2>
		<ul>
			<li>✅ Input fields for principal, interest rate, and duration</li>
			<li>✅ Submit button with validation</li>
			<li>✅ Euro currency formatting</li>
			<li>✅ Reactive bindings using Svelte 5 runes</li>
			<li>✅ Custom event emission on form submit</li>
			<li>✅ Keyboard navigation support (Enter to submit)</li>
			<li>✅ Accessibility features (ARIA labels, focus management)</li>
			<li>✅ Responsive design</li>
		</ul>
	</div>
</main>

<style>
	main {
		padding: 2rem;
		max-width: 900px;
		margin: 0 auto;
		font-family: Arial, sans-serif;
	}

	h1 {
		color: #ff6200;
		text-align: center;
		margin-bottom: 1rem;
	}

	.intro {
		text-align: center;
		color: #666;
		margin-bottom: 3rem;
		line-height: 1.6;
	}

	code {
		background-color: #f5f5f5;
		padding: 0.2rem 0.4rem;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
	}

	.demo-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.results {
		background: #f8f9fa;
		padding: 2rem;
		border-radius: 8px;
		border: 2px solid #e9ecef;
	}

	.results h3 {
		color: #333;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.result-grid {
		display: grid;
		gap: 1rem;
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: white;
		border-radius: 6px;
		border: 1px solid #dee2e6;
	}

	.label {
		font-weight: 600;
		color: #555;
	}

	.value {
		font-weight: 700;
		color: #ff6200;
		font-size: 1.2rem;
	}

	.placeholder {
		background: #f8f9fa;
		padding: 2rem;
		border-radius: 8px;
		border: 2px dashed #dee2e6;
		text-align: center;
		color: #666;
	}

	.features {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.features h2 {
		color: #333;
		margin-bottom: 1.5rem;
	}

	.features ul {
		list-style: none;
		padding: 0;
	}

	.features li {
		padding: 0.5rem 0;
		color: #555;
		line-height: 1.5;
	}

	/* Responsive design */
	@media (min-width: 768px) {
		.demo-container {
			flex-direction: row;
			align-items: flex-start;
		}

		.demo-container > :first-child {
			flex: 1;
		}

		.results {
			flex: 1;
			margin-left: 2rem;
		}
	}

	@media (max-width: 600px) {
		main {
			padding: 1rem;
		}

		.result-item {
			flex-direction: column;
			text-align: center;
			gap: 0.5rem;
		}
	}
</style>
