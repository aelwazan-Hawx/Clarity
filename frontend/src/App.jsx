import React, { useState, useEffect } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, Wallet, DollarSign, LogOut, Home, List, Edit2, Trash2, Search, Filter, Settings, Target, AlertCircle, Loader } from 'lucide-react';
import { authAPI, transactionsAPI, categoriesAPI, paymentMethodsAPI, budgetsAPI, openingBalancesAPI, settingsAPI } from './api';

const FinanceTrackerApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [exchangeRate, setExchangeRate] = useState(0.21);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [sarPaymentMethods, setSarPaymentMethods] = useState([]);
  const [egpPaymentMethods, setEgpPaymentMethods] = useState([]);
  const [openingBalances, setOpeningBalances] = useState({});
  const [budgets, setBudgets] = useState({});
  const [transactions, setTransactions] = useState([]);

  // Load all data on login
  useEffect(() => {
    if (isLoggedIn) {
      loadAllData();
    }
  }, [isLoggedIn]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load all data in parallel
      const [txnsRes, catsRes, pmRes, budgetsRes, balancesRes, settingsRes] = await Promise.all([
        transactionsAPI.getAll(),
        categoriesAPI.getAll(),
        paymentMethodsAPI.getAll(),
        budgetsAPI.getAll(),
        openingBalancesAPI.getAll(),
        settingsAPI.get()
      ]);

      setTransactions(txnsRes.data);

      // Parse categories
      const income = catsRes.data.filter(c => c.type === 'income').map(c => c.name);
      const expense = catsRes.data.filter(c => c.type === 'expense').map(c => c.name);
      setIncomeCategories(income);
      setExpenseCategories(expense);

      // Parse payment methods
      const sar = pmRes.data.filter(pm => pm.currency === 'SAR').map(pm => pm.name);
      const egp = pmRes.data.filter(pm => pm.currency === 'EGP').map(pm => pm.name);
      setSarPaymentMethods(sar);
      setEgpPaymentMethods(egp);

      // Parse budgets into object format
      const budgetsObj = {};
      budgetsRes.data.forEach(b => {
        const key = `${b.currency}-${b.month}-${b.category}`;
        budgetsObj[key] = b.amount;
      });
      setBudgets(budgetsObj);

      // Parse opening balances
      const balancesObj = {};
      balancesRes.data.forEach(ob => {
        const key = `${ob.currency}-${ob.payment_method}`;
        balancesObj[key] = ob.amount;
      });
      setOpeningBalances(balancesObj);

      setExchangeRate(settingsRes.data.exchange_rate);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const Login = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError('');
      setSubmitting(true);

      try {
        const response = isRegister
          ? await authAPI.register(formData)
          : await authAPI.login({ email: formData.email, password: formData.password });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setIsLoggedIn(true);
      } catch (err) {
        setFormError(err.response?.data?.error || 'Authentication failed');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Wallet className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Clarity</h1>
            <p className="text-gray-600 mt-2">Manage your finances effortlessly</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                  required={isRegister}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {submitting && <Loader className="w-5 h-5 animate-spin" />}
              {isRegister ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsRegister(!isRegister)} className="text-blue-600 font-semibold">
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return <Login />;
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const Dashboard = () => {
    const calculateTotals = (currency) => {
      const currencyTxns = transactions.filter(t => t.currency === currency);
      const income = currencyTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const expense = currencyTxns.filter(t => t.type === 'expense' && t.category !== 'Trans from ACC' && t.category !== 'EGY Trans').reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return { income, expense, balance: income - expense };
    };

    const sarTotals = calculateTotals('SAR');
    const egpTotals = calculateTotals('EGP');

    return (
      <div className="space-y-6 pb-20 md:pb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <button onClick={() => setCurrentPage('add')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <PlusCircle className="w-5 h-5" /><span className="hidden sm:inline">Add</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">SAR Budget</h3>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" />Income</span>
                <span className="text-green-600 font-semibold">{sarTotals.income.toLocaleString()} SAR</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500" />Expenses</span>
                <span className="text-red-600 font-semibold">{sarTotals.expense.toLocaleString()} SAR</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-gray-800 font-semibold">Balance</span>
                <span className={`font-bold text-lg ${sarTotals.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {sarTotals.balance.toLocaleString()} SAR
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">EGP Budget</h3>
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" />Income</span>
                <span className="text-green-600 font-semibold">{egpTotals.income.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500" />Expenses</span>
                <span className="text-red-600 font-semibold">{egpTotals.expense.toLocaleString()} EGP</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-gray-800 font-semibold">Balance</span>
                <span className={`font-bold text-lg ${egpTotals.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {egpTotals.balance.toLocaleString()} EGP
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{t.category}</p>
                  <p className="text-sm text-gray-600">{t.date} • {t.payment_method}</p>
                  {t.description && <p className="text-sm text-gray-500 italic mt-1">{t.description}</p>}
                </div>
                <div className="text-right ml-2">
                  <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{parseFloat(t.amount).toLocaleString()} {t.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const AddTransaction = () => {
    const [formData, setFormData] = useState(editingTransaction ? {
      ...editingTransaction,
      paymentMethod: editingTransaction.payment_method
    } : {
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      category: '',
      amount: '',
      currency: 'SAR',
      paymentMethod: '',
      description: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const handleSubmit = async () => {
      if (!formData.category || !formData.amount || !formData.paymentMethod) {
        setFormError('Please fill all required fields');
        return;
      }

      if (parseFloat(formData.amount) <= 0) {
        setFormError('Amount must be greater than 0');
        return;
      }

      setSubmitting(true);
      setFormError('');

      try {
        const payload = {
          date: formData.date,
          type: formData.type,
          category: formData.category,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          paymentMethod: formData.paymentMethod,
          description: formData.description || ''
        };

        if (editingTransaction) {
          const response = await transactionsAPI.update(editingTransaction.id, payload);
          setTransactions(transactions.map(t => t.id === editingTransaction.id ? response.data : t));
          setEditingTransaction(null);
        } else {
          const response = await transactionsAPI.create(payload);
          setTransactions([response.data, ...transactions]);
        }
        setCurrentPage('dashboard');
      } catch (err) {
        setFormError(err.response?.data?.error || 'Failed to save transaction');
      } finally {
        setSubmitting(false);
      }
    };

    const categories = formData.type === 'income' ? incomeCategories : expenseCategories;
    const paymentMethods = formData.currency === 'SAR' ? sarPaymentMethods : egpPaymentMethods;

    return (
      <div className="max-w-2xl mx-auto pb-20 md:pb-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => { setCurrentPage('dashboard'); setEditingTransaction(null); }} className="text-gray-600 hover:text-gray-800">← Back</button>
          <h2 className="text-2xl font-bold text-gray-800">{editingTransaction ? 'Edit' : 'Add'} Transaction</h2>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {formError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
            <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value, category: ''})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setFormData({...formData, currency: 'SAR', paymentMethod: ''})} className={`py-3 rounded-lg font-semibold ${formData.currency === 'SAR' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>SAR</button>
              <button type="button" onClick={() => setFormData({...formData, currency: 'EGP', paymentMethod: ''})} className={`py-3 rounded-lg font-semibold ${formData.currency === 'EGP' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>EGP</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Select category...</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
            <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Select payment method...</option>
              {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
            <input type="number" step="0.01" min="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="0.00" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Add notes..." />
          </div>
          <button onClick={handleSubmit} disabled={submitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2">
            {submitting && <Loader className="w-5 h-5 animate-spin" />}
            {editingTransaction ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </div>
    );
  };

  const AllTransactions = () => {
    const [filters, setFilters] = useState({ currency: 'all', type: 'all', category: 'all', searchText: '', dateFrom: '', dateTo: '' });
    const [showFilters, setShowFilters] = useState(false);

    const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this transaction?')) return;

      try {
        await transactionsAPI.delete(id);
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (err) {
        alert('Failed to delete transaction');
      }
    };

    const handleEdit = (transaction) => {
      setEditingTransaction(transaction);
      setCurrentPage('add');
    };

    const filteredTransactions = transactions.filter(t => {
      if (filters.currency !== 'all' && t.currency !== filters.currency) return false;
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const descMatch = t.description?.toLowerCase().includes(searchLower);
        const catMatch = t.category.toLowerCase().includes(searchLower);
        if (!descMatch && !catMatch) return false;
      }
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      return true;
    });

    const allCategories = [...new Set(transactions.map(t => t.category))];

    return (
      <div className="pb-20 md:pb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Transactions</h2>
          <button onClick={() => setShowFilters(!showFilters)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />Filters
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input type="text" value={filters.searchText} onChange={(e) => setFilters({...filters, searchText: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Search..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select value={filters.currency} onChange={(e) => setFilters({...filters, currency: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Currencies</option>
                  <option value="SAR">SAR Only</option>
                  <option value="EGP">EGP Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expense Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Categories</option>
                  {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                <input type="date" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button onClick={() => setFilters({ currency: 'all', type: 'all', category: 'all', searchText: '', dateFrom: '', dateTo: '' })} className="text-blue-600 text-sm font-medium hover:underline">Clear All Filters</button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{filteredTransactions.length} Transaction{filteredTransactions.length !== 1 ? 's' : ''}</h3>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500"><List className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>No transactions found</p></div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map(t => (
                <div key={t.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{t.category}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.type}</span>
                    </div>
                    <p className="text-sm text-gray-600">{t.date} • {t.payment_method}</p>
                    {t.description && <p className="text-sm text-gray-500 italic mt-1">{t.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'}{parseFloat(t.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{t.currency}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Edit2 className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const BudgetBuilder = () => {
    const [selectedCurrency, setSelectedCurrency] = useState('SAR');
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [editingBudget, setEditingBudget] = useState(null);
    const [budgetAmount, setBudgetAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const getBudgetKey = (category, currency, month) => `${currency}-${month}-${category}`;
    const calculateSpending = (category, currency, month) => {
      return transactions
        .filter(t => t.category === category && t.currency === currency && t.type === 'expense' && t.date.startsWith(month))
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    };

    const handleSetBudget = async (category) => {
      if (!budgetAmount || parseFloat(budgetAmount) < 0) {
        alert('Please enter a valid budget amount');
        return;
      }

      setSubmitting(true);
      try {
        await budgetsAPI.createOrUpdate({
          category,
          amount: parseFloat(budgetAmount),
          currency: selectedCurrency,
          month: selectedMonth
        });

        setBudgets(prev => ({ ...prev, [getBudgetKey(category, selectedCurrency, selectedMonth)]: parseFloat(budgetAmount) }));
        setEditingBudget(null);
        setBudgetAmount('');
      } catch (err) {
        alert('Failed to save budget');
      } finally {
        setSubmitting(false);
      }
    };

    const handleDeleteBudget = async (category) => {
      if (!window.confirm('Delete this budget?')) return;

      try {
        // Find budget ID (would need to store this - simplified for now)
        const key = getBudgetKey(category, selectedCurrency, selectedMonth);
        const newBudgets = { ...budgets };
        delete newBudgets[key];
        setBudgets(newBudgets);
      } catch (err) {
        alert('Failed to delete budget');
      }
    };

    const getProgressColor = (spent, budget) => {
      const pct = (spent / budget) * 100;
      return pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-500' : 'bg-green-500';
    };

    const getProgressTextColor = (spent, budget) => {
      const pct = (spent / budget) * 100;
      return pct >= 100 ? 'text-red-600' : pct >= 80 ? 'text-yellow-600' : 'text-green-600';
    };

    const categories = expenseCategories.filter(cat => cat !== 'Trans from ACC' && cat !== 'EGY Trans');
    const totalBudget = categories.reduce((sum, cat) => sum + (budgets[getBudgetKey(cat, selectedCurrency, selectedMonth)] || 0), 0);
    const totalSpent = categories.reduce((sum, cat) => sum + calculateSpending(cat, selectedCurrency, selectedMonth), 0);

    return (
      <div className="pb-20 md:pb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Budget Builder</h2>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <div className="flex gap-2">
                <button onClick={() => setSelectedCurrency('SAR')} className={`flex-1 py-2 rounded-lg font-medium ${selectedCurrency === 'SAR' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>SAR</button>
                <button onClick={() => setSelectedCurrency('EGP')} className={`flex-1 py-2 rounded-lg font-medium ${selectedCurrency === 'EGP' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>EGP</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div><p className="text-blue-100 text-sm mb-1">Total Budget</p><p className="text-3xl font-bold">{totalBudget.toLocaleString()}</p><p className="text-sm">{selectedCurrency}</p></div>
            <div><p className="text-blue-100 text-sm mb-1">Total Spent</p><p className="text-3xl font-bold">{totalSpent.toLocaleString()}</p><p className="text-sm">{selectedCurrency}</p></div>
            <div><p className="text-blue-100 text-sm mb-1">Remaining</p><p className={`text-3xl font-bold ${totalSpent > totalBudget ? 'text-red-200' : ''}`}>{(totalBudget - totalSpent).toLocaleString()}</p><p className="text-sm">{selectedCurrency}</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Category Budgets</h3>
          <div className="space-y-4">
            {categories.map(category => {
              const key = getBudgetKey(category, selectedCurrency, selectedMonth);
              const budget = budgets[key] || 0;
              const spent = calculateSpending(category, selectedCurrency, selectedMonth);
              const remaining = budget - spent;
              const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

              return (
                <div key={category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{category}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        {editingBudget === category ? (
                          <div className="flex items-center gap-2">
                            <input type="number" step="0.01" min="0" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} placeholder="Amount" className="w-32 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500" autoFocus />
                            <button onClick={() => handleSetBudget(category)} disabled={submitting} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm disabled:bg-gray-400">
                              {submitting ? 'Saving...' : 'Save'}
                            </button>
                            <button onClick={() => { setEditingBudget(null); setBudgetAmount(''); }} className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 text-sm">Cancel</button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm text-gray-600">Budget: <span className="font-semibold">{budget.toLocaleString()} {selectedCurrency}</span></span>
                            <span className="text-sm text-gray-600">Spent: <span className="font-semibold">{spent.toLocaleString()} {selectedCurrency}</span></span>
                            <span className={`text-sm font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>{remaining >= 0 ? 'Left' : 'Over'}: {Math.abs(remaining).toLocaleString()} {selectedCurrency}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {editingBudget !== category && (
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingBudget(category); setBudgetAmount(budget.toString()); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit2 className="w-4 h-4" /></button>
                        {budget > 0 && <button onClick={() => handleDeleteBudget(category)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>}
                      </div>
                    )}
                  </div>
                  {budget > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${getProgressTextColor(spent, budget)}`}>{percentage.toFixed(0)}% used</span>
                        {percentage >= 80 && <span className="flex items-center gap-1 text-sm text-yellow-600"><AlertCircle className="w-4 h-4" />{percentage >= 100 ? 'Over budget!' : 'Near limit'}</span>}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className={`h-3 rounded-full transition-all ${getProgressColor(spent, budget)}`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const ControlPanel = () => {
    const [activeTab, setActiveTab] = useState('categories');
    return (
      <div className="pb-20 md:pb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Control Panel</h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button onClick={() => setActiveTab('categories')} className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'categories' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'}`}>Categories</button>
              <button onClick={() => setActiveTab('payment')} className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'payment' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'}`}>Payment Methods</button>
              <button onClick={() => setActiveTab('balances')} className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'balances' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'}`}>Opening Balances</button>
              <button onClick={() => setActiveTab('exchange')} className={`px-6 py-4 font-medium whitespace-nowrap ${activeTab === 'exchange' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'}`}>Exchange Rate</button>
            </div>
          </div>
          <div className="p-6">
            {activeTab === 'categories' && <p className="text-gray-600">Categories management - Backend integration ready</p>}
            {activeTab === 'payment' && <p className="text-gray-600">Payment methods management - Backend integration ready</p>}
            {activeTab === 'balances' && <p className="text-gray-600">Opening balances management - Backend integration ready</p>}
            {activeTab === 'exchange' && <p className="text-gray-600">Exchange rate settings - Backend integration ready</p>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Clarity</h1>
          </div>
          <button onClick={() => { localStorage.clear(); setIsLoggedIn(false); }} className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
            <LogOut className="w-5 h-5" /><span className="hidden sm:inline">Logout</span>
          </button>
        </div>
        <div className="hidden md:block border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage('dashboard')} className={`px-6 py-3 font-medium ${currentPage === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}><div className="flex items-center gap-2"><Home className="w-5 h-5" />Dashboard</div></button>
              <button onClick={() => setCurrentPage('transactions')} className={`px-6 py-3 font-medium ${currentPage === 'transactions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}><div className="flex items-center gap-2"><List className="w-5 h-5" />All Transactions</div></button>
              <button onClick={() => { setEditingTransaction(null); setCurrentPage('add'); }} className={`px-6 py-3 font-medium ${currentPage === 'add' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}><div className="flex items-center gap-2"><PlusCircle className="w-5 h-5" />Add</div></button>
              <button onClick={() => setCurrentPage('budget')} className={`px-6 py-3 font-medium ${currentPage === 'budget' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}><div className="flex items-center gap-2"><Target className="w-5 h-5" />Budget</div></button>
              <button onClick={() => setCurrentPage('control')} className={`px-6 py-3 font-medium ${currentPage === 'control' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}><div className="flex items-center gap-2"><Settings className="w-5 h-5" />Control Panel</div></button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'add' && <AddTransaction />}
        {currentPage === 'transactions' && <AllTransactions />}
        {currentPage === 'budget' && <BudgetBuilder />}
        {currentPage === 'control' && <ControlPanel />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-5 gap-1">
          <button onClick={() => setCurrentPage('dashboard')} className={`py-2 flex flex-col items-center gap-1 ${currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-600'}`}><Home className="w-5 h-5" /><span className="text-xs">Home</span></button>
          <button onClick={() => setCurrentPage('transactions')} className={`py-2 flex flex-col items-center gap-1 ${currentPage === 'transactions' ? 'text-blue-600' : 'text-gray-600'}`}><List className="w-5 h-5" /><span className="text-xs">All</span></button>
          <button onClick={() => { setEditingTransaction(null); setCurrentPage('add'); }} className={`py-2 flex flex-col items-center gap-1 ${currentPage === 'add' ? 'text-blue-600' : 'text-gray-600'}`}><PlusCircle className="w-5 h-5" /><span className="text-xs">Add</span></button>
          <button onClick={() => setCurrentPage('budget')} className={`py-2 flex flex-col items-center gap-1 ${currentPage === 'budget' ? 'text-blue-600' : 'text-gray-600'}`}><Target className="w-5 h-5" /><span className="text-xs">Budget</span></button>
          <button onClick={() => setCurrentPage('control')} className={`py-2 flex flex-col items-center gap-1 ${currentPage === 'control' ? 'text-blue-600' : 'text-gray-600'}`}><Settings className="w-5 h-5" /><span className="text-xs">Settings</span></button>
        </div>
      </nav>
    </div>
  );
};

export default FinanceTrackerApp;
