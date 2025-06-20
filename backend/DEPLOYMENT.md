# Backend Deployment Guide - Vercel

This guide will help you deploy your Express.js backend to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm i -g vercel`
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, etc.)

## Step 1: Prepare Your Environment Variables

1. Copy your `.env.example` to `.env` and fill in your production values:
   ```bash
   cp env.example .env
   ```

2. Make sure your `.env` file contains all necessary environment variables for production.

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy your application**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new one
   - Set project name (e.g., `carbon-calc-backend`)
   - Confirm deployment settings

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

### Option B: Using Vercel Dashboard

1. **Push your code to GitHub/GitLab**
2. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
3. **Click "New Project"**
4. **Import your repository**
5. **Configure the project**:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 3: Configure Environment Variables

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all variables from your `.env` file

2. **Important variables to set**:
   - `NODE_ENV=production`
   - `PORT=3000` (Vercel will override this)
   - Any API keys or database URLs

## Step 4: Verify Deployment

1. **Check your deployment URL** (provided by Vercel)
2. **Test the health endpoint**: `https://your-app.vercel.app/health`
3. **Test your API endpoints**:
   - `https://your-app.vercel.app/api/personality`
   - `https://your-app.vercel.app/api/recommendations`

## Step 5: Update Frontend Configuration

Update your frontend API configuration to use the new Vercel URL:

```typescript
// In your frontend API configuration
const API_BASE_URL = 'https://your-app.vercel.app/api';
```

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that TypeScript compiles locally: `npm run build`
   - Ensure all dependencies are in `package.json`

2. **Environment Variables**:
   - Make sure all required env vars are set in Vercel dashboard
   - Check that variable names match exactly

3. **CORS Issues**:
   - Update CORS configuration in `src/index.ts` to allow your frontend domain

4. **Port Issues**:
   - Vercel automatically sets the port, so don't hardcode it

### Useful Commands:

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Remove deployment
vercel remove

# Update environment variables
vercel env add
```

## Continuous Deployment

Once set up, Vercel will automatically deploy when you push to your main branch. Each push creates a new deployment with a unique URL for testing.

## Production Considerations

1. **Database**: Ensure your database is accessible from Vercel's servers
2. **API Keys**: Store sensitive keys in Vercel environment variables
3. **CORS**: Configure CORS to allow only your frontend domain
4. **Rate Limiting**: Consider adding rate limiting for production
5. **Monitoring**: Set up monitoring and logging for production

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Node.js on Vercel](https://vercel.com/docs/runtimes#official-runtimes/node-js) 