# ING Mortgage Calculator Frontend POC

A proof-of-concept frontend application for a mortgage calculator, inspired by [ING's official mortgage calculator](https://www.ing.nl/en/personal/mortgage/mortgage-calculator). This project demonstrates modern web development practices using Svelte and serves as a testing ground for GitHub Copilot agent mode techniques.

## 🎯 Project Purpose & Scope

This POC aims to:
- Create a modern, accessible mortgage calculator frontend
- Match ING's visual design and user experience
- Implement best practices for Svelte development
- Demonstrate test-driven development (TDD) with comprehensive testing
- Serve as a reference for GitHub Copilot agent mode optimization

### Key Features (Planned)
- Interactive mortgage calculation with real-time updates
- Responsive design matching ING's style guidelines
- Accessibility-first approach (WCAG 2.1 AA compliance)
- Progressive web app capabilities
- Multi-language support (EN/NL)

## 🛠️ Tech Stack

- **Frontend Framework**: [Svelte](https://svelte.dev/) with [SvelteKit](https://kit.svelte.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Unit Testing**: [Vitest](https://vitest.dev/)
- **E2E Testing**: [Playwright](https://playwright.dev/)
- **Styling**: CSS with Svelte scoped styles
- **Type Safety**: TypeScript
- **Package Manager**: npm

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ltpitt/github-copilot-agent-mode-frontend-poc.git
   cd github-copilot-agent-mode-frontend-poc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run check
```

## 🧪 Testing Strategy

This project follows a comprehensive testing approach:

- **Unit Tests**: Business logic, utility functions, and component behavior
- **Integration Tests**: Component interactions and data flow
- **E2E Tests**: Complete user journeys and critical paths
- **Accessibility Tests**: Automated a11y testing with Playwright
- **Visual Regression Tests**: Screenshot comparisons for UI consistency

### Running Tests

```bash
# Run all tests with coverage
npm run test:coverage

# Run specific test file
npm run test mortgage-calculator.test.js

# Debug tests in browser
npm run test:ui
```

## 🎨 Design Guidelines

### Visual Reference
- **Primary Reference**: [ING Mortgage Calculator](https://www.ing.nl/en/personal/mortgage/mortgage-calculator)
- **Color Palette**: ING Orange (#FF6200), complementary blues and grays
- **Typography**: Clean, modern fonts with excellent readability
- **Layout**: Card-based design with clear visual hierarchy

### Accessibility Standards
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes
- Touch-friendly interface (44px minimum touch targets)

## 📦 Deployment Instructions

### Production Build
```bash
# Build the application
npm run build

# Preview the build locally
npm run preview
```

### Deployment Options

1. **Static Hosting** (Recommended for POC)
   - Netlify, Vercel, or GitHub Pages
   - Upload the `dist` folder contents

2. **Node.js Hosting**
   - Use the SvelteKit adapter for your platform
   - Deploy the built application with SSR support

3. **Docker**
   ```bash
   # Build Docker image
   docker build -t mortgage-calculator .
   
   # Run container
   docker run -p 3000:3000 mortgage-calculator
   ```

### Environment Variables

Create a `.env` file for configuration:
```bash
# API endpoints (if needed)
VITE_API_BASE_URL=https://api.example.com

# Feature flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

## 📁 Project Structure

```
├── .github/
│   └── copilot.yml          # GitHub Copilot instructions
├── docs/                    # Design references and documentation
├── src/
│   ├── lib/
│   │   ├── components/      # Reusable UI components
│   │   ├── stores/          # Svelte stores for state management
│   │   ├── utils/           # Utility functions and helpers
│   │   └── types/           # TypeScript type definitions
│   ├── routes/              # SvelteKit routes and pages
│   ├── tests/               # Test files
│   └── app.html             # HTML template
├── static/                  # Static assets
├── tests/                   # E2E tests
├── package.json
├── vite.config.js
├── playwright.config.js
└── README.md
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow the coding guidelines** in `.github/copilot.yml`
4. **Write tests** for new functionality
5. **Commit with conventional format**: `feat: add mortgage calculation logic`
6. **Push to your branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Quality Standards
- All tests must pass
- Code coverage should not decrease
- Follow Svelte best practices
- Ensure accessibility compliance
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Resources

- [ING Mortgage Calculator](https://www.ing.nl/en/personal/mortgage/mortgage-calculator) - Design reference
- [Svelte Documentation](https://svelte.dev/docs)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 📊 Project Status

This is a proof-of-concept project in early development. See [CHANGELOG.md](CHANGELOG.md) for version history and planned features.
