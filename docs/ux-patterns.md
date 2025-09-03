# User Experience Patterns

This document outlines the UX patterns and interaction guidelines for the ING Mortgage Calculator Frontend POC, based on analysis of ING's official calculator and modern UX best practices.

## 🎯 Core User Journey

### Primary User Flow

1. **Landing** - User arrives at the calculator
2. **Input** - User enters mortgage parameters
3. **Calculate** - Real-time calculation updates
4. **Review** - User reviews results and options
5. **Action** - User proceeds to next steps or adjustments

### Key User Goals

- **Quick Estimation** - Get a rough mortgage calculation quickly
- **Detailed Analysis** - Understand different scenarios and options
- **Comparison** - Compare different mortgage terms and rates
- **Next Steps** - Understand how to proceed with an application

## 📋 Form Design Patterns

### Progressive Disclosure

```
Step 1: Basic Information
├── Purchase price / Property value
├── Down payment amount
└── Continue button

Step 2: Loan Details
├── Loan term (years)
├── Interest rate type
├── Additional costs
└── Calculate button

Step 3: Results & Options
├── Monthly payment display
├── Total cost breakdown
├── Different scenarios
└── Contact/Apply buttons
```

### Input Validation Strategy

- **Real-time validation** for immediate feedback
- **Non-blocking validation** - don't prevent users from continuing
- **Helpful error messages** with clear solutions
- **Success indicators** for completed fields

### Form Field Types

```typescript
// Currency inputs
<CurrencyInput
  label="Purchase Price"
  value={purchasePrice}
  min={50000}
  max={2000000}
  required
  placeholder="€ 300,000"
/>

// Percentage inputs
<PercentageInput
  label="Interest Rate"
  value={interestRate}
  min={0.1}
  max={10}
  step={0.1}
  suffix="%"
/>

// Duration inputs
<DurationInput
  label="Loan Term"
  value={loanTerm}
  options={[10, 15, 20, 25, 30]}
  suffix="years"
/>
```

## 🧮 Calculation Patterns

### Real-time Updates

- **Debounced calculations** (300ms delay) to avoid excessive processing
- **Visual feedback** during calculation (loading states)
- **Smooth transitions** between different results
- **Highlighting changes** when inputs are modified

### Results Display

```
Monthly Payment: € 1,234
├── Principal: € 987
├── Interest: € 234
└── Additional costs: € 13

Total Loan Cost: € 444,240
├── Total interest: € 144,240
├── Principal: € 300,000
└── Additional fees: € TBD
```

### Scenario Comparison

- **Side-by-side comparison** of different scenarios
- **What-if analysis** with slider controls
- **Impact visualization** showing cost differences
- **Recommended options** based on user inputs

## 🎨 Visual Feedback Patterns

### Loading States

```typescript
// Skeleton loading for calculation results
<div class="skeleton-loader">
  <div class="skeleton-line w-full h-8"></div>
  <div class="skeleton-line w-3/4 h-6"></div>
  <div class="skeleton-line w-1/2 h-6"></div>
</div>

// Progress indicators for multi-step forms
<ProgressBar
  currentStep={2}
  totalSteps={4}
  labels={['Basic Info', 'Loan Details', 'Results', 'Options']}
/>
```

### Success/Error States

- **Green checkmarks** for successful inputs
- **Red error icons** with descriptive text
- **Warning indicators** for unusual values
- **Info tooltips** for complex terms

### Interactive Elements

- **Hover effects** on all clickable elements
- **Focus states** clearly visible for keyboard users
- **Active states** for pressed buttons
- **Disabled states** with clear visual indication

## 📱 Mobile UX Patterns

### Touch-Friendly Design

- **44px minimum** touch target size
- **Generous spacing** between interactive elements
- **Swipe gestures** for form navigation
- **Pull-to-refresh** for recalculating

### Mobile-Specific Features

