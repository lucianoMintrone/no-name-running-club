# No Name Running Club (NNRC) - Application Documentation

## Overview

**No Name Running Club (NNRC)** is a web application for tracking running challenges within a community running club. The app allows members to participate in seasonal running challenges, log their runs with temperature data, and compete on leaderboards based on who runs in the coldest conditions.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database** | PostgreSQL via Prisma ORM |
| **Authentication** | NextAuth.js v5 with Google OAuth |
| **Styling** | Tailwind CSS |
| **Deployment** | Vercel |

---

## Core Features

### 1. User Authentication
- **Google OAuth Sign-In**: Users can sign in with their Google account
- **Automatic Challenge Enrollment**: New users are automatically enrolled in the current active challenge upon registration
- **Session Management**: Secure session handling with JWT tokens

### 2. Running Challenges
- **Seasonal Challenges**: The app supports winter and summer challenges, identified by season and year (e.g., "Winter 2025/2026 Challenge")
- **Configurable Duration**: Each challenge has a configurable number of days (default: 30 days)
- **User Enrollment**: Users are enrolled in challenges via the `UserChallenge` model, which allows per-user customization of the days count
- **Current Challenge Tracking**: One or more challenges can be marked as "current" (active)

### 3. Run Logging
- **Stamp Grid Interface**: Users see a visual grid of numbered circles representing each day of the challenge
- **Click-to-Log**: Clicking any stamp opens a modal to record a run
- **Temperature Recording**: Each run records the temperature (in Fahrenheit)
- **Auto-Weather Fetch**: When logging a run, the app can automatically fetch the current temperature using the OpenWeatherMap API based on the user's saved zip code
- **Visual Progress**: Completed runs show the user's avatar in the stamp circle

### 4. Leaderboards & Records

#### Personal Stats
- **Coldest Run Widget**: Displays the user's coldest run in the current challenge, including temperature, date, and run number

#### Challenge Leaderboard
- **Coldest Temperature Competition**: Ranks participants by their coldest single run in the current challenge
- **Top 5 Display**: Shows the top 5 runners by coldest temperature

#### All-Time Club Record
- **Historical Best**: Tracks the coldest run ever recorded across all challenges
- **Public Display**: Visible to both authenticated and unauthenticated users

### 5. User Settings
- **Unit Preference**: Users can toggle between imperial and metric units
- **Zip Code**: Users can save their zip code for automatic weather fetching

---

## User Flows

### Public (Unauthenticated) View
1. **Landing Page**: Shows club branding ("No Name Running Club"), tagline, and three feature cards (Community Runs, Events, Connect)
2. **Currently Running Section**: Displays active challenges with their leaderboards
3. **Club Records Section**: Shows the all-time coldest run record
4. **Sign In Button**: Opens a modal for Google OAuth sign-in

### Authenticated User View
1. **Challenge Card**: Displays the user's current challenge with:
   - Challenge title (e.g., "Winter 2025/2026 Challenge")
   - Progress indicator (e.g., "5 of 30 runs (17%)")
   - Interactive stamp grid
2. **Sidebar Widgets**:
   - Coldest Run (personal best for current challenge)
   - Challenge Leaderboard (top 5 coldest runs)
   - All-Time Club Record
3. **Settings Modal**: Access to unit preferences and zip code configuration
4. **Sign Out Button**: Ends the user session

### Logging a Run
1. User clicks on a stamp (day number) in the grid
2. Modal opens with temperature input field
3. If zip code is saved, current temperature is auto-fetched
4. User confirms the temperature and submits
5. Run is saved; stamp shows user's avatar as completed
6. Leaderboards and personal stats update accordingly

---

## Data Models

### User
| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier (CUID) |
| `email` | String | User's email (unique) |
| `name` | String? | Display name |
| `image` | String? | Avatar URL (from OAuth) |
| `units` | String | Preferred units ("imperial" or "metric") |
| `zipCode` | String? | Zip code for weather lookup |
| `emailVerified` | DateTime? | Email verification timestamp |

### Challenge
| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier (CUID) |
| `current` | Boolean | Whether this is an active challenge |
| `season` | Enum | "winter" or "summer" |
| `year` | String | Year identifier (e.g., "2025/2026") |
| `daysCount` | Int | Default number of days (typically 30) |

### UserChallenge
| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier (CUID) |
| `userId` | String | Reference to User |
| `challengeId` | String | Reference to Challenge |
| `daysCount` | Int | User's target days for this challenge |

