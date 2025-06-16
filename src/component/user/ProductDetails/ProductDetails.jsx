// import { Fragment, useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Col, Container, Row } from "react-bootstrap";
// import { toast } from "react-toastify";
// import "./product-details.css";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import { FaRupeeSign } from "react-icons/fa";
// import axios from "axios";

// const ProductDetails = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const id = location.pathname.split("/").pop();
//   const [product, setProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
//   const [editingReview, setEditingReview] = useState(null);
//   const userId = localStorage.getItem("UserId");

//   useEffect(() => {
//     fetchProduct();
//     fetchReviews();
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const res = await fetch(`https://localhost:7026/api/Products/GetProductById/${id}`);
//       const data = await res.json();
//       if (data.success) setProduct(data);
//       else toast.error("Failed to fetch product");
//     } catch (error) {
//       toast.error("Error fetching product");
//     }
//   };

//   const fetchReviews = async () => {
//     try {
//       const res = await axios.get(`https://localhost:7026/api/Review/GetReviews/${id}`);
//       if (res.data.success) setReviews(res.data.data);
//       else setReviews([]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleAddToCart = async () => {
//     try {
//       const payload = {
//         userId: parseInt(userId),
//         productId: product.productId,
//         quantity,
//       };
//       const res = await axios.post("https://localhost:7026/api/Cart/AddToCart", payload);
//       if (res.data.success) toast.success("Product has been added to cart!");
//       else toast.warning(res.data.message);
//     } catch {
//       toast.error("Failed to add to cart");
//     }
//   };

//   const handleBack = () => navigate(-1);

//   const handleReviewSubmit = async () => {
//     if (!newReview.rating || !newReview.comment) return toast.warning("Enter rating and comment");

//     const dto = {
//       userId: parseInt(userId),
//       productId: parseInt(id),
//       rating: newReview.rating,
//       comment: newReview.comment,
//     };

//     try {
//       if (editingReview) {
//         await axios.put(`https://localhost:7026/api/Review/UpdateReview/${editingReview.reviewId}`, dto);
//         toast.success("Review updated");
//       } else {
//         await axios.post("https://localhost:7026/api/Review/AddReview", dto);
//         toast.success("Review added");
//       }
//       setNewReview({ rating: 0, comment: "" });
//       setEditingReview(null);
//       fetchReviews();
//     } catch {
//       toast.error("Error submitting review");
//     }
//   };

//   const handleEdit = (review) => {
//     setNewReview({ rating: review.rating, comment: review.comment });
//     setEditingReview(review);
//   };

//   const handleDelete = async (reviewId) => {
//     try {
//       await axios.delete(`https://localhost:7026/api/Review/DeleteReview/${reviewId}`);
//       toast.success("Review deleted");
//       fetchReviews();
//     } catch {
//       toast.error("Failed to delete review");
//     }
//   };

//   if (!product) return <div>Loading...</div>;

//   return (
//     <div>
//       <Fragment>
//         <Navbar />
//         <section className="product-page">
//           <Container>
//             <Row className="justify-content-center">
//               <Col md={6}>
//                 <img
//                   loading="lazy"
//                   src={`https://localhost:7026${product.imageUrl}`}
//                   alt={product.name}
//                 />
//               </Col>
//               <Col md={6}>
//                 <h2>{product.name}</h2>
//                 <div className="rate">
//                   <div className="stars">
//                     <i className="fa fa-star"></i>
//                     <i className="fa fa-star"></i>
//                     <i className="fa fa-star"></i>
//                     <i className="fa fa-star"></i>
//                     <i className="fa fa-star"></i>
//                   </div>
//                   <span>{product.stock} in stock</span>
//                 </div>
//                 <div className="info">
//                   <span className="price"><FaRupeeSign />{product.price}</span>
//                   <span>Category: {product.categoryName}</span>
//                   <span>Brand: {product.brandName}</span> 
//                 </div>
//                 <p>{product.description}</p>
//                 <input
//                   className="qty-input"
//                   type="number"
//                   min="1"
//                   value={quantity}
//                   onChange={(e) => setQuantity(Number(e.target.value))}
//                 />
//                 <div className="d-flex gap-2 mt-3">
//                   <button
//                     aria-label="Add"
//                     type="submit"
//                     className="add"
//                     onClick={handleAddToCart}
//                     disabled={product.stock === 0}
//                     style={{
//                       opacity: product.stock === 0 ? 0.5 : 1,
//                       cursor: product.stock === 0 ? "not-allowed" : "pointer",
//                     }}
//                   >
//                     Add To Cart
//                   </button>
//                   <button type="button" className="btn btn-secondary" onClick={handleBack}>
//                     Back
//                   </button>
//                 </div>
//               </Col>
//             </Row>

//             {/* Review Section */}
//             <Row className="mt-5">
//               <Col md={12}>
//                 <h4>Reviews</h4>
//                 {reviews.length === 0 ? (
//                   <p>No reviews yet.</p>
//                 ) : (
//                   reviews.map((review) => (
//                     <div key={review.reviewId} className="review-box mb-3 p-2 border rounded">
//                       <div className="d-flex justify-content-between">
//                         <strong>{review.user.name}</strong>
//                         <span style={{ fontSize: "14px", color: "gray" }}>
//                           {new Date(review.reviewDate).toLocaleDateString()}
//                         </span>
//                       </div>
//                       <div className="d-flex align-items-center mb-1">
//                         {[...Array(5)].map((_, i) => (
//                           <i
//                             key={i}
//                             className={`fa fa-star${i < review.rating ? "" : "-o"}`}
//                             style={{ color: "#fbc02d", marginRight: 2 }}
//                           ></i>
//                         ))}
//                       </div>
//                       <p className="mb-1">{review.comment}</p>
//                       {parseInt(userId) === review.userId && (
//                         <div className="d-flex gap-2">
//                           <button
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() => handleEdit(review)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => handleDelete(review.reviewId)}
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 )}

