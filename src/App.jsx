import React from 'react';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';

function App() {
  // Add debug logging
  console.log('App component rendering');
  
  return (
    <AppProvider>
      <div className="min-h-screen">
        <Navigation />
        <main>
          <section id="dashboard">
            <Dashboard />
          </section>
          <section id="transactions">
            <Transactions />
          </section>
          <section id="insights">
            <Insights />
          </section>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
