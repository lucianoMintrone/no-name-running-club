# NNRC Test Plan

This document outlines manual testing procedures to run before each commit to prevent regressions.

---

## Quick Pre-Commit Checklist

Run these tests before every commit:

- [ ] **Build passes**: `yarn build` completes without errors
- [ ] **Type check passes**: `npx tsc --noEmit` has no errors
- [ ] **Homepage loads** for logged-out users
- [ ] **Sign in works** via Google OAuth
- [ ] **Challenge card displays** for enrolled users
- [ ] **Admin dashboard accessible** for admin users

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

## Automated Test Recommendations (Future)

1. **Unit tests** for services: `ChallengeService`, `UserService`, `AnalyticsService`
2. **Integration tests** for server actions in `src/app/actions/`
3. **E2E tests** with Playwright for critical user flows:
   - Sign in → View challenge → Log run
   - Admin: Create challenge → Enroll users
4. **API tests** for any REST endpoints

---

*Created: January 12, 2026*  
*Last Updated: January 12, 2026*
