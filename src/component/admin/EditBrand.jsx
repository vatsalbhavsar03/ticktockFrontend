import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditBrand = () => {
  const navigate = useNavigate();
  const { brandId } = useParams();

  const [brandName, setBrandName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch brand details and categories on mount
  useEffect(() => {
    if (!brandId) {
      Swal.fire({
        icon: 'error',
        title: 'Brand Not Found',
        text: 'Brand ID is missing.',
      });
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
          Swal.fire({
            icon: 'error',
            title: 'Brand Not Found',
            text: 'The brand you are trying to edit does not exist.',
          });
          navigate('/admin/ListBrand');
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Brand Not Found',
          text: 'Failed to fetch brand details.',
        });
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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load categories.',
        });
      });
  }, [brandId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!brandName.trim() || !categoryId) {
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
          text: 'Your brand has been successfully updated.',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/admin/ListBrand');
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: data.message || 'Something went wrong! Please try again.',
        });
      }
    } catch (error) {
      console.error('Error updating brand:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong! Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Brand</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Updating...' : 'Update Brand'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBrand;