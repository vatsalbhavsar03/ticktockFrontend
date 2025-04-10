import { useState } from 'react';
import './App.css';
import Login from './component/Login';
import Signup from './component/Signup';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import UserDashBoard from './component/user/UserDashboard';

import ProtectedRoute from './component/ProtectedRoute';
import AdminDashboard from './component/Admin/AdminDashboard';
import AddProduct from './component/admin/AddProduct';

function App() {

  const hiddenhiddenRoutes = [
    "admin/AdminDashboard",
    "user/UserDashBoard"
  ]
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route
          path='/admin/adminDashboard'
          element={
            <ProtectedRoute allowedRole="1">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/add-product'
          element={
            <ProtectedRoute allowedRole="1">
             <AddProduct/>
            </ProtectedRoute>
          }
        />

        <Route
          path='/user/userDashboard'
          element={
            <ProtectedRoute allowedRole="2">
              <UserDashBoard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App
