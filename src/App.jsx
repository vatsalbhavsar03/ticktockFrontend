import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Signup from './component/Signup';
import ProtectedRoute from './component/ProtectedRoute';
import UserDashBoard from './component/user/UserDashboard';
import AdminDashboard from './component/Admin/AdminDashboard';
import AddProduct from './component/admin/AddProduct';
import AdminLayout from './component/admin/AdminLayout';
import ListProduct from './component/admin/ListProduct';
import EditProduct from './component/admin/EditProduct';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Dashboard Route */}
        <Route
          path="/user/userDashboard"
          element={
            <ProtectedRoute allowedRole="2">
              <UserDashBoard />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes with Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="1">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin Dashboard Route */}
          <Route path="adminDashboard" element={<AdminDashboard />} />

          {/* Admin Product Routes */}
          <Route path="addProduct" element={<AddProduct />} />
          <Route path="ListProduct" element={<ListProduct />} />
          <Route path="EditProduct/:productId" element={<EditProduct />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
