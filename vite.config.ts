import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';

// Check if Playwright browsers are installed
function isPlaywrightInstalled(): boolean {
	try {
		// Try to check Playwright installation status
		try {
			// Check if browsers are actually available by using playwright list
			const output = execSync('npx playwright list', {
				encoding: 'utf-8',
				stdio: 'pipe',
				timeout: 5000
			});
			return output.includes('chromium');
		} catch {
			// Fallback to filesystem check
			const playwrightCache = join(homedir(), '.cache', 'ms-playwright');
			if (!existsSync(playwrightCache)) {
				return false;
			}

			// Look for actual browser executables
			const chromiumPaths = [
				join(playwrightCache, 'chromium-1187', 'chrome-linux', 'chrome'),
				join(playwrightCache, 'chromium_headless_shell-1187', 'chrome-linux', 'headless_shell')
			];

			return chromiumPaths.some((path) => existsSync(path));
		}
	} catch {
		return false;
	}
}

const browserTestsAvailable = isPlaywrightInstalled();

// Create test projects array - always include server tests
const testProjects: Array<{
	extends: string;
	test: {
		name: string;
		environment: string;
		include?: string[];
		exclude?: string[];
		browser?: Record<string, unknown>;
		setupFiles?: string[];
	};
}> = [
	{
		extends: './vite.config.ts',
		test: {
			name: 'server',
			environment: 'node',
			include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.{test,spec}.{js,ts}'],
			exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
		}
	}
];

// Only add browser tests if Playwright is properly installed
if (browserTestsAvailable) {
	testProjects.unshift({
		extends: './vite.config.ts',
		test: {
			name: 'client',
			environment: 'browser',
			browser: {
				enabled: true,
				provider: 'playwright',
				instances: [{ browser: 'chromium', headless: true }],
				// Add better error handling and cleanup
				api: {
					port: 63315
				}
			},
			include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
			exclude: ['src/lib/server/**'],
			setupFiles: ['./vitest-setup-client.ts']
		}
	});
} else {
	console.warn('⚠️  Playwright browsers not detected. Running server-side tests only.');
	console.warn('   To run browser tests, install browsers with: npx playwright install');
}

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		expect: { requireAssertions: true },
		projects: testProjects
	}
});
