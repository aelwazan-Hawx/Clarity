import React, { useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, Wallet, DollarSign, LogOut, Home, List, Edit2, Trash2, Search, Filter, Settings, Target, AlertCircle } from 'lucide-react';

const FinanceTrackerApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(0.21);
  
  const [incomeCategories, setIncomeCategories] = useState([
    'Salaries & Wages', 'Rental Income', 'Dividends', 'Investments', 'Other Income', 'Business Income'
  ]);

  const [expenseCategories, setExpenseCategories] = useState([
    'Trans from ACC', 'Financing, installments', 'Invest&Savings', 'Charitable Donations',
    'Markets', 'Childcare', 'Clothing And Shoes', 'Health Care family', 'Utilities (Monthly)',
    'Rent Per Month', 'Personal Supplies', 'Restaurants', 'Transportation', 'Vacation\\Travel',
    'Family&Friends Gift', 'EGY Trans', 'installment Storia', 'installment M-V',
    'maintenance home', 'Remaining Credit Loan', 'Remaining OverDraft Acc', 'Moon pocket money'
  ]);

  const [sarPaymentMethods, setSarPaymentMethods] = useState([
    'Sabb', 'Sabb\\Visa', 'Riyad', 'Riyad\\Master', 'Riyad\\Visa PIS',
    'SNB - Mada', 'SNB-Master', 'SNB-Flexi', 'UrPay', 'Alrajhi', 'D360',
    'STCpay', 'Tiqmo', 'Pay', 'NBD ACC', 'NBD', 'NBD6400', 'wallet',
    'Baseeta', 'Master', 'Visa -Emkan'
  ]);

  const [egpPaymentMethods, setEgpPaymentMethods] = useState([
    'CIB_Current', 'CIB_Saving', 'CIB_$', 'NBE_Current', 'Wallet_Egy',
    'MILES', 'EVERYWHERE TITANIUM', 'Other\\', 'Other\\ NBE from -', 'Other\\ CIB from -'
  ]);

  const [openingBalances, setOpeningBalances] = useState({});
  const [budgets, setBudgets] = useState({});
  
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-10-20', type: 'expense', category: 'Markets', amount: 500, currency: 'SAR', paymentMethod: 'Sabb', description: 'Weekly groceries' },
    { id: 2, date: '2025-10-20', type: 'income', category: 'Salaries & Wages', amount: 15000, currency: 'SAR', paymentMethod: 'Alrajhi', description: 'Monthly salary' },
    { id: 3, date: '2025-10-19', type: 'expense', category: 'Restaurants', amount: 200, currency: 'EGP', paymentMethod: 'CIB_Current', description: 'Dinner' },
  ]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <Wallet className="w-16 h-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Finance Tracker</h1>
            <p className="text-gray-600 mt-2">Manage your finances effortlessly</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
            </div>
            <button onClick={() => setIsLoggedIn(true)} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Sign In
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">Demo - Click Sign In to continue</p>
        </div>
      </div>
    );
  }

  const Dashboard = () => {
    const calculateTotals = (currency) => {
      const currencyTxns = transactions.filter(t => t.currency === currency);
      const income = currencyTxns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expense = currencyTxns.filter(t => t.type === 'expense' && t.category !== 'Trans from ACC' && t.category !== 'EGY Trans').reduce((sum, t) => sum + t.amount, 0);
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
                  <p className="text-sm text-gray-600">{t.date} • {t.paymentMethod}</p>
                  {t.description && <p className="text-sm text-gray-500 italic mt-1">{t.description}</p>}
                </div>
                <div className="text-right ml-2">
                  <p className={`font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()} {t.currency}
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
    const [formData, setFormData] = useState(editingTransaction || {
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      category: '',
      amount: '',
      currency: 'SAR',
      paymentMethod: '',
      description: ''
    });

    const handleSubmit = () => {
      if (!formData.category || !formData.amount || !formData.paymentMethod) {
        alert('Please fill all required fields');
        return;
      }
      
      if (editingTransaction) {
        setTransactions(transactions.map(t => t.id === editingTransaction.id ? { ...formData, id: editingTransaction.id, amount: parseFloat(formData.amount) } : t));
        setEditingTransaction(null);
      } else {
        setTransactions([{ id: Date.now(), ...formData, amount: parseFloat(formData.amount) }, ...transactions]);
      }
      setCurrentPage('dashboard');
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value, category: ''})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setFormData({...formData, currency: 'SAR', paymentMethod: ''})} className={`py-3 rounded-lg font-semibold ${formData.currency === 'SAR' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>SAR</button>
              <button type="button" onClick={() => setFormData({...formData, currency: 'EGP', paymentMethod: ''})} className={`py-3 rounded-lg font-semibold ${formData.currency === 'EGP' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>EGP</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Select category...</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select value={formData.paymentMethod} onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Select payment method...</option>
              {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <input type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="3" placeholder="Add notes..." />
          </div>
          <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            {editingTransaction ? 'Update' : 'Add'} Transaction
          </button>
        </div>
      </div>
    );
  };

  const AllTransactions = () => {
    const [filters, setFilters] = useState({ currency: 'all', type: 'all', category: 'all', searchText: '', dateFrom: '', dateTo: '' });
    const [showFilters, setShowFilters] = useState(false);

    const handleDelete = (id) => {
      if (window.confirm('Are you sure?')) setTransactions(transactions.filter(t => t.id !== id));
    };

    const handleEdit = (transaction) => {
      setEditingTransaction(transaction);
      setCurrentPage('add');
    };

    const filteredTransactions = transactions.filter(t => {
      if (filters.currency !== 'all' && t.currency !== filters.currency) return false;
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.category !== 'all' && t.category !== filters.category) return false;
      if (filters.searchText && !t.description.toLowerCase().includes(filters.searchText.toLowerCase()) && !t.category.toLowerCase().includes(filters.searchText.toLowerCase())) return false;
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
                  <input type="text" value={filters.searchText} onChange={(e) => setFilters({...filters, searchText: e.target.value})} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg" placeholder="Search..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select value={filters.currency} onChange={(e) => setFilters({...filters, currency: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="all">All Currencies</option>
                  <option value="SAR">SAR Only</option>
                  <option value="EGP">EGP Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="all">All Types</option>
                  <option value="income">Income Only</option>
                  <option value="expense">Expense Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                  <option value="all">All Categories</option>
                  {allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                <input type="date" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                <input type="date" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
            </div>
            <button onClick={() => setFilters({ currency: 'all', type: 'all', category: 'all', searchText: '', dateFrom: '', dateTo: '' })} className="text-blue-600 text-sm font-medium">Clear All Filters</button>
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
                    <p className="text-sm text-gray-600">{t.date} • {t.paymentMethod}</p>
                    {t.description && <p className="text-sm text-gray-500 italic mt-1">{t.description}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-bold text-lg ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{t.currency}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
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

    const getBudgetKey = (category, currency, month) => `${currency}-${month}-${category}`;
    const calculateSpending = (category, currency, month) => transactions.filter(t => t.category === category && t.currency === currency && t.type === 'expense' && t.date.startsWith(month)).reduce((sum, t) => sum + t.amount, 0);

    const handleSetBudget = (category) => {
      if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
        alert('Please enter a valid budget');
        return;
      }
      setBudgets(prev => ({ ...prev, [getBudgetKey(category, selectedCurrency, selectedMonth)]: parseFloat(budgetAmount) }));
      setEditingBudget(null);
      setBudgetAmount('');
    };

    const handleDeleteBudget = (category) => {
      const newBudgets = { ...budgets };
      delete newBudgets[getBudgetKey(category, selectedCurrency, selectedMonth)];
      setBudgets(newBudgets);
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
        <h2
