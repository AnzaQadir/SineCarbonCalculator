# Engagement Action Buttons - Implementation

## Overview

Replaced the single "Mark Done" button with three action buttons:
1. **Do it now** → Outcome: `done`
2. **Save for later** → Outcome: `snooze`
3. **Not useful** → Outcome: `dismiss`

## Frontend Changes

### Components Updated

1. **BestNextActionCard.tsx**
   - Replaced single button with 3-button layout
   - "Do it now": Primary gradient button (teal to emerald)
   - "Save for later": Secondary slate button
   - "Not useful": Red button for dismissal
   - Changed prop from `onDone` to `onAction(outcome)`

2. **AlternativeActionCard.tsx**
   - Same 3-button layout (stacked vertically)
   - "Do it now": Full width gradient button
   - "Save for later" and "Not useful": Side-by-side smaller buttons
   - Changed prop from `onDone` to `onAction(outcome)`

3. **EngagementSection.tsx**
   - Updated `handleActionDone` → `handleAction(recommendationId, outcome)`
   - Only shows toast and updates streak for "done" outcomes
   - Refreshes actions for "done" and "dismiss" (removes from list)
   - "snooze" actions remain in the list (saved for later)

4. **engagementService.ts**
   - Updated `markActionDone` to accept `outcome` parameter
   - Defaults to `'done'` for backward compatibility

## Backend Changes

### Controller Updates

**engagementController.ts**
- Accepts `outcome` parameter from request body
- Validates outcome: `'done'`, `'snooze'`, or `'dismiss'`
- Defaults to `'done'` if not provided (backward compatible)
- Routes to `markDoneAndLearn` with the outcome

### Learning Service

**learning.ts - markDoneAndLearn()**
- Handles all three outcomes:
  - **done**: Creates UserAction, updates streak, returns impact + bonus
  - **snooze**: Logs SNOOZE event, updates weights (+0.08 recency), no impact
  - **dismiss**: Logs DISMISS event, updates weights (-0.03 fit, -0.02 novelty, +0.05 recency), no impact

## Button Behavior

### "Do it now" (done)
- ✅ Creates UserAction record
- ✅ Updates streak counter
- ✅ Returns impact (rupees, CO₂)
- ✅ Shows toast notification
- ✅ May award bamboo bonus (15% chance)
- ✅ Removes from next actions list
- ✅ Updates weights: +0.05 utility dim, -0.02 effort

### "Save for later" (snooze)
- ⏰ Logs SNOOZE event
- ⏰ Updates weights: +0.08 recency (re-offer later)
- ⏰ Does NOT create UserAction
- ⏰ Does NOT update streak
- ⏰ Does NOT show toast
- ⏰ Does NOT remove from list (stays for later)

### "Not useful" (dismiss)
- ❌ Logs DISMISS event
- ❌ Updates weights: -0.03 fit, -0.02 novelty, +0.05 recency
- ❌ Does NOT create UserAction
- ❌ Does NOT update streak
- ❌ Does NOT show toast
- ❌ Removes from next actions list
- ❌ Won't reappear for several days (high recency cooldown)

## UI Design

### Primary Action Card (BestNextActionCard)
- 3 buttons in a row (responsive: stacks on mobile)
- "Do it now": Full-width gradient button
- "Save for later": Secondary slate button
- "Not useful": Red button

### Alternative Cards (AlternativeActionCard)
- "Do it now": Full-width gradient button (top)
- "Save for later" and "Not useful": Side-by-side smaller buttons (bottom row)

## API Request Format

```json
POST /api/v1/engagement/action-done
{
  "recommendationId": "transport.tyre_pressure.monthly",
  "outcome": "done",  // or "snooze" or "dismiss"
  "context": {
    "surface": "web",
    "variant": "A"
  }
}
```

## Response Format

### For "done" outcomes:
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

### For "snooze" or "dismiss" outcomes:
```json
{
  "ok": true,
  "verifiedImpact": {
    "rupees": 0,
    "co2_kg": 0
  },
  "streak": {
    "current": 5,
    "longest": 12
  }
}
```

## Learning Impact

The system learns from all three outcomes:

- **Done**: User likes this type → boost utility weights
- **Snooze**: User wants to see it later → boost recency (re-offer soon)
- **Dismiss**: User doesn't like this → reduce fit/novelty, boost recency (won't show again soon)

## Testing

Test all three buttons:
1. Click "Do it now" → Should see toast, streak update, action removed
2. Click "Save for later" → Action stays, no toast, weights updated
3. Click "Not useful" → Action removed, no toast, weights updated

All outcomes are logged and influence future recommendations!




