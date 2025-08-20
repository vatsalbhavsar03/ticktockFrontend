import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PaymentList = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    axios.get('https://localhost:7026/api/Payment/GetAllPayments')
      .then(response => {
        if (response.data.success) {
          setPayments(response.data.payments);
        }
      })
      .catch(error => {
        console.error('Error fetching payments:', error);
        Swal.fire('Error', 'Failed to load payment data', 'error');
      });
  };

  const exportToExcel = () => {
    const data = payments.map(payment => ({
      PaymentId: payment.paymentId,
      OrderId: payment.orderId,
      Customer: payment.userName || 'N/A',
      PaymentMethod: payment.paymentMethod,
      TransactionId: payment.transactionId || '-',
      Amount: payment.amount,
      PaymentStatus: payment.paymentStatus,
      PaymentDate: new Date(payment.paymentDate).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Payments.xlsx');
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Payments</h1>
        <button
          onClick={exportToExcel}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow flex items-center"
        >
          Export to Excel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Payment ID</th>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Payment Method</th>
              <th className="px-4 py-2 text-left">Transaction ID</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map(payment => (
                <tr key={payment.paymentId} className="border-t">
                  <td className="px-4 py-2">{payment.paymentId}</td>
                  <td className="px-4 py-2">{payment.orderId}</td>
                  <td className="px-4 py-2">{payment.userName || 'N/A'}</td>
                  <td className="px-4 py-2">{payment.paymentMethod}</td>
                  <td className="px-4 py-2">{payment.transactionId || '-'}</td>
                  <td className="px-4 py-2">₹{payment.amount}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${payment.paymentStatus === 'Paid'
                      ? 'bg-green-200 text-green-800'
                      : payment.paymentStatus === 'Failed'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'}`}>
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {new Date(payment.paymentDate).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">No payment records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentList;
