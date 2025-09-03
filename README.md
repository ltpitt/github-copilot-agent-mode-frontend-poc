# GitHub Copilot Agent Mode Frontend POC

This repository is a **Proof of Concept (POC)** for testing techniques to use GitHub Copilot Agent Mode at its best. The goal is to build a **mortgage calculator** in a quick and solid way, leveraging the power of GitHub Copilot Agent Mode for rapid development.

## 🎯 Project Purpose & Scope

This POC aims to:

- Create a modern, accessible mortgage calculator frontend
- Demonstrate rapid development with GitHub Copilot Agent Mode
- Implement best practices for Svelte development
- Showcase test-driven development (TDD) with comprehensive testing
- Serve as a reference for GitHub Copilot agent mode optimization

### Key Features

- Interactive mortgage calculation with real-time updates
- Responsive design with clean visual hierarchy
- Accessibility-first approach (WCAG 2.1 AA compliance)
- TypeScript for type safety
- Modern testing setup with Vitest and Playwright

## 🛠️ Tech Stack

- **Svelte 5** - Modern reactive framework with runes system
- **SvelteKit** - Full-stack Svelte framework
- **Vite** - Fast build tool and development server
- **TypeScript** - Type safety and enhanced developer experience
- **Vitest** - Unit testing framework
- **Playwright** - Browser testing (optional)
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (verified with v20.19.4)
- npm 10+ (verified with v10.8.2)

### Quick Start with Makefile

This project includes a convenient Makefile for common development tasks:

```bash
# See all available commands
make help

# Install dependencies
make install

# Start development server
make run

# Run tests
make test

# Build for production
make build
```

### Installation

```bash
# Using Makefile (recommended)
make install

# Or using npm directly
npm install
```

### Development

```bash
# Using Makefile (recommended)
make run

# Or using npm directly
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building

```bash
# Using Makefile (recommended)
make build

# Or using npm directly
npm run build
```

You can preview the production build with `make preview` or `npm run preview`.

## 🌐 Live Demo

The mortgage calculator is deployed and available at:
**https://ltpitt.github.io/github-copilot-agent-mode-frontend-poc/**

### Deployment

This application is automatically deployed to GitHub Pages using GitHub Actions. The deployment happens automatically when changes are pushed to the `main` branch.

#### Manual Deployment

To deploy manually or set up GitHub Pages for a fork:

1. **Enable GitHub Pages** in your repository settings:
   - Go to `Settings` → `Pages`
   - Select `GitHub Actions` as the source

2. **Push to main branch** - The deployment workflow will run automatically

3. **Access your site** at `https://[username].github.io/[repository-name]/`

#### Deployment Configuration

The project uses:

- **@sveltejs/adapter-static** for static site generation
- **GitHub Actions workflow** (`.github/workflows/deploy.yml`) for CI/CD
- **Base path configuration** for GitHub Pages subpath deployment
- **Prerendering** enabled for all routes

#### Build Configuration

Key configuration for GitHub Pages deployment:

```javascript
// svelte.config.js
adapter: adapter({
  pages: 'build',
  assets: 'build',
  fallback: undefined,
  precompress: false,
  strict: true
}),
paths: {
  base: process.env.NODE_ENV === 'production'
    ? '/github-copilot-agent-mode-frontend-poc'
    : ''
}
```

### Code Quality

```bash
# Using Makefile (recommended)
make format    # Format code
make lint      # Check code style and run linting
make check     # Run TypeScript type checking

# Or using npm directly
npm run format # Format code
npm run lint   # Lint code
npm run check  # Type check
```

## 🧪 Testing Strategy

This project follows a comprehensive testing approach:

- **Unit Tests**: Business logic and utility functions (working)
- **Component Tests**: Svelte component behavior (requires Playwright)
- **Integration Tests**: User workflows and data flow
- **Accessibility Tests**: Automated a11y validation

### Running Tests

