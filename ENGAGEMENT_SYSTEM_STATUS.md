# Engagement System - Current Status & How It Works

## 🎯 Overview

The engagement layer is **fully implemented and operational** with a personality-based scoring pipeline that drives personalized recommendations. It uses a multi-factor scoring system to rank actions and learns from user behavior.

## 📍 API Endpoints

All endpoints are under `/api/v1/engagement` and require JWT authentication:

### 1. **GET `/api/v1/engagement/next-actions`**
Returns 1 primary action + 2 alternatives ranked by personality-based scoring.

**Response:**
```json
{
  "primary": {
    "id": "transport.tyre_pressure.monthly",
    "title": "Check tyre pressure monthly",
    "subtitle": "3-min action • ~₨300/mo",
    "type": "best",
    "category": "transport",
    "previewImpact": {
      "rupees": 300,
      "co2_kg": 0.077,
      "label": "Next ₹ win"
    },
    "whyShown": "Personality: TimeSaver • Picked for impact",
    "source": "Source: ZERRAH Catalog v1.0 • Last updated: 2025-01-15",
    "learn": {
      "summary": "Proper pressure can save up to ~10% fuel..."
    }
  },
  "alternatives": [
    {
      "id": "food.freeze_before_spoil_basics",
      "type": "quick_win",
      ...
    },
    {
      "id": "home.laundry_cold",
      "type": "level_up",
      ...
    }
  ]
}
```

### 2. **POST `/api/v1/engagement/action-done`**
Marks an action as done (idempotent per day). Supports learning from outcomes.

**Request:**
```json
{
  "recommendationId": "transport.tyre_pressure.monthly",
  "context": { "surface": "web", "variant": "A" },
  "outcome": "done"  // or "dismiss" or "snooze"
}
```

**Response:**
```json
{
  "ok": true,
  "verifiedImpact": {
    "rupees": 300,
    "co2_kg": 0.077
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

### 3. **GET `/api/v1/engagement/home-feed`**
Returns unified feed for "Your Week" sections.

### 4. **GET `/api/v1/engagement/weekly-recap`**
Returns weekly summary with impact metrics and share image data.

## 🧠 How the Scoring Works

### Step 1: Personality → Persona Vector
- Maps user's 10 archetypes (e.g., Strategist, Builder, Guardian) to a 4D persona vector:
  - **TimeSaver**: Values time efficiency
  - **MoneyMax**: Values cost savings
  - **EcoGuardian**: Values environmental impact
  - **SocialSharer**: Values community/social aspects

### Step 2: Persona → Weight Preferences
- Derives scoring weights from persona vector:
  - **TimeSaver** → Higher `time` and `effort` weights
  - **MoneyMax** → Higher `pkr` weight
  - **EcoGuardian** → Higher `co2` and `diversity` weights
  - **SocialSharer** → Higher `novelty` and `diversity` weights

### Step 3: Multi-Factor Scoring
Each recommendation is scored using 6 components:

```
score = utilityWeight * U - effortWeight * E + fitWeight * F + 
        noveltyWeight * N + recencyWeight * RC + diversityWeight * D
