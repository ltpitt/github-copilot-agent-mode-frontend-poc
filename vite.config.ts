import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { existsSync, readdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

// Check if Playwright browsers are installed
function hasBrowsersInstalled(): boolean {
	try {
		const playwrightCacheDir = join(homedir(), '.cache', 'ms-playwright');

		// Check for any chromium installation
		if (existsSync(playwrightCacheDir)) {
			const dirs = readdirSync(playwrightCacheDir);
			const chromiumDirs = dirs.filter((dir: string) => dir.includes('chromium'));

			// Check if any chromium directory has the actual executable
			for (const chromiumDir of chromiumDirs) {
				const chromiumPath = join(playwrightCacheDir, chromiumDir);
				try {
					const chromiumContents = readdirSync(chromiumPath);
					// Look for chrome-linux directory
					if (chromiumContents.includes('chrome-linux')) {
						const chromeLinuxPath = join(chromiumPath, 'chrome-linux');
						const chromeLinuxContents = readdirSync(chromeLinuxPath);
						// Check for headless_shell executable or chrome executable
						if (
							chromeLinuxContents.includes('headless_shell') ||
							chromeLinuxContents.includes('chrome')
						) {
							return true;
						}
					}
				} catch {
					// Continue checking other directories if one fails
					continue;
				}
			}
		}
		return false;
	} catch {
		return false;
	}
}

const browsersAvailable = hasBrowsersInstalled();

// Log browser availability for debugging
console.log(
	`[Vitest Config] Playwright browsers ${browsersAvailable ? 'detected' : 'not available'} - ${browsersAvailable ? 'including' : 'skipping'} browser tests`
);

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		expect: { requireAssertions: true },
		projects: [
			// Only include browser tests if browsers are installed
			...(browsersAvailable
				? [
						{
							extends: './vite.config.ts',
							test: {
								name: 'client',
								environment: 'browser',
								browser: {
									enabled: true,
									provider: 'playwright',
									instances: [{ browser: 'chromium' }]
								},
								include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
								exclude: ['src/lib/server/**'],
								setupFiles: ['./vitest-setup-client.ts']
							}
						}
					]
				: []),
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
