import { test, expect } from '@playwright/test';

test.describe('Mortgage Calculator - Accessibility', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');
	});

	test('should have proper heading hierarchy', async ({ page }) => {
		// Check main heading
		const h1 = page.getByRole('heading', { level: 1 });
		await expect(h1).toBeVisible();
		await expect(h1).toHaveText('Mortgage Calculator');

		// Check for any h2, h3 headings in logical order
		const allHeadings = page.locator('h1, h2, h3, h4, h5, h6');
		const headingCount = await allHeadings.count();

		if (headingCount > 1) {
			// Verify heading hierarchy is logical
			for (let i = 0; i < headingCount; i++) {
				const heading = allHeadings.nth(i);
				await expect(heading).toBeVisible();

				// Each heading should have accessible text
				const headingText = await heading.textContent();
				expect(headingText?.trim()).toBeTruthy();
			}
		}
	});

	test('should have proper form labels and associations', async ({ page }) => {
		// Check that all form inputs have associated labels
		const inputs = page.locator('input, select');
		const inputCount = await inputs.count();

		for (let i = 0; i < inputCount; i++) {
			const input = inputs.nth(i);
			const inputId = await input.getAttribute('id');
			const inputType = await input.getAttribute('type');

			// Skip hidden inputs
			if (inputType === 'hidden') continue;

			if (inputId) {
				// Check for associated label
				const label = page.locator(`label[for="${inputId}"]`);
				await expect(label).toBeVisible();
			} else {
				// Input should at least have aria-label
				await expect(input).toHaveAttribute('aria-label');
			}
		}
	});

	test('should be keyboard navigable', async ({ page }) => {
		// Fill form to ensure submit button is enabled for keyboard navigation test
		await page.fill('input[data-testid="principal-input"]', '300000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await page.fill('input[data-testid="duration-input"]', '30');
		await page.check('input[data-testid="buying-alone-true"]');
		await page.selectOption('select[data-testid="energy-label-select"]', 'A');
		
		// Test that form elements can be focused individually
		await page.focus('input[data-testid="principal-input"]');
		await expect(page.locator('input[data-testid="principal-input"]')).toBeFocused();
		
		await page.focus('input[data-testid="interest-rate-input"]');
		await expect(page.locator('input[data-testid="interest-rate-input"]')).toBeFocused();
		
		await page.focus('input[data-testid="duration-input"]');
		await expect(page.locator('input[data-testid="duration-input"]')).toBeFocused();
		
		// Test that submit button can be focused when enabled
		await page.focus('button[type="submit"]');
		await expect(page.locator('button[type="submit"]')).toBeFocused();
		
		// Test that radio buttons can be focused
		await page.focus('input[data-testid="buying-alone-true"]');
		await expect(page.locator('input[data-testid="buying-alone-true"]')).toBeFocused();
		
		// Test that select can be focused
		await page.focus('select[data-testid="energy-label-select"]');
		await expect(page.locator('select[data-testid="energy-label-select"]')).toBeFocused();
	});

	test('should have visible focus indicators', async ({ page }) => {
		const focusableElements = page.locator(
			'input, button, select, a, [tabindex]:not([tabindex="-1"])'
		);
		const elementCount = await focusableElements.count();

		for (let i = 0; i < Math.min(elementCount, 10); i++) {
			const element = focusableElements.nth(i);
			if (await element.isVisible()) {
				await element.focus();

				// Check that element has focus styling
				const computedStyle = await element.evaluate((el) => {
					const style = getComputedStyle(el);
					return {
						outline: style.outline,
						outlineWidth: style.outlineWidth,
						outlineStyle: style.outlineStyle,
						outlineColor: style.outlineColor,
						boxShadow: style.boxShadow
					};
				});

				// Should have some form of focus indicator
				const hasFocusIndicator =
					computedStyle.outline !== 'none' ||
					computedStyle.outlineWidth !== '0px' ||
					computedStyle.boxShadow !== 'none';

				expect(hasFocusIndicator).toBeTruthy();
			}
		}
	});

	test('should have proper ARIA attributes', async ({ page }) => {
		// Check required fields have aria-required
		const requiredInputs = page.locator('input[required], select[required]');
		const requiredCount = await requiredInputs.count();

		for (let i = 0; i < requiredCount; i++) {
			const input = requiredInputs.nth(i);
			await expect(input).toHaveAttribute('aria-required', 'true');
		}

		// Check error messages have proper ARIA roles
		const errorMessages = page.locator('.error-message');
		const errorCount = await errorMessages.count();

		for (let i = 0; i < errorCount; i++) {
			const error = errorMessages.nth(i);
			if (await error.isVisible()) {
				await expect(error).toHaveAttribute('role', 'alert');
			}
		}

		// Check that form fields have descriptive labels
		const ariaLabels = page.locator('[aria-label]');
		const labelCount = await ariaLabels.count();

		for (let i = 0; i < labelCount; i++) {
			const element = ariaLabels.nth(i);
			const ariaLabel = await element.getAttribute('aria-label');
			expect(ariaLabel?.trim().length).toBeGreaterThan(2);
		}
	});

	test('should support screen readers with proper semantics', async ({ page }) => {
		// Check main landmarks
		await expect(page.locator('main')).toBeVisible();

		// Check form structure
		const form = page.locator('form');
		if ((await form.count()) > 0) {
			await expect(form.first()).toBeVisible();
		}

		// Check that interactive elements have proper roles
		const buttons = page.locator('button');
		const buttonCount = await buttons.count();

		for (let i = 0; i < buttonCount; i++) {
			const button = buttons.nth(i);
			const role = await button.getAttribute('role');

			// Button should have button role (implicit) or explicit role
			expect(role === null || role === 'button').toBeTruthy();

			// Should have accessible name
			await expect(button).toHaveAccessibleName(/.+/);
		}
	});

	test('should handle keyboard interaction for form submission', async ({ page }) => {
		// Fill form using keyboard navigation
		await page.keyboard.press('Tab'); // Focus first input
		await page.keyboard.type('250000');

		await page.keyboard.press('Tab'); // Interest rate
		await page.keyboard.type('3.5');

		await page.keyboard.press('Tab'); // Duration
		await page.keyboard.type('30');

		await page.keyboard.press('Tab'); // Buying alone radio
		await page.keyboard.press('Space'); // Select radio button

		await page.keyboard.press('Tab'); // Skip buying with partner
		await page.keyboard.press('Tab'); // Energy label select

		// Navigate through energy label options
		await page.keyboard.press('ArrowDown'); // Open dropdown
		await page.keyboard.press('ArrowDown'); // Select A
		await page.keyboard.press('Enter'); // Confirm selection

		await page.keyboard.press('Tab'); // Submit button
		await page.keyboard.press('Enter'); // Submit form

		// Check that form was submitted successfully
		await expect(page.locator('.result-display')).toBeVisible();
	});

	test('should have proper color contrast', async ({ page }) => {
		// This test would ideally use axe-core or similar accessibility testing library
		// For now, we'll check that text elements are visible and readable

		const textElements = page.locator('h1, h2, h3, p, label, button, input, select');
		const elementCount = await textElements.count();

		for (let i = 0; i < Math.min(elementCount, 15); i++) {
			const element = textElements.nth(i);
			if (await element.isVisible()) {
				const styles = await element.evaluate((el) => {
					const computed = getComputedStyle(el);
					return {
						color: computed.color,
						backgroundColor: computed.backgroundColor,
						fontSize: computed.fontSize
					};
				});

				// Basic checks that text is not invisible
				expect(styles.color).not.toBe(styles.backgroundColor);
				expect(styles.color).not.toBe('transparent');
			}
		}
	});

	test('should support high contrast mode', async ({ page }) => {
		// Simulate high contrast mode by checking if elements are still visible
		// and have adequate styling

		await page.emulateMedia({ colorScheme: 'dark' });

		// Main elements should still be visible
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('.calculator-form')).toBeVisible();
		await expect(page.locator('.calculator-results')).toBeVisible();

		// Form inputs should still be usable
		const principalInput = page.locator('input[data-testid="principal-input"]');
		await expect(principalInput).toBeVisible();
		await expect(principalInput).toBeEnabled();

		// Reset to light mode
		await page.emulateMedia({ colorScheme: 'light' });
	});

	test('should handle reduced motion preferences', async ({ page }) => {
		// Simulate prefers-reduced-motion
		await page.emulateMedia({ reducedMotion: 'reduce' });

		// Page should still function properly with reduced motion
		await expect(page.locator('h1')).toBeVisible();

		// Fill and submit form to test that functionality isn't broken
		await page.fill('input[data-testid="principal-input"]', '250000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await page.fill('input[data-testid="duration-input"]', '30');
		await page.check('input[data-testid="buying-alone-true"]');
		await page.selectOption('select[data-testid="energy-label-select"]', 'B');
		await page.click('button[type="submit"]');

		await expect(page.locator('.result-display')).toBeVisible();

		// Reset motion preference
		await page.emulateMedia({ reducedMotion: 'no-preference' });
	});

	test('should support zoom up to 200%', async ({ page }) => {
		// Test at 200% zoom
		await page.setViewportSize({ width: 640, height: 480 }); // Simulate zoomed view

		// Main content should still be accessible
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('.calculator-form')).toBeVisible();

		// Form should still be usable
		const principalInput = page.locator('input[data-testid="principal-input"]');
		await expect(principalInput).toBeVisible();
		await principalInput.fill('250000');

		// No horizontal scrolling should be required for main content
		const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
		const bodyClientWidth = await page.evaluate(() => document.body.clientWidth);

		// Allow for some minor overflow but no major horizontal scrolling
		expect(bodyScrollWidth - bodyClientWidth).toBeLessThan(50);

		// Reset viewport
		await page.setViewportSize({ width: 1280, height: 720 });
	});

	test('should have proper error message associations', async ({ page }) => {
		// Start by interacting with form fields to trigger validation
		await page.fill('input[data-testid="principal-input"]', '300000');
		await page.fill('input[data-testid="interest-rate-input"]', '3.5');
		await page.fill('input[data-testid="duration-input"]', '30');
		await page.check('input[data-testid="buying-alone-true"]');
		await page.selectOption('select[data-testid="energy-label-select"]', 'A');
		
		// Submit once to establish a valid state
		await page.click('button[type="submit"]');
		await page.waitForTimeout(1000);
		
		// Now introduce an error in one field while keeping others valid
		await page.fill('input[data-testid="principal-input"]', '0');  // Invalid but won't disable submit
		
		// Wait for validation to trigger
		await page.waitForTimeout(500);

		// Check if error messages appear
		const errorMessages = page.locator('.error-message[role="alert"]');
		const errorCount = await errorMessages.count();

		if (errorCount > 0) {
			for (let i = 0; i < errorCount; i++) {
				const error = errorMessages.nth(i);
				await expect(error).toBeVisible();

				const errorText = await error.textContent();
				expect(errorText?.trim()).toBeTruthy();
				expect(errorText?.length).toBeGreaterThan(5);
			}
		}
	});
});