```

**Components:**
- **U (Utility)**: PKR savings, time saved, CO₂ impact
- **E (Effort)**: Steps, time required, purchase needed
- **F (Fit)**: Region match, tag overlap, channel preferences
- **N (Novelty)**: Inverse frequency of recent shows
- **RC (Recency Cooldown)**: Time since last action (7-day half-life)
- **D (Diversity)**: Category distribution (encourages variety)

### Step 4: MMR Ranking
- Uses Maximal Marginal Relevance (lambda=0.75) to select diverse recommendations
- Balances relevance (high scores) with diversity (different categories/tags)
- Returns top 3: 1 primary + 2 alternatives

### Step 5: Labeling
- **Primary**: Highest scored item
- **Quick Win**: Low CO₂ (≤0.25 kg) and low PKR (≤200)
- **Level Up**: High CO₂ (≥0.8 kg) OR high PKR (≥400)

## 🔄 Learning & Evolution

The system learns from user actions and adjusts weights:

### When User Marks Action "Done":
- ✅ +0.05 to top utility dimension (pkr/time/co2)
- ✅ -0.02 to effort (user is willing to do more)
- ✅ Updates streak counter
- ✅ Logs SHOWN/DONE events for novelty/recency

### When User "Dismisses":
- ❌ -0.03 to fit (action doesn't match preferences)
- ❌ -0.02 to novelty
- ✅ +0.05 to recency (show something else soon)

### When User "Snoozes":
- ⏰ +0.08 to recency (re-offer later)

**Weights are clamped to [0.5, 2.0]** to prevent extreme values.

## 🗄️ Database Tables

### `user_personalities` (Original)
- Stores personality quiz results
- Has `id`, `userId`, `personalityType`, `newPersonality`, etc.

### `user_personality_extended` (New - for scoring)
- Stores persona vector and weight preferences
- Evolves based on user actions
- Fields: `user_id`, `archetype_scores`, `persona_vector`, `weight_prefs`, `updated_at`

### `user_action_events` (New - for learning)
- Tracks SHOWN/DONE/DISMISS/SNOOZE events
- Used for novelty, recency cooldown, and diversity calculations

### `recommendation_catalog` (New - optional)
- Can store detailed recommendation metadata
- Currently uses Card-based catalog from `recommendationCatalogService`

### Existing Tables (unchanged):
- `user_actions`: Logs completed actions
- `user_streaks`: Tracks daily streaks
- `weekly_summaries`: Caches weekly impact data

## ⚙️ Feature Flags

Control via environment variables:

```bash
USE_ENHANCED_SCORING=true   # Use enhanced scoring (default: true)
USE_ENHANCED_LEARNING=true  # Use enhanced learning (default: true)
```

## 🔀 Integration Points

### Frontend Integration
- **Component**: `EngagementSection.tsx`
- **Service**: `frontend/src/services/engagementService.ts`
- **Location**: Full-screen section in `ResultsDisplay` (clickable from sidebar)

### Backend Flow
1. User requests `/api/v1/engagement/next-actions`
2. Controller uses `getNextActionsEnhanced()` (if enabled)
3. Service loads user personality → persona vector → weights
4. Scores all candidates using multi-factor formula
5. Ranks with MMR for diversity
6. Returns primary + 2 alternatives
7. Logs SHOWN events for learning

## 📊 Current State

### ✅ Working Features

1. **Personality-Based Scoring**: Fully operational
   - Maps archetypes to 4D persona vector
   - Derives weights from persona + context
   - Scores using 6-factor formula

2. **MMR Ranking**: Diverse selection
   - Balances relevance vs diversity
   - Prevents repetitive recommendations

3. **Learning System**: Online weight updates
   - Updates weights based on DONE/DISMISS/SNOOZE
   - Persists in `user_personality_extended`

4. **Idempotency**: Same-day action checks
   - Timezone-aware (Asia/Karachi)
   - Returns existing data if already processed

5. **Streak Tracking**: Daily engagement
   - Updates on action completion
   - Tracks current and longest streak

6. **Weekly Recap**: Aggregated impact
   - Calculates weekly savings
   - Provides share image data

### 🔧 Integration Status

- ✅ **API Endpoints**: All 4 endpoints operational
- ✅ **Database Models**: All tables created and synced
- ✅ **Scoring Pipeline**: Fully implemented
- ✅ **Learning System**: Weight updates working
- ✅ **Frontend Components**: React components ready
- ⚠️ **Catalog Seeding**: 59 recommendations ready to seed (run seed script)

### 📝 Data Sources

Currently uses:
- **Card-based catalog**: From `recommendationCatalogService` (existing)
- **Personality data**: From `UserPersonality` (quiz results)
- **Extended data**: From `UserPersonalityExtended` (scoring weights)

Future enhancement:
- **RecommendationCatalog table**: Can be populated with full 59-item catalog for richer metadata

## 🚀 Usage Example

### Get Next Actions
```bash
curl --cookie "zerrah_token=<JWT>" \
  http://localhost:3000/api/v1/engagement/next-actions
```

### Mark Action Done (with learning)
```bash
curl -X POST --cookie "zerrah_token=<JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "recommendationId": "transport.tyre_pressure.monthly",
    "outcome": "done"
  }' \
  http://localhost:3000/api/v1/engagement/action-done
```

## 📈 What Happens Behind the Scenes

1. **User requests next actions**
   → System loads personality → converts to persona vector → derives weights

2. **Scoring happens**
   → Each candidate scored on 6 factors → sorted by score

3. **MMR selection**
   → Top 3 diverse items selected → labeled as primary/quick_win/level_up

4. **User marks action done**
   → Weight preferences updated → event logged → streak updated → recommendations evolve

5. **Next request**
   → System uses updated weights → better personalization → improved recommendations

## 🎨 Frontend Display

The frontend shows:
- **Best Next Action Card**: Primary recommendation with impact chips
- **Alternative Cards**: Quick Win and Level Up options
- **Streak Ring**: Visual progress indicator
- **Action Toast**: Instant feedback on completion
- **Weekly Recap**: Summary with share functionality

## 🔮 Future Enhancements

1. **Catalog Integration**: Populate `RecommendationCatalog` table with full 59-item catalog
2. **Telemetry**: Log scoring components for analysis
3. **A/B Testing**: Compare enhanced vs baseline scoring
4. **Contextual Bandits**: Replace simple weight nudges with bandit algorithms
5. **Persona Evolution**: Weekly job to recompute persona from observed behavior

## ✅ Status: FULLY OPERATIONAL

The engagement system is production-ready and actively learning from user behavior. All core features are implemented and working.




