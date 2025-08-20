
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TrashIcon } from '@heroicons/react/24/solid';

const AdminReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("https://localhost:7026/api/Review/GetAllReviews");
      if (res.data.success) {
        setReviews(res.data.data);
      } else {
        setReviews([]);
        setError("No reviews found.");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to fetch reviews");
    }
  };

  const handleDelete = async (reviewId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the review permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`https://localhost:7026/api/Review/DeleteReview/${reviewId}`);
          if (res.data.success) {
            Swal.fire('Deleted!', 'Review has been deleted.', 'success');
            fetchReviews();
          } else {
            Swal.fire('Error', res.data.message || 'Failed to delete.', 'error');
          }
        } catch (err) {
          Swal.fire('Error', 'Something went wrong!', 'error');
        }
      }
    });
  };

  const exportToExcel = () => {
    if (reviews.length === 0) {
      Swal.fire("No Data", "There are no reviews to export.", "info");
      return;
    }

    const formattedData = reviews.map(review => ({
      "Review ID": review.reviewId,
      "Product": review.productName,
      "User": review.userName,
      "Rating": review.rating,
      "Comment": review.comment,
      "Date": new Date(review.reviewDate).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reviews");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Review_List.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Product Reviews</h1>
        <button
          onClick={exportToExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
        >
          Export to Excel
        </button>
      </div>

      {error && <div className="bg-red-100 p-4 text-red-700 rounded-lg mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Review ID</th>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Rating</th>
              <th className="px-4 py-2 text-left">Comment</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <tr key={review.reviewId} className="border-t">
                  <td className="px-4 py-2">{review.reviewId}</td>
                  <td className="px-4 py-2">{review.productName}</td>
                  <td className="px-4 py-2">{review.userName}</td>
                  <td className="px-4 py-2">{review.rating}</td>
                  <td className="px-4 py-2">{review.comment}</td>
                  <td className="px-4 py-2">{new Date(review.reviewDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(review.reviewId)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No reviews available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReviewList;
