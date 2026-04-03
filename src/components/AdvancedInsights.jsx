import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, TrendingDown, DollarSign, Target, Calendar, PieChart, ArrowUp, ArrowDown, Info, Lightbulb, Award, AlertTriangle, Layers, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart as RechartsPieChart } from 'recharts';

const AdvancedInsights = () => {
  const { 
    darkMode, 
    spendingByGroup, 
    incomeByGroup, 
    monthlyGroupedData, 
    spendingPatterns, 
    recommendations,
    totalIncome,
    totalExpenses
  } = useApp();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // Handle empty data gracefully
  if (!spendingByGroup || spendingByGroup.length === 0) {
    return (
      <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="mb-6">
          <BarChart3 className={`w-16 h-16 mx-auto ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Loading advanced insights...
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          Analyzing your spending patterns
        </p>
      </div>
    );
  }

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

  const GroupedBarChart = ({ data, title, description, icon: Icon }) => {
    return (
      <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
          <div className={`w-32 h-32 ${darkMode ? 'bg-blue-500' : 'bg-blue-400'} rounded-full blur-3xl`}></div>
        </div>
        
        <div className="relative p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Icon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {description}
              </p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#f3f4f6"} />
              <XAxis 
                dataKey="group" 
                tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                stroke={darkMode ? "#4b5563" : "#d1d5db"}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: darkMode ? "#9ca3af" : "#6b7280" }}
                stroke={darkMode ? "#4b5563" : "#d1d5db"}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const CategoryPieChart = ({ data, title, description, icon: Icon }) => {
    return (
      <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
          <div className={`w-32 h-32 ${darkMode ? 'bg-purple-500' : 'bg-purple-400'} rounded-full blur-3xl`}></div>
        </div>
        
        <div className="relative p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
              <Icon className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {description}
              </p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="total"
                label={({ group, percentage }) => `${group}: ${percentage.toFixed(1)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Spending by Group */}
      {spendingByGroup.length > 0 && (
        <GroupedBarChart
          data={spendingByGroup}
          title="Spending by Category Group"
          description="Advanced categorization of your expenses"
          icon={Layers}
        />
      )}

      {/* Income by Group */}
      {incomeByGroup.length > 0 && (
        <GroupedBarChart
          data={incomeByGroup}
          title="Income by Source Group"
          description="Breakdown of your income sources"
          icon={TrendingUp}
        />
      )}

      {/* Category Distribution */}
      {spendingByGroup.length > 0 && (
        <CategoryPieChart
          data={spendingByGroup}
          title="Spending Distribution"
          description="Visual breakdown of expense categories"
          icon={PieChart}
        />
      )}

      {/* Advanced Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Advanced AI Recommendations
          </h3>
          {recommendations.map((rec, index) => {
            const Icon = rec.type === 'success' ? Award : rec.type === 'warning' ? AlertTriangle : Lightbulb;
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
                    {rec.action && (
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 italic`}>
                        💡 {rec.action}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Monthly Grouped Trends */}
      {monthlyGroupedData.length > 0 && (
        <div className={`group relative overflow-hidden rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
            <div className={`w-32 h-32 ${darkMode ? 'bg-green-500' : 'bg-green-400'} rounded-full blur-3xl`}></div>
          </div>
          
          <div className="relative p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-green-500/20' : 'bg-green-100'}`}>
                <BarChart3 className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Monthly Grouped Trends
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Category group performance over time
                </p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyGroupedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                {Object.keys(monthlyGroupedData[0]?.expenses || {}).slice(0, 3).map((group, index) => (
                  <Bar 
                    key={group}
                    dataKey={`expenses.${group}`} 
                    fill={COLORS[index % COLORS.length]} 
                    name={group}
                    radius={[8, 8, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedInsights;
