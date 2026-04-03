import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { categories } from '../data/mockTransactions';

const Filters = ({ filters, onFiltersChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFiltersChange({ [name]: value });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search transactions..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expenses</option>
        </select>

        <div className="relative">
          <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          {filters.sortBy && (
            <span className="flex items-center">
              Order: 
              <button
                name="sortOrder"
                onClick={() => onFiltersChange({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
                className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-150"
              >
                {filters.sortOrder === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
              </button>
            </span>
          )}
        </div>
        
        {(filters.search || filters.category !== 'all' || filters.type !== 'all') && (
          <button
            onClick={() => onFiltersChange({ search: '', category: 'all', type: 'all', sortBy: 'date', sortOrder: 'desc' })}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-150"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default Filters;
