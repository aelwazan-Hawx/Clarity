# STEP 2: Deploy Backend API on Render.com

Follow these exact steps to deploy your backend. This takes about 10 minutes.

---

## Part A: Create Render Account & Web Service

1. **Go to**: https://render.com
2. **Click**: "Get Started" or "Sign Up"
3. **Sign up** with GitHub (easiest option - click "Sign up with GitHub")
4. **Authorize** Render to access your GitHub account
5. **Click**: "New +" button (top right)
6. **Select**: "Web Service"

---

## Part B: Connect Your Repository

1. **Find** your `Clarity` repository in the list
   - If you don't see it, click "Configure account" and give Render access to the repo
2. **Click**: "Connect" next to the Clarity repository
3. **Fill in the form**:
   - **Name**: `clarity-backend` (or any name you like)
   - **Region**: Choose closest to you (e.g., "Oregon (US West)")
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend` ⚠️ **IMPORTANT!**
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free

---

## Part C: Set Environment Variables

**CRITICAL STEP** - Your app won't work without these!

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**. Add these 3 variables:

### Variable 1: DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: [Your Supabase connection string from Step 1]
  ```
  postgresql://postgres:YourPassword@db.xxx.supabase.co:5432/postgres
  ```

### Variable 2: JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: Create a random secret (example: `mySecretKey12345!@#$%`)
  - Tip: Use any random string of letters/numbers/symbols
  - Keep it safe - don't share it

### Variable 3: PORT
- **Key**: `PORT`
- **Value**: `5000`

**Double-check all 3 variables are added correctly!**

---

## Part D: Deploy

1. **Scroll down** and click **"Create Web Service"** (big button at bottom)
2. **Wait** for deployment (5-10 minutes)
   - You'll see logs scrolling
   - Look for "Your service is live" message
3. **Copy your backend URL** when ready:
   - It will look like: `https://clarity-backend-xxxx.onrender.com`
   - **SAVE THIS URL** - you need it for Step 3!

---

## ✅ How to Know It Worked

1. **Look at the logs** - you should see:
   ```
   Server running on port 5000
   Connected to PostgreSQL database successfully!
   ```

2. **Test your API** - open in browser:
   ```
   https://your-backend-url.onrender.com/api/health
   ```
   - Should see: `{"status":"ok","message":"API is running"}`

---

## ❌ Troubleshooting

**Problem**: "Build failed" or "npm: command not found"
- **Solution**: Make sure "Root Directory" is set to `backend`
- Go to Settings > General and check Root Directory

**Problem**: "Error: connect ECONNREFUSED" in logs
- **Solution**: Your DATABASE_URL is wrong
- Go to Settings > Environment and check the connection string from Step 1

**Problem**: "Error: JWT_SECRET is not defined"
- **Solution**: You forgot to add environment variables
- Go to Settings > Environment and add all 3 variables from Part C

**Problem**: "Application failed to respond"
- **Solution**: Check the Start Command is exactly: `node server.js`
- Go to Settings > General and verify

**Problem**: Service keeps sleeping/taking long to start
- **Solution**: This is normal on free tier. First request takes 30-60 seconds
- Keep the tab open, it will wake up

---

## 🔒 Important Security Notes

1. **Never share** your DATABASE_URL or JWT_SECRET
2. **Don't commit** these to GitHub (they're safe in Render environment variables)
3. **Use strong passwords** for production apps

---

## 📝 What You Need for Step 3

Before moving to Step 3, make sure you have:
- ✅ Backend is deployed and showing "Live" status
- ✅ You saved your backend URL (example: `https://clarity-backend-xxxx.onrender.com`)
- ✅ The health check endpoint works

**Example URL format**:
```
https://clarity-backend-abc123.onrender.com
```

**Next**: Go to `STEP3_FRONTEND_UPDATE.md` to connect your frontend to the backend
