// Advanced Grouping Service
// Provides sophisticated categorization and grouping capabilities

export const categoryGroups = {
  'Essential Expenses': {
    categories: ['Rent', 'Utilities', 'Groceries', 'Healthcare', 'Insurance'],
    color: '#ef4444',
    description: 'Necessary living expenses',
    priority: 'high'
  },
  'Lifestyle': {
    categories: ['Entertainment', 'Dining', 'Fitness', 'Personal'],
    color: '#f59e0b',
    description: 'Discretionary lifestyle spending',
    priority: 'medium'
  },
  'Transportation': {
    categories: ['Transportation'],
    color: '#3b82f6',
    description: 'Travel and commute expenses',
    priority: 'medium'
  },
  'Work & Education': {
    categories: ['Education', 'Communication'],
    color: '#8b5cf6',
    description: 'Career and learning investments',
    priority: 'medium'
  },
  'Shopping': {
    categories: ['Shopping'],
    color: '#ec4899',
    description: 'Retail and online purchases',
    priority: 'low'
  },
  'Family & Pets': {
    categories: ['Pet'],
    color: '#10b981',
    description: 'Family-related expenses',
    priority: 'medium'
  }
};

export const incomeCategories = {
  'Primary Income': {
    categories: ['Salary'],
    color: '#10b981',
    description: 'Main employment income'
  },
  'Additional Income': {
    categories: ['Freelance', 'Investment'],
    color: '#3b82f6',
    description: 'Supplementary income sources'
  }
};

export class GroupingService {
  static categorizeTransaction(transaction) {
    if (transaction.type === 'income') {
      for (const [groupName, group] of Object.entries(incomeCategories)) {
        if (group.categories.includes(transaction.category)) {
          return {
            group: groupName,
            groupInfo: group,
            category: transaction.category
          };
        }
      }
      return {
        group: 'Other Income',
        groupInfo: { color: '#6b7280', description: 'Other income sources' },
        category: transaction.category
      };
    } else {
      for (const [groupName, group] of Object.entries(categoryGroups)) {
        if (group.categories.includes(transaction.category)) {
          return {
            group: groupName,
            groupInfo: group,
            category: transaction.category
          };
        }
      }
      return {
        group: 'Other Expenses',
        groupInfo: { color: '#6b7280', description: 'Uncategorized expenses' },
        category: transaction.category
      };
    }
  }

  static groupTransactions(transactions) {
    try {
      if (!transactions || !Array.isArray(transactions)) {
        console.error('Invalid transactions data:', transactions);
        return { income: {}, expenses: {} };
      }

      const grouped = {
        income: {},
        expenses: {}
      };

      transactions.forEach(transaction => {
        if (!transaction || typeof transaction !== 'object') {
          console.error('Invalid transaction:', transaction);
          return;
        }

        try {
          const { group, groupInfo, category } = this.categorizeTransaction(transaction);
          const type = transaction.type;

          if (!grouped[type]) {
            grouped[type] = {};
          }

          if (!grouped[type][group]) {
            grouped[type][group] = {
              ...groupInfo,
              categories: {},
              total: 0,
              count: 0,
              transactions: []
            };
          }

          if (!grouped[type][group].categories[category]) {
            grouped[type][group].categories[category] = {
              amount: 0,
              count: 0,
              transactions: []
            };
          }

          const amount = Math.abs(transaction.amount || 0);
          grouped[type][group].categories[category].amount += amount;
          grouped[type][group].categories[category].count += 1;
          grouped[type][group].categories[category].transactions.push(transaction);
          
          grouped[type][group].total += amount;
          grouped[type][group].count += 1;
          grouped[type][group].transactions.push(transaction);
        } catch (error) {
          console.error('Error processing transaction:', transaction, error);
        }
      });

      return grouped;
    } catch (error) {
      console.error('Error in groupTransactions:', error);
      return { income: {}, expenses: {} };
    }
  }

  static getSpendingByGroup(transactions) {
    const grouped = this.groupTransactions(transactions);
    const expenses = grouped.expenses || {};

    return Object.entries(expenses).map(([group, data]) => ({
      group,
      total: data.total,
      count: data.count,
      color: data.color,
      description: data.description,
      priority: data.priority,
      categories: Object.entries(data.categories).map(([category, catData]) => ({
        category,
        amount: catData.amount,
        count: catData.count,
        percentage: data.total > 0 ? (catData.amount / data.total) * 100 : 0
      })).sort((a, b) => b.amount - a.amount)
    })).sort((a, b) => b.total - a.total);
  }

