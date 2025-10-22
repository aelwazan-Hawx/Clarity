-- Clarity Finance Tracker Database Schema
-- PostgreSQL Database

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS opening_balances CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS payment_methods CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  exchange_rate DECIMAL(10, 4) DEFAULT 0.21,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name, type)
);

-- Payment methods table
CREATE TABLE payment_methods (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  currency VARCHAR(3) NOT NULL CHECK (currency IN ('SAR', 'EGP')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name, currency)
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
  category VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) NOT NULL CHECK (currency IN ('SAR', 'EGP')),
  payment_method VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets table
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(3) NOT NULL CHECK (currency IN ('SAR', 'EGP')),
  month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category, currency, month)
);

-- Opening balances table
CREATE TABLE opening_balances (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_method VARCHAR(255) NOT NULL,
  currency VARCHAR(3) NOT NULL CHECK (currency IN ('SAR', 'EGP')),
  amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, payment_method, currency)
);

-- Indexes for better performance
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_user_currency ON transactions(user_id, currency);
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category);
CREATE INDEX idx_categories_user_type ON categories(user_id, type);
CREATE INDEX idx_payment_methods_user_currency ON payment_methods(user_id, currency);
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opening_balances_updated_at BEFORE UPDATE ON opening_balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories for new users (function to be called after user registration)
CREATE OR REPLACE FUNCTION create_default_categories(p_user_id INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Income categories
  INSERT INTO categories (user_id, name, type) VALUES
    (p_user_id, 'Salaries & Wages', 'income'),
    (p_user_id, 'Rental Income', 'income'),
    (p_user_id, 'Dividends', 'income'),
    (p_user_id, 'Investments', 'income'),
    (p_user_id, 'Other Income', 'income'),
    (p_user_id, 'Business Income', 'income');

  -- Expense categories
  INSERT INTO categories (user_id, name, type) VALUES
    (p_user_id, 'Trans from ACC', 'expense'),
    (p_user_id, 'Financing, installments', 'expense'),
    (p_user_id, 'Invest&Savings', 'expense'),
    (p_user_id, 'Charitable Donations', 'expense'),
    (p_user_id, 'Markets', 'expense'),
    (p_user_id, 'Childcare', 'expense'),
    (p_user_id, 'Clothing And Shoes', 'expense'),
    (p_user_id, 'Health Care family', 'expense'),
    (p_user_id, 'Utilities (Monthly)', 'expense'),
    (p_user_id, 'Rent Per Month', 'expense'),
    (p_user_id, 'Personal Supplies', 'expense'),
    (p_user_id, 'Restaurants', 'expense'),
    (p_user_id, 'Transportation', 'expense'),
    (p_user_id, 'Vacation\Travel', 'expense'),
    (p_user_id, 'Family&Friends Gift', 'expense'),
    (p_user_id, 'EGY Trans', 'expense'),
    (p_user_id, 'installment Storia', 'expense'),
    (p_user_id, 'installment M-V', 'expense'),
    (p_user_id, 'maintenance home', 'expense'),
    (p_user_id, 'Remaining Credit Loan', 'expense'),
    (p_user_id, 'Remaining OverDraft Acc', 'expense'),
    (p_user_id, 'Moon pocket money', 'expense');
END;
$$ LANGUAGE plpgsql;

-- Insert default payment methods for new users
CREATE OR REPLACE FUNCTION create_default_payment_methods(p_user_id INTEGER)
RETURNS VOID AS $$
BEGIN
  -- SAR payment methods
  INSERT INTO payment_methods (user_id, name, currency) VALUES
    (p_user_id, 'Sabb', 'SAR'),
    (p_user_id, 'Sabb\Visa', 'SAR'),
    (p_user_id, 'Riyad', 'SAR'),
    (p_user_id, 'Riyad\Master', 'SAR'),
    (p_user_id, 'Riyad\Visa PIS', 'SAR'),
    (p_user_id, 'SNB - Mada', 'SAR'),
    (p_user_id, 'SNB-Master', 'SAR'),
    (p_user_id, 'SNB-Flexi', 'SAR'),
    (p_user_id, 'UrPay', 'SAR'),
    (p_user_id, 'Alrajhi', 'SAR'),
    (p_user_id, 'D360', 'SAR'),
    (p_user_id, 'STCpay', 'SAR'),
    (p_user_id, 'Tiqmo', 'SAR'),
    (p_user_id, 'Pay', 'SAR'),
    (p_user_id, 'NBD ACC', 'SAR'),
    (p_user_id, 'NBD', 'SAR'),
    (p_user_id, 'NBD6400', 'SAR'),
    (p_user_id, 'wallet', 'SAR'),
    (p_user_id, 'Baseeta', 'SAR'),
    (p_user_id, 'Master', 'SAR'),
    (p_user_id, 'Visa -Emkan', 'SAR');

  -- EGP payment methods
  INSERT INTO payment_methods (user_id, name, currency) VALUES
    (p_user_id, 'CIB_Current', 'EGP'),
    (p_user_id, 'CIB_Saving', 'EGP'),
    (p_user_id, 'CIB_$', 'EGP'),
    (p_user_id, 'NBE_Current', 'EGP'),
    (p_user_id, 'Wallet_Egy', 'EGP'),
    (p_user_id, 'MILES', 'EGP'),
    (p_user_id, 'EVERYWHERE TITANIUM', 'EGP'),
    (p_user_id, 'Other\', 'EGP'),
    (p_user_id, 'Other\ NBE from -', 'EGP'),
    (p_user_id, 'Other\ CIB from -', 'EGP');
END;
$$ LANGUAGE plpgsql;

-- Demo data (optional - comment out for production)
-- Uncomment the following lines to create a demo user for testing

/*
-- Create demo user
INSERT INTO users (email, password, name, exchange_rate)
VALUES ('demo@clarity.com', '$2a$10$YourHashedPasswordHere', 'Demo User', 0.21);

-- Get the demo user ID and create defaults
DO $$
DECLARE
  demo_user_id INTEGER;
BEGIN
  SELECT id INTO demo_user_id FROM users WHERE email = 'demo@clarity.com';
  PERFORM create_default_categories(demo_user_id);
  PERFORM create_default_payment_methods(demo_user_id);
END $$;
*/

-- Grant permissions (adjust as needed for your database user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_database_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_database_user;
