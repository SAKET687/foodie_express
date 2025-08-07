const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Hooray! Successfully connected to the database!");
	} catch (error) {
		console.error("Oh no! Database connection failed:", error.message);
	}
};

module.exports = { connectDB };
