import { test, expect } from '@playwright/test';
import {
	selectEnergyLabelRobust,
	fillFormFieldWithValidation,
	testFormSubmissionValidation
} from '../test-helpers.js';

test.describe('Mortgage Calculator - Form Validation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');
	});

	test('should validate principal amount constraints', async ({ page }) => {
		// Test negative values
		await fillFormFieldWithValidation(page, 'input[data-testid="principal-input"]', '-1000', true);

		// Test zero value
		await fillFormFieldWithValidation(page, 'input[data-testid="principal-input"]', '0', true);

		// Test very large values (should be handled gracefully)
		await fillFormFieldWithValidation(
			page,
			'input[data-testid="principal-input"]',
			'999999999',
			false
		);

		// Test valid value - errors should disappear
		await fillFormFieldWithValidation(
			page,
			'input[data-testid="principal-input"]',
			'250000',
			false
		);
	});

	test('should validate interest rate constraints', async ({ page }) => {
		// Test negative interest rate
		await fillFormFieldWithValidation(page, 'input[data-testid="interest-rate-input"]', '-1', true);

		// Test zero interest rate (should be valid)
		await fillFormFieldWithValidation(page, 'input[data-testid="interest-rate-input"]', '0', false);

		// Test unreasonably high interest rate
		await fillFormFieldWithValidation(
			page,
			'input[data-testid="interest-rate-input"]',
			'50',
			false
		);

		// Test valid interest rate
		await fillFormFieldWithValidation(
			page,
			'input[data-testid="interest-rate-input"]',
			'3.5',
			false
		);
	});

	test('should validate duration constraints', async ({ page }) => {
		// Test negative duration
		await fillFormFieldWithValidation(page, 'input[data-testid="duration-input"]', '-5', true);

		// Test zero duration
		await fillFormFieldWithValidation(page, 'input[data-testid="duration-input"]', '0', true);

		// Test very long duration
		await fillFormFieldWithValidation(page, 'input[data-testid="duration-input"]', '100', false);

		// Test valid duration
		await fillFormFieldWithValidation(page, 'input[data-testid="duration-input"]', '30', false);
	});

	test('should validate numeric inputs only accept numbers', async ({ page }) => {
		const principalInput = page.locator('input[data-testid="principal-input"]');
		const interestInput = page.locator('input[data-testid="interest-rate-input"]');
		const durationInput = page.locator('input[data-testid="duration-input"]');

		// Check that inputs have correct type attribute
		await expect(principalInput).toHaveAttribute('type', 'number');
		await expect(interestInput).toHaveAttribute('type', 'number');
		await expect(durationInput).toHaveAttribute('type', 'number');

		// Test decimal numbers are accepted where appropriate
		await principalInput.fill('250000.50');
		expect(await principalInput.inputValue()).toMatch(/\d+\.?\d*/);

		await interestInput.fill('3.75');
		expect(await interestInput.inputValue()).toMatch(/\d+\.?\d*/);

		// Test that inputs maintain their numeric values
		await durationInput.fill('25');
		expect(await durationInput.inputValue()).toBe('25');
	});

	test('should show contextual helper text', async ({ page }) => {
		// Check for helper text on form fields
		const helperTexts = page.locator('.helper-text');
		const helperCount = await helperTexts.count();

		// Should have some helper text elements
		expect(helperCount).toBeGreaterThan(0);

		// Helper text should be descriptive
		for (let i = 0; i < helperCount; i++) {
			const helperText = await helperTexts.nth(i).textContent();
			expect(helperText).toBeTruthy();
			expect(helperText!.length).toBeGreaterThan(5); // Should be descriptive, not just empty
		}
	});

	test('should handle decimal input formatting', async ({ page }) => {
		// Test various decimal formats
		const interestInput = page.locator('input[data-testid="interest-rate-input"]');

		await interestInput.fill('3.75');
		expect(await interestInput.inputValue()).toBe('3.75');

		await interestInput.fill('4');
		expect(await interestInput.inputValue()).toBe('4');

		await interestInput.fill('4.0');
		expect(await interestInput.inputValue()).toBe('4.0');

		// Test principal with decimals
		const principalInput = page.locator('input[data-testid="principal-input"]');
		await principalInput.fill('250000.00');
		expect(await principalInput.inputValue()).toMatch(/250000\.?0*0?/);
	});
});
