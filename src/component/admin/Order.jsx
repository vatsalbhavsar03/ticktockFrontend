import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const statusOptions = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get('https://localhost:7026/api/Order/GetAllOrders')
      .then(response => {
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  };

  const exportToExcel = () => {
    const exportData = orders.map(order => ({
      OrderID: order.orderId,
      User: order.userName || 'N/A',
      Products: order.items.map(i => i.productName).join(", "),
      Address: order.address,
      Amount: order.totalAmount,
      Status: order.status,
      OrderDate: new Date(order.orderDate).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Orders_List.xlsx");
  };

  const handleStatusChange = (orderId, newStatus) => {
    axios.put(`https://localhost:7026/api/Order/UpdateOrderStatus/${orderId}`, {
      status: newStatus
    })
      .then(() => {
        Swal.fire('Success', 'Order status updated!', 'success');
        fetchOrders();
      })
      .catch(error => {
        console.error('Error updating status:', error);
        Swal.fire('Error', 'Failed to update status', 'error');
      });
  };

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredOrders = statusFilter
    ? orders.filter(order => order.status === statusFilter)
    : orders;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Orders</h1>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="border px-3 py-2 rounded-lg bg-white shadow-sm"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <button
            onClick={exportToExcel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
          >
            Export to Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2">Products</th>
              <th className="px-4 py-2 text-left">Address</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.orderId} className="border-t">
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.userName || "N/A"}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-4">
                      {order.items && order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg shadow-sm">
                          <img
                            src={`https://localhost:7026${item.imageUrl}`}
                            alt={item.productName}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="text-sm">{item.productName}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2">{order.address}</td>
                  <td className="px-4 py-2">₹{order.totalAmount}</td>
                  <td className="px-4 py-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 bg-white text-sm"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">No orders available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
