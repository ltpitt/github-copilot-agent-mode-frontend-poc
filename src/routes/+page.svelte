<script lang="ts">
	import { calculateMonthlyPayment } from '$lib/mortgageCalculator.js';
	import InputForm from '$lib/InputForm.svelte';
	import ResultDisplay from '$lib/ResultDisplay.svelte';

	// State for storing the calculation result
	let monthlyPayment = $state(0);

	// Handle form submission from InputForm component
	function handleFormSubmit(data: {
		principal: number;
		annualInterestRate: number;
		durationYears: number;
	}) {
		try {
			const { principal, annualInterestRate, durationYears } = data;
			const annualRate = annualInterestRate / 100; // Convert percentage to decimal
			const numberOfPayments = durationYears * 12; // Convert years to months

			monthlyPayment = calculateMonthlyPayment(principal, annualRate, numberOfPayments);
		} catch {
			monthlyPayment = 0;
		}
	}
</script>

<main>
	<h1>Mortgage Calculator POC</h1>

	<div class="calculator">
		<InputForm onsubmit={handleFormSubmit} />
		<ResultDisplay {monthlyPayment} />
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
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
