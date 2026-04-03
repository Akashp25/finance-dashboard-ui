// Mock API Service
// Simulates API calls with realistic delays and responses

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Date.now() + Math.random();

// Simulate network latency
const NETWORK_DELAY = { min: 300, max: 800 };

const randomDelay = () => {
  const { min, max } = NETWORK_DELAY;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Mock API endpoints
export const api = {
  // Transactions
  async getTransactions() {
    await delay(randomDelay());
    
    // Simulate API response structure
    return {
      success: true,
      data: JSON.parse(localStorage.getItem('transactions') || '[]'),
      message: 'Transactions retrieved successfully',
      timestamp: new Date().toISOString()
    };
  },

  async addTransaction(transactionData) {
    await delay(randomDelay());
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const newTransaction = {
      id: generateId(),
      ...transactionData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    return {
      success: true,
      data: newTransaction,
      message: 'Transaction added successfully',
      timestamp: new Date().toISOString()
    };
  },

  async updateTransaction(id, transactionData) {
    await delay(randomDelay());
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const index = transactions.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    
    transactions[index] = {
      ...transactions[index],
      ...transactionData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    return {
      success: true,
      data: transactions[index],
      message: 'Transaction updated successfully',
      timestamp: new Date().toISOString()
    };
  },

  async deleteTransaction(id) {
    await delay(randomDelay());
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const filteredTransactions = transactions.filter(t => t.id !== id);
    
    if (transactions.length === filteredTransactions.length) {
      throw new Error('Transaction not found');
    }
    
    localStorage.setItem('transactions', JSON.stringify(filteredTransactions));
    
    return {
      success: true,
      data: { id },
      message: 'Transaction deleted successfully',
      timestamp: new Date().toISOString()
    };
  },

  // Analytics endpoints
  async getFinancialSummary() {
    await delay(randomDelay());
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {});
    
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      if (t.type === 'income') {
        acc[month].income += t.amount;
      } else {
        acc[month].expenses += Math.abs(t.amount);
      }
      return acc;
    }, {});
    
    return {
      success: true,
      data: {
        totalBalance: totalIncome - totalExpenses,
        totalIncome,
        totalExpenses,
        savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
        categorySpending,
        monthlyData: Object.values(monthlyData),
        transactionCount: transactions.length
      },
      message: 'Financial summary retrieved successfully',
      timestamp: new Date().toISOString()
    };
  },

  async getSpendingInsights() {
    await delay(randomDelay());
    
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    // Calculate insights
    const categorySpending = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
        return acc;
      }, {});
    
    const totalExpenses = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);
    
    const insights = {
      highestSpendingCategory: Object.entries(categorySpending)
        .sort(([, a], [, b]) => b - a)[0] || ['None', 0],
      
      spendingTrends: transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
          const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          if (!acc[month]) acc[month] = 0;
          acc[month] += Math.abs(t.amount);
          return acc;
        }, {}),
      
      averageMonthlySpending: totalExpenses > 0 ? totalExpenses / 12 : 0,
      
      topCategories: Object.entries(categorySpending)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
        }))
    };
    
    return {
      success: true,
      data: insights,
      message: 'Spending insights retrieved successfully',
      timestamp: new Date().toISOString()
    };
  },

  // Simulate API errors for testing
  async simulateError(endpoint) {
    await delay(randomDelay());
    
    const errors = [
      { message: 'Network timeout occurred', code: 'NETWORK_TIMEOUT' },
      { message: 'Server temporarily unavailable', code: 'SERVER_ERROR' },
      { message: 'Invalid request format', code: 'INVALID_REQUEST' }
    ];
    
    const error = errors[Math.floor(Math.random() * errors.length)];
    
    throw new Error(error.message);
  }
};

// API wrapper with error handling
export const apiCall = async (apiFunction, ...args) => {
  try {
    const response = await apiFunction(...args);
    return response;
  } catch (error) {
    console.error('API Error:', error);
    throw {
      success: false,
      error: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    };
  }
};
