import { test, expect } from '@playwright/test';

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

		// Should have placeholder plus 7 energy labels (A-G)
		expect(optionTexts).toHaveLength(8);
		expect(optionTexts[0]).toContain('Select energy label');

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
			// Select the energy label
			await energySelect.selectOption(label);
			
			// Wait a moment for the energy indicator to appear
			await page.waitForTimeout(100);

			// Check that the visual indicator appears with the correct color
			const energyIndicator = page.locator('[data-testid="energy-indicator"]');
			await expect(energyIndicator).toBeVisible();
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
		const energySelect = page.locator('select[data-testid="energy-label-select"]');

		// Initially no energy label selected
		await expect(page.locator('.energy-indicator')).not.toBeVisible();

		// Select energy label A
		await energySelect.selectOption('A');

		// Visual indicator should appear
		await expect(page.locator('.energy-indicator')).toBeVisible();

		// Select container should not have error styling
		const selectContainer = page.locator('.select-container');
		await expect(selectContainer).not.toHaveClass(/error/);

		// Check that the select itself has updated styling
		const selectElement = page.locator('select[data-testid="energy-label-select"]');
		const customColor = await selectElement.evaluate((el) =>
			(el as HTMLElement).style.getPropertyValue('--selected-color')
		);
		expect(customColor).toBeTruthy();
	});

	test('should handle energy label impact on calculations', async ({ page }) => {
		// Fill form with consistent data
		await page.fill('input[data-testid="principal-input"]', '250000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await page.fill('input[data-testid="duration-input"]', '30');
		await page.check('input[data-testid="buying-alone-true"]');

		// Test with most efficient energy label (A)
		await page.selectOption('select[data-testid="energy-label-select"]', 'A');
		await page.click('button[type="submit"]');

		const maxMortgageA = await page.locator('[data-testid="maximum-mortgage"]').textContent();

		// Test with least efficient energy label (G)
		await page.selectOption('select[data-testid="energy-label-select"]', 'G');
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
		await page.check('input[data-testid="buying-alone-true"]');
		await page.selectOption('select[data-testid="energy-label-select"]', 'B');

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

	test('should validate energy label selection is required', async ({ page }) => {
		// Fill all other fields
		await page.fill('input[data-testid="principal-input"]', '250000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await page.fill('input[data-testid="duration-input"]', '30');
		await page.check('input[data-testid="buying-alone-true"]');

		// Leave energy label unselected
		await page.click('button[type="submit"]');

		// Should show validation error
		const errorMessage = page.locator('.error-message');
		await expect(errorMessage).toBeVisible();

		// Error should be related to energy label
		const errorText = await errorMessage.textContent();
		expect(errorText?.toLowerCase()).toContain('energy');
	});

	test('should allow changing energy label after selection', async ({ page }) => {
		const energySelect = page.locator('select[data-testid="energy-label-select"]');

		// Select first energy label
		await energySelect.selectOption('A');
		await expect(page.locator('.energy-indicator')).toHaveText('A');
		await expect(page.locator('.energy-indicator')).toHaveCSS(
			'background-color',
			'rgb(0, 166, 81)'
		);

		// Change to different energy label
		await energySelect.selectOption('F');
		await expect(page.locator('.energy-indicator')).toHaveText('F');
		await expect(page.locator('.energy-indicator')).toHaveCSS(
			'background-color',
			'rgb(255, 51, 0)'
		);

		// Should be able to deselect (go back to placeholder)
		await energySelect.selectOption('');
		await expect(page.locator('.energy-indicator')).not.toBeVisible();
	});

	test('should show energy label color gradient from A to G', async ({ page }) => {
		const energySelect = page.locator('select[data-testid="energy-label-select"]');
		const energyIndicator = page.locator('.energy-indicator');

		// Test that colors progress from green to red as efficiency decreases
		const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
		const colors = [];

		for (const label of labels) {
			await energySelect.selectOption(label);
			await expect(energyIndicator).toBeVisible();

			const backgroundColor = await energyIndicator.evaluate(
				(el) => getComputedStyle(el).backgroundColor
			);
			colors.push(backgroundColor);
		}

		// Verify we have different colors for each label
		const uniqueColors = new Set(colors);
		expect(uniqueColors.size).toBe(7); // Should have 7 distinct colors

		// A should be greenish, G should be reddish
		expect(colors[0]).toMatch(/rgb\(0,\s*166,\s*81\)/); // A - green
		expect(colors[6]).toMatch(/rgb\(204,\s*0,\s*0\)/); // G - red
	});

	test('should maintain energy label selection during form interactions', async ({ page }) => {
		// Select energy label
		await page.selectOption('select[data-testid="energy-label-select"]', 'C');
		await expect(page.locator('.energy-indicator')).toHaveText('C');

		// Change other form fields
		await page.fill('input[data-testid="principal-input"]', '300000');
		await page.fill('input[data-testid="interest-rate-input"]', '4.0');
		await page.check('input[data-testid="buying-alone-false"]');

		// Energy label selection should persist
		await expect(page.locator('.energy-indicator')).toHaveText('C');
		await expect(page.locator('select[data-testid="energy-label-select"]')).toHaveValue('C');
	});

	test('should have accessible energy label selection', async ({ page }) => {
		const energySelect = page.locator('select[data-testid="energy-label-select"]');

		// Check accessibility attributes
		await expect(energySelect).toHaveAttribute('aria-label');
		await expect(energySelect).toHaveAttribute('required');

		// Label should be properly associated
		const label = page.locator('label[for="energy-label"]');
		await expect(label).toBeVisible();

		// Should be keyboard navigable
		await energySelect.focus();
		await expect(energySelect).toBeFocused();

		// Should be able to navigate options with keyboard
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');

		// Should have selected an option
		const selectedValue = await energySelect.inputValue();
		expect(selectedValue).toBeTruthy();
		expect(['A', 'B', 'C', 'D', 'E', 'F', 'G']).toContain(selectedValue);
	});
});
