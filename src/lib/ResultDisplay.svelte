<script lang="ts">
	// Props interface for the ResultDisplay component
	interface Props {
		monthlyPayment: number;
		label?: string;
	}

	let { monthlyPayment, label = 'Monthly Payment' }: Props = $props();

	// Format currency using EUR formatting for European markets
	let formattedPayment = $derived(() => {
		if (monthlyPayment == null || isNaN(monthlyPayment) || monthlyPayment < 0) {
			return '€0.00';
		}

		return new Intl.NumberFormat('de-DE', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(monthlyPayment);
	});

	// Determine if the payment amount is valid for styling purposes
	let isValidPayment = $derived(() => {
		return monthlyPayment != null && !isNaN(monthlyPayment) && monthlyPayment > 0;
	});

	// Calculate additional information for display
	let yearlyPaymentValue = $derived(() => {
		if (!isValidPayment()) return 0;
		return monthlyPayment * 12;
	});

	let totalAmountValue = $derived(() => {
		if (!isValidPayment()) return 0;
		return monthlyPayment * 30 * 12; // Assuming 30 years
	});

	let yearlyPaymentFormatted = $derived(() => {
		return new Intl.NumberFormat('de-DE', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(yearlyPaymentValue());
	});

	let totalAmountFormatted = $derived(() => {
		return new Intl.NumberFormat('de-DE', {
			style: 'currency',
			currency: 'EUR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(totalAmountValue());
	});
</script>

<div class="result-display" class:invalid={!isValidPayment()}>
	<div class="result-content">
		<span class="result-label">{label}:</span>
		<span class="result-value" class:valid={isValidPayment()}>
			{formattedPayment()}
		</span>
	</div>

	{#if isValidPayment()}
		<div class="calculation-details">
			<div class="calculation-item">
				<span class="calculation-label">Yearly payment:</span>
				<span class="calculation-value">{yearlyPaymentFormatted()}</span>
			</div>
			<div class="calculation-item">
				<span class="calculation-label">Total amount:</span>
				<span class="calculation-value">{totalAmountFormatted()}</span>
			</div>
		</div>
	{/if}

	{#if isValidPayment()}
		<div class="result-info">
			This calculation is an estimate. Actual rates and conditions may vary.
			<br />Contact ING for personalized mortgage advice.
		</div>
	{:else}
		<div class="result-info">
			Enter your loan details above to see your monthly payment estimate.
		</div>
	{/if}
</div>

<style>
	.result-display {
		background: var(--color-background);
		padding: var(--spacing-xl);
		border-radius: var(--border-radius-lg);
		border: 1px solid var(--color-border-light);
		box-shadow: var(--shadow-medium);
		transition: all var(--transition-normal);
		margin: 0;
		position: relative;
		overflow: hidden;
	}

	.result-display::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
	}

	.result-display.invalid {
		background: #fff5f5;
		border-color: #fed7d7;
	}

	.result-display.invalid::before {
		background: linear-gradient(90deg, #cc0000, #ff4444);
	}

	.result-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--spacing-lg);
		position: relative;
	}

	.result-label {
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		font-size: var(--font-size-body);
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
	}

	.result-label::before {
		content: '💰';
		font-size: 1.2em;
		opacity: 0.8;
	}

	.result-value {
		font-weight: var(--font-weight-bold);
		font-size: 2rem;
		color: var(--color-text-secondary);
		text-align: right;
		transition: color var(--transition-normal);
		min-width: 140px;
		font-family: var(--font-family);
		letter-spacing: -0.02em;
	}

	.result-value.valid {
		color: var(--color-primary);
		text-shadow: 0 1px 2px rgba(255, 98, 0, 0.1);
	}

	.result-info {
		margin-top: var(--spacing-md);
		padding-top: var(--spacing-md);
		border-top: 1px solid var(--color-border-light);
		font-size: var(--font-size-small);
		color: var(--color-text-secondary);
		text-align: center;
		line-height: var(--line-height-relaxed);
	}

	.calculation-details {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-md);
		margin-top: var(--spacing-md);
		padding: var(--spacing-md);
		background: var(--color-background-light);
		border-radius: var(--border-radius-sm);
		font-size: var(--font-size-small);
	}

	.calculation-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.calculation-label {
		color: var(--color-text-secondary);
		font-weight: var(--font-weight-medium);
	}

	.calculation-value {
		color: var(--color-text-primary);
		font-weight: var(--font-weight-semibold);
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
			color: #cc4e00;
			text-shadow: none;
		}

		.result-display::before {
			background: var(--color-text-primary);
		}
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.result-display {
			padding: var(--spacing-lg);
		}

		.result-content {
			flex-direction: column;
			align-items: stretch;
			gap: var(--spacing-md);
			text-align: center;
		}

		.result-value {
			text-align: center;
			font-size: 1.75rem;
			min-width: auto;
		}

		.result-label {
			justify-content: center;
			font-size: var(--font-size-small);
		}

		.calculation-details {
			grid-template-columns: 1fr;
			gap: var(--spacing-xs);
		}
	}

	@media (max-width: 480px) {
		.result-display {
			padding: var(--spacing-md);
		}

		.result-value {
			font-size: 1.5rem;
		}

		.result-content {
			gap: var(--spacing-sm);
		}
	}

	/* Print styles */
	@media print {
		.result-display {
			border: 2px solid #333;
			box-shadow: none;
			background: white !important;
		}

		.result-display::before {
			display: none;
		}

		.result-value.valid {
			color: #333 !important;
		}
	}
</style>
