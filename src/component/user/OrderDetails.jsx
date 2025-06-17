// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Container, Card, Row, Col, Spinner, Badge, Button } from "react-bootstrap";
// import NavBar from "./Navbar/Navbar";
// import Footer from "./Footer/Footer";
// import axios from "axios";
// import { FaCalendarAlt, FaRupeeSign, FaBoxOpen, FaArrowLeft } from "react-icons/fa";

// const OrderDetails = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const getStatusVariant = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'completed':
//       case 'delivered':
//         return 'success';
//       case 'pending':
//         return 'warning';
//       case 'processing':
//       case 'shipped':
//         return 'info';
//       case 'cancelled':
//         return 'danger';
//       default:
//         return 'secondary';
//     }
//   };

//   const formatDate = (date) => new Date(date).toLocaleString("en-IN");

//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//     }).format(amount);

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         const response = await axios.get(`https://localhost:7026/api/Order/OrderDetails/${orderId}`);
//         setOrder(response.data.order);
//       } catch (err) {
//         console.error("Error fetching order details", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (orderId) fetchOrderDetails();
//   }, [orderId]);

//   if (loading) {
//     return (
//       <>
//         <NavBar />
//         <Container className="text-center py-5">
//           <Spinner animation="border" />
//           <p className="mt-2">Loading Order Details...</p>
//         </Container>
//         <Footer />
//       </>
//     );
//   }

//   if (!order) {
//     return (
//       <>
//         <NavBar />
//         <Container className="py-5 text-center">
//           <h4>Order not found.</h4>
//           <Button onClick={() => navigate("/user/myOrder")} variant="secondary" className="mt-3">
//             <FaArrowLeft className="me-2" />
//             Go Back
//           </Button>
//         </Container>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <NavBar />
//       <Container className="py-5">
//         <Button variant="outline-dark" onClick={() => navigate("/user/myOrder")} className="mb-4">
//           <FaArrowLeft className="me-2" />
//           Back to Orders
//         </Button>

//         <Card className="shadow-sm">
//           <Card.Header className="d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">
//               <FaBoxOpen className="me-2" />
//               Order #{order.orderId}
//             </h5>
//             <Badge bg={getStatusVariant(order.status)} className="text-uppercase">
//               {order.status}
//             </Badge>
//           </Card.Header>
//           <Card.Body>
//             <Row className="mb-3">
//               <Col md={6}>
//                 <p><strong>User:</strong> {order.name}</p>
//                 <p><strong>Email:</strong> {order.email}</p>
//               </Col>
//               <Col md={6}>
//                 <p><FaCalendarAlt className="me-2" />
//                   <strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
//               </Col>
//             </Row>

//             <hr />

//             <h6>Payment Info:</h6>
//             {order.payments?.map((payment, index) => (
//               <Card key={index} className="mb-2 border-light">
//                 <Card.Body>
//                   <Row>
//                     <Col md={6}>
//                       <p><strong>Method:</strong> {payment.paymentMethod}</p>
//                       <p><strong>Status:</strong> {payment.paymentStatus}</p>
//                     </Col>
//                     <Col md={6}>
//                       <p><strong>Transaction ID:</strong> {payment.transactionId}</p>
//                       <p><strong>Date:</strong> {formatDate(payment.paymentDate)}</p>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             ))}

//             <hr />
//             <h6>Order Items:</h6>
//             {order.orderItems.map((item, index) => (
//               <Card key={index} className="mb-3 border-light">
//                 <Card.Body>
//                   <Row>
//                     <Col md={8}>
//                       <p className="mb-1"><strong>Product:</strong> {item.product?.name}</p>
//                       <p className="mb-1"><strong>Quantity:</strong> {item.quantity}</p>
//                     </Col>
//                     <Col md={4} className="text-end">
//                       <p className="mb-1"><strong>Price:</strong> {formatCurrency(item.product?.price)}</p>
//                       <p className="mb-0"><strong>Total:</strong> {formatCurrency(item.product?.price * item.quantity)}</p>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             ))}