### Run
| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique identifier (CUID) |
| `userChallengeId` | String | Reference to UserChallenge |
| `date` | DateTime | Date of the run |
| `position` | Int | Day/stamp position in the challenge |
| `temperature` | Int? | Temperature in Fahrenheit |
| `durationInMinutes` | Int? | Run duration (optional) |
| `distance` | Float? | Run distance (optional) |
| `units` | String? | Units for distance (optional) |

---

## API Endpoints & Server Actions

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication routes
- `signOutUser()` - Server action to sign out the current user

### Run Management
- `saveRun({ temperature, position })` - Server action to create or update a run

### User Settings
- `updateUserUnits(units)` - Server action to update unit preference
- `updateUserZipCode(zipCode)` - Server action to update zip code

### Weather
- `getCurrentTemperature()` - Server action that fetches current temperature from OpenWeatherMap based on user's zip code

### Challenge Setup
- `POST /api/setup-challenge` - API route for setting up/seeding challenges

---

## Services Architecture

### ChallengeService
- `getCurrentChallenge()` - Gets the current active challenge
- `getUserCurrentChallenge(userId)` - Gets user's enrollment in current challenge with runs
- `getColdestRun(userId)` - Gets user's coldest run in current challenge
- `getChallengeLeaderboard()` - Gets leaderboard for current challenge
- `getActiveChallengesWithLeaderboards()` - Gets all active challenges with leaderboards
- `getAllTimeRecord()` - Gets the all-time coldest run record
- `formatChallengeTitle(challenge)` - Formats challenge display title

### UserService
- `createUser(input)` - Creates user and auto-enrolls in current challenge
- `findOrCreateUser(input)` - OAuth flow: finds existing or creates new user
- `findById(id)` - Finds user by ID
- `findByEmail(email)` - Finds user by email
- `updateUser(id, data)` - Updates user profile

### WeatherService
- `getWeatherByZipCode(zipCode)` - Fetches current weather from OpenWeatherMap API

### Share Utilities (`src/lib/share.ts`)
- `supportsNativeShare()` - Checks if Web Share API is available
- `isIOSDevice()` - Detects iOS devices for SMS URL formatting
- `triggerNativeShare(data)` - Opens native share dialog on supported devices
- `buildEmailShareUrl(data)` - Builds mailto: URL for email sharing
- `buildSmsShareUrl(data)` - Builds SMS URL for text message sharing
- `copyToClipboard(text)` - Copies text to clipboard
- `getShareUrl()` - Gets current page URL for sharing

### Admin Help Components (`src/components/help/`)
- `InfoTooltip` - Inline tooltip with info icon for field definitions
- `HelpPanel` - Collapsible page-level help panel with localStorage persistence
- `FieldLabel` - Enhanced label component with integrated help tooltip
- `KeyConcepts` - Bullet list of key concepts for help panels

---

## UI Components

| Component | Description |
|-----------|-------------|
| `ChallengeCard` | Main challenge view with stamp grid and progress |
| `StampGrid` | Interactive grid of day stamps |
| `RunFormModal` | Modal for logging a run with temperature |
| `SignInModal` | Google OAuth sign-in button and modal |
| `SettingsModal` | User preferences (units, zip code) |
| `ColdestRunWidget` | Displays user's coldest run stats |
| `LeaderboardWidget` | Shows challenge leaderboard |
| `AllTimeRecordWidget` | Displays all-time club record |
| `ShareWidget` | Social sharing button (native share on mobile, copy link on desktop) |

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | NextAuth.js secret key |
| `NEXTAUTH_URL` | Application URL for NextAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key (optional) |

---

## Development Commands

```bash
# Start development server
yarn dev

# Build application
yarn build

# Database operations
yarn db:migrate        # Create and apply migrations
yarn db:migrate:deploy # Apply migrations (production)
yarn db:studio         # Open Prisma Studio GUI
yarn db:generate       # Regenerate Prisma client
yarn db:push           # Push schema changes (dev only)

# Seed challenges
yarn db:setup-challenges
```

---

## Deployment

The application is configured for Vercel deployment:

1. **Build Command**: `prisma generate && prisma migrate deploy && next build`
2. **Database**: Vercel Postgres (or any PostgreSQL provider)
3. **Migrations**: Run automatically during build process
4. **Environment**: All environment variables must be configured in Vercel project settings

---

## Future Considerations

Based on the data model, the following features appear to be prepared but not yet fully implemented:

- **Run Duration Tracking**: The `durationInMinutes` field exists on Run
- **Run Distance Tracking**: The `distance` and `units` fields exist on Run
- **Metric Support**: Infrastructure exists for metric units, though temperature is currently displayed in Fahrenheit

---

*Last updated: January 2026*
