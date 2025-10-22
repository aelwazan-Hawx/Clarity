# VERCEL 404 FIX - No "Root Directory" Option

## The Problem

If you don't see "Root Directory" in Vercel Settings, it means the project wasn't configured properly during import. Here's the fix:

## ✅ SOLUTION - Delete and Reimport Correctly

### Step 1: Delete Current Project

1. Go to https://vercel.com/dashboard
2. Click on your Clarity project
3. Click **Settings** (top navigation)
4. Scroll all the way to the bottom
5. In the red "Danger Zone" section, click **"Delete Project"**
6. Type the project name to confirm
7. Click **Delete**

### Step 2: Import Project Correctly

1. **Go back to Vercel Dashboard**
   - Click **"Add New..."** button (top right)
   - Select **"Project"**

2. **Import from Git**
   - Find and click **"Import"** next to your `Clarity` repository
   - If you don't see it, click "Import Git Repository" and connect GitHub

3. **🚨 CRITICAL - Configure Project (This is where the magic happens)**

   You'll see a screen titled "Configure Project"

   Look for a section that shows:
   ```
   Framework Preset: [dropdown]
   Root Directory: ./  [Edit button]
   ```

   **Click the "Edit" button next to Root Directory**

   You'll see a popup or inline editor. Change it to:
   ```
   frontend
   ```

4. **Set Other Options:**
   ```
   Framework Preset: Create React App (should auto-detect)
   Build Command: npm run build
   Output Directory: build
   Install Command: npm install
   ```

5. **Add Environment Variable:**
   - Expand "Environment Variables" section
   - Click "Add"
   - Name: `REACT_APP_API_URL`
   - Value: `http://localhost:5000/api`
   - Select all environments (Production, Preview, Development)

6. **Click "Deploy"**

### Step 3: Wait for Build

- Build takes 2-3 minutes
- Watch the build logs
- Should see "Build Completed" ✅

### Step 4: Test

- Click "Visit" or go to your deployment URL
- You should see the Clarity login page (NOT a 404!)

---

## 🎯 Alternative: Use vercel.json at Root

If the above doesn't work, I've already created a `vercel.json` file at the root of your repository that handles this automatically.

After you delete and reimport:
- Vercel will detect `vercel.json`
- It will automatically build from the `frontend` folder
- Should work without manual configuration

---

## 📸 What the Import Screen Should Look Like

When you click "Import" on your repository, you should see:

```
Configure Project
├── Project Name: clarity-finance-tracker
├── Framework Preset: Create React App
├── Root Directory: frontend  ← MUST BE SET!
├── Build Settings:
│   ├── Build Command: npm run build
│   ├── Output Directory: build
│   └── Install Command: npm install
└── Environment Variables:
    └── REACT_APP_API_URL = http://localhost:5000/api
```

**If you DON'T see "Root Directory" during import**, it means you might have selected wrong repository or there's an issue with Vercel's UI.

---

## 🔍 Why This Happens

Your repository structure is:
```
Clarity/
├── backend/        ← Backend code
├── frontend/       ← React app (what Vercel needs to build)
├── README.md
└── vercel.json
```

Vercel needs to know to look inside `frontend/` folder, not the root. That's what "Root Directory: frontend" does.

---

## 🆘 Still Can't Find "Root Directory"?

Try this workaround:

### Option: Deploy Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Go to frontend folder and deploy:**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow prompts:**
   - Setup and deploy? **Yes**
   - Which scope? Select your account
   - Link to existing project? **No**
   - Project name? **clarity-finance-tracker**
   - Directory? **. (current directory)**
   - Override settings? **No**

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

This deploys ONLY the frontend folder directly!

---

## ✅ Success Checklist

After deployment, verify:
- [ ] Build completed successfully
- [ ] Deployment URL loads without 404
- [ ] You see the Clarity login screen
- [ ] Browser console has no errors (F12 to check)

---

## 📞 Next Steps

1. **Delete your current Vercel project**
2. **Reimport and set Root Directory to `frontend`**
3. **Deploy**
4. **Test the URL**

If you still get 404 after this, please share:
- Screenshot of the "Configure Project" screen during import
- The deployment URL
- Any error messages from build logs

Let's get this working! 🚀
