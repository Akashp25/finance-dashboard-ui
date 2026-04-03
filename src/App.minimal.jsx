import React from 'react';

function MinimalApp() {
  console.log('MinimalApp rendering');
  
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '24px' }}>Minimal Test App</h1>
      <p>If you can see this, the basic React setup is working.</p>
      <p>The issue is in the main App components.</p>
    </div>
  );
}

export default MinimalApp;
