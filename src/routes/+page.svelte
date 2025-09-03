<script lang="ts">
	import { calculateMonthlyPayment } from '$lib/mortgageCalculator.js';

	let loanAmount = $state(300000);
	let interestRate = $state(3.5);
	let loanTerm = $state(30);

	let monthlyPayment = $derived(() => {
		try {
			const principal = loanAmount;
			const annualRate = interestRate / 100; // Convert percentage to decimal
			const numberOfPayments = loanTerm * 12; // Convert years to months

			return calculateMonthlyPayment(principal, annualRate, numberOfPayments);
		} catch {
			return 0;
		}
	});

	let totalPayments = $derived(() => monthlyPayment() * loanTerm * 12);
	let totalInterest = $derived(() => totalPayments() - loanAmount);
</script>

<main>
	<h1>Mortgage Calculator POC</h1>

	<div class="calculator">
		<div class="form-group">
			<label for="loanAmount">Loan Amount ($)</label>
			<input id="loanAmount" type="number" bind:value={loanAmount} min="0" step="1000" />
		</div>

		<div class="form-group">
			<label for="interestRate">Interest Rate (%)</label>
			<input
				id="interestRate"
				type="number"
				bind:value={interestRate}
				min="0"
				step="0.01"
				max="50"
			/>
		</div>

		<div class="form-group">
			<label for="loanTerm">Loan Term (years)</label>
			<input id="loanTerm" type="number" bind:value={loanTerm} min="1" step="1" max="50" />
		</div>

		<div class="results">
			<h3>Calculation Results</h3>
			<div class="result-item">
				<span class="label">Monthly Payment:</span>
				<span class="value">${monthlyPayment().toFixed(2)}</span>
			</div>
			<div class="result-item">
				<span class="label">Total Interest:</span>
				<span class="value">${totalInterest().toFixed(2)}</span>
			</div>
			<div class="result-item">
				<span class="label">Total Amount:</span>
				<span class="value">${totalPayments().toFixed(2)}</span>
			</div>
		</div>
	</div>
</main>

<style>
	main {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		color: #ff6200;
		text-align: center;
		margin-bottom: 2rem;
	}

	.calculator {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #333;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: #ff6200;
	}

	.results {
		margin-top: 2rem;
		padding: 1.5rem;
		background: #f8f9fa;
		border-radius: 6px;
	}

	h3 {
		color: #333;
		margin-bottom: 1rem;
	}

	.result-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.75rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid #dee2e6;
	}

	.result-item:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.label {
		font-weight: 600;
		color: #555;
	}

	.value {
		font-weight: 700;
		color: #ff6200;
		font-size: 1.1rem;
	}
</style>
