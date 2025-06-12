import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { TrashIcon } from '@heroicons/react/24/solid';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('https://localhost:7026/api/Users/GetUsers')
      .then(response => {
        setUsers(response.data.users || []);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError('Error fetching users');
        setUsers([]);
      });
  };

  const exportToExcel = () => {
    if (users.length === 0) {
      Swal.fire("No data", "There are no users to export.", "info");
      return;
    }

    const formattedData = users.map(user => ({
      "User ID": user.userId,
      Name: user.name,
      Email: user.email,
      "Phone No": user.phoneNo,
      "Created At": user.createdAt,
      "Updated At": user.updatedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Registered_Users.xlsx");
  };


  const handleDelete = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This user will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://localhost:7026/api/Users/${userId}`)
          .then(() => {
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
            fetchUsers(); // Refresh user list
          })
          .catch(error => {
            console.error('Error deleting user:', error);
            Swal.fire('Error!', 'Failed to delete user.', 'error');
          });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Registered Users</h1>

      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <div className="flex justify-end mb-4">
        <button
          onClick={exportToExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
        >
          Export to Excel
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">User ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Phone No</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Updated At</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.userId} className="border-t">
                  <td className="px-4 py-2">{user.userId}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phoneNo}</td>
                  <td className="px-4 py-2">{user.createdAt}</td>
                  <td className="px-4 py-2">{user.updatedAt}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5 inline" />
                    </button>


                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListUser;
