import { Fragment } from "react";
import NavBar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SliderHome from "./Slider";

const UserDashBoard = () => {
    return (
        <div>
            <Fragment>
                <NavBar />
                    <SliderHome/>
                <Footer />
            </Fragment>
        </div>
    )
}
export default UserDashBoard;
