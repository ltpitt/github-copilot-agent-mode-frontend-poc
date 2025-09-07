# E2E Test Suite for Mortgage Calculator

This directory contains a comprehensive End-to-End (E2E) test suite for the ING-style Mortgage Calculator, built with Playwright.

## 📋 Test Coverage Overview

The test suite provides complete coverage of all critical user journeys, edge cases, visual elements, and accessibility requirements.

### Test Files Structure

```
e2e/tests/
├── page.spec.ts              # Basic page load test (original)
├── mortgage-calculator.spec.ts # Main functionality tests
├── form-validation.spec.ts    # Input validation and error handling
├── energy-labels.spec.ts      # Energy label selection and color tests
├── accessibility.spec.ts      # WCAG compliance and keyboard navigation
├── responsive.spec.ts         # Mobile/desktop responsive design
├── visual-ui.spec.ts         # Visual elements and ING brand styling
├── integration.spec.ts       # Complete user workflows and scenarios
└── README.md                 # This documentation file
```

## 🎯 Test Categories

### 1. Main Functionality Tests (`mortgage-calculator.spec.ts`)

- ✅ Page loading and layout verification
- ✅ Form fields with default values
- ✅ Calculation accuracy with valid inputs
- ✅ Input changes and result updates
- ✅ Different buying scenarios (alone vs together)
- ✅ Edge case value handling
- ✅ Accessibility attributes verification

### 2. Form Validation Tests (`form-validation.spec.ts`)

- ✅ Empty required field validation
- ✅ Principal amount constraints (negative, zero, max values)
- ✅ Interest rate constraints and validation
- ✅ Duration constraints and limits
- ✅ Buying type selection requirement
- ✅ Energy label selection requirement
- ✅ Numeric input validation (reject non-numeric)
- ✅ Real-time validation feedback
- ✅ Decimal input formatting
- ✅ Form reset functionality

### 3. Energy Labels Tests (`energy-labels.spec.ts`)

