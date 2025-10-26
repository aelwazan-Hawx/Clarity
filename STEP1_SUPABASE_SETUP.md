# STEP 1: Set Up Database on Supabase

Follow these exact steps to create your database. This takes about 5 minutes.

---

## Part A: Create Supabase Account & Project

1. **Go to**: https://supabase.com
2. **Click**: "Start your project" (green button)
3. **Sign in** with GitHub (easiest option)
4. **Click**: "New Project"
5. **Fill in**:
   - Name: `clarity-finance`
   - Database Password: **IMPORTANT - SAVE THIS PASSWORD!**
     - Create a strong password (example: `MySecure123Pass!`)
     - Write it down - you'll need it later
   - Region: Choose closest to you (e.g., "West US" or "Central EU")
6. **Click**: "Create new project"
7. **Wait**: 2-3 minutes for database to be ready (you'll see a loading screen)

---

## Part B: Set Up Database Tables

Once your project is ready:

1. **Click** on "SQL Editor" in the left sidebar (icon looks like </> )
2. **Click**: "+ New Query" button at the top
3. **Copy the entire database.sql file contents** (I'll provide this in the next step)
4. **Paste** into the SQL editor
5. **Click**: "Run" button (or press Ctrl+Enter)
6. **You should see**: "Success. No rows returned"

---

## Part C: Get Your Database Connection String

1. **Click** on the "Settings" gear icon (bottom of left sidebar)
2. **Click**: "Database" in the settings menu
3. **Scroll down** to "Connection String"
4. **Select**: "URI" tab
5. **Copy** the connection string that looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
6. **Replace** `[YOUR-PASSWORD]` with the password you created in Part A
7. **Save this string** - you'll need it for Step 2!

---

## What to Copy for the SQL Editor

Use the file `backend/database.sql` that's already in your project. Here's what it contains:

```sql
-- This creates all the tables for your finance tracker:
-- ✅ users table (for accounts)
-- ✅ transactions table (income/expenses)
-- ✅ categories table (custom categories)
-- ✅ payment_methods table (banks/wallets)
-- ✅ budgets table (spending limits)
-- ✅ balances table (account balances)
```

---

## ✅ How to Know It Worked

After running the SQL:
1. Click "Table Editor" in left sidebar
2. You should see 6 tables: `users`, `transactions`, `categories`, `payment_methods`, `budgets`, `balances`
3. Each table should show "0 rows" (empty but ready to use)

---

## ❌ Troubleshooting

**Problem**: "Error: relation already exists"
- **Solution**: Tables are already created! This is fine, continue to Step 2.

**Problem**: "Error: password authentication failed"
- **Solution**: You used the wrong password. Go back to Part C and make sure you replaced `[YOUR-PASSWORD]` with your actual password.

**Problem**: "Project is paused"
- **Solution**: Free tier pauses after inactivity. Click "Resume project" button.

---

## 📝 What You Need for Step 2

Before moving to Step 2, make sure you have:
- ✅ Your database connection string (from Part C)
- ✅ All 6 tables created successfully

**Next**: Go to `STEP2_RENDER_SETUP.md` to deploy your backend API
