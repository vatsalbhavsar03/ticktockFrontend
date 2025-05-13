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
import { BiSolidCategory } from "react-icons/bi";
import { TbDeviceWatchFilled } from "react-icons/tb";
import { AiFillDashboard } from "react-icons/ai";
import { TbBrandBootstrap } from "react-icons/tb";




const AdminLayout = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
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
                        <AiFillDashboard style={{ fontSize: '30px' }} />
                        <span>Dashboard</span>
                    </li>
                    <li onClick={() => navigate("/admin/faculties")}>
                        <BiSolidCategory style={{ fontSize: '30px' }} />
                        <span>Category</span>
                    </li>
                    <li onClick={() => navigate("/admin/ListBrand")}>
                        <TbBrandBootstrap style={{ fontSize: '30px' }} />

                        <span>Brand</span>
                    </li>
                    <li onClick={() => navigate("/admin/ListProduct")}>
                        <TbDeviceWatchFilled style={{fontSize:"30px"}} />
                        <span>Products</span>
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
