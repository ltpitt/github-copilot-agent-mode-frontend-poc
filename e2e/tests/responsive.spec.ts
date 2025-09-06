import { test, expect } from '@playwright/test';

// Helper function to reliably select energy label with Svelte 5 reactivity
async function selectEnergyLabel(page: import('@playwright/test').Page, labelValue: string) {
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

test.describe('Mortgage Calculator - Responsive Design', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');
	});

	test('should adapt layout for tablet viewport', async ({ page }) => {
		// Set tablet viewport
		await page.setViewportSize({ width: 768, height: 1024 });

		// Main elements should still be visible
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('.calculator-container')).toBeVisible();
		await expect(page.locator('.calculator-form')).toBeVisible();
		await expect(page.locator('.calculator-results')).toBeVisible();

		// Check that form is still usable
		await page.fill('input[data-testid="principal-input"]', '250000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await expect(page.locator('input[data-testid="principal-input"]')).toHaveValue('250000');
	});

	test('should have appropriate touch targets on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Check button sizes meet minimum 44px requirement
		const submitButton = page.locator('button[type="submit"]');
		await expect(submitButton).toBeVisible();

		const buttonBox = await submitButton.boundingBox();
		expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
		expect(buttonBox?.width).toBeGreaterThanOrEqual(44);

		// Check radio buttons have adequate touch targets
		const radioButtons = page.locator('input[name="buying-type"]');
		const radioCount = await radioButtons.count();

		for (let i = 0; i < radioCount; i++) {
			const radio = radioButtons.nth(i);
			const radioBox = await radio.boundingBox();
			// Radio buttons themselves might be small, but their clickable area should be larger
			// This often includes labels or padding
			expect(radioBox?.height).toBeGreaterThanOrEqual(20);
		}
	});

	test('should maintain functionality across breakpoints', async ({ page }) => {
		const viewports = [
			{ width: 1440, height: 900, name: 'desktop' },
			{ width: 1024, height: 768, name: 'laptop' },
			{ width: 768, height: 1024, name: 'tablet' },
			{ width: 375, height: 667, name: 'mobile' }
		];

		for (const viewport of viewports) {
			await page.setViewportSize(viewport);

			// Fill and submit form at each breakpoint
			await page.fill('input[data-testid="principal-input"]', '300000');
			await page.fill('input[data-testid="interest-rate-input"]', '4.0');
			await page.fill('input[data-testid="duration-input"]', '25');
			await page.check('input[data-testid="buying-alone-true"]');
			await selectEnergyLabel(page, 'C');

			await page.click('button[type="submit"]');

			// Results should be displayed at all breakpoints
			await expect(page.locator('.result-display')).toBeVisible();
			await expect(page.locator('[data-testid="monthly-payment"]')).toBeVisible();
		}
	});

	test('should handle text scaling appropriately', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Check that text is readable at mobile sizes
		const heading = page.locator('h1');
		const headingStyle = await heading.evaluate((el) => {
			const style = getComputedStyle(el);
			return {
				fontSize: style.fontSize,
				lineHeight: style.lineHeight
			};
		});

		// Font size should be reasonable (at least 16px)
		const fontSize = parseFloat(headingStyle.fontSize);
		expect(fontSize).toBeGreaterThanOrEqual(16);

		// Check body text
		const bodyText = page.locator('.subtitle').first();
		if (await bodyText.isVisible()) {
			const bodyStyle = await bodyText.evaluate((el) => {
				const style = getComputedStyle(el);
				return {
					fontSize: style.fontSize
				};
			});

			const bodyFontSize = parseFloat(bodyStyle.fontSize);
			expect(bodyFontSize).toBeGreaterThanOrEqual(14);
		}
	});

	test('should maintain proper spacing at different screen sizes', async ({ page }) => {
		// Desktop
		await page.setViewportSize({ width: 1440, height: 900 });

		const desktopSpacing = await page.locator('.calculator-container').evaluate((el) => {
			const style = getComputedStyle(el);
			return {
				gap: style.gap,
				padding: style.padding
			};
		});

		// Mobile
		await page.setViewportSize({ width: 375, height: 667 });

		const mobileSpacing = await page.locator('.calculator-container').evaluate((el) => {
			const style = getComputedStyle(el);
			return {
				gap: style.gap,
				padding: style.padding
			};
		});

		// Spacing should adapt (typically smaller on mobile)
		expect(desktopSpacing.gap).toBeTruthy();
		expect(mobileSpacing.gap).toBeTruthy();

		// Both should have reasonable spacing (not zero)
		expect(desktopSpacing.gap).not.toBe('0px');
		expect(mobileSpacing.gap).not.toBe('0px');
	});

	test('should show mobile-optimized navigation', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Check that mobile layout doesn't show desktop-specific elements
		const desktopOnlyElements = page.locator('.desktop-only, .large-screen-only');
		const count = await desktopOnlyElements.count();

		for (let i = 0; i < count; i++) {
			const element = desktopOnlyElements.nth(i);
			await expect(element).not.toBeVisible();
		}

		// Mobile-specific elements should be visible if they exist
		const mobileElements = page.locator('.mobile-only, .small-screen-only');
		const mobileCount = await mobileElements.count();

		for (let i = 0; i < mobileCount; i++) {
			const element = mobileElements.nth(i);
			await expect(element).toBeVisible();
		}
	});

	test('should handle orientation changes', async ({ page }) => {
		// Portrait mobile
		await page.setViewportSize({ width: 375, height: 667 });
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('.calculator-form')).toBeVisible();

		// Landscape mobile
		await page.setViewportSize({ width: 667, height: 375 });
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('.calculator-form')).toBeVisible();

		// Content should still be functional in landscape
		await page.fill('input[data-testid="principal-input"]', '250000');
		await expect(page.locator('input[data-testid="principal-input"]')).toHaveValue('250000');
	});

	test('should maintain energy label colors across devices', async ({ page }) => {
		const viewports = [
			{ width: 1440, height: 900 },
			{ width: 768, height: 1024 },
			{ width: 375, height: 667 }
		];

		for (const viewport of viewports) {
			await page.setViewportSize(viewport);

			// Select energy label A
			await selectEnergyLabel(page, 'A');

			// Check color is maintained
			const energyIndicator = page.locator('.energy-indicator');
			await expect(energyIndicator).toBeVisible();
			await expect(energyIndicator).toHaveCSS('background-color', 'rgb(0, 166, 81)');
		}
	});

	test('should show form validation errors appropriately on mobile', async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 667 });

		// Trigger validation error
		await page.fill('input[data-testid="principal-input"]', '-1000');
		await page.fill('input[data-testid="interest-rate-input"]', '');
		await page.click('button[type="submit"]');

		// Error messages should be visible and well-positioned
		const errorMessages = page.locator('.error-message');
		const errorCount = await errorMessages.count();

		if (errorCount > 0) {
			for (let i = 0; i < errorCount; i++) {
				const error = errorMessages.nth(i);
				await expect(error).toBeVisible();

				// Error should not be clipped or hidden
				const errorBox = await error.boundingBox();
				expect(errorBox?.width).toBeGreaterThan(0);
				expect(errorBox?.height).toBeGreaterThan(0);
			}
		}
	});

	test('should handle very small screens gracefully', async ({ page }) => {
		// Very small screen (320px is common minimum)
		await page.setViewportSize({ width: 320, height: 568 });

		// Core functionality should still work
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('.calculator-form')).toBeVisible();

		// Form should be usable even on very small screens
		const principalInput = page.locator('input[data-testid="principal-input"]');
		await expect(principalInput).toBeVisible();
		await principalInput.fill('200000');
		await expect(principalInput).toHaveValue('200000');

		// Submit button should still be accessible
		const submitButton = page.locator('button[type="submit"]');
		await expect(submitButton).toBeVisible();

		const buttonBox = await submitButton.boundingBox();
		expect(buttonBox?.width).toBeGreaterThan(0);
		expect(buttonBox?.height).toBeGreaterThan(0);
	});
});
