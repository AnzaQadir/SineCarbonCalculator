# Engagement Layer API Documentation

## API Type: RESTful API with JWT Cookie Authentication

The engagement layer uses a **RESTful API** built on **Express.js** with the following characteristics:

### Architecture Pattern
- **REST API** - Resource-based endpoints following REST conventions
- **Cookie-based JWT Authentication** - Stateless authentication via HTTP-only cookies
- **Service Layer Pattern** - Business logic separated from controllers
- **Database-backed** - PostgreSQL with Sequelize ORM

---

## API Endpoints

### Base URL: `/api/v1/engagement`

All endpoints require authentication (JWT cookie).

---

### 1. GET `/next-actions`

**Purpose**: Get personalized next actions (1 primary + 2 alternatives)

**Authentication**: Required (JWT cookie)

**Response Format**: JSON

**Response Structure**:
```json
{
  "primary": {
    "id": "transport_no_car_day",
    "title": "Have one no-car day each week",
    "subtitle": "Batch errands into one loop this week.",
    "type": "best",
    "category": "transport",
    "previewImpact": {
      "rupees": 230,
      "co2_kg": 0.4,
      "label": "Next ₹ win"
    },
    "whyShown": "Personality: Guardian • Quick win",
    "source": "Source: ZERRAH Catalog v1.0 • Last updated: 2025-01-15",
    "learn": {
      "summary": "Avoids ~150–250 kg CO₂/year...",
      "url": null
    }
  },
  "alternatives": [
    {
      "id": "...",
      "type": "quick_win",
      ...
    },
    {
      "id": "...",
      "type": "level_up",
      ...
    }
  ]
}
```

**How It Works**:

1. **Authentication**: Middleware extracts JWT from `zerrah_token` cookie
2. **User Lookup**: Converts email from JWT to user ID
3. **Personality Retrieval**: Fetches user's personality from `user_personalities` table
4. **Rule Loading**: Loads engagement rules from `app_configs` table (hot-swappable, 60s cache)
5. **Catalog Query**: Queries recommendation catalog filtered by personality
6. **Filtering**:
   - Filters by personality `fitWeights` (if personality exists)
   - Excludes actions marked done today (from `user_actions` table)
   - Falls back to all recommendations if personality filter yields no results
7. **Ranking**: Sorts by priority order from rules (personality-specific)
8. **Selection**:
   - Primary: First candidate after sorting
   - Quick Win: Finds action with CO₂ ≤ 0.25kg AND rupees ≤ 200
   - Level Up: Finds action with CO₂ ≥ 0.8kg OR rupees ≥ 400
9. **Impact Calculation**: Converts annual CO₂ impact to weekly estimate (÷52), estimates rupees

**Key Features**:
- **Idempotent**: Same user gets consistent results (unless rules change)
- **Personality-aware**: Recommendations match user's personality archetype
- **Fallback logic**: If no personality matches, shows all recommendations
- **Timezone-aware**: Uses Asia/Karachi timezone for "today" filtering

---

### 2. POST `/action-done`

**Purpose**: Mark a recommendation as completed (idempotent per day)

**Authentication**: Required (JWT cookie)

**Request Body**:
```json
{
  "recommendationId": "transport_no_car_day",
  "context": {
    "surface": "web",
    "variant": "A"
  }
}
```

**Response Format**: JSON

**Response Structure**:
```json
{
  "ok": true,
  "verifiedImpact": {
    "rupees": 230,
    "co2_kg": 0.4
  },
  "streak": {
    "current": 5,
    "longest": 12
  },
  "bonus": {
    "awarded": true,
    "xp": 10,
    "label": "Bamboo Bonus"
  }
}
```

**How It Works**:

1. **Idempotency Check**: Checks if action already marked done today (same user + recommendation + date)
   - If exists: Returns existing impact without creating duplicate
2. **Impact Calculation**: 
   - Gets recommendation card from catalog
   - Calculates weekly CO₂ (annual ÷ 52)
   - Estimates rupees (CO₂ × 75 rupees/kg)
3. **Action Logging**: Creates record in `user_actions` table
4. **Streak Update**: Updates `user_streaks` table:
   - If last action was yesterday → increment streak
   - If last action was today → no change
   - Otherwise → reset to 1
5. **Bonus Calculation**: 15% chance for "Bamboo Bonus" (10 XP)
6. **Response**: Returns verified impact, updated streak, and optional bonus

**Key Features**:
- **Idempotent**: Same action can't be logged twice in one day
- **Timezone-aware**: Uses Asia/Karachi for "today" boundary
- **Automatic streak tracking**: Updates streak automatically

---

### 3. GET `/weekly-recap`

**Purpose**: Get weekly summary of user's actions and impact

**Authentication**: Required (JWT cookie)

**Response Format**: JSON

**Response Structure**:
```json
{
  "rupeesSaved": 870,
  "co2SavedKg": 4.2,
  "actionsCount": 7,
  "cityCommunity": "Lahore saved 17 tons CO₂",
  "storyText": "You → Lahore → Community",
  "shareImage": {
    "templateId": "recap-v1",
    "fields": {
      "rupees": 870,
      "co2": 4.2,
      "city": "Lahore"
    }
  }
}
```

