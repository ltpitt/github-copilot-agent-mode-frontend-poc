# ING Mortgage Calculator Frontend POC - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Project Overview

This is a SvelteKit TypeScript application serving as a proof-of-concept for an ING mortgage calculator frontend. The project uses modern web development practices with comprehensive testing and follows ING's design patterns.

## Working Effectively

### Prerequisites & Environment Setup

- Requires Node.js 20+ and npm 10+ (verified: Node v20.19.4, npm v10.8.2)
- Uses SvelteKit with Vite as the build tool
- TypeScript for type safety
- Vitest for unit testing, Playwright for browser testing

### Bootstrap, Build, and Test the Repository

**CRITICAL: NEVER CANCEL any build or test commands. All commands below have been validated and timed.**

1. **Install Dependencies**

   ```bash
   npm install
   ```

   - Duration: 10 seconds (NEVER CANCEL - set timeout to 30+ seconds)
   - Runs `svelte-kit sync` automatically via prepare script
   - May show low severity audit warnings (normal)

2. **Build for Production**

   ```bash
   npm run build
   ```

   - Duration: 3.5 seconds (NEVER CANCEL - set timeout to 15+ seconds)
   - Creates `.svelte-kit/output/` directory with client and server builds
   - Warns about adapter-auto detection (normal for POC)

3. **Development Server**

   ```bash
   npm run dev
   ```

   - Starts on http://localhost:5173
   - Hot reload enabled
   - Duration: 1 second startup (NEVER CANCEL - set timeout to 10+ seconds)

4. **Production Preview**

   ```bash
   npm run preview
   ```

   - Starts on http://localhost:4173
   - Must run `npm run build` first
   - Duration: instant startup (NEVER CANCEL - set timeout to 10+ seconds)

5. **Type Checking**

   ```bash
   npm run check
   ```

   - Duration: 3.1 seconds (NEVER CANCEL - set timeout to 15+ seconds)
   - Runs svelte-check with TypeScript validation

6. **Linting**

   ```bash
   npm run lint
   ```

   - Duration: 3.6 seconds (NEVER CANCEL - set timeout to 15+ seconds)
   - Runs Prettier format check and ESLint
   - Must pass for CI compliance

7. **Code Formatting**

   ```bash
   npm run format
   ```

   - Duration: 1 second (NEVER CANCEL - set timeout to 10+ seconds)
   - Auto-fixes formatting with Prettier

8. **Unit Tests (Server-side)**

   ```bash
   npx vitest run --project server
   ```

   - Duration: 1.8 seconds (NEVER CANCEL - set timeout to 15+ seconds)
   - Runs server-side tests without browser dependency
   - Tests basic math/utility functions

### Browser Testing Setup (CRITICAL)

**IMPORTANT:** Full test suite requires Playwright browser installation:

```bash
npx playwright install
```

- **KNOWN ISSUE:** Browser download may fail in restricted environments
- If download fails, document the limitation but continue with server tests
- Duration: 10+ minutes when successful (NEVER CANCEL - set timeout to 20+ minutes)

**Full Test Suite (after Playwright setup):**

```bash
npm run test
```

- Runs both server and browser tests
- Duration: 3 seconds when working (NEVER CANCEL - set timeout to 30+ seconds)
- **Falls back to server tests only if browser setup fails**

## Manual Validation Scenarios

**ALWAYS perform these validation steps after making changes:**

1. **Basic Application Functionality**
   - Start dev server: `npm run dev`
   - Navigate to http://localhost:5173
   - Verify "Welcome to SvelteKit" page loads
   - Check browser console for errors
   - Test responsive design (mobile/desktop views)

2. **Production Build Validation**
   - Run: `npm run build && npm run preview`
   - Navigate to http://localhost:4173
   - Verify same functionality as dev server
   - Test performance and loading speed

3. **Code Quality Validation**
   - Run: `npm run lint` (must pass)
   - Run: `npm run format` (auto-fixes issues)
   - Run: `npm run check` (TypeScript validation)
   - All must complete successfully before committing

## Key Projects and Code Structure

### Repository Structure

