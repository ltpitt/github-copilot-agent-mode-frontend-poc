<script lang="ts">
	// Props interface for the ResultDisplay component
	interface Props {
		monthlyPayment: number;
		maximumMortgage?: number;
		calculationData?: {
			principal: number;
			annualInterestRate: number;
			durationYears: number;
		};
		label?: string;
	}

	let {
		monthlyPayment,
		maximumMortgage = 0,
		calculationData = { principal: 0, annualInterestRate: 0, durationYears: 0 },
		label = 'Maximum mortgage'
	}: Props = $props();

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

	// Determine if the payment amount is valid for styling purposes
	let isValidCalculation = $derived(() => {
		return monthlyPayment != null && !isNaN(monthlyPayment) && monthlyPayment > 0;
	});

	let interestDescription = $derived(() => {
		if (!isValidCalculation()) return '';
		return `Annuity, ${calculationData.durationYears} year fixed ${calculationData.annualInterestRate}%`;
	});
</script>

<div class="result-container">
	<div class="result-display" class:invalid={!isValidCalculation()}>
		<div class="result-header">
			<div class="house-icon">🏠</div>
			<div class="result-main">
				<h3 class="result-title">{label}</h3>
				<div class="result-value" class:valid={isValidCalculation()}>
					{formattedMaxMortgage()}
				</div>
			</div>
		</div>

		{#if isValidCalculation()}
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
			<button class="action-button"> Further calculations </button>

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
		background: var(--color-background);
		padding: var(--spacing-xl);
		border-radius: var(--border-radius-lg);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-medium);
		transition: all var(--transition-normal);
		position: relative;
	}

	.result-display.invalid {
		background: #fff5f5;
		border-color: #fed7d7;
	}

	.result-header {
		display: flex;
		align-items: flex-start;
		gap: var(--spacing-lg);
		margin-bottom: var(--spacing-lg);
	}

	.house-icon {
		font-size: 3rem;
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.result-main {
		flex: 1;
	}

	.result-title {
		color: var(--color-text-primary);
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-semibold);
		margin: 0 0 var(--spacing-xs) 0;
		line-height: var(--line-height-normal);
	}

	.result-value {
		font-weight: var(--font-weight-bold);
		font-size: 2.5rem;
		color: var(--color-text-secondary);
		transition: color var(--transition-normal);
		font-family: var(--font-family);
		letter-spacing: -0.02em;
		line-height: var(--line-height-tight);
		margin: 0;
	}

	.result-value.valid {
		color: var(--color-text-primary);
	}

	.result-details {
		border-top: 1px solid var(--color-border-light);
		padding-top: var(--spacing-lg);
	}

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-md);
	}

	.detail-label {
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-medium);
		font-size: var(--font-size-body);
	}

	.detail-value {
		color: var(--color-text-primary);
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-h3);
	}

	.interest-info {
		color: var(--color-text-secondary);
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-medium);
		margin-top: var(--spacing-sm);
	}

	.action-section {
		text-align: center;
	}

	.action-button {
		background-color: var(--color-primary);
		color: var(--color-background);
		border: none;
		border-radius: var(--border-radius-sm);
		padding: var(--spacing-md) var(--spacing-xl);
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-semibold);
		font-family: var(--font-family);
		cursor: pointer;
		transition: all var(--transition-normal);
		margin-bottom: var(--spacing-md);
	}

	.action-button:hover {
		background-color: var(--color-primary-dark);
		transform: translateY(-1px);
		box-shadow: var(--shadow-light);
	}

	.action-button:focus {
		outline: 2px solid var(--color-blue);
		outline-offset: 2px;
	}

	.disclaimer {
		color: var(--color-text-secondary);
		font-size: var(--font-size-small);
		line-height: var(--line-height-relaxed);
	}

	.placeholder-info {
		text-align: center;
		padding: var(--spacing-xl);
		color: var(--color-text-secondary);
		background: var(--color-background-light);
		border-radius: var(--border-radius-lg);
		border: 1px solid var(--color-border-light);
	}

	.placeholder-icon {
		font-size: 3rem;
		margin-bottom: var(--spacing-md);
		opacity: 0.7;
	}

	.placeholder-info p {
		margin: 0;
		font-size: var(--font-size-body);
		line-height: var(--line-height-relaxed);
	}

	/* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		.result-display,
		.result-value,
		.action-button {
			transition: none;
		}

		.action-button:hover {
			transform: none;
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

		.action-button {
			border: 2px solid var(--color-text-primary);
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

		.action-button {
			display: none;
		}
	}
</style>
