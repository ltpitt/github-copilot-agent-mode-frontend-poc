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
</script>

<div class="result-display" class:invalid={!isValidPayment()}>
	<div class="result-content">
		<span class="result-label">{label}:</span>
		<span class="result-value" class:valid={isValidPayment()}>
			{formattedPayment()}
		</span>
	</div>
</div>

<style>
	.result-display {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		border: 2px solid transparent;
		transition: all 0.2s ease;
		margin: 1rem 0;
	}

	.result-display.invalid {
		background: #fff5f5;
		border-color: #fed7d7;
	}

	.result-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.result-label {
		font-weight: 600;
		color: #555;
		font-size: 1rem;
		flex: 1;
	}

	.result-value {
		font-weight: 700;
		font-size: 1.5rem;
		color: #666;
		text-align: right;
		transition: color 0.2s ease;
		min-width: 120px;
	}

	.result-value.valid {
		color: #ff6200;
	}

	/* Accessibility improvements */
	@media (prefers-reduced-motion: reduce) {
		.result-display,
		.result-value {
			transition: none;
		}
	}

	/* Responsive design */
	@media (max-width: 600px) {
		.result-content {
			flex-direction: column;
			align-items: stretch;
			gap: 0.5rem;
		}

		.result-value {
			text-align: center;
			font-size: 1.3rem;
		}

		.result-label {
			text-align: center;
			font-size: 0.9rem;
		}
	}

	/* High contrast mode support */
	@media (prefers-contrast: high) {
		.result-display {
			border-color: #333;
		}

		.result-value.valid {
			color: #cc4e00;
		}
	}
</style>
