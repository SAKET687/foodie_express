// /* eslint-disable no-unused-vars */
// import React, { useContext, useState } from "react";
// import "./Cart.css";
// import { assets } from "../../../src/assets/assets";
// import { StoreContext } from "../../Context/StoreContext";
// import { useNavigate } from "react-router-dom";

// const Cart = () => {
// 	const {
// 		url,
// 		token,
// 		cartItems,
// 		food_list,
// 		addToCart,
// 		removeFromCart,
// 		cartAmount,
// 		setCartAmount,
// 		finalAmount,
// 		setFinalAmount,
// 		promoCode,
// 		setPromoCode,
// 		checkPromoCode,
// 		setCheckPromoCode,
// 	} = useContext(StoreContext);
// 	const navigate = useNavigate();

// 	const promoCodeFunction = () => {
// 		if (promoCode === "GreatStack") {
// 			setCheckPromoCode(true);
// 			setFinalAmount(cartAmount - 25);
// 		} else {
// 			setCheckPromoCode(false);
// 			setFinalAmount(cartAmount + 50);
// 		}
// 	};

// 	return (
// 		<>
// 			{cartAmount === 0 ? (
// 				<div className="no-item">
// 					🛒 Your Cart is Empty. 🍔 Add some delicious food and come
// 					again. 🍕
// 				</div>
// 			) : (
// 				<div className="cart">
// 					<div className="cart-items">
// 						<div className="cart-items-title">
// 							<p>Items</p>
// 							<p>Title</p>
// 							<p>Price</p>
// 							<p>Quantity</p>
// 							<p>Total</p>
// 							<p>Modify</p>
// 						</div>
// 						<br />
// 						<hr />
// 						{food_list.map((item, index) =>
// 							cartItems[item._id] > 0 ? (
// 								<div
// 									key={index}
// 									className="cart-items-title cart-items-item"
// 								>
// 									<img
// 										src={url + "/images/" + item.image}
// 										alt="img icon illustration"
// 										className="item-image-prop"
// 									/>
// 									<p>{item.name}</p>
// 									<p>₹{item.price}</p>
// 									<p>{cartItems[item._id]}</p>
// 									<p>₹{item.price * cartItems[item._id]}</p>
// 									<div className="cross">
// 										<div className="modify">
// 											<img
// 												onClick={() => {
// 													addToCart(item._id);
// 													promoCodeFunction();
// 												}}
// 												src={assets.add_icon_green}
// 												alt="add"
// 											/>
// 											<img
// 												onClick={() => {
// 													removeFromCart(item._id);
// 													promoCodeFunction();
// 												}}
// 												src={assets.remove_icon_red}
// 												alt="remove"
// 											/>
// 										</div>
// 									</div>
// 								</div>
// 							) : null
// 						)}
// 					</div>
// 					<div className="cart-bottom">
// 						<div className="cart-promo-code">
// 							<div className="unnamed-2">
// 								<p>Have a promo code? Enter it here👇 </p>
// 								<div className="cart-promo-code-input">
// 									<input
// 										onChange={(e) => {
// 											setPromoCode(e.target.value);
// 										}}
// 										type="text"
// 										value={promoCode}
// 										id="promo-code"
// 										placeholder="Enter your promo code"
// 									/>
// 									<button onClick={promoCodeFunction}>
// 										Submit
// 									</button>
// 								</div>
// 								<br />
// 								<strong>
// 									!! Coupons are not applicable for Stripe
// 									Payment Gateway !!
// 								</strong>
// 							</div>
// 						</div>
// 						<div className="cart-total">
// 							<h2>Cart Total:</h2>
// 							<div className="unnammed">
// 								<div className="cart-total-details">
// 									<p>Subtotal</p>
// 									<p>₹{cartAmount}</p>
// 								</div>{" "}
// 								<hr />
// 								<div className="cart-total-details">
// 									<p>Delivery Fee</p>
// 									<p>₹{50}</p>
// 								</div>{" "}
// 								<hr />
// 								{checkPromoCode === true ? (
// 									<>
// 										<div className="cart-total-details coupon">
// 											<p>Coupon Saving</p>
// 											<p> - ₹{75}</p>
// 										</div>
// 										<hr />
// 									</>
// 								) : (
// 									<></>
// 								)}
// 								<div className="cart-total-details">
// 									<b>Total</b>
// 									<b>₹{finalAmount}</b>
// 								</div>
// 							</div>
// 							<div className="button-right">
// 								<button
// 									onClick={() => {
// 										navigate(`/${token}/order-place`);
// 									}}
// 								>
// 									Proceed to Checkout
// 								</button>{" "}
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			)}
// 		</>
// 	);
// };

// export default Cart;

/* eslint-disable no-unused-vars */
import  { useContext, useState, useEffect } from "react";
import { assets } from "../../../src/assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
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

	useEffect(() => {
		const newFinalAmount = checkPromoCode
			? cartAmount - 25
			: cartAmount + 50;
		setFinalAmount(newFinalAmount);
	}, [cartAmount, checkPromoCode, setFinalAmount]);

	const applyPromoCode = () => {
		if (promoCode === "GreatStack") {
			setCheckPromoCode(true);
		} else {
			setCheckPromoCode(false);
		}
	};

	return (
		<>
			{cartAmount === 0 ? (
				<div className="no-item">
					🛒 Your Cart is Empty. 🍔 Add some delicious food and come
					again. 🍕
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
										alt="img icon illustration"
										className="item-image-prop"
									/>
									<p>{item.name}</p>
									<p>₹{item.price}</p>
									<p>{cartItems[item._id]}</p>
									<p>₹{item.price * cartItems[item._id]}</p>
									<div className="cross">
										<div className="modify">
											<img
												onClick={() => {
													addToCart(item._id);
												}}
												src={assets.add_icon_green}
												alt="add"
											/>
											<img
												onClick={() => {
													removeFromCart(item._id);
												}}
												src={assets.remove_icon_red}
												alt="remove"
											/>
										</div>
									</div>
								</div>
							) : null
						)}
					</div>
					<div className="cart-bottom">
						<div className="cart-promo-code">
							<div className="unnamed-2">
								<p>Have a promo code? Enter it here👇 </p>
								<div className="cart-promo-code-input">
									<input
										onChange={(e) => {
											setPromoCode(e.target.value);
										}}
										type="text"
										value={promoCode}
										id="promo-code"
										placeholder="Enter your promo code"
									/>
									<button onClick={applyPromoCode}>
										Submit
									</button>
								</div>
								<br />
								<strong>
									!! Coupons are not applicable for Stripe
									Payment Gateway !!
								</strong>
							</div>
						</div>
						<div className="cart-total">
							<h2>Cart Total:</h2>
							<div className="unnammed">
								<div className="cart-total-details">
									<p>Subtotal</p>
									<p>₹{cartAmount}</p>
								</div>{" "}
								<hr />
								<div className="cart-total-details">
									<p>Delivery Fee</p>
									<p>₹{50}</p>
								</div>{" "}
								<hr />
								{checkPromoCode ? (
									<>
										<div className="cart-total-details coupon">
											<p>Coupon Saving</p>
											<p> - ₹{75}</p>
										</div>
										<hr />
									</>
								) : null}
								<div className="cart-total-details">
									<b>Total</b>
									<b>₹{finalAmount}</b>
								</div>
							</div>
							<div className="button-right">
								<button
									onClick={() => {
										navigate(`/${token}/order-place`);
									}}
								>
									Proceed to Checkout
								</button>{" "}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default Cart;
