import React from 'react';
import { SimpleAppProvider, useSimpleApp } from './context/AppContext.simple.jsx';

// Simple Navigation
function SimpleNav() {
  const { darkMode, toggleDarkMode } = useSimpleApp();
  return (
    <nav style={{
      backgroundColor: darkMode ? '#333' : '#fff',
      padding: '1rem',
      borderBottom: `1px solid ${darkMode ? '#555' : '#ddd'}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ color: darkMode ? '#fff' : '#333', margin: 0 }}>Finance Dashboard</h1>
      <button
        onClick={toggleDarkMode}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: darkMode ? '#555' : '#ddd',
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
  const { totalBalance, totalIncome, totalExpenses } = useSimpleApp();
  
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Dashboard Overview</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #2196f3'
        }}>
          <h3>Total Balance</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>
        <div style={{
          backgroundColor: '#e8f5e8',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #4caf50'
        }}>
          <h3>Total Income</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
            ${totalIncome.toFixed(2)}
          </p>
        </div>
        <div style={{
          backgroundColor: '#ffebee',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid #f44336'
        }}>
          <h3>Total Expenses</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c62828' }}>
            ${totalExpenses.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}

// Main App with simple context
function AppWithContextTest() {
  return (
    <SimpleAppProvider>
      <div style={{ minHeight: '100vh' }}>
        <SimpleNav />
        <SimpleDashboard />
      </div>
    </SimpleAppProvider>
  );
}

export default AppWithContextTest;
