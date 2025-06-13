import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "./Banner/Banner";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import FilterSelect from "./FilterSelect";
import SearchBar from "./SeachBar/SearchBar";
import ProductCard from "./ProductCard/ProductCard";
import SortSelect from "./SeachBar/SortSelect";
import { toast } from "react-toastify";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [search, setSearch] = useState("");

  const fetchProducts = () => {
    let url = "";

    // If search is active, prioritize search API
    if (search.trim()) {
      url = `https://localhost:7026/api/Products/Search?keyword=${encodeURIComponent(search)}`;
    } else {
      const queryParams = new URLSearchParams({
        category,
        brand,
        sortOrder,
      });
      url = `https://localhost:7026/api/Products/GetFilteredProducts?${queryParams.toString()}`;
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

  // Run when any filter changes
  useEffect(() => {
    fetchProducts();
  }, [category, brand, sortOrder, search]);

  return (
    <Fragment>
      <NavBar />
      <Banner title="products" />
      <Container className="py-4">
        <Row>
          <Col>
            <div className="p-3">
              <h5 className="pb-3">Filters</h5>
              <FilterSelect
                onCategoryChange={(value) => setCategory(value)}
                onBrandChange={(value) => setBrand(value)}
              />
              <div className="mt-3">
                <SortSelect onSortChange={(value) => setSortOrder(value)} />
              </div>
            </div>
          </Col>
          <Col md={9}>
            <SearchBar onSearch={(value) => setSearch(value)} />
            <section>
              <Container>
                <Row className="justify-content-start mt-4">
                  {products.map((productItem) => (
                    <ProductCard
                      key={productItem.productId}
                      title="Products"
                      productItem={productItem}
                    />
                  ))}
                </Row>
              </Container>
            </section>
          </Col>
        </Row>
      </Container>
      <Footer />
    </Fragment>
  );
};

export default Shop;
