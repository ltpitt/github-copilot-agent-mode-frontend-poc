import { page } from '@vitest/browser/context';
import { beforeEach, describe, expect, it } from 'vitest';
import { calculateMonthlyPayment } from '../src/lib/mortgageCalculator';

/**
 * Integration tests for the mortgage calculator UI using Vitest browser mode
 * These tests simulate full user interactions with the mortgage calculator application
 */
describe('Mortgage Calculator - Full User Flow', () => {
	beforeEach(async () => {
		// Navigate to the mortgage calculator page
		await page.goto('/');

		// Wait for the page to load and be interactive
		await page.waitForLoadState('networkidle');
	});

	it('should display default values and calculate mortgage on page load', async () => {
		// Verify the page title and main heading
		await expect.element(page.getByRole('heading', { level: 1 })).toHaveText('Mortgage Calculator');

		// Verify default form values are loaded
		const incomeInput = page.locator('#principal');
		const interestInput = page.locator('#interest-rate');
		const durationInput = page.locator('#duration');

		await expect.element(incomeInput).toHaveValue('300000');
		await expect.element(interestInput).toHaveValue('3.5');
		await expect.element(durationInput).toHaveValue('30');

		// Click calculate button to trigger calculation with default values
		const calculateButton = page.getByRole('button', { name: /calculate/i });
		await expect.element(calculateButton).toBeEnabled();
		await calculateButton.click();

		// Verify maximum mortgage is calculated (income * 4.5)
		const maxMortgage = 300000 * 4.5; // €1,350,000
		const expectedMonthlyPayment = calculateMonthlyPayment(maxMortgage, 0.035, 360);

		// Verify maximum mortgage amount is displayed
		await expect.element(page.locator('.result-value')).toContainText('€1,350,000');

		// Verify monthly payment is displayed with correct value (rounded)
		const expectedPaymentFormatted = Math.round(expectedMonthlyPayment).toLocaleString();
		await expect
			.element(page.locator('.detail-value'))
			.toContainText(`€${expectedPaymentFormatted}`);
	});

	it('should handle user input changes and recalculate', async () => {
		// Test scenario: €500,000 income, 4% interest, 25 years
		const newIncome = 500000;
		const newInterestRate = 4.0;
		const newDuration = 25;

		// Clear and fill income field
		const incomeInput = page.locator('#principal');
		await incomeInput.clear();
		await incomeInput.fill(newIncome.toString());

		// Clear and fill interest rate field
		const interestInput = page.locator('#interest-rate');
		await interestInput.clear();
		await interestInput.fill(newInterestRate.toString());

		// Clear and fill duration field
		const durationInput = page.locator('#duration');
		await durationInput.clear();
		await durationInput.fill(newDuration.toString());

		// Submit the form
		await page.getByRole('button', { name: /calculate/i }).click();

		// Calculate expected values
		const expectedMaxMortgage = newIncome * 4.5; // €2,250,000
		const expectedMonthlyPayment = calculateMonthlyPayment(
			expectedMaxMortgage,
			newInterestRate / 100, // Convert percentage to decimal
			newDuration * 12 // Convert years to months
		);

		// Verify maximum mortgage is updated
		await expect.element(page.locator('.result-value')).toContainText('€2,250,000');

		// Verify monthly payment is updated correctly
		const expectedPaymentFormatted = Math.round(expectedMonthlyPayment).toLocaleString();
		await expect
			.element(page.locator('.detail-value'))
			.toContainText(`€${expectedPaymentFormatted}`);

		// Verify interest rate description is shown
		await expect
			.element(page.locator('.interest-info'))
			.toContainText(`${newDuration} year fixed ${newInterestRate}%`);
	});

	it('should test buying alone vs together radio buttons', async () => {
		// Test the radio button functionality for buying alone/together
		const aloneRadio = page.locator('input[type="radio"][value="true"]');
		const togetherRadio = page.locator('input[type="radio"][value="false"]');

		// Default should be "Alone" (true)
		await expect.element(aloneRadio).toBeChecked();
		await expect.element(togetherRadio).not.toBeChecked();

		// Click "Together" option
		await togetherRadio.click();
		await expect.element(togetherRadio).toBeChecked();
		await expect.element(aloneRadio).not.toBeChecked();

		// Click "Alone" option again
		await aloneRadio.click();
		await expect.element(aloneRadio).toBeChecked();
		await expect.element(togetherRadio).not.toBeChecked();
	});

	it('should handle form validation correctly', async () => {
		// Test empty income field
		const incomeInput = page.locator('#principal');
		await incomeInput.clear();

		// Button should be disabled with empty required field
		const calculateButton = page.getByRole('button', { name: /calculate/i });
		await expect.element(calculateButton).toBeDisabled();

		// Fill in a valid income
		await incomeInput.fill('100000');
		await expect.element(calculateButton).toBeEnabled();
	});

	it('should test edge case calculations', async () => {
		// Test with minimum practical values
		const minIncome = 30000; // €30,000 annual income
		const lowInterestRate = 1.0; // 1% interest
		const shortDuration = 10; // 10 years

		await page.locator('#principal').fill(minIncome.toString());
		await page.locator('#interest-rate').fill(lowInterestRate.toString());
		await page.locator('#duration').fill(shortDuration.toString());

		await page.getByRole('button', { name: /calculate/i }).click();

		// Expected maximum mortgage: €30,000 * 4.5 = €135,000
		const expectedMaxMortgage = minIncome * 4.5;
		const expectedMonthlyPayment = calculateMonthlyPayment(
			expectedMaxMortgage,
			lowInterestRate / 100,
			shortDuration * 12
		);

		await expect.element(page.locator('.result-value')).toContainText('€135,000');

		// Verify reasonable monthly payment is calculated
		expect(expectedMonthlyPayment).toBeGreaterThan(0);
		expect(expectedMonthlyPayment).toBeLessThan(expectedMaxMortgage); // Sanity check
	});

	it('should test high-value scenario', async () => {
		// Test with high income scenario
		const highIncome = 200000; // €200,000 annual income
		const highInterestRate = 6.0; // 6% interest
		const longDuration = 30; // 30 years

		await page.locator('#principal').fill(highIncome.toString());
		await page.locator('#interest-rate').fill(highInterestRate.toString());
		await page.locator('#duration').fill(longDuration.toString());

		await page.getByRole('button', { name: /calculate/i }).click();

		// Expected maximum mortgage: €200,000 * 4.5 = €900,000
		const expectedMaxMortgage = highIncome * 4.5;
		const expectedMonthlyPayment = calculateMonthlyPayment(
			expectedMaxMortgage,
			highInterestRate / 100,
			longDuration * 12
		);

		await expect.element(page.locator('.result-value')).toContainText('€900,000');

		// Verify the monthly payment is calculated and displayed
		const expectedPaymentFormatted = Math.round(expectedMonthlyPayment).toLocaleString();
		await expect
			.element(page.locator('.detail-value'))
			.toContainText(`€${expectedPaymentFormatted}`);
	});

	it('should test zero interest rate edge case', async () => {
		// Test with 0% interest rate (edge case handled by calculation function)
		const income = 120000;
		const zeroInterestRate = 0;
		const duration = 20;

		await page.locator('#principal').fill(income.toString());
		await page.locator('#interest-rate').fill(zeroInterestRate.toString());
		await page.locator('#duration').fill(duration.toString());

		await page.getByRole('button', { name: /calculate/i }).click();

		// Expected maximum mortgage: €120,000 * 4.5 = €540,000
		const expectedMaxMortgage = income * 4.5;
		// With 0% interest, monthly payment = principal / number of payments
		const expectedMonthlyPayment = expectedMaxMortgage / (duration * 12);

		await expect.element(page.locator('.result-value')).toContainText('€540,000');

		// Verify monthly payment for 0% interest scenario
		const expectedPaymentFormatted = Math.round(expectedMonthlyPayment).toLocaleString();
		await expect
			.element(page.locator('.detail-value'))
			.toContainText(`€${expectedPaymentFormatted}`);
	});

	it('should test keyboard interaction', async () => {
		// Test Enter key submission
		const incomeInput = page.locator('#principal');
		await incomeInput.clear();
		await incomeInput.fill('150000');

		// Press Enter in the income field to trigger form submission
		await incomeInput.press('Enter');

		// Verify calculation is triggered by Enter key
		const expectedMaxMortgage = 150000 * 4.5; // €675,000
		await expect
			.element(page.locator('.result-value'))
			.toContainText(`€${expectedMaxMortgage.toLocaleString()}`);
	});

	it('should display placeholder information when no calculation', async () => {
		// On initial load (before any calculation), verify placeholder content
		await expect.element(page.locator('.placeholder-info')).toBeVisible();
		await expect
			.element(page.locator('.placeholder-info p'))
			.toContainText('Enter your details on the left to see your maximum mortgage amount');

		// After calculation, placeholder should be hidden
		await page.getByRole('button', { name: /calculate/i }).click();
		await expect.element(page.locator('.placeholder-info')).not.toBeVisible();
		await expect.element(page.locator('.result-display')).toBeVisible();
	});

	it('should verify responsive design elements', async () => {
		// Test that key elements are visible and accessible
		await expect.element(page.locator('.calculator-container')).toBeVisible();
		await expect.element(page.locator('.calculator-form')).toBeVisible();
		await expect.element(page.locator('.calculator-results')).toBeVisible();

		// Verify form elements are accessible
		await expect.element(page.locator('#principal')).toBeVisible();
		await expect.element(page.locator('#interest-rate')).toBeVisible();
		await expect.element(page.locator('#duration')).toBeVisible();

		// Verify form labels are present for accessibility
		await expect
			.element(page.locator('label[for="principal"]'))
			.toContainText('gross annual income');
		await expect
			.element(page.locator('label[for="interest-rate"]'))
			.toContainText('Annual Interest Rate');
		await expect.element(page.locator('label[for="duration"]')).toContainText('Duration');
	});
});
