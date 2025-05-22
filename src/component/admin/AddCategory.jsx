import React, { useState } from 'react';
import Swal from 'sweetalert2';  // Import SweetAlert2
import { useNavigate } from 'react-router-dom';  // Import React Router's useNavigate
import { AlertCircle } from 'lucide-react';  // Import AlertCircle icon

const AddCategory = () => {
  const navigate = useNavigate();  // Use navigate for navigation
  const [categoryName, setCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear validation error first
    setValidationError('');
    
    if (!categoryName.trim()) {
      setValidationError('Category name cannot be empty');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('https://localhost:7026/api/Categories/AddCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryName }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Show SweetAlert notification on success
        Swal.fire({
          icon: 'success',
          title: 'Category Added!',
          text: 'Your category has been successfully added.',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to ListCategory Page upon confirmation
            navigate('/admin/ListCategory'); // Adjust the route as needed
          }
        });
        
        // Reset form after success
        setCategoryName('');
      } else {
        setValidationError(data.message || 'Failed to add category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setValidationError('Something went wrong! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Add Category</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              // Clear validation error when user starts typing
              if (validationError) setValidationError('');
            }}
            className={`w-full mt-1 px-4 py-2 border ${
              validationError ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter category name"
          />
          {validationError && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span>{validationError}</span>
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {isLoading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
