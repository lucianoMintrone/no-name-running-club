# Admin Help & Documentation Plan

> ✅ **Status: Implemented** (January 13, 2026)
> 
> Core components have been implemented and are ready for integration with admin pages:
> - `InfoTooltip` - Inline help tooltips
> - `HelpPanel` - Collapsible page-level help
> - `FieldLabel` - Form labels with integrated tooltips
> - `KeyConcepts` - Concept lists for help panels
> - Help content definitions for all admin pages

This document outlines the plan and implementation details for in-app help and field definitions in the NNRC admin interface.

---

## Table of Contents

1. [Goals](#goals)
2. [UI Components](#ui-components)
3. [Field Definitions by Page](#field-definitions-by-page)
4. [Implementation Plan](#implementation-plan)
5. [Component Specifications](#component-specifications)

---

## Goals

1. **Self-service understanding**: Admins should be able to understand what each field/metric means without external documentation
2. **Contextual help**: Help appears where it's needed, not in a separate help page
3. **Non-intrusive**: Help doesn't clutter the UI for experienced users
4. **Consistent**: Same help patterns used across all admin pages

---

## UI Components

### 1. InfoTooltip Component

A small info icon (ⓘ) that displays a tooltip on hover/click with field definitions.

```
┌─────────────────────────────────────┐
│ Active Participants (ⓘ)             │
│ ━━━━━━━━━━━━━━━━━━━━━━              │
│           156                        │
└─────────────────────────────────────┘
         │
         ▼ (on hover)
┌─────────────────────────────────────┐
│ The number of users currently       │
│ enrolled in the active challenge.   │
│ Users are enrolled when they sign   │
│ up or when an admin enrolls them.   │
└─────────────────────────────────────┘
```

**Usage**: Inline next to field labels or stat card titles

### 2. HelpPanel Component

A collapsible panel at the top of each page with an overview of the page's purpose and key concepts.

```
┌─────────────────────────────────────────────────────────────┐
│ ⓘ About This Page                                    [Hide] │
├─────────────────────────────────────────────────────────────┤
│ The Analytics dashboard provides insights into user         │
│ engagement and challenge participation. Use these metrics   │
│ to understand how members are using the app.                │
│                                                              │
│ Key concepts:                                                │
│ • Active Users: Users who logged at least one run           │
│ • Completion Rate: % of participants who logged all days    │
└─────────────────────────────────────────────────────────────┘
```

**Usage**: Top of each admin page, remembers collapsed state in localStorage

### 3. FieldLabel Component

Enhanced label component that integrates InfoTooltip with form labels.

```
┌─────────────────────────────────────┐
│ Season (ⓘ)                          │
│ ┌─────────────────────────────────┐ │
│ │ Winter                        ▼ │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Field Definitions by Page

### Admin Dashboard (`/admin`)

| Field | Definition |
|-------|------------|
| **Total Users** | The total number of registered accounts in the system. Includes all users regardless of role or activity status. |
| **Total Runs** | The cumulative count of all runs logged across all challenges and users. Each stamp on a user's challenge card represents one run. |
| **Challenges** | The total number of challenges created, including both active and inactive challenges. |
| **Active Participants** | The number of users enrolled in the currently active challenge. A user becomes a participant when they're enrolled in a challenge, either automatically at signup or manually by an admin. |
| **Current Challenge** | The challenge marked as "current" (active). Only one challenge can be current at a time. New users are automatically enrolled in this challenge. |
| **Current Challenge Runs** | Total runs logged by all participants in the current challenge. |
| **Recent Activity** | The 10 most recently logged runs across all challenges, showing the user, challenge, temperature, and timestamp. |

---

### Challenge Management (`/admin/challenges`)

#### Challenge List Table

| Field | Definition |
|-------|------------|
| **Challenge** | The challenge name, formatted as "[Season] [Year] Challenge" (e.g., "Winter 2025/2026 Challenge"). |
| **Status** | **Active**: This is the current challenge; new users are auto-enrolled. **Inactive**: Past or future challenge; not displayed to users on homepage. |
| **Days** | The number of runs required to complete the challenge. Users see this as the number of stamps on their challenge card. |
| **Participants** | Number of users enrolled in this challenge. Users can be enrolled in multiple challenges simultaneously. |
| **Runs** | Total runs logged by all participants in this challenge. |

#### Create Challenge Form

| Field | Definition |
|-------|------------|
| **Season** | The seasonal theme for the challenge. **Winter** challenges emphasize cold-weather running; **Summer** challenges emphasize hot-weather running. |
| **Year** | The year(s) for the challenge. For winter challenges spanning two years, use format "2025/2026". For summer challenges, use a single year "2026". |
| **Number of Days** | How many runs are required to complete the challenge (default: 30). This determines the number of stamps on each participant's card. |
| **Set as current (active) challenge** | When checked, this challenge becomes the active challenge. The previous active challenge will be automatically deactivated. Only one challenge can be active at a time. |
| **Enroll all existing users** | When checked, all existing users will be automatically enrolled in this new challenge. Useful when starting a new season to ensure everyone can participate. |

---

### User Management (`/admin/users`)

#### User List Table

| Field | Definition |
|-------|------------|
| **User** | The user's display name and email address. Profile photo shown if available (from Google account). |
| **Role** | **Admin**: Can access the admin dashboard and manage all data. **Member**: Regular user who can only manage their own runs and settings. |
| **Challenges** | The number of challenges this user is enrolled in, including past and current challenges. |
| **Total Runs** | The total number of runs this user has logged across all challenges they're enrolled in. |
| **Joined** | The date the user first signed up (created their account via Google sign-in). |

#### User Detail Page

| Field | Definition |
|-------|------------|
| **Units** | The user's preferred temperature unit: **Imperial** (°F) or **Metric** (°C). Used for display and when logging runs. |
| **Zip Code** | The user's zip code, used for weather lookups when logging runs. Optional. |
| **Enrolled Challenges** | List of all challenges this user is participating in, with run count and completion status. |
| **Runs** | Individual run entries showing position (day number) and temperature logged. |

#### User Actions

| Action | Definition |
|--------|------------|
| **Promote to Admin** | Grants admin privileges to this user. They will be able to access `/admin` and all admin features. Changes take effect after they sign out and back in. |
| **Demote to Member** | Removes admin privileges. The user will no longer be able to access admin pages. |
| **Enroll in Challenge** | Adds this user as a participant in a challenge they're not currently enrolled in. |
| **Delete User** | Permanently removes the user and all their data, including runs and challenge enrollments. This action cannot be undone. |

---

### Run Moderation (`/admin/runs`)

#### Run List Table

| Field | Definition |
|-------|------------|
| **User** | The user who logged this run. |
| **Challenge** | The challenge this run was logged for. |
| **Run #** | The position/day number within the challenge (1-30 for a 30-day challenge). Also called "position" in the database. |
| **Temperature** | The temperature recorded when the user went running, in Fahrenheit. This is the key metric for leaderboards. |
| **Date** | When the run was logged (the date the user recorded it, not necessarily when they ran). |

#### Visual Indicators

| Indicator | Definition |
|-----------|------------|
| **Red highlight** | Runs with temperatures below -20°F are highlighted as potentially suspicious and may warrant review. This helps identify data entry errors. |

#### Run Actions

| Action | Definition |
|--------|------------|
| **Delete** | Permanently removes this run entry. The user's stamp for this position will be removed. This action cannot be undone. |

---

### Analytics (`/admin/analytics`)

#### Overview Stats

| Metric | Definition |
|--------|------------|
| **Total Users** | Total registered users in the system. |
| **Total Runs** | Total runs logged across all time and all challenges. |
| **Challenges** | Total number of challenges created. |
| **Avg Runs/User** | Average number of runs per registered user (Total Runs ÷ Total Users). Indicates overall engagement. |
| **New Users (Month)** | Users who created accounts in the last 30 days. |
| **Runs (Month)** | Runs logged in the last 30 days. |

#### User Engagement

| Metric | Definition |
|--------|------------|
| **Active Users (7 days)** | Users who logged at least one run in the past 7 days. Indicates current engagement. |
| **Active Users (30 days)** | Users who logged at least one run in the past 30 days. A broader engagement metric. |
| **New Users (7 days)** | Users who signed up in the past 7 days. |
| **New Users (30 days)** | Users who signed up in the past 30 days. |
| **Runs (7 days)** | Total runs logged in the past 7 days. |
| **Runs (30 days)** | Total runs logged in the past 30 days. |

#### Current Challenge Stats

| Metric | Definition |
|--------|------------|
| **Participants** | Number of users enrolled in the current challenge. |
| **Total Runs** | Number of runs logged in the current challenge. |
| **Completion Rate** | Percentage of participants who have logged all required runs (e.g., 30 out of 30). |
| **Coldest Run** | The lowest temperature logged by any participant in this challenge. |
| **Avg Temperature** | The average temperature across all runs in this challenge. |

#### Runs Per Day Chart

A bar chart showing daily run activity over the last 30 days. Helps identify patterns (e.g., more runs on weekends) and engagement trends.

#### Temperature Distribution

A histogram showing how run temperatures are distributed across ranges. Helps understand the typical conditions runners are experiencing.

---

### Data Export (`/admin/analytics/export`)

| Export | Definition |
|--------|------------|
| **Users CSV** | Downloads a CSV file with all user data: email, name, role, units preference, join date, and run counts. |
| **Challenge JSON** | Downloads a JSON file with challenge data including all participants and their runs. Useful for detailed analysis or backup. |

---

## Implementation Plan

### Phase 1: Create Core Components ✅ Complete

1. ✅ **InfoTooltip** - `src/components/help/InfoTooltip.tsx`
2. ✅ **HelpPanel** - `src/components/help/HelpPanel.tsx`
3. ✅ **FieldLabel** - `src/components/help/FieldLabel.tsx`
4. ✅ **KeyConcepts** - `src/components/help/HelpPanel.tsx` (exported alongside HelpPanel)

### Phase 2: Add Help to Dashboard Pages ✅ Components Ready

Help content and page-specific components created:

1. ✅ Admin Dashboard - `src/app/admin/DashboardHelpPanel.tsx`, `StatCardWithHelp.tsx`
2. ✅ Challenge Management - `src/app/admin/challenges/ChallengesHelp.tsx`
3. ✅ User Management - `src/app/admin/users/UsersHelp.tsx`
4. ✅ Run Moderation - `src/app/admin/runs/RunsHelp.tsx`
5. ✅ Analytics - `src/app/admin/analytics/AnalyticsHelp.tsx`

Help content definitions:
- `src/components/admin/help-content/dashboard.ts`
- `src/components/admin/help-content/challenges.ts`
- `src/components/admin/help-content/users.ts`
- `src/components/admin/help-content/runs.ts`
- `src/components/admin/help-content/analytics.ts`

### Phase 3: Add Help to Forms 📋 Pending

1. New Challenge form - integrate `FieldLabel` with `challengesHelp.formFields`
2. User actions (role changes, enrollment) - integrate `usersHelp.actions`

---

## Component Specifications

### InfoTooltip Props

```typescript
interface InfoTooltipProps {
  content: string;           // The help text to display
  position?: 'top' | 'bottom' | 'left' | 'right';  // Tooltip position
  maxWidth?: number;         // Max width in pixels (default: 250)
}
```

### HelpPanel Props

```typescript
interface HelpPanelProps {
  title?: string;            // Panel title (default: "About This Page")
  storageKey: string;        // localStorage key for collapsed state
  children: React.ReactNode; // Help content
}
```

### FieldLabel Props

```typescript
interface FieldLabelProps {
  htmlFor: string;           // For attribute for label
  children: React.ReactNode; // Label text
  helpText?: string;         // Optional tooltip content
  required?: boolean;        // Show required indicator
}
```

### Help Content Type

```typescript
interface PageHelpContent {
  overview: string;
  keyConceptsTitle?: string;
  keyConcepts?: string[];
  fields: Record<string, string>;
}

// Example usage:
const dashboardHelp: PageHelpContent = {
  overview: "The Admin Dashboard provides a high-level overview of your running club's activity.",
  keyConceptsTitle: "Key Metrics",
  keyConcepts: [
    "Active Participants: Users enrolled in the current challenge",
    "Runs: Individual run entries logged by users",
  ],
  fields: {
    "Total Users": "The total number of registered accounts in the system.",
    "Total Runs": "The cumulative count of all runs logged.",
    // ... more fields
  }
};
```

---

## Design Considerations

### Accessibility

- Tooltips should be keyboard accessible (focusable with Tab, dismissed with Escape)
- Info icons should have proper `aria-label` attributes
- Help panels should use proper heading hierarchy

### Styling

- Use existing NNRC design tokens (purple theme colors)
- Info icon: `text-nnrc-purple-light hover:text-nnrc-purple`
- Tooltip: `bg-gray-900 text-white` for high contrast
- Help panel: `bg-nnrc-lavender-light border-nnrc-lavender`

### Mobile

- Tooltips should work on touch (tap to show/hide)
- Help panels should be fully visible on mobile widths
- Consider shorter tooltip text for mobile

---

## File Structure

```
src/
├── components/
│   ├── help/
│   │   ├── InfoTooltip.tsx      ✅ Implemented
│   │   ├── HelpPanel.tsx        ✅ Implemented (includes KeyConcepts)
│   │   ├── FieldLabel.tsx       ✅ Implemented
│   │   └── index.ts             ✅ Implemented
│   └── admin/
│       └── help-content/
│           ├── dashboard.ts     ✅ Implemented
│           ├── challenges.ts    ✅ Implemented
│           ├── users.ts         ✅ Implemented
│           ├── runs.ts          ✅ Implemented
│           ├── analytics.ts     ✅ Implemented
│           └── index.ts         ✅ Implemented
└── app/
    └── admin/
        ├── DashboardHelpPanel.tsx      ✅ Implemented
        ├── StatCardWithHelp.tsx        ✅ Implemented
        ├── analytics/
        │   └── AnalyticsHelp.tsx       ✅ Implemented
        ├── challenges/
        │   └── ChallengesHelp.tsx      ✅ Implemented
        ├── runs/
        │   └── RunsHelp.tsx            ✅ Implemented
        └── users/
            └── UsersHelp.tsx           ✅ Implemented
```

---

*Created: January 13, 2026*
*Implementation Completed: January 13, 2026*
