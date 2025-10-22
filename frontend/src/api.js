import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Payment Methods API
export const paymentMethodsAPI = {
  getAll: () => api.get('/payment-methods'),
  create: (data) => api.post('/payment-methods', data),
  update: (id, data) => api.put(`/payment-methods/${id}`, data),
  delete: (id) => api.delete(`/payment-methods/${id}`),
};

// Budgets API
export const budgetsAPI = {
  getAll: () => api.get('/budgets'),
  createOrUpdate: (data) => api.post('/budgets', data),
  delete: (id) => api.delete(`/budgets/${id}`),
};

// Opening Balances API
export const openingBalancesAPI = {
  getAll: () => api.get('/opening-balances'),
  set: (data) => api.post('/opening-balances', data),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  updateExchangeRate: (exchangeRate) => api.put('/settings/exchange-rate', { exchangeRate }),
};

export default api;
