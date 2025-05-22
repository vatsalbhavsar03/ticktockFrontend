import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const AddBrand = () => {
  const navigate = useNavigate();

  const [brandName, setBrandName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    fetch('https://localhost:7026/api/Categories/GetCategory')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.category)) {
          setCategories(data.category);
        } else {
          throw new Error('Invalid category data');
        }
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        Swal.fire('Error', 'Failed to load categories.', 'error');
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear validation error first
    setValidationError('');
    
    if (!brandName.trim() || !categoryId) {
      setValidationError('Both category and brand name are required.');
      return;
    }
    
    setIsLoading(true);

    const brandData = {
      brandId: 0,
      brandName: brandName.trim(),
      categoryId: parseInt(categoryId),
      categoryName: "string" // Placeholder if API requires
    };

    try {
      const response = await fetch('https://localhost:7026/api/Brands/AddBrand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*'
        },
        body: JSON.stringify(brandData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Show SweetAlert notification on success
        Swal.fire({
          icon: 'success',
          title: 'Brand Added!',
          text: 'Your brand has been successfully added.',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            // Navigate to ListBrand Page upon confirmation
            navigate('/admin/ListBrand');
          }
        });
        
        // Reset form after success
        setBrandName('');
        setCategoryId('');
      } else {
        setValidationError(data.message || 'Failed to add brand');
      }
    } catch (error) {
      console.error('Error adding brand:', error);
      setValidationError('Something went wrong! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Add Brand</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              if (validationError) setValidationError('');
            }}
            className={`w-full mt-1 px-4 py-2 border ${
              validationError && !categoryId ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => {
              setBrandName(e.target.value);
              if (validationError) setValidationError('');
            }}
            className={`w-full mt-1 px-4 py-2 border ${
              validationError && !brandName ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            placeholder="Enter brand name"
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
            {isLoading ? 'Adding...' : 'Add Brand'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrand;