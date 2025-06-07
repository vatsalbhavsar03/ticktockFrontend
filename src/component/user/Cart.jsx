import { Fragment, useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineClose } from "react-icons/ai";

import demo from "../../images/arm-chair-01.jpg"
const Cart = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div>
            <Fragment>
                <NavBar />
                <section className="cart-items">
                    <Container>
                        <Row className="justify-content-center">
                            <Col md={8}>
                                <div className="cart-list">
                                    <Row>
                                        <Col className="image-holder" sm={4} md={3}>
                                            <img src={demo} alt="loading" />
                                        </Col>
                                        <Col sm={8} md={9}>
                                            <Row className="cart-content justify-content-center">
                                                <Col xs={12} sm={9} className="cart-details">
                                                    <h3>demo</h3>
                                                    <h4>
                                                        500.00 * 1
                                                        <span>$500.00</span>
                                                    </h4>
                                                </Col>
                                                <Col xs={12} sm={3} className="cartControl">
                                                    <button className="incCart">
                                                         <AiOutlinePlus  />
                                                    </button>
                                                    <button className="desCart">
                                                        <AiOutlineMinus  />
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <button className="delete">
                                             <AiOutlineClose size={20} />
                                        </button>
                                    </Row>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="cart-total">
                                    <h2>Cart Summary</h2>
                                    <div className=" d_flex">
                                        <h4>Total Price :</h4>
                                        <h3>500.00</h3>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <Footer/>
            </Fragment>
        </div>

    );
};

export default Cart;
