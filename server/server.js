import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

// configure environment
dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// database connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));

app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// root route
app.get("/", (req, res) => {
	res.send(
		"FoodieExpress 🍔🍕🍣 is a food delivery web app that connects users with a wide variety of local restaurants and eateries. It provides a seamless ordering experience, allowing users to browse menus 📜, place orders 🛒, track deliveries in real-time 🚚, and enjoy their favorite meals 🍲 delivered straight to their doorsteps. With features like secure payment processing 💳, personalized recommendations 🌟, and user reviews 📝, FoodieExpress aims to make food delivery convenient, fast, and enjoyable."
	);
});

app.listen(port, () => {
	console.log(`Server started on http://localhost:${port}`);
});
