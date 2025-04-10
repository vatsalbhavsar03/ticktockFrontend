import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:7026/api/Users";

function Signup() {
    const [formdata, setformData] = useState({
        name: "",
        email: "",
        phoneNo: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({
            ...formdata,
            [name]: value
        });

        // clear the field
        setErrors({
            ...errors,
            [name]: ""
        });
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validateForm = () => {
        let formErrors = {};
        const { name, email, phoneNo, password } = formdata;

        if (!name.trim()) formErrors.name = "Name is required!";
        if (!email.trim()) formErrors.email = "Email is required!";
        else if (!validateEmail(email)) formErrors.email = "Enter a valid email!";

        if (!phoneNo.trim()) formErrors.phoneNo = "Phone number is required!";
        else if (phoneNo.length != 10 )
            formErrors.phoneNo = "Enter a valid phone number!";

        if (!password.trim()) formErrors.password = "Password is required!";
        else if (password.length < 6)
            formErrors.password = "Password must be at least 6 characters!";

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.post(`${API_BASE_URL}/Register`, formdata);
            if (response.data.success) {
                swal("Success", "User registered successfully!", "success");
                setformData({
                    name: "",
                    email: "",
                    phoneNo: "",
                    password: ""
                });
                setErrors({});
                navigate("/");
            } else {
                swal("Error", response.data.message, "error");
            }
        } catch (error) {
            console.error("Registration failed:", error);
            swal("Error", "Something went wrong during registration!", "error");
        }
    };

    return (
        <div className="max-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Registration Page</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="text-left block text-sm font-medium text-gray-700">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formdata.name}
                                onChange={handleChange}
                                placeholder="Enter Name"
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.name && <p className="text-left text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="text-left block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formdata.email}
                                onChange={handleChange}
                                placeholder="Enter Email"
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.email && <p className="text-left text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phoneNo" className="text-left block text-sm font-medium text-gray-700">Mobile Number</label>
                            <input
                                id="phoneNo"
                                name="phoneNo"
                                type="text"
                                value={formdata.phoneNo}
                                onChange={handleChange}
                                placeholder="Enter Mobile Number"
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.phoneNo && <p className="text-left text-red-500 text-sm mt-1">{errors.phoneNo}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="text-left text-left block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formdata.password}
                                onChange={handleChange}
                                placeholder="Enter Password"
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.password && <p className="text-left text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        {/* Submit */}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Register
                            </button>
                        </div>
                    </form>

                    {/* Already registered link */}
                    <div className="mt-6 text-center">
                        <span className="text-gray-600">Already have an account?</span>
                        <Link to="/" className="text-blue-600 ml-2 hover:underline">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;

