import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const EditBrand = () => {
  const navigate = useNavigate();
  const { brandId } = useParams();

  const [brandName, setBrandName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch brand details and categories on mount
  useEffect(() => {
    if (!brandId) {
      Swal.fire('Error', 'Brand ID is missing.', 'error');
      navigate('/admin/ListBrand');
      return;
    }

    // Fetch brand details
    fetch(`https://localhost:7026/api/Brands/FindBrand/${brandId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBrandName(data.brand.brandName);
          setCategoryId(data.brand.categoryId);
        } else {
          Swal.fire('Error', 'Brand not found', 'error');
          navigate('/admin/ListBrand');
        }
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to fetch brand', 'error');
        navigate('/admin/ListBrand');
      });

    // Fetch categories for dropdown
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
  }, [brandId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Basic validation
    if (!brandName.trim() || !categoryId) {
      setValidationError('Both category and brand name are required.');
      return;
    }

    setIsLoading(true);

    const brandData = {
      BrandName: brandName.trim(),
      CategoryId: parseInt(categoryId, 10),
    };

    try {
      const response = await fetch(`https://localhost:7026/api/Brands/UpdateBrand/${brandId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Brand Updated!',
          text: data.message || 'Brand updated successfully.',
          confirmButtonText: 'Ok',
        }).then(() => {
          navigate('/admin/ListBrand');
        });
      } else {
        setValidationError(data.message || 'Failed to update brand.');
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      setValidationError('Something went wrong! Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8">Edit Brand</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              if (validationError) setValidationError('');
            }}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationError && !categoryId ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => {
              setBrandName(e.target.value);
              if (validationError) setValidationError('');
            }}
            placeholder="Enter brand name"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationError && !brandName.trim() ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'
            }`}
          />
          {validationError && (
            <p className="mt-2 text-red-600 text-sm flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {validationError}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-2 rounded-md text-white ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Updating...' : 'Update Brand'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBrand;
