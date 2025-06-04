import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
// import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
// import { addToCart } from "../../app/features/cart/cartSlice";
import "./product-details.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { FaRupeeSign } from "react-icons/fa";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 👈 Add this
  const path = location.pathname;
  const id = path.split("/").pop();
  // const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://localhost:7026/api/Products/GetProductById/${id}`);
        const data = await res.json();
        if (data.success) {
          setProduct(data);
        } else {
          toast.error("Failed to fetch product");
        }
      } catch (error) {
        toast.error("Error fetching product");
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleAdd = () => {
    // dispatch(addToCart({ product, num: quantity }));
    toast.success("Product has been added to cart!");
  };

  const handleBack = () => {
    navigate(-1); // 👈 This navigates back
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <Fragment>
        <Navbar />
        <section className="product-page">
          <Container>
            <Row className="justify-content-center">
              <Col md={6}>
                <img
                  loading="lazy"
                  src={`https://localhost:7026${product.imageUrl}`}
                  alt={product.name}
                />
              </Col>
              <Col md={6}>
                <h2>{product.name}</h2>
                <div className="rate">
                  <div className="stars">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </div>
                  <span>{product.stock} in stock</span>
                </div>
                <div className="info">
                  <span className="price"><FaRupeeSign />{product.price}</span>
                  <span>Category: {product.categoryName}</span>
                  <span>Brand: {product.brandName}</span> 
                </div>
                <p>{product.description}</p>
                <input
                  className="qty-input"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <div className="d-flex gap-2 mt-3">
                  <button
                    aria-label="Add"
                    type="submit"
                    className="add"
                    onClick={handleAdd}
                  >
                    Add To Cart
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleBack}
                  >
                    Back
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

export default ProductDetails;
