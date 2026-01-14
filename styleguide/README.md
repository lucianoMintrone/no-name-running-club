# NNRC Style Guide - Setup Instructions

This directory contains the complete style guide for the No Name Running Club application.

## 📁 Files Included

- **STYLE_GUIDE.md** - Complete style guide documentation
- **design-tokens.css** - CSS custom properties for all design tokens
- **tailwind.config.example.ts** - Tailwind CSS configuration
- **component-examples.tsx** - React component examples
- **README.md** - This file

## 🚀 Quick Start

### 1. Import Design Tokens

Add the design tokens to your global CSS file:

```css
/* In your app/globals.css or equivalent */
@import './design-tokens.css';
```

Or copy the variables directly into your existing global styles.

### 2. Update Tailwind Config

Replace or merge the contents of `tailwind.config.example.ts` with your existing `tailwind.config.ts`:

```bash
# Copy the example file
cp tailwind.config.example.ts tailwind.config.ts
```

Or manually merge the theme extensions into your existing config.

### 3. Install Required Dependencies

Make sure you have the necessary dependencies:

```bash
# Heroicons for icons
npm install @heroicons/react

# Inter font (if not already included)
# Add to your layout.tsx or _app.tsx
```

### 4. Add Inter Font

In your root layout or app component:

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
```

### 5. Copy Logo Assets

Place your logo files in the appropriate directory:

```bash
# Copy SVG files to public directory
public/
  logos/
    square-patch.svg     # Your Square_Patch.svg
    runner-mascot.svg    # Your Group_46.svg
```

## 📖 Usage

### Using CSS Variables

```css
.my-component {
  background-color: var(--nnrc-purple-primary);
  color: var(--nnrc-white);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

### Using Tailwind Classes

```tsx
<div className="bg-nnrc-purple text-white p-4 rounded-lg">
  Hello NNRC
</div>
```

### Using Component Examples

Copy components from `component-examples.tsx` into your project:

```tsx
import { PrimaryButton, ChallengeCard } from '@/components/ui';

export default function MyPage() {
  return (
    <ChallengeCard title="Winter Challenge" progress={5} total={30}>
      <PrimaryButton onClick={() => console.log('Log run')}>
        Log Run
      </PrimaryButton>
    </ChallengeCard>
  );
}
```

## 🎨 Color Reference

### Primary Colors
- `--nnrc-purple-primary` / `bg-nnrc-purple` - #A999C6
- `--nnrc-lavender-primary` / `bg-nnrc-lavender` - #D2C1DD

### Temperature Scale
- `bg-nnrc-temp-extreme-cold` - Below 0°F (Blue)
- `bg-nnrc-temp-very-cold` - 0-15°F (Indigo)
- `bg-nnrc-temp-cold` - 15-30°F (Purple)
- `bg-nnrc-temp-cool` - 30-40°F (Light purple)
- `bg-nnrc-temp-mild` - Above 40°F (Lightest purple)

## 🧩 Component Patterns

### Button Sizes
```tsx
// Small
<button className="px-4 py-2 text-sm">Small Button</button>

// Medium (default)
<button className="px-6 py-3 text-base">Medium Button</button>

// Large
<button className="px-8 py-4 text-lg">Large Button</button>
```

### Card Variants
```tsx
// Standard card
<div className="bg-white rounded-xl border-2 border-nnrc-lavender shadow-lg p-6">

// Widget card with gradient
<div className="bg-gradient-to-br from-nnrc-lavender-light to-white rounded-xl border border-nnrc-lavender p-5">
```

## ♿ Accessibility

All components should maintain:

- Minimum color contrast ratio of 4.5:1 (WCAG AA)
- Keyboard navigability
- Proper ARIA labels
- Focus states on interactive elements
- Alt text for images

### Testing Color Contrast

```bash
# Use this tool to verify contrast ratios
https://webaim.org/resources/contrastchecker/
```

## 📱 Responsive Design

The design system uses Tailwind's responsive breakpoints:

```tsx
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔄 Common Patterns

### Loading State
```tsx
{isLoading ? (
  <LoadingSkeleton className="h-32 w-full" />
) : (
  <YourComponent />
)}
```

### Error State
```tsx
{error && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-700">{error}</p>
  </div>
)}
```

### Empty State
```tsx
{items.length === 0 && (
  <div className="text-center py-12">
    <p className="text-gray-500">No runs logged yet</p>
    <PrimaryButton onClick={openModal}>Log Your First Run</PrimaryButton>
  </div>
)}
```

## 🎯 Best Practices

### DO ✅
- Use semantic HTML elements
- Maintain consistent spacing
- Use design tokens instead of hard-coded values
- Test on multiple screen sizes
- Include hover and focus states
- Provide loading states for async operations

### DON'T ❌
- Mix custom colors with brand colors inconsistently
- Override core spacing/sizing arbitrarily
- Forget mobile responsiveness
- Ignore accessibility guidelines
- Use inline styles when design tokens exist

## 📚 Further Reading

- [Complete Style Guide](./STYLE_GUIDE.md)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Heroicons](https://heroicons.com/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

When adding new components or patterns:

1. Follow existing naming conventions
2. Maintain consistency with the design system
3. Document new patterns in STYLE_GUIDE.md
4. Test across different screen sizes
5. Verify accessibility compliance

## 📞 Questions?

Refer to the main [STYLE_GUIDE.md](./STYLE_GUIDE.md) for comprehensive documentation.

---

*Style Guide Version 1.0 - January 2026*
