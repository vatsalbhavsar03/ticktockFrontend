import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('https://localhost:7026/api/Products')
            .then(response => {
                // console.log("data is:::>", response.data);
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    const handleEdit = (productId) => {
        console.log("Edit product with ID:", productId);
        // Implement edit functionality here
    };

    const handleDelete = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            axios.delete(`https://localhost:7026/api/Products/${productId}`)
                .then(response => {
                    alert('Product deleted successfully');
                    fetchProducts(); // Refresh the product list
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    alert('Failed to delete product');
                });
        }
    };

    return (
        <>
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Product List</h1>
                    <Link to="/admin/add-product">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Product
                        </button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left">Product ID</th>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left">Stock</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map(product => (
                                    <ProductCard
                                        key={product.productId}
                                        product={product}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center p-4 text-gray-500">No products available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default AdminDashboard;