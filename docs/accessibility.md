# Accessibility Guidelines

This document outlines accessibility requirements and testing guidelines for the ING Mortgage Calculator Frontend POC to ensure WCAG 2.1 AA compliance and inclusive design.

## 🎯 Accessibility Standards

### WCAG 2.1 AA Compliance

Our target is **WCAG 2.1 Level AA** compliance, which includes:

- **Level A** criteria (basic accessibility)
- **Level AA** criteria (standard accessibility)
- Selected **Level AAA** criteria where feasible

### Legal Requirements

- **European Accessibility Act** compliance
- **Dutch accessibility standards** (EN 301 549)
- **Section 508** compliance (if targeting US market)

## 🔍 Testing Strategy

### Automated Testing

```typescript
// Playwright accessibility tests
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('mortgage calculator accessibility', async ({ page }) => {
	await page.goto('/calculator');

	const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

	expect(accessibilityScanResults.violations).toEqual([]);
});

// Component-level testing
import { render } from '@testing-library/svelte';
import { axe, toHaveNoViolations } from 'jest-axe';

test('Calculator component is accessible', async () => {
	const { container } = render(Calculator);
	const results = await axe(container);
	expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

- [ ] **Keyboard navigation** - all interactive elements reachable
- [ ] **Screen reader** testing with NVDA, JAWS, VoiceOver
- [ ] **Voice control** compatibility (Dragon NaturallySpeaking)
- [ ] **High contrast mode** functionality
- [ ] **Zoom to 200%** without horizontal scrolling
- [ ] **Color blindness** simulation testing

### Testing Tools

- **axe DevTools** - Browser extension for automated scanning
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Built-in Chrome accessibility audit
- **Color Oracle** - Color blindness simulator
- **Stark** - Figma/Sketch accessibility plugin

## ⌨️ Keyboard Navigation

### Tab Order Requirements

```html
<!-- Logical tab order following visual flow -->
<form>
	<input type="text" tabindex="1" aria-label="Purchase Price" />
	<input type="text" tabindex="2" aria-label="Down Payment" />
	<button type="submit" tabindex="3">Calculate</button>
	<button type="button" tabindex="4">Reset</button>
</form>
```

### Keyboard Shortcuts

```typescript
// Global keyboard shortcuts
const keyboardShortcuts = {
  'Alt + C': 'Focus calculator form',
  'Alt + R': 'View results',
  'Alt + H': 'Open help',
  'Escape': 'Close modal/dropdown',
  'Enter': 'Submit form/activate button',
  'Space': 'Toggle checkbox/activate button'
};

// Custom slider navigation
<Slider
  onKeyDown={(e) => {
    switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        decreaseValue();
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        increaseValue();
        break;
      case 'Home':
        setToMinimum();
        break;
      case 'End':
        setToMaximum();
        break;
    }
  }}
/>
```

### Focus Management

- **Visible focus indicators** on all interactive elements
- **Focus trapping** in modals and dropdowns
- **Focus restoration** after modal close
- **Skip links** for main content areas

## 🔊 Screen Reader Support

### Semantic HTML Structure

```html
<!-- Proper heading hierarchy -->
<h1>Mortgage Calculator</h1>
  <h2>Loan Details</h2>
    <h3>Payment Information</h3>
    <h3>Terms and Conditions</h3>
  <h2>Results</h2>
    <h3>Monthly Payments</h3>
    <h3>Total Cost</h3>

<!-- Landmark regions -->
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
</header>
<main role="main">
  <section aria-labelledby="calculator-heading">
    <h2 id="calculator-heading">Calculator</h2>
  </section>
</main>
<footer role="contentinfo">
```

### ARIA Labels and Descriptions

```html
<!-- Form labels and descriptions -->
<label for="purchase-price">Purchase Price</label>
<input
	id="purchase-price"
	type="text"
	aria-describedby="purchase-price-help"
	aria-required="true"
/>
<div id="purchase-price-help">Enter the total purchase price of the property</div>

<!-- Complex widgets -->
<div
	role="slider"
	aria-label="Interest Rate"
	aria-valuenow="3.5"
	aria-valuemin="0.1"
	aria-valuemax="10"
	aria-valuetext="3.5 percent"
	tabindex="0"
>
	<!-- Live regions for dynamic updates -->
	<div aria-live="polite" aria-atomic="true">
		<span class="sr-only">Monthly payment updated:</span>
		€1,234 per month
	</div>
</div>
```

### Screen Reader Testing Scripts

```typescript
// Test with different screen readers
const screenReaderTests = {
	nvda: [
		'Navigate through form using Tab key',
		'Read form labels and instructions',
		'Announce calculation results',
		'Navigate data tables with arrows'
	],
	jaws: [
		'Test virtual cursor navigation',
		'Verify heading navigation (H key)',
		'Test form mode interactions',
		'Verify list navigation'
	],
	voiceover: [
		'Test rotor navigation',
		'Verify gesture interactions',
		'Test custom control announcements',
		'Verify dynamic content updates'
	]
};
```

## 🎨 Visual Accessibility

### Color Contrast Requirements

```css
/* WCAG AA contrast ratios */
:root {
	/* Normal text: 4.5:1 minimum */
	--text-on-light: #333333; /* 12.6:1 ratio */
	--text-on-dark: #ffffff; /* 21:1 ratio */

	/* Large text: 3:1 minimum */
	--large-text-light: #666666; /* 7:1 ratio */

	/* Non-text elements: 3:1 minimum */
	--border-color: #767676; /* 3:1 ratio */
	--focus-outline: #0066cc; /* 4.5:1 ratio */
}

