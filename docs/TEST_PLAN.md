# NNRC Test Plan

This document outlines both automated and manual testing procedures for the No Name Running Club application.

---

## Table of Contents

1. [Quick Pre-Commit Checklist](#quick-pre-commit-checklist)
2. [Automated Tests](#automated-tests)
3. [Manual Testing Procedures](#manual-testing-procedures)
4. [Known Issues & Workarounds](#known-issues--workarounds)

---

## Quick Pre-Commit Checklist

Run these tests before every commit:

- [ ] **Unit tests pass**: `yarn test:run` completes without errors
- [ ] **Build passes**: `yarn build` completes without errors
- [ ] **Type check passes**: `npx tsc --noEmit` has no errors
- [ ] **Homepage loads** for logged-out users
- [ ] **Sign in works** via Google OAuth
- [ ] **Challenge card displays** for enrolled users
- [ ] **Admin dashboard accessible** for admin users

---

## Automated Tests

### Overview

The project uses [Vitest](https://vitest.dev/) as the test framework with `vitest-mock-extended` for Prisma mocking. Tests are located alongside the source files with a `.test.ts` suffix.

### Test Framework Configuration

- **Config file**: [vitest.config.ts](../vitest.config.ts)
- **Test setup**: [src/test/setup.ts](../src/test/setup.ts)
- **Prisma mock**: [src/test/mocks/prisma.ts](../src/test/mocks/prisma.ts)

### Running Tests

#### Run All Tests (Watch Mode)
```bash
yarn test
```
This runs Vitest in watch mode - tests will re-run automatically when files change.

#### Run All Tests Once
```bash
yarn test:run
```
This runs all tests once and exits. Use this for CI/CD or pre-commit checks.

#### Run Tests with Coverage
```bash
yarn test:coverage
```
This generates a coverage report in the `coverage/` directory. Open `coverage/index.html` in a browser to view the detailed HTML report.

#### Run Specific Test File
```bash
yarn test src/services/UserService.test.ts
```

#### Run Tests Matching a Pattern
```bash
yarn test --grep "should create a user"
```

### Current Test Suites

#### 1. ChallengeService Tests
**File**: [src/services/ChallengeService.test.ts](../src/services/ChallengeService.test.ts)

Tests the challenge-related business logic:

| Test Suite | Description |
|------------|-------------|
| `getCurrentChallenge` | Returns current challenge or null |
| `getUserCurrentChallenge` | Returns user's enrolled challenge with runs |
| `getColdestRun` | Finds coldest temperature run for a user |
| `formatChallengeTitle` | Formats challenge title strings (e.g., "Winter 2025/2026 Challenge") |
| `getChallengeLeaderboard` | Returns sorted leaderboard by temperature |
| `getAllTimeRecord` | Returns all-time coldest run across all challenges |

#### 2. UserService Tests
**File**: [src/services/UserService.test.ts](../src/services/UserService.test.ts)

Tests user management functionality:

| Test Suite | Description |
|------------|-------------|
| `createUser` | Creates users, auto-enrolls in current challenge |
| `findOrCreateUser` | OAuth flow - finds existing or creates new user |
| `findById` | Finds user by ID |
| `findByEmail` | Finds user by email address |
| `updateUser` | Updates user profile (name, units, zipCode) |

#### 3. AnalyticsService Tests
**File**: [src/services/AnalyticsService.test.ts](../src/services/AnalyticsService.test.ts)

Tests analytics and reporting functionality:

| Test Suite | Description |
|------------|-------------|
| `getOverviewStats` | Returns high-level stats (users, runs, challenges, averages) |
| `getChallengeParticipation` | Calculates participation stats for a challenge |
| `getUserEngagement` | Returns engagement metrics (active users, new users) |
| `getRunsByDay` | Groups runs by date for charting |
| `getTemperatureDistribution` | Groups temperatures into histogram buckets |
| `exportLeaderboard` | Generates ranked leaderboard for export |
| `exportUsers` | Exports all users with stats |
| `exportChallengeData` | Exports challenge with all run data |

#### 4. WeatherService Tests
**File**: [src/services/WeatherService.test.ts](../src/services/WeatherService.test.ts)

Tests external weather API integration:

| Test Suite | Description |
|------------|-------------|
| `getWeatherByZipCode` | Fetches weather from OpenWeatherMap API |
| API key handling | Returns null when API key not configured |
| Error handling | Handles API errors and network failures gracefully |
| Response parsing | Handles missing/malformed weather data |

#### 5. Share Utilities Tests
**File**: [src/lib/share.test.ts](../src/lib/share.test.ts)

Tests social sharing functionality:

| Test Suite | Description |
|------------|-------------|
| `DEFAULT_SHARE_DATA` | Verifies default share content (title, text, URL) |
| `supportsNativeShare` | Detects Web Share API availability |
| `isIOSDevice` | Detects iOS devices for SMS URL format |
| `triggerNativeShare` | Triggers native share dialog, handles success/cancel/failure |
| `buildEmailShareUrl` | Builds properly encoded mailto: URLs |
| `buildSmsShareUrl` | Builds platform-specific SMS URLs (iOS vs Android) |
| `copyToClipboard` | Copies text to clipboard with Clipboard API |
| `getShareUrl` | Gets current page URL for sharing |

### Writing New Tests

#### Test File Location
Place test files next to the source file they test:
```
src/services/
  ├── ChallengeService.ts
  ├── ChallengeService.test.ts
  ├── UserService.ts
  └── UserService.test.ts
```

#### Mocking Prisma
Import the Prisma mock and set up mocks before importing the service:

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { prismaMock } from "@/test/mocks/prisma";

// Mock BEFORE importing the service
vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

// Import service AFTER mocking
import { MyService } from "./MyService";

describe("MyService", () => {
  it("should do something", async () => {
    // Arrange: Set up mock return values
    prismaMock.user.findUnique.mockResolvedValue({ id: "123", name: "Test" });
    
    // Act: Call the service method
    const result = await MyService.findUser("123");
    
    // Assert: Check the result
    expect(result).toEqual({ id: "123", name: "Test" });
    expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
      where: { id: "123" },
    });
  });
});
```

### Coverage Targets

Current coverage is focused on the `src/services/` directory. Coverage reports are generated to:
- `coverage/` - HTML report
- Console output with text summary

View coverage by opening `coverage/index.html` after running `yarn test:coverage`.

---

## Manual Testing Procedures

The following sections outline manual testing procedures for features not yet covered by automated tests.

---

## Test Environment Setup

### Prerequisites
1. Database is running and accessible
2. `.env` file contains valid credentials:
   - `DATABASE_URL`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
3. At least one challenge exists and is marked as `current: true`
4. At least one user exists with admin role for admin tests

### Database Health Check
```bash
# Verify current challenge exists
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.challenge.findFirst({ where: { current: true } })
  .then(c => console.log('Current challenge:', c ? c.season + ' ' + c.year : 'NONE - CREATE ONE!'))
  .finally(() => p.\$disconnect());
"
```

---

## 1. Authentication Tests

### 1.1 Sign In Flow
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/` when logged out | Homepage shows "Sign in with Google" button |
| 2 | Click "Sign in with Google" | Google OAuth popup/redirect appears |
| 3 | Complete Google sign-in | Redirected back to homepage, user name visible in nav |
| 4 | Refresh the page | User remains signed in |

### 1.2 Sign Out Flow
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | When signed in, click "Sign out" button | User is signed out |
| 2 | Refresh the page | Sign-in modal is available, user is not logged in |

### 1.3 Session Persistence
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in | User session created |
| 2 | Close browser, reopen, navigate to `/` | User is still signed in (if within session timeout) |

---

## 2. Challenge Display Tests

### 2.1 Logged-Out User View
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/` when logged out | Welcome message displays |
| 2 | Check for active challenge leaderboards | Public leaderboards visible (if any) |
| 3 | Check for all-time record widget | All-time coldest run displays (if data exists) |

### 2.2 Logged-In User - Enrolled in Current Challenge
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in with a user enrolled in current challenge | Challenge card displays with title (e.g., "Winter 2025/2026 Challenge") |
| 2 | Verify stamp grid shows | 30-day grid visible with correct stamp count |
| 3 | Check completed runs | Completed positions show stamps |
| 4 | Check coldest run widget | Displays user's coldest run (if any runs logged) |
| 5 | Check leaderboard widget | Shows current challenge leaderboard |

### 2.3 Logged-In User - NOT Enrolled in Current Challenge
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in with user NOT enrolled in current challenge | Welcome/landing view displays (no challenge card) |
| 2 | ⚠️ **BUG TO FIX**: User should be auto-enrolled or shown enrollment option | Currently shows nothing - needs improvement |

### 2.4 No Current Challenge Exists
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Remove current flag from all challenges | App should handle gracefully |
| 2 | Sign in | User sees appropriate "no active challenge" message |

---

## 3. Run Logging Tests

### 3.1 Log a New Run
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on an empty stamp position | Run form modal opens |
| 2 | Enter temperature (e.g., 25) | Temperature field accepts input |
| 3 | Click "Save Run" | Modal closes, stamp appears on grid |
| 4 | Refresh page | Run persists, stamp still shows |

### 3.2 Edit an Existing Run
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on a completed stamp | Run form modal opens with existing data |
| 2 | Change temperature | Field updates |
| 3 | Save changes | Modal closes, data persisted |

### 3.3 Delete a Run
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click on a completed stamp | Run form modal opens |
| 2 | Click "Delete" | Confirmation appears |
| 3 | Confirm deletion | Run deleted, stamp removed |

### 3.4 Run Validation
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Try to log run with no temperature | Should require temperature or show error |
| 2 | Try to log run with invalid temperature (999) | Should accept (no validation currently) |
| 3 | Try to log duplicate position | Should update existing or prevent duplicate |

---

## 4. User Settings Tests

### 4.1 Update Units
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click settings gear icon | Settings modal opens |
| 2 | Change units from Imperial to Metric | Selection updates |
| 3 | Save settings | Modal closes |
| 4 | Refresh page | Units preference persists |

### 4.2 Update Zip Code
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open settings modal | Current zip code shown (or empty) |
| 2 | Enter zip code (e.g., "10001") | Field accepts input |
| 3 | Save settings | Zip code persists |
| 4 | (If weather integration exists) Verify weather data uses zip | Weather reflects location |

---

## 5. Admin Dashboard Tests

### 5.1 Admin Access Control
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign in as non-admin user | No "Admin" button in nav |
| 2 | Try to navigate directly to `/admin` | Redirected to homepage |
| 3 | Sign in as admin user | "Admin" button visible in nav |
| 4 | Click "Admin" button | Admin dashboard loads |

### 5.2 Admin Dashboard Overview
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin` | Dashboard displays |
| 2 | Verify stats cards | Shows total users, runs, challenges, participants |
| 3 | Check current challenge info | Displays current challenge details |
| 4 | Check recent activity | Shows recent runs |

### 5.3 Challenge Management
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/challenges` | Challenge list displays |
| 2 | Click "+ New Challenge" | Create form loads |
| 3 | Fill form (Season: Winter, Year: 2027, Days: 30) | Fields accept input |
| 4 | Check "Set as current" and "Enroll all users" | Checkboxes work |
| 5 | Click "Create Challenge" | Challenge created, redirected to list |
| 6 | Verify new challenge in list | Shows with correct data |
| 7 | Verify old challenge marked inactive | Previous current is now inactive |
| 8 | Verify users enrolled | Check user enrollments in DB or user list |

### 5.4 User Management
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/users` | User list displays |
| 2 | Click "View" on a user | User detail page loads |
| 3 | View user's challenge enrollments | Shows all enrolled challenges with run counts |
| 4 | Click "Promote to Admin" | User role changes |
| 5 | Click "Demote to Member" | User role reverts |
| 6 | Enroll user in a challenge | User added to challenge |
| 7 | Delete user (test with disposable account) | User removed, cascades delete runs |

### 5.5 Run Moderation
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/runs` | Run list displays |
| 2 | Verify runs show user, challenge, temperature | All columns populated |
| 3 | Check suspicious run highlighting | Runs < -20°F highlighted in red |
| 4 | Click "Delete" on a run | Confirmation appears |
| 5 | Confirm deletion | Run removed from list |

### 5.6 Analytics Dashboard
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/analytics` | Analytics page loads |
| 2 | Verify overview stats | Shows correct totals |
| 3 | Check engagement metrics | Active users counts display |
| 4 | View runs per day chart | Bar chart renders |
| 5 | View temperature distribution | Histogram renders |
| 6 | Check all challenges table | Lists all challenges with stats |

### 5.7 Data Export
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Navigate to `/admin/analytics/export` | Export page loads |
| 2 | Click "Export CSV" for Users | CSV file downloads |
| 3 | Open CSV | Valid format with correct data |
| 4 | Click "Export JSON" for Challenge | JSON file downloads |
| 5 | Open JSON | Valid JSON with challenge and runs |

---

## 6. Edge Cases & Error Handling

### 6.1 Database Connectivity
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Temporarily break DATABASE_URL | App shows graceful error page |
| 2 | Restore DATABASE_URL, refresh | App recovers |

### 6.2 Missing Data Scenarios
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | User with no runs | Widgets show "no data" states |
| 2 | Challenge with no enrollments | Admin shows 0 participants |
| 3 | No challenges in database | Admin dashboard handles gracefully |

### 6.3 Concurrent Actions
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app in two tabs | Both work independently |
| 2 | Log a run in tab 1 | Tab 1 updates |
| 3 | Refresh tab 2 | Tab 2 shows updated run |

---

## 7. Mobile Responsiveness

| Test | Expected Result |
|------|-----------------|
| Homepage on mobile width (375px) | Layout adapts, no horizontal scroll |
| Challenge card on mobile | Grid scales appropriately |
| Admin dashboard on mobile | Sidebar collapses or scrolls |
| Forms on mobile | Input fields usable, buttons tappable |

---

## 8. Performance Checks

| Test | Expected Result |
|------|-----------------|
| Homepage load time | < 3 seconds on first load |
| Admin dashboard load | < 5 seconds |
| Run logging | < 1 second response |

---

## Known Issues & Workarounds

### Issue: User not enrolled in current challenge
**Symptom**: Logged-in user sees landing page instead of challenge card  
**Cause**: User was created before current challenge, or challenge changed  
**Workaround**: Admin enrolls user via `/admin/users/[id]` or run:
```bash
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function enroll(email) {
  const user = await p.user.findUnique({ where: { email } });
  const challenge = await p.challenge.findFirst({ where: { current: true } });
  if (user && challenge) {
    await p.userChallenge.upsert({
      where: { userId_challengeId: { userId: user.id, challengeId: challenge.id } },
      update: {},
      create: { userId: user.id, challengeId: challenge.id, daysCount: challenge.daysCount }
    });
    console.log('Enrolled!');
  }
}
enroll('user@example.com').finally(() => p.\$disconnect());
"
```

### Issue: Admin button not visible after role change
**Symptom**: User made admin but button doesn't appear  
**Cause**: JWT token cached with old role  
**Workaround**: Sign out and sign back in to refresh session

---

## Pre-Commit Script

Add to `package.json`:
```json
{
  "scripts": {
    "precommit": "yarn build && npx tsc --noEmit"
  }
}
```

Or run manually:
```bash
yarn build && npx tsc --noEmit
```

---

## Automated Test Roadmap

### Currently Implemented ✅
- **Unit tests** for `ChallengeService` (6 test suites, 13 tests)
- **Unit tests** for `UserService` (5 test suites, 10 tests)
- **Unit tests** for `AnalyticsService` (8 test suites, 15 tests)
- **Unit tests** for `WeatherService` (1 test suite, 7 tests)
- **Unit tests** for `Share Utilities` (8 test suites, 26 tests)
- **Prisma mocking** infrastructure for isolated database testing
- **Fetch mocking** for external API testing
- **Browser API mocking** for navigator.share, clipboard, and user agent testing

### Current Coverage
| Service | Statements | Branches | Functions | Lines |
|---------|------------|----------|-----------|-------|
| AnalyticsService | 93% | 68% | 92% | 94% |
| ChallengeService | 63% | 56% | 89% | 63% |
| UserService | 100% | 100% | 100% | 100% |
| WeatherService | 100% | 100% | 100% | 100% |
| Share Utilities | 100% | 100% | 100% | 100% |
| **Overall** | 89% | 75% | 94% | 88% |

**Total Tests**: 71 tests across 29 test suites

### Recommended Next Steps
1. **Integration tests** for server actions in `src/app/actions/`
2. **E2E tests** with Playwright for critical user flows:
   - Sign in → View challenge → Log run
   - Admin: Create challenge → Enroll users
3. **API tests** for any REST endpoints

---

*Created: January 12, 2026*  
*Last Updated: January 13, 2026*
