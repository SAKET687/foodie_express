/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrder = () => {
	const {
		cartAmount,
		setCartAmount,
		getTotalCartAmount,
		checkPromoCode,
		token,
		food_list,
		url,
		cartItems,
	} = useContext(StoreContext);
	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		houseNo: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
		phone: "",
	});
	const [paymentMethod, setPaymentMethod] = useState("");

	const onChangeHandler = (event) => {
		const name = event.target.id;
		const value = event.target.value;
		setData((data) => ({ ...data, [name]: value }));
	};

	const placeOrderUsingRazorpay = async () => {
		let orderItems = [];
		food_list.forEach((key) => {
			if (cartItems[key._id] > 0) {
				let iteminfo = key;
				iteminfo["quantity"] = cartItems[key._id];
				orderItems.push(iteminfo);
			}
		});

		let orderData = {
			address: data,
			items: orderItems,
			amount: cartAmount,
		};

		try {
			let response = await axios.post(
				url + "/api/order/place-using-razorpay",
				orderData,
				{
					headers: { token },
				}
			);

			console.log("Razorpay: ", response);

			if (response.data.success) {
				const {
					key_id,
					amount,
					currency,
					name,
					description,
					razorpayOrderId,
					prefill,
					notes,
					orderId,
				} = response.data;

				const options = {
					key: key_id,
					amount,
					currency,
					name,
					description,
					order_id: razorpayOrderId,
					handler: async function (response) {
						if (response.razorpay_payment_id) {
							toast.success(
								"Awesome! Your payment was successful. We're now verifying it...."
							);
							await delay(5000);
							window.location.replace(
								`/verify?success=true&orderId=${orderId}`
							);
						} else {
							toast.error("Payment failed");
							await delay(5000);
						}
					},
					prefill,
					notes,
					theme: {
						color: "#9D41FE",
					},
				};

				const rzp = new window.Razorpay(options);
				rzp.open();
			} else {
				toast.error("Error in payment/placing order, try again.");
				await delay(5000);
			}
		} catch (error) {
			toast.error("An error occurred: " + error.message);
			await delay(5000);
		}
	};

	const placeOrderUsingStripe = async () => {
		let orderItems = [];
		food_list.forEach((key) => {
			if (cartItems[key._id] > 0) {
				let iteminfo = key;
				iteminfo["quantity"] = cartItems[key._id];
				orderItems.push(iteminfo);
			}
		});
		let orderData = {
			address: data,
			items: orderItems,
			amount: cartAmount,
		};

		try {
			let response = await axios.post(
				url + "/api/order/place-using-stripe",
				orderData,
				{
					headers: { token, promo_code: checkPromoCode },
				}
			);
			if (response.data.success) {
				const { session_url } = response.data;
				toast.success(
					"Awesome! Your payment was successful. We're now verifying it."
				);
				await delay(5000);
				window.location.replace(session_url);
			} else {
				toast.error("Error in payment/placing order, try again.");
				await delay(5000);
			}
		} catch (error) {
			toast.error("An error occurred: " + error.message);
			await delay(5000);
		}
	};

	const placeOrderUsingCOD = async () => {
		let orderItems = [];
		food_list.forEach((key) => {
			if (cartItems[key._id] > 0) {
				let iteminfo = key;
				iteminfo["quantity"] = cartItems[key._id];
				orderItems.push(iteminfo);
			}
		});
		let orderData = {
			address: data,
			items: orderItems,
			amount: cartAmount,
		};

		try {
			let response = await axios.post(
				url + "/api/order/place-using-cod",
				orderData,
				{
					headers: { token },
				}
			);
			if (response.data.success) {
				toast.success(
					"Great news! Your order has been placed successfully. Cash on delivery at your doorstep."
				);
				await delay(5000);
				const { session_url } = response.data;
				window.location.replace(session_url);
			} else {
				toast.error("Error in payment/placing order, try again.");
				await delay(5000);
			}
		} catch (error) {
			toast.error("An error occurred: " + error.message);
			await delay(5000);
		}
	};

	const placeOrder = (event) => {
		event.preventDefault();
		if (paymentMethod === "Razorpay") {
			placeOrderUsingRazorpay();
		} else if (paymentMethod === "Stripe") {
			placeOrderUsingStripe();
		} else if (paymentMethod === "COD") {
			placeOrderUsingCOD();
		} else {
			toast.warn("Please select a payment method.");
		}
	};

	return (
		<>
			<ToastContainer />
			<form className="place-order" onSubmit={placeOrder}>
				<div className="place-order-left">
					<p className="title">Delivery Information</p>
					<div className="multi-fields">
						<input
							value={data.firstName}
							onChange={onChangeHandler}
							required
							type="text"
							id="firstName"
							placeholder="Enter Your First Name"
						/>
						<input
							value={data.lastName}
							onChange={onChangeHandler}
							type="text"
							id="lastName"
							placeholder="Enter Your Last Name (Optional)"
						/>
					</div>
					<input
						value={data.email}
						onChange={onChangeHandler}
						required
						type="email"
						id="email"
						placeholder="Enter Your Email Id"
					/>
					<input
						value={data.houseNo}
						onChange={onChangeHandler}
						required
						type="text"
						id="houseNo"
						placeholder="Enter House No. / Street"
					/>
					<div className="multi-fields">
						<input
							value={data.city}
							onChange={onChangeHandler}
							required
							type="text"
							id="city"
							placeholder="Enter City"
						/>
						<input
							value={data.state}
							onChange={onChangeHandler}
							required
							type="text"
							id="state"
							placeholder="Enter State"
						/>
					</div>
					<div className="multi-fields">
						<input
							value={data.zipCode}
							onChange={onChangeHandler}
							required
							type="text"
							id="zipCode"
							placeholder="Enter ZIP Code"
						/>
						<input
							value={data.country}
							onChange={onChangeHandler}
							required
							type="text"
							id="country"
							placeholder="Enter Country"
						/>
					</div>
					<input
						value={data.phone}
						onChange={onChangeHandler}
						required
						type="tel"
						id="phone"
						placeholder="Enter Your Phone Number"
					/>
				</div>
				<div className="place-order-right">
					<div className="cart-total">
						<h2>Cart Total:</h2>
						<div className="unnamed">
							<div className="cart-total-details">
								<p>Subtotal</p>
								<p>₹{getTotalCartAmount()}</p>
							</div>
							<hr />
							<div className="cart-total-details">
								<p>Delivery Fee</p>
								<p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p>
							</div>
							<hr />
							{checkPromoCode ? (
								<>
									<div className="cart-total-details coupon">
										<p>Coupon Saving</p>
										<p> - ₹75</p>
									</div>
									<hr />
								</>
							) : null}
							<div className="cart-total-details">
								<b>Total</b>
								<b>
									₹
									{getTotalCartAmount() === 0
										? 0
										: cartAmount}
								</b>
							</div>
							<br />
							<strong>
								!! Coupons are not applicable for Stripe Payment
								Gateway !!
							</strong>
						</div>
						<div className="btn-online">
							<div className="button-right">
								<button
									type="submit"
									onClick={() => setPaymentMethod("Stripe")}
									className="btn-img-str"
								>
									<p>Checkout with</p>
									<img
										src={assets.stripe}
										alt="stripe-button-checkout"
									/>
								</button>
							</div>
							<div className="button-right">
								<button
									type="submit"
									onClick={() => setPaymentMethod("Razorpay")}
									className="btn-img-raz"
								>
									<p>Checkout with</p>
									{"  "}
									<img
										src={assets.razorpay}
										alt="razorpay-button-checkout"
									/>
								</button>
							</div>
						</div>
						<div className="btn-online">
							<div className="button-right">
								<button
									type="submit"
									onClick={() => setPaymentMethod("COD")}
									className="btn-img-raz"
								>
									Cash on Delivery
								</button>
							</div>
						</div>
					</div>
				</div>
			</form>
		</>
	);
};

export default PlaceOrder;
