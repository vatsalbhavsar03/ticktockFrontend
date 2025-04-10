import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import AdminDashboard from "./Admin/AdminDashboard";
const API_BASE_URL = "https://localhost:7026/api/Users";

export default function Login() {
    const [formData, setFormData] = useState({ Email: "", Password: "" });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear the specific error message on change
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validateForm = () => {
        let formErrors = {};
        const { Email, Password } = formData;

        if (!Email.trim()) {
            formErrors.Email = "Email is required!";
        } else if (!validateEmail(Email)) {
            formErrors.Email = "Enter a valid email!";
        }

        if (!Password.trim()) {
            formErrors.Password = "Password is required!";
        } else if (Password.length < 6) {
            formErrors.Password = "Password must be at least 6 characters!";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post(`${API_BASE_URL}/login`, formData);
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("roleId", response.data.roleId);
                swal("Success", "Login Successful!", "success");
                if(response.data.roleId == 1){
                    navigate("/admin/adminDashboard");
                }
                else{
                    navigate("/user/userDashboard");  
                }
                // navigate(response.data.redirectUrl || "/dashboard");
            } else {
                swal("Error", response.data.message, "error");
            }
        } catch (error) {
            swal("Error", "Invalid credentials!", "error");
        }
    };

    return (
        <div className="max-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Login Page</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="text-left block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                id="email"
                                name="Email"
                                type="email"
                                placeholder="Enter Email"
                                value={formData.Email}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.Email && (
                                <p className="text-left text-red-500 text-sm mt-1">{errors.Email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="text-left block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="Password"
                                type="password"
                                placeholder="Enter Password"
                                value={formData.Password}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.Password && (
                                <p className="text-left text-red-500 text-sm mt-1">{errors.Password}</p>
                            )}
                        </div>


                        {/* Submit */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    {/* Sign up link */}
                    <div className="mt-6 text-center">
                        <span className="text-gray-600">Don't have an account?</span>
                        <Link
                            to="/signup"
                            className="ml-2 text-blue-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
