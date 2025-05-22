import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categoryName, setCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [validationError, setValidationError] = useState('');

    // Fetch category by ID
    useEffect(() => {
        if (!id) {
            setValidationError('No category ID provided');
            setFetchLoading(false);
            return;
        }

        fetch(`https://localhost:7026/api/Categories/FindCategory/${id}`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (data.success && data.category?.categoryName) {
                    setCategoryName(data.category.categoryName);
                } else {
                    throw new Error(data.message || 'Category not found');
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setValidationError('Failed to load category data');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.message || 'Could not fetch category details.',
                });
            })
            .finally(() => {
                setFetchLoading(false);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        if (!categoryName.trim()) {
            setValidationError('Category name cannot be empty');
            return;
        }

        setIsLoading(true);

        const categoryData = {
            categoryId: parseInt(id),
            categoryName: categoryName.trim()
        };

        fetch(`https://localhost:7026/api/Categories/UpdateCategory/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(categoryData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text || 'Failed to update category');
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Category Updated!',
                        text: data.message || 'Category updated successfully.',
                        confirmButtonText: 'Ok',
                    }).then(() => {
                        navigate('/admin/ListCategory');
                    });
                } else {
                    throw new Error(data.message || 'Failed to update category');
                }
            })
            .catch(error => {
                console.error('Update error:', error);
                setValidationError('Failed to update category. Please try again.');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message || 'Something went wrong!',
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                <div className="text-lg">Loading category data...</div>
            </div>
        );
    }

    if (!id) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
                    <p>No category ID provided. Unable to edit category.</p>
                    <button
                        onClick={() => navigate('/admin/ListCategory')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        Return to Categories
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => {
                            setCategoryName(e.target.value);
                            if (validationError) setValidationError('');
                        }}
                        className={`w-full mt-1 px-4 py-2 border ${validationError ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Enter category name"
                        required
                    />
                    {validationError && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                            <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span>{validationError}</span>
                        </p>
                    )}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/ListCategory')}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                        {isLoading ? 'Updating...' : 'Update Category'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;
