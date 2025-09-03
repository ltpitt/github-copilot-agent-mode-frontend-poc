<script lang="ts">
	import { ResultDisplay } from '$lib';

	// Demo scenarios to showcase the component
	let demoPayments = [
		{ label: 'Small Mortgage', amount: 850.50 },
		{ label: 'Medium Mortgage', amount: 1432.25 },
		{ label: 'Large Mortgage', amount: 2108.75 },
		{ label: 'Luxury Property', amount: 3500.00 },
		{ label: 'Zero Payment', amount: 0 },
		{ label: 'Invalid Payment', amount: -100 }
	];

	let interactiveAmount = 1200.50;
</script>

<svelte:head>
	<title>ResultDisplay Component Demo</title>
</svelte:head>

<main>
	<h1>ResultDisplay Component Demo</h1>
	<p>This page demonstrates the ResultDisplay.svelte component with various payment amounts.</p>

	<div class="demo-container">
		{#each demoPayments as { label, amount }}
			<div class="demo-item">
				<h3>{label} (Input: €{amount})</h3>
				<ResultDisplay monthlyPayment={amount} label={label} />
			</div>
		{/each}
	</div>

	<div class="demo-container">
		<h2>Default Label Usage</h2>
		<ResultDisplay monthlyPayment={1599.99} />
	</div>

	<div class="demo-container">
		<h2>Interactive Example</h2>
		<p>Enter an amount to see the ResultDisplay component in action:</p>
		<input type="number" bind:value={interactiveAmount} placeholder="Enter amount" step="0.01" />
		<ResultDisplay monthlyPayment={interactiveAmount} label="Your Payment" />
	</div>
</main>

<style>
	main {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	h1 {
		color: #ff6200;
		text-align: center;
		margin-bottom: 1rem;
	}

	h2 {
		color: #333;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	h3 {
		color: #555;
		margin-bottom: 0.5rem;
		font-size: 1rem;
	}

	.demo-container {
		margin: 2rem 0;
		padding: 1.5rem;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.demo-item {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
	}

	.demo-item:last-child {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		margin-bottom: 1rem;
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: #ff6200;
	}

	p {
		color: #666;
		line-height: 1.6;
	}
</style>