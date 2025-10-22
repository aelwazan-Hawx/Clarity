const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.userId = user.userId;
    next();
  });
};

// ========== AUTH ROUTES ==========

// Register
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, hashedPassword, name]
    );

    // Generate token
    const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ========== TRANSACTION ROUTES ==========

// Get all transactions
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create transaction
app.post('/api/transactions', authenticateToken, [
  body('date').isISO8601(),
  body('type').isIn(['income', 'expense']),
  body('category').trim().notEmpty(),
  body('amount').isFloat({ min: 0.01 }),
  body('currency').isIn(['SAR', 'EGP']),
  body('paymentMethod').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { date, type, category, amount, currency, paymentMethod, description } = req.body;

    const result = await pool.query(
      `INSERT INTO transactions (user_id, date, type, category, amount, currency, payment_method, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [req.userId, date, type, category, amount, currency, paymentMethod, description || '']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction
app.put('/api/transactions/:id', authenticateToken, [
  body('date').optional().isISO8601(),
  body('type').optional().isIn(['income', 'expense']),
  body('amount').optional().isFloat({ min: 0.01 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { date, type, category, amount, currency, paymentMethod, description } = req.body;

    const result = await pool.query(
      `UPDATE transactions
       SET date = $1, type = $2, category = $3, amount = $4, currency = $5,
           payment_method = $6, description = $7
       WHERE id = $8 AND user_id = $9 RETURNING *`,
      [date, type, category, amount, currency, paymentMethod, description || '', id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// ========== CATEGORY ROUTES ==========

// Get categories
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY type, name',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category
app.post('/api/categories', authenticateToken, [
  body('name').trim().notEmpty(),
  body('type').isIn(['income', 'expense'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, type } = req.body;

    const result = await pool.query(
      'INSERT INTO categories (user_id, name, type) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, name, type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
app.put('/api/categories/:id', authenticateToken, [
  body('name').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category
app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM categories WHERE id = $2 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ========== PAYMENT METHOD ROUTES ==========

// Get payment methods
app.get('/api/payment-methods', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM payment_methods WHERE user_id = $1 ORDER BY currency, name',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({ error: 'Failed to fetch payment methods' });
  }
});

// Create payment method
app.post('/api/payment-methods', authenticateToken, [
  body('name').trim().notEmpty(),
  body('currency').isIn(['SAR', 'EGP'])
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, currency } = req.body;

    const result = await pool.query(
      'INSERT INTO payment_methods (user_id, name, currency) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, name, currency]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create payment method error:', error);
    res.status(500).json({ error: 'Failed to create payment method' });
  }
});

// Update payment method
app.put('/api/payment-methods/:id', authenticateToken, [
  body('name').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name } = req.body;

    const result = await pool.query(
      'UPDATE payment_methods SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update payment method error:', error);
    res.status(500).json({ error: 'Failed to update payment method' });
  }
});

// Delete payment method
app.delete('/api/payment-methods/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM payment_methods WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }

    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ error: 'Failed to delete payment method' });
  }
});

// ========== BUDGET ROUTES ==========

// Get budgets
app.get('/api/budgets', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM budgets WHERE user_id = $1 ORDER BY month DESC, category',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Create or update budget
app.post('/api/budgets', authenticateToken, [
  body('category').trim().notEmpty(),
  body('amount').isFloat({ min: 0 }),
  body('currency').isIn(['SAR', 'EGP']),
  body('month').matches(/^\d{4}-\d{2}$/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { category, amount, currency, month } = req.body;

    const result = await pool.query(
      `INSERT INTO budgets (user_id, category, amount, currency, month)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, category, currency, month)
       DO UPDATE SET amount = $3
       RETURNING *`,
      [req.userId, category, amount, currency, month]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create/update budget error:', error);
    res.status(500).json({ error: 'Failed to save budget' });
  }
});

// Delete budget
app.delete('/api/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// ========== OPENING BALANCE ROUTES ==========

// Get opening balances
app.get('/api/opening-balances', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM opening_balances WHERE user_id = $1',
      [req.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get opening balances error:', error);
    res.status(500).json({ error: 'Failed to fetch opening balances' });
  }
});

// Set opening balance
app.post('/api/opening-balances', authenticateToken, [
  body('paymentMethod').trim().notEmpty(),
  body('currency').isIn(['SAR', 'EGP']),
  body('amount').isFloat()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { paymentMethod, currency, amount } = req.body;

    const result = await pool.query(
      `INSERT INTO opening_balances (user_id, payment_method, currency, amount)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, payment_method, currency)
       DO UPDATE SET amount = $4
       RETURNING *`,
      [req.userId, paymentMethod, currency, amount]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Set opening balance error:', error);
    res.status(500).json({ error: 'Failed to save opening balance' });
  }
});

// ========== SETTINGS ROUTES ==========

// Get user settings
app.get('/api/settings', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT exchange_rate FROM users WHERE id = $1',
      [req.userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update exchange rate
app.put('/api/settings/exchange-rate', authenticateToken, [
  body('exchangeRate').isFloat({ min: 0.01 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { exchangeRate } = req.body;

    const result = await pool.query(
      'UPDATE users SET exchange_rate = $1 WHERE id = $2 RETURNING exchange_rate',
      [exchangeRate, req.userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update exchange rate error:', error);
    res.status(500).json({ error: 'Failed to update exchange rate' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
