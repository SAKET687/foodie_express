/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import "./Orders.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";

const Orders = () => {
	const { url, token } = useContext(StoreContext);
	const [orders, setOrders] = useState([]);

	const fetchOrder = async () => {
		try {
			const response = await axios.post(
				url + "/api/order/get",
				{},
				{
					headers: { token },
				}
			);
			setOrders(response.data.data);
			console.log(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (token) {
			fetchOrder();
		}
	}, [token]);

	return (
		<>
			<div className="orders">
				<h2>My Orders</h2>
				<hr />
				<div className="order-container">
					{orders.map((order, index) => (
						<div key={index} className="order-display">
							<img src={assets.parcel_icon} alt="Parcel Icon" />
							<p>
								{order.items.map((item, index) => (
									<span key={index}>
										{item.name} x {item.quantity}
										{index < order.items.length - 1
											? ", "
											: ""}
									</span>
								))}
							</p>
							<p>
								₹ {order.amount}.00
								<br />
								{order.payment_type === "Online"
									? "Paid Online"
									: "Cash on Delivery"}
							</p>
							<p>Items: {order.items.length} </p>
							<p>
								<span>&#x25cf;</span>
								<b> {order.status}</b>
							</p>
							<button
								onClick={() => {
									fetchOrder();
								}}
							>
								Track Order
							</button>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Orders;
