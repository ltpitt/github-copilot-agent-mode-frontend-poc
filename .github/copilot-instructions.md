# GitHub Copilot Agent Mode Frontend POC

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

This repository is a **Proof of Concept (POC)** for testing techniques to use GitHub Copilot Agent Mode at its best. The codebase is a **mortgage calculator** built with SvelteKit and TypeScript, designed to showcase rapid development with modern web technologies.

## Tech Stack

- **Svelte 5** - Modern reactive framework (with runes system)
- **SvelteKit** - Full-stack Svelte framework
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety and enhanced developer experience
- **Vitest** - Unit testing framework
- **Playwright** - Browser testing (optional)
- **ESLint** - Code linting
- **Prettier** - Code formatting

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

1. **Mortgage Calculator Testing**
   - Start dev server: `npm run dev`
   - Navigate to http://localhost:5173
   - Verify mortgage calculator loads with default values
   - Test calculation updates when changing loan amount, rate, or term
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

## Code Structure

### Key Directories

- `src/routes/` - SvelteKit pages and layouts
- `src/lib/` - Reusable components and utilities (with colocated tests)
- `src/lib/assets/` - Static assets (favicon, images)
- `static/` - Public static files
- `docs/` - Design references and documentation

### Important Files

- `src/routes/+page.svelte` - Main mortgage calculator page
- `src/lib/mortgageCalculator.ts` - Core calculation logic
- `src/routes/+layout.svelte` - Application layout with favicon
- `package.json` - Dependencies and scripts
- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Vite build configuration with Vitest
- `tsconfig.json` - TypeScript configuration

### Component Architecture

The mortgage calculator uses modern patterns:

- Utility functions for business logic (`src/lib/mortgageCalculator.ts`)
- Svelte 5 runes system: `$state()`, `$derived()` for reactive variables
- TypeScript for type safety throughout
- Component-based architecture with clear separation of concerns

## Design and Accessibility

### Visual Reference

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

## Common Development Tasks

### Adding New Components

1. Create component in `src/lib/` or `src/lib/components/`
2. Export from `src/lib/index.ts` if needed
3. Write tests alongside component files
4. Follow Svelte best practices and TypeScript typing
5. Always run `npm run check` to verify TypeScript

### Styling Guidelines

- Component-scoped CSS using `<style>` blocks
- Uses CSS custom properties and modern CSS features
- Primary brand color: `#FF6200` (ING Orange)
- Follow ING design system patterns

### Testing Strategy

- **Unit Tests:** Business logic and utility functions (colocated in src/lib/)
- **Component Tests:** Svelte component behavior (colocated with components, requires Playwright)
- **Integration Tests:** User workflows and data flow (as needed)
- **Server Tests:** Run with `npx vitest run --project server`
- **Test Colocation:** All tests are placed next to their corresponding source files

### Development Workflow

1. **Always run** `npm run lint` and `npm run check` before committing
2. **Always test** changes with `npm run dev` and manual validation
3. **Always verify** production build with `npm run build && npm run preview`
4. **Run server tests** with `npx vitest run --project server`

## Project Structure Reference

```
Repository root:
├── .github/
│   ├── copilot.yml          # Legacy Copilot config
│   └── copilot-instructions.md  # This file
├── docs/                    # Design references and documentation
│   ├── README.md           # Design system overview
│   ├── accessibility.md    # WCAG compliance guidelines
│   ├── design-system.md    # ING design patterns
│   └── ux-patterns.md      # User experience guidelines
├── src/
│   ├── lib/
│   │   ├── assets/         # Static assets (favicon, images)
│   │   ├── InputForm.svelte # Input form component
│   │   ├── InputForm.spec.ts # Tests for InputForm component
│   │   ├── ResultDisplay.svelte # Result display component
│   │   ├── ResultDisplay.spec.ts # Tests for ResultDisplay component
│   │   ├── MortgageCalculator.svelte # Main calculator component
│   │   ├── NumberInput.svelte # Number input component
│   │   ├── mortgageCalculator.ts # Core calculation logic
│   │   ├── mortgageCalculator.spec.ts # Tests for calculator logic
│   │   ├── validation.ts   # Validation utilities
│   │   ├── validation.spec.ts # Tests for validation logic
│   │   └── index.ts        # Library exports
│   ├── routes/
│   │   ├── +layout.svelte  # App layout component
│   │   ├── +page.svelte    # Main mortgage calculator page
│   │   ├── page.svelte.spec.ts  # Page component tests (browser)
│   │   └── demo/           # Demo pages
│   ├── components/         # Additional reusable components
│   ├── app.d.ts           # TypeScript app definitions
│   └── app.html           # HTML template
├── static/                # Static files served at root
│   └── robots.txt
├── package.json           # Dependencies and scripts
├── svelte.config.js       # SvelteKit configuration
├── vite.config.ts         # Vite configuration with Vitest
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
├── .prettierrc            # Prettier configuration
├── .prettierignore        # Prettier ignore patterns
├── .gitignore             # Git ignore patterns
└── README.md              # Project documentation
```

## Troubleshooting

### Common Issues

- **Playwright download fails:** Continue with server tests only, document limitation
- **Type errors:** Run `npm run check` for detailed TypeScript diagnostics
- **Build failures:** Check for ESLint/Prettier issues with `npm run lint`
- **Tests failing:** Verify Playwright installation and browser availability
- **Build fails with missing favicon**: Ensure `src/lib/assets/favicon.svg` exists
- **Dev server port conflict**: Change port with `npm run dev -- --port 3000`

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
- [ ] Server tests pass (`npx vitest run --project server`)

**Expected CI Pipeline:**

- Install dependencies
- Run linting and type checking
- Build application
- Run test suite (may skip browser tests in restricted environments)

Remember: This POC prioritizes development velocity and comprehensive documentation over complex features. Focus on clean, maintainable code that follows established patterns.
