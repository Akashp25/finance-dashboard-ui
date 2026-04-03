import React from 'react';

// Simplified App without complex context
function SimpleApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Finance Dashboard</h1>
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
        <h2>Dashboard Overview</h2>
        <p>Total Balance: $5,000</p>
        <p>Total Income: $7,500</p>
        <p>Total Expenses: $2,500</p>
      </div>
      <div style={{ marginTop: '20px', backgroundColor: '#e8f4f8', padding: '20px', borderRadius: '8px' }}>
        <h2>Recent Transactions</h2>
        <ul>
          <li>Salary - $3,500 (Income)</li>
          <li>Rent - $1,200 (Expense)</li>
          <li>Groceries - $85 (Expense)</li>
        </ul>
      </div>
    </div>
  );
}

export default SimpleApp;
