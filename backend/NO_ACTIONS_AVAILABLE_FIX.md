# Fix: "No actions available" Error

## Problem

The error `{"error":"No actions available"}` occurs when:
1. All catalog items are filtered out by personality/done/dismissed/snoozed filters
2. MMR ranking returns 0 items
3. No scored items are available

## Solution Implemented

### 1. Progressive Filter Relaxation

The system now progressively relaxes filters if all candidates are removed:

1. **Initial Filters**: Apply personality, done-today, dismissed (30 days), snoozed (7 days)
2. **First Fallback**: If all filtered out → Relax snooze filter (allow snoozed items)
3. **Second Fallback**: If still empty → Remove all cooldown filters (only exclude done today)
4. **Final Fallback**: If still empty → Show everything (even if done today)

### 2. MMR Fallback

If MMR ranking returns 0 items but we have scored items:
- Use top scored items directly (bypass MMR)
- Return those as recommendations

### 3. Empty State Instead of Error

Instead of throwing errors, the system now:
- Returns `{ primary: null, alternatives: [] }` when no recommendations available
- Frontend handles this gracefully with "You're all caught up!" message
- No error thrown, just empty state

### 4. Enhanced Logging

Added detailed logging at each filter step:
```
[Enhanced Engagement] Initial candidates from catalog: X
[Enhanced Engagement] After personality filter: X
[Enhanced Engagement] After done-today filter: X
[Enhanced Engagement] After cooldown filters: X
[Enhanced Engagement] Scored X items. Top 3 scores: [...]
[Enhanced Engagement] MMR selected X items
```

## Debugging Steps

### Check Backend Logs

When you see "No actions available", check the backend console for:

1. **Catalog Size**: `Initial candidates from catalog: X`
   - If 0: Catalog might not be loaded
   - Solution: Verify catalog files are imported correctly

2. **Personality Filter**: `After personality filter: X`
   - If 0: Personality doesn't match any catalog items
   - Solution: Check if personality is set correctly

3. **Done Today**: `After done-today filter: X`
   - If all removed: All items were done today
   - Solution: Wait for tomorrow or check if filtering is too strict

4. **Cooldown Filters**: `After cooldown filters: X`
   - If all removed: All items dismissed/snoozed recently
   - Solution: System should auto-relax, but check logs

5. **Scoring**: `Scored X items`
   - If 0: All items had negative scores
   - Solution: Check scoring weights and metrics

6. **MMR**: `MMR selected X items`
   - If 0: MMR couldn't find diverse items
   - Solution: Fallback to top scored should trigger

### Common Causes

1. **Catalog Empty**
   - Check: `queryCatalog({}).length`
   - Fix: Ensure catalog files are loaded

2. **All Items Done Today**
   - Check: `suppressedCount` in logs
   - Fix: System now shows all items if this happens

3. **All Items Dismissed/Snoozed**
   - Check: `dismissedCount`, `snoozedCount` in logs
   - Fix: System now relaxes filters automatically

4. **Personality Mismatch**
   - Check: `User personality: XXX` in logs
   - Fix: System now falls back to all items if personality filter removes everything

## Testing

To test if recommendations work:

```bash
# Check catalog size
curl http://localhost:3000/api/v1/engagement/next-actions \
  -H "Cookie: zerrah_token=YOUR_TOKEN" \
  -v | jq
```

## Expected Behavior

✅ **No errors thrown** - Returns empty state instead
✅ **Progressive fallback** - Relaxes filters automatically
✅ **Detailed logging** - Shows exactly where filtering happens
✅ **Always returns something** - Even if just empty state

## Type Updates

Updated `NextActionsResponse` to allow `primary: NextAction | null`:
- Backend can return empty state
- Frontend handles gracefully
- No breaking changes to API contract




