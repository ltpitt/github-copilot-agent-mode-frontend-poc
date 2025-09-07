<script lang="ts">
	import type { EnergyLabel, MortgageCalculationResult } from '../utils/mortgageCalculator.js';

	// Props interface for the ResultDisplay component
	interface Props {
		monthlyPayment: number;
		maximumMortgage?: number;
		calculationData?: {
			principal: number;
			annualInterestRate: number;
			durationYears: number;
			energyLabel?: EnergyLabel | null;
		};
		calculationResult?: MortgageCalculationResult | null;
		label?: string;
	}

	let {
		monthlyPayment,
		maximumMortgage = 0,
		calculationData = { principal: 0, annualInterestRate: 0, durationYears: 0, energyLabel: null },
		calculationResult = null,
		label = 'Maximum mortgage'
	}: Props = $props();

	// Energy label colors
	const energyLabelColors: Record<EnergyLabel, string> = {
		A: '#00a651',
		B: '#8ac83b',
		C: '#ffd502',
		D: '#ffa500',
		E: '#ff6600',
		F: '#ff3300',
		G: '#cc0000'
	};

	// Format currency using EUR formatting for European markets
	let formattedMaxMortgage = $derived(() => {
		if (maximumMortgage == null || isNaN(maximumMortgage) || maximumMortgage <= 0) {
			return '€0';
		}

		return new Intl.NumberFormat('en-NL', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(maximumMortgage);
	});

	let formattedMonthlyPayment = $derived(() => {
		if (monthlyPayment == null || isNaN(monthlyPayment) || monthlyPayment < 0) {
			return '€0';
		}

		return new Intl.NumberFormat('en-NL', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(monthlyPayment);
	});

	// Format other amounts from calculation result
	let formattedBaseCapacity = $derived(() => {
		if (!calculationResult?.baseCapacity) return '€0';
		return new Intl.NumberFormat('en-NL', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(calculationResult.baseCapacity);
	});

	let formattedEnergyAdjustment = $derived(() => {
		if (!calculationResult?.energyLabelAdjustment) return '€0';
		const amount = calculationResult.energyLabelAdjustment;
		const formatted = new Intl.NumberFormat('en-NL', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(Math.abs(amount));
		return amount >= 0 ? `+${formatted}` : `-${formatted}`;
	});

	let formattedOutOfPocket = $derived(() => {
		if (!calculationResult?.outOfPocket) return '€0';
		return new Intl.NumberFormat('en-NL', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(calculationResult.outOfPocket);
	});

	// Determine if the payment amount is valid for styling purposes
	let isValidCalculation = $derived(() => {
		return monthlyPayment != null && !isNaN(monthlyPayment) && monthlyPayment > 0;
	});

	let interestDescription = $derived(() => {
		if (!isValidCalculation()) return '';
		return `Annuity, ${calculationData.durationYears} year fixed ${calculationData.annualInterestRate}%`;
	});

	// Get energy label color
	let energyLabelColor = $derived(() => {
		if (!calculationResult?.energyLabel) return '#999999';
		return energyLabelColors[calculationResult.energyLabel];
	});
</script>

<div class="result-container">
	<div class="result-display" class:invalid={!isValidCalculation()}>
		<div class="result-header">
			<div class="house-with-label">
				<div class="house-icon">🏠</div>
				{#if calculationResult?.energyLabel}
					<div
						class="energy-label"
						style:background-color={energyLabelColor()}
						data-testid="energy-label-display"
					>
						{calculationResult.energyLabel}
					</div>
				{/if}
			</div>
			<div class="result-main">
				<h3 class="result-title">{label}</h3>
				<div class="result-value" class:valid={isValidCalculation()} data-testid="maximum-mortgage">
					{formattedMaxMortgage()}
				</div>
			</div>
		</div>

		{#if isValidCalculation() && calculationResult}
			<div class="result-details">
				<div class="detail-item">
					<span class="detail-label">Gross monthly costs</span>
					<span class="detail-value" data-testid="monthly-payment">{formattedMonthlyPayment()}</span
					>
				</div>

				{#if calculationResult.outOfPocket > 0}
					<div class="detail-item">
						<span class="detail-label">Out of pocket</span>
						<span class="detail-value">{formattedOutOfPocket()}</span>
					</div>
				{/if}

				<div class="breakdown-section">
					<h4 class="breakdown-title">Mortgage Breakdown</h4>

					<div class="breakdown-item">
						<span class="breakdown-label">Base capacity (income × 4.5)</span>
						<span class="breakdown-value">{formattedBaseCapacity()}</span>
					</div>

					{#if calculationResult.energyLabelAdjustment !== 0}
						<div
							class="breakdown-item energy-adjustment"
							class:positive={calculationResult.energyLabelAdjustment > 0}
							class:negative={calculationResult.energyLabelAdjustment < 0}
						>
							<span class="breakdown-label">
								Energy label {calculationResult.energyLabel} adjustment
							</span>
							<span class="breakdown-value">{formattedEnergyAdjustment()}</span>
						</div>
					{/if}

					{#if calculationResult.finalLoanAmount < calculationResult.revisedCapacity}
						<div class="breakdown-item constraint">
							<span class="breakdown-label">Limited by appraised value</span>
							<span class="breakdown-note">Capped at property value</span>
						</div>
					{/if}
				</div>

				<div class="interest-info">
					{interestDescription()}
					{#if calculationResult.energyLabel}
						<br />Energy label:
						<strong style:color={energyLabelColor()}>{calculationResult.energyLabel}</strong>
					{/if}
				</div>
			</div>
		{:else if isValidCalculation()}
			<div class="result-details">
				<div class="detail-item">
					<span class="detail-label">Gross monthly costs</span>
					<span class="detail-value">{formattedMonthlyPayment()}</span>
				</div>

				<div class="interest-info">
					{interestDescription()}
				</div>
			</div>
		{/if}
	</div>

	{#if isValidCalculation()}
		<div class="action-section">
			<div class="disclaimer">
				This is an estimation. Make further calculations for more certainty.
			</div>
		</div>
	{:else}
		<div class="placeholder-info">
			<div class="placeholder-icon">💡</div>
			<p>Enter your details on the left to see your maximum mortgage amount.</p>
		</div>
	{/if}
</div>

<style>
	.result-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.result-display {
		background: var(--color-background-section);
		padding: var(--spacing-3xl);
		border-radius: var(--border-radius-xl);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-lg);
		transition: all var(--transition-normal);
		position: relative;
		backdrop-filter: blur(10px);
	}

	.result-display::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
		border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
	}

	.result-display.invalid {
		background: #fefefe;
		border-color: var(--color-border-light);
		box-shadow: var(--shadow-sm);
	}

	.result-header {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-xl);
		margin-bottom: var(--spacing-2xl);
	}

	.house-icon {
		font-size: 3.5rem;
		color: var(--color-primary);
		flex-shrink: 0;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
	}

	.house-with-label {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.energy-label {
		width: 40px;
		height: 32px;
		border-radius: var(--border-radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-body);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
		box-shadow: var(--shadow-sm);
		border: 2px solid white;
		margin-top: -8px;
	}

	.result-main {
		flex: 1;
	}

	.result-title {
		color: var(--color-text-primary);
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-semibold);
		margin: 0 0 var(--spacing-sm) 0;
		line-height: var(--line-height-normal);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-size: var(--font-size-small);
	}

	.result-value {
		font-weight: var(--font-weight-bold);
		font-size: 3rem;
		color: var(--color-text-light);
		transition: all var(--transition-normal);
		font-family: var(--font-family-display);
		letter-spacing: -0.03em;
		line-height: var(--line-height-tight);
		margin: 0;
		background: linear-gradient(
			135deg,
			var(--color-text-light) 0%,
			var(--color-text-secondary) 100%
		);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.result-value.valid {
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		color: var(--color-primary);
	}

	.result-details {
		border-top: 1px solid var(--color-border-light);
		padding-top: var(--spacing-xl);
		background: linear-gradient(
			135deg,
			var(--color-background-lighter) 0%,
			var(--color-background) 100%
		);
		margin: 0 calc(-1 * var(--spacing-3xl)) calc(-1 * var(--spacing-3xl));
		padding: var(--spacing-xl) var(--spacing-3xl) var(--spacing-3xl);
		border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-lg);
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid var(--color-border-light);
	}

	.detail-item:last-of-type {
		border-bottom: none;
		margin-bottom: var(--spacing-md);
		padding-bottom: 0;
	}

	.detail-label {
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-body);
	}

	.detail-value {
		color: var(--color-text-primary);
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-h4);
		font-family: var(--font-family-display);
	}

	.interest-info {
		color: var(--color-text-secondary);
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-medium);
		margin-top: var(--spacing-md);
		padding: var(--spacing-md);
		background: var(--color-background);
		border-radius: var(--border-radius-md);
		border-left: 3px solid var(--color-primary);
	}

	.breakdown-section {
		margin: var(--spacing-lg) 0;
		padding: var(--spacing-md) 0;
		border-top: 1px solid var(--color-border-light);
	}

	.breakdown-title {
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-secondary);
		margin: 0 0 var(--spacing-md) 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.breakdown-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-sm) 0;
		font-size: var(--font-size-small);
	}

	.breakdown-label {
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-medium);
		flex: 1;
	}

	.breakdown-value {
		font-weight: var(--font-weight-bold);
		color: var(--color-text-primary);
	}

	.breakdown-note {
		font-size: var(--font-size-xs);
		color: var(--color-text-light);
		font-style: italic;
	}

	.energy-adjustment.positive .breakdown-value {
		color: #00a651;
	}

	.energy-adjustment.negative .breakdown-value {
		color: #cc0000;
	}

	.constraint .breakdown-label {
		color: var(--color-text-light);
		font-style: italic;
	}

	.action-section {
		text-align: center;
	}

	.disclaimer {
		color: var(--color-text-secondary);
		font-size: var(--font-size-small);
		line-height: var(--line-height-relaxed);
	}

	.placeholder-info {
		text-align: center;
		padding: var(--spacing-3xl);
		color: var(--color-text-secondary);
		background: linear-gradient(
			135deg,
			var(--color-background-lighter) 0%,
			var(--color-background-light) 100%
		);
		border-radius: var(--border-radius-xl);
		border: 2px dashed var(--color-border-light);
		position: relative;
	}

	.placeholder-info::before {
		content: '';
		position: absolute;
		top: -2px;
		left: -2px;
		right: -2px;
		bottom: -2px;
		background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
		border-radius: var(--border-radius-xl);
		opacity: 0.1;
		z-index: -1;
	}

	.placeholder-icon {
		font-size: 4rem;
		margin-bottom: var(--spacing-lg);
		opacity: 0.6;
		filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
	}

	.placeholder-info p {
		margin: 0;
		font-size: var(--font-size-body-large);
		line-height: var(--line-height-relaxed);
		font-weight: var(--font-weight-medium);
	}

	/* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		.result-display,
		.result-value {
			transition: none;
		}
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.result-display {
			border: 2px solid var(--color-text-primary);
		}

		.result-value.valid {
			color: var(--color-text-primary);
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.result-display {
			padding: var(--spacing-lg);
		}

		.result-header {
			flex-direction: column;
			align-items: center;
			text-align: center;
			gap: var(--spacing-md);
		}

		.result-value {
			font-size: 2rem;
		}

		.detail-item {
			flex-direction: column;
			align-items: stretch;
			text-align: center;
			gap: var(--spacing-xs);
		}

		.detail-value {
			font-size: var(--font-size-h2);
		}
	}

	@media (max-width: 480px) {
		.result-display {
			padding: var(--spacing-md);
		}

		.result-value {
			font-size: 1.75rem;
		}

		.house-icon {
			font-size: 2.5rem;
		}
	}

	/* Print styles */
	@media print {
		.result-display {
			border: 2px solid #333;
			box-shadow: none;
			background: white !important;
		}

		.result-value.valid {
			color: #333 !important;
		}
	}
</style>
