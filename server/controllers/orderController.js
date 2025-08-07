const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const Razorpay = require("razorpay");


const frontendUrl = process.env.FRONTEND_URL;

// Place order using Razorpay
const placeOrderUsingRazorpay = async (req, res) => {

	const razorpayInstance = new Razorpay({
		key_id: process.env.RAZORPAY_KEY_ID,
		key_secret: process.env.RAZORPAY_SECRET,
	});

	try {
		const newOrder = new orderModel({
			userId: req.body.userId,
			items: req.body.items,
			amount: req.body.amount,
			address: req.body.address,
		});

		const { firstName, lastName, email, phone } = req.body.address;
		const custName = `${firstName} ${lastName}`;

		await newOrder.save();
		await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

		const totalAmount = req.body.amount * 100;
		const razorpayOrder = await razorpayInstance.orders.create({
			amount: totalAmount,
			currency: "INR",
			receipt: `${newOrder._id}`,
			payment_capture: 1,
		});

		res.json({
			success: true,
			orderId: newOrder._id,
			amount: totalAmount,
			currency: "INR",
			razorpayOrderId: razorpayOrder.id,
			key_id: razorpayInstance.key_id,
			name: "Foodie Express",
			description: "A delicious journey awaits 🍱✨",
			prefill: {
				name: custName,
				email: email,
				contact: phone,
			},
			notes: {
				address: "Customer delivery location",
			},
		});
	} catch (error) {
		console.error("Error processing Razorpay payment:", error);
		res.status(500).json({
			success: false,
			message: "Oops! 🍔 Something went wrong while placing your order. Please try again!",
		});
	}
};

// Place order using Stripe
const placeOrderUsingStripe = async (req, res) => {

	const Stripe = require("stripe");
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

	try {
		const newOrder = new orderModel({
			userId: req.body.userId,
			items: req.body.items,
			amount: req.body.amount,
			address: req.body.address,
		});

		await newOrder.save();
		await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

		const line_items = req.body.items.map((item) => ({
			price_data: {
				currency: "inr",
				product_data: { name: item.name },
				unit_amount: item.price * 100,
			},
			quantity: item.quantity,
		}));

		// Delivery Charges
		line_items.push({
			price_data: {
				currency: "inr",
				product_data: { name: "Delivery Charges" },
				unit_amount: 50 * 100,
			},
			quantity: 1,
		});

		const session = await stripe.checkout.sessions.create({
			line_items,
			mode: "payment",
			success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
			cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
		});

		res.json({
			success: true,
			session_url: session.url,
			message: "Your payment session is ready! 🚀 Get ready to eat!",
		});
	} catch (error) {
		console.error("Stripe payment failed:", error);
		res.json({
			success: false,
			message: "Yikes! 🥴 Couldn't start your payment. Try again later.",
		});
	}
};

// Place order using COD
const placeOrderUsingCOD = async (req, res) => {
	const { token } = req.headers;

	try {
		const newOrder = new orderModel({
			userId: req.body.userId,
			items: req.body.items,
			amount: req.body.amount,
			address: req.body.address,
			payment_type: "Cash on Delivery",
		});

		await newOrder.save();
		await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

		const sessionUrl = `${frontendUrl}/orders`;

		res.json({
			success: true,
			session_url: sessionUrl,
			message: "Order placed with COD! 🛵 It’s on the way with love 💖",
		});
	} catch (error) {
		console.error("COD order error:", error);
		res.json({
			success: false,
			message: "Oops! 📦 Couldn't place your COD order. Try again, please.",
		});
	}
};

// Verify order
const verifyOrder = async (req, res) => {
	const { orderId, success } = req.body;
	try {
		if (success === "true") {
			await orderModel.findByIdAndUpdate(orderId, { payment: true });
			res.json({
				success: true,
				message: "Yay! 🎉 Payment successful and order confirmed!",
			});
		} else {
			await orderModel.findByIdAndDelete(orderId);
			res.json({
				success: false,
				message: "Oh no! 😢 Payment failed. Your order was canceled.",
			});
		}
	} catch (error) {
		console.error("Order verification error:", error);
		res.json({
			success: false,
			message: "Something went wrong while verifying your order. Please try again. 🙏",
		});
	}
};

// Get user orders
const userOrders = async (req, res) => {
	try {
		const orders = await orderModel.find({ userId: req.body.userId });
		res.json({
			success: true,
			data: orders,
			message: "Here's your tasty order history! 🧾🍕",
		});
	} catch (error) {
		console.error("Fetching user orders failed:", error);
		res.json({
			success: false,
			message: "Hmm... we couldn't fetch your orders right now. 😓",
		});
	}
};

// Get admin orders
const adminOrders = async (req, res) => {
	try {
		const orders = await orderModel.find({});
		res.json({
			success: true,
			data: orders,
			message: "All orders loaded successfully! 📦 Admin dashboard updated.",
		});
	} catch (error) {
		console.error("Fetching admin orders failed:", error);
		res.json({
			success: false,
			message: "Oops! Couldn't load all orders. Please try again. 🛠️",
		});
	}
};

// Update order status
const orderUpdate = async (req, res) => {
	try {
		await orderModel.findByIdAndUpdate(req.body.orderId, {
			status: req.body.order_status,
		});
		res.json({
			success: true,
			message: "Order status updated! 🚚 Keep rollin'!",
		});
	} catch (error) {
		console.error("Order status update error:", error);
		res.json({
			success: false,
			message: "Uh oh! 😟 Couldn’t update the order status.",
		});
	}
};

// Exporting all functions
module.exports = {
	placeOrderUsingRazorpay,
	placeOrderUsingStripe,
	placeOrderUsingCOD,
	verifyOrder,
	userOrders,
	adminOrders,
	orderUpdate,
};