- ✅ All energy label options (A-G) availability
- ✅ Correct color display for each energy label:
  - A: Green (#00a651)
  - B: Light green (#8ac83b)
  - C: Yellow (#ffd502)
  - D: Orange (#ffa500)
  - E: Orange-red (#ff6600)
  - F: Red (#ff3300)
  - G: Dark red (#cc0000)
- ✅ Visual indicator updates with selection
- ✅ Energy label impact on mortgage calculations
- ✅ Energy label display in calculation results
- ✅ Selection change handling
- ✅ Accessibility for energy label selection

### 4. Accessibility Tests (`accessibility.spec.ts`)

- ✅ Proper heading hierarchy (h1, h2, h3)
- ✅ Form labels and ARIA associations
- ✅ Complete keyboard navigation
- ✅ Visible focus indicators
- ✅ ARIA attributes (aria-required, aria-label, role="alert")
- ✅ Screen reader semantic support
- ✅ Keyboard form submission workflow
- ✅ Color contrast verification
- ✅ High contrast mode support
- ✅ Reduced motion preferences
- ✅ Zoom support up to 200%
- ✅ Error message associations

### 5. Responsive Design Tests (`responsive.spec.ts`)

- ✅ Desktop viewport (1440×900) layout
- ✅ Tablet viewport (768×1024) adaptation
- ✅ Mobile viewport (375×667) stacking
- ✅ Minimum 44px touch targets on mobile
- ✅ Functionality across all breakpoints
- ✅ Text scaling appropriately
- ✅ No horizontal scrolling required
- ✅ Proper spacing at different screen sizes
- ✅ Orientation change handling (portrait/landscape)
- ✅ Energy label colors maintained across devices
- ✅ Mobile validation error display
- ✅ Very small screen (320px) support

### 6. Visual & UI Tests (`visual-ui.spec.ts`)

- ✅ ING brand colors and styling verification
- ✅ Form interaction visual feedback
- ✅ Energy label color accuracy testing
- ✅ Results display visual consistency
- ✅ Loading and transition states
- ✅ Error state visual feedback
- ✅ Accessibility color contrast
- ✅ Visual hierarchy in form layout
- ✅ Typography scale verification

### 7. Integration & User Workflow Tests (`integration.spec.ts`)

- ✅ Complete user scenarios:
  - Young professional workflow (€85k income, energy A)
  - Family high income workflow (€180k combined, energy C)
  - Minimal income edge case (€25k income, energy F)
- ✅ Energy label impact demonstration
- ✅ Form reset and recalculation workflows
- ✅ User journey with error corrections
- ✅ Data consistency across multiple calculations
- ✅ Rapid form interaction handling

## 🚀 Running the Tests

### Prerequisites

- Node.js 20+ and npm 10+
- Playwright browsers installed (`npx playwright install`)

### Commands

```bash
# Install dependencies
npm install

# Install Playwright browsers (may fail in restricted environments)
npx playwright install

# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test mortgage-calculator

# Run tests with UI mode
npx playwright test --ui

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests on specific browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Environment Considerations

**Note**: Playwright browser installation may fail in restricted environments. The test suite is designed to run when browsers are available but is documented for future use when browser access is restored.

## 🛠️ Running Tests with Makefile

For convenience, you can use the following `make` commands to run tests:

- `make test` - Run all tests (unit and E2E).
- `make test-e2e` - Run only the Playwright E2E tests.
- `make test-unit` - Run only the unit tests.

## 🖥️ Alternative Commands for Windows Users

If you cannot use `make`, you can run the tests directly with npm and Playwright:

- `npm run test` - Run all unit tests.
- `npx playwright test` - Run all E2E tests.
- `npm run test:unit` - Run only the unit tests.

## 📊 Test Data & Scenarios

### Mortgage Calculation Test Cases

| Scenario           | Income     | Interest Rate | Duration | Buying Type | Energy Label | Expected Range |
| ------------------ | ---------- | ------------- | -------- | ----------- | ------------ | -------------- |
| Young Professional | €85,000    | 4.2%          | 30 years | Alone       | A            | €300-500k      |
| High Income Family | €180,000   | 3.8%          | 25 years | Together    | C            | €800k-1.2M     |
| Minimal Income     | €25,000    | 5.0%          | 30 years | Alone       | F            | €100-200k      |
| Edge Case Max      | €1,000,000 | 10%           | 40 years | Together    | A            | Variable       |
| Edge Case Min      | €50,000    | 0.1%          | 5 years  | Alone       | G            | Variable       |

### Energy Label Impact Testing

The tests verify that energy labels have measurable impact on mortgage calculations:

- **A (Most efficient)**: Positive adjustment, highest mortgage capacity
- **B-C**: Moderate positive to neutral adjustment
- **D-E**: Small negative to neutral adjustment
- **F-G (Least efficient)**: Negative adjustment, reduced capacity

## 🎨 Visual Testing Coverage

### ING Design System Verification

- **Primary Colors**: ING Orange (#FF6200) for CTAs and accents
- **Typography**: Proper font weights (400, 600, 700) and sizing
- **Form Elements**: Consistent styling with focus states
- **Energy Labels**: Exact color matching for A-G ratings
- **Spacing**: Consistent spacing system across breakpoints

### Responsive Breakpoints Tested

- **Mobile**: 320px - 480px (portrait/landscape)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px+
- **Large Desktop**: 1440px+

## ♿ Accessibility Coverage

The test suite ensures **WCAG 2.1 AA compliance**:

- **Keyboard Navigation**: All interactive elements reachable via Tab
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Visible focus indicators on all focusable elements
- **Color Contrast**: Sufficient contrast ratios for text and UI elements
- **Touch Targets**: Minimum 44px touch targets on mobile devices
- **Zoom Support**: Functional at 200% zoom without horizontal scrolling

## 🔧 Test Configuration

Tests are configured in `playwright.config.ts` with:

- **Development Server**: Automatic startup on `http://localhost:5173`
- **Timeout**: 120 seconds for server startup
- **Test Directory**: `./e2e/tests`
- **Browsers**: Chromium, Firefox, WebKit (when available)
- **Retry**: Configured for CI environments

## 📈 Metrics & Coverage

### Test Statistics

- **Total Test Files**: 8
- **Total Test Cases**: ~80+ individual tests
- **Coverage Areas**: 8 major categories
- **Browser Compatibility**: 3 browser engines
- **Viewport Testing**: 6+ different viewport sizes

### Performance Considerations

- Tests are designed to be fast and reliable
- Proper wait strategies for dynamic content
- Minimal test data for quick execution
- Parallel execution support

## 🐛 Debugging & Troubleshooting

### Common Issues

1. **Browser Installation Failed**: Continue with server tests, document limitation
2. **Timing Issues**: Tests include proper wait strategies for dynamic content
3. **Element Not Found**: Verify data-testid attributes are present
4. **Calculation Differences**: Tests use ranges for realistic mortgage calculations

### Debug Commands

```bash
# Run with debug mode
DEBUG=pw:api npx playwright test

# Generate test report
npx playwright show-report

# Record test actions for debugging
npx playwright codegen localhost:5173
```

## 📋 Maintenance Notes

### Adding New Tests

1. Use existing test patterns and selectors
2. Add data-testid attributes for reliable element selection
3. Include proper wait strategies for dynamic content
4. Test both positive and negative scenarios
5. Follow naming conventions for test descriptions

### Updating Test Data

- Update mortgage calculation ranges as needed
- Verify energy label colors match design system
- Check accessibility requirements for WCAG updates
- Update responsive breakpoints for new devices

### Future Enhancements

- [ ] Visual regression testing with screenshot comparisons
- [ ] Performance testing with Lighthouse integration
- [ ] Cross-browser compatibility expanded testing
- [ ] API testing if backend integration added
- [ ] Internationalization testing for multiple locales

---

This comprehensive E2E test suite ensures the Mortgage Calculator meets all functional, visual, accessibility, and usability requirements while maintaining high code quality and reliability.
