import foodModel from "../models/foodModel.js";
import fs from "fs";

// add food items
const addFood = async (request, response) => {

    let image_filename = `${request.file.filename}`;

    const food = new foodModel({
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
        image: image_filename,
        category: request.body.category,
    })

    try {
        await food.save();
        response.json({ success: true, message: "Food Added" })
    } catch (error) {
        console.error(error);
        response.json({ success: false, message: "Food not Added" })
    }
}


// display food list
const listFood = async (request, response) => {
    try {
        const foods = await foodModel.find({});
        response.json({ success: true, data: foods, message: "Menu details loaded successfully." })
    }
    catch (error) {
        console.error(error);
        response.json({ success: false, message: "Error to fetch menu details. Please try again." })
    }
}


// remove food items
const removeFood = async (request, response) => {
    try {
        const foods = await foodModel.findById(request.body.id);
        fs.unlink(`uploads/${foods.image}`, () => { })
        await foodModel.findByIdAndDelete(request.body.id);
        response.json({ success: true, message: "Food Removed" })
    } catch (error) {
        console.error(error)
        response.json({ success: false, message: "Food not Removed" })
    }
}

//search food items
const searchFood = async (request, response) => {
    const searchTerm = request.body.searchTerm || "";
    try {
        const foods = await foodModel.find({
            name: { $regex: searchTerm, $options: "i" }
        });
        if (foods.length === 0) {
            return response.json({ success: false, message: "No food items found." });
        }
        response.json({ success: true, data: foods, message: "Food items found." });
    } catch (error) {
        console.error(error);
        response.json({ success: false, message: "Error while searching for food items." });
    }
}

export { addFood, listFood, removeFood, searchFood };