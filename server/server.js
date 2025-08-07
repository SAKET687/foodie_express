const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const foodRouter = require("./routes/foodRoute");
const userRouter = require("./routes/userRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");

// configure environment
dotenv.config();

// app config
const app = express();
const port = process.env.PORT;

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
