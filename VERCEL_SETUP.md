# Frontend Vercel Deployment Setup

This guide will help you deploy the HungerWood frontend (React + Vite) to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com (free tier available)
2. **GitHub/GitLab/Bitbucket Account**: Your code should be in a Git repository
3. **Backend API**: Your backend should already be deployed (see `../backend/VERCEL_SETUP.md`)

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - **Important**: Set the **Root Directory** to `frontend`
     - Click "Edit" next to "Root Directory"
     - Enter `frontend`
     - Click "Continue"

3. **Configure Build Settings**
   - **Framework Preset**: Vite (should auto-detect)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default for Vite)
   - **Install Command**: `npm install` (default)

4. **Set Environment Variables** (see below)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - For production: `vercel --prod`

## Environment Variables

Set these in **Vercel Dashboard → Your Project → Settings → Environment Variables**:

### Required:

- **`VITE_API_URL`**: Your backend API URL
  - **Production**: `https://hungerwood-be.vercel.app/api`
  - **Development**: `http://localhost:5001/api` (for local testing)
  - **Example**: `https://hungerwood-be.vercel.app/api`

### Optional:

- **`VITE_APP_NAME`**: Application name (defaults to "HungerWood")
  - Example: `HungerWood - Food Ordering`

### How to Set Environment Variables:

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Click **Add New**
4. Enter:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://hungerwood-be.vercel.app/api` (your backend URL)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**
6. **Redeploy** your application for changes to take effect

## Project Configuration

### Root Directory

If your frontend is in a subdirectory (like `frontend/`), you need to set the **Root Directory** in Vercel:

1. Go to **Project Settings** → **General**
2. Under **Root Directory**, click **Edit**
3. Enter `frontend`
4. Click **Save**

### Build Settings

Vercel should auto-detect Vite, but verify these settings:

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `app.hungerwood.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate to be issued (automatic)

## Vercel Configuration File (Optional)

You can create a `vercel.json` in the `frontend/` directory for advanced configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Note**: Vercel usually auto-detects Vite projects, so this file is optional.

## Troubleshooting

### Build Fails

**Error**: `Module not found` or `Cannot find module`

**Solution**:
- Make sure all dependencies are in `package.json`
- Run `npm install` locally to verify
- Check that `node_modules` is in `.gitignore`

**Error**: `Environment variable not found`

**Solution**:
- Make sure environment variables are set in Vercel Dashboard
- Variables must start with `VITE_` to be accessible in Vite
- Redeploy after adding environment variables

### API Calls Fail (CORS Error)

**Error**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution**:
1. Check your backend's `ALLOWED_ORIGINS` environment variable
2. Add your frontend URL to the backend's allowed origins:
   ```
   https://your-frontend.vercel.app,https://your-frontend-git-main.vercel.app
   ```
3. Redeploy both frontend and backend

### 404 on Refresh

**Error**: Page shows 404 when refreshing or accessing routes directly

**Solution**:
- Vite SPA routing requires all routes to serve `index.html`
- Vercel should handle this automatically for Vite projects
- If not, add the `rewrites` rule in `vercel.json` (see above)

### Environment Variables Not Working

**Error**: `import.meta.env.VITE_API_URL` is `undefined`

**Solution**:
1. Variables must start with `VITE_` prefix
2. Set them in Vercel Dashboard → Environment Variables
3. **Redeploy** after adding/changing variables
4. Environment variables are injected at build time, not runtime

### Build Takes Too Long

**Solution**:
- Check your `package.json` dependencies
- Remove unused dependencies
- Consider using Vercel's build cache
- Check build logs for specific slow steps

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Frontend is accessible at the Vercel URL
- [ ] API calls are working (check browser console)
- [ ] No CORS errors
- [ ] Routes work on refresh (no 404 errors)
- [ ] Images and assets load correctly
- [ ] Authentication flow works
- [ ] Backend `ALLOWED_ORIGINS` includes frontend URL

## Updating Your Deployment

### Automatic Deployments

Vercel automatically deploys when you push to your main branch:
```bash
git add .
git commit -m "Update frontend"
git push origin main
```

### Manual Deployments

```bash
cd frontend
vercel --prod
```

### Preview Deployments

Every pull request gets a preview deployment automatically. You can also create one manually:
```bash
vercel
```

## Local Development with Production API

If you want to test locally against your production backend:

1. Create a `.env.local` file in the `frontend/` directory:
   ```
   VITE_API_URL=https://hungerwood-be.vercel.app/api
   ```

2. Restart your dev server:
   ```bash
   npm run dev
   ```

**Note**: `.env.local` is gitignored and won't be committed.

## Performance Optimization

### Vite Build Optimizations

Vite already optimizes your build, but you can:

1. **Enable compression** (automatic on Vercel)
2. **Use CDN** (automatic on Vercel)
3. **Optimize images** (consider using Vercel's Image Optimization)

### Vercel Analytics (Optional)

1. Go to **Project Settings** → **Analytics**
2. Enable **Web Analytics** (free tier available)
3. Get insights into your app's performance

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev
- **Vercel Support**: https://vercel.com/support

## Example Environment Variables

Here's what your Vercel environment variables should look like:

```
VITE_API_URL=https://hungerwood-be.vercel.app/api
VITE_APP_NAME=HungerWood
```

**Important**: 
- All Vite environment variables must start with `VITE_`
- They are injected at **build time**, not runtime
- You must **redeploy** after changing environment variables
