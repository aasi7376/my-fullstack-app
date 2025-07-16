// src/components/InstituteManagement.jsx
import React, { useState, useEffect } from 'react';
import { getAdminInstitutes, deleteInstitute } from '../services/instituteService';
import InstituteForm from './InstituteForm';

const InstituteManagement = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingInstitute, setEditingInstitute] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Fetch institutes on component mount
  useEffect(() => {
    fetchInstitutes();
  }, []);
  
  // Fetch institutes from API
  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const response = await getAdminInstitutes();
      
      if (response.success) {
        setInstitutes(response.data);
      } else {
        setError(response.error || 'Failed to fetch institutions');
      }
    } catch (err) {
      setError(err.error || 'An error occurred while fetching institutions');
      console.error('Fetch institutes error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle successful form submission
  const handleFormSuccess = (institute) => {
    setShowForm(false);
    setEditingInstitute(null);
    fetchInstitutes();
  };
  
  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingInstitute(null);
  };
  
  // Edit institute
  const handleEdit = (institute) => {
    setEditingInstitute(institute);
    setShowForm(true);
  };
  
  // Delete institute
  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return;
    
    try {
      const response = await deleteInstitute(confirmDelete._id);
      
      if (response.success) {
        setInstitutes(institutes.filter(i => i._id !== confirmDelete._id));
        setConfirmDelete(null);
      } else {
        setError(response.error || 'Failed to delete institution');
      }
    } catch (err) {
      setError(err.error || 'An error occurred while deleting the institution');
      console.error('Delete institute error:', err);
    }
  };
  
  // Render status badge
  const renderStatusBadge = (status) => {
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    
    if (status === 'Active') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    } else if (status === 'Pending') {
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
    } else if (status === 'Inactive') {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>
        {status}
      </span>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Institution Management</h1>
        
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + Add Institution
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            className="float-right font-bold"
            onClick={() => setError(null)}
          >
            &times;
          </button>
        </div>
      )}
      
      {/* Institution Form */}
      {showForm && (
        <div className="mb-8">
          <InstituteForm
            existingInstitute={editingInstitute}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelForm}
          />
        </div>
      )}
      
      {/* Institutions List */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading institutions...</p>
        </div>
      ) : institutes.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No institutions found.</p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Your First Institution
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faculty
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {institutes.map((institute) => (
                <tr key={institute._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{institute.name}</div>
                    {institute.email && (
                      <div className="text-sm text-gray-500">{institute.email}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{institute.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{institute.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {institute.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {institute.teachers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(institute.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(institute)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(institute)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the institution "{confirmDelete.name}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteManagement;