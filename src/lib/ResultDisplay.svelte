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

	.action-section {
		text-align: center;
	}

	.action-button {
		background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
		color: var(--color-background);
		border: none;
		border-radius: var(--border-radius-md);
		padding: var(--spacing-md) var(--spacing-2xl);
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-semibold);
		font-family: var(--font-family);
		cursor: pointer;
		transition: all var(--transition-normal);
		margin-bottom: var(--spacing-lg);
		position: relative;
		overflow: hidden;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		box-shadow: var(--shadow-md);
	}

	.action-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: left var(--transition-slow);
	}

	.action-button:hover::before {
		left: 100%;
	}

	.action-button:hover {
		background: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%);
		transform: translateY(-2px);
		box-shadow: var(--shadow-xl);
	}

	.action-button:focus {
		outline: none;
		box-shadow: var(--shadow-xl), var(--focus-ring);
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
