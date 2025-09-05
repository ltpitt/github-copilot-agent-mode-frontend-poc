import { test, expect } from '@playwright/test';
import { selectEnergyLabelRobust, waitForValidationState, submitFormWithWait } from '../test-helpers.js';

// Helper function to reliably select energy label with Svelte 5 reactivity
async function selectEnergyLabel(page: any, labelValue: string) {
const select = page.locator('[data-testid="energy-label-select"]');

// Wait for the select to be fully loaded and visible
await expect(select).toBeVisible();
await expect(select).toBeEnabled();

// Wait for any initial animations or load states to complete
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500);

// Use Playwright's selectOption which should work consistently
await select.selectOption(labelValue || '');

// Wait a moment for the selection to take effect
await page.waitForTimeout(200);

// Check if energy indicator exists (if a value was selected)
if (labelValue) {
await page.waitForTimeout(300);
}
}


test.describe('Mortgage Calculator - Main Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');
	});

	test('should load the mortgage calculator with correct layout', async ({ page }) => {
		// Check main heading
		const heading = await page.getByRole('heading', { level: 1 });
		await expect(heading).toBeVisible();
		await expect(heading).toHaveText('Mortgage Calculator');

		// Check subtitle
		const subtitle = await page.locator('.subtitle');
		await expect(subtitle).toBeVisible();
		await expect(subtitle).toContainText('Calculate your maximum mortgage quickly and easily');

		// Check main container structure
		await expect(page.locator('.calculator-container')).toBeVisible();
		await expect(page.locator('.calculator-form')).toBeVisible();
		await expect(page.locator('.calculator-results')).toBeVisible();
	});

	test('should display all form fields with default values', async ({ page }) => {
		// Check Income field
		const incomeInput = page.locator('input[data-testid="principal-input"]');
		await expect(incomeInput).toBeVisible();
		await expect(incomeInput).toHaveValue('300000');

		// Check Interest Rate field
		const interestInput = page.locator('input[data-testid="interest-rate-input"]');
		await expect(interestInput).toBeVisible();
		await expect(interestInput).toHaveValue('3.5');

		// Check Duration field
		const durationInput = page.locator('input[data-testid="duration-input"]');
		await expect(durationInput).toBeVisible();
		await expect(durationInput).toHaveValue('30');

		// Check Buying Alone radio buttons
		const buyingAloneRadio = page.locator('input[data-testid="buying-alone-true"]');
		const buyingWithPartnerRadio = page.locator('input[data-testid="buying-alone-false"]');
		await expect(buyingAloneRadio).toBeVisible();
		await expect(buyingWithPartnerRadio).toBeVisible();

		// Check Energy Label select
		const energySelect = page.locator('select[data-testid="energy-label-select"]');
		await expect(energySelect).toBeVisible();
	});

	test('should calculate mortgage with valid inputs', async ({ page }) => {
		// Fill in form with valid data
		await page.fill('input[data-testid="principal-input"]', '250000');
		await page.fill('input[data-testid="interest-rate-input"]', '4.0');
		await page.fill('input[data-testid="duration-input"]', '25');

		// Select buying alone
		await page.check('input[data-testid="buying-alone-true"]');

		// Select energy label B
		await selectEnergyLabelRobust(page, 'B');

		// Submit form
		await page.click('button[type="submit"]');

		// Check that results are displayed
		await expect(page.locator('.result-display')).toBeVisible();

		// Check for monthly payment display
		const monthlyPayment = page.locator('[data-testid="monthly-payment"]');
		await expect(monthlyPayment).toBeVisible();

		// Check for maximum mortgage display
		const maxMortgage = page.locator('[data-testid="maximum-mortgage"]');
		await expect(maxMortgage).toBeVisible();

		// Verify calculations are reasonable (basic sanity check)
		const monthlyPaymentText = await monthlyPayment.textContent();
		const maxMortgageText = await maxMortgage.textContent();

		expect(monthlyPaymentText).toMatch(/€.*\d/); // Should contain Euro symbol and numbers
		expect(maxMortgageText).toMatch(/€.*\d/); // Should contain Euro symbol and numbers
	});

	test('should update calculations when inputs change', async ({ page }) => {
		// Fill initial form
		await page.fill('input[data-testid="principal-input"]', '200000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.0');
		await page.fill('input[data-testid="duration-input"]', '30');
		await page.check('input[data-testid="buying-alone-true"]');
		await selectEnergyLabelRobust(page, 'A');
		await page.click('button[type="submit"]');

		// Get initial monthly payment
		const initialPayment = await page.locator('[data-testid="monthly-payment"]').textContent();

		// Change principal amount
		await page.fill('input[data-testid="principal-input"]', '300000');
		await page.click('button[type="submit"]');

		// Get updated monthly payment
		const updatedPayment = await page.locator('[data-testid="monthly-payment"]').textContent();

		// Payment should be different (higher with higher principal)
		expect(updatedPayment).not.toBe(initialPayment);
	});





	test('should handle edge case values', async ({ page }) => {
		// Test minimum reasonable values
		await page.fill('input[data-testid="principal-input"]', '50000');
		await page.fill('input[data-testid="interest-rate-input"]', '0.1');
		await page.fill('input[data-testid="duration-input"]', '5');
		await page.check('input[data-testid="buying-alone-true"]');
		await selectEnergyLabelRobust(page, 'G');
		await page.click('button[type="submit"]');

		await expect(page.locator('[data-testid="monthly-payment"]')).toBeVisible();
		await expect(page.locator('[data-testid="maximum-mortgage"]')).toBeVisible();

		// Test maximum reasonable values
		await page.fill('input[data-testid="principal-input"]', '1000000');
		await page.fill('input[data-testid="interest-rate-input"]', '10');
		await page.fill('input[data-testid="duration-input"]', '40');
		await selectEnergyLabelRobust(page, 'A');
		await page.click('button[type="submit"]');

		await expect(page.locator('[data-testid="monthly-payment"]')).toBeVisible();
		await expect(page.locator('[data-testid="maximum-mortgage"]')).toBeVisible();
	});
});
