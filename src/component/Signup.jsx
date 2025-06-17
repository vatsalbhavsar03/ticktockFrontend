// import React, { useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Link, useNavigate } from "react-router-dom";
// import { Clock, Mail, Lock, User, Phone } from "lucide-react";
//  // Make sure to import the necessary icons

// const API_BASE_URL = "https://localhost:7026/api/Users";

// function Signup() {
//   const [formdata, setFormData] = useState({
//     name: "",
//     email: "",
//     phoneNo: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [otp, setOtp] = useState("");
//   const [isOtpSent, setIsOtpSent] = useState(false);
//   const [isOtpVerified, setIsOtpVerified] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formdata, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

//   const validateForm = () => {
//     const { name, email, phoneNo, password } = formdata;
//     let formErrors = {};

//     if (!name.trim()) formErrors.name = "Name is required!";
//     if (!email.trim()) formErrors.email = "Email is required!";
//     else if (!validateEmail(email)) formErrors.email = "Enter a valid email!";
//     if (!phoneNo.trim()) formErrors.phoneNo = "Phone number is required!";
//     else if (phoneNo.length !== 10) formErrors.phoneNo = "Phone number must be 10 digits!";
//     if (!password.trim()) formErrors.password = "Password is required!";
//     else if (password.length < 6) formErrors.password = "Password must be at least 6 characters!";

//     setErrors(formErrors);
//     return Object.keys(formErrors).length === 0;
//   };

//   const sendOtp = async () => {
//     if (!validateEmail(formdata.email)) {
//       setErrors({ ...errors, email: "Enter a valid email!" });
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE_URL}/SendOTP`, { email: formdata.email }, { withCredentials: true });
//       if (res.data.success) {
//         setIsOtpSent(true);
//         Swal.fire("Success", res.data.message, "success");
//       } else {
//         Swal.fire("Error", res.data.message, "error");
//       }
//     } catch {
//       Swal.fire("Error", "Failed to send OTP!", "error");
//     }
//     setLoading(false);
//   };

//   const verifyOtp = async () => {
//     if (!otp.trim()) return Swal.fire("Error", "Please enter the OTP!", "error");

//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/VerifyOTP`,
//         { email: formdata.email, otp },
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" }
//         }
//       );

//       if (response.data.success) {
//         setIsOtpVerified(true);
//         setIsOtpSent(false);
//         Swal.fire("Success", response.data.message, "success");
//       } else {
//         Swal.fire("Error", response.data.message, "error");
//       }
//     } catch (error) {
//       Swal.fire("Error", error.response?.data?.message || "Invalid or expired OTP!", "error");
//     }
//     setLoading(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     if (!isOtpVerified) {
//       Swal.fire("Error", "Please verify OTP before registering!", "error");
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE_URL}/Register`, formdata);
//       if (res.data.success) {
//         Swal.fire("Success", "User registered successfully!", "success");
//         setFormData({ name: "", email: "", phoneNo: "", password: "" });
//         setErrors({});
//         navigate("/");
//       } else {
//         Swal.fire("Error", res.data.message, "error");
//       }
//     } catch {
//       Swal.fire("Error", "Something went wrong during registration!", "error");
//     }
//     setLoading(false);
//   };

//   const Spinner = () => (
//     <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
//   );

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm py-4">
//         <div className="container mx-auto px-4 flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <Clock className="text-blue-600" size={24} />
//             <h1 className="text-xl font-bold text-gray-800">Tick Tock Trends</h1>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex-grow flex items-center justify-center px-4 py-8">
//         <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
//           <div className="p-6">
//             <form onSubmit={handleSubmit}>
//               <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create your account</h2>

//               {/* Name Field */}
//               <div className="mb-4">
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                   Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User size={18} className="text-gray-400" />
//                   </div>
//                   <input
//                     id="name"
//                     name="name"
//                     type="text"
//                     placeholder="Enter Name"
//                     value={formdata.name}
//                     onChange={handleChange}
//                     className={`pl-10 pr-4 py-2 w-full border ${errors.name ? "border-red-500" : "border-gray-300"
//                       } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                   />
//                 </div>
//                 {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
//               </div>

//               {/* Email Field */}
//               <div className="mb-4">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail size={18} className="text-gray-400" />
//                   </div>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="Enter Email"
//                     value={formdata.email}
//                     onChange={handleChange}
//                     className={`pl-10 pr-4 py-2 w-full border ${errors.email ? "border-red-500" : "border-gray-300"
//                       } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                   />
//                 </div>
//                 {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//               </div>

//               {/* Phone Field */}
//               <div className="mb-4">
//                 <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone Number
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Phone size={18} className="text-gray-400" />
//                   </div>
//                   <input
//                     id="phoneNo"
//                     name="phoneNo"
//                     type="text"
//                     placeholder="Enter Phone Number"
//                     value={formdata.phoneNo}
//                     onChange={handleChange}
//                     className={`pl-10 pr-4 py-2 w-full border ${errors.phoneNo ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                   />
//                 </div>
//                 {errors.phoneNo && <p className="mt-1 text-sm text-red-600">{errors.phoneNo}</p>}
//               </div>


//               {/* Password Field */}
//               <div className="mb-4">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={18} className="text-gray-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type="password"
//                     placeholder="Enter Password"
//                     value={formdata.password}
//                     onChange={handleChange}
//                     className={`pl-10 pr-4 py-2 w-full border ${errors.password ? "border-red-500" : "border-gray-300"
//                       } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
//                   />
//                 </div>
//                 {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
//               </div>

//               {/* OTP Input */}
//               {isOtpSent && !isOtpVerified && (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
//                   <input
//                     type="text"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     placeholder="OTP sent to email"
//                     className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
//                   />
//                   <button
//                     type="button"
//                     disabled={loading}
//                     className="w-full mt-2 bg-green-600 text-white py-2 rounded flex justify-center items-center"
//                     onClick={verifyOtp}
//                   >
//                     {loading ? <><Spinner /> Verifying...</> : "Verify OTP"}
//                   </button>
//                 </div>
//               )}

//               {/* Send OTP */}
//               {!isOtpSent && !isOtpVerified && (
//                 <button
//                   type="button"
//                   disabled={loading}
//                   className="w-full bg-blue-500 text-white py-2 rounded flex justify-center items-center"
//                   onClick={sendOtp}
//                 >
//                   {loading ? <><Spinner /> Sending...</> : "Send OTP"}
//                 </button>
//               )}

//               {/* Register */}
//               {isOtpVerified && (
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center"
//                 >
//                   {loading ? <><Spinner /> Registering...</> : "Register"}
//                 </button>
//               )}
//             </form>

//             <div className="mt-6 text-center">
//               <span className="text-gray-600">Already have an account?</span>
//               <Link to="/" className="text-blue-600 ml-2 hover:underline">Sign in</Link>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Signup;


import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Clock, Mail, Lock, User, Phone } from "lucide-react";

