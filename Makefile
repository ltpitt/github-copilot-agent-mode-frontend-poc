# E2E Testing
test-e2e: ## Run Playwright end-to-end (E2E) tests
	@echo "Running Playwright E2E tests..."
	npx playwright test
	@echo "✅ Playwright E2E tests completed"
# GitHub Copilot Agent Mode Frontend POC - Makefile
# This Makefile provides convenient shortcuts for common development tasks

.PHONY: help install run dev build preview test test-server test-browser lint format check clean

# Default target - show help
help: ## Show this help message
	@echo "GitHub Copilot Agent Mode Frontend POC - Available Commands:"
	@echo ""
	@echo "Setup & Installation:"
	@awk 'BEGIN {FS = ":.*?## "} /^install.*:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Development:"
	@awk 'BEGIN {FS = ":.*?## "} /^(run|dev|build|preview).*:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Testing:"
	@awk 'BEGIN {FS = ":.*?## "} /^test.*:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Code Quality:"
	@awk 'BEGIN {FS = ":.*?## "} /^(lint|format|check).*:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Maintenance:"
	@awk 'BEGIN {FS = ":.*?## "} /^clean.*:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Examples:"
	@echo "  make install    # Install all dependencies"
	@echo "  make run        # Start development server"
	@echo "  make test       # Run all tests"
	@echo "  make build      # Build for production"

# Setup & Installation
install: ## Install all dependencies
	@echo "Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed successfully"

# Development
run: ## Start development server (alias for dev)
	@echo "Starting development server..."
	npm run dev

dev: ## Start development server
	@echo "Starting development server..."
	npm run dev

build: ## Build for production
	@echo "Building for production..."
	npm run build
	@echo "✅ Production build completed"

preview: ## Preview production build locally
	@echo "Starting preview server..."
	npm run preview

# Testing
test: ## Run all tests (requires Playwright browsers for full suite)
	@echo "Running all tests..."
	npm run test:unit -- --run
	make test-e2e

test-server: ## Run server-side tests only (no browser required)
	@echo "Running server-side tests..."
	npm run test:server

test-browser: ## Run browser tests only (requires Playwright browsers)
	@echo "Running browser tests..."
	npm run test:browser

test-unit: ## Run unit tests only
	@echo "Running unit tests..."
	npm run test:unit -- --run

# Code Quality
lint: ## Check code style and run linting
	@echo "Checking code style and linting..."
	npm run lint
	@echo "✅ Linting completed"

format: ## Format code with Prettier
	@echo "Formatting code..."
	npm run format
	@echo "✅ Code formatted"

check: ## Run TypeScript type checking
	@echo "Running TypeScript checks..."
	npm run check
	@echo "✅ Type checking completed"

# Maintenance
clean: ## Clean build artifacts and node_modules
	@echo "Cleaning build artifacts..."
	rm -rf build/
	rm -rf .svelte-kit/
	rm -rf dist/
	@echo "Cleaning node_modules..."
	rm -rf node_modules/
	@echo "✅ Clean completed - run 'make install' to reinstall dependencies"

# Convenience shortcuts
ci: lint check build test-server ## Run CI pipeline (lint, check, build, test-server)
	@echo "✅ CI pipeline completed successfully"

dev-setup: install ## Full development setup
	@echo "✅ Development setup completed - run 'make run' to start"

# Advanced targets
install-browsers: ## Install Playwright browsers for browser testing
	@echo "Installing Playwright browsers..."
	npx playwright install --with-deps
	@echo "✅ Playwright browsers installed"

audit: ## Run npm audit for security vulnerabilities
	@echo "Running security audit..."
	npm audit