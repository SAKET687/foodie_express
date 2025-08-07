/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
	const url = import.meta.env.VITE_BACKEND_URL;

	// Constants
	const DELIVERY_FEE = 50;
	const COUPON_DISCOUNT = 75;

	// State variables
	const [token, setToken] = useState(localStorage.getItem("token") || "");
	const [food_list, setFoodList] = useState([]);
	const [cartItems, setCartItems] = useState({});
	const [promoCode, setPromoCode] = useState("");
	const [checkPromoCode, setCheckPromoCode] = useState(false);
	const [cartAmount, setCartAmount] = useState(0);
	const [finalAmount, setFinalAmount] = useState(0);

	// Fetch data on initial load
	useEffect(() => {
		async function loadInitialData() {
			await fetchFoodList();
			if (token) {
				await loadCartData(token);
			}
		}
		loadInitialData();
	}, [token]);

	// Fetch food list from backend
	const fetchFoodList = async () => {
		try {
			const res = await axios.get(`${url}/api/food/list`);
			setFoodList(res.data.data);
		} catch (error) {
			console.error("Error fetching food list:", error);
		}
	};

	// Load cart data for authenticated user
	const loadCartData = async (token) => {
		try {
			const res = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
			if (res.data.success) {
				setCartItems(res.data.cartData);
			} else {
				console.error("Error loading cart:", res.data.message);
			}
		} catch (error) {
			console.error("Error loading cart data:", error);
		}
	};

	// Update cart amount whenever cartItems change
	useEffect(() => {
		recalculateCartAmounts();
	}, [cartItems, checkPromoCode]);

	// Recalculate subtotal and final amount
	const recalculateCartAmounts = () => {
		let total = 0;
		for (const itemId in cartItems) {
			const item = food_list.find((f) => f._id === itemId);
			if (item) {
				total += item.price * cartItems[itemId];
			}
		}
		setCartAmount(total);

		const discount = checkPromoCode ? COUPON_DISCOUNT : 0;
		const final = Math.max(0, total + DELIVERY_FEE - discount);
		setFinalAmount(final);
	};

	// Add item to cart
	const addToCart = async (itemId) => {
		setCartItems((prev) => ({
			...prev,
			[itemId]: (prev[itemId] || 0) + 1,
		}));

		if (token) {
			try {
				await axios.post(`${url}/api/cart/add`, { itemId }, { headers: { token } });
			} catch (error) {
				console.error("Error adding to cart:", error);
			}
		}
	};

	// Remove item from cart
	const removeFromCart = async (itemId) => {
		setCartItems((prev) => ({
			...prev,
			[itemId]: Math.max((prev[itemId] || 1) - 1, 0),
		}));

		if (token) {
			try {
				await axios.post(`${url}/api/cart/remove`, { itemId }, { headers: { token } });
			} catch (error) {
				console.error("Error removing from cart:", error);
			}
		}
	};

	// Expose all necessary values to context consumers
	const contextValue = {
		url,
		token,
		setToken,
		food_list,
		fetchFoodList,
		cartItems,
		setCartItems,
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
	};

	return (
		<StoreContext.Provider value={contextValue}>
			{props.children}
		</StoreContext.Provider>
	);
};

export default StoreContextProvider;
