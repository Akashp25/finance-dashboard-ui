import React, { createContext, useContext, useState } from 'react';

const SimpleAppContext = createContext();

export const SimpleAppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-01-15', amount: 3500.00, category: 'Salary', type: 'income', description: 'Monthly salary' },
    { id: 2, date: '2024-01-16', amount: -1200.00, category: 'Rent', type: 'expense', description: 'Monthly rent payment' },
    { id: 3, date: '2024-01-17', amount: -85.50, category: 'Groceries', type: 'expense', description: 'Weekly grocery shopping' },
  ]);

  const [darkMode, setDarkMode] = useState(false);

  const value = {
    transactions,
    darkMode,
    toggleDarkMode: () => setDarkMode(!darkMode),
    // Simple calculations
    totalBalance: transactions.reduce((sum, t) => sum + t.amount, 0),
    totalIncome: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    totalExpenses: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0),
  };

  return (
    <SimpleAppContext.Provider value={value}>
      {children}
    </SimpleAppContext.Provider>
  );
};

export const useSimpleApp = () => {
  const context = useContext(SimpleAppContext);
  if (!context) {
    throw new Error('useSimpleApp must be used within a SimpleAppProvider');
  }
  return context;
};
