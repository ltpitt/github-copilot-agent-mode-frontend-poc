import { test, expect } from '@playwright/test';

test('should render h1 on the main page', async ({ page }) => {
	// Adjust the URL if your dev server runs on a different port
	await page.goto('http://localhost:5173');
	const heading = await page.getByRole('heading', { level: 1 });
	await expect(heading).toBeVisible();
});
