import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phoneNo: "" });
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      Swal.fire("Unauthorized", "Please login to access your profile.", "error");
      return;
    }

    axios
      .get("https://localhost:7026/api/Users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          const userData = res.data.user;
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            phoneNo: userData.phoneNo || "",
          });
        } else {
          Swal.fire("Error", "Failed to load profile", "error");
        }
      })
      .catch(() => Swal.fire("Error", "Failed to load profile", "error"));
  }, [token]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers for phoneNo
    if (name === "phoneNo" && value && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = () => {
    const { name, email, phoneNo } = formData;

    if (!name.trim() || !email.trim() || !phoneNo.trim()) {
      return Swal.fire("Validation Error", "All fields are required.", "warning");
    }

    if (!validateEmail(email)) {
      return Swal.fire("Validation Error", "Enter a valid email address.", "warning");
    }

    if (!validatePhone(phoneNo)) {
      return Swal.fire("Validation Error", "Phone number must be exactly 10 digits.", "warning");
    }

    axios
      .put("https://localhost:7026/api/Users/update-profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          Swal.fire("Success", "Profile updated successfully!", "success");
        } else {
          Swal.fire("Error", res.data.message, "error");
        }
      })
      .catch((err) => {
        Swal.fire("Update Failed", err.response?.data?.message || "Something went wrong", "error");
      });
  };

  if (!user) {
    return <p className="text-center mt-10 text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">👤 Edit Profile</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone No</label>
          <input
            type="text"
            name="phoneNo"
            maxLength={10}
            value={formData.phoneNo}
            onChange={handleChange}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
        >
          ← Back
        </button>

        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          💾 Update Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
