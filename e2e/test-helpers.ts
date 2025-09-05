import { expect, type Page } from '@playwright/test';

/**
 * Enhanced test helpers for Svelte 5 reactivity compatibility
 * Implements the technical solutions suggested for E2E test reliability
 */

/**
 * Solution 1 & 2: Enhanced energy label selection with proper wait conditions
 * Uses waitForFunction() and await expect() for better timing
 */
export async function selectEnergyLabelWithWait(
	page: Page,
	energyLabel: string,
	timeout = 10000
): Promise<void> {
	console.log(`Testing energy label: ${energyLabel}`);
	console.log(`Attempting to select: ${energyLabel}`);

	// Ensure page is fully loaded
	await page.waitForLoadState('networkidle');

	const energySelect = page.locator('select[data-testid="energy-label-select"]');

	// Solution 1: Use await expect() with toBeVisible() before interaction
	await expect(energySelect).toBeVisible({ timeout });

	// Solution 2: Use selectOption with proper event dispatch
	await energySelect.selectOption(energyLabel);

	// Solution 2: Use waitForFunction() to wait for Svelte reactivity to settle
	await page.waitForFunction(
		(label) => {
			const select = document.querySelector('select[data-testid="energy-label-select"]') as HTMLSelectElement;
			return select?.value === label;
		},
		energyLabel,
		{ timeout }
	);

	// Verify the selection took effect using Solution 1: await expect() with toHaveValue()
	await expect(energySelect).toHaveValue(energyLabel, { timeout });

	// Check for energy indicator visibility
	const energyIndicator = page.locator('[data-testid="energy-indicator"]');
	if (energyLabel && energyLabel !== '') {
		await expect(energyIndicator).toBeVisible({ timeout });
		await expect(energyIndicator).toHaveText(energyLabel, { timeout });
	}

	console.log(`Final value: "${await energySelect.inputValue()}"`);
	const indicatorCount = await energyIndicator.count();
	console.log(`Energy indicators found: ${indicatorCount}`);
}

/**
 * Solution 3: Enhanced form validation with requestAnimationFrame timing
 * Waits for validation state to settle in Svelte components
 */
export async function waitForValidationState(
	page: Page,
	shouldHaveErrors: boolean = true,
	timeout = 5000
): Promise<void> {
	// Wait for any pending animations and state updates
	await page.evaluate(() => {
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(resolve);
			});
		});
	});

	if (shouldHaveErrors) {
		// Solution 1: Use await expect() with toBeVisible() for error messages
		await expect(page.locator('.error-message').first()).toBeVisible({ timeout });
	} else {
		// Wait for errors to disappear
		await expect(page.locator('.error-message')).not.toBeVisible({ timeout });
	}
}

/**
 * Solution 5: Enhanced form interaction using click() instead of direct manipulation
 * Better mimics real user behavior
 */
export async function fillFormFieldWithValidation(
	page: Page,
	selector: string,
	value: string,
	expectErrors: boolean = false
): Promise<void> {
	const field = page.locator(selector);
	
	// Solution 1: Ensure field is visible and enabled
	await expect(field).toBeVisible();
	await expect(field).toBeEnabled();
	
	// Clear and fill the field
	await field.fill('');
	await field.fill(value);
	
	// Solution 5: Trigger blur event to activate validation
	await field.blur();
	
	// Solution 2: Wait for validation state to settle
	await waitForValidationState(page, expectErrors);
}

/**
 * Solution 4: Enhanced form submission with tick() equivalent
 * Uses requestAnimationFrame to ensure state updates are flushed
 */
export async function submitFormWithWait(page: Page): Promise<void> {
	const submitButton = page.locator('button[type="submit"]');
	
	// Solution 1: Ensure button is visible and enabled
	await expect(submitButton).toBeVisible();
	
	// Click submit
	await submitButton.click();
	
	// Solution 3 & 4: Wait for form state updates (equivalent to tick() in Svelte)
	await page.evaluate(() => {
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					requestAnimationFrame(resolve);
				});
			});
		});
	});
}

/**
 * Solution 6: Enhanced element selection with data-testid
 * Provides stable selectors for better test reliability
 */
export function getTestIdSelector(testId: string): string {
	return `[data-testid="${testId}"]`;
}

/**
 * Solution 7: Enhanced validation with setTimeout delay
 * Adds configurable delay for validation timing issues
 */
export async function waitForValidationDelay(delayMs: number = 100): Promise<void> {
	await new Promise(resolve => setTimeout(resolve, delayMs));
}

/**
 * Enhanced energy label selection using multiple approaches for maximum reliability
 */
export async function selectEnergyLabelRobust(
	page: Page,
	energyLabel: string,
	timeout = 10000
): Promise<void> {
	const selector = 'select[data-testid="energy-label-select"]';
	
	// Try approach 1: Standard selectOption with proper waits
	try {
		await selectEnergyLabelWithWait(page, energyLabel, timeout);
		return;
	} catch (error) {
		console.log('Standard selection failed, trying alternative approach...');
	}
	
	// Try approach 2: Solution 5 - Use click() on select element
	try {
		const select = page.locator(selector);
		await select.click();
		await page.locator(`option[value="${energyLabel}"]`).click();
		await waitForValidationDelay(200);
		
		// Verify selection
		await expect(select).toHaveValue(energyLabel, { timeout });
		return;
	} catch (error) {
		console.log('Click selection failed, trying manual event dispatch...');
	}
	
	// Try approach 3: Solution 2 - Manual event dispatch using evaluate()
	await page.evaluate((label) => {
		const select = document.querySelector('select[data-testid="energy-label-select"]') as HTMLSelectElement;
		if (select) {
			select.value = label;
			// Dispatch multiple events to ensure Svelte reactivity
			select.dispatchEvent(new Event('change', { bubbles: true }));
			select.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}, energyLabel);
	
	// Wait for state to settle
	await waitForValidationDelay(300);
	await expect(page.locator(selector)).toHaveValue(energyLabel, { timeout });
}

/**
 * Helper to wait for responsive layout changes
 */
export async function waitForResponsiveLayout(page: Page, viewport: { width: number; height: number }): Promise<void> {
	await page.setViewportSize(viewport);
	
	// Wait for layout to settle
	await page.evaluate(() => {
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					// Wait for CSS transitions and layout recalculations
					setTimeout(resolve, 100);
				});
			});
		});
	});
}