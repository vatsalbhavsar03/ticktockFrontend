// import React, { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import { AlertCircle } from 'lucide-react';

// const EditCategory = () => {
//     const navigate = useNavigate();
//     const { id } = useParams(); // Get category ID from URL
//     const location = useLocation();

//     const queryId = new URLSearchParams(location.search).get('id');

//     //   const queryId = queryParams.get('id'); // Try to get ID from query parameter
//     // Use the ID from either params or query string
//     const categoryId = id || queryId;

//     const [categoryName, setCategoryName] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [validationError, setValidationError] = useState('');
//     const [fetchLoading, setFetchLoading] = useState(true);

//     console.log('Category ID from route params:', id);
//     console.log('Category ID from query params:', queryId);
//     console.log('Final Category ID used:', categoryId);

//     // Fetch existing category data
//     useEffect(() => {
//         const fetchCategory = async () => {
//             if (!categoryId) {
//                 console.error('No category ID available');
//                 setValidationError('No category ID provided');
//                 setFetchLoading(false);
//                 return;
//             }

//             try {
//                 console.log(`Fetching category with ID: ${categoryId}`);
//                 const response = await fetch(`https://localhost:7026/api/Categories/GetCategory/${categoryId}`);

//                 if (!response.ok) {
//                     throw new Error(`HTTP error! Status: ${response.status}`);
//                 }

//                 const data = await response.json();
//                 console.log('Category data received:', data);

//                 if (data.success) {
//                     setCategoryName(data.category.categoryName);
//                 } else {
//                     setValidationError(data.message || 'Failed to load category data');
//                 }
//             } catch (error) {
//                 console.error('Error fetching category:', error);
//             } finally {
//                 setFetchLoading(false);
//             }
//         };

//         fetchCategory();
//     }, [categoryId]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!categoryId) {
//             setValidationError('No category ID available for update');
//             return;
//         }

//         setValidationError('');

//         if (!categoryName.trim()) {
//             setValidationError('Category name cannot be empty');
//             return;
//         }

//         setIsLoading(true);

//         try {
//             // Include both ID and name in the request
//             const categoryData = {
//                 categoryId: parseInt(categoryId),
//                 categoryName: categoryName.trim()
//             };

//             console.log(`Sending update request to category ID: ${categoryId}`);
//             console.log('Update data:', categoryData);

//             const response = await fetch(`https://localhost:7026/api/Categories/UpdateCategory/${categoryId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 },
//                 body: JSON.stringify(categoryData),
//             });

//             console.log('Response status:', response.status);

//             // Get response text first for debugging
//             const responseText = await response.text();
//             console.log('Response text:', responseText);

//             let data;
//             try {
//                 // Try to parse as JSON if it looks like JSON
//                 if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
//                     data = JSON.parse(responseText);
//                 } else {
//                     data = {
//                         success: response.ok,
//                         message: response.ok ? 'Category updated successfully' : responseText
//                     };
//                 }
//             } catch (parseError) {
//                 console.error('Error parsing JSON response:', parseError);
//                 // Create a synthetic response object
//                 data = {
//                     success: response.ok,
//                     message: response.ok ? 'Category updated successfully' : 'Invalid response from server'
//                 };
//             }

//             if (data.success) {
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Category Updated!',
//                     text: 'Your category has been successfully updated.',
//                     confirmButtonText: 'Ok',
//                 }).then(() => {
//                     navigate('/admin/ListCategory');
//                 });
//             } else {
//                 setValidationError(data.message || 'Failed to update category');
//             }
//         } catch (error) {
//             console.error('Error updating category:', error);
//             setValidationError(`Error updating category: ${error.message}`);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (fetchLoading) {
//         return (
//             <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
//                 <div className="text-lg">Loading category data...</div>
//             </div>
//         );
//     }

//     // If no category ID is available after loading
//     if (!categoryId && !fetchLoading) {
//         return (
//             <div className="min-h-screen bg-gray-100 p-6">
//                 <div className="bg-white p-6 rounded-lg shadow-md">
//                     <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
//                     <p>No category ID provided. Unable to edit category.</p>
//                     <button
//                         onClick={() => navigate('/admin/ListCategory')}
//                         className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//                     >
//                         Return to Categories
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             <h1 className="text-3xl font-bold mb-8">Update Category</h1>
//             <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
//                 <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-700 mb-3">Category Name</label>
//                     <input
//                         type="text"
//                         value={categoryName}
//                         onChange={(e) => {
//                             setCategoryName(e.target.value);
//                             // Clear validation error when user starts typing
//                             if (validationError) setValidationError('');
//                         }}
//                         className={`w-full mt-1 px-4 py-2 border ${validationError ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-300'
//                             } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
//                         placeholder="Enter category name"
//                     />
//                     {validationError && (
//                         <p className="mt-2 text-sm text-red-600 flex items-center">
//                             <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
//                             <span>{validationError}</span>
//                         </p>
//                     )}
//                 </div>

//                 <div className="flex justify-end space-x-4">
//                     <button
//                         type="button"
//                         onClick={() => navigate('/admin/ListCategory')}
//                         className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={isLoading}
//                         className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
//                     >
//                         {isLoading ? 'Updating...' : 'Update Category'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default EditCategory;



import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get category ID directly from URL
    const [categoryName, setCategoryName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [validationError, setValidationError] = useState('');

    // Fetch existing category data
    useEffect(() => {
        if (!id) {
            setValidationError('No category ID provided');
            setFetchLoading(false);
            return;
        }

        fetch(`https://localhost:7026/api/Categories/FindCategory/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Category data received:', data);
                if (data && data.categoryName) {
                    setCategoryName(data.categoryName);
                } else {
                    setValidationError('Failed to load category data');
                    Swal.fire({
                        icon: 'error',
                        title: 'Category Not Found',
                        text: 'The category you are trying to edit does not exist.',
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching category:', error);
                setValidationError('Failed to load category data');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load category data. Please try again later.',
                });
            })
            .finally(() => {
                setFetchLoading(false);
            });
    }, [id]); // Only re-run when ID changes

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        if (!categoryName.trim()) {
            setValidationError('Category name cannot be empty');
            return;
        }

        setIsLoading(true);

        // Using the endpoint structure and payload format from your original component
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
                return response.text();
            })
            .then(data => {
                let parsedData;
                try {
                    parsedData = JSON.parse(data);
                } catch (e) {
                    // If not JSON, just assume success since response was OK
                    parsedData = { success: true };
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Category Updated!',
                    text: 'Your category has been successfully updated.',
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/admin/ListCategory');
                    }
                });
            })
            .catch(error => {
                console.error('Error updating category:', error);
                setValidationError('Failed to update category. Please try again.');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.message || 'Something went wrong! Please try again.',
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Show loading state while fetching data
    if (fetchLoading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
                <div className="text-lg">Loading category data...</div>
            </div>
        );
    }

    // Show error if no ID is provided
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