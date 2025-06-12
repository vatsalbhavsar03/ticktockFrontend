import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "./Banner/Banner";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import FilterSelect from "./FilterSelect";
import SearchBar from "./SeachBar/SearchBar";
import Section from "./Section.jsx";
import { toast } from "react-toastify";

const Shop = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = (search = "") => {
    let url = "https://localhost:7026/api/Products/GetProducts";
    if (search.trim() !== "") {
      url = `https://localhost:7026/api/Products/Search?keyword=${encodeURIComponent(search)}`;
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch products");
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        } else {
          toast.error("Failed to load products");
        }
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        toast.error("An error occurred while fetching products");
      });
  };

  useEffect(() => {
    fetchProducts(); // Load all products initially
  }, []);

  return (
    <Fragment>
      <NavBar />
      <Banner title="products" />
      <Container className="py-4">
        <Row>
          <Col>
            <div className="p-3 ">
              <h5 className="pb-3">Filters</h5>
              <FilterSelect />
            </div>
          </Col>
          <Col md={9}>
            <SearchBar onSearch={fetchProducts} />
            <Section productItems={products}  />
          </Col>
        </Row>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default Shop;
