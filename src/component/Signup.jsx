import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:7026/api/Users";

function Signup() {
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formdata, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validateForm = () => {
    const { name, email, phoneNo, password } = formdata;
    let formErrors = {};

    if (!name.trim()) formErrors.name = "Name is required!";
    if (!email.trim()) formErrors.email = "Email is required!";
    else if (!validateEmail(email)) formErrors.email = "Enter a valid email!";
    if (!phoneNo.trim()) formErrors.phoneNo = "Phone number is required!";
    else if (phoneNo.length !== 10) formErrors.phoneNo = "Phone number must be 10 digits!";
    if (!password.trim()) formErrors.password = "Password is required!";
    else if (password.length < 6) formErrors.password = "Password must be at least 6 characters!";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const sendOtp = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/SendOTP`, { email: formdata.email }, { withCredentials: true });
      if (res.data.success) {
        setIsOtpSent(true);
        Swal.fire("Success", res.data.message, "success");
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch {
      Swal.fire("Error", "Failed to send OTP!", "error");
    }
  };
  

  const verifyOtp = async () => {
    try {
        const response = await axios.post(
          `${API_BASE_URL}/VerifyOTP`,
          {
            email: formdata.email,
            otp: otp
          },
          {
            withCredentials: true, // This must be inside the 3rd config object
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
  
      if (response.data.success) {
        setIsOtpVerified(true);
        setIsOtpSent(false);
        Swal.fire("Success", response.data.message, "success");
      } else {
        Swal.fire("Error", response.data.message, "error");
      }
  
    } catch (error) {
      console.error("OTP Verification Error:", error.response?.data || error.message);
      Swal.fire("Error", error.response?.data?.message || "Invalid or expired OTP!", "error");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!isOtpVerified) {
      Swal.fire("Error", "Please verify OTP before registering!", "error");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/Register`, formdata);
      if (res.data.success) {
        Swal.fire("Success", "User registered successfully!", "success");
        setFormData({ name: "", email: "", phoneNo: "", password: "" });
        setErrors({});
        navigate("/"); // Navigate to the login page or home page
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong during registration!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">Registration Page</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                type="text"
                value={formdata.name}
                onChange={handleChange}
                placeholder="Enter Name"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={formdata.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                name="phoneNo"
                type="text"
                value={formdata.phoneNo}
                onChange={handleChange}
                placeholder="Enter Phone"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
              />
              {errors.phoneNo && <p className="text-red-500 text-sm mt-1">{errors.phoneNo}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                value={formdata.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring focus:ring-blue-500"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* OTP Input */}
            {isOtpSent && !isOtpVerified && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP sent to email"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                />
                <button
                  type="button"
                  className="w-full mt-2 bg-green-600 text-white py-2 rounded"
                  onClick={verifyOtp}
                >
                  Verify OTP
                </button>
              </div>
            )}

            {/* Send OTP Button */}
            {!isOtpSent && !isOtpVerified && (
              <button
                type="button"
                className="w-full bg-blue-500 text-white py-2 rounded"
                onClick={sendOtp}
              >
                Send OTP
              </button>
            )}

            {/* Register Button */}
            {isOtpVerified && (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Register
              </button>
            )}
          </form>

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
