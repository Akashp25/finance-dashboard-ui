import React from 'react';
import { useApp } from '../context/AppContext';
import AdvancedInsights from '../components/AdvancedInsights';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, PieChart, ArrowUp, ArrowDown, Info, Lightbulb, Award, AlertTriangle, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const Insights = () => {
  const { transactions, totalIncome, totalExpenses, darkMode } = useApp();

  const getCategorySpending = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += Math.abs(transaction.amount);
        return acc;
      }, {});
  };

  const categorySpending = getCategorySpending();
  const highestSpendingCategory = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)[0];

  const monthlyComparison = () => {
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[month]) {
        acc[month] = { month, income: 0, expenses: 0 };
      }
      
      if (transaction.type === 'income') {
        acc[month].income += transaction.amount;
      } else {
        acc[month].expenses += Math.abs(transaction.amount);
      }
      
      return acc;
    }, {});

    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.month) - new Date(b.month)
    );
  };

  const monthlyData = monthlyComparison();

  const averageMonthlyIncome = monthlyData.length > 0 
    ? monthlyData.reduce((sum, month) => sum + month.income, 0) / monthlyData.length 
    : 0;

  const averageMonthlyExpenses = monthlyData.length > 0 
    ? monthlyData.reduce((sum, month) => sum + month.expenses, 0) / monthlyData.length 
    : 0;

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const topCategories = Object.entries(categorySpending)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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

  const insightsCards = [
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: savingsRate > 10 ? 'from-emerald-500 to-emerald-600' : 'from-amber-500 to-amber-600',
      bgColor: savingsRate > 10 ? 'from-emerald-50 to-emerald-100' : 'from-amber-50 to-amber-100',
      textColor: savingsRate > 10 ? 'text-emerald-600' : 'text-amber-600',
      description: savingsRate > 10 ? 'Excellent savings!' : 'Room for improvement',
      trend: savingsRate > 0 ? 'up' : 'down'
    },
    {
      title: 'Highest Spending',
      value: highestSpendingCategory ? highestSpendingCategory[0] : 'N/A',
      subValue: highestSpendingCategory ? formatCurrency(highestSpendingCategory[1]) : '$0',
      icon: Target,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'from-rose-50 to-rose-100',
      textColor: 'text-rose-600',
      description: 'Top expense category',
      trend: 'down'
    },
    {
      title: 'Avg Monthly Income',
      value: formatCurrency(averageMonthlyIncome),
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      description: `Across ${monthlyData.length} months`,
      trend: 'up'
    },
    {
      title: 'Avg Monthly Expenses',
      value: formatCurrency(averageMonthlyExpenses),
      icon: Calendar,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      description: `Across ${monthlyData.length} months`,
      trend: 'down'
    }
  ];

  const recommendations = [
    {
      type: 'success',
      title: 'Great Job!',
      description: 'Your savings rate is above 20%. Consider investing your surplus.',
      icon: Award,
      condition: savingsRate > 20
    },
    {
      type: 'warning',
      title: 'Spending Alert',
      description: `Consider reducing ${highestSpendingCategory?.[0]} expenses as it represents ${highestSpendingCategory ? ((highestSpendingCategory[1] / totalExpenses) * 100).toFixed(1) : 0}% of your spending.`,
      icon: AlertTriangle,
      condition: highestSpendingCategory && highestSpendingCategory[1] > totalExpenses * 0.3
    },
    {
      type: 'info',
      title: 'Savings Goal',
      description: 'Aim to save at least 10% of your income for financial security.',
      icon: Lightbulb,
      condition: savingsRate < 10
    }
  ].filter(rec => rec.condition);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'bg-gradient-to-r from-violet-500 to-purple-500'} shadow-lg`}>
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                Financial Insights
              </h1>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Detailed analysis of your financial patterns and trends
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {insightsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgColor} p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20 backdrop-blur-sm`}
              >
                <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-20">
                  <div className={`w-24 h-24 bg-gradient-to-br ${card.color} rounded-full blur-2xl`}></div>
                </div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`${card.color} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                      card.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {card.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className={`text-sm font-medium ${card.textColor} opacity-80`}>
                      {card.title}
                    </p>
                    <div className="text-2xl font-bold text-gray-900 tracking-tight">
                      {card.value}
                    </div>
                    {card.subValue && (
                      <div className={`text-lg font-semibold ${darkMode ? 'text-gray-700' : 'text-gray-600'}`}>
                        {card.subValue}
                      </div>
                    )}
                    <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-500'} opacity-70`}>
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
              <div className={`w-32 h-32 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'} rounded-full blur-3xl`}></div>
            </div>
            
            <div className="relative p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <TrendingUp className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Monthly Income vs Expenses
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Comparative analysis
                  </p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                  <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
              <div className={`w-32 h-32 ${darkMode ? 'bg-purple-500' : 'bg-purple-400'} rounded-full blur-3xl`}></div>
            </div>
            
            <div className="relative p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <PieChart className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Top Spending Categories
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Expense breakdown
                  </p>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={topCategories} layout="horizontal" margin={{ top: 20, right: 30, left: 80, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#f3f4f6"} />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                    stroke={darkMode ? "#4b5563" : "#d1d5db"}
                    tickFormatter={(value) => `${value.toFixed(0)}%`}
                  />
                  <YAxis 
                    type="category"
                    dataKey="category"
                    tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                    stroke={darkMode ? "#4b5563" : "#d1d5db"}
                    width={80}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className={`p-4 rounded-xl shadow-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} backdrop-blur-sm`}>
                            <p className={`font-semibold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {payload[0].payload.category}
                            </p>
                            <div className="flex items-center justify-between space-x-4">
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Percentage:</span>
                              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {payload[0].payload.percentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between space-x-4 mt-1">
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Amount:</span>
                              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {formatCurrency(payload[0].payload.amount)}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[0, 8, 8, 0]}>
                    {topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-8`}>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
            <div className={`w-32 h-32 ${darkMode ? 'bg-green-500' : 'bg-green-400'} rounded-full blur-3xl`}></div>
          </div>
          
          <div className="relative p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <Info className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Financial Summary
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Comprehensive overview
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className={`font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center space-x-2`}>
                  <div className={`w-2 h-2 rounded-full bg-emerald-500`}></div>
                  <span>Income Analysis</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Income:</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(totalIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Average:</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(averageMonthlyIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Growth Rate:</span>
                    <span className={`text-sm font-bold text-emerald-500`}>
                      +12.5%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center space-x-2`}>
                  <div className={`w-2 h-2 rounded-full bg-rose-500`}></div>
                  <span>Expense Analysis</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Expenses:</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(totalExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Average:</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(averageMonthlyExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Growth Rate:</span>
                    <span className={`text-sm font-bold text-rose-500`}>
                      +8.3%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className={`font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'} flex items-center space-x-2`}>
                  <div className={`w-2 h-2 rounded-full bg-blue-500`}></div>
                  <span>Net Position</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Net Balance:</span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {formatCurrency(totalIncome - totalExpenses)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Savings Rate:</span>
                    <span className={`text-sm font-bold ${savingsRate > 10 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {savingsRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Financial Health:</span>
                    <span className={`text-sm font-bold ${savingsRate > 10 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {savingsRate > 10 ? 'Excellent' : 'Good'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Insights Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} shadow-lg`}>
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-1`}>
                Advanced Analytics
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                AI-powered insights and advanced categorization
              </p>
            </div>
          </div>
        </div>
        <AdvancedInsights />
      </div>

      {/* Recommendations */}
      {/* {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Personalized Recommendations
          </h3>
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl p-6 shadow-lg border transition-all duration-300 hover:shadow-xl ${
                  rec.type === 'success' 
                    ? darkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'
                    : rec.type === 'warning'
                    ? darkMode ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-200'
                    : darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl ${
                    rec.type === 'success' 
                      ? 'bg-emerald-500 text-white'
                      : rec.type === 'warning'
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {rec.title}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )} */}
    </div>
  );
};

export default Insights;
