import { test, expect } from '@playwright/test';
import { selectEnergyLabelRobust } from '../test-helpers.js';

test.describe('Mortgage Calculator - Integration & User Workflows', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');
	});

	test('should complete full mortgage calculation workflow - young professional', async ({
		page
	}) => {
		// Scenario: Young professional, first-time buyer, efficient home
		await page.fill('input[data-testid="principal-input"]', '85000'); // €85k income
		await page.fill('input[data-testid="interest-rate-input"]', '4.2'); // Current rates
		await page.fill('input[data-testid="duration-input"]', '30'); // 30-year mortgage
		await selectEnergyLabelRobust(page, 'A'); // Energy efficient

		await page.click('button[type="submit"]');

		// Verify results are reasonable for this scenario
		const maxMortgage = await page.locator('[data-testid="maximum-mortgage"]').textContent();
		const monthlyPayment = await page.locator('[data-testid="monthly-payment"]').textContent();

		// Should get some mortgage (income × ~4.5 + energy bonus)
		expect(maxMortgage).toMatch(/€[3-5]\d{2},\d{3}/); // Should be 300k-500k range
		expect(monthlyPayment).toMatch(/€[1-3],\d{3}/); // Monthly payment 1k-3k

		// Energy label A should show positive adjustment
		const energyLabelDisplay = page.locator('[data-testid="energy-label-display"]');
		await expect(energyLabelDisplay).toHaveText('A');
		await expect(energyLabelDisplay).toHaveCSS('background-color', 'rgb(0, 166, 81)');
	});

	test('should complete full mortgage calculation workflow - family with high income', async ({
		page
	}) => {
		// Scenario: Family with combined high income, larger home needed
		await page.fill('input[data-testid="principal-input"]', '180000'); // €180k combined
		await page.fill('input[data-testid="interest-rate-input"]', '3.8');
		await page.fill('input[data-testid="duration-input"]', '25'); // Shorter term
		await page.check('input[data-testid="buying-alone-false"]'); // Buying together
		await selectEnergyLabelRobust(page, 'C'); // Average efficiency

		await page.click('button[type="submit"]');

		const maxMortgage = await page.locator('[data-testid="maximum-mortgage"]').textContent();
		const monthlyPayment = await page.locator('[data-testid="monthly-payment"]').textContent();

		// Higher income should allow larger mortgage
		expect(maxMortgage).toMatch(/€[8-9]\d{2},\d{3}|€1,\d{3},\d{3}/); // 800k-1.2M range
		expect(monthlyPayment).toMatch(/€[3-7],\d{3}/); // Higher monthly payment

		// Energy label C should show neutral/small adjustment
		const energyLabelDisplay = page.locator('[data-testid="energy-label-display"]');
		await expect(energyLabelDisplay).toHaveText('C');
		await expect(energyLabelDisplay).toHaveCSS('background-color', 'rgb(255, 213, 2)');
	});

	test('should handle edge case - minimal income scenario', async ({ page }) => {
		// Scenario: Low income, need to see realistic limitations
		await page.fill('input[data-testid="principal-input"]', '25000'); // €25k income
		await page.fill('input[data-testid="interest-rate-input"]', '5.0'); // Higher rate
		await page.fill('input[data-testid="duration-input"]', '30');
		await selectEnergyLabelRobust(page, 'F'); // Poor efficiency

		await page.click('button[type="submit"]');

		// Should still calculate but with realistic low amounts
		const maxMortgage = await page.locator('[data-testid="maximum-mortgage"]').textContent();
		const monthlyPayment = await page.locator('[data-testid="monthly-payment"]').textContent();

		// Low income should result in lower mortgage capacity
		expect(maxMortgage).toMatch(/€[1-2]\d{2},\d{3}/); // Should be ~100-200k range
		expect(monthlyPayment).toMatch(/€[3-9]\d{2}/); // Should be under 1k monthly

		// Energy label F should have negative impact
		const energyLabelDisplay = page.locator('[data-testid="energy-label-display"]');
		await expect(energyLabelDisplay).toHaveText('F');
		await expect(energyLabelDisplay).toHaveCSS('background-color', 'rgb(255, 51, 0)');
	});

	test('should demonstrate energy label impact on calculations', async ({ page }) => {
		// Keep all parameters consistent, only change energy label
		const baseData = {
			income: '150000',
			rate: '3.5',
			duration: '30',
			buyingAlone: true
		};

		// Test with efficient label (A)
		await page.fill('input[data-testid="principal-input"]', baseData.income);
		await page.fill('input[data-testid="interest-rate-input"]', baseData.rate);
		await page.fill('input[data-testid="duration-input"]', baseData.duration);
		await selectEnergyLabelRobust(page, 'A');
		await page.click('button[type="submit"]');

		const mortgageA = await page.locator('[data-testid="maximum-mortgage"]').textContent();

		// Test with inefficient label (G)
		await selectEnergyLabelRobust(page, 'G');
		await page.click('button[type="submit"]');

		const mortgageG = await page.locator('[data-testid="maximum-mortgage"]').textContent();

		// Energy efficient (A) should allow higher mortgage than inefficient (G)
		const amountA = parseInt(mortgageA!.replace(/[€,]/g, ''));
		const amountG = parseInt(mortgageG!.replace(/[€,]/g, ''));

		expect(amountA).toBeGreaterThan(amountG);

		// Difference should be meaningful (at least €5000)
		expect(amountA - amountG).toBeGreaterThanOrEqual(5000);

		// Verify energy label colors
		await selectEnergyLabelRobust(page, 'A');
		await page.click('button[type="submit"]');
		await expect(page.locator('[data-testid="energy-label-display"]')).toHaveCSS(
			'background-color',
			'rgb(0, 166, 81)'
		);

		await selectEnergyLabelRobust(page, 'G');
		await page.click('button[type="submit"]');
		await expect(page.locator('[data-testid="energy-label-display"]')).toHaveCSS(
			'background-color',
			'rgb(204, 0, 0)'
		);
	});

	test('should handle form reset and recalculation workflow', async ({ page }) => {
		// Fill initial form
		await page.fill('input[data-testid="principal-input"]', '120000');
		await page.fill('input[data-testid="interest-rate-input"]', '4.0');
		await page.fill('input[data-testid="duration-input"]', '25');
		await selectEnergyLabelRobust(page, 'B');
		await page.click('button[type="submit"]');

		const initialResult = await page.locator('[data-testid="maximum-mortgage"]').textContent();

		// Modify inputs for different calculation
		await page.fill('input[data-testid="principal-input"]', '200000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.2');
		await selectEnergyLabelRobust(page, 'A');
		await page.click('button[type="submit"]');

		const newResult = await page.locator('[data-testid="maximum-mortgage"]').textContent();

		// Results should be different
		expect(newResult).not.toBe(initialResult);

		// Higher income should generally result in higher mortgage
		const initialAmount = parseInt(initialResult!.replace(/[€,]/g, ''));
		const newAmount = parseInt(newResult!.replace(/[€,]/g, ''));
		expect(newAmount).toBeGreaterThan(initialAmount);
	});

	test('should maintain data consistency across multiple calculations', async ({ page }) => {
		const testScenarios = [
			{
				income: '75000',
				rate: '3.5',
				duration: '30',
				buying: 'true',
				energy: 'A',
				name: 'scenario1'
			},
			{
				income: '150000',
				rate: '4.0',
				duration: '25',
				buying: 'false',
				energy: 'D',
				name: 'scenario2'
			},
			{
				income: '100000',
				rate: '3.8',
				duration: '30',
				buying: 'true',
				energy: 'B',
				name: 'scenario3'
			}
		];

		const results: { [key: string]: string } = {};

		// Run each scenario twice to ensure consistency
		for (const scenario of testScenarios) {
			for (let run = 0; run < 2; run++) {
				await page.fill('input[data-testid="principal-input"]', scenario.income);
				await page.fill('input[data-testid="interest-rate-input"]', scenario.rate);
				await page.fill('input[data-testid="duration-input"]', scenario.duration);

				await page.selectOption('select[data-testid="energy-label-select"]', scenario.energy);
				await page.click('button[type="submit"]');

				const result = await page.locator('[data-testid="maximum-mortgage"]').textContent();

				const key = `${scenario.name}_run${run}`;
				results[key] = result!;

				// First run stores result, second run compares
				if (run === 1) {
					expect(results[`${scenario.name}_run1`]).toBe(results[`${scenario.name}_run0`]);
				}
			}
		}
	});

	test('should handle rapid form interactions gracefully', async ({ page }) => {
		// Rapid interaction test - change multiple fields quickly
		await page.fill('input[data-testid="principal-input"]', '50000');
		await page.fill('input[data-testid="principal-input"]', '100000');
		await page.fill('input[data-testid="principal-input"]', '150000');

		await page.fill('input[data-testid="interest-rate-input"]', '2.5');
		await page.fill('input[data-testid="interest-rate-input"]', '4.5');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');

		await selectEnergyLabelRobust(page, 'A');
		await selectEnergyLabelRobust(page, 'G');
		await selectEnergyLabelRobust(page, 'C');

		// Final submit should work with last valid values
		await page.click('button[type="submit"]');

		// Should have valid results
		await expect(page.locator('[data-testid="maximum-mortgage"]')).not.toHaveText('€0');
		await expect(page.locator('[data-testid="monthly-payment"]')).toBeVisible();

		// Energy label should show final selection (C)
		await expect(page.locator('[data-testid="energy-label-display"]')).toHaveText('C');
	});
});
