import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:5173',
		reuseExistingServer: true, // Always reuse existing server
		timeout: 120 * 1000
	},
	testDir: './e2e/tests',
	use: {
		// Use system browser instead of downloaded Playwright browsers
		channel: 'chrome', // Use system Chrome/Chromium
		headless: true
	},
	projects: [
		{
			name: 'chromium',
			use: {
				channel: 'chrome'
			}
		}
	]
});