```bash
# Using Makefile (recommended)
make test           # Run all tests (automatically detects browser availability)
make test-server    # Run server-side tests only (no browser required)
make test-browser   # Run browser tests only (requires Playwright browsers)

# Or using npm directly
npm run test        # Run all tests (automatically detects browser availability)
npm run test:unit   # Run unit tests in watch mode
npm run test:server # Run server-side tests only (no browser required)
npm run test:browser # Run browser tests only (requires Playwright browsers)
```

**Note:** Browser tests require Playwright browsers to be installed:

```bash
# Using Makefile (recommended)
make install-browsers

# Or using npm directly
npx playwright install --with-deps
```

The test runner automatically detects if Playwright browsers are available and gracefully falls back to server-side tests only when browsers are not installed.

## 🛠️ Makefile Commands

This project includes a comprehensive Makefile that provides convenient shortcuts for all development tasks. The Makefile follows best practices and includes a helpful command reference.

### Quick Reference

```bash
make help           # Show all available commands with descriptions
make install        # Install all dependencies
make run            # Start development server
make test           # Run all tests
make build          # Build for production
```

### All Available Commands

- **Setup & Installation:**
  - `make install` - Install all dependencies
  - `make install-browsers` - Install Playwright browsers for browser testing

- **Development:**
  - `make run` / `make dev` - Start development server
  - `make build` - Build for production
  - `make preview` - Preview production build locally
  - `make dev-setup` - Full development setup

- **Testing:**
  - `make test` - Run all tests (requires Playwright browsers for full suite)
  - `make test-server` - Run server-side tests only (no browser required)
  - `make test-browser` - Run browser tests only (requires Playwright browsers)

- **Code Quality:**
  - `make lint` - Check code style and run linting
  - `make format` - Format code with Prettier
  - `make check` - Run TypeScript type checking

- **Maintenance:**
  - `make clean` - Clean build artifacts and node_modules
  - `make ci` - Run CI pipeline (lint, check, build, test-server)
  - `make audit` - Run npm audit for security vulnerabilities

### Why Use the Makefile?

1. **Simplified Commands** - Shorter, memorable commands (`make run` vs `npm run dev`)
2. **Consistency** - Same commands work across different projects
3. **Documentation** - Built-in help system with `make help`
4. **Best Practices** - Follows standard Makefile conventions
5. **Error Handling** - Better error messages and status indicators
6. **Workflow Shortcuts** - Combined commands like `make ci` for complete CI pipeline

## 🎨 Design Guidelines

### Visual Reference

- **Color Scheme**: ING Orange (#FF6200) primary, complementary blues/grays
- **Layout**: Card-based design with clear visual hierarchy
- **Typography**: Clean, modern, accessible fonts

### Accessibility Standards

- WCAG 2.1 AA compliance required
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- Minimum 44px touch targets for mobile
- High contrast color ratios

## 📁 Project Structure

```
Repository root:
├── .github/
│   ├── copilot.yml          # Legacy Copilot config
│   └── copilot-instructions.md  # Comprehensive agent instructions
├── docs/                    # Design references and documentation
├── src/
│   ├── lib/
│   │   ├── assets/         # Static assets (favicon, images)
│   │   ├── mortgageCalculator.ts  # Core calculation logic
│   │   └── index.ts        # Library exports
│   ├── routes/
│   │   ├── +layout.svelte  # App layout component
│   │   └── +page.svelte    # Main mortgage calculator page
│   ├── app.d.ts           # TypeScript app definitions
│   └── app.html           # HTML template
├── tests/                 # Test files
├── static/                # Static files served at root
├── Makefile              # Development task automation
├── package.json           # Dependencies and scripts
├── svelte.config.js       # SvelteKit configuration
├── vite.config.ts         # Vite configuration with Vitest
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## About GitHub Copilot Agent Mode

This project serves as a testing ground for exploring the capabilities and best practices of GitHub Copilot Agent Mode in frontend development scenarios.

For detailed instructions on working with this codebase using GitHub Copilot, see [.github/copilot-instructions.md](.github/copilot-instructions.md).

## 📄 License

This project is licensed under the MIT License.
