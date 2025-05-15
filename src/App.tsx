import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import DataTable from './components/DataTable';
import EntryForm from './components/EntryForm';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [refreshData, setRefreshData] = useState(false);

  const handleAddNew = () => {
    setEditingEntry(null);
    setShowForm(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    setEditingEntry(null);
    setRefreshData(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="top-right" />
      <Header onAddNew={handleAddNew} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <DataTable 
          onEdit={handleEditEntry} 
          refreshTrigger={refreshData}
        />
      </main>
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <EntryForm 
              entryToEdit={editingEntry} 
              onClose={handleFormClose} 
              onSuccess={handleFormSubmitSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;