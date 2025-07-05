/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import "./Order.css";
import { assets } from "../../../../Frontend/src/assets/assets";

const Order = ({ url }) => {
	const [orders, setOrders] = useState([]);

	const fetchOrders = async () => {
		try {
			const response = await axios.post(url + "/api/order/orders", {});
			setOrders(response.data.data);
			console.log(response.data.data);
		} catch (error) {
			console.log("Error to fetch order details.");
			console.log(error);
		}
	};

	const statusChangeHandler = async (event, orderId) => {
		try {
			const response = await axios.post(url + "/api/order/update", {
				orderId,
				order_status: event.target.value,
			});
			if (response.data.success) {
				await fetchOrders();
			}
		} catch (error) {
			console.log("Error to update order status.");
			console.log(error);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	return (
		<>
			<div className="order">
				<h2>Orders</h2>
				{orders.map((order, index) => (
					<div key={index} className="order-item">
						<img src={assets.parcel_icon} alt="parcel-icon" />
						<div>
							<div className="order-item-food">
								{order.items.map((item, index) => (
									<span key={index}>
										{item.name + " x " + item.quantity}
										{index !== order.items.length - 1 &&
											", "}
									</span>
								))}
							</div>
							<p className="order-item-name">
								{`${
									order.address.firstName +
									" " +
									order.address.lastName
								}`}
							</p>
							<div className="order-item-address">
								<p>{order.address.houseNo + ", "}</p>
								<p>
									{order.address.city +
										", " +
										order.address.state +
										", " +
										order.address.zipCode +
										", " +
										order.address.country}
								</p>
							</div>
							<div className="order-item-number">
								<p>{order.address.phone}</p>
								<p>{order.address.email}</p>
							</div>
						</div>
						<p>Items: {order.items.length}</p>
						<p>Order Amount: ₹ {order.amount}</p>
						<select
							onChange={(event) => {
								statusChangeHandler(event, order._id);
							}}
							value={order.status}
						>
							<option value="Order Placed">Order Placed</option>
							<option value="Order Accepted">
								Order Accepted
							</option>
							<option value="Food Processing">
								Food Processing
							</option>
							<option value="Out for Delivery">
								Out for Delivery
							</option>
							<option value="Delivered">Delivered</option>
						</select>
					</div>
				))}
			</div>
		</>
	);
};

export default Order;
