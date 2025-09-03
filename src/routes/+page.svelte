<script lang="ts">
	import MortgageCalculator from '$lib/MortgageCalculator.svelte';
</script>

<main>
	<h1>Mortgage Calculator POC</h1>
	<MortgageCalculator />
</main>

<style>
	main {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-align: center;
		margin-bottom: 2rem;
	}
</style>
