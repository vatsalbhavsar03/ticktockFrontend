import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:7026/api/Order/AllStatistics";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        ordersByStatus: [],
        totalCustomers: 0,
        totalProducts: 0,
        totalCategories: 0,
        totalBrands: 0
    });

    const navigate = useNavigate();

    const fetchStats = async () => {
    try {
        const res = await axios.get(API_BASE_URL);
        const data = res.data; // ⬅️ no `.data.data`, just `.data`

        setStats({
            totalOrders: data.totalOrders,
            totalRevenue: data.totalRevenue,
            ordersByStatus: data.ordersByStatus,
            totalCustomers: data.totalCustomers,
            totalProducts: data.totalProducts,
            totalCategories: data.totalCategories,
            totalBrands: data.totalBrands
        });
    } catch (error) {
        console.error("Failed to fetch stats:", error);
    }
};


    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Admin Dashboard</h2>
            <Row className="mb-4">
                <Col md={4}>
                    <Card bg="primary" text="white" className="text-center p-3" onClick={() => navigate("/admin/order")}>
                        <h5>Total Orders</h5>
                        <h2>{stats.totalOrders}</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card bg="success" text="white" className="text-center p-3">
                        <h5>Total Revenue</h5>
                        <h2>₹{stats.totalRevenue.toFixed(2)}</h2>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card bg="info" text="white" className="text-center p-3">
                        <h5>Status Breakdown</h5>
                        {stats.ordersByStatus.map((item) => (
                            <p key={item.status}>
                                <strong>{item.status}:</strong> {item.count}
                            </p>
                        ))}
                    </Card>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={3}>
                    <Card bg="warning" text="white" className="text-center p-3" onClick={() => navigate("/admin/ListUser")}>
                        <h5>Total Customers</h5>
                        <h2>{stats.totalCustomers}</h2>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card bg="dark" text="white" className="text-center p-3" onClick={() => navigate("/admin/ListProduct")}>
                        <h5>Total Products</h5>
                        <h2>{stats.totalProducts}</h2>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card bg="secondary" text="white" className="text-center p-3" onClick={() => navigate("/admin/ListCategory")}>
                        <h5>Total Categories</h5>
                        <h2>{stats.totalCategories}</h2>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card bg="danger" text="white" className="text-center p-3" onClick={() => navigate("/admin/ListBrand")}>
                        <h5>Total Brands</h5>
                        <h2>{stats.totalBrands}</h2>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminDashboard;
