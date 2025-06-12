import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';



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
  const exportToExcel = () => {
    if (categories.length === 0) {
      Swal.fire("No Data", "There are no categories to export.", "info");
      return;
    }

    const formattedData = categories.map(category => ({
      "Category ID": category.categoryId,
      "Category Name": category.categoryName
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Category_List.xlsx");
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
            fetchCategories();
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
        <div className="flex space-x-4">
          <Link to="/admin/AddCategory">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Category
            </button>
          </Link>
          <button
            onClick={exportToExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
          >
            Export to Excel
          </button>
        </div>
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
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleEdit(category.categoryId)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.categoryId)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
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
