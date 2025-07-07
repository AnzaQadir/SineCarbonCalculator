# Welcome Email Edge Function

This Supabase Edge Function sends welcome emails to new users when they sign up.

## Features

- Listens for `auth.user.created` triggers
- Counts users in the database to determine queue number
- Sends personalized welcome emails using SendGrid
- Includes error handling and logging

## Setup

### 1. Environment Variables

Set these environment variables in your Supabase project:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SENDGRID_API_KEY=your_sendgrid_api_key
```

### 2. SendGrid Template

Create a dynamic template in SendGrid with ID `d-XXXXX` (replace with your actual template ID) that includes these variables:

- `{{firstName}}` - User's first name (falls back to "Friend")
- `{{queueNumber}}` - User's position in the signup queue

### 3. Database Trigger

Create a database trigger to call this function when a new user is created:

```sql
-- Create the trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function
  PERFORM net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/welcome-email',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body := json_build_object('user', NEW)::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## Deployment

### Deploy the Function

```bash
# Navigate to your project directory
cd /path/to/your/project

# Deploy the function
npx supabase functions deploy welcome-email --project-ref your-project-ref
```

### Verify Deployment

```bash
# List deployed functions
npx supabase functions list --project-ref your-project-ref

# Test the function locally (optional)
npx supabase functions serve welcome-email --env-file .env.local
```

## Configuration

### Update Template ID

Replace `d-XXXXX` in `index.ts` with your actual SendGrid template ID:

```typescript
templateId: 'd-XXXXX', // Replace with your actual SendGrid template ID
```

### Update Sender Email

Replace the sender email with your verified SendGrid sender:

```typescript
from: 'noreply@yourdomain.com', // Replace with your verified sender
```

## Testing

You can test the function by creating a new user in your Supabase project. The function will automatically:

1. Count existing users in the `users` table
2. Extract the user's first name from metadata
3. Send a welcome email with personalized content

## Error Handling

The function includes comprehensive error handling:

- Missing environment variables
- Invalid user data
- Database connection errors
- SendGrid API errors

All errors are logged and returned with appropriate HTTP status codes.

## Monitoring

Check the function logs in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to Edge Functions
3. Select the `welcome-email` function
4. View logs and execution history 