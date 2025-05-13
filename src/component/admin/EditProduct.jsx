import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { useNavigate, useParams } from 'react-router-dom';

const EditProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  // Fetch product details
  useEffect(() => {
    axios.get(`https://localhost:7026/api/Products/GetProductById/${productId}`)
      .then(res => {
        const product = res.data;
        if (product) {
          setProductName(product.name);
          setPrice(product.price);
          setStock(product.stock);
          setDescription(product.description);
          setSelectedCategoryId(product.categoryId);
          setSelectedBrandId(product.brandId);
          setExistingImageUrl(product.imageUrl);
        }
      })
      .catch(err => {
        console.error('Error fetching product details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Product Not Found',
          text: 'The product you are trying to edit does not exist.',
        });
        navigate('/admin/ListProduct');
      });
  }, [productId, navigate]);

  // Fetch categories
  useEffect(() => {
    axios.get('https://localhost:7026/api/Categories/GetCategory')
      .then(res => {
        if (Array.isArray(res.data.category)) {
          setCategories(res.data.category);
        }
      })
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  // Fetch brands based on selected category
  useEffect(() => {
    if (selectedCategoryId) {
      axios.get(`https://localhost:7026/api/Brands/GetBrandsByCategory/${selectedCategoryId}`)
        .then(res => {
          if (Array.isArray(res.data)) {
            setBrands(res.data);
          } else {
            setBrands([]);
          }
        })
        .catch(err => {
          setBrands([]);
          console.error('Error fetching brands:', err);
        });
    } else {
      setBrands([]);
    }
  }, [selectedCategoryId]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('categoryId', selectedCategoryId);
    formData.append('brandId', selectedBrandId);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('description', description);
    
    // Append image if present
    if (image) {
      formData.append('imageUrl', image);
    } else {
      // Keep the existing image if no new one is uploaded
      formData.append('imageUrl', existingImageUrl);
    }

    axios.put(`https://localhost:7026/api/Products/UpdateProduct/${productId}`, formData)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Product Updated!',
          text: 'Your product has been successfully updated.',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/admin/ListProduct');
          }
        });
      })
      .catch(error => {
        console.error('Error updating product:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Please try again.',
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setSelectedBrandId('');
            }}
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
          <label className="block text-sm font-medium text-gray-700">Brand</label>
          <select
            value={selectedBrandId}
            onChange={(e) => setSelectedBrandId(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
            disabled={!brands.length}
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.brandId} value={brand.brandId}>
                {brand.brandName}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 px-4 py-2 border rounded-md"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full mt-1"
          />
          {existingImageUrl && (
            <img src={`https://localhost:7026${existingImageUrl}`} alt="Existing product" className="mt-2 max-w-xs" />
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
