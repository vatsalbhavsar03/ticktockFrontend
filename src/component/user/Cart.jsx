import { Fragment, useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from "react-icons/ai";
import axios from "axios";

const API_BASE_URL = "https://localhost:7026/api/Cart";

const Cart = () => {
    const userId = localStorage.getItem("UserId");
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/GetCart?userId=${userId}`);
            setCartItems(res.data.items);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        }
    };

    const handleCheckout = async () => {
        try {
            const response = await axios.post("https://localhost:7026/api/Order/CreateOrder", {
                userId: userId,
                phone: "9876543210", // Use actual value or ask via prompt/form
                address: "123 Demo Street, Demo City" // Same here
            });

            if (response.data.success) {
                alert("✅ Order placed successfully! Order ID: " + response.data.orderId);
                fetchCart(); // Clear cart from UI
            } else {
                alert("❌ " + response.data.message);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("❌ Failed to place order.");
        }
    };


    const updateQuantity = async (cartItemId, newQty) => {
        if (newQty <= 0) return;
        try {
            await axios.put(`${API_BASE_URL}/${cartItemId}/UpdateCart`, {
                quantity: newQty,
            });
            fetchCart();
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${cartItemId}/DeleteCart`);
            fetchCart();
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    useEffect(() => {
        fetchCart();
        window.scrollTo(0, 0);
    }, []);

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div>
            <Fragment>
                <NavBar />
                <section className="cart-items">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8}>
                                {cartItems.map((item) => (
                                    <div className="cart-list" key={item.cartitemId}>
                                        <Row>
                                            <Col className="image-holder" sm={4} md={3}>
                                                <img
                                                    src={`https://localhost:7026${item.imageUrl}`}
                                                    alt={item.productName}
                                                    onError={(e) => {
                                                        e.target.src = '/fallback-image.png';
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                />

                                            </Col>
                                            <Col sm={8} md={9}>
                                                <Row className="cart-content justify-content-center">
                                                    <Col xs={12} sm={9} className="cart-details">
                                                        <h3>{item.productName}</h3>
                                                        <h4>
                                                            ₹{item.price} * {item.quantity}
                                                            <span>₹{item.subtotal}</span>
                                                        </h4>
                                                    </Col>
                                                    <Col xs={12} sm={3} className="cartControl">
                                                        <button
                                                            className="incCart"
                                                            onClick={() =>
                                                                updateQuantity(item.cartitemId, item.quantity + 1)
                                                            }
                                                        >
                                                            <AiOutlinePlus />
                                                        </button>
                                                        <button
                                                            className="desCart"
                                                            onClick={() =>
                                                                updateQuantity(item.cartitemId, item.quantity - 1)
                                                            }
                                                        >
                                                            <AiOutlineMinus />
                                                        </button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <button
                                                className="delete"
                                                onClick={() => removeItem(item.cartitemId)}
                                            >
                                                <AiOutlineClose size={20} />
                                            </button>
                                        </Row>
                                    </div>
                                ))}
                            </Col>
                            <Col md={4}>
                                <div className="cart-total">
                                    <h2>Cart Summary</h2>
                                    <div className=" d_flex">
                                        <h4>Total Price :</h4>
                                        <h3>₹{totalPrice.toFixed(2)}</h3>
                                    </div>
                                </div>
                                <div className="checkout-btn" style={{ textAlign: "center", marginTop: "20px" }}>
                                    <button
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#000",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                        }}
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>


                            </Col>
                        </Row>
                    </Container>
                </section>
                <Footer />
            </Fragment>
        </div>
    );
};

export default Cart;
