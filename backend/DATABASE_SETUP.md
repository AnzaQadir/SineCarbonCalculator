# Database Setup Guide

This guide will help you set up a PostgreSQL database using Supabase and connect it to your Express backend using Sequelize.

## 1. Create Supabase Project

1. Go to [Supabase](https://app.supabase.com/)
2. Sign in and click **New Project**
3. Fill in:
   - **Project Name**: `zerrah-db` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose a region close to your users
4. Click **Create new project**
5. Wait 2-3 minutes for the database to be provisioned

## 2. Get Database Connection String

1. In your Supabase project, go to **Settings** → **Database**
2. Find the **Connection string** section
3. Copy the **URI** format connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

## 3. Set Up Environment Variables

### Local Development
1. Copy your connection string
2. Create/update your `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

### Production (Vercel)
1. Go to your project on [Vercel](https://vercel.com/)
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string
   - **Environment**: Production (and Preview if needed)
4. Save the variable

## 4. Test Database Connection

Run the database test script:
```bash
cd backend
npm run test:db
```

You should see:
```
Testing database connection...
✅ Database initialized successfully
Testing user creation...
✅ User created: [UUID]
Testing user retrieval...
✅ User retrieved: test@example.com
Testing user count...
✅ User count: 1
Testing activity tracking...
✅ Activity tracked: SIGNUP
Testing user activities...
✅ User activities count: 1
🎉 All database tests passed!
```

## 5. Database Schema

The application creates two tables:

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `firstName` (String, Optional)
- `age` (String, Optional)
- `gender` (String, Optional)
- `profession` (String, Optional)
- `country` (String, Optional)
- `city` (String, Optional)
- `household` (String, Optional)
- `waitlistPosition` (Integer)
- `ctaVariant` (String, 'A' or 'B')
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

### User Activities Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key to Users)
- `activityType` (String: 'SIGNUP', 'EMAIL_SENT', 'COMMUNITY_JOINED', 'PROFILE_UPDATED')
- `metadata` (JSONB, Optional)
- `createdAt` (Timestamp)

## 6. Deploy to Production

1. Push your changes to GitHub
2. Vercel will automatically redeploy
3. The database tables will be created automatically on first run
4. Test the signup flow on your live site

## 7. Monitoring and Management

### View Data in Supabase
1. Go to your Supabase project
2. Navigate to **Table Editor**
3. You can view and manage your `users` and `user_activities` tables

### Database Logs
- Check Vercel function logs for database connection issues
- Supabase provides query logs in the **Logs** section

## 8. Troubleshooting

### Connection Issues
- Verify your `DATABASE_URL` is correct
- Check that your Supabase project is active
- Ensure your IP is not blocked (check Supabase settings)

### SSL Issues
- The code automatically handles SSL for production
- For local development, SSL is disabled

### Migration Issues
- Tables are created automatically using `sequelize.sync()`
- For production migrations, consider using Sequelize migrations

## 9. Security Best Practices

1. **Never commit secrets**: Your `.env` file should be in `.gitignore`
2. **Use environment variables**: All database credentials should be in environment variables
3. **Regular backups**: Supabase provides automatic backups
4. **Monitor usage**: Keep an eye on your Supabase usage limits

## 10. Next Steps

- Set up database migrations for schema changes
- Add database indexes for better performance
- Implement connection pooling for high traffic
- Set up monitoring and alerting
- Consider implementing database backups

## Support

If you encounter issues:
1. Check the Supabase documentation
2. Review the Sequelize documentation
3. Check Vercel deployment logs
4. Test locally with the provided test script 