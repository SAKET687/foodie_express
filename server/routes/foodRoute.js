import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { addFood, listFood, removeFood, searchFood } from "../controllers/foodControllers.js";

const foodRouter = express.Router();

// Ensure uploads folder exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir);
}

// image storage engine
const storage = multer.diskStorage({
	destination: "uploads",
	filename: (_, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	}
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/search", searchFood);

export default foodRouter;
