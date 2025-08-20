import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign, FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { useState, useEffect } from "react";

const ProductCard = ({ title, productItem }) => {
  const router = useNavigate();
  const userId = localStorage.getItem("UserId");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // ✅ Fetch wishlist status on mount
  useEffect(() => {
    if (userId) {
      axios
        .get(`https://localhost:7026/api/Wishlist/GetWishlist/${userId}`)
        .then((res) => {
          if (res.data.success) {
            const match = res.data.data.find(
              (item) => item.product.productId === productItem.productId
            );
            setIsWishlisted(!!match);
          }
        })
        .catch((err) => {
          console.error("Wishlist fetch error:", err);
        });
    }
  }, [userId, productItem.productId]);

  const addToCart = (product) => {
    const payload = {
      userId: parseInt(userId),
      productId: product.productId,
      quantity: 1,
    };

    axios
      .post("https://localhost:7026/api/Cart/AddToCart", payload)
      .then((res) => {
        if (res.data.success) {
          toast.success("Item added to cart");
        } else {
          toast.warning(res.data.message);
        }
      })
      .catch(() => toast.error("Failed to add to cart"));
  };

  const toggleWishlist = async () => {
    const dto = {
      userId: parseInt(userId),
      productId: productItem.productId,
    };

    try {
      if (isWishlisted) {
        const res = await axios.delete("https://localhost:7026/api/Wishlist/RemoveFromWishlist", {
          data: dto,
        });
        if (res.data.success) {
          toast.success("Removed from wishlist");
          setIsWishlisted(false);
        } else {
          toast.warning(res.data.message || "Failed to remove from wishlist");
        }
      } else {
        const res = await axios.post("https://localhost:7026/api/Wishlist/AddToWishlist", dto);
        if (res.data.success) {
          toast.success("Added to wishlist");
          setIsWishlisted(true);
        } else {
          toast.warning(res.data.message || "Failed to add to wishlist");
        }
      }
    } catch (err) {
      toast.error("Something went wrong with wishlist");
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
        onError={(e) => {
          e.target.src = "/fallback-image.png";
        }}
        style={{ cursor: "pointer" }}
      />

      <div className="product-like" onClick={toggleWishlist} style={{ cursor: "pointer" }}>
        {isWishlisted ? (
          <FaHeart color="red" size={24} />
        ) : (
          <FaRegHeart color="black" size={24} />
        )}
      </div>

      <div className="product-details">
        <h3 onClick={handleClick} style={{ cursor: "pointer" }}>
          {productItem.name}
        </h3>

        {productItem.stock === 0 && (
          <p className="text-red-500 text-sm mt-1 font-semibold">Out of Stock</p>
        )}

        <div className="price">
          <h4 className="d-flex align-items-center">
            <FaRupeeSign />
            {productItem.price}
          </h4>
          <button
            className="addtoCart"
            onClick={() => addToCart(productItem)}
            disabled={productItem.stock === 0}
            style={{
              opacity: productItem.stock === 0 ? 0.5 : 1,
              cursor: productItem.stock === 0 ? "not-allowed" : "pointer",
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Col>
  );
};

export default ProductCard;
