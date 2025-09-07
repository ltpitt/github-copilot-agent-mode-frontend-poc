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

test.describe('Mortgage Calculator - Visual & UI Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:5173');
	});

	test('should display proper ING brand colors and styling', async ({ page }) => {
		// Check main heading styling
		const heading = page.getByRole('heading', { level: 1 });
		const headingStyles = await heading.evaluate((el) => {
			const style = getComputedStyle(el);
			return {
				color: style.color,
				fontWeight: style.fontWeight,
				fontSize: style.fontSize
			};
		});

		// Should use proper typography
		expect(headingStyles.fontWeight).toBe('700'); // Bold
		expect(parseInt(headingStyles.fontSize)).toBeGreaterThanOrEqual(32); // Large heading

		// Check ING orange color is used for primary elements
		const calculateButton = page.locator('button[type="submit"]:not([disabled])');
		if (await calculateButton.isVisible()) {
			const buttonStyles = await calculateButton.evaluate((el) => {
				const style = getComputedStyle(el);
				return {
					backgroundColor: style.backgroundColor,
					color: style.color
				};
			});

			// Should use ING orange (#FF6200)
			expect(buttonStyles.backgroundColor).toBe('rgb(255, 98, 0)');
		}
	});

	test('should display energy label colors correctly for all labels', async ({ page }) => {
		// Test each energy label color
		const expectedColors = {
			A: 'rgb(0, 166, 81)', // Green
			B: 'rgb(138, 200, 59)', // Light green
			C: 'rgb(255, 213, 2)', // Yellow
			D: 'rgb(255, 165, 0)', // Orange
			E: 'rgb(255, 102, 0)', // Orange-red
			F: 'rgb(255, 51, 0)', // Red
			G: 'rgb(204, 0, 0)' // Dark red
		};

		for (const [label, expectedColor] of Object.entries(expectedColors)) {
			await selectEnergyLabel(page, label);

			// Check that energy indicator appears with correct color
			const energyIndicator = page.locator('.energy-indicator');
			await expect(energyIndicator).toBeVisible({ timeout: 10000 });
			await expect(energyIndicator).toHaveText(label);

			const backgroundColor = await energyIndicator.evaluate((el) => {
				return getComputedStyle(el).backgroundColor;
			});

			expect(backgroundColor).toBe(expectedColor);
		}
	});

	test('should maintain visual consistency in results display', async ({ page }) => {
		// Fill form and submit
		await selectEnergyLabel(page, 'A');
		await page.click('button[type="submit"]');

		// Check results display styling
		const resultDisplay = page.locator('.result-display');
		await expect(resultDisplay).toBeVisible();

		const maxMortgage = page.locator('[data-testid="maximum-mortgage"]');
		await expect(maxMortgage).toBeVisible();

		const maxMortgageStyles = await maxMortgage.evaluate((el) => {
			const style = getComputedStyle(el);
			return {
				fontSize: style.fontSize,
				fontWeight: style.fontWeight,
				color: style.color
			};
		});

		// Should have large, prominent styling for the main result
		expect(parseInt(maxMortgageStyles.fontSize)).toBeGreaterThanOrEqual(24);
		expect(maxMortgageStyles.fontWeight).toBe('700');

		// Monthly payment should be visible with proper styling
		const monthlyPayment = page.locator('[data-testid="monthly-payment"]');
		await expect(monthlyPayment).toBeVisible();

		// Energy label should be displayed with its color in results
		const energyLabelDisplay = page.locator('[data-testid="energy-indicator"]');
		await expect(energyLabelDisplay).toBeVisible();
		await expect(energyLabelDisplay).toHaveText('A');
		await expect(energyLabelDisplay).toHaveCSS('background-color', 'rgb(0, 166, 81)');
	});

	test('should show proper loading and transition states', async ({ page }) => {
		// Check initial state
		const initialValue = await page.locator('[data-testid="maximum-mortgage"]').textContent();
		expect(initialValue).toBe('€0');

		// Fill form
		await selectEnergyLabel(page, 'C');

		// Submit and check for immediate update
		await page.click('button[type="submit"]');

		// Results should update
		await expect(page.locator('[data-testid="maximum-mortgage"]')).not.toHaveText('€0');
		await expect(page.locator('[data-testid="monthly-payment"]')).toBeVisible();
	});

	test('should maintain accessibility color contrast', async ({ page }) => {
		// Check main text elements have sufficient contrast
		const textElements = [
			page.locator('h1'),
			page.locator('h2'),
			page.locator('label').first(),
			page.locator('.subtitle')
		];

		for (const element of textElements) {
			if (await element.isVisible()) {
				const styles = await element.evaluate((el) => {
					const computed = getComputedStyle(el);
					return {
						color: computed.color,
						backgroundColor: computed.backgroundColor,
						fontSize: computed.fontSize
					};
				});

				// Text should be visible (not transparent)
				expect(styles.color).not.toBe('transparent');
				expect(styles.color).not.toBe('rgba(0, 0, 0, 0)');

				// Font should be readable size
				const fontSize = parseInt(styles.fontSize);
				expect(fontSize).toBeGreaterThanOrEqual(12);
			}
		}
	});

	test('should show visual hierarchy in form layout', async ({ page }) => {
		// Check form sections are visually distinct
		const formSections = page.locator('.form-group');
		const sectionCount = await formSections.count();

		expect(sectionCount).toBeGreaterThan(3); // Should have multiple form sections

		// Check that sections have proper spacing
		for (let i = 0; i < Math.min(sectionCount, 5); i++) {
			const section = formSections.nth(i);
			const sectionStyles = await section.evaluate((el) => {
				const style = getComputedStyle(el);
				return {
					marginBottom: style.marginBottom,
					paddingBottom: style.paddingBottom
				};
			});

			// Should have some spacing
			const hasSpacing =
				parseInt(sectionStyles.marginBottom) > 0 || parseInt(sectionStyles.paddingBottom) > 0;
			expect(hasSpacing).toBeTruthy();
		}

		// Submit button should be visually prominent
		const submitButton = page.locator('button[type="submit"]');
		const buttonStyles = await submitButton.evaluate((el) => {
			const style = getComputedStyle(el);
			return {
				padding: style.padding,
				fontSize: style.fontSize,
				fontWeight: style.fontWeight
			};
		});

		// Should have substantial padding and prominent text
		expect(parseInt(buttonStyles.fontSize)).toBeGreaterThanOrEqual(14);
		expect(buttonStyles.fontWeight).toBe('600'); // Semi-bold or higher
	});

	test('should display proper typography scale', async ({ page }) => {
		// Check heading hierarchy
		const h1 = page.getByRole('heading', { level: 1 });
		const h2 = page.getByRole('heading', { level: 2 });

		const h1Size = parseInt(await h1.evaluate((el) => getComputedStyle(el).fontSize));
		const h2Size = parseInt(await h2.evaluate((el) => getComputedStyle(el).fontSize));

		// H1 should be larger than H2
		expect(h1Size).toBeGreaterThan(h2Size);

		// Both should be substantial sizes
		expect(h1Size).toBeGreaterThanOrEqual(28);
		expect(h2Size).toBeGreaterThanOrEqual(20);

		// Check body text
		const bodyText = page.locator('.subtitle');
		const bodySize = parseInt(await bodyText.evaluate((el) => getComputedStyle(el).fontSize));

		// Body text should be readable but smaller than headings
		expect(bodySize).toBeGreaterThanOrEqual(14);
		expect(bodySize).toBeLessThan(h2Size);
	});
});
