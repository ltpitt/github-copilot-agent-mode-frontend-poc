# ING Design System Analysis

This document analyzes ING's design system based on their official mortgage calculator and provides implementation guidelines for our POC.

## 🎨 Color Palette

### Primary Colors
- **ING Orange**: `#FF6200` - Primary brand color, use for CTAs and important elements
- **ING Orange Light**: `#FF7A1A` - Hover states and lighter accents
- **ING Orange Dark**: `#E55A00` - Active states and darker accents

### Supporting Colors
- **Dark Blue**: `#003366` - Headers, important text, navigation
- **Medium Blue**: `#0066CC` - Links, secondary actions
- **Light Blue**: `#E6F2FF` - Background highlights, info panels

### Neutral Colors
- **Charcoal**: `#333333` - Primary text color
- **Medium Gray**: `#666666` - Secondary text, labels
- **Light Gray**: `#F5F5F5` - Background areas, disabled states
- **Border Gray**: `#DDDDDD` - Borders, dividers
- **White**: `#FFFFFF` - Primary background

### Semantic Colors
- **Success Green**: `#00AA44` - Success messages, confirmations
- **Warning Orange**: `#FF9900` - Warnings, attention required
- **Error Red**: `#CC0000` - Error messages, validation failures
- **Info Blue**: `#0066CC` - Information messages, tooltips

## 📝 Typography

### Font Stack
```css
font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
```

### Font Sizes & Hierarchy
- **H1 Heading**: 32px (mobile), 40px (desktop) - Page titles
- **H2 Heading**: 28px (mobile), 32px (desktop) - Section headers
- **H3 Heading**: 24px (mobile), 28px (desktop) - Subsections
- **H4 Heading**: 20px (mobile), 24px (desktop) - Component titles
- **Body Large**: 18px - Important content, form labels
- **Body Regular**: 16px - Standard body text
- **Body Small**: 14px - Helper text, captions
- **Caption**: 12px - Fine print, disclaimers

### Font Weights
- **Regular**: 400 - Standard body text
- **Medium**: 500 - Form labels, navigation
- **Semi-Bold**: 600 - Headings, emphasis
- **Bold**: 700 - Important headings, CTAs

### Line Heights
- **Headings**: 1.2 - Tight line height for impact
- **Body Text**: 1.5 - Comfortable reading
- **Small Text**: 1.4 - Compact but readable

## 🔘 Button Styles

### Primary Button (CTA)
```css
background: #FF6200;
color: white;
border: none;
border-radius: 4px;
padding: 12px 24px;
font-weight: 600;
font-size: 16px;
transition: background 0.2s ease;

&:hover {
  background: #E55A00;
}

&:focus {
  outline: 2px solid #0066CC;
  outline-offset: 2px;
}
```

### Secondary Button
```css
background: transparent;
color: #FF6200;
border: 2px solid #FF6200;
border-radius: 4px;
padding: 10px 22px;
font-weight: 600;
font-size: 16px;

&:hover {
  background: #FF6200;
  color: white;
}
```

### Text Button
```css
background: transparent;
color: #0066CC;
border: none;
text-decoration: underline;
font-weight: 500;

&:hover {
  color: #004499;
}
```

## 📋 Form Elements

### Input Fields
```css
border: 2px solid #DDDDDD;
border-radius: 4px;
padding: 12px 16px;
font-size: 16px;
background: white;
transition: border-color 0.2s ease;

&:focus {
  border-color: #0066CC;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

&:invalid {
  border-color: #CC0000;
}
```

### Select Dropdowns
- Same styling as input fields
- Custom arrow icon in ING orange
- Proper focus states and keyboard navigation

### Checkboxes & Radio Buttons
- Custom styling to match brand colors
- Large enough touch targets (44px minimum)
- Clear visual feedback for checked states

## 🏗️ Layout Patterns

### Card Design
```css
background: white;
border-radius: 8px;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
padding: 24px;
margin-bottom: 16px;
```

### Container Widths
- **Mobile**: 100% with 16px padding
- **Tablet**: 768px max-width
- **Desktop**: 1200px max-width
- **Large Desktop**: 1400px max-width

### Grid System
- 12-column grid for desktop
- 4-column grid for mobile
- 16px gutters between columns

## 🎯 Interactive States

### Hover Effects
- Subtle color transitions (0.2s ease)
- Light box-shadow increases
- No dramatic size changes

### Focus States
- Blue outline (2px solid #0066CC)
- 2px offset for visibility
- Maintained for keyboard users

### Loading States
- ING orange spinner/progress bar
- Skeleton screens for content loading
- Disabled state with reduced opacity

## 📱 Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 480px) { /* Large mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1400px) { /* Large desktop */ }
```

## ♿ Accessibility Considerations

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- Important elements meet AAA standards (7:1 ratio)
- Color is never the only way to convey information

### Focus Management
- Logical tab order throughout the interface
- Visible focus indicators on all interactive elements
- Skip links for keyboard users

### Screen Reader Support
- Semantic HTML structure
- Proper ARIA labels and roles
- Descriptive alternative text for images

## 🔧 Implementation Notes

### CSS Custom Properties
```css
:root {
  --color-primary: #FF6200;
  --color-primary-dark: #E55A00;
  --color-text: #333333;
  --color-text-light: #666666;
  --color-border: #DDDDDD;
  --border-radius: 4px;
  --shadow-light: 0 2px 8px rgba(0, 0, 0, 0.1);
  --transition-fast: 0.2s ease;
}
```

### Svelte Component Structure
- Create base components for buttons, inputs, cards
- Use CSS custom properties for theming
- Implement proper TypeScript interfaces
- Include accessibility props by default