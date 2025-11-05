# Launch Guide: ZERRAH Engagement Layer

This guide will help you launch and test the new engagement layer components.

## Prerequisites

1. **Database Setup**: Ensure your PostgreSQL database is running and `DATABASE_URL` is configured
2. **Node.js**: Make sure you have Node.js installed (v18+ recommended)
3. **Dependencies**: Install all npm packages

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/your_database
JWT_SECRET=your_jwt_secret_here
COOKIE_NAME=zerrah_token
NODE_ENV=development
```

### Frontend (.env or .env.local)
```bash
VITE_API_BASE_URL=http://localhost:3000/api
# OR if using Vite proxy:
# VITE_API_BASE_URL=http://localhost:8080
```

## Step 3: Build Backend (TypeScript)

```bash
cd backend
npm run build
```

This compiles TypeScript to JavaScript in the `api/` directory.

## Step 4: Start Backend Server

```bash
cd backend
npm run dev
# OR
npm start
```

The backend should start on `http://localhost:3000`

**What happens on startup:**
- Database tables are created automatically (UserAction, UserStreak, WeeklySummary, AppConfig)
- Default engagement rules are initialized
- API endpoints are available at `/api/v1/engagement/*`

## Step 5: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend should start on `http://localhost:5173` (or similar port)

## Step 6: Access the Engagement Layer

### Option A: Via Dashboard (Recommended)

1. **Login first:**
   - Go to `http://localhost:5173/login`
   - Use any email (e.g., `test@example.com`)
   - Password: `1234` (demo password)
   - Click "Login"

2. **Navigate to Dashboard:**
   - After login, go to `http://localhost:5173/dashboard`
   - You should see the **Engagement Layer** at the top with:
     - "Your Best Next Action" header
     - Primary action card
     - Two alternative action cards (Quick Win & Level Up)
     - Weekly recap section (if you have actions)

### Option B: Direct URL

If you're already logged in, you can directly visit:
```
http://localhost:5173/dashboard
```

## Step 7: Test the Components

### Test Primary Action
1. Click "Mark Done" on the primary action card
2. You should see:
   - A toast notification with impact and streak
   - The action disappears from the list (refreshed)
   - Streak counter updates

### Test Alternative Actions
1. Click "Mark Done" on a Quick Win or Level Up card
2. Same toast notification appears

### Test Learn More
1. Click "Curious? Open details" on any card
2. The "Learn" section expands with more information

### Test Weekly Recap
1. After completing a few actions, scroll to the Weekly Recap card
2. Click "Share Win" to open the Share Composer
3. Export as PNG or use native share

### Test Streak Ring
1. Complete actions on consecutive days
2. The streak ring (top right) shows your progress
3. Hover to see tooltip: "Day X • Longest Y"

## Troubleshooting

### Issue: "Unauthorized" Error
**Solution:** Make sure you're logged in. The engagement endpoints require authentication.

### Issue: "User not found" Error
**Solution:** The user must exist in the database. Try logging in first, which creates the user.

### Issue: "No recommendations available"
**Solution:** 
- Ensure the recommendation catalog is loaded
- Check that the user has a personality assigned (take the quiz first)

### Issue: Database Connection Error
**Solution:**
- Check `DATABASE_URL` in backend `.env`
- Ensure PostgreSQL is running
- Verify database exists

### Issue: Frontend Can't Connect to Backend
**Solution:**
- Check `VITE_API_BASE_URL` in frontend `.env`
- Ensure backend is running on port 3000
- Check CORS settings in backend

### Issue: Components Not Showing
**Solution:**
- Check browser console for errors
- Verify API calls are successful (Network tab)
- Ensure user has completed the personality quiz (for personality-based recommendations)

## API Endpoints

Once running, you can test these endpoints:

```bash
# Get next actions (requires auth)
GET http://localhost:3000/api/v1/engagement/next-actions

# Mark action done (requires auth)
POST http://localhost:3000/api/v1/engagement/action-done
Body: { "recommendationId": "transport_no_car_day", "context": { "surface": "web" } }

# Get weekly recap (requires auth)
GET http://localhost:3000/api/v1/engagement/weekly-recap

# Get home feed (requires auth)
GET http://localhost:3000/api/v1/engagement/home-feed
```

## Development Tips

### Hot Reload
- Frontend: Changes auto-reload via Vite
- Backend: Use `npm run dev` with nodemon for auto-reload

### View Database Tables
```sql
-- Check user actions
SELECT * FROM user_actions;

-- Check streaks
SELECT * FROM user_streaks;

-- Check engagement rules
SELECT * FROM app_configs WHERE key = 'engagement_rules_v1';
```

### Update Engagement Rules
You can update the rules via the database:
```sql
UPDATE app_configs 
SET value = '{"version":"overlay-v1.0",...}'::jsonb 
WHERE key = 'engagement_rules_v1';
```

Rules are cached for 60 seconds, so changes take effect within a minute.

## Next Steps

1. **Test with Real Data**: Complete the personality quiz to get personalized recommendations
2. **Create Test Actions**: Mark several actions as done to see streak tracking
3. **Test Weekly Recap**: Wait for a week or manually adjust dates to see weekly summaries
4. **Customize Rules**: Update engagement rules to test different ranking logic

## Production Deployment

For production:
1. Set `NODE_ENV=production`
2. Build frontend: `npm run build`
3. Build backend: `npm run build`
4. Deploy to Vercel/your hosting platform
5. Update environment variables in production

