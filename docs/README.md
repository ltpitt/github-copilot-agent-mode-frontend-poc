# Design Reference Documentation

This folder contains design references, UX guidelines, and visual documentation for the ING Mortgage Calculator Frontend POC.

## 📁 Contents

- **design-system.md** - ING design system analysis and implementation guidelines
- **ux-patterns.md** - User experience patterns and interaction guidelines
- **accessibility.md** - Accessibility requirements and testing guidelines
- **responsive-design.md** - Responsive design breakpoints and patterns

## 🎨 Design Resources

### ING Visual Identity
- **Primary Reference**: [ING Mortgage Calculator](https://www.ing.nl/en/personal/mortgage/mortgage-calculator)
- **ING Brand Guidelines**: [ING Corporate Website](https://www.ing.com/)
- **Color Palette**: ING Orange (#FF6200), supporting blues and grays
- **Typography**: Modern, accessible font choices

### Design System Components
- Form elements and input controls
- Button styles and interactive states
- Card layouts and information hierarchy
- Navigation patterns
- Error and success messaging
- Loading states and progress indicators

## 🔍 Analysis Notes

### Current ING Calculator Observations
1. **Clean, minimalist design** with plenty of white space
2. **Progressive disclosure** - information revealed step by step
3. **Clear visual hierarchy** with prominent call-to-action buttons
4. **Responsive layout** that works well on mobile and desktop
5. **Accessible form controls** with proper labeling
6. **Real-time calculation updates** with smooth transitions

### Key UX Patterns to Implement
- Step-by-step form progression
- Input validation with helpful error messages
- Results displayed in easy-to-understand format
- Comparison tools for different scenarios
- Clear next steps and call-to-action buttons

## 📱 Device Considerations

### Mobile-First Approach
- Touch-friendly interface elements (44px minimum)
- Simplified navigation for small screens
- Optimized input methods for mobile keyboards
- Swipe gestures for form progression

### Desktop Enhancements
- Advanced filtering and comparison tools
- Detailed breakdown views
- Keyboard shortcuts for power users
- Multi-column layouts for information density

## 🎯 Implementation Priorities

1. **Core Functionality** - Basic mortgage calculation
2. **Visual Alignment** - Match ING's look and feel
3. **Accessibility** - WCAG 2.1 AA compliance
4. **Responsive Design** - Mobile and desktop optimization
5. **Performance** - Fast loading and smooth interactions
6. **Progressive Enhancement** - Works without JavaScript

## 📝 Notes for Developers

- Use semantic HTML elements for better accessibility
- Implement proper focus management for keyboard users
- Consider users with visual impairments when choosing colors
- Test with screen readers and accessibility tools
- Optimize images and assets for fast loading
- Use progressive enhancement for advanced features