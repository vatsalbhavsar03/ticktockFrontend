import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import NavBar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    Image,
    Spinner,
} from "react-bootstrap";
import { AiOutlineDelete } from "react-icons/ai";

const API_BASE_URL = "https://localhost:7026/api/Cart";

const Checkout = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const cartItems = state?.cartItems || [];

    const [user, setUser] = useState({ username: "", email: "", mobile: "" });
    const [address, setAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [items, setItems] = useState(cartItems);
    const [removingId, setRemovingId] = useState(null);
    const [sticky, setSticky] = useState(false);
    const productListRef = useRef(null);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get("https://localhost:7026/api/Users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser({
                    username: res.data.user.name,
                    email: res.data.user.email,
                    mobile: res.data.user.phoneNo,
                });
            } catch (err) {
                console.error("Failed to fetch profile:", err);
            }
        };
        fetchUserProfile();
    }, [token]);

    useEffect(() => {
        const handleScroll = () => {
            if (!productListRef.current) return;

            const productListBottom = productListRef.current.getBoundingClientRect().bottom + window.scrollY;
            const scrollPosition = window.scrollY + 90;

            setSticky(scrollPosition >= productListBottom);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleRemoveProduct = async (cartItemId) => {
        try {
            setRemovingId(cartItemId);
            await axios.delete(`${API_BASE_URL}/${cartItemId}/DeleteCart`);
            setItems((prev) => prev.filter((item) => item.cartitemId !== cartItemId));
            setRemovingId(null);
        } catch (error) {
            console.error("Failed to remove item:", error);
            alert("Failed to remove item from cart.");
            setRemovingId(null);
        }
    };

    const handlePlaceOrder = async () => {
    const userId = localStorage.getItem("UserId");

    if (!address) {
        alert("Please enter delivery address");
        return;
    }

    const orderDetails = {
        userId,
        phone: user.mobile,
        address,
        paymentMethod,
        items,
    };

    if (paymentMethod === "cod") {
        try {
            // Optional: Send order to backend here

            console.log("Order placed successfully:", orderDetails);
            alert("✅ Order placed with COD!");

            // Clear cart items from server
            for (const item of items) {
                await axios.delete(`${API_BASE_URL}/${item.cartitemId}/DeleteCart`);
            }

            // Clear cart items from UI
            setItems([]);

            // Optionally redirect
            // navigate("/order-confirmation");
        } catch (err) {
            console.error("Failed to clear cart:", err);
            alert("⚠️ Order placed but failed to clear cart items.");
        }
    } else {
        const amountInPaise = total * 100;

        const options = {
            key: "rzp_test_9XTV943a1m3SbM",
            amount: amountInPaise,
            currency: "INR",
            name: "TickTock Trends",
            description: "Order Payment",
            image: "/logo.png",
            handler: async function (response) {
                console.log("Payment successful:", response);
                alert("✅ Payment successful & Order placed!");

                try {
                    // Clear cart items from server after successful payment
                    for (const item of items) {
                        await axios.delete(`${API_BASE_URL}/${item.cartitemId}/DeleteCart`);
                    }

                    // Clear cart items from UI
                    setItems([]);

                    // Optionally redirect to order confirmation page
                    // navigate("/order-confirmation");
                } catch (error) {
                    console.error("Payment succeeded, but failed to clear cart:", error);
                    alert("⚠️ Payment succeeded, but failed to clear cart items.");
                }
            },
            prefill: {
                name: user.username,
                email: user.email,
                contact: user.mobile,
            },
            notes: {
                address: address,
            },
            theme: {
                color: "#000",
            },
            modal: {
                ondismiss: function () {
                    alert("❌ Payment was cancelled.");
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }
};

return (
        <>
            <NavBar />
            <Container fluid className="my-5 px-5">
                <Row className="align-items-start">
                    <Col md={6} ref={productListRef}>
                        <h3 className="mb-4">🛒 Your Cart</h3>
                        {items.length === 0 && <p>Your cart is empty.</p>}
                        {items.map((item) => (
                            <Card className="mb-3 position-relative" key={item.cartitemId}>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    style={{
                                        position: "absolute",
                                        top: "8px",
                                        right: "8px",
                                        zIndex: 10,
                                        borderRadius: "50%",
                                        padding: "4px 8px",
                                        minWidth: "30px",
                                        height: "30px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                    disabled={removingId === item.cartitemId}
                                    onClick={() => handleRemoveProduct(item.cartitemId)}
                                    title="Remove item"
                                >
                                    {removingId === item.cartitemId ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        <AiOutlineDelete />
                                    )}
                                </Button>

                                <Card.Body className="d-flex align-items-center">
                                    <Image
                                        src={`https://localhost:7026${item.imageUrl}`}
                                        alt={item.productName}
                                        onError={(e) => {
                                            e.target.src = "/fallback-image.png";
                                        }}
                                        rounded
                                        fluid
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            marginRight: "15px",
                                            border: "1px solid #ddd",
                                            backgroundColor: "#f8f8f8",
                                        }}
                                    />
                                    <div>
                                        <h5 className="mb-1">{item.productName}</h5>
                                        <small>
                                            ₹{item.price} × {item.quantity}
                                        </small>
                                        <br />
                                        <strong>Total: ₹{item.price * item.quantity}</strong>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                        {items.length > 0 && (
                            <h5 className="mt-3">Grand Total: ₹{total.toFixed(2)}</h5>
                        )}
                    </Col>

                    <Col md={6}>
                        <div
                            style={{
                                position: sticky ? "sticky" : "relative",
                                top: sticky ? "90px" : "auto",
                                padding: "20px",
                                backgroundColor: "#f9f9f9",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                transition: "position 0.3s ease",
                            }}
                        >
                            <h3 className="mb-4">📦 Checkout</h3>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" value={user.username} disabled />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={user.email} disabled />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Mobile</Form.Label>
                                    <Form.Control type="text" value={user.mobile} disabled />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Delivery Address</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter delivery address"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Payment Method</Form.Label>
                                    <div className="d-flex gap-3">
                                        <Form.Check
                                            type="radio"
                                            label="Cash on Delivery (COD)"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={paymentMethod === "cod"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Online Payment"
                                            name="paymentMethod"
                                            value="online"
                                            checked={paymentMethod === "online"}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                    </div>
                                </Form.Group>

                                <Button
                                    style={{ backgroundColor: "#0f3460", borderColor: "#0f3460" }}
                                    className="w-100"
                                    onClick={handlePlaceOrder}
                                    disabled={items.length === 0}
                                >
                                    Confirm & Pay ₹{total.toFixed(2)}
                                </Button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default Checkout;
