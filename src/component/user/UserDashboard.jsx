import { Fragment } from "react";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Section from "./Section";
import SliderHome from "./Slider";
import { discoutProducts } from "../../utils/product"

const UserDashBoard = () => {
    return (
        <div>
            <Fragment>
                <NavBar />
                <SliderHome/>
                <Section
                    title = "Big Discount"
                    bgColor ="ff0000"
                    productItems = {discoutProducts}
                />
                <Footer />
            </Fragment>
        </div>
    )
}
export default UserDashBoard;
