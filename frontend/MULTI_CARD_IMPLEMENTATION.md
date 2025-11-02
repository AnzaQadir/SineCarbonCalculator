# Multi-Card Engagement Dashboard - Implementation

## Overview

This document describes the new **Swipeable Multi-Card** engagement interface that presents users with multiple action options instead of just one.

## Architecture

### Backend Changes

#### New API Endpoint: `/v1/engagement/next-actions`

**Method**: GET  
**Response**:
```json
{
  "primary": {
    "id": "reco_123",
    "title": "Repair before replace",
    "category": "Waste & Consumption",
    "type": "best",
    "impact": {
      "rupees": 230,
      "co2_kg": 0.4,
      "label": "Next ₹ win"
    },
    "whyShown": "Personality: Builder • Priority match"
  },
  "alternatives": [
    {
      "id": "reco_456",
      "title": "Skip plastic cutlery this week",
      "category": "Waste Reduction",
      "type": "quick_win",
      "impact": {
        "rupees": 70,
        "co2_kg": 0.1
      },
      "whyShown": "Quick & easy win"
    },
    {
      "id": "reco_789",
      "title": "Host a clothing swap",
      "category": "Community",
      "type": "level_up",
      "impact": {
        "rupees": 480,
        "co2_kg": 1.2
      },
      "whyShown": "Level up challenge"
    }
  ]
}
```

#### Card Types

1. **Best Next Action** (Primary)
   - Highest ranked based on personality
   - Always shown first
   - Blue/cyan gradient

2. **Quick Win** (Alternative)
   - Impact < ₹150/year
   - Green gradient
   - Easy, low-friction actions

3. **Level Up** (Alternative)
   - Impact ≥ ₹150/year
   - Purple/pink gradient
   - More challenging actions

#### Implementation Details

**File**: `backend/src/services/engagementService.ts`

- New method: `getNextActions(userId: string)`
- Returns top 3 ranked recommendations
- Classifies alternatives as quick win or level up based on `quickWinsThreshold`

**File**: `backend/src/controllers/engagementController.ts`

- New method: `getNextActions(req, res)`
- Wraps the service method
- Returns 401 if not authenticated

**File**: `backend/src/routes/engagementRoutes.ts`

- New route: `GET /next-actions`

### Frontend Changes

#### New Components

1. **SwipeableActionCards**
   - File: `frontend/src/components/engagement/SwipeableActionCards.tsx`
   - Carousel interface with swipe/click navigation
   - Shows one card at a time with navigation dots
   - Handles action completion
   - Shows toast notifications

2. **MultiCardEngagementDashboard**
   - File: `frontend/src/components/engagement/MultiCardEngagementDashboard.tsx`
   - Main dashboard wrapper
   - Fetches data from `/next-actions`
   - Integrates streak, toast, and weekly recap

#### API Integration

**File**: `frontend/src/services/engagementApi.ts`

- New interface: `NextAction`
- New interface: `NextActionsResponse`
- New function: `getNextActions()`

#### Usage

Replace the single-card dashboard with the multi-card version:

```tsx
// Old (single card)
import { EngagementDashboard } from '@/components/engagement/EngagementDashboard';

// New (multi-card)
import { MultiCardEngagementDashboard } from '@/components/engagement/MultiCardEngagementDashboard';

// In your component
<MultiCardEngagementDashboard profileImage={user.profileImage} />
```

## UX Flow

1. **Initial Load**
   - User sees "Best Next Action" card (primary)
   - Can swipe/click to see alternatives
   - Navigation dots show current position

2. **Card Interaction**
   - Click arrow buttons or dots to navigate
   - Swipe on touch devices (future enhancement)
   - Each card shows different impact metrics

3. **Action Completion**
   - User clicks "Mark Done" on any card
   - Toast shows impact + streak
   - All cards refresh after 2 seconds

4. **Idempotency**
   - User can only complete one action per day
   - Completed cards show "Done Today" badge
   - Still swipable but not clickable

## Card Design

### Best Next Action
- **Color**: Blue to Cyan gradient
- **Icon**: TrendingUp
- **Badge**: "Best Next Action"
- **Position**: Primary (always shown first)

### Quick Win
- **Color**: Green to Emerald gradient
- **Icon**: Zap
- **Badge**: "Quick Win"
- **Criteria**: Impact < ₹150/year

### Level Up
- **Color**: Purple to Pink gradient
- **Icon**: TrendingUp
- **Badge**: "Level Up"
- **Criteria**: Impact ≥ ₹150/year

## Analytics

When recording action done, the `variant` parameter is set to `'B'` to distinguish multi-card usage:

```typescript
recordActionDone(actionId, { 
  surface: 'web',
  variant: 'B' // Multi-card interface
});
```

## Backward Compatibility

- Original single-card endpoint (`/best-next-action`) remains functional
- Original `EngagementDashboard` component still works
- Both interfaces can coexist for A/B testing

## Configuration

Thresholds defined in `backend/src/config/engagementRules.json`:

```json
{
  "quickWinsThreshold": {
    "co2_kg": 0.2,
    "rupees": 150
  },
  "levelUpThreshold": {
    "co2_kg": 1.0,
    "rupees": 500
  }
}
```

## Future Enhancements

1. **Touch Swipe Gestures**
   - Implement Framer Motion `drag` handlers
   - Add swipe velocity detection
   - Haptic feedback on mobile

2. **Card Collapse After Completion**
   - Hide completed cards
   - Show summary of completed actions

3. **Dynamic Card Order**
   - Allow users to reorder favorites
   - Remember preferred card type

4. **Infinite Scroll**
   - Load more alternatives on scroll
   - Lazy load card data

## Testing

### Manual Testing Checklist

- [ ] Load dashboard - should show primary card
- [ ] Navigate with arrows - should slide between cards
- [ ] Navigate with dots - should jump to specific card
- [ ] Click "Mark Done" - should show toast and refresh
- [ ] Complete action - should show "Done Today" on that card
- [ ] Try to complete same action twice - should be idempotent
- [ ] Check mobile responsiveness
- [ ] Verify gradient colors match card type

### API Testing

```bash
# Test new endpoint
curl http://localhost:3001/api/v1/engagement/next-actions \
  -H "Cookie: YOUR_SESSION_COOKIE"

# Should return primary + alternatives
```

## Rollout Plan

1. **Phase 1**: Deploy backend endpoint (completed)
2. **Phase 2**: Deploy frontend components (current)
3. **Phase 3**: A/B test with 50% users
4. **Phase 4**: Monitor analytics (conversion, engagement)
5. **Phase 5**: Full rollout or rollback based on results

---

**Status**: ✅ Backend Complete | 🚧 Frontend Complete | ⏳ Integration Pending  
**Date**: January 2025  
**Version**: 2.0
