import { Fragment, useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://localhost:7026/api/Cart";

const Cart = () => {
    const navigate = useNavigate();
    const userId = localStorage.getItem("UserId");
    const [cartItems, setCartItems] = useState([]);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/GetCart?userId=${userId}`);
            setCartItems(res.data.items || []);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
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

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            navigate("/user/checkout", { state: { cartItems } });
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
        <Fragment>
            <NavBar />
            <section className="cart-items">
                <Container>
                    <Row className="justify-content-center py-5">
                        <Col md={8}>
                            {cartItems.length === 0 ? (
                                <div style={{padding: "50px 0px" }}>
                                    <h3>Your cart is empty</h3>
                                    <button
                                        style={{
                                            marginTop: "20px",
                                            padding: "10px 20px",
                                            backgroundColor: "#0f3460",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            fontSize: "16px",
                                        }}
                                        onClick={() => navigate("/user/shop")}
                                    >
                                        🛍️ Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
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
                                                            <span> = ₹{item.price * item.quantity}</span>
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
                                ))
                            )}
                        </Col>
                        <Col md={4}>
                            <div className="cart-total">
                                <h2>Cart Summary</h2>
                                <div className="d_flex">
                                    <h4>Total Price :</h4>
                                    <h3>₹{totalPrice.toFixed(2)}</h3>
                                </div>
                            </div>
                            <div className="checkout-btn" style={{ marginTop: "20px" }}>
                                <button
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: cartItems.length > 0 ? "#0f3460" : "#ccc",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: cartItems.length > 0 ? "pointer" : "not-allowed",
                                        fontSize: "16px",
                                    }}
                                    disabled={cartItems.length === 0}
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
    );
};

export default Cart;
