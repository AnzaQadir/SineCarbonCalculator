# Event Types in Database - Documentation

## Overview

All user actions are tracked with **distinct event types** in the `user_action_events` table. This allows the system to differentiate between different user behaviors and learn from each type separately.

## Event Types

The database supports **4 distinct event types**:

1. **`SHOWN`** - Recommendation was displayed to the user
2. **`DONE`** - User clicked "Do it now" (completed the action)
3. **`SNOOZE`** - User clicked "Save for later" (deferred)
4. **`DISMISS`** - User clicked "Not useful" (rejected)

## Database Schema

### Table: `user_action_events`

```sql
CREATE TABLE user_action_events (
  user_id UUID NOT NULL,
  recommendation_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('SHOWN', 'DONE', 'DISMISS', 'SNOOZE')),
  occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, recommendation_id, event_type, occurred_at)
);
```

**Composite Primary Key**: `(user_id, recommendation_id, event_type, occurred_at)`

This allows:
- Multiple events of the **same type** for the same recommendation (with different timestamps)
- Different event types for the **same recommendation** (e.g., SHOWN → SNOOZE → DONE)
- Tracking the **full history** of user interactions

### Indexes

```sql
CREATE INDEX idx_user_action_events_user_time ON user_action_events (user_id, occurred_at);
CREATE INDEX idx_user_action_events_recommendation ON user_action_events (recommendation_id);
CREATE INDEX idx_user_action_events_user_type ON user_action_events (user_id, event_type);
CREATE INDEX idx_user_action_events_type ON user_action_events (event_type);
```

## Event Type Mapping

### Frontend → Backend Mapping

| Frontend Button | Outcome | Database Event Type |
|----------------|---------|---------------------|
| "Do it now" | `done` | `DONE` |
| "Save for later" | `snooze` | `SNOOZE` |
| "Not useful" | `dismiss` | `DISMISS` |
| (Auto-logged) | - | `SHOWN` |

### Code Mapping

```typescript
// backend/src/services/engagement/eventTypes.ts
export function outcomeToEventType(outcome: ActionOutcome): ActionEventType {
  const mapping: Record<ActionOutcome, ActionEventType> = {
    done: 'DONE',
    snooze: 'SNOOZE',
    dismiss: 'DISMISS',
  };
  return mapping[outcome];
}
```

## How Each Event Type is Used

### 1. SHOWN Events
- **When**: Automatically logged when recommendations are displayed
- **Purpose**: Track novelty (how often shown recently)
- **Used in**: Novelty scoring, diversity tracking
- **Filter**: None (always allowed)

### 2. DONE Events
- **When**: User clicks "Do it now"
- **Purpose**: Track completed actions, update streaks, calculate impact
- **Used in**: 
  - Impact calculation (rupees, CO₂ saved)
  - Streak counter updates
  - Recency cooldown (won't show again for ~7 days)
  - Weight learning (boost utility preferences)
- **Additional Action**: Also creates `UserAction` record for impact tracking

### 3. SNOOZE Events
- **When**: User clicks "Save for later"
- **Purpose**: Defer action for later consideration
- **Used in**: 
  - Short cooldown (7 days) - can re-offer soon
  - Weight learning (boost recency weight)
  - Filtering (exclude from next actions for 7 days)
- **Additional Action**: None (no impact tracked)

### 4. DISMISS Events
- **When**: User clicks "Not useful"
- **Purpose**: Strong negative signal
- **Used in**: 
  - Long cooldown (30 days) - won't show again soon
  - Score penalty (-30% base score if dismissed in last 30 days)
  - Weight learning (reduce fit/novelty, boost recency)
  - Filtering (exclude from next actions for 30 days)
- **Additional Action**: None (no impact tracked)

## Querying Event Types

### Get All Events for a User

```typescript
const allEvents = await UserActionEvent.findAll({
  where: { userId },
  order: [['occurredAt', 'DESC']],
});
```

### Get Events by Type

```typescript
// DONE events only
const doneEvents = await UserActionEvent.findAll({
  where: { userId, eventType: 'DONE' },
});

// DISMISS events only
const dismissedEvents = await UserActionEvent.findAll({
  where: { userId, eventType: 'DISMISS' },
});

// SNOOZE events only
const snoozedEvents = await UserActionEvent.findAll({
  where: { userId, eventType: 'SNOOZE' },
});
```

### Get Events for a Specific Recommendation

```typescript
const recommendationEvents = await UserActionEvent.findAll({
  where: {
    userId,
    recommendationId: 'transport.tyre_pressure.monthly',
  },
  order: [['occurredAt', 'ASC']],
});
// Returns: [SHOWN, SNOOZE, SHOWN, DONE] - full history
```

## Learning from Event Types

### Weight Updates by Event Type

| Event Type | Weight Changes |
|------------|---------------|
| `DONE` | `+0.05` utility dimension, `-0.02` effort |
| `DISMISS` | `-0.03` fit, `-0.02` novelty, `+0.05` recency |
| `SNOOZE` | `+0.08` recency |

### Scoring Impact

- **DONE**: Included in recency cooldown (7-day half-life)
- **DISMISS**: Strong penalty (-30% score) if dismissed in last 30 days
- **SNOOZE**: Short cooldown (7 days), no score penalty
- **SHOWN**: Used for novelty calculation (frequency penalty)

## Example Event Flow

```
1. User sees recommendation → SHOWN event logged
2. User clicks "Save for later" → SNOOZE event logged
3. 7 days later, recommendation shown again → SHOWN event logged
4. User clicks "Do it now" → DONE event logged
5. UserAction record created (impact tracked)
6. Streak updated
7. Recommendation won't appear again for ~7 days (cooldown)
```

## Analytics Queries

### Count Events by Type

```sql
SELECT 
  event_type,
  COUNT(*) as count
FROM user_action_events
WHERE user_id = :userId
GROUP BY event_type;
```

### Conversion Rate (SHOWN → DONE)

```sql
SELECT 
  COUNT(DISTINCT CASE WHEN event_type = 'DONE' THEN recommendation_id END) * 100.0 / 
  COUNT(DISTINCT CASE WHEN event_type = 'SHOWN' THEN recommendation_id END) as conversion_rate
FROM user_action_events
WHERE user_id = :userId;
```

### Most Dismissed Recommendations

```sql
SELECT 
  recommendation_id,
  COUNT(*) as dismiss_count
FROM user_action_events
WHERE event_type = 'DISMISS'
GROUP BY recommendation_id
ORDER BY dismiss_count DESC
LIMIT 10;
```

## Best Practices

1. **Always log SHOWN** when displaying recommendations
2. **Log the correct event type** based on user action
3. **Query by event type** when filtering or scoring
4. **Use composite key** for idempotency (same event can't be logged twice at same timestamp)
5. **Index on event_type** for fast filtering

## Migration Notes

If you need to add new event types in the future:

1. Update `UserActionEvent` model validation
2. Update `eventTypes.ts` type definitions
3. Update database CHECK constraint
4. Update any hardcoded event type checks in code

## Summary

✅ **All three outcomes (done, snooze, dismiss) are stored as different event types**
✅ **Each event type has distinct behavior in scoring and learning**
✅ **Full history is preserved (can see SHOWN → SNOOZE → DONE flow)**
✅ **Indexes enable fast queries by event type**
✅ **Composite primary key prevents duplicates while allowing multiple events**




