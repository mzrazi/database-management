import React from 'react';
import { Database, PlusCircle } from 'lucide-react';

interface HeaderProps {
  onAddNew: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddNew }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800">Data Management System</h1>
        </div>
        <button
          onClick={onAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New</span>
        </button>
      </div>
    </header>
  );
};

export default Header;