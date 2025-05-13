import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddBrand = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [brandName, setBrandName] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    axios.get('https://localhost:7026/api/Categories/GetCategory')
      .then(res => {
        if (res.data && Array.isArray(res.data.category)) {
          setCategories(res.data.category);
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        Swal.fire('Error', 'Failed to load categories.', 'error');
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategoryId || !brandName) {
      Swal.fire('Validation Error', 'Please fill all required fields.', 'warning');
      return;
    }

    const brandData = {
      brandName: brandName.trim(),
      categoryId: parseInt(selectedCategoryId, 10), // Ensuring it's an integer
    };

    console.log('Sending data:', brandData);  // Log data for debugging

    axios.post('https://localhost:7026/api/Brands/AddBrand', brandData)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Brand Added',
          text: 'Brand has been added successfully.',
        }).then(() => {
          navigate('/admin/ListBrand'); // Adjust route as needed
        });
      })
      .catch(err => {
        console.error('Error adding brand:', err.response?.data || err.message);
        Swal.fire('Error', 'Failed to add brand.', 'error');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Add Brand</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
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
            placeholder="Enter Brand Name"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Add Brand
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBrand;
