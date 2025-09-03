# GitHub Actions Workflows

This directory contains GitHub Actions workflows for continuous integration and code quality checking.

## Workflows

### CI Workflow (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Features:**

- Tests on Node.js versions 20 and 22
- Install dependencies with npm
- Lint code with Prettier and ESLint
- Run TypeScript type checking
- Build the project
- Run server-side tests (guaranteed to work)
- Attempt to install Playwright and run full test suite (continues on error)
- Upload build artifacts for successful builds

**Duration:** ~3-5 minutes per Node.js version

### Code Quality Workflow (`code-quality.yml`)

Focuses specifically on code quality checks.

**Features:**

- Code formatting verification with Prettier
- Linting with ESLint
- TypeScript type checking with svelte-check
- Security audit with npm audit
- Dependency freshness check with npm outdated
- Generate and upload code quality report

**Duration:** ~2-3 minutes

## Prerequisites for Pull Request Merge

Both workflows must pass successfully for pull request merges. Key requirements:

1. **Code Formatting**: All files must follow Prettier formatting rules
2. **Linting**: All ESLint rules must pass
3. **Type Safety**: TypeScript compilation must succeed without errors
4. **Build**: Project must build successfully
5. **Tests**: Server-side tests must pass (73 tests)

## Notes

- Browser-based tests require Playwright installation and may not work in all CI environments
- Security audit and dependency checks are non-blocking (continue-on-error: true)
- Build artifacts are preserved for 7 days, code quality reports for 30 days
- Timeouts are set based on empirical testing of command duration
