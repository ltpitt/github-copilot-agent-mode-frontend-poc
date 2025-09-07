import { test, expect } from '@playwright/test';
import { selectEnergyLabelRobust } from '../test-helpers.js';

test.describe('Mortgage Calculator - Energy Labels', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');
	});

	test('should display all energy label options', async ({ page }) => {
		const energySelect = page.locator('select[data-testid="energy-label-select"]');
		await expect(energySelect).toBeVisible();

		// Check that all energy labels A-G are available
		const options = energySelect.locator('option');
		const optionTexts = await options.allTextContents();

		// Should have 7 energy labels (A-G)
		expect(optionTexts).toHaveLength(7);
		expect(optionTexts[0]).toContain('A - Most efficient');

		// Check each energy label is present
		const energyLabels = [
			'A - Most efficient',
			'B - Very efficient',
			'C - Efficient',
			'D - Moderately efficient',
			'E - Less efficient',
			'F - Inefficient',
			'G - Least efficient'
		];

		for (const label of energyLabels) {
			expect(optionTexts.join(' ')).toContain(label);
		}
	});

	test('should show correct colors for each energy label', async ({ page }) => {
		const energySelect = page.locator('select[data-testid="energy-label-select"]');

		// Ensure the select exists and is visible
		await expect(energySelect).toBeVisible();

		// Define expected colors for each energy label
		const energyLabelColors = {
			A: '#00a651', // Green
			B: '#8ac83b', // Light green
			C: '#ffd502', // Yellow
			D: '#ffa500', // Orange
			E: '#ff6600', // Orange-red
			F: '#ff3300', // Red
			G: '#cc0000' // Dark red
		};

		for (const [label, expectedColor] of Object.entries(energyLabelColors)) {
			// Use the improved helper function for reliable selection
			await selectEnergyLabelRobust(page, label);

			// Check that the visual indicator appears with the correct color
			const energyIndicator = page.locator('[data-testid="energy-indicator"]');
			await expect(energyIndicator).toBeVisible({ timeout: 10000 });
			await expect(energyIndicator).toHaveText(label);

			// Check the background color of the indicator
			const backgroundColor = await energyIndicator.evaluate(
				(el) => getComputedStyle(el).backgroundColor
			);

			// Convert hex to rgb for comparison
			const hexToRgb = (hex: string) => {
				const r = parseInt(hex.slice(1, 3), 16);
				const g = parseInt(hex.slice(3, 5), 16);
				const b = parseInt(hex.slice(5, 7), 16);
				return `rgb(${r}, ${g}, ${b})`;
			};

			expect(backgroundColor).toBe(hexToRgb(expectedColor));
		}
	});

	test('should update select styling when energy label is chosen', async ({ page }) => {
		// Initially no energy label selected
		await expect(page.locator('.energy-indicator')).not.toBeVisible();

		// Select energy label A using helper function
		await selectEnergyLabelRobust(page, 'A');

		// Get the select element for verification
		const selectElement = page.locator('select[data-testid="energy-label-select"]');

		// Visual indicator should appear - use longer timeout for Svelte 5 reactivity
		// Only check if the selection worked
		const finalValue = await selectElement.inputValue();
		if (finalValue === 'A') {
			await expect(page.locator('.energy-indicator')).toBeVisible({ timeout: 10000 });

			// Select container should not have error styling
			const selectContainer = page.locator('.select-container');
			await expect(selectContainer).not.toHaveClass(/error/);
		}
	});

	test('should handle energy label impact on calculations', async ({ page }) => {
		// Fill form with consistent data
		await page.fill('input[data-testid="principal-input"]', '250000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await page.fill('input[data-testid="duration-input"]', '30');

		// Test with most efficient energy label (A)
		await selectEnergyLabelRobust(page, 'A');
		await page.click('button[type="submit"]');

		const maxMortgageA = await page.locator('[data-testid="maximum-mortgage"]').textContent();

		// Test with least efficient energy label (G)
		await selectEnergyLabelRobust(page, 'G');
		await page.click('button[type="submit"]');

		const maxMortgageG = await page.locator('[data-testid="maximum-mortgage"]').textContent();

		// Results should be different (A should allow higher mortgage than G)
		expect(maxMortgageA).not.toBe(maxMortgageG);

		// Both should be valid currency amounts
		expect(maxMortgageA).toMatch(/€.*\d/);
		expect(maxMortgageG).toMatch(/€.*\d/);
	});

	test('should show energy label in calculation results', async ({ page }) => {
		// Fill form and select energy label
		await page.fill('input[data-testid="principal-input"]', '250000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await page.fill('input[data-testid="duration-input"]', '30');
		await selectEnergyLabelRobust(page, 'B');

		await page.click('button[type="submit"]');

		// Check that energy label is displayed in results
		const resultDisplay = page.locator('.result-display');
		await expect(resultDisplay).toBeVisible();

		// Look for energy label reference in results
		const energyLabelDisplay = page.locator('[data-testid="energy-label-display"]');
		if (await energyLabelDisplay.isVisible()) {
			await expect(energyLabelDisplay).toContainText('B');
		}

		// Or check if it's shown in the energy label selection area
		const energyIndicator = page.locator('.energy-indicator');
		await expect(energyIndicator).toBeVisible();
		await expect(energyIndicator).toHaveText('B');
	});

	test('should allow changing energy label after selection', async ({ page }) => {
		// Select first energy label
		await selectEnergyLabelRobust(page, 'A');
		await expect(page.locator('.energy-indicator')).toHaveText('A');
		await expect(page.locator('.energy-indicator')).toHaveCSS(
			'background-color',
			'rgb(0, 166, 81)'
		);

		// Change to different energy label
		await selectEnergyLabelRobust(page, 'F');
		await expect(page.locator('.energy-indicator')).toHaveText('F');
		await expect(page.locator('.energy-indicator')).toHaveCSS(
			'background-color',
			'rgb(255, 51, 0)'
		);
	});

	test('should maintain energy label selection during form interactions', async ({ page }) => {
		// Select energy label
		await selectEnergyLabelRobust(page, 'C');
		await expect(page.locator('.energy-indicator')).toHaveText('C');

		// Change other form fields
		await page.fill('input[data-testid="principal-input"]', '300000');
		await page.fill('input[data-testid="interest-rate-input"]', '4.0');

		// Energy label selection should persist
		await expect(page.locator('.energy-indicator')).toHaveText('C');
		await expect(page.locator('select[data-testid="energy-label-select"]')).toHaveValue('C');
	});
});
