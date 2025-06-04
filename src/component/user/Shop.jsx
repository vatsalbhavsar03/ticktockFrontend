import { Fragment, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Banner from "./Banner/Banner";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import FilterSelect from "./FilterSelect";
import SearchBar from "./SeachBar/SearchBar";
import Section from "./Section.jsx";
const Shop = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("https://localhost:7026/api/Products/GetProducts")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    // console.log(data.products)
                    setProducts(data.products);
                } else {
                    toast.error("Failed to load products");
                }
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                toast.error("An error occurred while fetching products");
            });
    }, []);
    return (
        <div>
            <Fragment>
                <NavBar />
                <Banner title="products" />
                <section className="filter-bar">
                    <Container className="filter-bar-contianer">
                        <Row className="justify-content-center">
                            <Col md={4}>
                                <FilterSelect />
                            </Col>
                            <Col md={8}>
                                <SearchBar />
                            </Col>
                        </Row>
                    </Container>
                    <Container>
                        <Section
                            bgColor="ff0000"
                            productItems={products}
                        />
                    </Container>
                </section>
                <Footer />
            </Fragment>
        </div>
    );
}

export default Shop;