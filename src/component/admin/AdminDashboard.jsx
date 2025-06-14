import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  ShoppingBag,
  Package,
  Tag,
  DollarSign,
  Activity,
  Eye,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 Import useNavigate

const API_BASE_URL = "https://localhost:7026/api/Order/AllStatistics";

const AdminDashboard = () => {
  const navigate = useNavigate(); // 👈 Hook to navigate programmatically

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    ordersByStatus: [],
    totalCustomers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalBrands: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_BASE_URL);
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path); // 👈 Now actually navigates to the path
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, onClick, subtitle }) => (
    <div
      className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 cursor-pointer ${
        onClick ? "hover:scale-105" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {onClick && (
          <Eye className="h-5 w-5 text-gray-300 transition-opacity opacity-0 group-hover:opacity-100" />
        )}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );

  const StatusCard = () => (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <h3 className="ml-4 text-lg font-semibold text-gray-800">Order Status</h3>
      </div>
      <div className="space-y-3">
        {stats.ordersByStatus.map((item, index) => {
          const colors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-red-500",
            "bg-purple-500",
          ];
          return (
            <div key={item.status} className="flex justify-between items-center">
              <div className="flex items-center">
                <span
                  className={`w-3 h-3 rounded-full mr-3 ${colors[index % colors.length]}`}
                ></span>
                <span className="text-gray-700 font-medium capitalize">{item.status}</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">{item.count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <button
            onClick={fetchStats}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={ShoppingBag}
            title="Total Orders"
            value={stats.totalOrders.toLocaleString()}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            onClick={() => handleNavigation("/admin/order")}
            subtitle="Click to view orders"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            color="bg-gradient-to-r from-green-500 to-green-600"
            subtitle="All time earnings"
          />
          <StatCard
            icon={Users}
            title="Total Customers"
            value={stats.totalCustomers.toLocaleString()}
            color="bg-gradient-to-r from-orange-500 to-orange-600"
            onClick={() => handleNavigation("/admin/ListUser")}
            subtitle="Click to manage users"
          />
          <StatCard
            icon={Package}
            title="Total Products"
            value={stats.totalProducts.toLocaleString()}
            color="bg-gradient-to-r from-indigo-500 to-indigo-600"
            onClick={() => handleNavigation("/admin/ListProduct")}
            subtitle="Manage products"
          />
        </div>

        {/* Additional Stats + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatCard
            icon={Tag}
            title="Categories"
            value={stats.totalCategories.toLocaleString()}
            color="bg-gradient-to-r from-teal-500 to-teal-600"
            onClick={() => handleNavigation("/admin/ListCategory")}
            subtitle="Product categories"
          />
          <StatCard
            icon={BarChart3}
            title="Brands"
            value={stats.totalBrands.toLocaleString()}
            color="bg-gradient-to-r from-red-500 to-red-600"
            onClick={() => handleNavigation("/admin/ListBrand")}
            subtitle="Partner brands"
          />
          <StatusCard />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Manage Orders",
                path: "/admin/order",
                color: "bg-blue-500 hover:bg-blue-600",
              },
              {
                label: "View Users",
                path: "/admin/ListUser",
                color: "bg-green-500 hover:bg-green-600",
              },
              {
                label: "Products",
                path: "/admin/ListProduct",
                color: "bg-purple-500 hover:bg-purple-600",
              },
              {
                label: "Categories",
                path: "/admin/ListCategory",
                color: "bg-orange-500 hover:bg-orange-600",
              },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(action.path)}
                className={`${action.color} text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-md`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