**How It Works**:

1. **Week Calculation**: Calculates last week (Monday-Sunday) in Asia/Karachi timezone
2. **Cache Check**: Looks for existing summary in `weekly_summaries` table
3. **If Not Cached**: 
   - Queries `user_actions` for last week
   - Sums rupees and CO₂ saved
   - Creates summary record (cached for future requests)
4. **City Community Text**: Generates text like "Lahore saved 17 tons CO₂"
5. **Share Template**: Prepares data for share image generation

**Key Features**:
- **Caching**: Weekly summaries are cached in database
- **Timezone-aware**: Uses Asia/Karachi for week boundaries
- **Graceful handling**: Returns empty data if no actions yet

---

### 4. GET `/home-feed`

**Purpose**: Get categorized feed of recent actions (last 7 days)

**Authentication**: Required (JWT cookie)

**Response Format**: JSON

**Response Structure**:
```json
{
  "success": true,
  "feed": {
    "quickWins": [...],
    "moneySavers": [...],
    "habitBuilders": [...],
    "commute": [...]
  }
}
```

**How It Works**:

1. **Query Actions**: Fetches actions from last 7 days
2. **Categorization**: Groups actions by impact thresholds:
   - Quick Wins: CO₂ ≤ 0.25kg
   - Money Savers: Rupees ≥ 200
   - Habit Builders: All actions
   - Commute: Transport category actions
3. **Limiting**: Limits each category to 5-10 items

---

## Authentication Flow

### Type: Cookie-based JWT Authentication

**How it works**:

1. **Login**: User logs in via `/api/auth/login`
   - Receives JWT token
   - Token stored in HTTP-only cookie: `zerrah_token`

2. **Request**: Frontend sends request with credentials
   ```javascript
   fetch('/api/v1/engagement/next-actions', {
     credentials: 'include', // Sends cookies automatically
     headers: { 'Content-Type': 'application/json' }
   })
   ```

3. **Middleware**: `requireAuth` middleware:
   - Extracts token from cookie
   - Verifies JWT signature
   - Extracts user email from token payload
   - Attaches `userEmail` to request object

4. **Controller**: Converts email to user ID and processes request

**Security Features**:
- HTTP-only cookies (prevents XSS)
- JWT signature verification
- Token expiration (7 days)
- Secure flag in production

---

## Data Flow Architecture

```
Frontend (React)
    ↓
    fetch('/api/v1/engagement/next-actions', { credentials: 'include' })
    ↓
Backend Express Router
    ↓
requireAuth Middleware (JWT verification)
    ↓
engagementController.getNextActionsHandler
    ↓
engagementService.getNextActions(userId)
    ↓
    ├─→ User.findByPk(userId)
    ├─→ UserPersonality.findOne({ userId })
    ├─→ EngagementRuleOverlayService.loadRules()
    ├─→ queryCatalog({ persona, maxItems })
    ├─→ UserAction.findAll({ done today })
    └─→ Ranking & Selection Logic
    ↓
Returns NextActionsResponse
```

---

## Database Models

### `user_actions`
- Logs every action marked as done
- Idempotent constraint: (user_id, recommendation_id, date) unique
- Stores impact: rupees, CO₂ kg

### `user_streaks`
- Tracks daily streaks
- One record per user
- Updates automatically on action completion

### `weekly_summaries`
- Cached weekly totals
- One record per user per week
- Computed on-demand if missing

### `app_configs`
- Stores hot-swappable engagement rules
- Key: `engagement_rules_v1`
- Updated without redeployment

---

## Key Design Patterns

1. **Service Layer Pattern**: Business logic in `engagementService.ts`, controllers handle HTTP
2. **Repository Pattern**: Sequelize models abstract database access
3. **Strategy Pattern**: Rule overlay determines ranking strategy
4. **Caching**: Rules cached for 60s, weekly summaries cached in DB
5. **Fallback Pattern**: Multiple fallbacks ensure recommendations always available

---

## Error Handling

- **401 Unauthorized**: Missing or invalid JWT token
- **404 Not Found**: User not found in database
- **500 Internal Server Error**: Business logic errors with detailed messages

All errors return JSON with `success: false` and error message.

---

## Performance Considerations

- **Caching**: Rules cached 60s, weekly summaries cached in DB
- **Indexes**: Database indexes on `(user_id, occurred_at)` for fast queries
- **Lazy Loading**: Weekly recap only computed if not cached
- **Parallel Queries**: Some data fetched in parallel (Promise.all)

---

## Hot-Swappable Configuration

The engagement rules are stored in `app_configs` table and can be updated without code changes:

```sql
UPDATE app_configs 
SET value = '{"version":"overlay-v1.1",...}'::jsonb 
WHERE key = 'engagement_rules_v1';
```

Rules are reloaded every 60 seconds automatically.




