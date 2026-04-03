import React from 'react';
import { useApp } from '../context/AppContext';
import { Edit2, Trash2, ArrowUp, ArrowDown, MoreVertical, Calendar, DollarSign } from 'lucide-react';

const TransactionTable = ({ 
  transactions, 
  onEdit, 
  onDelete, 
  canEdit = false,
  emptyMessage = 'No transactions found' 
}) => {
  const { darkMode } = useApp();
  
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  if (transactions.length === 0) {
    return (
      <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'} p-12 text-center`}>
        <div className="mb-6">
          <div className={`w-20 h-20 mx-auto rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
            <Calendar className={`w-10 h-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {emptyMessage}
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
          Start by adding your first transaction to track your finances
        </p>
        {canEdit && (
          <button className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            darkMode 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}>
            Add Your First Transaction
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-900/50' : 'bg-gray-50/80'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <tr>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </div>
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Description
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Category
              </th>
              <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Type
              </th>
              <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center justify-end space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Amount</span>
                </div>
              </th>
              {canEdit && (
                <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {transactions.map((transaction, index) => (
              <tr 
                key={transaction.id} 
                className={`transition-all duration-200 ${
                  darkMode 
                    ? 'hover:bg-gray-700/50' 
                    : 'hover:bg-gray-50'
                } ${index === 0 ? 'ring-2 ring-blue-500/20 ring-inset' : ''}`}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-rose-100 text-rose-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-medium">{formatDate(transaction.date)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {transaction.description}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                      Transaction ID: #{transaction.id}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getCategoryColor(transaction.category)}`}></div>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {transaction.category}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}></div>
                    <span className={`text-sm font-semibold capitalize ${
                      transaction.type === 'income' 
                        ? 'text-emerald-600' 
                        : 'text-rose-600'
                    }`}>
                      {transaction.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <span className={`font-bold text-lg ${
                      transaction.type === 'income' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>
                </td>
                {canEdit && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(transaction)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          darkMode 
                            ? 'text-blue-400 hover:bg-gray-700 hover:text-blue-300' 
                            : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                        title="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(transaction.id)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          darkMode 
                            ? 'text-rose-400 hover:bg-gray-700 hover:text-rose-300' 
                            : 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                        }`}
                        title="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          darkMode 
                            ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                        }`}
                        title="More options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table footer with pagination info */}
      <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50/50'}`}>
        <div className="flex items-center justify-between">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {transactions.length} transactions
          </p>
          <div className="flex items-center space-x-2">
            <button className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}>
              Previous
            </button>
            <button className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
