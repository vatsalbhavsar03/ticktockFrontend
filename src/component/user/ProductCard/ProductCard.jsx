import { Col } from "react-bootstrap";
import "./product-card.css";
import { useNavigate } from "react-router-dom";
import { FaRupeeSign } from "react-icons/fa";
import { toast } from "react-toastify";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../app/features/cart/cartSlice";


const ProductCard = ({ title, productItem }) => {

  
  // const dispatch = useDispatch();
  const router = useNavigate();

  const handelClick = () => {
    // router(`/shop/${productItem.id}`);
    router(`/user/productdetail/${productItem.productId}`);
    
  };
  // const handelAdd = () => {
  //   dispatch(addToCart({ product: productItem, num: 1 }));
  //   toast.success("Product has been added to cart!");
  // };
  return (
    <Col md={3} sm={5} xs={10} className="product mtop">
      {/* {title === "Big Discount" ? (
        <span className="discount">{productItem.discount}% Off</span>
      ) : null} */}
      <img
        onClick={() => handelClick()}
        src={`https://localhost:7026${productItem.imageUrl}`}
        alt={productItem.name}
      />

      <div className="product-like">
        <i className="fa fa-heart-o"></i>
      </div>
      <div className="product-details">
        <h3 onClick={() => handelClick()}>{productItem.name}</h3>
        {/* <div className="rate">
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
        </div> */}
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
