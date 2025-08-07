const foodModel = require("../models/foodModel");
const fs = require("fs");

// Add food items
const addFood = async (req, res) => {
    try {
        const image_filename = `${req.file.filename}`;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: image_filename,
            category: req.body.category,
        });

        await food.save();

        res.json({
            success: true,
            message: "Yum! 😋 Your delicious dish has been added to the menu!",
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Oops! Couldn't add the food right now. Please try again later! 😞",
        });
    }
};

// Display food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({
            success: true,
            data: foods,
            message: "Here’s your tasty menu! 🍽️ Enjoy exploring!",
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Oops! Couldn't fetch the menu right now. Please try again later! 💔",
        });
    }
};

// Remove food items
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

        if (!food) {
            return res.json({
                success: false,
                message: "Hmm... couldn't find the dish you want to delete. 😕",
            });
        }

        const imagePath = `uploads/${food.image}`;
        if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) console.error("Failed to delete image:", err);
            });
        }

        await foodModel.findByIdAndDelete(req.body.id);

        res.json({
            success: true,
            message: "Poof! ✨ The food item has been removed from the menu.",
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Oh no! 😢 Couldn't remove the food item. Try again in a bit!",
        });
    }
};

// Search food items
const searchFood = async (req, res) => {
    const searchTerm = req.body.searchTerm || "";
    try {
        const foods = await foodModel.find({
            name: { $regex: searchTerm, $options: "i" },
        });

        if (foods.length === 0) {
            return res.json({
                success: false,
                message: "Aww! 🥲 No matching dishes found. Try something else?",
            });
        }

        res.json({
            success: true,
            data: foods,
            message: "Found some delicious matches for you! 🍜🔍",
        });
    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Oops! 🍳 Something went wrong while searching. Try again!",
        });
    }
};

module.exports = { addFood, listFood, removeFood, searchFood };
