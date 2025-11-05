# Engagement Layer API Verification

## API Endpoints Summary

### Backend Routes (Base: `/api/v1/engagement`)
All routes require JWT authentication via `requireAuth` middleware.

1. **GET `/api/v1/engagement/next-actions`**
   - Returns: `NextActionsResponse` with primary and alternatives
   - Auth: Required (JWT cookie)
   - Handler: `getNextActionsHandler`

2. **POST `/api/v1/engagement/action-done`**
   - Body: `{ recommendationId: string, context?: { surface?: string, variant?: string } }`
   - Returns: `ActionDoneResponse` with impact, streak, and bonus
   - Auth: Required (JWT cookie)
   - Handler: `actionDoneHandler`

3. **GET `/api/v1/engagement/weekly-recap`**
   - Returns: `WeeklyRecap` with savings, actions count, and share image
   - Auth: Required (JWT cookie)
   - Handler: `getWeeklyRecapHandler`

4. **GET `/api/v1/engagement/home-feed`**
   - Returns: Home feed with categorized actions
   - Auth: Required (JWT cookie)
   - Handler: `getHomeFeedHandler`

## Frontend API Calls

### Base URL Configuration
- Uses `API_BASE_URL` from `@/services/api`
- Automatically handles `/api` prefix or full URL
- Includes credentials for cookie-based auth

### Service Functions (`engagementService.ts`)
All functions use:
- `credentials: 'include'` for cookie-based auth
- Proper error handling with detailed messages
- JSON parsing for error responses

1. `getNextActions()` → `GET ${API_BASE_URL}/v1/engagement/next-actions`
2. `markActionDone(recommendationId, context)` → `POST ${API_BASE_URL}/v1/engagement/action-done`
3. `getWeeklyRecap()` → `GET ${API_BASE_URL}/v1/engagement/weekly-recap`
4. `getHomeFeed()` → `GET ${API_BASE_URL}/v1/engagement/home-feed`

## Authentication Flow

1. User logs in via `/api/auth/login`
2. JWT token stored in cookie: `zerrah_token`
3. Middleware `requireAuth` extracts token from cookie
4. Token verified to get `userEmail`
5. `getUserIdFromEmail` converts email to user ID
6. User ID used for all engagement operations

## Error Handling

### Frontend
- All API calls catch errors and return `null` gracefully
- Detailed error messages parsed from JSON responses
- Console logging for debugging with `[Engagement]` prefix
- User-friendly alerts for critical errors

### Backend
- Try-catch blocks in all handlers
- Proper HTTP status codes (401, 404, 500)
- Error messages in JSON format
- Console logging for debugging

## Testing the APIs

### Manual Testing

1. **Test Authentication:**
   ```bash
   # Login first
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"1234"}' \
     -c cookies.txt
   ```

2. **Test Next Actions:**
   ```bash
   curl http://localhost:3000/api/v1/engagement/next-actions \
     -b cookies.txt
   ```

3. **Test Action Done:**
   ```bash
   curl -X POST http://localhost:3000/api/v1/engagement/action-done \
     -H "Content-Type: application/json" \
     -b cookies.txt \
     -d '{"recommendationId":"transport_no_car_day","context":{"surface":"web"}}'
   ```

4. **Test Weekly Recap:**
   ```bash
   curl http://localhost:3000/api/v1/engagement/weekly-recap \
     -b cookies.txt
   ```

## Common Issues & Solutions

### Issue: 401 Unauthorized
**Cause:** User not logged in or token expired
**Solution:** Login again via `/api/auth/login`

### Issue: 404 User not found
**Cause:** User email doesn't exist in database
**Solution:** User must sign up first or login creates user

### Issue: No recommendations available
**Cause:** No recommendations match personality or all are done
**Solution:** Check personality assignment and recommendation catalog

### Issue: CORS errors
**Cause:** Frontend and backend on different origins
**Solution:** Check CORS configuration in `backend/src/index.ts`

## Debugging Tips

1. **Check Browser Console:**
   - Look for `[Engagement]` prefixed logs
   - Check Network tab for API calls
   - Verify request/response payloads

2. **Check Backend Logs:**
   - Console logs in controllers show errors
   - Database queries logged if needed
   - Check authentication middleware

3. **Verify Database:**
   - Ensure tables exist: `user_actions`, `user_streaks`, `weekly_summaries`, `app_configs`
   - Check user exists in `users` table
   - Verify user has personality in `user_personalities` table

## API Flow Diagram

```
User clicks "Next Actions" button
    ↓
EngagementSection component mounts
    ↓
useEffect triggers
    ↓
Parallel API calls:
  - getNextActions() → GET /api/v1/engagement/next-actions
  - getWeeklyRecap() → GET /api/v1/engagement/weekly-recap
    ↓
Backend:
  - requireAuth middleware checks JWT cookie
  - getUserIdFromEmail converts email to user ID
  - engagementService.getNextActions(userId)
    - Loads user personality
    - Queries recommendation catalog
    - Filters done actions
    - Ranks by rules
    - Returns primary + alternatives
    ↓
Frontend displays:
  - Primary action card
  - Alternative action cards
  - Weekly recap (if available)
    ↓
User clicks "Mark Done"
    ↓
markActionDone(recommendationId) → POST /api/v1/engagement/action-done
    ↓
Backend:
  - Creates UserAction record
  - Updates UserStreak
  - Returns impact + streak
    ↓
Frontend:
  - Shows toast notification
  - Refreshes next actions
  - Updates streak ring
```

