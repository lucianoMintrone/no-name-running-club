# No Name Running Club (NNRC) - Style Guide

## Table of Contents
1. [Brand Overview](#brand-overview)
2. [Logo Usage](#logo-usage)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [UI Components](#ui-components)
6. [Spacing & Layout](#spacing--layout)
7. [Iconography](#iconography)
8. [Animations & Interactions](#animations--interactions)
9. [Code Examples](#code-examples)

---

## Brand Overview

**No Name Running Club (NNRC)** is a modern fitness app designed for cold-weather running challenges. The brand celebrates perseverance, achievement, and the camaraderie of shared accomplishments through bold metrics and a clean, performance-focused interface.

### Brand Personality
- **Modern Athletic**: Clean, bold design inspired by Nike Run Club and Strava
- **Performance-Focused**: Large hero metrics that celebrate achievements
- **Approachable**: Welcoming to runners of all levels
- **Community-Driven**: Celebrating collective achievements

### Visual Identity
- **Modern indigo color palette** conveys energy and achievement
- **Shadow-based elevation** creates clean, modern depth
- **Bold typography** for metrics creates instant visual impact
- **Subtle micro-animations** add polish and delight

### Design Philosophy
The design follows modern fitness app conventions:
1. **Clean backgrounds** (#FAFAFA) with bold accent colors
2. **Shadow-based cards** instead of borders for clean elevation
3. **Large hero metrics** (48-60px font) that command attention
4. **Pill-shaped buttons** with gradient fills for CTAs
5. **Smooth transitions** (150ms ease-out) for responsive feel

---

## Logo Usage

### Primary Logo
**File**: `Square_Patch.svg`

The NNRC patch logo is the primary brand mark. It features:
- Vintage athletic lettering spelling "NNRC"
- Square patch format reminiscent of team uniforms
- Two-color design (primary purple and accent lavender)

#### Usage Guidelines
```tsx
// React component usage
<Image 
  src="/logos/square-patch.svg" 
  alt="No Name Running Club"
  width={120}
  height={120}
  className="nnrc-logo"
/>
```

**Minimum Size**: 60px × 60px  
**Clear Space**: Maintain space equal to the height of one letter around all sides  
**Backgrounds**: Works best on white, light gray, or dark backgrounds

### Secondary Mark (Mascot)
**File**: `Group_46.svg`

The runner mascot represents the spirit of the club:
- Used for decorative purposes, illustrations, and celebrations
- Can be used at various scales for visual interest
- Excellent for achievement badges and milestone markers

```tsx
// Mascot usage example
<Image 
  src="/logos/runner-mascot.svg" 
  alt="NNRC Runner"
  width={200}
  height={150}
  className="nnrc-mascot"
/>
```

### Logo Don'ts
- ❌ Don't stretch or distort the logo
- ❌ Don't change the colors
- ❌ Don't add effects (shadows, gradients, etc.)
- ❌ Don't place on busy backgrounds
- ❌ Don't rotate the logo

---

## Color Palette

### Primary Colors

#### Primary Indigo
```css
--nnrc-purple-primary: #6366F1;
```
- **RGB**: 99, 102, 241
- **Usage**: Primary buttons, key metrics, active states
- **Accessibility**: WCAG AAA compliant on white backgrounds

#### Primary Dark
```css
--nnrc-purple-dark: #4F46E5;
```
- **RGB**: 79, 70, 229
- **Usage**: Hover states, pressed buttons, emphasis text

#### Primary Light
```css
--nnrc-purple-light: #818CF8;
```
- **RGB**: 129, 140, 248
- **Usage**: Secondary elements, subtle highlights

### Background Colors

#### Surface Background
```css
--nnrc-lavender-primary: #F1F5F9;  /* Slate-100 */
```
- **Usage**: Page backgrounds, subtle containers

#### Surface Accent
```css
--nnrc-lavender-dark: #E2E8F0;  /* Slate-200 */
```
- **Usage**: Hover states on backgrounds, dividers

#### Surface Light
```css
--nnrc-lavender-light: #F8FAFC;  /* Slate-50 */
```
- **Usage**: Card backgrounds, elevated surfaces

### Neutral Colors

```css
--nnrc-white: #FFFFFF;
--nnrc-gray-50: #FAFAFA;    /* Page background */
--nnrc-gray-100: #F5F5F5;
--nnrc-gray-200: #E5E5E5;
--nnrc-gray-300: #D4D4D4;
--nnrc-gray-400: #A3A3A3;   /* Placeholder text */
--nnrc-gray-500: #737373;   /* Secondary text */
--nnrc-gray-600: #525252;   /* Body text */
--nnrc-gray-700: #404040;
--nnrc-gray-800: #262626;   /* Headings */
--nnrc-gray-900: #171717;   /* Primary text */
--nnrc-black: #0A0A0A;
```

### Semantic Colors

```css
--nnrc-success: #22C55E; /* Green for completed runs */
--nnrc-warning: #F59E0B; /* Amber for warnings */
--nnrc-error: #EF4444;   /* Red for errors */
--nnrc-info: #0EA5E9;    /* Sky blue for info */
```

### Temperature Gradient
For temperature-based visualizations (cold weather challenges):

```css
--nnrc-temp-extreme-cold: #0EA5E9;  /* Below 0°F - Sky Blue */
--nnrc-temp-very-cold: #3B82F6;     /* 0-15°F - Blue */
--nnrc-temp-cold: #6366F1;          /* 15-30°F - Indigo */
--nnrc-temp-cool: #8B5CF6;          /* 30-40°F - Violet */
--nnrc-temp-mild: #A78BFA;          /* Above 40°F - Light violet */
```

### Gradients

```css
/* Primary gradient for buttons and CTAs */
--gradient-primary: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
--gradient-primary-hover: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);

/* Surface gradients for cards */
--gradient-surface: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);

/* Hero gradient for special features */
--gradient-hero: linear-gradient(135deg, #6366F1 0%, #0EA5E9 100%);

/* Temperature gradients */
--gradient-cold: linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%);
--gradient-warm: linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%);
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        nnrc: {
          purple: {
            DEFAULT: '#6366F1',
            dark: '#4F46E5',
            light: '#818CF8',
            50: '#EEF2FF',
            100: '#E0E7FF',
          },
          lavender: {
            DEFAULT: '#F1F5F9',
            dark: '#E2E8F0',
            light: '#F8FAFC',
          },
          temp: {
            'extreme-cold': '#0EA5E9',
            'very-cold': '#3B82F6',
            'cold': '#6366F1',
            'cool': '#8B5CF6',
            'mild': '#A78BFA',
          },
        },
      },
    },
  },
};
```

---

## Typography

### Font Stack

#### Primary Font: Inter
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Inter is used for all body text, UI elements, and data displays. It provides excellent readability at all sizes.

#### Display Font: System
For headings and impactful text, use system font stack with increased weight:

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
font-weight: 700-900;
```

### Type Scale

```css
/* Headings */
--text-5xl: 3rem;      /* 48px - Hero headings */
--text-4xl: 2.25rem;   /* 36px - Page titles */
--text-3xl: 1.875rem;  /* 30px - Section titles */
--text-2xl: 1.5rem;    /* 24px - Card titles */
--text-xl: 1.25rem;    /* 20px - Subheadings */

/* Body */
--text-lg: 1.125rem;   /* 18px - Large body */
--text-base: 1rem;     /* 16px - Body text */
--text-sm: 0.875rem;   /* 14px - Small text */
--text-xs: 0.75rem;    /* 12px - Captions */
```

### Font Weights

```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### Usage Examples

```tsx
// Hero heading
<h1 className="text-5xl font-extrabold text-gray-900">
  Winter 2025/2026 Challenge
</h1>

// Section title
<h2 className="text-3xl font-bold text-nnrc-purple-dark">
  Your Progress
</h2>

// Card title
<h3 className="text-2xl font-semibold text-gray-800">
  Coldest Run
</h3>

// Body text
<p className="text-base font-normal text-gray-600">
  Track your runs and compete with the club
</p>

// Small caption
<span className="text-xs font-medium text-gray-500">
  Last updated 5 minutes ago
</span>
```

---

## UI Components

### Buttons

#### Primary Button (Gradient)
```tsx
<button className="
  px-6 py-3 
  bg-gradient-to-r from-nnrc-purple to-nnrc-purple-light
  text-white 
  rounded-xl 
  font-semibold
  hover:from-nnrc-purple-dark hover:to-nnrc-purple
  active:scale-[0.98]
  transition-all 
  duration-150
  shadow-md
  hover:shadow-lg
  hover:-translate-y-0.5
">
  Log Run
</button>
```

#### Secondary Button
```tsx
<button className="
  px-6 py-3 
  bg-white
  text-nnrc-purple 
  rounded-xl 
  font-semibold
  shadow-card
  hover:shadow-card-hover
  hover:-translate-y-0.5
  active:scale-[0.98]
  transition-all 
  duration-150
">
  View Leaderboard
</button>
```

#### Ghost Button
```tsx
<button className="
  px-6 py-3 
  bg-transparent 
  text-nnrc-purple 
  rounded-xl 
  font-semibold
  hover:bg-nnrc-purple/5
  active:scale-[0.98]
  transition-all 
  duration-150
">
  Cancel
</button>
```

### Cards

#### Modern Card (Shadow-based Elevation)
```tsx
<div className="
  bg-white 
  rounded-xl 
  shadow-card
  p-6
  hover:shadow-card-hover
  hover:-translate-y-1
  transition-all 
  duration-200
">
  <h3 className="text-2xl font-bold text-gray-900 mb-2">
    Winter 2025/2026 Challenge
  </h3>
  <p className="text-gray-500 mb-4">
    5 of 30 runs completed
  </p>
  {/* Card content */}
</div>
```

#### Hero Metric Card
```tsx
<div className="
  bg-white 
  rounded-xl 
  shadow-card
  p-6
  text-center
">
  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
    Coldest Run
  </span>
  <div className="text-hero font-black text-nnrc-purple mt-2">
    -12°F
  </div>
  <span className="text-sm text-gray-400 mt-1">
    January 5th, 2026
  </span>
</div>
```

#### Widget Card
```tsx
<div className="
  bg-gradient-to-br 
  from-white 
  to-slate-50
  rounded-xl 
  shadow-card
  p-5
  hover:shadow-card-hover
  transition-shadow 
  duration-200
">
  <h4 className="text-lg font-semibold text-gray-900 mb-3">
    Your Coldest Run
  </h4>
  {/* Widget content */}
</div>
```

### Stamp Grid (Challenge Progress)

The stamp grid is the signature UI element of NNRC:

```tsx
<div className="grid grid-cols-6 gap-3">
  {Array.from({ length: 30 }).map((_, i) => (
    <button
      key={i}
      className="
        aspect-square 
        rounded-full 
        bg-white
        shadow-sm
        hover:shadow-md
        hover:scale-105
        active:scale-95
        transition-all 
        duration-150
        flex 
        items-center 
        justify-center
        relative
        group
      "
    >
      {/* Completed: Show avatar */}
      {completed ? (
        <Image
          src={userAvatar}
          alt=""
          fill
          className="rounded-full object-cover"
        />
      ) : (
        /* Incomplete: Show number */
        <span className="
          text-nnrc-purple-dark 
          font-bold 
          group-hover:text-nnrc-purple
        ">
          {i + 1}
        </span>
      )}
    </button>
  ))}
</div>
```

### Progress Bar

```tsx
<div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
  <div 
    className="
      bg-gradient-to-r 
      from-nnrc-purple 
      to-nnrc-lavender
      h-full 
      rounded-full
      transition-all 
      duration-500
      ease-out
    "
    style={{ width: `${percentage}%` }}
  />
</div>
```

### Modals

```tsx
<div className="
  fixed 
  inset-0 
  bg-black/50 
  backdrop-blur-sm
  flex 
  items-center 
  justify-center 
  z-50
  animate-fadeIn
">
  <div className="
    bg-white 
    rounded-xl 
    shadow-2xl 
    max-w-md 
    w-full 
    mx-4
    p-6
    animate-slideUp
  ">
    <h3 className="text-2xl font-bold text-gray-900 mb-4">
      Log Your Run
    </h3>
    {/* Modal content */}
  </div>
</div>
```

### Input Fields

```tsx
<div className="space-y-2">
  <label className="
    block 
    text-sm 
    font-semibold 
    text-gray-700
  ">
    Temperature (°F)
  </label>
  <input
    type="number"
    className="
      w-full 
      px-4 
      py-3 
      rounded-lg 
      border-2 
      border-gray-200
      focus:border-nnrc-purple 
      focus:ring-2 
      focus:ring-nnrc-lavender
      outline-none
      transition-colors
      text-gray-900
      font-medium
    "
    placeholder="Enter temperature"
  />
</div>
```

### Badges

```tsx
{/* Temperature badge */}
<span className="
  inline-flex 
  items-center 
  px-3 
  py-1 
  rounded-full 
  text-sm 
  font-semibold
  bg-nnrc-temp-extreme-cold 
  text-white
">
  🥶 -5°F
</span>

{/* Status badge */}
<span className="
  inline-flex 
  items-center 
  px-3 
  py-1 
  rounded-full 
  text-xs 
  font-bold
  bg-nnrc-lavender 
  text-nnrc-purple-dark
">
  ACTIVE
</span>
```

### Leaderboard

```tsx
<div className="space-y-2">
  {leaderboard.map((entry, index) => (
    <div 
      key={entry.userId}
      className="
        flex 
        items-center 
        gap-4 
        p-4 
        rounded-xl
        bg-gradient-to-r 
        from-white 
        to-nnrc-lavender-light
        border 
        border-nnrc-lavender
        hover:shadow-md
        transition-shadow
      "
    >
      {/* Rank */}
      <div className="
        flex-shrink-0 
        w-8 
        h-8 
        rounded-full 
        bg-nnrc-purple
        text-white 
        font-bold 
        flex 
        items-center 
        justify-center
      ">
        {index + 1}
      </div>
      
      {/* Avatar */}
      <Image
        src={entry.userImage}
        alt=""
        width={40}
        height={40}
        className="rounded-full border-2 border-nnrc-lavender"
      />
      
      {/* Name */}
      <span className="flex-1 font-semibold text-gray-800">
        {entry.userName}
      </span>
      
      {/* Temperature */}
      <span className="
        font-bold 
        text-lg 
        text-nnrc-temp-extreme-cold
      ">
        {entry.temperature}°F
      </span>
    </div>
  ))}
</div>
```

---

## Spacing & Layout

### Spacing Scale
Based on Tailwind's spacing system:

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Container Widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
```

### Border Radius

```css
--radius-sm: 0.25rem;   /* 4px - Small elements */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-2xl: 1.5rem;   /* 24px - Modals */
--radius-full: 9999px;  /* Circles, pills */
```

### Layout Grid

```tsx
{/* Main app layout */}
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content - 2 columns on large screens */}
      <div className="lg:col-span-2 space-y-6">
        {/* Challenge card, etc. */}
      </div>
      
      {/* Sidebar - 1 column on large screens */}
      <div className="space-y-6">
        {/* Widgets */}
      </div>
    </div>
  </div>
</div>
```

---

## Iconography

### Icon Style
- Use **Heroicons** (outline style) for consistency
- Icons should be 20px or 24px in most UI contexts
- Match icon color to surrounding text

### Common Icons

```tsx
import {
  PlayIcon,        // Start run
  CheckIcon,       // Completed
  TrophyIcon,      // Leaderboard, achievements
  FireIcon,        // Streak
  CloudIcon,       // Weather
  MapPinIcon,      // Location
  Cog6ToothIcon,   // Settings
  UserCircleIcon,  // Profile
  ArrowRightIcon,  // Navigation
} from '@heroicons/react/24/outline';
```

### Icon Usage

```tsx
<button className="flex items-center gap-2">
  <PlayIcon className="w-5 h-5" />
  <span>Log Run</span>
</button>
```

---

## Animations & Interactions

### Design Principles
- **Fast & Responsive**: 100-150ms for most interactions
- **Smooth & Polished**: ease-out for natural deceleration
- **Subtle & Purposeful**: Animations should enhance, not distract
- **Performance First**: Use transform and opacity for GPU acceleration

### Transitions

```css
/* Instant feedback (buttons, toggles) */
.transition-fast {
  transition: all 100ms ease-out;
}

/* Standard interactions (cards, links) */
.transition-base {
  transition: all 150ms ease-out;
}

/* Smooth transitions (modals, overlays) */
.transition-slow {
  transition: all 250ms ease-out;
}

/* Spring easing for playful elements */
.transition-spring {
  transition: all 250ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Hover States (Modern Card Lift)

```css
/* Card hover lift effect */
.hover-lift {
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06), 0 12px 28px rgba(0, 0, 0, 0.06);
}

/* Button press effect */
.active-scale:active {
  transform: scale(0.98);
}
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
```

### Active States

```css
/* Press down effect */
.active-press:active {
  transform: scale(0.95);
}
```

### Loading States

```tsx
<div className="
  animate-pulse 
  bg-nnrc-lavender-light 
  rounded-lg 
  h-32
" />
```

### Custom Animations

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-fadeIn {
  animation: fadeIn 200ms ease-out;
}

.animate-slideUp {
  animation: slideUp 300ms ease-out;
}

.animate-shimmer {
  animation: shimmer 2s infinite;
  background: linear-gradient(
    to right,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
}
```

---

## Code Examples

### Complete Component Example: ColdestRunWidget

```tsx
import Image from 'next/image';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface ColdestRunWidgetProps {
  temperature: number;
  date: Date;
  position: number;
  userImage: string;
  userName: string;
}

export function ColdestRunWidget({
  temperature,
  date,
  position,
  userImage,
  userName,
}: ColdestRunWidgetProps) {
  return (
    <div className="
      bg-gradient-to-br 
      from-nnrc-lavender-light 
      to-white
      rounded-xl 
      border 
      border-nnrc-lavender
      p-5
      shadow-md
      hover:shadow-lg
      transition-shadow
      duration-300
    ">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TrophyIcon className="w-5 h-5 text-nnrc-purple" />
        <h4 className="text-lg font-semibold text-nnrc-purple-dark">
          Your Coldest Run
        </h4>
      </div>

      {/* Main content */}
      <div className="flex items-center gap-4">
        <Image
          src={userImage}
          alt={userName}
          width={56}
          height={56}
          className="rounded-full border-2 border-nnrc-purple"
        />
        
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-nnrc-temp-extreme-cold">
              {temperature}°F
            </span>
            <span className="text-sm text-gray-500">
              Day {position}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
```

### Utility Classes File

Create a `styles/utilities.css` file:

```css
/* NNRC Custom Utilities */

/* Temperature colors */
.temp-extreme-cold { color: #3B82F6; }
.temp-very-cold { color: #6366F1; }
.temp-cold { color: #8B5CF6; }
.temp-cool { color: #A78BFA; }
.temp-mild { color: #C4B5FD; }

/* Backgrounds */
.bg-temp-extreme-cold { background-color: #3B82F6; }
.bg-temp-very-cold { background-color: #6366F1; }
.bg-temp-cold { background-color: #8B5CF6; }
.bg-temp-cool { background-color: #A78BFA; }
.bg-temp-mild { background-color: #C4B5FD; }

/* Interactive elements */
.interactive {
  @apply transition-all duration-200 active:scale-95;
}

.hover-lift {
  @apply transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg;
}

/* Gradients */
.gradient-purple {
  @apply bg-gradient-to-r from-nnrc-purple to-nnrc-lavender;
}

.gradient-purple-br {
  @apply bg-gradient-to-br from-nnrc-purple to-nnrc-lavender;
}

.gradient-lavender-light {
  @apply bg-gradient-to-br from-nnrc-lavender-light to-white;
}

/* Text styles */
.text-display {
  @apply text-4xl font-extrabold tracking-tight;
}

.text-title {
  @apply text-2xl font-bold;
}

.text-subtitle {
  @apply text-lg font-semibold;
}

.text-body {
  @apply text-base font-normal;
}

.text-caption {
  @apply text-sm text-gray-600;
}
```

---

## Quick Reference

### Component Checklist
When creating new components, ensure they include:

- [ ] Proper color usage from the palette
- [ ] Appropriate spacing (px-6 py-3 for buttons, p-5 for cards, etc.)
- [ ] Border radius (rounded-lg for most elements)
- [ ] Hover states with transitions
- [ ] Active/pressed states for interactive elements
- [ ] Proper typography scale
- [ ] Accessibility considerations (alt text, aria labels, semantic HTML)

### Accessibility Guidelines

1. **Color Contrast**: Ensure text meets WCAG AA standards (4.5:1 for normal text)
2. **Interactive Elements**: All clickable elements must have visible focus states
3. **Images**: Always include descriptive alt text
4. **Forms**: Label all inputs properly
5. **Keyboard Navigation**: Ensure all features are keyboard accessible

### Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (latest)

---

*Last Updated: January 2026*
