import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Signup from './component/Signup';
import ProtectedRoute from './component/ProtectedRoute';
import UserDashBoard from './component/user/UserDashboard';
import AdminDashboard from './component/Admin/AdminDashboard';
import AddProduct from './component/admin/AddProduct';
import AddBrand from './component/admin/AddBrand';  // Import your AddBrand component
import AdminLayout from './component/admin/AdminLayout';
import ListProduct from './component/admin/ListProduct';
import EditProduct from './component/admin/EditProduct';
import ListBrand from './component/admin/ListBrand';
import ListCategory from './component/admin/ListCategory';
import AddCategory from './component/admin/AddCategory';
import EditCategory from './component/admin/EditCategory';
import EditBrand from './component/admin/EditBrand';


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
          <Route path="addBrand" element={<AddBrand />} />  {/* Add AddBrand route here */}
          <Route path="ListProduct" element={<ListProduct />} />
          <Route path="EditProduct/:productId" element={<EditProduct />} />
          <Route path="ListBrand" element={<ListBrand />} />
          <Route path="ListCategory" element={<ListCategory />} />
          <Route path="addCategory" element={<AddCategory />} />
          <Route path="editCategory/:id" element={<EditCategory />} />
          <Route path="editBrand/:id" element={<EditBrand />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
