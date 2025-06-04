import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRupeeSign } from "react-icons/fa";

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
          fetchWishlist(); // Refresh list
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

  if (loading) return <div style={{ padding: "20px" }}>Loading your wishlist...</div>;
  if (wishlistProducts.length === 0) return <div style={{ padding: "20px" }}>Your wishlist is empty.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px", color: "#0f3460" }}>Your Wishlist</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {wishlistProducts.map((item) => (
          <div
            key={item.wishlistId || item.product.productId}
            style={{
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              padding: "15px",
              width: "230px",
              transition: "transform 0.3s",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <img
              src={`https://localhost:7026${item.product.imageUrl}`}
              alt={item.product.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "contain",
                borderRadius: "6px",
                marginBottom: "10px",
              }}
              onClick={() => (window.location.href = `/user/productdetail/${item.product.productId}`)}
            />
            <h4
              style={{
                fontSize: "16px",
                fontWeight: "500",
                color: "#333",
                marginBottom: "8px",
              }}
            >
              {item.product.name}
            </h4>
            <p style={{ display: "flex", alignItems: "center", fontWeight: "bold", color: "#0f3460" }}>
              <FaRupeeSign style={{ marginRight: "4px" }} />
              {item.product.price}
            </p>
            <p style={{ fontSize: "12px", color: "#666" }}>
              Added on: {new Date(item.wishlistDate).toLocaleDateString()}
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button
                onClick={() => addToCart(item.product)}
                style={{
                  backgroundColor: "#0f3460",
                  color: "#fff",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item.product.productId)}
                style={{
                  backgroundColor: "#fff",
                  color: "red",
                  border: "1px solid red",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
