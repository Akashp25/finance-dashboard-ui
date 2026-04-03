import React from 'react';
import { Shield, User, Eye } from 'lucide-react';

const RoleSwitcher = ({ currentRole, onRoleChange }) => {
  const roles = [
    {
      value: 'viewer',
      label: 'Viewer',
      description: 'Can only view transactions',
      icon: Eye,
      color: 'bg-blue-500'
    },
    {
      value: 'admin',
      label: 'Admin',
      description: 'Can add, edit, and delete transactions',
      icon: Shield,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="relative">
      <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2">
          {currentRole === 'admin' ? (
            <Shield className="w-5 h-5 text-purple-600" />
          ) : (
            <Eye className="w-5 h-5 text-blue-600" />
          )}
          <span className="font-medium text-gray-900">
            {currentRole === 'admin' ? 'Admin' : 'Viewer'}
          </span>
        </div>
        
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value)}
          className="ml-auto px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {roles.find(r => r.value === currentRole)?.description}
      </div>
    </div>
  );
};

export default RoleSwitcher;
