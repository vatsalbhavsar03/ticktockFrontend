

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

const ListCategory = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('https://localhost:7026/api/Categories/GetCategory')
      .then(response => {
        if (response.data && response.data.success) {
          setCategories(response.data.category);
        } else {
          setCategories([]);
        }
      })
      .catch(error => {
        setError('Error fetching categories');
        console.error('Error fetching categories:', error);
        setCategories([]);
      });
  };

  const handleEdit = (categoryId) => {
    navigate(`/admin/editCategory/${categoryId}`);
  };

  const handleDelete = (categoryId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'This action will permanently delete the category!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      axios.delete(`https://localhost:7026/api/Categories/DeleteCategory?Categoryid=${categoryId}`)
        .then((res) => {
          Swal.fire({
            title: 'Deleted!',
            text: res.data.message || 'Category has been deleted.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
          fetchCategories(); // Refresh category list
        })
        .catch(error => {
          console.error('Error deleting category:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to delete category.',
            icon: 'error'
          });
        });
    }
  });
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories Details</h1>
        <Link to="/admin/AddCategory">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Category
          </button>
        </Link>
      </div>

      {error && <div className="bg-red-100 p-4 text-red-700 rounded-lg mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Category ID</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <tr key={category.categoryId} className="border-t">
                  <td className="px-4 py-2">{category.categoryId}</td>
                  <td className="px-4 py-2">{category.categoryName}</td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleEdit(category.categoryId)} className="text-blue-600 hover:underline mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.categoryId)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">No categories available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListCategory;