//             <hr />
//             <h5 className="text-end">
//               Total Amount: {formatCurrency(order.totalAmount)}
//             </h5>
//           </Card.Body>
//         </Card>
//       </Container>
//       <Footer />
//     </>
//   );
// };

// export default OrderDetails;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Spinner, Badge, Button, Alert } from "react-bootstrap";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import axios from "axios";
import { 
  FaCalendarAlt, 
  FaRupeeSign, 
  FaBoxOpen, 
  FaArrowLeft, 
  FaUser, 
  FaEnvelope, 
  FaCreditCard, 
  FaShoppingCart,
  FaReceipt,
  FaCheckCircle,
  FaClock,
  FaSpinner,
  FaTimes,
  FaTruck,
  FaMapMarkerAlt
} from "react-icons/fa";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <FaCheckCircle className="me-2" />;
      case 'pending':
        return <FaClock className="me-2" />;
      case 'processing':
        return <FaSpinner className="me-2" />;
      case 'shipped':
        return <FaTruck className="me-2" />;
      case 'cancelled':
        return <FaTimes className="me-2" />;
      default:
        return <FaBoxOpen className="me-2" />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`https://localhost:7026/api/Order/OrderDetails/${orderId}`);
        setOrder(response.data.order);
      } catch (err) {
        console.error("Error fetching order details", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <>
        <NavBar />
        <Container className="py-5">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <Spinner animation="border" variant="primary" size="lg" />
              <h5 className="mt-3 text-muted">Loading Order Details...</h5>
            </div>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <NavBar />
        <Container className="py-5">
          <div className="text-center" style={{ minHeight: '400px', paddingTop: '100px' }}>
            <FaBoxOpen size={64} className="text-muted mb-4" />
            <h3 className="text-muted mb-3">Order Not Found</h3>
            <p className="text-muted mb-4">The order you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate("/user/myOrder")} 
              variant="primary" 
              size="lg"
              className="px-4"
            >
              <FaArrowLeft className="me-2" />
              Back to My Orders
            </Button>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container className="py-5">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate("/user/myOrder")} 
              className="mb-3 px-4 py-2 rounded-pill"
              style={{ border: '2px solid #6c757d' }}
            >
              <FaArrowLeft className="me-2" />
              Back to My Orders
            </Button>
          </div>

          {/* Order Header */}
          <Card className="shadow-lg border-0 mb-4" style={{ borderRadius: '15px' }}>
            <div 
              className="text-white p-4" 
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '15px 15px 0 0'
              }}
            >
              <Row className="align-items-center">
                <Col md={8}>
                  <h2 className="mb-2 fw-bold">
                    <FaReceipt className="me-3" />
                    Order #{order.orderId}
                  </h2>
                  <p className="mb-0 opacity-75">
                    <FaCalendarAlt className="me-2" />
                    Placed on {formatDate(order.orderDate)}
                  </p>
                </Col>
                <Col md={4} className="text-md-end">
                  <Badge 
                    bg={getStatusVariant(order.status)} 
                    className="text-uppercase px-3 py-2 fs-6 rounded-pill"
                    style={{ fontSize: '1rem !important' }}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                </Col>
              </Row>
            </div>
          </Card>

          <Row>
            {/* Customer Information */}
            <Col lg={4} className="mb-4">
              <Card className="h-100 shadow border-0" style={{ borderRadius: '15px' }}>
                <Card.Header 
                  className="bg-light border-0 py-3" 
                  style={{ borderRadius: '15px 15px 0 0' }}
                >
                  <h5 className="mb-0 text-primary fw-bold">
                    <FaUser className="me-2" />
                    Customer Information
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaUser className="text-muted me-2" />
                      <strong>Name</strong>
                    </div>
                    <p className="ms-4 mb-0 text-dark">{order.name}</p>
                  </div>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <FaEnvelope className="text-muted me-2" />
                      <strong>Email</strong>
                    </div>
                    <p className="ms-4 mb-0 text-dark">{order.email}</p>
                  </div>
                  
                  <div className="mt-4 p-3 bg-light rounded-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-primary">Total Amount</span>
                      <h4 className="mb-0 text-success fw-bold">
                        {formatCurrency(order.totalAmount)}
                      </h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Order Items */}
            <Col lg={8} className="mb-4">
              <Card className="shadow border-0" style={{ borderRadius: '15px' }}>
                <Card.Header 
                  className="bg-light border-0 py-3" 
                  style={{ borderRadius: '15px 15px 0 0' }}
                >
                  <h5 className="mb-0 text-primary fw-bold">
                    <FaShoppingCart className="me-2" />
                    Order Items ({order.orderItems.length})
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="p-4 border-bottom">
                      <Row className="align-items-center">
                        <Col md={6}>
                          <h6 className="mb-2 text-dark fw-bold">{item.product?.name}</h6>
                          <div className="d-flex align-items-center text-muted">
                            <span className="me-3">Qty: {item.quantity}</span>
                            <span>Price: {formatCurrency(item.product?.price)}</span>
                          </div>
                        </Col>
                        <Col md={6} className="text-md-end">
                          <div className="mt-2 mt-md-0">
                            <p className="mb-1 text-muted">Item Total</p>
                            <h5 className="mb-0 text-success fw-bold">
                              {formatCurrency(item.product?.price * item.quantity)}
                            </h5>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Payment Information */}
          {order.payments && order.payments.length > 0 && (
            <Card className="shadow border-0 mb-4" style={{ borderRadius: '15px' }}>
              <Card.Header 
                className="bg-light border-0 py-3" 
                style={{ borderRadius: '15px 15px 0 0' }}
              >
                <h5 className="mb-0 text-primary fw-bold">
                  <FaCreditCard className="me-2" />
                  Payment Information
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                {order.payments.map((payment, index) => (
                  <div key={index} className="mb-3">
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <strong className="text-muted d-block mb-1">Payment Method</strong>
                          <span className="text-dark">{payment.paymentMethod}</span>
                        </div>
                        <div className="mb-3">
                          <strong className="text-muted d-block mb-1">Status</strong>
                          <Badge bg={getStatusVariant(payment.paymentStatus)} className="text-uppercase">
                            {payment.paymentStatus}
                          </Badge>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <strong className="text-muted d-block mb-1">Transaction ID</strong>
                          <code className="text-dark bg-light p-2 rounded">{payment.transactionId}</code>
                        </div>
                        <div className="mb-3">
                          <strong className="text-muted d-block mb-1">Payment Date</strong>
                          <span className="text-dark">{formatDate(payment.paymentDate)}</span>
                        </div>
                      </Col>
                    </Row>
                    {index < order.payments.length - 1 && <hr />}
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {/* Order Summary */}
          <Card className="shadow border-0" style={{ borderRadius: '15px' }}>
            <div 
              className="text-white p-4" 
              style={{ 
                background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                borderRadius: '15px'
              }}
            >
              <Row className="align-items-center">
                <Col md={8}>
                  <h4 className="mb-2 fw-bold">Order Summary</h4>
                  <p className="mb-0 opacity-75">
                    {order.orderItems.length} item(s) • Order #{order.orderId}
                  </p>
                </Col>
                <Col md={4} className="text-md-end">
                  <h2 className="mb-0 fw-bold">
                    {formatCurrency(order.totalAmount)}
                  </h2>
                </Col>
              </Row>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="text-center mt-5">
            <Button 
              variant="primary" 
              size="lg" 
              className="me-3 px-4 py-2 rounded-pill"
              onClick={() => navigate("/user/myOrder")}
            >
              View All Orders
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg" 
              className="px-4 py-2 rounded-pill"
              onClick={() => window.print()}
            >
              Print Order
            </Button>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetails;
