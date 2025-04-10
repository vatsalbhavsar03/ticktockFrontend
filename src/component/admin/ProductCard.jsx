import React from 'react';

export default function ProductCard({ product, onEdit, onDelete }) {
    return (
        <tr className="border-b hover:bg-gray-50">
            <td className="text-left px-4 py-3">{product.productId}</td>
            <td className="text-left px-4 py-3 font-medium">{product.name}</td>
            <td className="text-left px-4 py-3">₹{product.price.toLocaleString()}</td>
            <td className="text-left px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock > 10 ? 'bg-green-100 text-green-800' : 
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                }`}>
                    {product.stock}
                </span>
            </td>
            <td className="text-left px-4 py-3 max-w-xs truncate">{product.description}</td>
            <td className="px-4 py-3">
                <div className="flex justify-center space-x-2">
                    <button 
                        onClick={() => onEdit(product.productId)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded"
                        title="Edit Product"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => onDelete(product.productId)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded"
                        title="Delete Product"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
}