// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AddProduct = () => {
//     const navigate = useNavigate();
//     const [categories, setCategories] = useState([]);
//     const [brands, setBrands] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [product, setProduct] = useState({
//         categoryId: '',
//         brandId: '',
//         name: '',
//         price: '',
//         stock: '',
//         imageUrl: '',
//         description: '',
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//     });

//     useEffect(() => {
//         fetchCategories();
//         fetchBrands();
//     }, []);

//     const fetchCategories = () => {
//         axios.get('https://localhost:7026/api/Categories')
//             .then(response => {
//                 console.log('Fetched categories:', response.data); // ✅ DEBUG
//                 setCategories(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching categories:', error);
//             });
//     };

//     const fetchBrands = () => {
//         axios.get('https://localhost:7026/api/Brands')
//             .then(response => {
//                 setBrands(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching brands:', error);
//             });
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({
//             ...product,
//             [name]: name === 'price' || name === 'stock'
//                 ? Number(value)
//                 : value
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setLoading(true);
    
//         const payload = {
//             ...product,
//             categoryId: Number(product.categoryId),
//             brandId: Number(product.brandId),
//             price: Number(product.price),
//             stock: Number(product.stock),
//         };
    
//         axios.post('https://localhost:7026/api/Products', payload)
//             .then(response => {
//                 setLoading(false);
//                 alert('Product added successfully!');
//                 navigate('/admin/adminDashboard');
//             })
//             .catch(error => {
//                 setLoading(false);
//                 console.error('Error adding product:', error);
//                 alert('Failed to add product. Please try again.');
//             });
//     };
    

//     return (
//         <div className="min-h-screen bg-gray-100 p-6">
//             <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl font-bold">Add New Product</h1>
//                     <button
//                         onClick={() => navigate('/admin/adminDashboard')}
//                         className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow"
//                     >
//                         Back to Dashboard
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <label className="block text-gray-700 mb-2">Product Name</label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={product.name}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 mb-2">Category</label>
//                             <select
//                                 name="categoryId"
//                                 value={product.categoryId}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             >
//                                 <option value="">-- Select Category --</option>
//                                 {categories.length > 0 ? (
//                                     categories.map(category => (
//                                         <option key={category.categoryId} value={category.categoryId}>
//                                             {category.name}
//                                         </option>
//                                     ))
//                                 ) : (
//                                     <option disabled>Loading Categories...</option>
//                                 )}
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 mb-2">Brand</label>
//                             <select
//                                 name="brandId"
//                                 value={product.brandId}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             >
//                                 {brands.length > 0 ? (
//                                     brands.map(brand => (
//                                         <option key={brand.brandId} value={brand.brandId}>
//                                             {brand.name}
//                                         </option>
//                                     ))
//                                 ) : (
//                                     <option value={2}>Default Brand</option>
//                                 )}
//                             </select>
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 mb-2">Price</label>
//                             <input
//                                 type="number"
//                                 name="price"
//                                 value={product.price}
//                                 onChange={handleChange}
//                                 min="0"
//                                 step="0.01"
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 mb-2">Stock</label>
//                             <input
//                                 type="number"
//                                 name="stock"
//                                 value={product.stock}
//                                 onChange={handleChange}
//                                 min="0"
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                 required
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-gray-700 mb-2">Image URL</label>
//                             <input
//                                 type="text"
//                                 name="imageUrl"
//                                 value={product.imageUrl}
//                                 onChange={handleChange}
//                                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                         </div>
//                     </div>

//                     <div>
//                         <label className="block text-gray-700 mb-2">Description</label>
//                         <textarea
//                             name="description"
//                             value={product.description}
//                             onChange={handleChange}
//                             rows="4"
//                             className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             required
//                         ></textarea>
//                     </div>

//                     <div className="flex justify-end">
//                         <button
//                             type="submit"
//                             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow flex items-center"
//                             disabled={loading}
//                         >
//                             {loading ? 'Adding...' : 'Add Product'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddProduct;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({
        categoryId: '',
        brandId: '',
        name: '',
        price: '',
        stock: '',
        imageUrl: '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    // Force categories and brands to be loaded when component mounts
    useEffect(() => {
        // Explicitly load both data sources on mount
        loadCategoriesAndBrands();
    }, []);

    // Function to load both categories and brands
    const loadCategoriesAndBrands = async () => {
        try {
            // Load categories
            const categoriesResponse = await axios.get('https://localhost:7026/api/Categories');
            
            // Handle different response structures
            let categoriesData = categoriesResponse.data;
            
            // If it's a string (possibly JSON string), try to parse it
            if (typeof categoriesData === 'string') {
                try {
                    categoriesData = JSON.parse(categoriesData);
                } catch (e) {
                    console.error("Failed to parse categories JSON:", e);
                }
            }
            
            // Ensure we have an array
            if (!Array.isArray(categoriesData)) {
                // Check if the data is wrapped in another object
                if (categoriesData && typeof categoriesData === 'object') {
                    // Try to find an array property
                    const arrayProp = Object.keys(categoriesData).find(key => 
                        Array.isArray(categoriesData[key])
                    );
                    if (arrayProp) {
                        categoriesData = categoriesData[arrayProp];
                    } else {
                        // Convert object to array if needed
                        categoriesData = Object.values(categoriesData);
                    }
                } else {
                    categoriesData = [];
                }
            }
            
            console.log("Processed categories data:", categoriesData);
            setCategories(categoriesData);

            // Load brands with similar handling
            const brandsResponse = await axios.get('https://localhost:7026/api/Brands');
            
            let brandsData = brandsResponse.data;
            
            if (typeof brandsData === 'string') {
                try {
                    brandsData = JSON.parse(brandsData);
                } catch (e) {
                    console.error("Failed to parse brands JSON:", e);
                }
            }
            
            if (!Array.isArray(brandsData)) {
                if (brandsData && typeof brandsData === 'object') {
                    const arrayProp = Object.keys(brandsData).find(key => 
                        Array.isArray(brandsData[key])
                    );
                    if (arrayProp) {
                        brandsData = brandsData[arrayProp];
                    } else {
                        brandsData = Object.values(brandsData);
                    }
                } else {
                    brandsData = [];
                }
            }
            
            console.log("Processed brands data:", brandsData);
            setBrands(brandsData);
            
        } catch (error) {
            console.error("Error loading data:", error);
            // Set default empty arrays to prevent rendering errors
            setCategories([]);
            setBrands([]);
            alert("Failed to load categories and brands. Please check the console for details.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: name === 'price' || name === 'stock'
                ? Number(value)
                : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
    
        const payload = {
            ...product,
            categoryId: Number(product.categoryId),
            brandId: Number(product.brandId),
            price: Number(product.price),
            stock: Number(product.stock),
        };
    
        console.log("Submitting product with payload:", payload);
        
        axios.post('https://localhost:7026/api/Products', payload)
            .then(response => {
                setLoading(false);
                console.log("Product added successfully:", response.data);
                alert('Product added successfully!');
                navigate('/admin/adminDashboard');
            })
            .catch(error => {
                setLoading(false);
                console.error('Error adding product:', error);
                alert('Failed to add product. Please try again.');
            });
    };
    
    // Debug current state
 

    // Try to determine if categories have the right structure
    const categoryHasCorrectStructure = categories.length > 0 && 
        categories.every(cat => cat && typeof cat === 'object' && 'categoryId' in cat && 'name' in cat);
    
    const brandHasCorrectStructure = brands.length > 0 && 
        brands.every(brand => brand && typeof brand === 'object' && 'brandId' in brand && 'name' in brand);
    
   
    // Alternative category and brand rendering if needed
    const renderCategoryOptions = () => {
        if (categories.length === 0) {
            return <option value="">No categories available</option>;
        }
        
        if (!categoryHasCorrectStructure) {
            // Try to guess the structure
            return categories.map((cat, index) => {
                // Handle different possible structures
                const id = cat.categoryId || cat.id || cat.ID || cat.CategoryId || index;
                const name = cat.name || cat.Name || cat.title || cat.Title || cat.categoryName || cat.CategoryName || JSON.stringify(cat);
                
                return (
                    <option key={`cat-${id}`} value={id}>
                        {name}
                    </option>
                );
            });
        }
        
        return categories.map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
            </option>
        ));
    };
    
    const renderBrandOptions = () => {
        if (brands.length === 0) {
            return <option value="">No brands available</option>;
        }
        
        if (!brandHasCorrectStructure) {
            // Try to guess the structure
            return brands.map((brand, index) => {
                // Handle different possible structures
                const id = brand.brandId || brand.id || brand.ID || brand.BrandId || index;
                const name = brand.name || brand.Name || brand.title || brand.Title || brand.brandName || brand.BrandName || JSON.stringify(brand);
                
                return (
                    <option key={`brand-${id}`} value={id}>
                        {name}
                    </option>
                );
            });
        }
        
        return brands.map(brand => (
            <option key={brand.brandId} value={brand.brandId}>
                {brand.name}
            </option>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Add New Product</h1>
                    <div>
                        <button
                            onClick={() => navigate('/admin/adminDashboard')}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Debug info section
                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
                    <div className="text-sm">
                        <p>Categories loaded: {categories.length}</p>
                        <p>Brands loaded: {brands.length}</p>
                        <p>Categories structure correct: {categoryHasCorrectStructure ? 'Yes' : 'No'}</p>
                        <p>Brands structure correct: {brandHasCorrectStructure ? 'Yes' : 'No'}</p>
                    </div>
                </div> */}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 mb-2">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">
                                Category {categories.length > 0 ? `(${categories.length} loaded)` : '(None loaded)'}
                            </label>
                            <select
                                name="categoryId"
                                value={product.categoryId}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">-- Select Category --</option>
                                {renderCategoryOptions()}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">
                                Brand {brands.length > 0 ? `(${brands.length} loaded)` : '(None loaded)'}
                            </label>
                            <select
                                name="brandId"
                                value={product.brandId}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">-- Select Brand --</option>
                                {renderBrandOptions()}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                value={product.stock}
                                onChange={handleChange}
                                min="0"
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2">Image URL</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={product.imageUrl}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow flex items-center"
                            disabled={loading}
                        >
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;