```typescript
// Large number inputs with custom keyboard
<NumberInput
  type="currency"
  inputMode="decimal"
  pattern="[0-9]*"
  placeholder="Enter amount"
/>

// Mobile-optimized dropdowns
<Select
  options={loanTermOptions}
  mobileFullScreen={true}
  searchable={false}
/>
```

### Progressive Enhancement

- **Core functionality** works without JavaScript
- **Enhanced interactions** with JavaScript enabled
- **Offline capability** for basic calculations
- **App-like experience** with service workers

## 🎭 Micro-Interactions

### Calculation Updates

```css
.result-update {
	animation: highlightChange 0.5s ease-in-out;
}

@keyframes highlightChange {
	0% {
		background-color: rgba(255, 98, 0, 0.2);
	}
	100% {
		background-color: transparent;
	}
}
```

### Form Interactions

- **Field focus** with subtle border animation
- **Input value changes** with smooth number counting
- **Form submission** with loading spinner
- **Error appearance** with shake animation

### Page Transitions

- **Smooth scrolling** to results section
- **Fade transitions** between form steps
- **Slide animations** for comparison views
- **Bounce effects** for important notifications

## 🔍 Search and Discovery

### Input Assistance

- **Autocomplete suggestions** for common values
- **Recent calculations** saved in localStorage
- **Preset scenarios** for quick testing
- **Smart defaults** based on market data

### Help and Guidance

```typescript
// Contextual tooltips
<Tooltip
  content="The interest rate depends on your creditworthiness and market conditions"
  position="top"
>
  <InfoIcon />
</Tooltip>

// Progressive help system
<HelpSystem
  steps={[
    'Enter your purchase price',
    'Add your down payment',
    'Choose loan terms',
    'Review your results'
  ]}
  currentStep={currentFormStep}
/>
```

## 📊 Data Visualization

### Chart Types

- **Pie charts** for payment breakdown
- **Bar charts** for scenario comparison
- **Line graphs** for payment over time
- **Donut charts** for loan composition

### Interactive Elements

```typescript
// Hover states on chart elements
<PieChart
  data={paymentBreakdown}
  onHover={(segment) => showTooltip(segment)}
  colors={['#FF6200', '#0066CC', '#CCCCCC']}
/>

// Responsive chart sizing
<ResponsiveChart
  minHeight={200}
  maxHeight={400}
  aspectRatio={16/9}
/>
```

## ♿ Accessibility Patterns

### Keyboard Navigation

- **Tab order** follows visual flow
- **Skip links** for main content
- **Escape key** closes modals/dropdowns
- **Arrow keys** for slider controls

### Screen Reader Support

```html
<!-- Descriptive labels and instructions -->
<label for="purchase-price">
	Purchase Price
	<span class="sr-only">(Enter the total price of the property)</span>
</label>

<!-- Live regions for dynamic updates -->
<div aria-live="polite" aria-atomic="true">Monthly payment: €1,234</div>

<!-- Progress announcements -->
<div aria-live="assertive" class="sr-only">Step 2 of 4 completed</div>
```

### Visual Accessibility

- **High contrast mode** support
- **Reduced motion** preferences respected
- **Large text** scaling support
- **Color-blind friendly** palette

## 🎯 Conversion Optimization

### Call-to-Action Placement

- **Primary CTA** prominently displayed
- **Secondary actions** clearly differentiated
- **Next steps** obvious and compelling
- **Trust indicators** near action buttons

### Form Optimization

- **Minimal required fields** to reduce friction
- **Optional fields** clearly marked
- **Progress indication** for multi-step forms
- **Save progress** functionality for longer forms

### Trust Building

- **Security indicators** for data protection
- **Privacy statements** easily accessible
- **Expert recommendations** highlighted
- **Social proof** if available

## 📈 Performance Patterns

### Optimization Strategies

- **Lazy loading** for non-critical content
- **Code splitting** by route/feature
- **Image optimization** with WebP/AVIF
- **Critical CSS** inlined

### Loading Priorities

1. **Core calculation logic** - highest priority
2. **Basic form elements** - high priority
3. **Visual enhancements** - medium priority
4. **Analytics/tracking** - lowest priority
