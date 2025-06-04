import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign, FaHeart, FaRegHeart } from "react-icons/fa";  // Import both heart icons
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";

const ProductCard = ({ title, productItem }) => {
  const router = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`https://localhost:7026/api/Wishlist/GetWishlist/${userId}`);
        if (res.data.success) {
          const wishlistedProductIds = res.data.data.map(item => item.product.productId);
          setIsWishlisted(wishlistedProductIds.includes(productItem.productId));
        }
      } catch (error) {
        console.error("Error loading wishlist", error);
      }
    };

    if (userId) fetchWishlist();
  }, [productItem.productId, userId]);

  const toggleWishlist = async () => {
    const dto = {
      userId: parseInt(userId),
      productId: productItem.productId,
    };

    try {
      if (!isWishlisted) {
        const res = await axios.post("https://localhost:7026/api/Wishlist/AddToWishlist", dto);
        if (res.data.success) {
          toast.success("Added to wishlist");
          setIsWishlisted(true);
        } else if (res.data.message === "Product already in wishlist") {
          toast.warning(res.data.message);
          setIsWishlisted(true);
        }
      } else {
        const res = await axios.delete("https://localhost:7026/api/Wishlist/RemoveFromWishlist", { data: dto });
        if (res.data.success) {
          toast.success("Removed from wishlist");
          setIsWishlisted(false);
        }
      }
    } catch (err) {
      console.error("Wishlist toggle error", err);
    }
  };

  const handleClick = () => {
    router(`/user/productdetail/${productItem.productId}`);
  };

  return (
    <Col md={3} sm={5} xs={10} className="product mtop">
      <img
        onClick={handleClick}
        src={`https://localhost:7026${productItem.imageUrl}`}
        alt={productItem.name}
        style={{ cursor: "pointer" }}
      />

      {/* Heart icon with outline/fill */}
      <div className="product-like" onClick={toggleWishlist} style={{ cursor: "pointer" }}>
        {isWishlisted ? (
          <FaHeart color="red" size={24} />
        ) : (
          <FaRegHeart color="black" size={24} />
        )}
      </div>

      <div className="product-details">
        <h3 onClick={handleClick} style={{ cursor: "pointer" }}>{productItem.name}</h3>
        <div className="price">
          <h4 className="d-flex align-items-center"><FaRupeeSign />{productItem.price}</h4>
          <button
            aria-label="Add"
            type="submit"
            className="add"
            onClick={() => handelAdd(productItem)}
          >
            <i className="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
