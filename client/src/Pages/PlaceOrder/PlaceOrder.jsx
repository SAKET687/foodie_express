
import { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlaceOrder = () => {
	const {
		token,
		food_list,
		url,
		cartItems,
		finalAmount,
		cartAmount,
		checkPromoCode,
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
		const { id, value } = event.target;
		setData((prevData) => ({ ...prevData, [id]: value }));
	};

	const prepareOrderData = () => {
		let orderItems = [];

		food_list.forEach((item) => {
			if (cartItems[item._id] > 0) {
				orderItems.push({
					...item,
					quantity: cartItems[item._id],
				});
			}
		});

		return {
			address: data,
			items: orderItems,
			amount: finalAmount,
		};
	};

	const placeOrderUsingRazorpay = async () => {
		try {
			let response = await axios.post(
				url + "/api/order/place-using-razorpay",
				prepareOrderData(),
				{ headers: { token } }
			);

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
							toast.success("Payment successful! Verifying...");
							await delay(5000);
							window.location.replace(`/verify?success=true&orderId=${orderId}`);
						} else {
							toast.error("Payment failed.");
						}
					},
					prefill,
					notes,
					theme: { color: "#9D41FE" },
				};

				const rzp = new window.Razorpay(options);
				rzp.open();
			} else {
				toast.error("Error placing order with Razorpay.");
			}
		} catch (error) {
			toast.error("Razorpay error: " + error.message);
		}
	};

	const placeOrderUsingStripe = async () => {
		try {
			const response = await axios.post(
				url + "/api/order/place-using-stripe",
				prepareOrderData(),
				{ headers: { token, promo_code: checkPromoCode } }
			);

			if (response.data.success) {
				toast.success("Redirecting to Stripe...");
				await delay(3000);
				window.location.replace(response.data.session_url);
			} else {
				toast.error("Error placing order with Stripe.");
			}
		} catch (error) {
			toast.error("Stripe error: " + error.message);
		}
	};

	const placeOrderUsingCOD = async () => {
		try {
			const response = await axios.post(
				url + "/api/order/place-using-cod",
				prepareOrderData(),
				{ headers: { token } }
			);

			if (response.data.success) {
				toast.success("Order placed with Cash on Delivery.");
				await delay(3000);
				window.location.replace(response.data.session_url);
			} else {
				toast.error("COD order failed.");
			}
		} catch (error) {
			toast.error("COD error: " + error.message);
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
						<input id="firstName" value={data.firstName} onChange={onChangeHandler} required type="text" placeholder="First Name" />
						<input id="lastName" value={data.lastName} onChange={onChangeHandler} type="text" placeholder="Last Name (Optional)" />
					</div>
					<input id="email" value={data.email} onChange={onChangeHandler} required type="email" placeholder="Email" />
					<input id="houseNo" value={data.houseNo} onChange={onChangeHandler} required type="text" placeholder="House No. / Street" />
					<div className="multi-fields">
						<input id="city" value={data.city} onChange={onChangeHandler} required type="text" placeholder="City" />
						<input id="state" value={data.state} onChange={onChangeHandler} required type="text" placeholder="State" />
					</div>
					<div className="multi-fields">
						<input id="zipCode" value={data.zipCode} onChange={onChangeHandler} required type="text" placeholder="ZIP Code" />
						<input id="country" value={data.country} onChange={onChangeHandler} required type="text" placeholder="Country" />
					</div>
					<input id="phone" value={data.phone} onChange={onChangeHandler} required type="tel" placeholder="Phone Number" />
				</div>

				<div className="place-order-right">
					<div className="cart-total">
						<h2>Cart Total:</h2>
						<div className="cart-total-details">
							<p>Subtotal</p>
							<p>₹{cartAmount}</p>
						</div>
						<hr />
						<div className="cart-total-details">
							<p>Delivery Fee</p>
							<p>₹{cartAmount === 0 ? 0 : 50}</p>
						</div>
						<hr />
						{checkPromoCode && (
							<>
								<div className="cart-total-details coupon">
									<p>Coupon Saving</p>
									<p>- ₹75</p>
								</div>
								<hr />
							</>
						)}
						<div className="cart-total-details">
							<b>Total</b>
							<b>₹{cartAmount === 0 ? 0 : finalAmount}</b>
						</div>
						<br />
						<strong>!! Coupons are not applicable for Stripe Payment Gateway !!</strong>
						<div className="btn-online">
							<div className="button-right">
								<button type="submit" onClick={() => setPaymentMethod("Stripe")} className="btn-img-str">
									<p>Checkout with</p>
									<img src={assets.stripe} alt="Stripe" />
								</button>
							</div>
							<div className="button-right">
								<button type="submit" onClick={() => setPaymentMethod("Razorpay")} className="btn-img-raz">
									<p>Checkout with</p>
									<img src={assets.razorpay} alt="Razorpay" />
								</button>
							</div>
							<div className="button-right">
								<button type="submit" onClick={() => setPaymentMethod("COD")} className="btn-img-raz">
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
