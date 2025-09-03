# Testing Guide

## Overview

This project uses Vitest with two test environments:

- **Server tests**: Run in Node.js environment (always available)
- **Browser tests**: Run in Playwright browser environment (requires browser installation)

## Test Configuration

The `vite.config.ts` file automatically detects whether Playwright browsers are installed and configures the test projects accordingly:

### When browsers are available:
- Runs both server tests (73 tests) and browser tests (1 test)
- Total: 74 tests

### When browsers are not available:
- Runs only server tests (73 tests)
- Displays clear message: `[Vitest Config] Playwright browsers not available - skipping browser tests`

## Running Tests

### Standard Test Commands

```bash
# Run all available tests (auto-detects browser availability)
npm run test

# Run only server tests (always works)
npx vitest run --project server

# Run specific test files
npx vitest run tests/mortgageCalculator.spec.ts
```

### Browser Setup (Optional)

To enable browser tests, install Playwright browsers:

```bash
npx playwright install
```

**Note**: Browser installation may fail in restricted environments (CI/CD, containers). This is expected and the tests will gracefully fall back to server-only mode.

## Test Structure

- `src/**/*.{test,spec}.{js,ts}` - Server-side tests
- `src/**/*.svelte.{test,spec}.{js,ts}` - Browser-side component tests
- `tests/**/*.{test,spec}.{js,ts}` - Additional server-side tests

## Troubleshooting

### "Playwright browsers not available"
This is normal in restricted environments. The tests will run in server-only mode.

### Browser installation fails
Run server tests only:
```bash
npx vitest run --project server
```

### TypeScript errors in vite.config.ts
Make sure `@types/node` is installed:
```bash
npm install --save-dev @types/node
```