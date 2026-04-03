import React from 'react';
import { useApp } from '../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SummaryCards = ({ totalBalance, totalIncome, totalExpenses }) => {
  const { darkMode } = useApp();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Total Balance',
      amount: totalBalance,
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      iconBg: 'bg-blue-500',
      trend: totalBalance > 0 ? 'up' : 'down',
      trendValue: totalBalance > 0 ? '+12.5%' : '-8.3%',
      description: 'Net worth this month'
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-600',
      iconBg: 'bg-emerald-500',
      trend: 'up',
      trendValue: '+18.2%',
      description: 'Monthly earnings'
    },
    {
      title: 'Total Expenses',
      amount: totalExpenses,
      icon: TrendingDown,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'from-rose-50 to-rose-100',
      textColor: 'text-rose-600',
      iconBg: 'bg-rose-500',
      trend: 'down',
      trendValue: '-5.4%',
      description: 'Monthly spending'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.bgColor} p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20 backdrop-blur-sm`}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 opacity-20">
              <div className={`w-24 h-24 bg-gradient-to-br ${card.color} rounded-full blur-2xl`}></div>
            </div>
            
            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div className={`${card.iconBg} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                  card.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {card.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  <span className="text-xs font-semibold">{card.trendValue}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className={`text-sm font-medium ${card.textColor} opacity-80`}>
                  {card.title}
                </p>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {formatCurrency(card.amount)}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-500'} opacity-70`}>
                  {card.description}
                </p>
              </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
