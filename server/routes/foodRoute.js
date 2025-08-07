const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const {
	addFood,
	listFood,
	removeFood,
	searchFood,
} = require("../controllers/foodControllers");

const foodRouter = express.Router();

// Ensure uploads folder exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

// Image storage engine
const storage = multer.diskStorage({
	destination: "uploads",
	filename: (_, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/search", searchFood);

module.exports = foodRouter;