const API_BASE_URL = "https://localhost:7026/api/Users";

function Signup() {
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formdata, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

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
    if (!validateEmail(formdata.email)) {
      setErrors({ ...errors, email: "Enter a valid email!" });
      return;
    }

    setLoading(true);
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
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp.trim()) return Swal.fire("Error", "Please enter the OTP!", "error");

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/VerifyOTP`,
        { email: formdata.email, otp },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
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
      Swal.fire("Error", error.response?.data?.message || "Invalid or expired OTP!", "error");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!isOtpVerified) {
      Swal.fire("Error", "Please verify OTP before registering!", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/Register`, formdata);
      if (res.data.success) {
        Swal.fire("Success", "User registered successfully!", "success");
        setFormData({ name: "", email: "", phoneNo: "", password: "" });
        setErrors({});
        navigate("/");
      } else {
        Swal.fire("Error", res.data.message, "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong during registration!", "error");
    }
    setLoading(false);
  };

  const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
  );

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
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create your account</h2>

              {/* Name Field */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter Name"
                    value={formdata.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              {/* Email Field */}
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
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    value={formdata.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Phone Field */}
              <div className="mb-4">
                <label htmlFor="phoneNo" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="phoneNo"
                    name="phoneNo"
                    type="tel"
                    placeholder="Enter Phone Number"
                    value={formdata.phoneNo}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.phoneNo ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                {errors.phoneNo && <p className="mt-1 text-sm text-red-600">{errors.phoneNo}</p>}
              </div>

              {/* Password Field */}
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
                    name="password"
                    type="password"
                    placeholder="Enter Password"
                    value={formdata.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  />
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

              {/* OTP Input */}
              {isOtpSent && !isOtpVerified && (
                <div className="mb-4">
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="OTP sent to email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    className="w-full mt-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    onClick={verifyOtp}
                  >
                    {loading ? <><Spinner /> Verifying...</> : "Verify OTP"}
                  </button>
                </div>
              )}

              {/* Send OTP */}
              {!isOtpSent && !isOtpVerified && (
                <button
                  type="button"
                  disabled={loading}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  onClick={sendOtp}
                >
                  {loading ? <><Spinner /> Sending...</> : "Send OTP"}
                </button>
              )}

              {/* Register */}
              {isOtpVerified && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {loading ? <><Spinner /> Registering...</> : "Register"}
                </button>
              )}
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-600">Already have an account?</span>
              <Link to="/" className="text-blue-600 ml-2 hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
