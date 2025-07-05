import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

// -----------------------------------------------------------------------
// for placing user's order from frontend using razorpay

const razorpayInstance = new Razorpay({
	key_id: "rzp_test_ivr3iYTeVoiFCn",
	key_secret: "Bv0ULdI3fmXHbpp9Z8dqLJrW",
});

const placeOrderUsingRazorpay = async (request, response) => {
	try {
		const newOrder = new orderModel({
			userId: request.body.userId,
			items: request.body.items,
			amount: request.body.amount,
			address: request.body.address,
		});

		const custName =
			request.body.address.firstName + request.body.address.lastName;
		const custEmail = request.body.address.email;
		const custNumber = request.body.address.phone;

		await newOrder.save();
		const totalAmount = request.body.amount * 100;
		const razorpayOrder = razorpayInstance.orders.create({
			amount: totalAmount,
			currency: "INR",
			receipt: `${newOrder._id}`,
			payment_capture: 1,
		});

		response.json({
			success: true,
			orderId: newOrder._id,
			amount: totalAmount,
			currency: "INR",
			razorpayOrderId: razorpayOrder.id,
			key_id: "rzp_test_ivr3iYTeVoiFCn",
			name: "Foodie Express",
			description: "Order Description",
			prefill: {
				name: custName,
				email: custEmail,
				contact: custNumber,
			},
			notes: {
				address: "Customer Address",
			},
		});
	} catch (error) {
		console.error("Error processing payment:", error);
		response
			.status(500)
			.json({ success: false, message: "Payment not processed" });
	}
};

// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// for placing user's order from frontend using stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrderUsingStripe = async (request, response) => {
	const frontendUrl = "http://localhost:5174";

	try {
		const newOrder = new orderModel({
			userId: request.body.userId,
			items: request.body.items,
			amount: request.body.amount,
			address: request.body.address,
		});
		await newOrder.save();
		await userModel.findByIdAndUpdate(request.body.userId, {
			cartData: {},
		});
		const line_items = request.body.items.map((item) => ({
			price_data: {
				currency: "inr",
				product_data: {
					name: item.name,
				},
				unit_amount: item.price * 100,
			},
			quantity: item.quantity,
		}));

		line_items.push({
			price_data: {
				currency: "inr",
				product_data: {
					name: "Delivery Charges",
				},
				unit_amount: 50 * 100,
			},
			quantity: 1,
		});

		const { promo_code } = request.headers;

		// if (promo_code) {

		// }

		const session = await stripe.checkout.sessions.create({
			line_items: line_items,
			mode: "payment",
			success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
			cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
		});
		response.json({
			success: true,
			session_url: session.url,
			message: "Payment Processed,",
		});
	} catch (error) {
		console.log(error);
		console.log("Payment execution failed.");
		response.json({ success: false, message: error });
	}
};

// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// for placing user's order from frontend using cod

const placeOrderUsingCOD = async (request, response) => {
	const frontendUrl = "http://localhost:5174";
	const { token } = request.headers;

	try {
		const newOrder = new orderModel({
			userId: request.body.userId,
			items: request.body.items,
			amount: request.body.amount,
			address: request.body.address,
		});
		await newOrder.save();
		await userModel.findByIdAndUpdate(request.body.userId, {
			cartData: {},
		});
		await orderModel.findByIdAndUpdate(newOrder._id, {
			payment_type: "Cash on Delivery",
		});
		const sessionUrl = `${frontendUrl}/${token}/orders`;
		response.json({
			success: true,
			session_url: sessionUrl,
			message: "Order processed successfully.",
		});
	} catch (error) {
		console.error("Order execution failed:", error);
		response.json({
			success: false,
			message: "Order processing failed. Please try again later.",
		});
	}
};

// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// verify order after payment
const verifyOrder = async (request, response) => {
	const { orderId, success } = request.body;
	try {
		if (success === "true") {
			await orderModel.findByIdAndUpdate(orderId, { payment: true });
			response.json({ success: true, message: "Amount Paid" });
		} else {
			await orderModel.findByIdAndDelete(orderId);
			response.json({ success: false, message: "Amount isn't Paid" });
		}
	} catch (error) {
		console.log(error);
		response.json({ success: false, message: error });
	}
};

// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// disply order list to users
const userOrders = async (request, response) => {
	try {
		const orders = await orderModel.find({ userId: request.body.userId });
		response.json({
			success: true,
			data: orders,
			message: "Orders fetched successfully.",
		});
	} catch (error) {
		console.log("Error to fetch order details.");
		console.log(error);
		response.json({ success: false, message: error });
	}
};

// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// display orders to admin
const adminOrders = async (request, response) => {
	try {
		const orders = await orderModel.find({});
		response.json({
			success: true,
			data: orders,
			message: "Orders fetched successfully.",
		});
	} catch (error) {
		console.log("Error to fetch order details.");
		console.log(error);
		response.json({ success: false, message: error });
	}
};

// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// update order status by admin dashboard
const orderUpdate = async (request, response) => {
	try {
		await orderModel.findByIdAndUpdate(request.body.orderId, {
			status: request.body.order_status,
		});
		response.json({
			success: true,
			message: "Order status updated successfully.",
		});
	} catch (error) {
		console.log(error);
		response.json({
			success: false,
			message: error,
		});
	}
};

// -----------------------------------------------------------------------

export {
	placeOrderUsingRazorpay,
	placeOrderUsingStripe,
	placeOrderUsingCOD,
	verifyOrder,
	userOrders,
	adminOrders,
	orderUpdate,
};
