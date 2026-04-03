import React, { useState } from 'react';

// Simple Navigation without context
function SimpleNav() {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <nav style={{
      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
      padding: '1rem',
      borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ color: darkMode ? '#f9fafb' : '#111827', margin: 0 }}>
        Finance Dashboard
      </h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? '#4b5563' : '#f3f4f6',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </nav>
  );
}

// Simple Dashboard
function SimpleDashboard() {
  const mockTransactions = [
    { id: 1, date: '2024-01-15', amount: 3500.00, category: 'Salary', type: 'income', description: 'Monthly salary' },
    { id: 2, date: '2024-01-16', amount: -1200.00, category: 'Rent', type: 'expense', description: 'Monthly rent payment' },
    { id: 3, date: '2024-01-17', amount: -85.50, category: 'Groceries', type: 'expense', description: 'Weekly grocery shopping' },
  ];

  const totalBalance = mockTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = mockTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = mockTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#111827', marginBottom: '1rem' }}>Dashboard Overview</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#dbeafe',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #3b82f6'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>Total Balance</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af', margin: 0 }}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>
        <div style={{
          backgroundColor: '#dcfce7',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #22c55e'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#15803d' }}>Total Income</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803d', margin: 0 }}>
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div style={{
          backgroundColor: '#fee2e2',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #ef4444'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#b91c1c' }}>Total Expenses</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#b91c1c', margin: 0 }}>
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>
      
      <h3 style={{ color: '#111827', marginBottom: '1rem' }}>Recent Transactions</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6' }}>
            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #d1d5db' }}>Date</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #d1d5db' }}>Description</th>
            <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #d1d5db' }}>Category</th>
            <th style={{ padding: '0.75rem', textAlign: 'right', borderBottom: '1px solid #d1d5db' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {mockTransactions.map(transaction => (
            <tr key={transaction.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={{ padding: '0.75rem' }}>{transaction.date}</td>
              <td style={{ padding: '0.75rem' }}>{transaction.description}</td>
              <td style={{ padding: '0.75rem' }}>{transaction.category}</td>
              <td style={{ 
                padding: '0.75rem', 
                textAlign: 'right',
                color: transaction.type === 'income' ? '#22c55e' : '#ef4444',
                fontWeight: 'bold'
              }}>
                {transaction.type === 'income' ? '+' : ''}${transaction.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Simple working app without complex context
function SimpleWorkingApp() {
  console.log('SimpleWorkingApp rendering');
  
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <SimpleNav />
      <SimpleDashboard />
    </div>
  );
}

export default SimpleWorkingApp;
