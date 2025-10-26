# STEP 3: Connect Frontend to Backend

Follow these exact steps to connect your frontend to the deployed backend. This takes about 5 minutes.

---

## Part A: Add Environment Variable to Vercel

Your frontend needs to know where your backend is!

1. **Go to**: https://vercel.com/dashboard
2. **Click** on your `clarity` project
3. **Click**: "Settings" tab at the top
4. **Click**: "Environment Variables" in the left sidebar
5. **Add a new variable**:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     - Replace with YOUR actual Render URL from Step 2
     - **IMPORTANT**: Must end with `/api`
     - Example: `https://clarity-backend-abc123.onrender.com/api`
   - **Environments**: Check all boxes (Production, Preview, Development)
6. **Click**: "Save"

---

## Part B: Redeploy Your Frontend

Now that you've added the environment variable, you need to redeploy:

### Option 1: Automatic Redeploy (Easiest)

1. I will push the updated code to your repository
2. Vercel will automatically detect the changes and redeploy
3. **Wait** 2-3 minutes for deployment to complete
4. You'll see "Deployment Ready" notification

### Option 2: Manual Trigger

If automatic doesn't work:

1. **Go to**: "Deployments" tab in Vercel
2. **Click** on the three dots (...) next to the latest deployment
3. **Click**: "Redeploy"
4. **Click**: "Redeploy" again to confirm

---

## Part C: Test Your App

Once deployment is complete:

1. **Open** your Vercel app URL: `https://your-app.vercel.app`
2. **You should see** the login screen
3. **Click** "Sign Up" tab
4. **Fill in**:
   - Name: Your name
   - Email: Any email (example: test@example.com)
   - Password: Any password (at least 6 characters)
5. **Click** "Sign Up"
6. **You should**:
   - See a loading spinner
   - Then be logged in to the dashboard
   - See "Welcome to Clarity" message

---

## ✅ How to Know Everything Worked

After signing up, you should be able to:

1. ✅ **Add a transaction** - Click "Transactions" → "Add Transaction" → Fill form → Save
2. ✅ **See your transaction** in the list
3. ✅ **View dashboard** - See statistics and charts
4. ✅ **Add categories** - Go to Settings → Add custom categories
5. ✅ **Set budgets** - Go to Budget Builder → Create budgets
6. ✅ **Log out and back in** - Your data should persist

**If all of these work, YOU'RE DONE! Your app is fully functional!**

---

## ❌ Troubleshooting

### Problem: "Network Error" or "Failed to fetch" when signing up

**Likely causes:**
1. Backend URL is wrong in Vercel environment variables
2. Backend is sleeping (Render free tier takes 30-60 seconds to wake up)

**Solutions:**
1. **Check the backend URL**:
   - Go to Render dashboard
   - Copy the exact URL (should be `https://xxx.onrender.com`)
   - Go to Vercel Settings → Environment Variables
   - Make sure `REACT_APP_API_URL` ends with `/api`
   - Example: `https://clarity-backend-abc.onrender.com/api`

2. **Wake up the backend**:
   - Open your backend URL in a new tab: `https://your-backend.onrender.com/api/health`
   - Wait 30-60 seconds
   - Should see: `{"status":"ok","message":"API is running"}`
   - Then try signing up again

3. **Redeploy frontend** after fixing the URL:
   - Go to Vercel → Deployments
   - Click three dots → Redeploy

### Problem: "Invalid token" or keeps logging out

**Solution:**
- Clear browser cache and cookies
- Try incognito/private window
- Sign up with a new account

### Problem: Sign up button doesn't do anything

**Solution:**
1. Open browser console (F12 → Console tab)
2. Look for error messages in red
3. If you see "CORS error":
   - This means backend needs CORS configuration
   - The backend I created already has CORS enabled
   - Make sure you're using the Render URL, not localhost

### Problem: "Cannot connect to database"

**Solution:**
- Check Render logs: Render Dashboard → Your Service → Logs
- Look for "Connected to PostgreSQL database successfully!"
- If not there, your DATABASE_URL in Render is wrong
- Go back to Step 2, Part C and verify environment variables

---

## 🎉 Success Checklist

Before you're done, verify:

- ✅ You can sign up and create an account
- ✅ You can log in with your credentials
- ✅ You can add transactions and see them in the list
- ✅ Your data persists after logout/login
- ✅ Dashboard shows correct statistics
- ✅ All pages work (Dashboard, Transactions, Budget, Settings)

---

## 📝 Important URLs to Save

**Frontend (Vercel)**: `https://your-app.vercel.app`
**Backend (Render)**: `https://your-backend.onrender.com`
**Database (Supabase)**: Available in your Supabase dashboard

---

## 🚀 What's Next?

Your app is now FULLY FUNCTIONAL! You can:

1. **Use it daily** - Track your income and expenses
2. **Share it** - Give the Vercel URL to friends/family
3. **Customize it** - Edit categories, budgets, etc.
4. **Keep it free** - All three platforms have generous free tiers

---

## 💡 Pro Tips

1. **Bookmark** your app URL for quick access
2. **Pin it** as a PWA (click "Install" in Chrome)
3. **Backup your data** - Supabase has automatic backups
4. **Monitor usage** - Render free tier: 750 hours/month (plenty!)
5. **Wake up backend** - If slow, open health check URL first

---

**Congratulations! Your Clarity Finance Tracker is now live and fully operational!**
