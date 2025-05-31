import { Fragment, useEffect, useState } from "react";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Section from "./Section";
import SliderHome from "./Slider";
// import { discoutProducts } from "../../utils/product"

const UserDashBoard = () => {
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
                    setProducts(data.products);
                    // console.log("data is :::>",data.products);
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
                <SliderHome/>
                <Section
                    title = "Big Discount"
                    bgColor ="ff0000"
                    productItems = {products}
                />
                <Footer />
            </Fragment>
        </div>
    )
}
export default UserDashBoard;

