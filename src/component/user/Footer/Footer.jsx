import React from "react";
import "./style.css";
import { Col, Container, Row } from "react-bootstrap";
import { VscWatch } from "react-icons/vsc";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer"> 
      <Container>
        <Row className="footer-row border-bottom pb-3 mb-3">
          <Col md={4} sm={5} className='box'>
            <div className="logo">
              <VscWatch />
              <h1>Tick Tock Trends</h1>
            </div>
            <p>
              The Online Watch Store Website is a modern e-commerce platform
              designed to sell wristwatches from various brands and categories
              to customers worldwide. The website offers a seamless and
              user-friendly shopping experience.
            </p>
          </Col>
          <Col md={4} sm={5} className='box'>
            <h2>Quick Links</h2>
            <ul>
              <li><Link to="/user/userDashboard" className="footer-link">Home</Link></li>
              <li><Link to="/user/shop" className="footer-link">Shop</Link></li>
              <li><Link to="/user/whishlist" className="footer-link">Whishlist</Link></li>
              <li><Link to="/user/cart" className="footer-link">Cart</Link></li>
            </ul>
          </Col>
          <Col md={4} sm={5} className='box'>
            <h2>Contact Us</h2>
            <ul>
              <li>Surat, Gujarat, India.</li>
              <li>Email: ticktocktrends@gmail.com</li>
              <li>Phone: +91 8978452359</li>
            </ul>
          </Col>
        </Row>

        {/* Bottom copyright row */}
        <Row className="text-center">
          <Col>
            <p className="footer-copy">© 2025 - Tick Tock Trends. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
