import React from 'react';
import { useApp } from '../context/AppContext';
import SummaryCards from '../components/SummaryCards';
import Charts from '../components/Charts';
import RoleSwitcher from '../components/RoleSwitcher';
import { BarChart3, Moon, Sun, TrendingUp, Clock, ArrowUp, ArrowDown, MoreVertical } from 'lucide-react';

const Dashboard = () => {
  const { 
    totalBalance, 
    totalIncome, 
    totalExpenses, 
    transactions, 
    role, 
    setRole, 
    darkMode, 
    toggleDarkMode 
  } = useApp();

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Salary': 'from-blue-500 to-blue-600',
      'Freelance': 'from-purple-500 to-purple-600',
      'Investment': 'from-emerald-500 to-emerald-600',
      'Rent': 'from-red-500 to-red-600',
      'Groceries': 'from-orange-500 to-orange-600',
      'Transportation': 'from-yellow-500 to-yellow-600',
      'Entertainment': 'from-pink-500 to-pink-600',
      'Utilities': 'from-indigo-500 to-indigo-600',
      'Healthcare': 'from-teal-500 to-teal-600',
      'Shopping': 'from-emerald-500 to-emerald-600',
      'Dining': 'from-amber-500 to-amber-600',
      'Insurance': 'from-slate-500 to-slate-600',
      'Fitness': 'from-lime-500 to-lime-600',
      'Education': 'from-cyan-500 to-cyan-600',
      'Communication': 'from-violet-500 to-violet-600',
      'Personal': 'from-rose-500 to-rose-600',
      'Pet': 'from-fuchsia-500 to-fuchsia-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} shadow-lg`}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    Finance Dashboard
                  </h1>
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Track your income, expenses, and financial insights
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Welcome back</span>
                  <span className={`ml-2 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</span>
                </div>
                <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200'} border text-sm font-medium`}>
                  Active Account
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <RoleSwitcher currentRole={role} onRoleChange={setRole} />
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-2xl transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:scale-105'
                } shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards 
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

        {/* Charts Section */}
        <Charts transactions={transactions} />

        {/* Recent Transactions */}
        <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
            <div className={`w-32 h-32 ${darkMode ? 'bg-purple-500' : 'bg-purple-400'} rounded-full blur-3xl`}></div>
          </div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <Clock className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Transactions
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Latest financial activity
                  </p>
                </div>
              </div>
              
              <button className={`p-2 rounded-lg transition-colors duration-150 ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}>
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                  } ${index === 0 ? 'ring-2 ring-blue-500/20' : ''}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryColor(transaction.category)} flex items-center justify-center shadow-lg`}>
                      {transaction.type === 'income' ? (
                        <ArrowUp className="w-6 h-6 text-white" />
                      ) : (
                        <ArrowDown className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {transaction.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                          {transaction.category}
                        </span>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(transaction.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${
                      transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} capitalize mt-1`}>
                      {transaction.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                View All Transactions →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
