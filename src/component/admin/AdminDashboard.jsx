import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Container } from "react-bootstrap";

const API_BASE_URL = "https://localhost:7026/api/Order/ordersstats";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        ordersByStatus: []
    });


    const fetchStats = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}`);
            setStats({
                totalOrders: res.data.totalOrders,
                totalRevenue: res.data.totalRevenue,
                ordersByStatus: res.data.ordersByStatus
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
                    <Card bg="primary" text="white" className="text-center p-3">
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
        </Container>
    );
};

export default AdminDashboard;
