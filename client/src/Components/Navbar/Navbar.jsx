import { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
	const [Menu, SetMenu] = useState("home");
	const { cartAmount, token, setToken } = useContext(StoreContext);

	const navigate = useNavigate();

	const logout = () => {
		toast.success("User logged out successfully.");
		localStorage.removeItem("token");
		setToken("");
		navigate("/home");
	};

	return (
		<div className="navbar">
			<Link to="/">
				<img
					src={assets.latest_logo}
					className="logo"
					alt="Foodie Express LOGO"
				/>
			</Link>
			<ul className="navbar-menu">
				<Link
					to="/"
					onClick={() => SetMenu("home")}
					className={Menu === "home" ? "active" : " "}
				>
					Home
				</Link>
				<a
					href="/#explore-menu"
					onClick={() => SetMenu("menu")}
					className={Menu === "menu" ? "active" : " "}
				>
					Menu
				</a>
				<a
					href="/#app-download"
					onClick={() => SetMenu("mobile-app")}
					className={Menu === "mobile-app" ? "active" : " "}
				>
					Mobile App
				</a>
				<a
					href="#footer"
					onClick={() => SetMenu("contact-us")}
					className={Menu === "contact-us" ? "active" : " "}
				>
					Contact Us
				</a>
			</ul>
			<div className="navbar-right">
				<Link to="/search">
					<img src={assets.search_icon} alt="search icon" />
				</Link>
				<div className="navbar-cart">
					<Link to={`/cart`}>
						<img src={assets.basket_icon} alt="cart icon" />
					</Link>
					<div className={cartAmount === 0 ? "none" : "dot"}></div> 
				</div>
				{!token ? (
					<button onClick={() => setShowLogin(true)}>Sign in</button>
				) : (
					<>
						<div className="navbar-profile">
							<img
								src={assets.profile_icon}
								alt="profile-icon"
								className="profile-icon"
							/>
							<ul className="navbar-profile-dropdown">
								<li>
									<img src={assets.bag_icon} alt="bag-icon" />{" "}
									<Link to={`/orders`}>Orders</Link>
								</li>
								<hr />
								<li>
									<img
										src={assets.logout_icon}
										alt="logout-icon"
									/>{" "}
									<p onClick={logout}>Logout</p>
								</li>
							</ul>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Navbar;
