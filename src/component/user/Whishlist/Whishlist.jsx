import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRupeeSign } from "react-icons/fa";
import NavBar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./wish.css"

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    if (!userId) {
      toast.warning("Please login to view your wishlist");
      setLoading(false);
      return;
    }

    fetchWishlist();
  }, [userId]);

  const fetchWishlist = () => {
    axios
      .get(`https://localhost:7026/api/Wishlist/GetWishlist/${userId}`)
      .then((res) => {
        if (res.data.success) {
          setWishlistProducts(res.data.data);
        } else {
          toast.info(res.data.message || "No wishlist products found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const removeFromWishlist = (productId) => {
    axios
      .delete("https://localhost:7026/api/Wishlist/RemoveFromWishlist", {
        data: {
          userId: parseInt(userId),
          productId: productId,
        },
      })
      .then((res) => {
        if (res.data.success) {
          toast.success("Removed from wishlist");

          // Optimistically update state
          setWishlistProducts((prev) =>
            prev.filter((item) => item.product.productId !== productId)
          );
        } else {
          toast.error(res.data.message || "Failed to remove");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error removing from wishlist");
      });
  };

  const addToCart = (product) => {
    const cartItem = {
      userId: parseInt(userId),
      productId: product.productId,
      quantity: 1,
    };

    axios
      .post("https://localhost:7026/api/Cart/AddToCart", cartItem)
      .then((res) => {
        if (res.data.success) {
          toast.success("Added to cart");
        } else {
          toast.warning(res.data.message || "Already in cart");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to add to cart");
      });
  };

  return (
    <div>
      <Fragment>
        <NavBar />
        <div>
          <Container >
            <section style={{ backgroundColor: "ff0000" }}>
              <div>
                <h3 className="wish-header">Your Wishlist</h3>
              </div>
              {wishlistProducts.length === 0 && !loading ? (
                <div  style={{ padding: "50px 0" }}>
                  <h5>Your wishlist is empty.</h5>
                  <p>Start adding some amazing products!</p>
                </div>
              ) : (
                <Row>
                  {
                    wishlistProducts.map((item) => (
                      <Col key={item.product.productId} md={3} sm={6} xs={12} className="product mtop">
                        <div className="wishlist-item">
                          
                          <img
                            src={`https://localhost:7026${item.product.imageUrl}`}
                            alt={item.product.name}
                            onError={(e) => { e.target.src = '/fallback-image.png'; }}
                            style={{ cursor: "pointer", width: "100%" }}
                            onClick={() => (window.location.href = `/user/productdetail/${item.product.productId}`)}
                          />
                          <h3>{item.product.name}</h3>
                          <p style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "#0f3460", marginBottom: "0px" }}>
                            <FaRupeeSign style={{ marginRight: "4px" }} />
                            {item.product.price}
                          </p>
                          <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
                            Added on: {new Date(item.wishlistDate).toLocaleDateString()}
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                            <button onClick={() => addToCart(item.product)} className="addtoCart">
                              Add to Cart
                            </button>
                            <button onClick={() => removeFromWishlist(item.product.productId)} className="remove">
                              Remove
                            </button>
                          </div>
                        </div>
                      </Col>
                    ))
                  }
                </Row>
              )}

            </section>
          </Container>
        </div>
        <Footer />
      </Fragment>
    </div>
  );
};

export default Wishlist;
