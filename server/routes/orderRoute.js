const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
	adminOrders,
	orderUpdate,
	placeOrderUsingCOD,
	placeOrderUsingRazorpay,
	placeOrderUsingStripe,
	userOrders,
	verifyOrder,
} = require("../controllers/orderController");

const orderRouter = express.Router();

orderRouter.post("/place-using-razorpay", authMiddleware, placeOrderUsingRazorpay);
orderRouter.post("/place-using-stripe", authMiddleware, placeOrderUsingStripe);
orderRouter.post("/place-using-cod", authMiddleware, placeOrderUsingCOD);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/get", authMiddleware, userOrders);
orderRouter.post("/orders", adminOrders);
orderRouter.post("/update", orderUpdate);

module.exports = orderRouter;
