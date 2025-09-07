<script lang="ts">
	import {
		calculateMortgageWithEnergyLabel,
		type EnergyLabel,
		type MortgageCalculationResult,
		InputForm,
		ResultDisplay
	} from '$lib';

	// State for storing the calculation result and form data
	let calculationResult = $state<MortgageCalculationResult | null>(null);
	let calculationData = $state({
		principal: 0,
		annualInterestRate: 0,
		durationYears: 0,
		energyLabel: null as EnergyLabel | null
	});

	// Handle form submission from InputForm component
	function handleFormSubmit(data: {
		principal: number;
		annualInterestRate: number;
		durationYears: number;
		buyingAlone: boolean | null;
		energyLabel: EnergyLabel | null;
	}) {
		try {
			const { principal, annualInterestRate, durationYears, buyingAlone, energyLabel } = data;

			// Ensure we have valid data
			if (buyingAlone === null) {
				console.error('Buying type not selected');
				return;
			}

			if (energyLabel === null) {
				console.error('Energy label not selected');
				return;
			}

			const annualRate = annualInterestRate / 100; // Convert percentage to decimal

			// For demonstration, we'll use the income as home value * 1.2 (typical scenario)
			// In a real application, this would come from property appraisal
			const homeValue = principal * 6; // Rough estimate: 6x annual income for home value

			// Calculate mortgage with energy label considerations
			calculationResult = calculateMortgageWithEnergyLabel(
				principal, // income
				homeValue, // home value
				energyLabel,
				annualRate,
				durationYears
			);

			calculationData = { principal, annualInterestRate, durationYears, energyLabel };
		} catch (error) {
			console.error('Error in calculation:', error);
			calculationResult = null;
			calculationData = {
				principal: 0,
				annualInterestRate: 0,
				durationYears: 0,
				energyLabel: null
			};
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
			<ResultDisplay
				monthlyPayment={calculationResult?.monthlyPayment || 0}
				maximumMortgage={calculationResult?.finalLoanAmount || 0}
				{calculationData}
				{calculationResult}
			/>
		</div>
	</div>
</main>

<style>
	/* CSS Custom Properties for ING Design System - Enhanced Professional Banking Style */
	:global(:root) {
		/* ING Color Palette - Enhanced */
		--color-primary: #ff6200;
		--color-primary-dark: #e55a00;
		--color-primary-light: #ff7a1a;
		--color-primary-lighter: #fff5f0;

		--color-text-primary: #1a1a1a;
		--color-text-secondary: #4a4a4a;
		--color-text-light: #888888;
		--color-text-placeholder: #999999;

		--color-background: #ffffff;
		--color-background-light: #f8f9fa;
		--color-background-lighter: #fafbfc;
		--color-background-section: #ffffff;

		--color-border: #e1e5e9;
		--color-border-light: #f1f3f5;
		--color-border-focus: #ff6200;

		--color-blue: #0066cc;
		--color-blue-dark: #003366;
		--color-blue-light: #e6f2ff;

		--color-success: #28a745;
		--color-warning: #ffc107;
		--color-error: #dc3545;

		/* Typography - Professional Banking Grade */
		--font-family-primary:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		--font-family-display:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, Roboto, 'Helvetica Neue', Arial,
			sans-serif;
		--font-family: var(--font-family-primary);

		--font-size-h1: 2.75rem;
		--font-size-h2: 2.25rem;
		--font-size-h3: 1.75rem;
		--font-size-h4: 1.375rem;
		--font-size-body-large: 1.125rem;
		--font-size-body: 1rem;
		--font-size-small: 0.875rem;
		--font-size-xs: 0.75rem;

		--font-weight-light: 300;
		--font-weight-regular: 400;
		--font-weight-medium: 500;
		--font-weight-semibold: 600;
		--font-weight-bold: 700;
		--font-weight-extrabold: 800;

		--line-height-tight: 1.2;
		--line-height-normal: 1.5;
		--line-height-relaxed: 1.6;
		--line-height-loose: 1.8;

		/* Enhanced Spacing System */
		--spacing-xs: 0.5rem; /* 8px */
		--spacing-sm: 0.75rem; /* 12px */
		--spacing-md: 1rem; /* 16px */
		--spacing-lg: 1.5rem; /* 24px */
		--spacing-xl: 2rem; /* 32px */
		--spacing-2xl: 2.5rem; /* 40px */
		--spacing-3xl: 3rem; /* 48px */
		--spacing-4xl: 4rem; /* 64px */

		/* Professional Border Radius */
		--border-radius-sm: 6px;
		--border-radius-md: 8px;
		--border-radius-lg: 12px;
		--border-radius-xl: 16px;

		/* Enhanced Shadows for Banking UI */
		--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
		--shadow-md: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
		--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
		--shadow-xl: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
		--shadow-light: var(--shadow-sm);
		--shadow-medium: var(--shadow-md);
		--shadow-heavy: var(--shadow-lg);

		/* Refined Transitions */
		--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
		--transition-normal: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		--transition-slow: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

		/* Professional Focus Ring */
		--focus-ring: 0 0 0 3px rgba(255, 98, 0, 0.3);
		--focus-ring-offset: 2px;
	}

	:global(body) {
		font-family: var(--font-family);
		background: linear-gradient(
			135deg,
			var(--color-background-lighter) 0%,
			var(--color-background-light) 100%
		);
		color: var(--color-text-primary);
		line-height: var(--line-height-normal);
		margin: 0;
		padding: 0;
		min-height: 100vh;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	:global(*) {
		box-sizing: border-box;
	}

	main {
		min-height: 100vh;
		padding: var(--spacing-3xl) var(--spacing-lg);
		max-width: 1400px;
		margin: 0 auto;
		position: relative;
	}

	/* Professional Header Section */
	h1 {
		color: var(--color-text-primary);
		text-align: left;
		margin: 0 0 var(--spacing-md) 0;
		font-size: var(--font-size-h1);
		font-weight: var(--font-weight-bold);
		line-height: var(--line-height-tight);
		letter-spacing: -0.03em;
		font-family: var(--font-family-display);
	}

	.subtitle {
		color: var(--color-text-secondary);
		font-size: var(--font-size-body-large);
		line-height: var(--line-height-relaxed);
		margin-bottom: var(--spacing-4xl);
		max-width: 640px;
		font-weight: var(--font-weight-regular);
	}

	/* Enhanced Calculator Container */
	.calculator-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-4xl);
		align-items: start;
		margin-top: var(--spacing-2xl);
		position: relative;
	}

	.calculator-form,
	.calculator-results {
		margin: 0;
		position: relative;
	}

	/* Add a subtle separator line between sections */
	.calculator-container::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 1px;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			var(--color-border-light) 20%,
			var(--color-border) 50%,
			var(--color-border-light) 80%,
			transparent 100%
		);
		transform: translateX(-50%);
	}

	/* Enhanced Responsive Design */
	@media (max-width: 1024px) {
		main {
			max-width: 100%;
			padding: var(--spacing-2xl) var(--spacing-lg);
		}

		.calculator-container {
			gap: var(--spacing-3xl);
		}
	}

	@media (max-width: 768px) {
		:global(:root) {
			--font-size-h1: 2.25rem;
			--font-size-h2: 1.75rem;
			--spacing-3xl: 2rem;
			--spacing-4xl: 2.5rem;
		}

		main {
			padding: var(--spacing-xl) var(--spacing-md);
		}

		h1 {
			margin-bottom: var(--spacing-md);
			text-align: center;
			font-size: var(--font-size-h1);
		}

		.subtitle {
			text-align: center;
			margin-bottom: var(--spacing-2xl);
			font-size: var(--font-size-body);
		}

		.calculator-container {
			grid-template-columns: 1fr !important;
			gap: var(--spacing-2xl);
			margin-top: var(--spacing-xl);
		}

		.calculator-container::before {
			display: none;
		}
	}

	@media (max-width: 480px) {
		main {
			padding: var(--spacing-lg) var(--spacing-sm);
			max-width: 100vw;
			box-sizing: border-box;
		}

		h1 {
			font-size: 2rem;
		}

		.calculator-container {
			gap: var(--spacing-xl);
			max-width: 100%;
			box-sizing: border-box;
		}

		:global(.input-form) {
			padding: var(--spacing-lg);
			max-width: 100%;
			box-sizing: border-box;
		}

		:global(.number-input-container) {
			max-width: 100%;
			box-sizing: border-box;
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
