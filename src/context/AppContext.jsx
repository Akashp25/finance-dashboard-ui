import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiCall } from '../services/api';
import { mockTransactions } from '../data/mockTransactions';

const AppContext = createContext();

const initialState = {
  transactions: mockTransactions,
  filters: {
    search: '',
    category: 'all',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  },
  role: 'viewer',
  darkMode: false,
  showAddModal: false,
  editingTransaction: null,
  loading: false,
  error: null,
  apiStatus: 'idle', // idle, loading, success, error
  groupedData: null,
  insights: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    
    case 'EDIT_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
        editingTransaction: null
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload)
      };
    
    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case 'SET_ROLE':
      return {
        ...state,
        role: action.payload
      };
    
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode
      };
    
    case 'TOGGLE_ADD_MODAL':
      return {
        ...state,
        showAddModal: !state.showAddModal
      };
    
    case 'SET_EDITING_TRANSACTION':
      return {
        ...state,
        editingTransaction: action.payload
      };
    
    case 'LOAD_TRANSACTIONS_FROM_STORAGE':
      return {
        ...state,
        transactions: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'SET_API_STATUS':
      return {
        ...state,
        apiStatus: action.payload
      };
    
    case 'SET_GROUPED_DATA':
      return {
        ...state,
        groupedData: action.payload
      };
    
    case 'SET_INSIGHTS':
      return {
        ...state,
        insights: action.payload
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Add debug logging
  console.log('AppProvider rendering, transactions count:', state.transactions.length);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    console.log('Initializing AppProvider, savedTransactions:', savedTransactions);
    
    if (savedTransactions) {
      try {
        const transactions = JSON.parse(savedTransactions);
        dispatch({ type: 'LOAD_TRANSACTIONS_FROM_STORAGE', payload: transactions });
      } catch (error) {
        console.error('Error loading transactions from localStorage:', error);
      }
    } else {
      // Initialize with mock data if no saved data
      console.log('No saved data, initializing with mock data');
      localStorage.setItem('transactions', JSON.stringify(mockTransactions));
      dispatch({ type: 'LOAD_TRANSACTIONS_FROM_STORAGE', payload: mockTransactions });
    }
    
    if (savedDarkMode) {
      const darkMode = JSON.parse(savedDarkMode);
      if (darkMode !== state.darkMode) {
        dispatch({ type: 'TOGGLE_DARK_MODE' });
      }
    }
  }, []);

  // Initialize grouped data and insights when transactions change
  useEffect(() => {
    console.log('Transactions changed, count:', state.transactions.length);
    // Removed problematic GroupingService calls
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(state.transactions));
  }, [state.transactions]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
  }, [state.darkMode]);

  const addTransaction = async (transaction) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_API_STATUS', payload: 'loading' });
      
      const response = await apiCall(api.addTransaction, transaction);
      
      if (response.success) {
        dispatch({ type: 'ADD_TRANSACTION', payload: response.data });
        dispatch({ type: 'SET_API_STATUS', payload: 'success' });
        // updateGroupedDataAndInsights(); // Remove this - will be called by useEffect
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const editTransaction = async (transaction) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_API_STATUS', payload: 'loading' });
      
      const response = await apiCall(api.updateTransaction, transaction.id, transaction);
      
      if (response.success) {
        dispatch({ type: 'EDIT_TRANSACTION', payload: response.data });
        dispatch({ type: 'SET_API_STATUS', payload: 'success' });
        // updateGroupedDataAndInsights(); // Remove this - will be called by useEffect
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteTransaction = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_API_STATUS', payload: 'loading' });
      
      const response = await apiCall(api.deleteTransaction, id);
      
      if (response.success) {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
        dispatch({ type: 'SET_API_STATUS', payload: 'success' });
        // updateGroupedDataAndInsights(); // Remove this - will be called by useEffect
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadTransactions = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_API_STATUS', payload: 'loading' });
      
      const response = await apiCall(api.getTransactions);
      
      if (response.success) {
        dispatch({ type: 'LOAD_TRANSACTIONS_FROM_STORAGE', payload: response.data });
        dispatch({ type: 'SET_API_STATUS', payload: 'success' });
        // updateGroupedDataAndInsights(); // Remove this - will be called by useEffect
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      dispatch({ type: 'SET_API_STATUS', payload: 'error' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setRole = (role) => {
    dispatch({ type: 'SET_ROLE', payload: role });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const toggleAddModal = () => {
    dispatch({ type: 'TOGGLE_ADD_MODAL' });
  };

  const setEditingTransaction = (transaction) => {
    dispatch({ type: 'SET_EDITING_TRANSACTION', payload: transaction });
  };

  const filteredTransactions = state.transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(state.filters.search.toLowerCase());
    const matchesCategory = state.filters.category === 'all' || transaction.category === state.filters.category;
    const matchesType = state.filters.type === 'all' || transaction.type === state.filters.type;
    
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    const { sortBy, sortOrder } = state.filters;
    let comparison = 0;
    
    if (sortBy === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'amount') {
      comparison = a.amount - b.amount;
    } else if (sortBy === 'category') {
      comparison = a.category.localeCompare(b.category);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const totalBalance = state.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpenses = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const value = {
    ...state,
    filteredTransactions,
    totalBalance,
    totalIncome,
    totalExpenses,
    addTransaction,
    editTransaction,
    deleteTransaction,
    loadTransactions,
    setFilters,
    setRole,
    toggleDarkMode,
    toggleAddModal,
    setEditingTransaction,
    // Simplified - removed problematic grouped data
    spendingByGroup: [],
    incomeByGroup: [],
    monthlyGroupedData: [],
    spendingPatterns: {},
    recommendations: []
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
