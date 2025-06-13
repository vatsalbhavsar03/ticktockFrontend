// import { useLocation, useNavigate } from "react-router-dom";
// import { useEffect } from "react";
// // import NavBar from "../Navbar/Navbar";
// // import Footer from "../Footer/Footer";
// import { Container, Card, Row, Col, Button } from "react-bootstrap";

// const ThankYou = () => {
//     const { state } = useLocation();
//     const navigate = useNavigate();

//     const { orderId, user, address, total, paymentMethod } = state || {};

//     useEffect(() => {
//         if (!state) {
//             navigate("/");
//         }
//     }, [state, navigate]);

//     return (
//         <>
//             {/* <NavBar /> */}
//             <Container className="my-5">
//                 <Card className="text-center shadow p-4">
//                     <h2 className="mb-3">🎉 Thank You for Your Purchase!</h2>
//                     <p className="lead">Your order has been placed successfully.</p>

//                     <hr />

//                     <Row className="my-4 text-start">
//                         <Col md={6}>
//                             <h5>🧾 Order Details</h5>
//                             <p><strong>Order ID:</strong> {orderId}</p>
//                             <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
//                             <p><strong>Total Amount:</strong> ₹{total?.toFixed(2)}</p>
//                         </Col>

//                         <Col md={6}>
//                             <h5>👤 Customer Info</h5>
//                             <p><strong>Name:</strong> {user?.username}</p>
//                             <p><strong>Email:</strong> {user?.email}</p>
//                             <p><strong>Phone:</strong> {user?.mobile}</p>
//                             <p><strong>Address:</strong> {address}</p>
//                         </Col>
//                     </Row>

//                     <Button
//                         variant="dark"
//                         onClick={() => navigate("/user/userDashboard")}
//                     >
//                         🛍️ Continue Shopping
//                     </Button>
//                 </Card>
//             </Container>
//             {/* <Footer /> */}
//         </>
//     );
// };

// export default ThankYou;
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

const ThankYou = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { orderId, user, address, total, paymentMethod } = state || {};

  useEffect(() => {
    if (!state) {
      navigate("/");
    }
  }, [state, navigate]);

  return (
    <>
      <Container className="my-5">
        <Card className="text-center shadow p-4">
          <h2 className="mb-3">🎉 Thank You for Your Purchase!</h2>
          <p className="lead">Your order has been placed successfully.</p>

          <hr />

          <Row className="my-4 text-start">
            <Col md={6}>
              <h5>🧾 Order Details</h5>
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Payment Method:</strong> {paymentMethod?.toUpperCase()}</p>
              <p><strong>Total Amount:</strong> ₹{total?.toFixed(2)}</p>
            </Col>

            <Col md={6}>
              <h5>👤 Customer Info</h5>
              <p><strong>Name:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.mobile}</p>
              <p><strong>Address:</strong> {address}</p>
            </Col>
          </Row>

          <Button variant="dark" onClick={() => navigate("/user/userDashboard")}>
            🛍️ Continue Shopping
          </Button>
        </Card>
      </Container>
    </>
  );
};

export default ThankYou;
