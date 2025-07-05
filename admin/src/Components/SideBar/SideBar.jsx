/* eslint-disable no-unused-vars */
import React from "react";
import "./SideBar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const SideBar = () => {
	return (
		<>
			<div className="sidebar">
				<div className="sidebar-options">
					<NavLink to="/add" className="sidebar-option">
						<img src={assets.add_icon} alt="add" />
						<p>Add Items</p>
					</NavLink>
					<NavLink to="/list" className="sidebar-option">
						<img src={assets.order_icon} alt="order-icon" />
						<p>List Items</p>
					</NavLink>
					<NavLink to="/order" className="sidebar-option">
						<img src={assets.order_icon} alt="order-icon" />
						<p>Orders</p>
					</NavLink>
				</div>
			</div>
		</>
	);
};

export default SideBar;
