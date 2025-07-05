/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
	const url = "http://localhost:4000";
	const [cartItems, setCartItems] = useState({});
	const [token, setToken] = useState(localStorage.getItem("token") || "");
	const [food_list, setFoodList] = useState([]);
	const [promoCode, setPromoCode] = useState("");
	const [cartAmount, setCartAmount] = useState(0);
	const [finalAmount, setFinalAmount] = useState(0);
	const [checkPromoCode, setCheckPromoCode] = useState(false);

	useEffect(() => {
		async function loadInitialData() {
			await fetchFoodList();
			if (token) {
				await loadCartData(token);
			}
		}
		loadInitialData();
		
	}, [token]);

	const fetchFoodList = async () => {
		const newUrl = `${url}/api/food/list`;
		try {
			const res = await axios.get(newUrl);
			setFoodList(res.data.data);
		} catch (error) {
			console.error("Error fetching food list: ", error);
		}
	};

	const loadCartData = async (token) => {
		const newUrl = `${url}/api/cart/get`;
		try {
			const response = await axios.post(
				newUrl,
				{},
				{ headers: { token } }
			);
			if (response.data.success) {
				setCartItems(response.data.cartData);
			} else {
				console.log("Error loading cart data: ", response.data.message);
			}
		} catch (error) {
			console.error("Error loading cart data: ", error);
		}
	};

	const addToCart = async (itemId) => {
		setCartItems((prev) => ({
			...prev,
			[itemId]: (prev[itemId] || 0) + 1,
		}));

		if (token) {
			try {
				await axios.post(
					`${url}/api/cart/add`,
					{ itemId },
					{ headers: { token } }
				);
				getTotalCartAmount();
			} catch (error) {
				console.error("Error adding item to cart: ", error);
			}
		}
	};

	const removeFromCart = async (itemId) => {
		setCartItems((prev) => ({
			...prev,
			[itemId]: Math.max((prev[itemId] || 1) - 1, 0),
		}));
		getTotalCartAmount();

		if (token) {
			try {
				await axios.post(
					`${url}/api/cart/remove`,
					{ itemId },
					{ headers: { token } }
				);
			} catch (error) {
				console.error("Error removing item from cart: ", error);
			}
		}
	};

	const getTotalCartAmount = () => {
		let totalAmount = 0;
		for (const item in cartItems) {
			if (cartItems[item] > 0) {
				const itemInfo = food_list.find(
					(product) => product._id === item
				);
				if (itemInfo) {
					totalAmount += itemInfo.price * cartItems[item];
				}
			}
		}
		setCartAmount(totalAmount);
		setFinalAmount(cartAmount);
		return totalAmount;
	};

	const contextValue = {
		url,
		token,
		setToken,
		food_list,
		fetchFoodList,
		cartItems,
		setCartItems,
		getTotalCartAmount,
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
