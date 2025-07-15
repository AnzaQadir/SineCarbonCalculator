# CDN Setup Guide for Email Images

## Option 1: Vercel Blob Storage (Recommended)

### Step 1: Install Dependencies
```bash
cd backend
npm install @vercel/blob
```

### Step 2: Set up Vercel CLI
```bash
npm install -g vercel
vercel login
```

### Step 3: Upload Image
```bash
node upload-to-vercel-blob.js
```

### Step 4: Update Email Template
Replace the image URL in `src/services/emailService.ts`:
```typescript
<img src="YOUR_VERCEL_BLOB_URL" alt="..." />
```

### Step 5: Custom Domain (Optional)
1. Go to Vercel Dashboard > Settings > Domains
2. Add custom domain: `cdn.zerrah.com`
3. Update DNS records as instructed

---

## Option 2: Supabase Storage

### Step 1: Install Dependencies
```bash
cd backend
npm install @supabase/supabase-js
```

### Step 2: Set up Supabase Storage
1. Go to Supabase Dashboard > Storage
2. Create a new bucket called `email-assets`
3. Set bucket to public
4. Get your project URL and anon key

### Step 3: Add Environment Variables
Add to your `.env` file:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Upload Image
```bash
node upload-to-supabase.js
```

### Step 5: Update Email Template
Replace the image URL in `src/services/emailService.ts`:
```typescript
<img src="YOUR_SUPABASE_URL" alt="..." />
```

### Step 6: Custom Domain (Optional)
1. Go to Supabase Dashboard > Storage > Settings
2. Add custom domain: `cdn.zerrah.com`
3. Update DNS records as instructed

---

## Quick Test

After setting up either option, test the email:

```bash
node test-email-simple-real.js
```

## Comparison

| Feature | Vercel Blob | Supabase Storage |
|---------|-------------|------------------|
| Setup Difficulty | Easy | Medium |
| Free Tier | 100GB | 1GB |
| Custom Domain | ✅ | ✅ |
| Integration | Built-in | Requires setup |
| Performance | Fast | Fast |

## Recommendation

**Use Vercel Blob** if you're already using Vercel for deployment.
**Use Supabase Storage** if you're already using Supabase for your database.

Both options will work great for serving your email images! 