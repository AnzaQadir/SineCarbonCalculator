# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7899097f-112b-4309-9d66-53622a1b3766

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7899097f-112b-4309-9d66-53622a1b3766) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7899097f-112b-4309-9d66-53622a1b3766) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

# Carbon Calculator Simplifier

A comprehensive carbon footprint calculator with personality assessment and personalized recommendations.

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

### Step 1: Push Your Code to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub and push
git remote add origin https://github.com/yourusername/carbon-calc-simplifier.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign in with GitHub
2. **Import Project**: Click "New Project" → Import your GitHub repository
3. **Configure Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables** (in Vercel dashboard):
   ```
   VITE_API_BASE_URL=https://your-app.vercel.app/api
   ```

5. **Deploy**: Click "Deploy" and wait for the build to complete

### Step 3: Deploy Backend (Optional)

If you need the backend API deployed separately:

1. Create a new Vercel project for the backend
2. Set root directory to `backend`
3. Add environment variables:
   ```
   NODE_ENV=production
   OPENAI_API_KEY=your_openai_api_key
   ```

## 🛠️ Local Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## 📁 Project Structure

```
carbon-calc-simplifier/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── vercel.json        # Vercel configuration
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Frontend** (`frontend/env.example`):
- `VITE_API_BASE_URL`: API base URL

**Backend** (`backend/env.example`):
- `PORT`: Server port
- `NODE_ENV`: Environment
- `OPENAI_API_KEY`: OpenAI API key
- `CORS_ORIGIN`: CORS origin

## 📝 Features

- Carbon footprint calculation
- Personality assessment
- Personalized recommendations
- Interactive UI with animations
- Mobile-responsive design

## 🚀 Live Demo

Your app will be available at: `https://your-app.vercel.app`

---

For detailed deployment instructions, see the step-by-step guide in the conversation.
