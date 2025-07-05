/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Home from "./Pages/Home/Home";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import Footer from "./Components/Footer/Footer";
import LoginPopup from "./Components/LoginPopup/LoginPopup";
import Verify from "./Pages/Verify/Verify";
import Orders from "./Pages/Orders/Orders";
import { useContext } from "react";
import { StoreContext } from "./Context/StoreContext";
import Search from "./Pages/Search/Search";

const App = () => {
	const [showLogin, setShowLogin] = useState(false);
	const { token } = useContext(StoreContext);

	return (
		<>
			<ToastContainer />
			{showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
			<div className="app">
				<Navbar setShowLogin={setShowLogin} />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="*" element={<Home />} />
					<Route path="/home" element={<Home />} />
					<Route path="/search" element={<Search />} />
					<Route path={`/${token}/cart`} element={<Cart />} />
					<Route path={`/${token}/order-place`} element={<PlaceOrder />} />
					<Route path={`/verify`} element={<Verify />} />
					<Route path={`/${token}/orders`} element={<Orders />} />
				</Routes>
			</div>
			<Footer />
		</>
	);
};

export default App;
