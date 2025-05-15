import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown, Filter, RefreshCw } from 'lucide-react';
import { getEntries, deleteEntry } from '../services/api';
import toast from 'react-hot-toast';
import Filters from './Filters';

interface DataTableProps {
  onEdit: (entry: any) => void;
  refreshTrigger: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ onEdit, refreshTrigger }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
    hobbies: [],
    place: '',
    gender: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getEntries({
        page,
        limit,
        sortField,
        sortOrder,
        ...filters
      });
      
      setEntries(response.data);
      setTotalEntries(response.total);
      setTotalPages(Math.ceil(response.total / limit));
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, sortField, sortOrder, refreshTrigger]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
    fetchData();
  }, [filters]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteEntry(id);
        toast.success('Entry deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete entry');
        console.error('Error deleting entry:', error);
      }
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortOrder === 'asc' 
      ? <ChevronUp className="h-4 w-4" /> 
      : <ChevronDown className="h-4 w-4" />;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      email: '',
      phone: '',
      hobbies: [],
      place: '',
      gender: ''
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Data Entries</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-md hover:bg-gray-100 flex items-center gap-1 text-sm"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button 
            onClick={fetchData}
            className="p-2 rounded-md hover:bg-gray-100"
            title="Refresh data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="p-4 border-b bg-gray-50">
          <Filters 
            filters={filters} 
            onChange={handleFilterChange} 
            onClear={clearFilters}
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Name
                  {renderSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-1">
                  Email
                  {renderSortIcon('email')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('phone')}
              >
                <div className="flex items-center gap-1">
                  Phone
                  {renderSortIcon('phone')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('place')}
              >
                <div className="flex items-center gap-1">
                  Place
                  {renderSortIcon('place')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('gender')}
              >
                <div className="flex items-center gap-1">
                  Gender
                  {renderSortIcon('gender')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hobbies
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                  Loading data...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                  No entries found.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.phone}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.place}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entry.gender}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {entry.hobbies.map((hobby, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(entry)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-4 py-3 border-t flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {entries.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} entries
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-gray-300 rounded-md text-sm py-1 px-2"
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
          
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage(1)}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
            >
              First
            </button>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm">
              {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
            >
              Next
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;