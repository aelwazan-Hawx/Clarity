const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'clarity-dev-secret-change-in-production';

// ─── SQLite Database ──────────────────────────────────────────────────────────
const db = new sqlite3.Database(path.join(__dirname, 'clarity.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
    date TEXT NOT NULL, type TEXT NOT NULL, category TEXT NOT NULL,
    amount REAL NOT NULL, currency TEXT NOT NULL, payment_method TEXT NOT NULL,
    description TEXT DEFAULT '', created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
    budget_key TEXT NOT NULL, amount REAL NOT NULL,
    UNIQUE(user_id, budget_key), FOREIGN KEY (user_id) REFERENCES users(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS opening_balances (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
    balance_key TEXT NOT NULL, amount REAL NOT NULL DEFAULT 0,
    UNIQUE(user_id, balance_key), FOREIGN KEY (user_id) REFERENCES users(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
    type TEXT NOT NULL, name TEXT NOT NULL,
    UNIQUE(user_id, type, name), FOREIGN KEY (user_id) REFERENCES users(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS payment_methods (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
    currency TEXT NOT NULL, name TEXT NOT NULL,
    UNIQUE(user_id, currency, name), FOREIGN KEY (user_id) REFERENCES users(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    user_id INTEGER PRIMARY KEY, exchange_rate REAL DEFAULT 0.21,
    FOREIGN KEY (user_id) REFERENCES users(id))`);
});

// Promisify helpers
const dbGet = (sql, params) => new Promise((res, rej) => db.get(sql, params, (e, r) => e ? rej(e) : res(r)));
const dbAll = (sql, params) => new Promise((res, rej) => db.all(sql, params, (e, r) => e ? rej(e) : res(r)));
const dbRun = (sql, params) => new Promise((res, rej) => db.run(sql, params, function(e) { e ? rej(e) : res(this); }));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));

// ─── Auth Middleware ──────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(403).json({ error: 'Invalid or expired token' }); }
};

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// ─── Register ─────────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' });
    const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) return res.status(400).json({ error: 'User already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const result = await dbRun('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    const userId = result.lastID;
    const defaultExpense = ['Trans from ACC','Financing, installments','Invest&Savings','Charitable Donations','Markets','Childcare','Clothing And Shoes','Health Care family','Utilities (Monthly)','Rent Per Month','Personal Supplies','Restaurants','Transportation','Vacation/Travel','Family&Friends Gift','EGY Trans','installment Storia','installment M-V','maintenance home','Remaining Credit Loan','Remaining OverDraft Acc','Moon pocket money'];
    const defaultIncome = ['Salaries & Wages','Rental Income','Dividends','Investments','Other Income','Business Income'];
    const defaultSAR = ['Sabb','Sabb/Visa','Riyad','Riyad/Master','Riyad/Visa PIS','SNB - Mada','SNB-Master','SNB-Flexi','UrPay','Alrajhi','D360','STCpay','Tiqmo','Pay','NBD ACC','NBD','NBD6400','wallet','Baseeta','Master','Visa -Emkan'];
    const defaultEGP = ['CIB_Current','CIB_Saving','CIB_$','NBE_Current','Wallet_Egy','MILES','EVERYWHERE TITANIUM','Other','Other NBE from -','Other CIB from -'];
    for (const n of defaultExpense) await dbRun('INSERT OR IGNORE INTO categories (user_id, type, name) VALUES (?, ?, ?)', [userId, 'expense', n]);
    for (const n of defaultIncome) await dbRun('INSERT OR IGNORE INTO categories (user_id, type, name) VALUES (?, ?, ?)', [userId, 'income', n]);
    for (const n of defaultSAR) await dbRun('INSERT OR IGNORE INTO payment_methods (user_id, currency, name) VALUES (?, ?, ?)', [userId, 'SAR', n]);
    for (const n of defaultEGP) await dbRun('INSERT OR IGNORE INTO payment_methods (user_id, currency, name) VALUES (?, ?, ?)', [userId, 'EGP', n]);
    await dbRun('INSERT OR IGNORE INTO settings (user_id, exchange_rate) VALUES (?, 0.21)', [userId]);
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'User created successfully', token, user: { id: userId, name, email } });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// ─── Login ────────────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Internal server error' }); }
});

// ─── Transactions ─────────────────────────────────────────────────────────────
app.get('/api/transactions', auth, async (req, res) => {
  const rows = await dbAll('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC', [req.user.userId]);
  res.json(rows.map(r => ({ ...r, paymentMethod: r.payment_method })));
});
app.post('/api/transactions', auth, async (req, res) => {
  const { date, type, category, amount, currency, paymentMethod, description } = req.body;
  if (!date || !type || !category || !amount || !currency || !paymentMethod) return res.status(400).json({ error: 'Missing required fields' });
  const r = await dbRun('INSERT INTO transactions (user_id, date, type, category, amount, currency, payment_method, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [req.user.userId, date, type, category, parseFloat(amount), currency, paymentMethod, description || '']);
  const row = await dbGet('SELECT * FROM transactions WHERE id = ?', [r.lastID]);
  res.status(201).json({ ...row, paymentMethod: row.payment_method });
});
app.put('/api/transactions/:id', auth, async (req, res) => {
  const { date, type, category, amount, currency, paymentMethod, description } = req.body;
  const existing = await dbGet('SELECT id FROM transactions WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  await dbRun('UPDATE transactions SET date=?, type=?, category=?, amount=?, currency=?, payment_method=?, description=? WHERE id=? AND user_id=?', [date, type, category, parseFloat(amount), currency, paymentMethod, description || '', req.params.id, req.user.userId]);
  const row = await dbGet('SELECT * FROM transactions WHERE id = ?', [req.params.id]);
  res.json({ ...row, paymentMethod: row.payment_method });
});
app.delete('/api/transactions/:id', auth, async (req, res) => {
  const existing = await dbGet('SELECT id FROM transactions WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
  if (!existing) return res.status(404).json({ error: 'Not found' });
  await dbRun('DELETE FROM transactions WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
  res.json({ message: 'Deleted' });
});

// ─── Categories ───────────────────────────────────────────────────────────────
app.get('/api/categories', auth, async (req, res) => res.json(await dbAll('SELECT * FROM categories WHERE user_id = ? ORDER BY type, name', [req.user.userId])));
app.post('/api/categories', auth, async (req, res) => {
  const { type, name } = req.body;
  try {
    const r = await dbRun('INSERT INTO categories (user_id, type, name) VALUES (?, ?, ?)', [req.user.userId, type, name]);
    res.status(201).json({ id: r.lastID, user_id: req.user.userId, type, name });
  } catch { res.status(400).json({ error: 'Category already exists' }); }
});
app.put('/api/categories/:id', auth, async (req, res) => {
  const { name, oldName } = req.body;
  await dbRun('UPDATE categories SET name = ? WHERE id = ? AND user_id = ?', [name, req.params.id, req.user.userId]);
  if (oldName) await dbRun('UPDATE transactions SET category = ? WHERE category = ? AND user_id = ?', [name, oldName, req.user.userId]);
  res.json({ message: 'Updated' });
});
app.delete('/api/categories/:id', auth, async (req, res) => {
  await dbRun('DELETE FROM categories WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
  res.json({ message: 'Deleted' });
});

// ─── Payment Methods ──────────────────────────────────────────────────────────
app.get('/api/payment-methods', auth, async (req, res) => res.json(await dbAll('SELECT * FROM payment_methods WHERE user_id = ? ORDER BY currency, name', [req.user.userId])));
app.post('/api/payment-methods', auth, async (req, res) => {
  const { currency, name } = req.body;
  try {
    const r = await dbRun('INSERT INTO payment_methods (user_id, currency, name) VALUES (?, ?, ?)', [req.user.userId, currency, name]);
    res.status(201).json({ id: r.lastID, user_id: req.user.userId, currency, name });
  } catch { res.status(400).json({ error: 'Payment method already exists' }); }
});
app.put('/api/payment-methods/:id', auth, async (req, res) => {
  const { name, oldName, currency } = req.body;
  await dbRun('UPDATE payment_methods SET name = ? WHERE id = ? AND user_id = ?', [name, req.params.id, req.user.userId]);
  if (oldName && currency) await dbRun('UPDATE transactions SET payment_method = ? WHERE payment_method = ? AND currency = ? AND user_id = ?', [name, oldName, currency, req.user.userId]);
  res.json({ message: 'Updated' });
});
app.delete('/api/payment-methods/:id', auth, async (req, res) => {
  await dbRun('DELETE FROM payment_methods WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
  res.json({ message: 'Deleted' });
});

// ─── Budgets ──────────────────────────────────────────────────────────────────
app.get('/api/budgets', auth, async (req, res) => {
  const rows = await dbAll('SELECT * FROM budgets WHERE user_id = ?', [req.user.userId]);
  const result = {}; rows.forEach(r => { result[r.budget_key] = r.amount; }); res.json(result);
});
app.post('/api/budgets', auth, async (req, res) => {
  const { key, amount } = req.body;
  await dbRun('INSERT INTO budgets (user_id, budget_key, amount) VALUES (?, ?, ?) ON CONFLICT(user_id, budget_key) DO UPDATE SET amount = excluded.amount', [req.user.userId, key, parseFloat(amount)]);
  res.json({ message: 'Saved' });
});
app.delete('/api/budgets', auth, async (req, res) => {
  await dbRun('DELETE FROM budgets WHERE user_id = ? AND budget_key = ?', [req.user.userId, req.body.key]);
  res.json({ message: 'Deleted' });
});

// ─── Opening Balances ─────────────────────────────────────────────────────────
app.get('/api/opening-balances', auth, async (req, res) => {
  const rows = await dbAll('SELECT * FROM opening_balances WHERE user_id = ?', [req.user.userId]);
  const result = {}; rows.forEach(r => { result[r.balance_key] = r.amount; }); res.json(result);
});
app.post('/api/opening-balances', auth, async (req, res) => {
  const { key, amount } = req.body;
  await dbRun('INSERT INTO opening_balances (user_id, balance_key, amount) VALUES (?, ?, ?) ON CONFLICT(user_id, balance_key) DO UPDATE SET amount = excluded.amount', [req.user.userId, key, parseFloat(amount)]);
  res.json({ message: 'Saved' });
});

// ─── Settings ─────────────────────────────────────────────────────────────────
app.get('/api/settings', auth, async (req, res) => res.json(await dbGet('SELECT * FROM settings WHERE user_id = ?', [req.user.userId]) || { exchange_rate: 0.21 }));
app.post('/api/settings', auth, async (req, res) => {
  await dbRun('INSERT INTO settings (user_id, exchange_rate) VALUES (?, ?) ON CONFLICT(user_id) DO UPDATE SET exchange_rate = excluded.exchange_rate', [req.user.userId, parseFloat(req.body.exchange_rate)]);
  res.json({ message: 'Saved' });
});

// ─── Serve React App ──────────────────────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'build', 'index.html')));

app.listen(port, () => console.log(`Clarity running on port ${port}`));