  static getIncomeByGroup(transactions) {
    const grouped = this.groupTransactions(transactions);
    const income = grouped.income || {};

    return Object.entries(income).map(([group, data]) => ({
      group,
      total: data.total,
      count: data.count,
      color: data.color,
      description: data.description,
      categories: Object.entries(data.categories).map(([category, catData]) => ({
        category,
        amount: catData.amount,
        count: catData.count,
        percentage: data.total > 0 ? (catData.amount / data.total) * 100 : 0
      })).sort((a, b) => b.amount - a.amount)
    })).sort((a, b) => b.total - a.total);
  }

  static getMonthlyGroupedData(transactions) {
    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const { group } = this.categorizeTransaction(transaction);
      const amount = Math.abs(transaction.amount);
      const type = transaction.type;

      if (!acc[month]) {
        acc[month] = { month, income: {}, expenses: {} };
      }

      if (!acc[month][type][group]) {
        acc[month][type][group] = 0;
      }

      acc[month][type][group] += amount;
      
      return acc;
    }, {});

    return Object.values(monthlyData);
  }

  static getSpendingPatterns(transactions) {
    const grouped = this.groupTransactions(transactions);
    const expenses = grouped.expenses || {};

    const patterns = {
      highestGroup: null,
      mostFrequentCategory: null,
      averageTransactionSize: 0,
      spendingDistribution: {}
    };

    // Find highest spending group
    let maxTotal = 0;
    for (const [group, data] of Object.entries(expenses)) {
      if (data.total > maxTotal) {
        maxTotal = data.total;
        patterns.highestGroup = { group, total: data.total, description: data.description };
      }
    }

    // Find most frequent category
    let maxCount = 0;
    for (const group of Object.values(expenses)) {
      for (const [category, data] of Object.entries(group.categories)) {
        if (data.count > maxCount) {
          maxCount = data.count;
          patterns.mostFrequentCategory = { category, count: data.count };
        }
      }
    }

    // Calculate average transaction size
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    if (expenseTransactions.length > 0) {
      const totalAmount = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      patterns.averageTransactionSize = totalAmount / expenseTransactions.length;
    }

    // Calculate spending distribution
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    for (const [group, data] of Object.entries(expenses)) {
      patterns.spendingDistribution[group] = {
        amount: data.total,
        percentage: totalExpenses > 0 ? (data.total / totalExpenses) * 100 : 0,
        description: data.description,
        priority: data.priority
      };
    }

    return patterns;
  }

  static getRecommendations(transactions) {
    const patterns = this.getSpendingPatterns(transactions);
    const recommendations = [];

    // High spending in essential expenses
    if (patterns.highestGroup && patterns.highestGroup.group === 'Essential Expenses') {
      recommendations.push({
        type: 'warning',
        title: 'High Essential Expenses',
        description: `Your essential expenses account for ${patterns.highestGroup.total.toFixed(0)} which is ${patterns.spendingDistribution['Essential Expenses']?.percentage.toFixed(1)}% of total spending.`,
        action: 'Consider reviewing your essential expenses for potential savings opportunities.'
      });
    }

    // High lifestyle spending
    if (patterns.spendingDistribution['Lifestyle']?.percentage > 30) {
      recommendations.push({
        type: 'info',
        title: 'Lifestyle Spending Alert',
        description: `Lifestyle expenses represent ${patterns.spendingDistribution['Lifestyle'].percentage.toFixed(1)}% of your spending.`,
        action: 'Consider setting a monthly budget for discretionary expenses.'
      });
    }

    // Low average transaction size
    if (patterns.averageTransactionSize < 50) {
      recommendations.push({
        type: 'success',
        title: 'Good Spending Habits',
        description: `Your average transaction size is ${patterns.averageTransactionSize.toFixed(2)}, indicating controlled spending.`,
        action: 'Keep tracking small expenses to maintain this trend.'
      });
    }

    // No spending in certain categories
    const activeGroups = Object.keys(patterns.spendingDistribution);
    const potentialSavings = ['Shopping', 'Entertainment'].filter(group => !activeGroups.includes(group));
    
    if (potentialSavings.length > 0) {
      recommendations.push({
        type: 'success',
        title: 'Spending Control',
        description: `You're not spending in ${potentialSavings.join(' and ')} categories.`,
        action: 'Great job maintaining control over discretionary spending!'
      });
    }

    return recommendations;
  }
}

export default GroupingService;
