# GitHub Copilot Agent Mode Frontend POC

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

This repository is a **Proof of Concept (POC)** for testing techniques to use GitHub Copilot Agent Mode at its best. The codebase is a **mortgage calculator** built with SvelteKit and TypeScript, designed to showcase rapid development with modern web technologies.

## Tech Stack

- **Svelte 5** - Modern reactive framework
- **SvelteKit** - Full-stack Svelte framework
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety and enhanced developer experience
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Working Effectively

### Bootstrap and Setup

- Dependencies are pre-installed via `package-lock.json`
- If you need to reinstall: `npm install` -- takes 25 seconds. NEVER CANCEL.
- Always run `npm run format` after making code changes to ensure consistent formatting

### Development Workflow

- Start development: `npm run dev` -- ready in 1 second. NEVER CANCEL the dev server.
- Application runs at: `http://localhost:5173/`
- Type checking: `npm run check` -- takes 3 seconds
- Code linting: `npm run lint` -- takes 3 seconds (includes Prettier and ESLint)
- Code formatting: `npm run format` -- takes under 1 second

### Building and Testing

- Production build: `npm run build` -- takes 4 seconds. NEVER CANCEL.
- Preview production build: `npm run preview` -- starts immediately at `http://localhost:4173/`
- Build creates optimized bundles in `.svelte-kit/output/`

## Validation

### Manual Testing Requirements

ALWAYS manually test the mortgage calculator functionality after making changes:

1. **Start the application**: `npm run dev`
2. **Navigate to**: `http://localhost:5173/`
3. **Test mortgage calculation**:
   - Verify default values load: $300,000 loan, 3.5% rate, 30 years
   - Expected monthly payment: $1,347.13
   - Change loan amount to $500,000 and verify calculation updates
   - Change interest rate to 4.0% and verify calculation updates
   - Change loan term to 15 years and verify calculation updates

### Validation Commands

ALWAYS run these commands before completing any work:

- `npm run check` -- Type checking (3 seconds)
- `npm run lint` -- Code quality (3 seconds)
- `npm run build` -- Production build (4 seconds)

These commands MUST pass or the work is incomplete.

## Code Structure

### Key Directories

- `src/routes/` - SvelteKit pages and layouts
- `src/lib/` - Reusable components and utilities
- `src/lib/assets/` - Static assets (favicon, images)
- `static/` - Public static files

### Important Files

- `src/routes/+page.svelte` - Main mortgage calculator page
- `src/lib/MortgageCalculator.svelte` - Core calculator component
- `src/routes/+layout.svelte` - Application layout with favicon
- `package.json` - Dependencies and scripts
- `svelte.config.js` - SvelteKit configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration

### Component Architecture

The mortgage calculator uses Svelte 5's new runes system:

- `$state()` for reactive variables
- `$derived()` for computed values
- Always use TypeScript for type safety

## Common Tasks

### Adding New Components

1. Create component in `src/lib/ComponentName.svelte`
2. Export from `src/lib/index.ts` if needed
3. Import and use in pages or other components
4. Always run `npm run check` to verify TypeScript

### Styling

- Component-scoped CSS using `<style>` blocks
- Uses CSS custom properties and modern CSS features
- Primary brand color: `#ff3e00` (Svelte orange)

### Dependencies

- All development dependencies are in `devDependencies`
- No runtime dependencies (static build)
- Update dependencies carefully and test thoroughly

## Build Times and Expectations

- **npm install**: 25 seconds - NEVER CANCEL
- **npm run dev**: 1 second startup - NEVER CANCEL the dev server
- **npm run build**: 4 seconds - NEVER CANCEL
- **npm run check**: 3 seconds
- **npm run lint**: 3 seconds
- **npm run format**: Under 1 second

## Troubleshooting

### Common Issues

- **Build fails with missing favicon**: Ensure `src/lib/assets/favicon.svg` exists
- **TypeScript errors**: Run `npm run check` and fix type issues
- **Linting failures**: Run `npm run format` then `npm run lint`
- **Dev server port conflict**: Change port with `npm run dev -- --port 3000`

### Known Limitations

- Uses `@sveltejs/adapter-auto` which requires deployment platform detection
- No test framework currently configured
- No CI/CD pipeline beyond basic GitHub workflows

## Project Structure Reference

```
Repository root:
├── .github/
│   └── copilot-instructions.md
├── src/
│   ├── routes/
│   │   ├── +layout.svelte
│   │   └── +page.svelte
│   ├── lib/
│   │   ├── assets/
│   │   │   └── favicon.svg
│   │   ├── MortgageCalculator.svelte
│   │   └── index.ts
│   ├── app.d.ts
│   └── app.html
├── static/
│   └── robots.txt
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── .gitignore
└── README.md
```
