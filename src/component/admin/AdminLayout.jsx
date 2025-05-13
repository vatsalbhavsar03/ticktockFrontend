import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import {
    FaUniversity,
    FaChalkboardTeacher,
    FaUserGraduate,
    FaSignOutAlt,
    FaBars,
    FaTachometerAlt,
} from "react-icons/fa";
import { VscWatch } from "react-icons/vsc";
import '../admin/AdminLayout.css';


const AdminLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/AdminandFacultyLogin");
    };

    return (
        <div className="admin-dashboard-container">
            {/* Sidebar */}
            <div className={`sidebar-new ${isSidebarOpen ? "open" : "collapsed"}`}>
                <div className="top-section">
                    <div className="logo-area">
                        <div className="menu-toggle" onClick={toggleSidebar}>
                            <FaBars />
                        </div>

                        {isSidebarOpen && (
                            <div className="logo-text" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <VscWatch />
                                Tick Tock Trends
                            </div>
                        )}

                    </div>
                </div>

                <ul className="nav-menu">
                    <li onClick={() => navigate("/admin/AdminDashboard")}>
                        <FaTachometerAlt className="icon" />
                        <span>Dashboard</span>
                    </li>
                    <li onClick={() => navigate("/admin/ListProduct")}>
                        <FaUniversity className="icon" />
                        <span>Products</span>
                    </li>
                    <li onClick={() => navigate("/admin/faculties")}>
                        <FaChalkboardTeacher className="icon" />
                        <span>Faculties</span>
                    </li>
                    <li onClick={() => navigate("/admin/students")}>
                        <FaUserGraduate className="icon" />
                        <span>Students</span>
                    </li>
                    <li onClick={() => navigate("/admin/faculty-assignment")}>
                        <FaChalkboardTeacher className="icon" />
                        <span>Faculty Assignment</span>
                    </li>
                    <li onClick={handleLogout}>
                        <FaSignOutAlt className="icon" />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="dashboard-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
