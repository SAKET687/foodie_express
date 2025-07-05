/* eslint-disable no-unused-vars */
import React from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets.js";

const Navbar = () => {
	return (
		<>
			<div className="navbar">
				<img
					src={assets.logo}
					alt="admin-panel-logo"
					className="logo"
				/>
				<img
					src={assets.profile_image}
					alt="prof-img"
					className="profile"
				/>
			</div>
		</>
	);
};

export default Navbar;