//                 <div className="mt-4">
//                   <h5>{editingReview ? "Edit Your Review" : "Add a Review"}</h5>
//                   <div className="mb-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <i
//                         key={star}
//                         className={`fa fa-star${star <= newReview.rating ? "" : "-o"}`}
//                         style={{ color: "#fbc02d", fontSize: "20px", cursor: "pointer" }}
//                         onClick={() => setNewReview({ ...newReview, rating: star })}
//                       ></i>
//                     ))}
//                   </div>
//                   <textarea
//                     rows="3"
//                     className="form-control mb-2"
//                     placeholder="Write your review..."
//                     value={newReview.comment}
//                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//                   ></textarea>
//                   <button className="btn btn-primary" onClick={handleReviewSubmit}>
//                     {editingReview ? "Update Review" : "Submit Review"}
//                   </button>
//                 </div>
//               </Col>
//             </Row>
//           </Container>
//         </section>
//         <Footer />
//       </Fragment>
//     </div>
//   );
// };

// export default ProductDetails;


import { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import "./product-details.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { FaRupeeSign } from "react-icons/fa";
import axios from "axios";

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.pathname.split("/").pop();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(4); // Default to 4
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [editingReview, setEditingReview] = useState(null);
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`https://localhost:7026/api/Products/GetProductById/${id}`);
      const data = await res.json();
      if (data.success) setProduct(data);
      else toast.error("Failed to fetch product");
    } catch (error) {
      toast.error("Error fetching product");
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`https://localhost:7026/api/Review/GetReviews/${id}`);
      if (res.data.success) {
        const fetchedReviews = res.data.data;
        setReviews(fetchedReviews);
        if (fetchedReviews.length > 0) {
          const total = fetchedReviews.reduce((sum, r) => sum + r.rating, 0);
          setAverageRating(total / fetchedReviews.length);
        } else {
          setAverageRating(4); // Default if no reviews
        }
      } else {
        setReviews([]);
        setAverageRating(4);
      }
    } catch (error) {
      console.error(error);
      setAverageRating(4);
    }
  };

  const handleAddToCart = async () => {
    try {
      const payload = {
        userId: parseInt(userId),
        productId: product.productId,
        quantity,
      };
      const res = await axios.post("https://localhost:7026/api/Cart/AddToCart", payload);
      if (res.data.success) toast.success("Product has been added to cart!");
      else toast.warning(res.data.message);
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBack = () => navigate(-1);

  const handleReviewSubmit = async () => {
    if (!newReview.rating || !newReview.comment) return toast.warning("Enter rating and comment");

    const dto = {
      userId: parseInt(userId),
      productId: parseInt(id),
      rating: newReview.rating,
      comment: newReview.comment,
    };

    try {
      if (editingReview) {
        await axios.put(`https://localhost:7026/api/Review/UpdateReview/${editingReview.reviewId}`, dto);
        toast.success("Review updated");
      } else {
        await axios.post("https://localhost:7026/api/Review/AddReview", dto);
        toast.success("Review added");
      }
      setNewReview({ rating: 0, comment: "" });
      setEditingReview(null);
      fetchReviews();
    } catch {
      toast.error("Error submitting review");
    }
  };

  const handleEdit = (review) => {
    setNewReview({ rating: review.rating, comment: review.comment });
    setEditingReview(review);
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`https://localhost:7026/api/Review/DeleteReview/${reviewId}`);
      toast.success("Review deleted");
      fetchReviews();
    } catch {
      toast.error("Failed to delete review");
    }
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
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa fa-star${i < Math.round(averageRating) ? "" : "-o"}`}
                      ></i>
                    ))}
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
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <div className="d-flex gap-2 mt-3">
                  <button
                    aria-label="Add"
                    type="submit"
                    className="add"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    style={{
                      opacity: product.stock === 0 ? 0.5 : 1,
                      cursor: product.stock === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    Add To Cart
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleBack}>
                    Back
                  </button>
                </div>
              </Col>
            </Row>

            {/* Review Section */}
            <Row className="mt-5">
              <Col md={12}>
                <h4>Reviews</h4>
                {reviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.reviewId} className="review-box mb-3 p-2 border rounded">
                      <div className="d-flex justify-content-between">
                        <strong>{review.user.name}</strong>
                        <span style={{ fontSize: "14px", color: "gray" }}>
                          {new Date(review.reviewDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa fa-star${i < review.rating ? "" : "-o"}`}
                            style={{ color: "#fbc02d", marginRight: 2 }}
                          ></i>
                        ))}
                      </div>
                      <p className="mb-1">{review.comment}</p>
                      {parseInt(userId) === review.userId && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(review)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(review.reviewId)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}

                <div className="mt-4">
                  <h5>{editingReview ? "Edit Your Review" : "Add a Review"}</h5>
                  <div className="mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fa fa-star${star <= newReview.rating ? "" : "-o"}`}
                        style={{ color: "#fbc02d", fontSize: "20px", cursor: "pointer" }}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      ></i>
                    ))}
                  </div>
                  <textarea
                    rows="3"
                    className="form-control mb-2"
                    placeholder="Write your review..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  ></textarea>
                  <button className="btn btn-primary" onClick={handleReviewSubmit}>
                    {editingReview ? "Update Review" : "Submit Review"}
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