/* High contrast mode support */
@media (prefers-contrast: high) {
	:root {
		--text-color: #000000;
		--background-color: #ffffff;
		--border-color: #000000;
		--link-color: #0000ee;
	}
}
```

### Color Independence

- **Never rely on color alone** to convey information
- **Use icons + color** for status indicators
- **Pattern/texture alternatives** for charts
- **Text labels** for all visual distinctions

```html
<!-- Good: Color + icon + text -->
<div class="status success">
	<CheckIcon aria-hidden="true" />
	<span class="status-text">Valid</span>
</div>

<!-- Bad: Color only -->
<div class="status success">Valid</div>
```

### Responsive Text Scaling

```css
/* Support up to 200% zoom */
.container {
	max-width: 100%;
	overflow-x: auto;
}

/* Relative units for scalability */
.text {
	font-size: 1rem; /* 16px base */
	line-height: 1.5;
	padding: 0.5rem 1rem;
}

/* Minimum touch targets */
.button {
	min-height: 44px;
	min-width: 44px;
	padding: 0.75rem 1rem;
}
```

## 🎭 Motion and Animation

### Reduced Motion Support

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
	* {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}

/* Essential animations only */
@media (prefers-reduced-motion: no-preference) {
	.result-update {
		transition: background-color 0.3s ease;
	}

	.modal-enter {
		animation: slideIn 0.2s ease-out;
	}
}
```

### Safe Animation Guidelines

- **No flashing content** faster than 3 times per second
- **Parallax effects** with reduced motion alternatives
- **Auto-playing content** with user controls
- **Infinite loops** with pause controls

## 📱 Mobile Accessibility

### Touch Target Sizing

```css
/* Minimum 44px touch targets */
.touch-target {
	min-height: 44px;
	min-width: 44px;
	padding: 12px;
}

/* Adequate spacing between targets */
.button-group .button {
	margin: 8px;
}
```

### Mobile Screen Reader Support

- **VoiceOver (iOS)** gesture testing
- **TalkBack (Android)** navigation verification
- **Voice Access** compatibility
- **Switch Control** support

### Mobile-Specific Features

```html
<!-- Prevent zoom on input focus -->
<input type="text" style="font-size: 16px;" />

<!-- Proper input types for mobile keyboards -->
<input type="tel" inputmode="numeric" pattern="[0-9]*" />
<input type="email" inputmode="email" />
<input type="url" inputmode="url" />
```

## 🧪 Testing Implementation

### Continuous Integration Tests

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Tests
on: [push, pull_request]

jobs:
  a11y-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Run accessibility tests
        run: npm run test:a11y

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: accessibility-report
          path: accessibility-report.html
```

### Component Testing Template

```typescript
// src/lib/components/__tests__/Button.a11y.test.ts
import { render, fireEvent } from '@testing-library/svelte';
import { axe } from 'jest-axe';
import Button from '../Button.svelte';

describe('Button Accessibility', () => {
	test('has no accessibility violations', async () => {
		const { container } = render(Button, {
			props: { children: 'Click me' }
		});

		const results = await axe(container);
		expect(results).toHaveNoViolations();
	});

	test('is keyboard accessible', async () => {
		const { getByRole } = render(Button, {
			props: { children: 'Click me' }
		});

		const button = getByRole('button');

		// Should be focusable
		button.focus();
		expect(document.activeElement).toBe(button);

		// Should activate with Enter and Space
		await fireEvent.keyDown(button, { key: 'Enter' });
		await fireEvent.keyDown(button, { key: ' ' });
	});

	test('has proper ARIA attributes', () => {
		const { getByRole } = render(Button, {
			props: {
				children: 'Submit',
				'aria-describedby': 'submit-help',
				disabled: true
			}
		});

		const button = getByRole('button');
		expect(button).toHaveAttribute('aria-describedby', 'submit-help');
		expect(button).toHaveAttribute('aria-disabled', 'true');
	});
});
```

## 📋 Accessibility Checklist

### Pre-Development

- [ ] **Design review** for accessibility considerations
- [ ] **Color contrast** verification in designs
- [ ] **Keyboard navigation** flow planning
- [ ] **Screen reader** content structure planning

### During Development

- [ ] **Semantic HTML** usage
- [ ] **ARIA labels** implementation
- [ ] **Keyboard event** handling
- [ ] **Focus management** implementation
- [ ] **Automated testing** setup

### Post-Development

- [ ] **Manual testing** with keyboard only
- [ ] **Screen reader** testing (multiple tools)
- [ ] **Color contrast** verification
- [ ] **Zoom testing** up to 200%
- [ ] **Mobile accessibility** verification

### Before Release

- [ ] **Full accessibility audit** completed
- [ ] **User testing** with disabled users
- [ ] **Accessibility statement** updated
- [ ] **Documentation** for accessibility features

## 📖 Resources and References

### WCAG Guidelines

- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM WCAG Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

### Testing Tools

- [axe-core](https://github.com/dequelabs/axe-core) - Automated accessibility testing
- [Pa11y](https://pa11y.org/) - Command line accessibility tester
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Continuous accessibility monitoring

### Learning Resources

- [WebAIM](https://webaim.org/) - Web accessibility training
- [Deque University](https://dequeuniversity.com/) - Accessibility courses
- [A11y Slack Community](https://web-a11y.slack.com/) - Community support
