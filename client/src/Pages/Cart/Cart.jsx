/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { assets } from "../../../src/assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
	const DELIVERY_FEE = 50;
	const COUPON_DISCOUNT = 75;

	const {
		url,
		token,
		cartItems,
		food_list,
		addToCart,
		removeFromCart,
		cartAmount,
		setCartAmount,
		finalAmount,
		setFinalAmount,
		promoCode,
		setPromoCode,
		checkPromoCode,
		setCheckPromoCode,
	} = useContext(StoreContext);

	const navigate = useNavigate();

	// Recalculate cart amount when cartItems change
	useEffect(() => {
		let total = 0;
		for (const id in cartItems) {
			const item = food_list.find((f) => f._id === id);
			if (item) {
				total += item.price * cartItems[id];
			}
		}
		setCartAmount(total);
	}, [cartItems, food_list]);

	// Recalculate final amount
	useEffect(() => {
		const discount = checkPromoCode ? COUPON_DISCOUNT : 0;
		const total = cartAmount + DELIVERY_FEE - discount;
		setFinalAmount(Math.max(0, total));
	}, [cartAmount, checkPromoCode]);

	const applyPromoCode = () => {
		if (promoCode.trim().toLowerCase() === "greatstack") {
			setCheckPromoCode(true);
		} else {
			setCheckPromoCode(false);
		}
	};

	return (
		<>
			{cartAmount === 0 ? (
				<div className="no-item">
					🛒 Your Cart is Empty. 🍔 Add some delicious food and come again. 🍕
				</div>
			) : (
				<div className="cart">
					<div className="cart-items">
						<div className="cart-items-title">
							<p>Items</p>
							<p>Title</p>
							<p>Price</p>
							<p>Quantity</p>
							<p>Total</p>
							<p>Modify</p>
						</div>
						<br />
						<hr />
						{food_list.map((item, index) =>
							cartItems[item._id] > 0 ? (
								<div
									key={index}
									className="cart-items-title cart-items-item"
								>
									<img
										src={url + "/images/" + item.image}
										alt={item.name}
										className="item-image-prop"
									/>
									<p>{item.name}</p>
									<p>₹{item.price}</p>
									<p>{cartItems[item._id]}</p>
									<p>₹{item.price * cartItems[item._id]}</p>

									<div className="cross">
										<div className="modify">
											<img
												onClick={() => addToCart(item._id)}
												src={assets.add_icon_green}
												alt="Add"
											/>
											<img
												onClick={() => removeFromCart(item._id)}
												src={assets.remove_icon_red}
												alt="Remove"
											/>
										</div>
									</div>
								</div>
							) : null
						)}
					</div>

					<div className="cart-bottom">
						<div className="cart-promo-code">
							<p>Have a promo code? Enter it here👇</p>
							<div className="cart-promo-code-input">
								<input
									type="text"
									value={promoCode}
									onChange={(e) => setPromoCode(e.target.value)}
									placeholder="Enter your promo code"
								/>
								<button onClick={applyPromoCode}>Submit</button>
							</div>
							<br />
							<strong>
								!! Coupons are not applicable for Stripe Payment Gateway !!
							</strong>
						</div>

						<div className="cart-total">
							<h2>Cart Total:</h2>
							<div className="unnammed">
								<div className="cart-total-details">
									<p>Subtotal</p>
									<p>₹{cartAmount}</p>
								</div>
								<hr />
								<div className="cart-total-details">
									<p>Delivery Fee</p>
									<p>₹{DELIVERY_FEE}</p>
								</div>
								<hr />
								{checkPromoCode && (
									<>
										<div className="cart-total-details coupon">
											<p>Coupon Saving</p>
											<p>- ₹{COUPON_DISCOUNT}</p>
										</div>
										<hr />
									</>
								)}
								<div className="cart-total-details">
									<b>Total</b>
									<b>₹{finalAmount}</b>
								</div>
							</div>
							<div className="button-right">
								<button onClick={() => navigate(`/order-place`)}>
									Proceed to Checkout
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Cart;
