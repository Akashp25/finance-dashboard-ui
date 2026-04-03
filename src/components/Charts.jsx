import React from 'react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

const Charts = ({ transactions }) => {
  const { darkMode } = useApp();
  
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0, balance: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount;
    } else {
      acc[month].expenses += Math.abs(transaction.amount);
    }
    
    acc[month].balance = acc[month].income - acc[month].expenses;
    
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData).sort((a, b) => 
    new Date(a.month) - new Date(b.month)
  );

  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += Math.abs(transaction.amount);
      return acc;
    }, {});

  const categoryChartData = Object.entries(categoryData)
    .map(([category, amount]) => ({
      category,
      amount
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-4 rounded-xl shadow-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
          <p className={`font-semibold text-sm mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 mb-2 last:mb-0">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }}></div>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {entry.name}
                </span>
              </div>
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-4 rounded-xl shadow-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
          <p className={`font-semibold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {data.category}
          </p>
          <div className="flex items-center justify-between space-x-4">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Amount:</span>
            <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatCurrency(data.amount)}
            </span>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Percentage:</span>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {((data.amount / transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Math.abs(t.amount), 0)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
          <div className={`w-32 h-32 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'} rounded-full blur-3xl`}></div>
        </div>
        
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Balance Trend
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Monthly overview
                </p>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#f3f4f6"} />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                stroke={darkMode ? "#4b5563" : "#d1d5db"}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                stroke={darkMode ? "#4b5563" : "#d1d5db"}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6, strokeWidth: 2 }}
                activeDot={{ r: 8, strokeWidth: 2 }}
                name="Balance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
          <div className={`w-32 h-32 ${darkMode ? 'bg-rose-500' : 'bg-rose-400'} rounded-full blur-3xl`}></div>
        </div>
        
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-rose-500/20' : 'bg-rose-100'}`}>
                <PieChart className={`w-5 h-5 ${darkMode ? 'text-rose-400' : 'text-rose-600'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Spending by Category
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Top categories
                </p>
              </div>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={categoryChartData} layout="horizontal" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#f3f4f6"} />
              <XAxis 
                type="number"
                tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                stroke={darkMode ? "#4b5563" : "#d1d5db"}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                type="category"
                dataKey="category"
                tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                stroke={darkMode ? "#4b5563" : "#d1d5db"}
                width={80}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                {categoryChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
