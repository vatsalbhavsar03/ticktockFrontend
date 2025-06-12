import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


const ListBrand = () => {
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = () => {
    axios.get('https://localhost:7026/api/Brands/GetBrands')
      .then(response => {
        if (response.data && response.data.brand) {
          setBrands(response.data.brand);
        } else {
          setBrands([]);
        }
      })
      .catch(error => {
        console.error('Error fetching brands:', error);
        setError('Failed to fetch brands');
        setBrands([]);
      });
  };

  const handleEdit = (brandId) => {
    navigate(`/admin/editBrand/${brandId}`);
  };

  const exportToExcel = () => {
    if (brands.length === 0) {
      Swal.fire("No Data", "There are no brands to export.", "info");
      return;
    }

    const formattedData = brands.map(brand => ({
      "Brand ID": brand.brandId,
      "Brand Name": brand.brandName,
      "Category Name": brand.categoryName
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Brands");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Brand_List.xlsx");
  };


  const handleDelete = (brandId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the brand permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://localhost:7026/api/Brands/DeleteBrand?Brandid=${brandId}`)
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Brand has been deleted.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            fetchBrands(); // Refresh the brand list
          })
          .catch(err => {
            console.error('Error deleting brand:', err);
            Swal.fire('Error', 'This Brand is used in a Product and cannot be deleted.', 'error');
          });
      }
    });
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Brand Details</h1>
        <div className="flex space-x-4">
          <Link to="/admin/addBrand">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Brand
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
              <th className="px-4 py-2 text-left">Brand ID</th>
              <th className="px-4 py-2 text-left">Brand Name</th>
              <th className="px-4 py-2 text-left">Category Name</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map(brand => (
                <tr key={brand.brandId} className="border-t">
                  <td className="px-4 py-2">{brand.brandId}</td>
                  <td className="px-4 py-2">{brand.brandName}</td>
                  <td className="px-4 py-2">{brand.categoryName}</td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleEdit(brand.brandId)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(brand.brandId)}
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
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No brands available.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};


export default ListBrand;
