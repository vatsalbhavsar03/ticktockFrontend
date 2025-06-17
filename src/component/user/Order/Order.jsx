// import React, { useEffect, Fragment, useState } from "react";
// import axios from "axios";
// import NavBar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import { Col, Container, Row, Card, Badge, Spinner, Alert } from "react-bootstrap";
// import {
//   FaShoppingBag,
//   FaCalendarAlt,
//   FaRupeeSign,
//   FaCheckCircle,
//   FaClock,
//   FaTruck,
//   FaTimesCircle,
//   FaBox,
//   FaReceipt,
//   FaBan
// } from "react-icons/fa";
// import { Button } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";

// const Order = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [cancellingOrderId, setCancellingOrderId] = useState(null);
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("UserId");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await axios.get(
//           `https://localhost:7026/api/Order/GetUserOrder`,
//           {
//             params: { userId },
//           }
//         );

//         const data = Array.isArray(response.data.orders)
//           ? response.data.orders
//           : [];
//         setOrders(data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setError("Failed to load orders. Please try again later.");
//         setOrders([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchOrders();
//     } else {
//       setLoading(false);
//     }
//   }, [userId]);

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'completed':
//       case 'delivered':
//         return <FaCheckCircle className="text-success" />;
//       case 'pending':
//         return <FaClock className="text-warning" />;
//       case 'processing':
//       case 'shipped':
//         return <FaTruck className="text-info" />;
//       case 'cancelled':
//         return <FaTimesCircle className="text-danger" />;
//       default:
//         return <FaBox className="text-secondary" />;
//     }
//   };

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

//   const formatDate = (dateString) => {
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString('en-US', options);
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR'
//     }).format(amount);
//   };

//   const handleCancelOrder = async (orderId) => {
//     try {
//       setCancellingOrderId(orderId);

//       // ✅ Corrected API call to match your backend
//       const response = await axios.put(
//         `https://localhost:7026/api/Order/orders/${orderId}/cancel`
//       );

//       if (response.status === 200 || response.status === 204) {
//         // Update local state
//         setOrders(prevOrders =>
//           prevOrders.map(order =>
//             order.orderId === orderId
//               ? { ...order, status: 'Cancelled' }
//               : order
//           )
//         );

//         alert('Order cancelled successfully!');
//       }
//     } catch (error) {
//       console.error('Error cancelling order:', error);
//       alert('Failed to cancel order. Please try again.');
//     } finally {
//       setCancellingOrderId(null);
//     }
//   };


//   const canCancelOrder = (status) => {
//     const cancelableStatuses = ['pending', 'processing'];
//     return cancelableStatuses.includes(status?.toLowerCase());
//   };

//   if (loading) {
//     return (
//       <Fragment>
//         <NavBar />
//         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
//           <div className="text-center">
//             <Spinner animation="border" variant="primary" size="lg" />
//             <div className="mt-3">
//               <h5 className="text-muted">Loading your orders...</h5>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </Fragment>
//     );
//   }

//   if (!userId) {
//     return (
//       <Fragment>
//         <NavBar />
//         <Container className="py-5">
//           <Row className="justify-content-center">
//             <Col md={6}>
//               <Alert variant="warning" className="text-center">
//                 <FaReceipt size={48} className="mb-3" />
//                 <h4>Access Required</h4>
//                 <p>Please login to view your orders.</p>
//               </Alert>
//             </Col>
//           </Row>
//         </Container>
//         <Footer />
//       </Fragment>
//     );
//   }

//   return (
//     <Fragment>
//       <NavBar />
//       <div style={{ backgroundColor: '#f8f9fa', minHeight: '80vh' }}>
//         <Container className="py-5">
//           {/* Header Section */}
//           <Row className="mb-4">
//             <Col>
//               <div className="d-flex align-items-center mb-3">
//                 <FaShoppingBag className="text-primary me-3" size={32} />
//                 <div>
//                   <h1 className="mb-1" style={{ color: '#2c3e50', fontWeight: '600' }}>
//                     My Orders
//                   </h1>
//                 </div>
//               </div>
//             </Col>
//           </Row>

//           {/* Error Alert */}
//           {error && (
//             <Row className="mb-4">
//               <Col>
//                 <Alert variant="danger" className="shadow-sm">
//                   <strong>Error:</strong> {error}
//                 </Alert>
//               </Col>
//             </Row>
//           )}

//           {/* Orders List */}
//           {orders.length === 0 ? (
//             <Row className="justify-content-center">
//               <Col md={6}>
//                 <Card className="shadow-sm border-0 text-center py-5">
//                   <Card.Body>
//                     <FaShoppingBag size={64} className="text-muted mb-4" />
//                     <h4 className="text-muted mb-3">No Orders Found</h4>
//                     <p className="text-muted">
//                       You haven't placed any orders yet. Start shopping to see your orders here!
//                     </p>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             </Row>
//           ) : (
//             <Row>
//               <Col>
//                 <div className="mb-3">
//                   <small className="text-muted">
//                     Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
//                   </small>
//                 </div>
//                 {orders.map((order, index) => (
//                   <Card
//                     key={order.orderId || index}
//                     className="mb-4 shadow-sm border-0"
//                     style={{
//                       transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
//                       cursor: 'pointer'
//                     }}
//                     onMouseEnter={(e) => {
//                       e.currentTarget.style.transform = 'translateY(-2px)';
//                       e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
//                     }}
//                     onMouseLeave={(e) => {
//                       e.currentTarget.style.transform = 'translateY(0)';
//                       e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
//                     }}
//                   >
//                     <Card.Body className="p-4">
//                       <Row className="align-items-center">
//                         <Col md={8}>
//                           <div className="d-flex align-items-start">
//                             <div className="me-3 mt-1">
//                               {getStatusIcon(order.status)}
//                             </div>
//                             <div className="flex-grow-1">
//                               <div className="d-flex align-items-center mb-2">
//                                 <h5 className="mb-0 me-3" style={{ color: '#2c3e50', fontWeight: '600' }}>
//                                   Order #{order.orderId}
//                                 </h5>
//                                 <Badge
//                                   bg={getStatusVariant(order.status)}
//                                   className="px-3 py-2"
//                                   style={{ fontSize: '0.75rem', fontWeight: '500' }}
//                                 >
//                                   {order.status}
//                                 </Badge>
//                               </div>

//                               <div className="text-muted mb-2">
//                                 <FaCalendarAlt className="me-2" size={14} />
//                                 <small>
//                                   Placed on {formatDate(order.orderDate)}
//                                 </small>
//                               </div>
//                             </div>
//                           </div>
//                         </Col>

//                         <Col md={4} className="text-md-end">
//                           <div className="d-flex align-items-center justify-content-md-end">
//                             <FaRupeeSign className="text-success me-1" size={18} />
//                             <h4 className="mb-0 text-success" style={{ fontWeight: '600' }}>
//                               {formatCurrency(order.totalAmount)}
//                             </h4>
//                           </div>
//                         </Col>
//                       </Row>

//                       {/* Additional Order Details with Cancel Button */}
//                       <hr className="my-3" />
//                       <Row className="align-items-center">
//                         <Col sm={6}>
//                           <small className="text-muted">
//                             <strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}
//                           </small>
//                         </Col>
//                         <Col sm={6} className="text-sm-end">
//                           {canCancelOrder(order.status) ? (
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               onClick={() => handleCancelOrder(order.orderId)}
//                               disabled={cancellingOrderId === order.orderId}
//                               className="d-flex align-items-center"
//                               style={{ marginLeft: 'auto', width: 'fit-content' }}
//                             >
//                               {cancellingOrderId === order.orderId ? (
//                                 <>
//                                   <Spinner
//                                     as="span"
//                                     animation="border"
//                                     size="sm"
//                                     role="status"
//                                     className="me-2"
//                                   />
//                                   Cancelling...
//                                 </>
//                               ) : (
//                                 <>
//                                   <FaBan className="me-2" size={12} />
//                                   Cancel Order
//                                 </>
//                               )}
//                             </Button>
//                           ) : (
//                             <small className="text-muted">
//                               {/* <em>Cannot be cancelled</em> */}
//                             </small>
//                           )}
//                         </Col>
//                       </Row>
//                     </Card.Body>
//                   </Card>
//                 ))}
//               </Col>
//             </Row>
//           )}
//         </Container>
//       </div>
//       <Footer />
//     </Fragment>
//   );
// };

// export default Order;

import React, { useEffect, Fragment, useState } from "react";
import axios from "axios";
import NavBar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Col, Container, Row, Card, Badge, Spinner, Alert } from "react-bootstrap";
import {
  FaShoppingBag,
  FaCalendarAlt,
  FaRupeeSign,
  FaCheckCircle,
  FaClock,
  FaTruck,
  FaTimesCircle,
  FaBox,
  FaReceipt,
  FaBan
} from "react-icons/fa";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://localhost:7026/api/Order/GetUserOrder`,
          { params: { userId } }
        );
        const data = Array.isArray(response.data.orders)
          ? response.data.orders
          : [];
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <FaCheckCircle className="text-success" />;
      case 'pending':
        return <FaClock className="text-warning" />;
      case 'processing':
      case 'shipped':
        return <FaTruck className="text-info" />;
      case 'cancelled':
        return <FaTimesCircle className="text-danger" />;
      default:
        return <FaBox className="text-secondary" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
      case 'shipped':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-IN");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrderId(orderId);
      const response = await axios.put(
        `https://localhost:7026/api/Order/orders/${orderId}/cancel`
      );
      if (response.status === 200 || response.status === 204) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.orderId === orderId
              ? { ...order, status: 'Cancelled' }
              : order
          )
        );
        alert('Order cancelled successfully!');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const canCancelOrder = (status) => {
    const cancelableStatuses = ['pending', 'processing'];
    return cancelableStatuses.includes(status?.toLowerCase());
  };

  if (loading) {
    return (
      <Fragment>
        <NavBar />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <div className="mt-3">
              <h5 className="text-muted">Loading your orders...</h5>
            </div>
          </div>
        </div>
        <Footer />
      </Fragment>
    );
  }

  if (!userId) {
    return (
      <Fragment>
        <NavBar />
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={6}>
              <Alert variant="warning" className="text-center">
                <FaReceipt size={48} className="mb-3" />
                <h4>Access Required</h4>
                <p>Please login to view your orders.</p>
              </Alert>
            </Col>
          </Row>
        </Container>
        <Footer />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <NavBar />
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '80vh' }}>
        <Container className="py-5">
          <Row className="mb-4">
            <Col>
              <div className="d-flex align-items-center mb-3">
                <FaShoppingBag className="text-primary me-3" size={32} />
                <div>
                  <h1 className="mb-1" style={{ color: '#2c3e50', fontWeight: '600' }}>
                    My Orders
                  </h1>
                </div>
              </div>
            </Col>
          </Row>

          {error && (
            <Row className="mb-4">
              <Col>
                <Alert variant="danger" className="shadow-sm">
                  <strong>Error:</strong> {error}
                </Alert>
              </Col>
            </Row>
          )}

          {orders.length === 0 ? (
            <Row className="justify-content-center">
              <Col md={6}>
                <Card className="shadow-sm border-0 text-center py-5">
                  <Card.Body>
                    <FaShoppingBag size={64} className="text-muted mb-4" />
                    <h4 className="text-muted mb-3">No Orders Found</h4>
                    <p className="text-muted">
                      You haven't placed any orders yet. Start shopping to see your orders here!
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <Row>
              <Col>
                <div className="mb-3">
                  <small className="text-muted">
                    Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                  </small>
                </div>
                {orders.map((order, index) => (
                  <Card
                    key={order.orderId || index}
                    className="mb-4 shadow-sm border-0"
                    style={{
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/order/${order.orderId}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <Card.Body className="p-4">
                      <Row className="align-items-center">
                        <Col md={8}>
                          <div className="d-flex align-items-start">
                            <div className="me-3 mt-1">{getStatusIcon(order.status)}</div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center mb-2">
                                <h5 className="mb-0 me-3" style={{ color: '#2c3e50', fontWeight: '600' }}>
                                  Order #{order.orderId}
                                </h5>
                                <Badge
                                  bg={getStatusVariant(order.status)}
                                  className="px-3 py-2"
                                  style={{ fontSize: '0.75rem', fontWeight: '500' }}
                                >
                                  {order.status}
                                </Badge>
                              </div>
                              <div className="text-muted mb-2">
                                <FaCalendarAlt className="me-2" size={14} />
                                <small>Placed on {formatDate(order.orderDate)}</small>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={4} className="text-md-end">
                          <div className="d-flex align-items-center justify-content-md-end">
                            <FaRupeeSign className="text-success me-1" size={18} />
                            <h4 className="mb-0 text-success" style={{ fontWeight: '600' }}>
                              {formatCurrency(order.totalAmount)}
                            </h4>
                          </div>
                        </Col>
                      </Row>
                      <hr className="my-3" />
                      <Row className="align-items-center">
                        <Col sm={6}>
                          <small className="text-muted">
                            <strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}
                          </small>
                        </Col>
                        <Col sm={6} className="text-sm-end">
                          {canCancelOrder(order.status) && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // ✅ Prevent click on card
                                handleCancelOrder(order.orderId);
                              }}
                              disabled={cancellingOrderId === order.orderId}
                              className="d-flex align-items-center"
                              style={{ marginLeft: 'auto', width: 'fit-content' }}
                            >
                              {cancellingOrderId === order.orderId ? (
                                <>
                                  <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    className="me-2"
                                  />
                                  Cancelling...
                                </>
                              ) : (
                                <>
                                  <FaBan className="me-2" size={12} />
                                  Cancel Order
                                </>
                              )}
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
            </Row>
          )}
        </Container>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Order;
