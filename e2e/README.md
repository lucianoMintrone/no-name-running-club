# E2E Tests

This directory contains end-to-end tests using [Playwright](https://playwright.dev/).

## Test Structure

- **pages.spec.ts** - Tests for page accessibility and navigation
- **modals.spec.ts** - Tests for modal components (Sign In, Settings)
- **authenticated.spec.ts** - Tests for authenticated user features
- **admin.spec.ts** - Tests for admin panel pages and functionality
- **responsive.spec.ts** - Tests for mobile responsiveness and accessibility
- **helpers.ts** - Shared test utilities and fixtures

## Setup

### 1. Install Dependencies

```bash
yarn install
```

### 2. Install Playwright Browsers

```bash
# Install Chromium only (faster)
npx playwright install chromium

# Or install all browsers
npx playwright install
```

### 3. Install System Dependencies (Linux/CI)

If running in Linux or CI environments, you may need system dependencies:

```bash
npx playwright install-deps chromium
```

## Running Tests

### Run All E2E Tests

```bash
yarn test:e2e
```

### Run Tests with UI

```bash
yarn test:e2e:ui
```

### Run Tests with Browser Visible

```bash
yarn test:e2e:headed
```

### Run Specific Test File

```bash
npx playwright test e2e/pages.spec.ts
```

### Run Tests in Specific Browser

```bash
npx playwright test --project=chromium
```

## Test Coverage

### Public Pages (Unauthenticated)
- ✓ Home page loads successfully
- ✓ Sign in button is visible
- ✓ Navigation bar is present and functional
- ✓ Public challenge information displays

### Modal Functionality
- ✓ Sign in modal opens/closes correctly
- ✓ Sign in modal displays Google sign-in option
- ✓ Share widget functionality

### Authenticated User Features
- ✓ Settings modal opens/closes
- ✓ Zip code can be entered and saved
- ✓ Challenge card displays progress
- ✓ Stamp grid is interactive
- ✓ Run form modal opens when clicking stamps
- ✓ Run form has temperature input and log button

### Admin Pages
- ✓ Unauthenticated users cannot access admin
- ✓ Admin dashboard loads with stats
- ✓ Users, Runs, Challenges, Analytics pages load
- ✓ Navigation between admin pages works

### Responsiveness & Accessibility
- ✓ Mobile viewport displays correctly
- ✓ Tablet viewport displays correctly
- ✓ Keyboard navigation works
- ✓ Focus states are visible
- ✓ Images have alt text

## Writing New Tests

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    await page.goto("/");
    
    // Find elements
    const button = page.getByRole("button", { name: /click me/i });
    
    // Assert visibility
    await expect(button).toBeVisible();
    
    // Interact
    await button.click();
    
    // Assert result
    await expect(page).toHaveURL(/\/new-page/);
  });
});
```

## Configuration

See [playwright.config.ts](../playwright.config.ts) for test configuration.

## Debugging

```bash
# Run with debug mode
npx playwright test --debug

# Show browser during test
npx playwright test --headed

# View test report
npx playwright show-report
```
