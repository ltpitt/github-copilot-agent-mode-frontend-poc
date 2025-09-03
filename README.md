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

### Installation

Dependencies are already installed. If you need to reinstall them:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

### Code Quality

Format code:

```bash
npm run format
```

Lint code:

```bash
npm run lint
```

Type check:

```bash
npm run check
```

## 🧪 Testing Strategy

This project follows a comprehensive testing approach:

- **Unit Tests**: Business logic and utility functions (working)
- **Component Tests**: Svelte component behavior (requires Playwright)
- **Integration Tests**: User workflows and data flow
- **Accessibility Tests**: Automated a11y validation

### Running Tests

```bash
# Run all tests (automatically detects browser availability)
npm run test

# Run unit tests in watch mode
npm run test:unit

# Run server-side tests only (no browser required)
npm run test:server

# Run browser tests only (requires Playwright browsers)
npm run test:browser
```

**Note:** Browser tests require Playwright browsers to be installed:

```bash
# Install Playwright browsers for browser testing
npx playwright install --with-deps
```

The test runner automatically detects if Playwright browsers are available and gracefully falls back to server-side tests only when browsers are not installed.

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
