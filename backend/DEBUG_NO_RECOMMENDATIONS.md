# Debugging: No Recommendations Showing

## Possible Causes

1. **Catalog Not Loading**
   - Check if `queryCatalog()` returns any items
   - Verify catalog files are imported correctly
   - Check console logs for "[Enhanced Engagement] Initial candidates from catalog: X"

2. **Personality Filter Too Strict**
   - User might not have a personality set
   - Personality might not match any catalog items
   - Check console logs for "[Enhanced Engagement] After personality filter: X"

3. **All Items Filtered Out**
   - All items might be done today
   - All items might be dismissed/snoozed
   - Check console logs for filtering counts

4. **Scoring Issues**
   - All items might have negative scores
   - MMR ranking might return 0 items
   - Check console logs for "[Enhanced Engagement] Scored X items"

## Debugging Steps

### 1. Check Backend Logs

When calling `/api/v1/engagement/next-actions`, look for:
```
[Enhanced Engagement] Initial candidates from catalog: X
[Enhanced Engagement] User personality: XXX
[Enhanced Engagement] After personality filter: X
[Enhanced Engagement] Catalog items after filtering: X
[Enhanced Engagement] Scored X items. Top 3 scores: [...]
[Enhanced Engagement] MMR selected X items
```

### 2. Check Database

```sql
-- Check if user has personality
SELECT * FROM user_personalities WHERE user_id = 'USER_ID';

-- Check action events
SELECT event_type, COUNT(*) 
FROM user_action_events 
WHERE user_id = 'USER_ID' 
GROUP BY event_type;

-- Check done today
SELECT COUNT(*) 
FROM user_actions 
WHERE user_id = 'USER_ID' 
AND occurred_at >= CURRENT_DATE;
```

### 3. Test Catalog Directly

```typescript
import { queryCatalog } from './services/recommendationCatalogService';

const all = queryCatalog({});
console.log('Total catalog items:', all.length);

const withPersonality = queryCatalog({ persona: 'Strategist' });
console.log('Items for Strategist:', withPersonality.length);
```

### 4. Check API Response

```bash
curl -X GET http://localhost:3000/api/v1/engagement/next-actions \
  -H "Cookie: zerrah_token=YOUR_TOKEN" \
  -v
```

## Common Fixes

1. **No Personality Set**
   - Ensure user completes quiz
   - Check `user_personalities` table has entry

2. **Catalog Empty**
   - Verify catalog files exist
   - Check imports in `recommendationCatalogService.ts`

3. **All Filtered Out**
   - Temporarily disable filters in `enhancedEngagementService.ts`
   - Check `suppressed`, `dismissed`, `snoozed` counts

4. **Scoring Issues**
   - Check if weights are reasonable
   - Verify metrics exist in catalog items

## Quick Test

Add this to your controller temporarily:

```typescript
// Test endpoint
router.get('/test-catalog', async (req, res) => {
  const { queryCatalog } = require('../services/recommendationCatalogService');
  const all = queryCatalog({});
  const withPersona = queryCatalog({ persona: 'Strategist', maxItems: 10 });
  
  res.json({
    total: all.length,
    withPersona: withPersona.length,
    sample: withPersona.slice(0, 3).map(c => ({ id: c.id, action: c.action })),
  });
});
```




