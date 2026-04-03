import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Home, CreditCard, TrendingUp, Moon, Sun, Menu, X, Bell, Settings } from 'lucide-react';

const Navigation = () => {
  const { darkMode, toggleDarkMode } = useApp();
  
  // Add debug logging
  console.log('Navigation component rendering');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '#dashboard', icon: Home, description: 'Overview' },
    { name: 'Transactions', href: '#transactions', icon: CreditCard, description: 'Manage' },
    { name: 'Insights', href: '#insights', icon: TrendingUp, description: 'Analytics' }
  ];

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 backdrop-blur-lg ${darkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-200'} border-b transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center">
              <div className={`flex-shrink-0 flex items-center ${darkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-500'} p-2 rounded-xl mr-3`}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  FinanceHub
                </span>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>
                  Financial Intelligence Platform
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`group px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.name}</span>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} group-hover:opacity-100 opacity-0 transition-opacity duration-200`}>
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-3">
            <button
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-yellow-500 hover:bg-gray-100'
              }`}
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
            </button>
            
            <button
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Admin
              </span>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
              }`}
              title="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 ${
                darkMode 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-64' : 'max-h-0'
        }`}>
          <div className="py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`w-full px-4 py-3 rounded-xl text-left transition-all duration-200 flex items-center space-x-3 ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
