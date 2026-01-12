# Admin Features Implementation Plan

## Overview

This document outlines the implementation plan for adding administrative capabilities to the No Name Running Club application.

---

## Phase 1: Foundation - Role-Based Access Control

### 1.1 Database Schema Updates

**Add role field to User model:**

```prisma
model User {
  // ... existing fields
  role  String @default("member")  // "member" | "admin"
}
```

**Migration required:** Yes

### 1.2 Admin Email Configuration

**Environment variable:**
```
ADMIN_EMAILS=admin@example.com,another@example.com
```

Auto-assign admin role during OAuth sign-in for configured emails.

### 1.3 Auth Middleware

**Create:** `src/lib/admin.ts`
- `isAdmin(session)` - Check if current user is admin
- `requireAdmin()` - Server action wrapper that throws if not admin

**Update:** `src/lib/auth.ts`
- Include `role` in session/JWT token

### Estimated Effort: 2-3 hours

---

## Phase 2: Admin Dashboard Layout

### 2.1 Admin Route Group

**Create folder structure:**
```
src/app/admin/
├── layout.tsx          # Admin layout with navigation
├── page.tsx            # Dashboard overview
├── challenges/
│   └── page.tsx        # Challenge management
├── users/
│   └── page.tsx        # User management
└── runs/
    └── page.tsx        # Run moderation
```

### 2.2 Admin Layout Component

**Features:**
- Sidebar navigation
- Admin-only access check (redirect non-admins)
- NNRC branding
- Quick stats in header

### 2.3 Dashboard Overview Page

**Widgets:**
- Total users count
- Active challenge info
- Total runs logged
- Recent activity feed

### Estimated Effort: 3-4 hours

---

## Phase 3: Challenge Management

### 3.1 Challenge CRUD Service

**Create:** `src/services/AdminChallengeService.ts`

```typescript
// Functions to implement:
createChallenge(data: CreateChallengeInput)
updateChallenge(id: string, data: UpdateChallengeInput)
deleteChallenge(id: string)
setCurrentChallenge(id: string)
getAllChallenges()
getChallengeStats(id: string)
```

### 3.2 Challenge Management UI

**Features:**
- List all challenges (past and current)
- Create new challenge form
  - Season selector (winter/summer)
  - Year input
  - Days count input
  - Set as current toggle
- Edit existing challenge
- Toggle current status
- View enrollment stats per challenge
- Delete challenge (with confirmation)

### 3.3 Server Actions

**Create:** `src/app/actions/admin.ts`

```typescript
"use server"

export async function createChallenge(formData: FormData)
export async function updateChallenge(id: string, formData: FormData)
export async function deleteChallenge(id: string)
export async function setCurrentChallenge(id: string)
```

### Estimated Effort: 4-5 hours

---

## Phase 4: User Management

### 4.1 User Admin Service

**Create:** `src/services/AdminUserService.ts`

```typescript
// Functions to implement:
getAllUsers(options: { page, limit, search })
getUserDetails(id: string)
updateUserRole(id: string, role: string)
deleteUser(id: string)
enrollUserInChallenge(userId: string, challengeId: string)
unenrollUserFromChallenge(userId: string, challengeId: string)
```

### 4.2 User Management UI

**Features:**
- Paginated user list with search
- User details view
  - Email, name, avatar
  - Role badge
  - Challenge enrollments
  - Run history
- Edit user role (member/admin)
- Manually enroll/unenroll from challenges
- Delete user (with confirmation, cascades runs)

### 4.3 Bulk Actions

- Enroll all users in current challenge
- Export user list (CSV)

### Estimated Effort: 5-6 hours

---

## Phase 5: Run Moderation

### 5.1 Run Admin Service

**Create:** `src/services/AdminRunService.ts`

```typescript
// Functions to implement:
getAllRuns(options: { page, limit, challengeId, userId })
getRunDetails(id: string)
updateRun(id: string, data: UpdateRunInput)
deleteRun(id: string)
getFlaggedRuns()  // Runs with suspicious data
```

### 5.2 Run Moderation UI

**Features:**
- List all runs with filters
  - By challenge
  - By user
  - By date range
  - By temperature range
- View run details
- Edit run (temperature, position)
- Delete run (with confirmation)
- Flag system for suspicious entries (optional)

### 5.3 Suspicious Run Detection (Optional)

Flag runs that:
- Have extremely low temperatures (< -20°F)
- Were logged for future dates
- Have duplicate positions for same user/challenge

### Estimated Effort: 4-5 hours

---

## Phase 6: Analytics & Reporting

### 6.1 Analytics Service

**Create:** `src/services/AnalyticsService.ts`

```typescript
// Functions to implement:
getOverviewStats()
getChallengeParticipation(challengeId: string)
getUserEngagement(dateRange: DateRange)
getTemperatureDistribution(challengeId: string)
```

### 6.2 Analytics Dashboard

**Charts/Widgets:**
- Participation over time (line chart)
- Temperature distribution (histogram)
- Runs per day (bar chart)
- User retention metrics
- Challenge completion rates

### 6.3 Export Capabilities

- Export challenge data (CSV/JSON)
- Export leaderboard
- Export user activity

### Estimated Effort: 4-5 hours

---

## Implementation Priority

| Priority | Phase | Description | Effort | Status |
|----------|-------|-------------|--------|--------|
| 🔴 High | 1 | Role-Based Access Control | 2-3 hrs | ✅ Done |
| 🔴 High | 2 | Admin Dashboard Layout | 3-4 hrs | ✅ Done |
| 🔴 High | 3 | Challenge Management | 4-5 hrs | ✅ Done |
| 🟡 Medium | 4 | User Management | 5-6 hrs | ✅ Done |
| 🟡 Medium | 5 | Run Moderation | 4-5 hrs | ✅ Done |
| 🟢 Low | 6 | Analytics & Reporting | 4-5 hrs | ✅ Done |

**Total Estimated Effort: 22-28 hours**

---

## Security Considerations

### Authentication
- All admin routes require authenticated session
- Session must have `role: "admin"`

### Authorization Checks
- Server-side validation on ALL admin actions
- Never trust client-side role checks alone

### Audit Logging (Future)
- Log all admin actions with timestamp and actor
- Store in separate `AdminLog` table

### Rate Limiting
- Apply stricter rate limits to admin endpoints
- Prevent bulk deletion attacks

---

## File Structure After Implementation

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── challenges/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── runs/
│   │       └── page.tsx
│   └── actions/
│       └── admin.ts
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── ChallengeForm.tsx
│       ├── UserTable.tsx
│       ├── RunTable.tsx
│       └── StatsCard.tsx
├── lib/
│   └── admin.ts
└── services/
    ├── AdminChallengeService.ts
    ├── AdminUserService.ts
    ├── AdminRunService.ts
    └── AnalyticsService.ts
```

---

## Database Migration Plan

### Migration 1: Add User Role

```sql
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'member';
```

### Migration 2: Admin Audit Log (Optional)

```sql
CREATE TABLE "AdminLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "adminId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE CASCADE
);
```

---

## Next Steps

1. **Get approval** on this plan
2. **Decide priority** - which phases to implement first
3. **Create feature branch** for admin work
4. **Implement Phase 1** - RBAC foundation
5. **Iterate** through remaining phases

---

*Created: January 2026*
*Status: All Phases Implemented ✅*
*Last Updated: January 12, 2026*
