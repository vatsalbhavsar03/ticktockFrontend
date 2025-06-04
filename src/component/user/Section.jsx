import { Container, Row } from "react-bootstrap";
import ProductCard from "./ProductCard/ProductCard";

const Section = ({ title, bgColor, productItems }) => {
  return (
    <section style={{ backgroundColor: bgColor }}>
      <Container>
        <div className="heading">
          <h1>{title}</h1>
        </div>
        <Row className="justify-content-center">
          {productItems.map((productItem) => (
            <ProductCard
              key={productItem.productId}
              title={title}
              productItem={productItem}
              // isWishlisted={wishlistIds.includes(productItem.productId)}
              // setWishlistIds={setWishlistIds}
              // userId={userId}
            />
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Section;
