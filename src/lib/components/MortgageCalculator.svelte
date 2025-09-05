<script lang="ts">
	let loanAmount = $state(300000);
	let interestRate = $state(3.5);
	let loanTermYears = $state(30);

	let monthlyPayment = $derived(() => {
		const principal = loanAmount;
		const monthlyRate = interestRate / 100 / 12;
		const numPayments = loanTermYears * 12;

		if (monthlyRate === 0) {
			return principal / numPayments;
		}

		return (
			(principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
			(Math.pow(1 + monthlyRate, numPayments) - 1)
		);
	});

	let totalPayment = $derived(() => monthlyPayment() * loanTermYears * 12);
	let totalInterest = $derived(() => totalPayment() - loanAmount);
</script>

<div class="calculator">
	<h2>Calculate Your Mortgage Payment</h2>

	<div class="input-group">
		<label for="loan-amount">Loan Amount ($)</label>
		<input id="loan-amount" type="number" bind:value={loanAmount} min="1000" step="1000" />
	</div>

	<div class="input-group">
		<label for="interest-rate">Interest Rate (%)</label>
		<input
			id="interest-rate"
			type="number"
			bind:value={interestRate}
			min="0.1"
			max="20"
			step="0.1"
		/>
	</div>

	<div class="input-group">
		<label for="loan-term">Loan Term (years)</label>
		<input id="loan-term" type="number" bind:value={loanTermYears} min="1" max="50" step="1" />
	</div>

	<div class="results">
		<h3>Calculated Results</h3>
		<div class="result-item">
			<span class="label">Monthly Payment:</span>
			<span class="value">${monthlyPayment().toFixed(2)}</span>
		</div>
		<div class="result-item">
			<span class="label">Total Payment:</span>
			<span class="value">${totalPayment().toFixed(2)}</span>
		</div>
		<div class="result-item">
			<span class="label">Total Interest:</span>
			<span class="value">${totalInterest().toFixed(2)}</span>
		</div>
	</div>
</div>

<style>
	.calculator {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	h2 {
		color: #333;
		margin-bottom: 1.5rem;
	}

	.input-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #555;
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
		border-color: #ff3e00;
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
		color: #ff3e00;
		font-size: 1.1rem;
	}
</style>
