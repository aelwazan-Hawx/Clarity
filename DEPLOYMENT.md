# Clarity - Deployment Guide

## 🚀 Quick Start Deployment

### Prerequisites
- GitHub account
- Vercel account (for frontend)
- Render account (for backend)
- Supabase account (for database)

---

## 📊 Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in and click "New Project"
3. Fill in project details:
   - **Name**: clarity-db
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start

### Step 2: Run Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `backend/database.sql`
4. Paste into the query editor
5. Click "Run" to execute
6. Verify tables were created in **Table Editor**

### Step 3: Get Connection String
1. Go to **Project Settings** → **Database**
2. Scroll to **Connection String** → **URI**
3. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with your actual database password
5. Save this for backend deployment

---

## 🖥️ Backend Deployment (Render)

### Step 1: Prepare Repository
Ensure your changes are pushed to GitHub:
```bash
git add .
git commit -m "Setup backend and database"
git push
```

### Step 2: Create Web Service on Render
1. Go to [https://render.com](https://render.com)
2. Sign in and click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: clarity-backend
   - **Region**: Choose closest to your users
   - **Branch**: main (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Add Environment Variables
In the "Environment" section, add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Supabase connection string from above |
| `JWT_SECRET` | Generate with: `openssl rand -base64 32` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy the service URL (e.g., `https://clarity-backend.onrender.com`)
4. Test the health endpoint: `https://your-backend-url.onrender.com/health`

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Project
1. Go to [https://vercel.com](https://vercel.com)
2. Sign in and click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 2: Add Environment Variables
In "Environment Variables" section, add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | Your Render backend URL + `/api` (e.g., `https://clarity-backend.onrender.com/api`) |

### Step 3: Deploy
1. Click "Deploy"
2. Wait for build (3-5 minutes)
3. Once deployed, you'll get a URL like: `https://clarity-xyz.vercel.app`
4. Visit the URL and test the application!

---

## 🔧 Post-Deployment Setup

### Create Your Account
1. Visit your deployed frontend URL
2. Click "Sign Up"
3. Enter your details:
   - Name
   - Email
   - Password (min 6 characters)
4. Click "Sign Up"

The system will automatically create:
- Default income categories (6 categories)
- Default expense categories (22 categories)
- Default SAR payment methods (21 methods)
- Default EGP payment methods (10 methods)

### Start Using Clarity
1. **Dashboard**: View your financial overview
2. **Add Transaction**: Record income/expenses
3. **Budget Builder**: Set monthly budgets
4. **Control Panel**: Customize categories and payment methods

---

## 📱 Local Development

### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Backend
```bash
cd backend
npm install

# Create .env file with:
# DATABASE_URL=your_local_or_supabase_connection
# JWT_SECRET=your_secret_key
# PORT=5000

npm run dev
# Runs on http://localhost:5000
```

---

## 🔐 Security Notes

### IMPORTANT - Before Going Live:
1. ✅ **Environment Variables**: Never commit `.env` files
2. ✅ **JWT Secret**: Use a strong random key (32+ characters)
3. ✅ **Database Password**: Use a strong unique password
4. ✅ **CORS**: Backend only allows frontend domain in production
5. ✅ **HTTPS**: Both Vercel and Render provide SSL by default

### Production Checklist:
- [ ] Database backups enabled in Supabase
- [ ] Environment variables set correctly
- [ ] Health endpoint responding
- [ ] Frontend can connect to backend
- [ ] Test user registration and login
- [ ] Test creating transactions
- [ ] Test budget features

---

## 🐛 Troubleshooting

### Backend Issues

**"Cannot connect to database"**
- Check DATABASE_URL is correct
- Ensure database password has no special characters that need encoding
- Verify Supabase project is active

**"JWT token invalid"**
- Clear browser localStorage
- Logout and login again
- Verify JWT_SECRET is set in Render

### Frontend Issues

**"Network Error" or "Failed to fetch"**
- Check REACT_APP_API_URL is correct
- Ensure backend is deployed and running
- Check backend health endpoint
- Look for CORS errors in browser console

**"Categories not loading"**
- Ensure you've run database.sql on Supabase
- Check browser console for errors
- Verify you're logged in

### Database Issues

**"No tables found"**
- Re-run database.sql in Supabase SQL Editor
- Check for errors in query execution
- Verify connection string format

---

## 🔄 Updating Your Deployment

### Push Changes
```bash
git add .
git commit -m "Your update message"
git push
```

Both Vercel and Render will auto-deploy when you push to your main branch!

### Manual Redeploy
- **Vercel**: Go to Deployments → Click "Redeploy"
- **Render**: Go to your service → Click "Manual Deploy"

---

## 📊 Monitoring

### Check Backend Status
Visit: `https://your-backend-url.onrender.com/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-10-22T..."
}
```

### View Logs
- **Render**: Dashboard → Logs tab
- **Vercel**: Project → Functions → Logs
- **Supabase**: Dashboard → Database → Logs

---

## 💰 Pricing

### Free Tier Limits:
- **Supabase**: 500MB database, 2GB bandwidth
- **Render**: 750 hours/month (enough for 1 service 24/7)
- **Vercel**: 100GB bandwidth, unlimited deployments

All services have paid plans for scaling up.

---

## 📞 Support

### Common Resources:
- [Supabase Docs](https://supabase.com/docs)
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)

### Need Help?
Check the logs first:
1. Browser console (F12)
2. Render backend logs
3. Supabase database logs

---

## 🎉 You're Live!

Congratulations! Your Clarity Finance Tracker is now live and ready to use.

**Share your deployed URL** and start tracking your finances across SAR and EGP currencies!

---

**Built with ❤️ using React, Node.js, PostgreSQL, and deployed on Vercel + Render + Supabase**
