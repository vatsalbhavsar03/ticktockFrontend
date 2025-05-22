import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // ✅ SweetAlert2 import
import { Link, useNavigate } from 'react-router-dom';

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('https://localhost:7026/api/Products/GetProducts')
      .then(response => {
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
        }
      })
      .catch(error => {
        setError('Error fetching products');
        console.error('Error fetching products:', error);
        setProducts([]);
      });
  };

  const handleEdit = (productId) => {
    navigate(`/admin/EditProduct/${productId}`);
  };


  const handleDelete = (productId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://localhost:7026/api/Products/DeleteProduct/${productId}`)
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Product has been deleted.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            fetchProducts(); // Refresh product list
          })
          .catch(error => {
            console.error('Error deleting product:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete product.',
              icon: 'error'
            });
          });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products Details</h1>
        <Link to="/admin/AddProduct">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Product
          </button>
        </Link>
      </div>

      {error && <div className="bg-red-100 p-4 text-red-700 rounded-lg mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-4 text-left">Image</th>
              <th className="px-4 py-4 text-left">Product ID</th>
              <th className="px-4 py-4 text-left">Name</th>
              <th className="px-4 py-4 text-left">Category</th>
              <th className="px-4 py-4 text-left">Brand</th>
              <th className="px-4 py-4 text-left">Price</th>
              <th className="px-4 py-4 text-left">Stock</th>
              <th className="px-4 py-4 text-left">Description</th>
              <th className="px-4 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map(product => (
                <tr key={product.productId} className="border-t">
                  <td className="px-4 py-2">
                    <img
                      src={`https://localhost:7026${product.imageUrl}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{product.productId}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.categoryName}</td>
                  <td className="px-4 py-2">{product.brandName}</td>
                  <td className="px-4 py-2">₹{product.price}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                  <td className="px-4 py-2">{product.description}</td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => handleEdit(product.productId)} className="text-blue-600 hover:underline mr-3">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">No products available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProduct;
