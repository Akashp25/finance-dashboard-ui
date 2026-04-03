import React from 'react';
import { useApp } from '../context/AppContext';
import TransactionTable from '../components/TransactionTable';
import Filters from '../components/Filters';
import AddTransactionModal from '../components/AddTransactionModal';
import RoleSwitcher from '../components/RoleSwitcher';
import { Plus, Moon, Sun, Download, Search, Filter, TrendingUp, Receipt } from 'lucide-react';

const Transactions = () => {
  const {
    filteredTransactions,
    filters,
    setFilters,
    role,
    setRole,
    darkMode,
    toggleDarkMode,
    showAddModal,
    toggleAddModal,
    addTransaction,
    editTransaction,
    deleteTransaction,
    setEditingTransaction
  } = useApp();

  const canEdit = role === 'admin';

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    toggleAddModal();
  };

  const handleSubmit = (transactionData) => {
    if (transactionData.id) {
      editTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const csvData = filteredTransactions.map(transaction => [
      transaction.date,
      transaction.description,
      transaction.category,
      transaction.type,
      transaction.amount.toString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-emerald-500 to-teal-500'} shadow-lg`}>
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                    Transactions
                  </h1>
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage and track all your financial transactions
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total:</span>
                  <span className={`ml-2 text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {filteredTransactions.length} transactions
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200'} border text-sm font-medium`}>
                  {canEdit ? 'Admin Access' : 'View Only'}
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

        {/* Action Bar */}
        <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {canEdit && (
                <button
                  onClick={toggleAddModal}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                    darkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105' 
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
                  } shadow-lg`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Transaction</span>
                </button>
              )}
              
              <button
                onClick={exportToCSV}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                } border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
              >
                <Download className="w-5 h-5" />
                <span>Export CSV</span>
              </button>
            </div>
            
            {!canEdit && (
              <div className={`px-4 py-2 rounded-xl ${darkMode ? 'bg-amber-900/30 text-amber-400 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200'} border text-sm font-medium flex items-center space-x-2`}>
                <Filter className="w-4 h-4" />
                <span>Switch to Admin role to edit transactions</span>
              </div>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <Filters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Results Summary */}
        <div className={`mb-6 p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Showing {filteredTransactions.length} of {filteredTransactions.length} transactions
                </span>
              </div>
              
              {(filters.search || filters.category !== 'all' || filters.type !== 'all') && (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full bg-blue-500`}></div>
                  <span className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'} font-medium`}>
                    Filters applied
                  </span>
                </div>
              )}
            </div>
            
            {(filters.search || filters.category !== 'all' || filters.type !== 'all') && (
              <button
                onClick={() => setFilters({ search: '', category: 'all', type: 'all', sortBy: 'date', sortOrder: 'desc' })}
                className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors duration-200`}
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canEdit={canEdit}
          emptyMessage={
            filters.search || filters.category !== 'all' || filters.type !== 'all' 
              ? 'No transactions match your filters' 
              : 'No transactions found'
          }
        />

        {/* Add Transaction Modal */}
        <AddTransactionModal
          isOpen={showAddModal}
          onClose={() => {
            toggleAddModal();
            setEditingTransaction(null);
          }}
          onSubmit={handleSubmit}
          editingTransaction={null}
        />
      </div>
    </div>
  );
};

export default Transactions;
