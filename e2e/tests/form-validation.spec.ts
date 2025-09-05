import { test, expect } from '@playwright/test';

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

test.describe('Mortgage Calculator - Form Validation', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');
	});

	test('should show validation errors for empty required fields', async ({ page }) => {
		// Wait for page to be fully loaded
		await page.waitForLoadState('networkidle');
		await page.waitForTimeout(500);

		// Set invalid values that should trigger validation errors
		await page.fill('input[data-testid="principal-input"]', '0'); // Invalid: must be > 0
		await page.fill('input[data-testid="interest-rate-input"]', '-1'); // Invalid: must be >= 0  
		await page.fill('input[data-testid="duration-input"]', '0'); // Invalid: must be > 0

		// Debug: Check button state and form details before submitting
		const button = page.locator('button[type="submit"]');
		const isButtonEnabled = await button.isEnabled();
		const buttonText = await button.textContent();
		console.log(`Submit button - enabled: ${isButtonEnabled}, text: "${buttonText}"`);

		// Try to submit without selecting buying type or energy label (these should fail validation)
		console.log('Submitting form with invalid fields...');
		await page.click('button[type="submit"]');

		// Wait longer for form processing and error display
		await page.waitForTimeout(2000);

		// Debug: Check what error messages exist
		const errorMessages = await page.locator('.error-message').count();
		console.log(`Found ${errorMessages} error messages`);
		
		// Also check for any validation-related elements
		const allErrors = await page.locator('[role="alert"]').count();
		console.log(`Found ${allErrors} alert elements`);
		
		if (errorMessages === 0) {
			// Check console output to see if form is actually being submitted
			const logs = await page.evaluate(() => {
				return (window as any).lastFormSubmission || 'No form submission logged';
			});
			console.log('Form submission state:', logs);
		}

		// Check for validation error messages
		await expect(page.locator('.error-message').first()).toBeVisible({ timeout: 10000 });

		// Check that results are not shown when form is invalid
		const resultDisplay = page.locator('.result-display');
		// Results should either not be visible or show some indication of invalid state
		const isResultVisible = await resultDisplay.isVisible();
		if (isResultVisible) {
			// If results are shown, they should indicate no calculation or error state
			// Check if monthly payment element exists first
			const monthlyPaymentElement = page.locator('[data-testid="monthly-payment"]');
			const monthlyPaymentExists = await monthlyPaymentElement.count() > 0;
			
			if (monthlyPaymentExists) {
				const monthlyPayment = await monthlyPaymentElement.textContent();
				expect(monthlyPayment).toMatch(/€0|€0\.00/); // Should show €0 or similar
			}
			
			// Check that the maximum mortgage shows 0 or similar (this should always exist)
			const maxMortgage = await page.locator('[data-testid="maximum-mortgage"]').textContent();
			expect(maxMortgage).toMatch(/€0|€0\.00/); // Should show €0 or similar
		}
	});

	test('should validate principal amount constraints', async ({ page }) => {
		const principalInput = page.locator('input[data-testid="principal-input"]');

		// Test negative values
		await principalInput.fill('-1000');
		await principalInput.blur();
		await expect(page.locator('.error-message').first()).toBeVisible();

		// Test zero value
		await principalInput.fill('0');
		await principalInput.blur();
		await expect(page.locator('.error-message').first()).toBeVisible();

		// Test very large values (should be handled gracefully)
		await principalInput.fill('999999999');
		await principalInput.blur();
		// Should either accept or show reasonable error

		// Test valid value
		await principalInput.fill('250000');
		await principalInput.blur();
		// Error should disappear
		await expect(page.locator('.error-message')).not.toBeVisible();
	});

	test('should validate interest rate constraints', async ({ page }) => {
		const interestInput = page.locator('input[data-testid="interest-rate-input"]');

		// Test negative interest rate
		await interestInput.fill('-1');
		await interestInput.blur();
		await expect(page.locator('.error-message').first()).toBeVisible();

		// Test zero interest rate (should be valid)
		await interestInput.fill('0');
		await interestInput.blur();
		// Zero interest rate should be acceptable for calculations

		// Test unreasonably high interest rate
		await interestInput.fill('50');
		await interestInput.blur();
		// Should either accept or show warning

		// Test valid interest rate
		await interestInput.fill('3.5');
		await interestInput.blur();
		await expect(page.locator('.error-message')).not.toBeVisible();
	});

	test('should validate duration constraints', async ({ page }) => {
		const durationInput = page.locator('input[data-testid="duration-input"]');

		// Test negative duration
		await durationInput.fill('-5');
		await durationInput.blur();
		await expect(page.locator('.error-message').first()).toBeVisible();

		// Test zero duration
		await durationInput.fill('0');
		await durationInput.blur();
		await expect(page.locator('.error-message').first()).toBeVisible();

		// Test very long duration
		await durationInput.fill('100');
		await durationInput.blur();
		// Should either accept or show warning

		// Test valid duration
		await durationInput.fill('30');
		await durationInput.blur();
		await expect(page.locator('.error-message')).not.toBeVisible();
	});

	test('should require buying type selection', async ({ page }) => {
		// Fill all other required fields
		await page.fill('input[data-testid="principal-input"]', '250000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await page.fill('input[data-testid="duration-input"]', '30');
		await selectEnergyLabel(page, 'B');

		// Don't select buying type
		await page.click('button[type="submit"]');

		// Should show error for missing buying type selection
		await expect(page.locator('.error-message').first()).toBeVisible();
	});

	test('should require energy label selection', async ({ page }) => {
		// Fill all other required fields
		await page.fill('input[data-testid="principal-input"]', '250000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await page.fill('input[data-testid="duration-input"]', '30');
		await page.check('input[data-testid="buying-alone-true"]');

		// Don't select energy label
		await page.click('button[type="submit"]');

		// Should show error for missing energy label selection
		await expect(page.locator('.error-message').first()).toBeVisible();
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

	test('should handle form reset functionality', async ({ page }) => {
		// Fill form with custom values
		await page.fill('input[data-testid="principal-input"]', '400000');
		await page.fill('input[data-testid="interest-rate-input"]', '5.0');
		await page.fill('input[data-testid="duration-input"]', '25');
		await page.check('input[data-testid="buying-alone-false"]');
		await selectEnergyLabel(page, 'D');

		// Check if there's a reset button and use it
		const resetButton = page.locator('button[type="reset"], button[data-testid="reset-button"]');
		if (await resetButton.isVisible()) {
			await resetButton.click();

			// Check that form returns to default values
			await expect(page.locator('input[data-testid="principal-input"]')).toHaveValue('300000');
			await expect(page.locator('input[data-testid="interest-rate-input"]')).toHaveValue('3.5');
			await expect(page.locator('input[data-testid="duration-input"]')).toHaveValue('30');

			// Radio buttons should be unchecked
			await expect(page.locator('input[name="buying-type"]:checked')).toHaveCount(0);

			// Energy label should be unselected
			await expect(page.locator('select[data-testid="energy-label-select"]')).toHaveValue('');
		}
	});

	test('should provide real-time validation feedback', async ({ page }) => {
		const principalInput = page.locator('input[data-testid="principal-input"]');

		// Start with invalid value
		await principalInput.fill('-1000');
		await principalInput.blur();

		// Error should appear
		await expect(page.locator('.error-message').first()).toBeVisible();

		// Change to valid value
		await principalInput.fill('250000');
		await principalInput.blur();

		// Error should disappear
		await expect(page.locator('.error-message')).not.toBeVisible();
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
