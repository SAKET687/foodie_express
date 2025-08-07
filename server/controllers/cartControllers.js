
const userModel = require("../models/userModel");

// Add food items to user cart
const addToCart = async (req, res) => {
	try {
		const userData = await userModel.findById(req.body.userId);
		if (!userData) {
			return res.json({
				success: false,
				message: "Oops! We couldn't find your account. 😢",
			});
		}

		const cartData = userData.cartData || {};

		if (!cartData[req.body.itemId]) {
			cartData[req.body.itemId] = 1;
		} else {
			cartData[req.body.itemId] += 1;
		}

		await userModel.findByIdAndUpdate(userData._id, { cartData });

		res.json({
			success: true,
			message: "Yay! 🎉 Your item was added to the cart successfully!",
		});
	} catch (error) {
		console.error(error);
		res.json({
			success: false,
			message: "Oh no! 😕 Something went wrong while adding your item. Try again soon!",
		});
	}
};

// Remove food items from user cart
const removeFromCart = async (req, res) => {
	try {
		const userData = await userModel.findById(req.body.userId);
		if (!userData) {
			return res.json({
				success: false,
				message: "Oops! Can't find your user details. 🧐",
			});
		}

		const cartData = userData.cartData || {};

		if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
			cartData[req.body.itemId] -= 1;

			// Optional: Remove key if value becomes 0
			if (cartData[req.body.itemId] === 0) {
				delete cartData[req.body.itemId];
			}
		}

		await userModel.findByIdAndUpdate(userData._id, { cartData });

		res.json({
			success: true,
			message: "Poof! ✨ Your item was removed from the cart!",
		});
	} catch (error) {
		console.error(error);
		res.json({
			success: false,
			message: "Oopsie! 😬 Couldn't remove the item. Please try again later.",
		});
	}
};

// Get food items from user cart
const getCart = async (req, res) => {
	try {
		const userData = await userModel.findById(req.body.userId);
		if (!userData) {
			return res.json({
				success: false,
				message: "Sorry, we couldn't find your account. 🚫",
			});
		}

		const cartData = userData.cartData || {};

		res.json({
			success: true,
			cartData,
			message: "Here's your cart! 🍽️ Ready to checkout when you are!",
		});
	} catch (error) {
		console.error(error);
		res.json({
			success: false,
			message: "Hmm... 😔 We couldn't fetch your cart right now. Please try again soon.",
		});
	}
};

module.exports = { addToCart, removeFromCart, getCart };

