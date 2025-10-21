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
              <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
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
                            <input type="number" step="0.01" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} placeholder="Amount" className="w-32 px-3 py-1 border border-gray-300 rounded" autoFocus />
                            <button onClick={() => handleSetBudget(category)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">Save</button>
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
                        <button onClick={() => { setEditingBudget(category); setBudgetAmount(budget.toString()); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        {budget > 0 && <button onClick={() => handleDeleteBudget(category)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>}
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
    const [newItem, setNewItem] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [selectedCurrency, setSelectedCurrency] = useState('SAR');

    const ManageCategories = () => {
      const [categoryType, setCategoryType] = useState('expense');
      const categories = categoryType === 'income' ? incomeCategories : expenseCategories;
      const setCategories = categoryType === 'income' ? setIncomeCategories : setExpenseCategories;

      const handleAdd = () => {
        if (!newItem.trim()) return;
        if (categories.includes(newItem.trim())) { alert('Category already exists!'); return; }
        setCategories([...categories, newItem.trim()]);
        setNewItem('');
      };

      const handleEdit = (oldName, newName) => {
        if (!newName.trim()) return;
        setCategories(categories.map(c => c === oldName ? newName.trim() : c));
        setTransactions(transactions.map(t => t.category === oldName ? {...t, category: newName.trim()} : t));
        setEditingItem(null);
      };

      const handleDelete = (categoryName) => {
        const used = transactions.some(t => t.category === categoryName);
        if (used && !window.confirm(`"${categoryName}" is used in transactions. Delete anyway?`)) return;
        setCategories(categories.filter(c => c !== categoryName));
      };

      return (
        <div className="space-y-4">
          <div className="flex gap-4 mb-6">
            <button onClick={() => setCategoryType('expense')} className={`px-6 py-2 rounded-lg font-medium ${categoryType === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Expense Categories</button>
            <button onClick={() => setCategoryType('income')} className={`px-6 py-2 rounded-lg font-medium ${categoryType === 'income' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>Income Categories</button>
          </div>
          <div className="flex gap-2">
            <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdd()} placeholder="Add new category..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
            <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Add</button>
          </div>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                {editingItem === cat ? (
                  <input type="text" defaultValue={cat} onBlur={(e) => handleEdit(cat, e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleEdit(cat, e.target.value)} autoFocus className="flex-1 px-3 py-1 border border-gray-300 rounded" />
                ) : (
                  <>
                    <span className="flex-1 text-gray-800">{cat}</span>
                    <button onClick={() => setEditingItem(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(cat)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    const ManagePaymentMethods = () => {
      const methods = selectedCurrency === 'SAR' ? sarPaymentMethods : egpPaymentMethods;
      const setMethods = selectedCurrency === 'SAR' ? setSarPaymentMethods : setEgpPaymentMethods;

      const handleAdd = () => {
        if (!newItem.trim()) return;
        if (methods.includes(newItem.trim())) { alert('Payment method already exists!'); return; }
        setMethods([...methods, newItem.trim()]);
        setNewItem('');
      };

      const handleEdit = (oldName, newName) => {
        if (!newName.trim()) return;
        setMethods(methods.map(m => m === oldName ? newName.trim() : m));
        setTransactions(transactions.map(t => t.paymentMethod === oldName && t.currency === selectedCurrency ? {...t, paymentMethod: newName.trim()} : t));
        setEditingItem(null);
      };

      const handleDelete = (methodName) => {
        const used = transactions.some(t => t.paymentMethod === methodName && t.currency === selectedCurrency);
        if (used && !window.confirm(`"${methodName}" is used in transactions. Delete anyway?`)) return;
        setMethods(methods.filter(m => m !== methodName));
      };

      return (
        <div className="space-y-4">
          <div className="flex gap-4 mb-6">
            <button onClick={() => setSelectedCurrency('SAR')} className={`px-6 py-2 rounded-lg font-medium ${selectedCurrency === 'SAR' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>SAR Methods</button>
            <button onClick={() => setSelectedCurrency('EGP')} className={`px-6 py-2 rounded-lg font-medium ${selectedCurrency === 'EGP' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>EGP Methods</button>
          </div>
          <div className="flex gap-2">
            <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdd()} placeholder="Add new payment method..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg" />
            <button onClick={handleAdd} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Add</button>
          </div>
          <div className="space-y-2">
            {methods.map(method => (
              <div key={method} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                {editingItem === method ? (
                  <input type="text" defaultValue={method} onBlur={(e) => handleEdit(method, e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleEdit(method, e.target.value)} autoFocus className="flex-1 px-3 py-1 border border-gray-300 rounded" />
                ) : (
                  <>
                    <span className="flex-1 text-gray-800">{method}</span>
                    <button onClick={() => setEditingItem(method)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(method)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    };

    const ManageBalances = () => {
      const [localBalances, setLocalBalances] = useState({});
      
      const calculateBalance = (paymentMethod, currency) => {
        const opening = openingBalances[`${currency}-${paymentMethod}`] || 0;
        const txns = transactions.filter(t => t.paymentMethod === paymentMethod && t.currency === currency);
        const total = txns.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, opening);
        return { opening, current: total };
      };

      const handleBalanceChange = (paymentMethod, currency, value) => {
        setLocalBalances(prev => ({ ...prev, [`${currency}-${paymentMethod}`]: value }));
      };

      const handleBalanceBlur = (paymentMethod, currency, value) => {
        setOpeningBalances(prev => ({ ...prev, [`${currency}-${paymentMethod}`]: value === '' ? 0 : parseFloat(value) || 0 }));
      };

      const getDisplayValue = (paymentMethod, currency) => {
        const key = `${currency}-${paymentMethod}`;
        return localBalances[key] !== undefined ? localBalances[key] : (openingBalances[key] || '');
      };

      return (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">💡 <strong>Opening Balance:</strong> The starting amount you had in each account before using this app.</p>
          </div>
          <div className="flex gap-4 mb-6">
            <button onClick={() => setSelectedCurrency('SAR')} className={`px-6 py-2 rounded-lg font-medium ${selectedCurrency === 'SAR' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}>SAR Accounts</button>
            <button onClick={() => setSelectedCurrency('EGP')} className={`px-6 py-2 rounded-lg font-medium ${selectedCurrency === 'EGP' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>EGP Accounts</button>
          </div>
          <div className="space-y-3">
            {(selectedCurrency === 'SAR' ? sarPaymentMethods : egpPaymentMethods).map(method => {
              const balances = calculateBalance(method, selectedCurrency);
              return (
                <div key={method} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">{method}</h4>
                    <span className={`font-bold text-lg ${balances.current >= 0 ? 'text-green-600' : 'text-red-600'}`}>{balances.current.toLocaleString()} {selectedCurrency}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Opening Balance:</label>
                    <input type="number" step="0.01" value={getDisplayValue(method, selectedCurrency)} onChange={(e) => handleBalanceChange(method, selectedCurrency, e.target.value)} onBlur={(e) => handleBalanceBlur(method, selectedCurrency, e.target.value)} className="w-32 px-3 py-1 border border-gray-300 rounded" placeholder="0.00" />
                    <span className="text-sm text-gray-500">Current: {balances.current.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const ExchangeRateSettings = () => {
      const [tempRate, setTempRate] = useState(exchangeRate);

      return (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">💱 Set the exchange rate between SAR and EGP.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Exchange Rate: 1 SAR = ? EGP</label>
            <div className="flex items-center gap-4">
              <input type="number" step="0.01" value={tempRate} onChange={(e) => setTempRate(parseFloat(e.target.value))} className="w-32 px-4 py-2 border border-gray-300 rounded-lg" />
              <span className="text-gray-600">EGP</span>
              <button onClick={() => setExchangeRate(tempRate)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Update Rate</button>
            </div>
            <p className="text-sm text-gray-500 mt-3">Current rate: 1 SAR = {exchangeRate} EGP</p>
          </div>
        </div>
      );
    };

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
            {activeTab === 'categories' && <ManageCategories />}
            {activeTab === 'payment' && <ManagePaymentMethods />}
            {activeTab === 'balances' && <ManageBalances />}
            {activeTab === 'exchange' && <ExchangeRateSettings />}
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
            <h1 className="text-xl font-bold text-gray-800">Finance Tracker</h1>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
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
```

5. **Click "Commit new file"**

---

## ✅ DONE! App.jsx is uploaded!

This is the **COMPLETE APP** with all 5 features working!

---

**Your GitHub repo now has:**
```
finance-tracker-app/
├── README.md ✅
└── frontend/
    ├── package.json ✅
    ├── public/
    │   └── index.html ✅
    └── src/
        ├── index.js ✅
        ├── index.css ✅
        └── App.jsx ✅ (THE BIG ONE!)
