import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Clock, Mail, Lock } from "lucide-react";
import swal from "sweetalert";

const API_BASE_URL = "https://localhost:7026/api/Users";

export default function Login() {
  const [formData, setFormData] = useState({ Email: "", Password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const validateForm = () => {
    const formErrors = {};
    if (!formData.Email.trim()) {
      formErrors.Email = "Email is required!";
    } else if (!validateEmail(formData.Email)) {
      formErrors.Email = "Enter a valid email!";
    }

    if (!formData.Password.trim()) {
      formErrors.Password = "Password is required!";
    } else if (formData.Password.length < 6) {
      formErrors.Password = "Password must be at least 6 characters!";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, formData);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("roleId", res.data.roleId);
        swal("Success", "Login Successful!", "success");

        if (res.data.roleId === 1) {
          navigate("/admin/adminDashboard");
        } else {
          navigate("/user/userDashboard");
        }
      } else {
        swal("Error", res.data.message, "error");
      }
    } catch (err) {
      swal("Error", "Invalid credentials!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="text-blue-600" size={24} />
            <h1 className="text-xl font-bold text-gray-800">Tick Tock Trends</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className={`pl-10 pr-4 py-2 w-full border ${
                    errors.Email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {errors.Email && <p className="text-sm text-red-600 mt-1">{errors.Email}</p>}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.Password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  className={`pl-10 pr-10 py-2 w-full border ${
                    errors.Password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
              {errors.Password && <p className="text-sm text-red-600 mt-1">{errors.Password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center py-2 px-4 rounded-md text-white font-medium ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Switch to Signup */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
