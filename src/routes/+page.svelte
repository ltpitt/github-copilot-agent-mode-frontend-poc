<script lang="ts">
	import { calculateMonthlyPayment } from '$lib/mortgageCalculator.js';
	import InputForm from '$lib/InputForm.svelte';
	import ResultDisplay from '$lib/ResultDisplay.svelte';

	// State for storing the calculation result and form data
	let monthlyPayment = $state(0);
	let maximumMortgage = $state(0);
	let calculationData = $state({
		principal: 0,
		annualInterestRate: 0,
		durationYears: 0
	});

	// Handle form submission from InputForm component
	function handleFormSubmit(data: {
		principal: number;
		annualInterestRate: number;
		durationYears: number;
		buyingAlone: boolean;
	}) {
		try {
			const { principal, annualInterestRate, durationYears } = data;
			const annualRate = annualInterestRate / 100; // Convert percentage to decimal
			const numberOfPayments = durationYears * 12; // Convert years to months

			// Calculate maximum loan amount based on income (4.5x annual income)
			const maxLoanAmount = principal * 4.5;
			maximumMortgage = maxLoanAmount;

			// Calculate monthly payment for the maximum loan amount
			monthlyPayment = calculateMonthlyPayment(maxLoanAmount, annualRate, numberOfPayments);
			calculationData = { principal, annualInterestRate, durationYears };
		} catch (error) {
			console.error('Error in calculation:', error);
			monthlyPayment = 0;
			maximumMortgage = 0;
			calculationData = { principal: 0, annualInterestRate: 0, durationYears: 0 };
		}
	}
</script>

<main>
	<h1>Mortgage Calculator</h1>
	<p class="subtitle">
		Calculate your maximum mortgage quickly and easily. This is useful if you are looking to buy a
		house, or if you are just curious.
	</p>

	<div class="calculator-container">
		<div class="calculator-form">
			<InputForm onsubmit={handleFormSubmit} />
		</div>
		<div class="calculator-results">
			<ResultDisplay {monthlyPayment} {maximumMortgage} {calculationData} />
		</div>
	</div>
</main>

<style>
	/* CSS Custom Properties for ING Design System */
	:global(:root) {
		/* ING Color Palette */
		--color-primary: #ff6200;
		--color-primary-dark: #e55a00;
		--color-primary-light: #ff7a1a;

		--color-text-primary: #333333;
		--color-text-secondary: #666666;
		--color-text-light: #999999;

		--color-background: #ffffff;
		--color-background-light: #f5f5f5;
		--color-background-lighter: #fafafa;

		--color-border: #dddddd;
		--color-border-light: #eeeeee;

		--color-blue: #0066cc;
		--color-blue-dark: #003366;
		--color-blue-light: #e6f2ff;

		/* Typography */
		--font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
		--font-size-h1: 2.5rem;
		--font-size-h2: 2rem;
		--font-size-h3: 1.75rem;
		--font-size-body: 1rem;
		--font-size-small: 0.875rem;

		--font-weight-regular: 400;
		--font-weight-medium: 500;
		--font-weight-semibold: 600;
		--font-weight-bold: 700;

		--line-height-tight: 1.2;
		--line-height-normal: 1.5;
		--line-height-relaxed: 1.6;

		/* Spacing */
		--spacing-xs: 0.5rem;
		--spacing-sm: 1rem;
		--spacing-md: 1.5rem;
		--spacing-lg: 2rem;
		--spacing-xl: 3rem;
		--spacing-2xl: 4rem;

		/* Border radius */
		--border-radius-sm: 4px;
		--border-radius-md: 8px;
		--border-radius-lg: 12px;

		/* Shadows */
		--shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
		--shadow-medium: 0 4px 16px rgba(0, 0, 0, 0.15);
		--shadow-heavy: 0 8px 32px rgba(0, 0, 0, 0.2);

		/* Transitions */
		--transition-fast: 0.15s ease;
		--transition-normal: 0.2s ease;
		--transition-slow: 0.3s ease;
	}

	:global(body) {
		font-family: var(--font-family);
		background-color: var(--color-background-lighter);
		color: var(--color-text-primary);
		line-height: var(--line-height-normal);
		margin: 0;
		padding: 0;
	}

	main {
		min-height: 100vh;
		padding: var(--spacing-lg) var(--spacing-sm);
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		color: var(--color-text-primary);
		text-align: left;
		margin-bottom: var(--spacing-sm);
		font-size: var(--font-size-h1);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		letter-spacing: -0.02em;
	}

	.subtitle {
		color: var(--color-text-secondary);
		font-size: var(--font-size-body);
		line-height: var(--line-height-relaxed);
		margin-bottom: calc(var(--spacing-xl) * 1.5);
		max-width: 600px;
	}

	.calculator-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: calc(var(--spacing-xl) * 2);
		align-items: start;
		margin-top: var(--spacing-xl);
	}

	.calculator-form,
	.calculator-results {
		/* Ensure consistent spacing */
		margin: 0;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		:global(:root) {
			--font-size-h1: 2rem;
			--font-size-h2: 1.5rem;
		}

		main {
			padding: var(--spacing-md) var(--spacing-sm);
		}

		h1 {
			margin-bottom: var(--spacing-sm);
			text-align: center;
		}

		.subtitle {
			text-align: center;
			margin-bottom: var(--spacing-lg);
		}

		.calculator-container {
			grid-template-columns: 1fr;
			gap: calc(var(--spacing-lg) * 1.5);
			margin-top: var(--spacing-lg);
		}
	}

	@media (max-width: 480px) {
		main {
			padding: var(--spacing-sm);
		}

		.calculator-container {
			gap: var(--spacing-md);
		}
	}

	/* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		:global(*) {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}

	@media (prefers-contrast: high) {
		:global(:root) {
			--color-primary: #cc4e00;
			--color-border: #333333;
		}
	}
</style>
