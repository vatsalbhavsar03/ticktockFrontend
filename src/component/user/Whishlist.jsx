import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
  }, [userId]);

  if (loading) {
    return <div>Loading your wishlist...</div>;
  }

  if (wishlistProducts.length === 0) {
    return <div>Your wishlist is empty.</div>;
  }

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      <div className="wishlist-products" style={{ display: "flex", flexWrap: "wrap" }}>
        {wishlistProducts.map((item) => (
          <div
            key={item.wishlistId || item.id || item.product.productId}
            className="wishlist-item"
            style={{
              border: "1px solid #ddd",
              margin: "10px",
              padding: "10px",
              width: "200px",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={`https://localhost:7026${item.product.imageUrl}`}
              alt={item.product.name}
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "6px" }}
            />
            <h4>{item.product.name}</h4>
            <p>Price: ₹{item.product.price}</p>
            <p>Added on: {new Date(item.wishlistDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