```
├── .github/
│   ├── copilot.yml          # Legacy Copilot config (use this file instead)
│   └── copilot-instructions.md  # This file
├── docs/                    # Design references and documentation
│   ├── README.md           # Design system overview
│   ├── accessibility.md    # WCAG compliance guidelines
│   ├── design-system.md    # ING design patterns
│   └── ux-patterns.md      # User experience guidelines
├── src/
│   ├── lib/
│   │   ├── assets/         # Static assets
│   │   └── index.ts        # Library exports
│   ├── routes/
│   │   ├── +layout.svelte  # App layout component
│   │   ├── +page.svelte    # Home page (basic SvelteKit welcome)
│   │   └── page.svelte.spec.ts  # Page component tests (browser)
│   ├── app.d.ts           # TypeScript app definitions
│   ├── app.html           # HTML template
│   ├── demo.spec.ts       # Demo unit tests (server)
│   └── example.spec.ts    # Example utility tests (server)
├── static/                # Static files served at root
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration with Vitest
├── svelte.config.js       # SvelteKit configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

### Important Configuration Files

**vite.config.ts:** Configures both Vite build and Vitest testing with dual projects:

- `client` project: Browser tests using Playwright
- `server` project: Node.js unit tests

**package.json Scripts:**

- `dev` - Development server
- `build` - Production build
- `preview` - Preview production build
- `test` - Run all tests
- `test:unit` - Run tests in watch mode
- `lint` - Check code formatting and linting
- `format` - Auto-fix code formatting
- `check` - TypeScript validation

## Design Alignment Requirements

### ING Visual Reference

- **Primary Reference:** https://www.ing.nl/en/personal/mortgage/mortgage-calculator
- **Color Scheme:** ING Orange (#FF6200) primary, complementary blues/grays
- **Layout:** Card-based design with clear visual hierarchy
- **Typography:** Clean, modern, accessible fonts

### Accessibility Standards

- **WCAG 2.1 AA compliance required**
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- Minimum 44px touch targets for mobile
- High contrast color ratios

### Testing Strategy

- **Unit Tests:** Business logic and utility functions (working)
- **Component Tests:** Svelte component behavior (requires Playwright)
- **Integration Tests:** User workflows and data flow
- **Accessibility Tests:** Automated a11y validation
- **Visual Regression:** Screenshot comparisons (future)

## Common Development Tasks

### Adding New Components

1. Create in `src/lib/components/`
2. Export from `src/lib/index.ts`
3. Write tests alongside component files
4. Follow Svelte best practices and TypeScript typing

### Development Workflow

1. **Always run** `npm run lint` and `npm run check` before committing
2. **Always test** changes with `npm run dev` and manual validation
3. **Always verify** production build with `npm run build && npm run preview`
4. **Run server tests** with `npx vitest run --project server`

### Svelte-Specific Guidelines

- Use reactive statements (`$:`) for computed values
- Leverage Svelte stores for shared state management
- Keep components small and focused
- Use proper lifecycle methods (onMount, onDestroy)
- Follow PascalCase for components, camelCase for variables

## Troubleshooting

### Common Issues

- **Playwright download fails:** Continue with server tests only, document limitation
- **Type errors:** Run `npm run check` for detailed TypeScript diagnostics
- **Build failures:** Check for ESLint/Prettier issues with `npm run lint`
- **Tests failing:** Verify Playwright installation and browser availability

### Performance Considerations

- Build size currently ~70kB (reasonable for POC)
- Dev server starts in ~1 second
- Production build completes in ~3.5 seconds
- All commands are fast - longer times indicate issues

## CI/CD Expectations

**Before Committing:**

- [ ] `npm run lint` passes
- [ ] `npm run check` passes
- [ ] `npm run build` succeeds
- [ ] Manual validation completed
- [ ] Server tests pass

**Expected CI Pipeline:**

- Install dependencies
- Run linting and type checking
- Build application
- Run test suite (may skip browser tests in restricted environments)

Remember: This POC prioritizes development velocity and comprehensive documentation over complex features. Focus on clean, maintainable code that follows established patterns.
