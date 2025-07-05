import express from "express";
import authMiddleware from "../middleware/auth.js";
import { adminOrders, orderUpdate, placeOrderUsingCOD, placeOrderUsingRazorpay, placeOrderUsingStripe, userOrders, verifyOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/place-using-razorpay", authMiddleware, placeOrderUsingRazorpay);
orderRouter.post("/place-using-stripe", authMiddleware, placeOrderUsingStripe);
orderRouter.post("/place-using-cod", authMiddleware, placeOrderUsingCOD);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/get", authMiddleware, userOrders);
orderRouter.post("/orders", adminOrders);
orderRouter.post("/update", orderUpdate);


export default orderRouter;