<script lang="ts">
	import type { EnergyLabel } from '../utils/mortgageCalculator.js';

	// Props interface
	interface Props {
		id: string;
		label: string;
		value: EnergyLabel | null;
		required?: boolean;
		error?: boolean;
		errorMessage?: string;
		helperText?: string;
		oninput?: () => void;
		onblur?: () => void;
		onchange?: () => void;
	}

	let {
		id,
		label,
		value = $bindable(),
		required = false,
		error = false,
		errorMessage = '',
		helperText = '',
		oninput,
		onblur,
		onchange
	}: Props = $props();

	// Energy labels with their display info
	const energyLabels: Array<{ value: EnergyLabel; color: string; description: string }> = [
		{ value: 'A', color: '#00a651', description: 'A - Most efficient' },
		{ value: 'B', color: '#8ac83b', description: 'B - Very efficient' },
		{ value: 'C', color: '#ffd502', description: 'C - Efficient' },
		{ value: 'D', color: '#ffa500', description: 'D - Moderately efficient' },
		{ value: 'E', color: '#ff6600', description: 'E - Less efficient' },
		{ value: 'F', color: '#ff3300', description: 'F - Inefficient' },
		{ value: 'G', color: '#cc0000', description: 'G - Least efficient' }
	];

	// Get the color for the selected energy label
	let selectedLabelColor = $derived(() => {
		if (!value) return '#999999';
		const selectedLabel = energyLabels.find((label) => label.value === value);
		return selectedLabel?.color || '#999999';
	});

	function handleSelectChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		value = (target.value as EnergyLabel) || null;
		oninput?.();
		onchange?.();
	}
</script>

<div class="form-field">
	<label for={id} class="field-label" class:required>{label}</label>

	<div class="select-container" class:error>
		<select
			{id}
			{required}
			bind:value
			onchange={handleSelectChange}
			{oninput}
			{onblur}
			class="energy-select"
			style:--selected-color={selectedLabelColor()}
		>
			<option value="">Select energy label</option>
			{#each energyLabels as energyLabel (energyLabel.value)}
				<option value={energyLabel.value} style:color={energyLabel.color}>
					{energyLabel.description}
				</option>
			{/each}
		</select>

		<!-- Energy label visual indicator -->
		{#if value}
			<div class="energy-indicator" style:background-color={selectedLabelColor()}>
				{value}
			</div>
		{/if}
	</div>

	{#if error && errorMessage}
		<div class="error-message" role="alert">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="error-icon">
				<path
					d="M8 1.5C4.4 1.5 1.5 4.4 1.5 8S4.4 14.5 8 14.5 14.5 11.6 14.5 8 11.6 1.5 8 1.5zm0 11.5c-.4 0-.8-.3-.8-.8s.3-.8.8-.8.8.3.8.8-.4.8-.8.8zm.8-3.2h-1.6V5.2h1.6v4.6z"
				/>
			</svg>
			{errorMessage}
		</div>
	{:else if helperText}
		<div class="helper-text">{helperText}</div>
	{/if}
</div>

<style>
	.form-field {
		width: 100%;
		margin-bottom: var(--spacing-md);
	}

	.field-label {
		display: block;
		margin-bottom: var(--spacing-xs);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-primary);
		font-size: var(--font-size-body);
		line-height: var(--line-height-normal);
	}

	.field-label.required::after {
		content: ' *';
		color: var(--color-error);
		font-weight: var(--font-weight-bold);
	}

	.select-container {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.energy-select {
		flex: 1;
		min-height: 56px;
		padding: var(--spacing-md) var(--spacing-lg);
		border: 2px solid var(--color-border);
		border-radius: var(--border-radius-md);
		background: var(--color-background);
		color: var(--color-text-primary);
		font-size: var(--font-size-body);
		font-weight: var(--font-weight-medium);
		font-family: var(--font-family);
		transition: all var(--transition-normal);
		cursor: pointer;
		appearance: none;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
		background-position: right var(--spacing-md) center;
		background-repeat: no-repeat;
		background-size: 16px;
		padding-right: calc(var(--spacing-lg) + 20px);
	}

	.energy-select:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-sm);
	}

	.energy-select:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: var(--focus-ring);
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23FF6200' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
	}

	.select-container.error .energy-select {
		border-color: var(--color-error);
		background-color: #fff5f5;
	}

	.energy-indicator {
		width: 48px;
		height: 48px;
		border-radius: var(--border-radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-body-large);
		text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
		box-shadow: var(--shadow-sm);
		border: 2px solid white;
		flex-shrink: 0;
	}

	.error-message {
		margin-top: var(--spacing-xs);
		color: var(--color-error);
		font-size: var(--font-size-small);
		font-weight: var(--font-weight-medium);
		display: flex;
		align-items: center;
		gap: var(--spacing-xs);
		line-height: var(--line-height-normal);
	}

	.error-icon {
		flex-shrink: 0;
		width: 16px;
		height: 16px;
	}

	.helper-text {
		margin-top: var(--spacing-xs);
		color: var(--color-text-secondary);
		font-size: var(--font-size-small);
		line-height: var(--line-height-normal);
	}

	/* High contrast support */
	@media (prefers-contrast: high) {
		.energy-select {
			border-width: 2px;
		}

		.energy-select:focus {
			border-width: 3px;
			outline: 2px solid var(--color-primary);
			outline-offset: 2px;
		}

		.energy-indicator {
			border-color: var(--color-text-primary);
			border-width: 2px;
		}
	}

	/* Reduced motion support */
	@media (prefers-reduced-motion: reduce) {
		.energy-select {
			transition: none;
		}
	}

	/* Mobile optimizations */
	@media (max-width: 768px) {
		.energy-select {
			min-height: 52px;
			font-size: 16px; /* Prevent zoom on iOS */
		}

		.energy-indicator {
			width: 44px;
			height: 44px;
		}
	}
</style>
